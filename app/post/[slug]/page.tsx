'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { DotLoader } from 'react-spinners'

interface Post {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  readTime: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showShareButtons, setShowShareButtons] = useState(false)

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch all posts and find by slug
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const posts = await response.json()
        const foundPost = posts.find((p: Post) => p.slug === params.slug)
        
        if (!foundPost) {
          throw new Error('Post not found')
        }
        
        setPost(foundPost)
        
        // Get related posts from the same category
        const related = posts
          .filter((p: Post) => p.category === foundPost.category && p._id !== foundPost._id)
          .slice(0, 3)
        setRelatedPosts(related)
        
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Failed to load post. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = post?.title || ''
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        // You could add a toast notification here
        break
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <DotLoader color="#009FFF" size={40} speedMultiplier={1.2} />
            <p className="mt-4 text-sm text-gray-600 font-light">Loading article...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-8 rounded-3xl text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-3">Article Not Found</h2>
            <p className="mb-6 font-light">{error || 'The article you are looking for does not exist.'}</p>
            <Link
              href="/home"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#009FFF] text-white rounded-2xl hover:bg-[#007ACC] transition-all duration-300 font-medium text-sm hover:scale-105"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-[#009FFF] to-[#007ACC] transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      {/* Floating Navigation */}
      <div className={`
        fixed top-4 left-4 right-4 z-40 transition-all duration-500
        ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
      `}>
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="group flex items-center gap-2 text-gray-600 hover:text-[#009FFF] transition-all duration-300 font-light"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#009FFF]/10 flex items-center justify-center transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span className="hidden sm:inline">Back</span>
                </button>
                
                <div className="w-px h-6 bg-gray-200" />
                
                <Link
                  href={`/category/${encodeURIComponent(post.category)}`}
                  className="text-[#009FFF] hover:text-[#007ACC] text-sm font-medium transition-colors duration-300"
                >
                  {post.category}
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-light hidden sm:inline">
                  {Math.round(scrollProgress)}% read
                </span>
                <button
                  onClick={() => setShowShareButtons(!showShareButtons)}
                  className="group flex items-center gap-2 text-gray-600 hover:text-[#009FFF] transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-100 group-hover:bg-[#009FFF]/10 flex items-center justify-center transition-all duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Buttons Dropdown */}
      {showShareButtons && (
        <div className="fixed top-20 right-4 z-40 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 p-4">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-[#1DA1F2] hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="text-sm">Twitter</span>
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-[#0077B5] hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm">LinkedIn</span>
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-[#009FFF] hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16">
          {/* Category Badge */}
          <div className="mb-6">
            <Link
              href={`/category/${encodeURIComponent(post.category)}`}
              className="inline-flex items-center gap-2 bg-[#009FFF]/10 text-[#009FFF] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#009FFF]/20 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {post.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6 sm:mb-8 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
              <span className="font-light">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-light">{post.readTime}</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-light">{Math.round(scrollProgress)}% read</span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-gradient-to-r from-gray-50 to-[#009FFF]/5 p-6 sm:p-8 rounded-3xl border border-gray-100">
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-light italic">
              {post.excerpt}
            </p>
          </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden mb-12 sm:mb-16 shadow-2xl shadow-gray-200/50">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}

        {/* Article Content */}
        <article className="mb-16 sm:mb-20">
          <div className="prose prose-lg sm:prose-xl max-w-none prose-headings:font-light prose-headings:text-gray-900 prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-relaxed prose-p:font-light prose-a:text-[#009FFF] prose-a:no-underline hover:prose-a:text-[#007ACC] prose-strong:text-gray-900 prose-strong:font-medium prose-blockquote:border-l-[#009FFF] prose-blockquote:bg-[#009FFF]/5 prose-blockquote:rounded-r-2xl prose-blockquote:p-6">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-100 pt-12 sm:pt-16">
            <div className="mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-3 tracking-tight">
                Continue Reading
              </h2>
              <p className="text-gray-600 font-light">
                More articles from {post.category}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <Link
                  key={relatedPost._id}
                  href={`/post/${relatedPost.slug}`}
                  className="group"
                >
                  <article 
                    className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#009FFF]/10 transition-all duration-700 hover:-translate-y-4 border border-gray-100 hover:border-[#009FFF]/20 h-full"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    {relatedPost.coverImage && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-1000"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                          <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                            {relatedPost.readTime}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-lg sm:text-xl font-light text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2 leading-7 tracking-tight">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed font-light text-sm">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-[#009FFF]/20 transition-colors duration-300">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-[#009FFF] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                          <span className="text-xs text-gray-500 font-light">
                            Related Article
                          </span>
                        </div>
                        
                        <div className="flex items-center text-gray-400 group-hover:text-[#009FFF] transition-all duration-300 group-hover:translate-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

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
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-top-2 {
          animation: slideInFromTop 0.3s ease-out;
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
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