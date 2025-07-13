'use client'

import { useState, useRef } from 'react'
import SafeImage from './SafeImage'

interface CoverImageUploadProps {
  value: string | null
  onChange: (s3Key: string | null) => void
  onUploadStart?: () => void
  onUploadEnd?: () => void
}

export default function CoverImageUpload({ 
  value, 
  onChange, 
  onUploadStart, 
  onUploadEnd 
}: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setError(null)
    onUploadStart?.()

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
      }

      // Validate file size (max 10MB for cover images)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 10MB.')
      }

      const formData = new FormData()
      formData.append('upload', file)
      formData.append('type', 'cover') // Specify this is a cover image

      const response = await fetch('/api/upload-cover-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const result = await response.json()
      if (result.error) {
        throw new Error(result.error)
      }

      onChange(result.key)
    } catch (error) {
      console.error('Error uploading cover image:', error)
      setError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      onUploadEnd?.()
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      // Delete the cover image from S3
      await fetch('/api/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ s3Key: value })
      })
      
      onChange(null)
    } catch (error) {
      console.error('Error deleting cover image:', error)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Cover Image
      </label>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {value ? (
        // Show existing cover image
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
            <SafeImage
              s3Key={value}
              alt="Cover image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Show upload area
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Cover Image'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            or drag and drop an image here
          </p>
          <p className="text-xs text-gray-400">
            PNG, JPG, GIF, WebP up to 10MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            handleFileUpload(file)
          }
        }}
        className="hidden"
      />
    </div>
  )
} 