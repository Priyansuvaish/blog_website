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

// Upload file and return S3 key
export const uploadFileToS3 = async (
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

  // Return the S3 key instead of presigned URL
  return fileName
}

// Delete file from S3
export const deleteFileFromS3 = async (key: string): Promise<void> => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(deleteCommand)
} 