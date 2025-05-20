import AWS from 'aws-sdk';

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

// Types
interface UploadParams {
  file: File;
  key: string;
}

interface PresignedUrlParams {
  key: string;
  expiresIn?: number;
}

/**
 * Upload a file to AWS S3
 * @param file - The file to upload
 * @param key - The key (path) where the file will be stored in S3
 * @returns The URL of the uploaded file
 */
export const uploadToS3 = async ({ file, key }: UploadParams): Promise<string> => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read', // Make the file publicly accessible
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Generate a presigned URL for accessing a file
 * @param key - The key (path) of the file in S3
 * @param expiresIn - Time in seconds until the URL expires (default: 60)
 * @returns The presigned URL
 */
export const generatePresignedUrl = ({ key, expiresIn = 60 }: PresignedUrlParams): string => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
    Key: key,
    Expires: expiresIn,
  };

  try {
    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate presigned URL');
  }
};

/**
 * Open a file in a new tab using its presigned URL
 * @param url - The presigned URL of the file
 */
export const viewFileFromPresignedUrl = (url: string): void => {
  window.open(url, '_blank');
};

/**
 * Generate a unique key for S3 upload
 * @param file - The file to generate a key for
 * @returns A unique key for the file
 */
export const generateUniqueKey = (file: File): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  return `uploads/${timestamp}-${randomString}.${extension}`;
}; 