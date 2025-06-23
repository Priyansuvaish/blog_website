import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Comment from '@/models/Comment'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const comments = await Comment.find({ post: params.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { content, username } = body

    // Validation
    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (!username?.trim()) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const comment = await Comment.create({
      content: content.trim(),
      post: params.id,
      username: username.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
} 