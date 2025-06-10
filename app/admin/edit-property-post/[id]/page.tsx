'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PropertyPostEditor from '@/components/PropertyPostEditor'

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

export default function EditPropertyPostPage() {
  const params = useParams()
  const [propertyPost, setPropertyPost] = useState<PropertyPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPropertyPost = async () => {
      try {
        const response = await fetch(`/api/property-posts/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch property post')
        }
        const data = await response.json()
        setPropertyPost(data)
      } catch (error) {
        console.error('Error fetching property post:', error)
        setError('Failed to load property post. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPropertyPost()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">Loading property post...</div>
      </div>
    )
  }

  if (error || !propertyPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error || 'Property post not found'}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Property Post</h1>
      <PropertyPostEditor propertyPost={propertyPost} />
    </div>
  )
} 