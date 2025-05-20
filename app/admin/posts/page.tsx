'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePosts, Post } from '@/hooks/usePosts'

export default function AdminPosts() {
  const router = useRouter()
  const { posts, isLoading, isError, deletePost } = usePosts()

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await deletePost(postId)
    } catch (error) {
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
            className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-opacity-90"
          >
            Create Post
          </Link>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Posts</h1>
          <Link
            href="/admin/create-post"
            className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-opacity-90"
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
          className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-opacity-90"
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
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>Category: {post.category}</span>
                    <span>Read time: {post.readTime}</span>
                    <span>
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/edit-post/${post._id}`)}
                    className="px-3 py-1 text-custom-blue hover:text-opacity-80"
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
          ))}
        </div>
      )}
    </div>
  )
} 