import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import { generatePresignedUrl, extractKeyFromPresignedUrl, isOurPresignedUrl } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json()

    await connectDB()

    // Get the post
    const post = postId 
      ? await Post.findById(postId)
      : await Post.find({}) // Refresh all posts if no specific ID

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const posts = Array.isArray(post) ? post : [post]
    let updatedCount = 0

    for (const singlePost of posts) {
      let content = singlePost.content
      let hasChanges = false

      // Find all image URLs in content
      const regex = /<img[^>]+src="([^">]+)"/gi
      let match

      while ((match = regex.exec(content)) !== null) {
        const imageUrl = match[1]

        if (isOurPresignedUrl(imageUrl)) {
          try {
            // Extract key from the presigned URL
            const key = extractKeyFromPresignedUrl(imageUrl)
            
            if (key) {
              // Generate new presigned URL
              const newPresignedUrl = await generatePresignedUrl(key)
              
              // Replace the old URL with new one
              content = content.replace(imageUrl, newPresignedUrl)
              hasChanges = true
            }
          } catch (error) {
            console.error('Error refreshing URL for image:', imageUrl, error)
          }
        }
      }

      // Update post if there were changes
      if (hasChanges) {
        singlePost.content = content
        await singlePost.save()
        updatedCount++
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Refreshed URLs in ${updatedCount} posts`
    })

  } catch (error) {
    console.error('Error refreshing image URLs:', error)
    return NextResponse.json(
      { error: 'Failed to refresh image URLs' },
      { status: 500 }
    )
  }
} 