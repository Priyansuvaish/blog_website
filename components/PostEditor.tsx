'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import CoverImageUpload from './CoverImageUpload'

const ClientCKEditor = dynamic(
  () => import('./ClientCKEditor'),
  { ssr: false }
)

interface PostEditorProps {
  post?: {
    _id: string
    title: string
    content: string
    metadata: string // Renamed from excerpt - used for SEO meta description
    category: string
    readTime: string
    coverImage?: string
  }
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [content, setContent] = useState(post?.content || '')
  const [metadata, setMetadata] = useState(post?.metadata || '')
  const [category, setCategory] = useState(post?.category || '')
  const [categories, setCategories] = useState<{_id: string, name: string}[]>([])
  const [readTime, setReadTime] = useState(post?.readTime || '')
  const [coverImage, setCoverImage] = useState<string | null>(post?.coverImage || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialImages, setInitialImages] = useState<string[]>([])
  const [initialCoverImage, setInitialCoverImage] = useState<string | null>(null)

  // Extract image URLs from content (now works with presigned URLs)
  const extractImageUrls = (htmlContent: string): string[] => {
    const regex = /<img[^>]+src="([^">]+)"/gi
    const matches = []
    let match
    while ((match = regex.exec(htmlContent)) !== null) {
      // Check if it's our S3 presigned URL
      if (match[1].includes('propertydetail') && match[1].includes('amazonaws.com')) {
        matches.push(match[1])
      }
    }
    return matches
  }

  // Delete unused images from S3
  const deleteUnusedImages = async (currentImages: string[], newImages: string[]) => {
    const imagesToDelete = currentImages.filter(img => !newImages.includes(img))
    
    for (const imageUrl of imagesToDelete) {
      try {
        await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl })
        })
        console.log('Deleted unused image:', imageUrl)
      } catch (error) {
        console.error('Failed to delete image:', imageUrl, error)
      }
    }
  }

  // Initialize with existing images when editing
  useEffect(() => {
    if (post?.content) {
      const images = extractImageUrls(post.content)
      setInitialImages(images)
    }
    if (post?.coverImage) {
      setInitialCoverImage(post.coverImage)
    }
  }, [post])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const categoriesData = await response.json()
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Get current images from content
      const currentImages = extractImageUrls(content)

      const response = await fetch('/api/posts', {
        method: post ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(post && { id: post._id }),
          title,
          content,
          metadata,
          category,
          readTime,
          coverImage,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      // Clean up unused images if editing existing post
      if (post) {
        await deleteUnusedImages(initialImages, currentImages)
        
        // Clean up old cover image if changed
        if (initialCoverImage && initialCoverImage !== coverImage) {
          try {
            await fetch('/api/delete-image', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: initialCoverImage })
            })
          } catch (error) {
            console.error('Failed to delete old cover image:', error)
          }
        }
      }

      router.push('/admin/posts')
      router.refresh()
    } catch (error) {
      console.error('Error saving post:', error)
      setError('Failed to save post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContentChange = (newContent: string) => {
    setContent(newContent)
    
    // If editing existing post, clean up images in real-time
    if (post) {
      const currentImages = extractImageUrls(content)
      const newImages = extractImageUrls(newContent)
      
      // Delete images that were removed
      const removedImages = currentImages.filter(img => !newImages.includes(img))
      if (removedImages.length > 0) {
        deleteUnusedImages(removedImages, [])
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <CoverImageUpload
        value={coverImage}
        onChange={setCoverImage}
      />

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
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

      <div>
        <label htmlFor="metadata" className="block text-sm font-medium text-gray-700">
          SEO Meta Description
        </label>
        <textarea
          id="metadata"
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Brief description for search engines and social media sharing..."
          required
        />
        <p className="mt-1 text-sm text-gray-500">
          This will be used as the meta description for SEO and social media previews. Keep it under 160 characters.
        </p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            No categories available. <a href="/admin/categories" className="text-blue-600 hover:underline">Create categories first</a>.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">
          Read Time (minutes)
        </label>
        <input
          type="text"
          id="readTime"
          value={readTime}
          onChange={(e) => setReadTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  )
} 