'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import CoverImageUpload from './CoverImageUpload'

const ClientCKEditor = dynamic(
  () => import('./ClientCKEditor'),
  { ssr: false }
)

interface PropertyPost {
  _id: string
  name: string
  hero_image: string
  sub_images: string[]
  content: string
  slug: string
  createdAt: string
  updatedAt: string
}

interface PropertyPostEditorProps {
  propertyPost?: PropertyPost
}

export default function PropertyPostEditor({ propertyPost }: PropertyPostEditorProps) {
  const router = useRouter()
  const [name, setName] = useState(propertyPost?.name || '')
  const [content, setContent] = useState(propertyPost?.content || '')
  const [heroImage, setHeroImage] = useState<string | null>(propertyPost?.hero_image || null)
  const [subImages, setSubImages] = useState<string[]>(propertyPost?.sub_images || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialImages, setInitialImages] = useState<string[]>([])
  const [initialHeroImage, setInitialHeroImage] = useState<string | null>(null)
  const [initialSubImages, setInitialSubImages] = useState<string[]>([])

  // Extract S3 keys from content
  const extractS3Keys = (htmlContent: string): string[] => {
    const regex = /<img[^>]+data-s3-key="([^">]+)"/gi
    const matches = []
    let match
    while ((match = regex.exec(htmlContent)) !== null) {
      matches.push(match[1])
    }
    return matches
  }

  // Delete unused images from S3
  const deleteUnusedImages = async (currentImages: string[], newImages: string[]) => {
    const imagesToDelete = currentImages.filter((img: string) => !newImages.includes(img))
    
    for (const s3Key of imagesToDelete) {
      try {
        await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ s3Key })
        })
        console.log('Deleted unused image:', s3Key)
      } catch (error) {
        console.error('Failed to delete image:', s3Key, error)
      }
    }
  }

  // Initialize with existing images when editing
  useEffect(() => {
    if (propertyPost?.content) {
      const images = extractS3Keys(propertyPost.content)
      setInitialImages(images)
    }
    if (propertyPost?.hero_image) {
      setInitialHeroImage(propertyPost.hero_image)
    }
    if (propertyPost?.sub_images) {
      setInitialSubImages([...propertyPost.sub_images])
    }
  }, [propertyPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Get current images from content
      const currentImages = extractS3Keys(content)

      const response = await fetch('/api/property-posts', {
        method: propertyPost ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(propertyPost && { id: propertyPost._id }),
          name,
          content,
          hero_image: heroImage,
          sub_images: subImages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save property post')
      }

      // Clean up unused images if editing existing post
      if (propertyPost) {
        await deleteUnusedImages(initialImages, currentImages)
        
        // Clean up old hero image if changed
        if (initialHeroImage && initialHeroImage !== heroImage) {
          try {
            await fetch('/api/delete-image', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ s3Key: initialHeroImage })
            })
          } catch (error) {
            console.error('Failed to delete old hero image:', error)
          }
        }

        // Clean up removed sub images
        const removedSubImages = initialSubImages.filter((img: string) => !subImages.includes(img))
        if (removedSubImages.length > 0) {
          await deleteUnusedImages(removedSubImages, [])
        }
      }

      router.push('/admin/property-posts')
      router.refresh()
    } catch (error) {
      console.error('Error saving property post:', error)
      setError('Failed to save property post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    
    // If editing existing post, clean up images in real-time
    if (propertyPost) {
      const currentImages = extractS3Keys(content)
      const newImages = extractS3Keys(newContent)
      
      // Delete images that were removed
      const removedImages = currentImages.filter((img: string) => !newImages.includes(img))
      if (removedImages.length > 0) {
        deleteUnusedImages(removedImages, [])
      }
    }
  }

  const addSubImage = () => {
    setSubImages([...subImages, ''])
  }

  const updateSubImage = (index: number, url: string) => {
    const newSubImages = [...subImages]
    newSubImages[index] = url
    setSubImages(newSubImages)
  }

  const removeSubImage = (index: number) => {
    const removedImage = subImages[index]
    const newSubImages = subImages.filter((_, i) => i !== index)
    setSubImages(newSubImages)
    
    // Delete the removed image if it exists
    if (removedImage && removedImage.trim()) {
      deleteUnusedImages([removedImage], [])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Property Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hero Image
        </label>
        <CoverImageUpload
          value={heroImage || ''}
          onChange={setHeroImage}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sub Images
        </label>
        <div className="space-y-3">
          {subImages.map((image, index) => (
            <div key={index} className="flex gap-2 items-end">
              <div className="flex-1">
                <CoverImageUpload
                  value={image || ''}
                  onChange={(url) => updateSubImage(index, url || '')}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSubImage(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubImage}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Sub Image
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <div className="mt-1">
          <ClientCKEditor
            value={content}
            onChange={handleContentChange}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : propertyPost ? 'Update Property Post' : 'Create Property Post'}
        </button>
      </div>
    </form>
  )
} 