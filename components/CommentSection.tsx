'use client'

import { useState, useEffect } from 'react'
import { Comment as CommentType } from '@/types/database.types'

interface CommentSectionProps {
  postId: string
}

// Generate unique username
const generateUsername = (): string => {
  const adjectives = ['Cool', 'Smart', 'Quick', 'Bright', 'Silent', 'Bold', 'Calm', 'Swift', 'Wise', 'Kind']
  const nouns = ['Reader', 'Thinker', 'Explorer', 'Seeker', 'Learner', 'Dreamer', 'Builder', 'Creator', 'Writer', 'Observer']
  const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  
  return `${adjective}${noun}${numbers}`
}

// Get or create username from localStorage
const getUserUsername = (): string => {
  if (typeof window === 'undefined') return '' // SSR safety
  
  let username = localStorage.getItem('blog_username')
  if (!username) {
    username = generateUsername()
    localStorage.setItem('blog_username', username)
  }
  return username
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([])
  const [newComment, setNewComment] = useState('')
  const [currentUsername, setCurrentUsername] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
    // Set username from localStorage
    setCurrentUsername(getUserUsername())
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }
      const data = await response.json()
      setComments(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setError('Failed to load comments. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment.trim(),
          username: currentUsername,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add comment')
      }

      const comment = await response.json()
      setComments([comment, ...comments])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
      setError('Failed to add comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      setComments(comments.filter(comment => comment._id.toString() !== commentId))
      setError(null)
    } catch (error) {
      console.error('Error deleting comment:', error)
      setError('Failed to delete comment. Please try again.')
    }
  }

  const regenerateUsername = () => {
    const newUsername = generateUsername()
    localStorage.setItem('blog_username', newUsername)
    setCurrentUsername(newUsername)
  }

  return (
    <div className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-2 tracking-tight">
        Join the Discussion
      </h2>
      <p className="text-gray-600 font-light mb-8">
        Share your thoughts and connect with other readers
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-12">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          {/* Username Display */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUsername.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-gray-900 font-medium">Commenting as</p>
                <p className="text-[#009FFF] font-medium">{currentUsername}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={regenerateUsername}
              className="text-sm text-gray-500 hover:text-[#009FFF] transition-colors duration-300 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Change Name
            </button>
          </div>

          {/* Comment Input */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this article..."
            rows={4}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-[#009FFF] focus:ring-2 focus:ring-[#009FFF]/20 resize-none transition-colors duration-300 text-gray-700"
            required
          />
          
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#009FFF] to-[#007ACC] text-white rounded-2xl hover:from-[#007ACC] hover:to-[#009FFF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:shadow-[#009FFF]/30 transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                'Post Comment'
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id.toString()} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {comment.username.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{comment.username}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {/* Only show delete for current user's comments */}
              {comment.username === currentUsername && (
                <button
                  onClick={() => handleDelete(comment._id.toString())}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-300 p-2 rounded-full hover:bg-red-50"
                  title="Delete your comment"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            <p className="text-gray-700 leading-relaxed font-light">
              {comment.content}
            </p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-2">Start the Conversation</h3>
            <p className="text-gray-500 font-light">Be the first to share your thoughts on this article!</p>
          </div>
        )}
      </div>
    </div>
  )
} 