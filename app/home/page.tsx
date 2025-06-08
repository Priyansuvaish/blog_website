'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  _id: string
  name: string
  post_ids: Array<{
    _id: string
    title: string
    slug: string
  }>
  createdAt: string
  updatedAt: string
}

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  createdAt: string
  category: string
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [latestPosts, setLatestPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories')
        }
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // Fetch latest posts
        const postsResponse = await fetch('/api/posts?limit=5&sort=createdAt:desc')
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setLatestPosts(postsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Categories (80%) */}
          <div className="lg:w-4/5 lg:border-r lg:border-gray-300 lg:pr-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Categories</h2>
              <p className="text-gray-600 max-w-2xl">
                Browse through our different categories and discover the content that interests you most.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Yet</h3>
                  <p className="text-gray-600">Categories will appear here once they are created.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${encodeURIComponent(category.name)}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 h-full">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {category.post_ids.length} {category.post_ids.length === 1 ? 'post' : 'posts'} available
                      </p>
                      
                      {category.post_ids.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Posts:</p>
                          {category.post_ids.slice(0, 2).map((post) => (
                            <p key={post._id} className="text-xs text-gray-600 truncate">
                              • {post.title}
                            </p>
                          ))}
                          {category.post_ids.length > 2 && (
                            <p className="text-xs text-blue-600 font-medium">
                              +{category.post_ids.length - 2} more
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800">
                        Explore posts
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Latest Posts (20%) */}
          <div className="lg:w-1/5">
            <div className="lg:sticky lg:top-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Latest Posts</h3>
              </div>

              {latestPosts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p className="text-gray-600 text-sm">No posts yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {latestPosts.map((post) => (
                    <Link
                      key={post._id}
                      href={`/post/${post.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 