'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Function to check if the URL is a Google Drive URL
const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

// Function to get the file ID from a Google Drive URL
const getGoogleDriveFileId = (url: string): string | null => {
  const match = url.match(/[?&]id=([^&]+)/);
  return match ? match[1] : null;
};

export default function ArticleImage({ src, alt, className, loading = 'lazy' }: ArticleImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.error('Failed to load image:', src);
      setImgSrc(PLACEHOLDER_IMAGE);
      setHasError(true);
    }
  };

  // If it's a Google Drive URL, ensure it's in the correct format
  const imageUrl = isGoogleDriveUrl(src) 
    ? `https://drive.google.com/uc?export=view&id=${getGoogleDriveFileId(src)}`
    : src;

  return (
    <div className="w-full h-full relative">
      {imgSrc ? (
        <div className="relative w-full h-full">
          <Image 
            src={imageUrl} 
            alt={alt} 
            fill
            className={`object-cover ${className || ''}`}
            loading={loading}
            onError={handleError}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={loading === 'eager'}
            unoptimized={isGoogleDriveUrl(src)} // Disable Next.js image optimization for Google Drive images
          />
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-5xl text-gray-400 font-bold">[Banner Image]</span>
        </div>
      )}
    </div>
  );
} 