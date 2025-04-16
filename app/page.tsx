'use client'

import Link from 'next/link'
import { usePosts } from '@/hooks/usePosts'

export default function HomePage() {
  const { posts, isLoading, isError } = usePosts()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to My Blog</h1>
        <div className="text-center py-8">Loading posts...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to My Blog</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Failed to load posts. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to My Blog</h1>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No posts available yet. Check back soon!
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post._id}`}
              className="block group"
            >
              <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 