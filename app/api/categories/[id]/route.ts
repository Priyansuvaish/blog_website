import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Post from '@/models/Post'

// GET specific category
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    
    // Ensure Post model is registered before populate
    Post
    
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