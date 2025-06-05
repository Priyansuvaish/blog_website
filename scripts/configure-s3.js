const { S3Client, PutBucketPolicyCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

async function configureS3Bucket() {
  try {
    // Configure bucket policy for public read access
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      })
    );

    console.log('✅ Bucket policy configured successfully');

    // Configure CORS
    const corsConfig = {
      CORSRules: [
        {
          AllowedHeaders: ['*'],
          AllowedMethods: ['GET', 'HEAD'],
          AllowedOrigins: ['*'],
          ExposeHeaders: [],
        },
      ],
    };

    await s3Client.send(
      new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: corsConfig,
      })
    );

    console.log('✅ CORS configuration applied successfully');
  } catch (error) {
    console.error('Error configuring S3 bucket:', error);
    process.exit(1);
  }
}

configureS3Bucket(); 