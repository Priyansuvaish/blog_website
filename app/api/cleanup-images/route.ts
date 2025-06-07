import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import { deleteFileFromS3, extractKeyFromPresignedUrl, isOurPresignedUrl, BUCKET_NAME } from '@/lib/s3'

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get all images from S3 (both blog and cover images)
    const listBlogImages = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'blog-images/'
    })
    const listCoverImages = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'cover-images/'
    })

    const [blogObjects, coverObjects] = await Promise.all([
      s3Client.send(listBlogImages),
      s3Client.send(listCoverImages)
    ])

    const blogImageKeys = blogObjects.Contents?.map(obj => obj.Key).filter(key => key != null) as string[] || []
    const coverImageKeys = coverObjects.Contents?.map(obj => obj.Key).filter(key => key != null) as string[] || []
    const allImageKeys = [...blogImageKeys, ...coverImageKeys]

    // Get all posts from database
    const posts = await Post.find({}, 'content coverImage').lean()

    // Extract all image keys used in posts (from presigned URLs)
    const usedImages = new Set<string>()
    const regex = /<img[^>]+src="([^">]+)"/gi

    posts.forEach(post => {
      // Check content images
      let match
      while ((match = regex.exec(post.content)) !== null) {
        if (isOurPresignedUrl(match[1])) {
          const key = extractKeyFromPresignedUrl(match[1])
          if (key) {
            usedImages.add(key)
          }
        }
      }

      // Check cover image
      if (post.coverImage && isOurPresignedUrl(post.coverImage)) {
        const key = extractKeyFromPresignedUrl(post.coverImage)
        if (key) {
          usedImages.add(key)
        }
      }
    })

    // Find orphaned images
    const orphanedImages = allImageKeys.filter(key => !usedImages.has(key))

    // Delete orphaned images
    let deletedCount = 0
    for (const imageKey of orphanedImages) {
      try {
        await deleteFileFromS3(imageKey)
        deletedCount++
        console.log('Deleted orphaned image:', imageKey)
      } catch (error) {
        console.error('Failed to delete orphaned image:', imageKey, error)
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      orphanedImages: orphanedImages.length,
      blogImages: blogImageKeys.length,
      coverImages: coverImageKeys.length,
      message: `Cleaned up ${deletedCount} orphaned images`
    })

  } catch (error) {
    console.error('Error cleaning up images:', error)
    return NextResponse.json(
      { error: 'Failed to cleanup images' },
      { status: 500 }
    )
  }
} 