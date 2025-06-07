# AWS S3 Setup for Image Upload

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# AWS Configuration
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_aws_access_key_id
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
NEXT_PUBLIC_AWS_REGION=ap-southeast-2
NEXT_PUBLIC_AWS_S3_BUCKET_NAME=propertydetail

# MongoDB (if not already set)
MONGODB_URI=your_mongodb_connection_string
```

## AWS S3 Bucket Setup

1. **Create S3 Bucket:**
   - Go to AWS S3 Console
   - Create a new bucket with a unique name
   - Choose your preferred region

2. **Configure Bucket Permissions:**
   
   **Important:** Modern S3 buckets have ACLs disabled by default. Instead of ACLs, we'll use bucket policies.
   
   - Go to Bucket Permissions
   - Edit Block Public Access settings
   - Uncheck "Block all public access" (or at least "Block public access to buckets and objects granted through new public bucket or access point policies")
   - Add this bucket policy for public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::propertydetail/*"
        }
    ]
}
```

   **Note:** Replace `propertydetail` with your actual bucket name.

3. **CORS Configuration:**
   Add CORS rules to allow uploads from your domain:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

## IAM User Setup

Create an IAM user with programmatic access and attach this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

## Features

- ✅ Drag and drop image upload
- ✅ Copy-paste images directly into editor
- ✅ Image resize and styling options
- ✅ Image captions
- ✅ Automatic S3 upload with unique filenames
- ✅ File type validation (JPEG, PNG, GIF, WebP)
- ✅ File size validation (max 5MB)
- ✅ Public URL generation

## Usage

1. In the CKEditor, click the image upload button in the toolbar
2. Select an image file or drag and drop
3. The image will be automatically uploaded to S3
4. The image URL will be embedded in your post content
5. When you save the post, all images will be permanently stored in S3

## Troubleshooting

- **403 Forbidden:** Check your AWS credentials and S3 bucket permissions
- **CORS Error:** Ensure CORS is properly configured in your S3 bucket
- **Upload Failed:** Check file size (max 5MB) and file type (images only) 