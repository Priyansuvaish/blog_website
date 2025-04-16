import { notFound } from 'next/navigation'
import connectDB from '@/lib/mongodb'
import Post from '@/models/Post'
import CommentSection from '@/components/CommentSection'
import { Post as PostType, User } from '@/types/database.types'
import { ObjectId } from 'mongodb'

type PopulatedPost = Omit<PostType, 'author'> & {
  author: User
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  await connectDB()
  
  let postId
  try {
    postId = new ObjectId(params.id)
  } catch (error) {
    notFound()
  }
  
  const post = await Post.findById(postId)
    .populate('author', 'name role avatar')
    .lean() as PopulatedPost | null

  if (!post) {
    notFound()
  }

  return (
    <article className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-blue-600 text-sm font-semibold">{post.category}</span>
            <span className="text-sm text-gray-500">{post.readTime}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img 
                src={post.author.avatar} 
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-gray-500">{post.author.role}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments */}
        <CommentSection postId={post._id.toString()} />

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a 
            href="/blog"
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Blog
          </a>
        </div>
      </div>
    </article>
  )
} 