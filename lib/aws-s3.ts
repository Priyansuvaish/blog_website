import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

// Function to generate a unique key for S3
export const generateUniqueKey = (file: File): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  return `blog/title/${timestamp}_image.${extension}`;
};

// Function to upload file to S3
export const uploadToS3 = async (file: File, key: string): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS bucket name is not configured');
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
      CacheControl: 'max-age=31536000',
    });

    await s3Client.send(command);

    // Return the URL of the uploaded file
    const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-2';
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

// Function to generate a presigned URL for S3 object
export const generatePresignedUrl = async (key: string): Promise<string> => {
  try {
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
    if (!bucketName) {
      throw new Error('AWS bucket name is not configured');
    }

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Generate presigned URL that expires in 1 hour
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
}; 