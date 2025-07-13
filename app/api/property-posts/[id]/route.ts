import { NextResponse } from 'next/server'
import PropertyBlog from '@/models/PropertyBlog'
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params
    
    let propertyPost;
    
    // Check if the id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Try finding by MongoDB _id first
      propertyPost = await PropertyBlog.findById(id).lean()
    }
    
    // If not found by id or id is not a valid ObjectId, try finding by slug
    if (!propertyPost) {
      propertyPost = await PropertyBlog.findOne({ slug: id }).lean()
    }

    if (!propertyPost) {
      return NextResponse.json(
        { error: 'Property post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(propertyPost)
  } catch (error) {
    console.error('Error fetching property post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property post' },
      { status: 500 }
    )
  }
} 