'use client'

import { useState, useEffect } from 'react'

interface SafeImageProps {
  s3Key: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  sizes?: string
  priority?: boolean
  fallbackSrc?: string
}

export default function SafeImage({ 
  s3Key, 
  alt, 
  fill, 
  width, 
  height, 
  className, 
  sizes, 
  priority,
  fallbackSrc = '/EF_Journal_Logo.png'
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getImageUrl = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/s3-image?key=${encodeURIComponent(s3Key)}`)
        if (!res.ok) throw new Error('Failed to fetch image URL')
        const { url } = await res.json()
        setImgSrc(url)
      } catch (error) {
        console.error('Error generating presigned URL:', error)
        setHasError(true)
        setImgSrc(fallbackSrc)
      } finally {
        setIsLoading(false)
      }
    }

    if (s3Key) {
      getImageUrl()
    } else {
      setImgSrc(fallbackSrc)
      setIsLoading(false)
    }
  }, [s3Key, fallbackSrc])

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  if (isLoading || !imgSrc) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  const imgStyle = fill ? { objectFit: 'cover' as const, width: '100%', height: '100%' } : {}

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      style={imgStyle}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
} 