'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SafeImage from '@/components/SafeImage'

interface Post {
  _id: string
  title: string
  slug: string
  metadata: string // Renamed from excerpt - used for SEO meta description
  category: string
  readTime: string
  content: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export default function AdminPosts() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/posts')
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete post')
      }
      
      // Refresh posts list
      await fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Link
            href="/admin/create-post"
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Create Post
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
          <h1 className="text-3xl font-bold">Posts</h1>
          <Link
            href="/admin/create-post"
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            Create Post
          </Link>
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Failed to load posts. Please try again.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link
          href="/admin/create-post"
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
        >
          Create Post
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts yet. Create your first post!
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post: Post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="flex">
                {/* Cover Image */}
                <div className="w-48 h-32 flex-shrink-0 relative bg-gray-100">
                  {post.coverImage ? (
                    <SafeImage
                      s3Key={post.coverImage}
                      alt={post.title}
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

                {/* Post Content */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.metadata}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Category: {post.category}</span>
                        <span>Read time: {post.readTime}</span>
                        <span>
                          Created: {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/post/${post.slug}`)}
                        className="px-3 py-1 text-green-600 hover:text-green-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/admin/edit-post/${post._id}`)}
                        className="px-3 py-1 text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
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