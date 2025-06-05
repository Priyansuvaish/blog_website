import { NextResponse } from 'next/server'
import Post from '@/models/Post'
import User from '@/models/User'
import connectDB from '@/lib/mongodb'
import { MongoError } from 'mongodb'

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
    const body = await request.json()
    console.log('Received post data:', body)

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    if (!body.content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }
    if (!body.coverImage) {
      return NextResponse.json(
        { error: 'Cover image is required' },
        { status: 400 }
      )
    }
    if (!body.sections || !Array.isArray(body.sections) || body.sections.length === 0) {
      return NextResponse.json(
        { error: 'At least one section is required' },
        { status: 400 }
      )
    }

    await connectDB()
    
    // Create slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')

    const post = await Post.create({
      ...body,
      slug
    })

    console.log('Post created successfully:', post)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    // Check for duplicate key error (e.g., duplicate slug)
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: 'A post with this title already exists' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create post' },
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