'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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

export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const [propertyPost, setPropertyPost] = useState<PropertyPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedProperties, setRelatedProperties] = useState<PropertyPost[]>([])

  useEffect(() => {
    const fetchPropertyPost = async () => {
      try {
        // Fetch all property posts and find by slug
        const response = await fetch('/api/property-posts')
        if (!response.ok) {
          throw new Error('Failed to fetch property posts')
        }
        const propertyPosts = await response.json()
        const foundPropertyPost = propertyPosts.find((p: PropertyPost) => p.slug === params.slug)
        
        if (!foundPropertyPost) {
          throw new Error('Property post not found')
        }
        
        setPropertyPost(foundPropertyPost)
        
        // Get related property posts (latest 3, excluding current one)
        const related = propertyPosts
          .filter((p: PropertyPost) => p._id !== foundPropertyPost._id)
          .slice(0, 3)
        setRelatedProperties(related)
        
      } catch (error) {
        console.error('Error fetching property post:', error)
        setError('Failed to load property post. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPropertyPost()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !propertyPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-100 text-red-700 p-6 rounded-lg text-center max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
            <p className="mb-4">{error || 'The property you are looking for does not exist.'}</p>
            <Link
              href="/admin/property-posts"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-orange-600 text-sm font-medium">Property Blog</span>
            </div>
            <Link
              href="/admin/property-posts"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              All Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Article */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          {/* Hero Image */}
          {propertyPost.hero_image && (
            <div className="relative w-full h-96 md:h-[500px]">
              <Image
                src={propertyPost.hero_image}
                alt={propertyPost.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {propertyPost.name}
                </h1>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Header (if no hero image) */}
            {!propertyPost.hero_image && (
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {propertyPost.name}
                </h1>
              </header>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-orange-600 font-medium">Property Blog</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Images: {propertyPost.sub_images?.length || 0} additional</span>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7l4 4m0 0l4-4m-4 4V3M4 21h16" />
                </svg>
                <span>
                  Published {new Date(propertyPost.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              {propertyPost.updatedAt !== propertyPost.createdAt && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>
                    Updated {new Date(propertyPost.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Sub Images Gallery */}
            {propertyPost.sub_images && propertyPost.sub_images.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyPost.sub_images.map((image, index) => (
                    <div key={index} className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                      <Image
                        src={image}
                        alt={`${propertyPost.name} - Image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900">
              <div dangerouslySetInnerHTML={{ __html: propertyPost.content }} />
            </div>
          </div>
        </article>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Properties</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProperties.map((relatedProperty) => (
                <Link
                  key={relatedProperty._id}
                  href={`/property/${relatedProperty.slug}`}
                  className="group"
                >
                  <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {relatedProperty.hero_image && (
                      <div className="relative h-32 w-full">
                        <Image
                          src={relatedProperty.hero_image}
                          alt={relatedProperty.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                        {relatedProperty.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{relatedProperty.sub_images?.length || 0} images</span>
                        <span>•</span>
                        <span>
                          {new Date(relatedProperty.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
} 