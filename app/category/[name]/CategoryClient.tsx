'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Loading from '@/components/Loading'
import SafeImage from '@/components/SafeImage'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  metadata: string // Renamed from excerpt - used for SEO meta description
  category: string
  readTime: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

// Function to format relative date
const formatRelativeDate = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "1d ago";
  } else {
    return `${diffInDays}d ago`;
  }
};

export default function CategoryClient({ params }: { params: { name: string } }) {
  const router = useRouter()
  const categoryName = decodeURIComponent(params.name)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        // Fetch all posts and filter by category
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const allPosts = await response.json()
        const filteredPosts = allPosts.filter((post: Post) => post.category === categoryName)
        setPosts(filteredPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setError('Failed to load posts. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryPosts()
  }, [categoryName])

  if (isLoading) {
    return (
      <Loading 
        variant="spinner" 
        size="lg" 
        text="Loading category content" 
        fullScreen={true} 
      />
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        {/* Desktop Error */}
        <div className="hidden xl:block container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 sm:px-6 py-4 rounded-2xl text-center max-w-md mx-auto">
            <p className="font-medium text-sm sm:text-base">{error}</p>
          </div>
        </div>
        
        {/* Mobile Error */}
        <div className="xl:hidden px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-4 rounded-xl text-center max-w-sm mx-auto">
            <p className="font-medium text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="xl:hidden sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="px-4 py-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : ''
                }`}
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Category Info */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#009FFF]/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-medium text-gray-900 mb-2 tracking-tight">
              {categoryName}
            </h1>
            
            <p className="text-sm text-gray-600">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Header Section */}
      <div className="hidden xl:block border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Back Button */}
          <div className="mb-8 sm:mb-12">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-3 text-gray-600 hover:text-[#009FFF] transition-all duration-300 font-light hover:-translate-x-1"
            >
              <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#009FFF]/10 flex items-center justify-center transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-sm sm:text-base">Back to Home</span>
            </button>
          </div>
          
          {/* Category Header */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Category Icon */}
            <div className="relative mb-6 sm:mb-8">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-[#009FFF]/25">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#009FFF]/20 rounded-xl animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#009FFF]/30 rounded-lg animate-pulse delay-300"></div>
            </div>

            {/* Category Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-4 sm:mb-6 tracking-tight">
              {categoryName}
            </h1>
            
            {/* Post Count */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
              <p className="text-base sm:text-lg text-gray-600 font-light">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
              </p>
              <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
            </div>

            {/* Category Description */}
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Discover insightful articles, updates, and expert perspectives on {categoryName.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="xl:hidden px-4 py-6">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs mx-auto">
              We're working on adding amazing content to this category.
            </p>
            
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#009FFF] text-white rounded-xl text-sm font-medium active:scale-95 transition-transform duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Explore Other Categories
            </Link>
          </div>
        ) : (
          <>
            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {posts.map((post, index) => (
                  <Link
                    key={post._id}
                    href={`/post/${post.slug}`}
                    className="block group"
                  >
                    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden active:scale-95 transition-all duration-200 hover:border-[#009FFF]/30 hover:shadow-lg">
                      <div className="flex gap-4 p-4">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {post.coverImage ? (
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                              <SafeImage
                                s3Key={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#009FFF]/10 to-[#007ACC]/10 flex items-center justify-center">
                              <svg className="w-8 h-8 text-[#009FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-[#009FFF] transition-colors duration-200">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 text-xs line-clamp-2 mb-3 leading-relaxed">
                            {post.metadata}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatRelativeDate(post.createdAt)}</span>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#009FFF]/10 text-[#009FFF] px-2 py-1 rounded-full text-xs">
                                {post.readTime}
                              </span>
                              <svg className="w-3 h-3 text-gray-400 group-hover:text-[#009FFF] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 gap-4">
                {posts.map((post, index) => (
                  <Link
                    key={post._id}
                    href={`/post/${post.slug}`}
                    className="block group"
                  >
                    <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden active:scale-95 transition-all duration-200 hover:border-[#009FFF]/30 hover:shadow-lg">
                      {/* Image */}
                      {post.coverImage && (
                        <div className="relative h-40 overflow-hidden">
                          <SafeImage
                            s3Key={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Read Time Badge */}
                          <div className="absolute top-3 right-3">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-[#009FFF] transition-colors duration-200 leading-6">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {post.metadata}
                        </p>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">
                            {formatRelativeDate(post.createdAt)}
                          </span>
                          
                          <div className="flex items-center text-gray-400 group-hover:text-[#009FFF] transition-colors duration-200">
                            <span className="text-xs mr-1">Read</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Desktop Posts Section */}
      <div className="hidden xl:block container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {posts.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="max-w-md mx-auto">
              {/* Empty State Icon */}
              <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-light text-gray-900 mb-3">No articles yet</h3>
              <p className="text-gray-500 font-light mb-8 leading-relaxed">
                We're working on adding amazing content to this category. Check back soon for fresh articles and insights.
              </p>
              
              <Link
                href="/home"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#009FFF] text-white rounded-2xl hover:bg-[#007ACC] transition-all duration-300 font-medium text-sm hover:scale-105 hover:shadow-lg hover:shadow-[#009FFF]/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Explore Other Categories
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post._id}
                href={`/post/${post.slug}`}
                className="group"
              >
                <article 
                  className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#009FFF]/10 transition-all duration-700 hover:-translate-y-4 border border-gray-100 hover:border-[#009FFF]/20 h-full flex flex-col"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Post Image */}
                  {post.coverImage && (
                    <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                      <SafeImage
                        s3Key={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Read Time Badge */}
                      <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                        <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                          {post.readTime}
                        </span>
                      </div>

                      {/* Corner Accent */}
                      <div className="absolute top-0 left-0 w-0 h-0 group-hover:w-16 group-hover:h-16 transition-all duration-500">
                        <div className="w-full h-full bg-gradient-to-br from-[#009FFF] to-transparent opacity-20"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Post Content */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    {/* Title */}
                    <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2 leading-7 sm:leading-8 tracking-tight">
                      {post.title}
                    </h2>
                    
                    {/* Meta Description */}
                    <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed font-light text-sm sm:text-base flex-1">
                      {post.metadata}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-[#009FFF]/20 transition-colors duration-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#009FFF] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="text-sm text-gray-600 font-light group-hover:text-[#009FFF] transition-colors duration-300">
                          {formatRelativeDate(post.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#009FFF] transition-all duration-300 group-hover:translate-x-1">
                        <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Read Article
                        </span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-3xl border-2 border-[#009FFF]/20"></div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="xl:hidden h-8"></div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
} 