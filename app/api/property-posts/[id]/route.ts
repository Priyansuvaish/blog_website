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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await request.json()
    
    // Find the property post first to trigger the pre-save middleware for slug generation
    const propertyPost = await PropertyBlog.findById(params.id)
    if (!propertyPost) {
      return NextResponse.json(
        { error: 'Property post not found' },
        { status: 404 }
      )
    }
    
    // Update the property post fields
    Object.assign(propertyPost, {
      ...body,
      updatedAt: new Date(),
    })
    
    // Save the property post (this will trigger slug regeneration if name changed)
    await propertyPost.save()

    return NextResponse.json(propertyPost)
  } catch (error) {
    console.error('Error updating property post:', error)
    return NextResponse.json(
      { error: 'Failed to update property post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const propertyPost = await PropertyBlog.findByIdAndDelete(params.id)

    if (!propertyPost) {
      return NextResponse.json(
        { error: 'Property post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Property post deleted successfully' })
  } catch (error) {
    console.error('Error deleting property post:', error)
    return NextResponse.json(
      { error: 'Failed to delete property post' },
      { status: 500 }
    )
  }
} 