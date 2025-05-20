import { NextResponse } from 'next/server'
import Post from '@/models/Post'
import User from '@/models/User'
import connectDB from '@/lib/mongodb'

export async function GET() {
  try {
    await connectDB()
    const posts = await Post.find()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const post = await Post.create(body)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, title, content, excerpt, category, readTime } = body

    await connectDB()
    const post = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        excerpt,
        category,
        readTime,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
} 