import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/CommentSection'
import ShareButton from '@/components/ShareButton'
import SafeImage from '@/components/SafeImage'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'

interface PostType {
  _id: string
  title: string
  slug: string
  content: string
  metadata: string // Renamed from excerpt
  category: string
  readTime: string
  coverImage?: string
  createdAt: string
  updatedAt: string
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const post = await Post.findOne({ slug: params.slug }).lean() as PostType | null
    
    if (!post) {
      return {
        title: 'Post Not Found | Earthfields Blog',
        description: 'The requested blog post could not be found.',
      }
    }
    
    return {
      title: post.title,
      description: post.metadata, // Using the metadata field for SEO description
      keywords: [`${post.category}`, 'land transactions', 'property blog', 'real estate insights', 'Earthfields'],
      authors: [{ name: 'Earthfields Team' }],
      creator: 'Earthfields',
      publisher: 'Earthfields',
      alternates: {
        canonical: `/post/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.metadata,
        type: 'article',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt,
        authors: ['Earthfields Team'],
        section: post.category,
        tags: [post.category, 'land transactions', 'property', 'real estate'],
        images: [
          {
            url: post.coverImage || '/EF_Journal_Logo.png',
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metadata,
        images: [post.coverImage || '/EF_Journal_Logo.png'],
        creator: '@earthfields',
      },
      robots: {
        index: true,
        follow: true,
      },
    }
      } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Blog Post | Earthfields Blog',
      description: 'Discover expert insights on land transactions and property market trends.',
      }
    }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  try {
    await connectDB()
    const postData: any = await Post.findOne({ slug: params.slug }).lean()
    
    if (!postData) {
      notFound()
    }

    // Convert ObjectIds to strings for client components
    const post = {
      ...postData,
      _id: postData._id.toString(),
      createdAt: postData.createdAt.toISOString(),
      updatedAt: postData.updatedAt.toISOString()
    } as PostType

    // Get related posts from the same category
    const relatedPostsData: any[] = await Post.find({ 
      category: postData.category, 
      _id: { $ne: postData._id } 
    })
    .limit(3)
    .lean()

    // Convert ObjectIds to strings for client components
    const relatedPosts = relatedPostsData.map((relatedPost: any) => ({
      ...relatedPost,
      _id: relatedPost._id.toString(),
      createdAt: relatedPost.createdAt.toISOString(),
      updatedAt: relatedPost.updatedAt.toISOString()
    })) as PostType[]

    return (
      <div className="min-h-screen bg-white">
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
            </div>

            {/* Metadata/Description */}
            <div className="bg-gradient-to-r from-gray-50 to-[#009FFF]/5 p-6 sm:p-8 rounded-3xl border border-gray-100">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-light italic">
                {post.metadata}
              </p>
            </div>

            {/* Share Button */}
            <div className="flex justify-end mt-6">
              <ShareButton 
                title={post.title}
                url={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.earthfields.in'}/post/${post.slug}`}
                description={post.metadata}
              />
            </div>
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden mb-12 sm:mb-16 shadow-2xl shadow-gray-200/50">
              <SafeImage
              s3Key={post.coverImage}
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
          {/* Content Separator */}
          <div className="flex items-center gap-4 mb-8 sm:mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
              <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
              <span className="text-sm text-gray-600 font-light">Article Content</span>
              <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg sm:prose-xl max-w-none 
            prose-headings:font-light prose-headings:text-gray-900 prose-headings:tracking-tight prose-headings:mb-6 prose-headings:mt-8
            prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:mb-8 prose-h1:mt-12
            prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mb-6 prose-h2:mt-10
            prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mb-4 prose-h3:mt-8
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:font-light prose-p:mb-6 prose-p:text-base prose-p:sm:text-lg
            prose-a:text-[#009FFF] prose-a:no-underline prose-a:font-medium hover:prose-a:text-[#007ACC] hover:prose-a:underline prose-a:transition-colors prose-a:duration-300
            prose-strong:text-gray-900 prose-strong:font-medium
            prose-em:text-gray-600 prose-em:italic
            prose-blockquote:border-l-4 prose-blockquote:border-l-[#009FFF] prose-blockquote:bg-[#009FFF]/5 prose-blockquote:rounded-r-2xl prose-blockquote:p-6 prose-blockquote:my-8 prose-blockquote:not-italic
            prose-ul:my-6 prose-ul:space-y-2 prose-li:text-gray-700 prose-li:leading-relaxed
            prose-ol:my-6 prose-ol:space-y-2
            prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-8
            prose-hr:border-gray-200 prose-hr:my-12
            prose-table:my-8 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-sm
            prose-th:bg-gray-50 prose-th:text-gray-900 prose-th:font-medium prose-th:p-4
            prose-td:p-4 prose-td:border-t prose-td:border-gray-200">
            
            {post.content && post.content.trim() ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light text-gray-900 mb-2">Content Coming Soon</h3>
                <p className="text-gray-500 font-light">The full article content is being prepared and will be available shortly.</p>
              </div>
            )}
          </div>

          {/* Content Footer - Reading Stats */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime} read</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4M8 7l4 4m0 0l4-4m-4 4V3M4 21h16" />
                </svg>
                <span>Published {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
            <section className="mb-16 sm:mb-20">
              <div className="flex items-center gap-4 mb-8 sm:mb-12">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                  <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
                  <span className="text-sm text-gray-600 font-light">Related Articles</span>
                  <div className="w-2 h-2 bg-[#009FFF] rounded-full"></div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>

              <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost, index) => (
                <Link
                  key={relatedPost._id}
                  href={`/post/${relatedPost.slug}`}
                  className="group"
                >
                  <article 
                      className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#009FFF]/10 transition-all duration-700 hover:-translate-y-4 border border-gray-100 hover:border-[#009FFF]/20 h-full flex flex-col"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                  >
                    {relatedPost.coverImage && (
                      <div className="relative h-48 w-full overflow-hidden">
                          <SafeImage
                          s3Key={relatedPost.coverImage}
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
                    
                      <div className="p-6 sm:p-8 flex-1 flex flex-col">
                        <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2 leading-7 sm:leading-8 tracking-tight">
                        {relatedPost.title}
                      </h3>
                      
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed font-light text-sm sm:text-base flex-1">
                          {relatedPost.metadata}
                      </p>
                      
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-light">
                            {new Date(relatedPost.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                            {relatedPost.readTime}
                          </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

          {/* Comments Section */}
          <CommentSection postId={post._id} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading post:', error)
    notFound()
  }
}