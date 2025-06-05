import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region:process.env.NEXT_PUBLIC_AWS_REGION,
  });

export const uploadToS3 = async (file, key) => {
  try {
    // Convert Blob to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME, // Ensure this environment variable is set
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    const data = await s3.upload(params).promise();
    return data.Location; // URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('S3 Upload Failed');
  } 
};

export const generatePresignedUrl = (key) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: key,
    Expires: 60 // URL expires in 60 seconds
  };

  return s3.getSignedUrl('getObject', params);
};
export const viewFileFromPresignedUrl = (url) => {
  window.open(url, '_blank');
};