'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Post } from '@/hooks/usePosts'
import CommentSection from '@/components/CommentSection'

export default function PostPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch post')
        }
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Failed to load post. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Loading post...</div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error || 'Post not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article className="mb-12">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>Category: {post.category}</span>
            <span>Read time: {post.readTime}</span>
            <span>
              Published: {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      <hr className="my-12 border-t border-gray-200" />

      <CommentSection postId={params.id as string} />
    </div>
  )
} 