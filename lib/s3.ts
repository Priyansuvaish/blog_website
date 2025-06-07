import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Configure AWS S3 client
export const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
})

export const BUCKET_NAME = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || 'propertydetail'

// Generate presigned URL for viewing images (7 days expiration - max allowed)
export const generatePresignedUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  // Generate presigned URL with 7 days expiration (max allowed by AWS)
  return await getSignedUrl(s3Client, command, { expiresIn: 604800 }) // 7 days in seconds
}

// Upload file and return presigned URL
export const uploadFileAndGetPresignedUrl = async (
  file: Buffer,
  fileName: string,
  contentType: string
): Promise<string> => {
  // Upload to S3
  const uploadCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(uploadCommand)

  // Generate presigned URL for viewing
  return await generatePresignedUrl(fileName)
}

// Delete file from S3
export const deleteFileFromS3 = async (key: string): Promise<void> => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(deleteCommand)
}

// Extract S3 key from presigned URL
export const extractKeyFromPresignedUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    // Remove leading slash and decode
    return decodeURIComponent(pathname.substring(1))
  } catch (error) {
    console.error('Error extracting key from URL:', error)
    return null
  }
}

// Check if URL is our presigned URL (for blog images or cover images)
export const isOurPresignedUrl = (url: string): boolean => {
  return url.includes(BUCKET_NAME) && url.includes('amazonaws.com') && 
         (url.includes('blog-images/') || url.includes('cover-images/'))
} 