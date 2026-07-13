import { NextResponse } from 'next/server'
import { generatePresignedUrl } from '@/lib/s3'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 })
  }

  try {
    const url = await generatePresignedUrl(key)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json({ error: 'Failed to generate image URL' }, { status: 500 })
  }
}
