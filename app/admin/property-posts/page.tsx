'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SafeImage from '@/components/SafeImage'

interface PropertyPost {
  _id: string
  name: string
  slug: string
  content: string
  hero_image: string
  sub_images: string[]
  createdAt: string
  updatedAt: string
}

export default function AdminPropertyPosts() {
  const router = useRouter()
  const [propertyPosts, setPropertyPosts] = useState<PropertyPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPropertyPosts()
  }, [])

  const fetchPropertyPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/property-posts')
      if (!response.ok) {
        throw new Error('Failed to fetch property posts')
      }
      const data = await response.json()
      setPropertyPosts(data)
    } catch (error) {
      console.error('Error fetching property posts:', error)
      setError('Failed to load property posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (propertyPostId: string) => {
    if (!confirm('Are you sure you want to delete this property post?')) {
      return
    }

    try {
      const response = await fetch(`/api/property-posts/${propertyPostId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete property post')
      }
      
      // Refresh property posts list
      await fetchPropertyPosts()
    } catch (error) {
      console.error('Error deleting property post:', error)
      alert('Failed to delete property post. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Property Posts</h1>
          <Link
            href="/admin/create-property-post"
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Create Property Post
          </Link>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Property Posts</h1>
          <Link
            href="/admin/create-property-post"
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Create Property Post
          </Link>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Failed to load property posts. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Property Posts</h1>
        <Link
          href="/admin/create-property-post"
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
        >
          Create Property Post
        </Link>
      </div>

      {!propertyPosts || propertyPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No property posts yet. Create your first property post!
        </div>
      ) : (
        <div className="grid gap-6">
          {propertyPosts.map((propertyPost: PropertyPost) => (
            <div
              key={propertyPost._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="flex">
                {/* Hero Image */}
                <div className="w-48 h-32 flex-shrink-0 relative bg-gray-100">
                  {propertyPost.hero_image ? (
                    <SafeImage
                      s3Key={propertyPost.hero_image}
                      alt={propertyPost.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 192px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Property Post Content */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{propertyPost.name}</h2>
                      <div className="flex gap-4 text-sm text-gray-500 mb-2">
                        <span>Sub Images: {propertyPost.sub_images?.length || 0}</span>
                        <span>
                          Created: {new Date(propertyPost.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          Updated: {new Date(propertyPost.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div 
                        className="text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: propertyPost.content.substring(0, 150) + '...' 
                        }}
                      />
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/property/${propertyPost.slug}`)}
                        className="px-3 py-1 text-green-600 hover:text-green-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/edit-property-post/${propertyPost._id}`)}
                        className="px-3 py-1 text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(propertyPost._id)}
                        className="px-3 py-1 text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 