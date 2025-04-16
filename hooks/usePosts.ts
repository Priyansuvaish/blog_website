import useSWR from 'swr'

export interface Post {
  _id: string
  title: string
  excerpt: string
  category: string
  readTime: string
  content: string
  createdAt: string
  updatedAt: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  return res.json()
}

export function usePosts() {
  const { data, error, isLoading, mutate } = useSWR<Post[]>('/api/posts', fetcher)

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      // Update the local cache by filtering out the deleted post
      mutate(
        (currentData?: Post[]) => 
          currentData ? currentData.filter(post => post._id !== postId) : [],
        false // Set to false to avoid revalidation
      )
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  return {
    posts: data,
    isLoading,
    isError: error,
    mutate,
    deletePost
  }
} 