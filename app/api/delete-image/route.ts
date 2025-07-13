import { NextRequest, NextResponse } from 'next/server'
import { deleteFileFromS3 } from '@/lib/s3'

export async function DELETE(request: NextRequest) {
  try {
    const { s3Key } = await request.json()

    if (!s3Key) {
      return NextResponse.json(
        { error: 'S3 key is required' },
        { status: 400 }
      )
    }

    // Validate that this is a valid S3 key for our images
    if (!s3Key.startsWith('blog-images/') && !s3Key.startsWith('cover-images/')) {
      return NextResponse.json(
        { error: 'Invalid S3 key' },
        { status: 400 }
      )
    }

    // Delete from S3
    await deleteFileFromS3(s3Key)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
} 