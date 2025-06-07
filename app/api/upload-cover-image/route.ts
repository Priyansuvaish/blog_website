import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { uploadFileAndGetPresignedUrl } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('upload') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB for cover images)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Generate unique filename for cover images
    const fileExtension = file.name.split('.').pop()
    const fileName = `cover-images/${uuidv4()}.${fileExtension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload file and get presigned URL
    const presignedUrl = await uploadFileAndGetPresignedUrl(
      buffer,
      fileName,
      file.type
    )

    return NextResponse.json({
      url: presignedUrl,
      uploaded: 1,
      type: 'cover'
    })

  } catch (error) {
    console.error('Error uploading cover image:', error)
    return NextResponse.json(
      { error: 'Failed to upload cover image' },
      { status: 500 }
    )
  }
} 