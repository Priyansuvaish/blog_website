import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, generateUniqueKey } from '../../../lib/aws-s3';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file-0') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Generate a unique key for the file
    const key = generateUniqueKey(file);

    // Upload to S3
    const imageUrl = await uploadToS3({ file, key });

    return NextResponse.json({
      result: [{
        url: imageUrl,
        name: file.name,
        size: file.size
      }]
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 