import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Post from '@/models/Post'

// GET specific category
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const category = await Category.findById(params.id).populate('post_ids', 'title slug')
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
  }
}

// UPDATE category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { name, post_ids } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await Category.findById(params.id)
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if name is already taken by another category
    const duplicateCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: params.id }
    })
    if (duplicateCategory) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Validate post_ids if provided
    if (post_ids && post_ids.length > 0) {
      const validPosts = await Post.find({ _id: { $in: post_ids } })
      if (validPosts.length !== post_ids.length) {
        return NextResponse.json({ error: 'Some post IDs are invalid' }, { status: 400 })
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      params.id,
      { name, post_ids: post_ids || [] },
      { new: true }
    ).populate('post_ids', 'title slug')

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    
    const category = await Category.findByIdAndDelete(params.id)
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
} 