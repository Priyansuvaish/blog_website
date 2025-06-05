import { google } from 'googleapis';
import { Readable } from 'stream';

// Initialize Google Drive client
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.GOOGLE_PROJECT_ID,
  },
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
  ],
});

const drive = google.drive({ version: 'v3', auth });

// Folder IDs for different types of images
const FOLDER_IDS = {
  BANNER: '19AKeuOCMwE5THIMom0fXcJNGV3ZLSgD3', // Banner images folder
  BLOG_CONTENT: '1BbUqsnHofMlAwkVGTbPxGYUeG40jcbiM', // Blog content images folder
};

// Function to verify Google Drive authentication
const verifyDriveAccess = async () => {
  try {
    await drive.files.list({
      pageSize: 1,
      fields: 'files(id, name)',
    });
  } catch (error) {
    console.error('Google Drive authentication error:', error);
    throw new Error('Failed to authenticate with Google Drive. Please check your credentials.');
  }
};

// Function to generate a direct download URL
const getDirectDownloadUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

// Function to upload file to Google Drive
export const uploadToGoogleDrive = async (
  file: File,
  folderId: string,
  isPublic: boolean = true
): Promise<string> => {
  try {
    // Verify authentication first
    await verifyDriveAccess();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);

    const fileMetadata = {
      name: `${Date.now()}_${file.name}`,
      parents: [folderId],
      mimeType: file.type,
    };

    const media = {
      mimeType: file.type,
      body: stream,
    };

    console.log('Uploading file to Google Drive:', {
      fileName: fileMetadata.name,
      fileType: file.type,
      fileSize: file.size,
      folderId: folderId,
    });

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    if (!response.data.id) {
      throw new Error('Failed to upload file to Google Drive: No file ID returned');
    }

    // If the file should be public, update its permissions
    if (isPublic) {
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    }

    // Get the direct download URL
    const fileId = response.data.id;
    const directDownloadUrl = getDirectDownloadUrl(fileId);
    
    console.log('File uploaded successfully:', {
      fileId: response.data.id,
      url: directDownloadUrl,
    });

    return directDownloadUrl;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to upload file to Google Drive: ${error.message}`);
    }
    throw new Error('Failed to upload file to Google Drive');
  }
};

// Function to upload banner image
export const uploadBannerImage = async (file: File): Promise<string> => {
  return uploadToGoogleDrive(file, FOLDER_IDS.BANNER);
};

// Function to upload blog content image
export const uploadBlogContentImage = async (file: File): Promise<string> => {
  return uploadToGoogleDrive(file, FOLDER_IDS.BLOG_CONTENT);
};

// Function to delete a file from Google Drive
export const deleteFromGoogleDrive = async (fileId: string): Promise<void> => {
  try {
    await drive.files.delete({
      fileId: fileId,
    });
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error);
    throw new Error('Failed to delete file from Google Drive');
  }
}; 