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
   
   **✅ Secure Setup:** We now use **presigned URLs** instead of public bucket access for better security!
   
   - **Keep "Block all public access" ENABLED** (more secure)
   - **No bucket policy needed** - presigned URLs handle access
   - Images are accessible via time-limited, secure URLs

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

## Security Features

### **🔒 Presigned URLs (Recommended)**
- **7-day expiration** on all image URLs
- **No public bucket access** required
- **Secure by default** - only authorized access
- **Automatic URL refresh** available via API

### **🚨 Important:**
- Image URLs expire after 7 days
- Use the refresh API to update expired URLs
- All uploads generate secure, time-limited URLs

## Features

- ✅ **Secure presigned URLs** (7-day expiration)
- ✅ Drag and drop image upload
- ✅ Copy-paste images directly into editor
- ✅ **Real-time image display** (no more placeholders!)
- ✅ Image resize and styling options
- ✅ Image captions
- ✅ Automatic S3 upload with unique filenames
- ✅ **Auto-delete unused images** when removed from posts
- ✅ **Visual upload status indicators**
- ✅ File type validation (JPEG, PNG, GIF, WebP)
- ✅ File size validation (max 5MB)
- ✅ **Secure URL generation** with expiration
- ✅ **URL refresh API** for expired links
- ✅ **Orphaned image cleanup** via API

## Usage

1. In the CKEditor, click the image upload button in the toolbar
2. Select an image file or drag and drop
3. **See upload progress** with visual indicators
4. **Images display immediately** with secure presigned URLs
5. When you save the post, all images are stored with 7-day URLs
6. **Unused images are automatically deleted** when removed from editor
7. **Refresh expired URLs:** `POST /api/refresh-image-urls`
8. **Clean up orphans:** `POST /api/cleanup-images`

## Image Management APIs

### **URL Refresh (Important for long-term posts):**
```bash
# Refresh all posts
curl -X POST http://localhost:3000/api/refresh-image-urls

# Refresh specific post
curl -X POST http://localhost:3000/api/refresh-image-urls \
  -H "Content-Type: application/json" \
  -d '{"postId": "your-post-id"}'
```

### **Cleanup Orphaned Images:**
```bash
curl -X POST http://localhost:3000/api/cleanup-images
```

## Scheduled URL Refresh (Recommended)

For production, set up a cron job to refresh URLs weekly:

```bash
# Add to your server's crontab (runs every Sunday at 2 AM)
0 2 * * 0 curl -X POST https://yourdomain.com/api/refresh-image-urls
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

## Troubleshooting

- **403 Forbidden:** Check your AWS credentials and S3 bucket permissions
- **CORS Error:** Ensure CORS is properly configured in your S3 bucket
- **Upload Failed:** Check file size (max 5MB) and file type (images only) 