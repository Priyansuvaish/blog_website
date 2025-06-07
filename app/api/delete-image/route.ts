import { NextRequest, NextResponse } from 'next/server'
import { deleteFileFromS3, extractKeyFromPresignedUrl, isOurPresignedUrl } from '@/lib/s3'

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Validate that this is our presigned URL
    if (!isOurPresignedUrl(imageUrl)) {
      return NextResponse.json(
        { error: 'Invalid image URL' },
        { status: 400 }
      )
    }

    // Extract the key from the presigned URL
    const fileName = extractKeyFromPresignedUrl(imageUrl)

    if (!fileName || !fileName.includes('blog-images/')) {
      return NextResponse.json(
        { error: 'Invalid image URL or not a blog image' },
        { status: 400 }
      )
    }

    // Delete from S3
    await deleteFileFromS3(fileName)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
} 