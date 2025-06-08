import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Post from '@/models/Post'

// GET all categories
export async function GET() {
  try {
    await connectDB()
    const categories = await Category.find({}).populate('post_ids', 'title slug createdAt').sort({ name: 1 })
    
    // Add hasNewPosts flag for each category
    const categoriesWithNewPostFlag = categories.map(category => {
      const today = new Date().toDateString()
      const hasNewPosts = category.post_ids.some((post: any) => {
        const postDate = new Date(post.createdAt).toDateString()
        return postDate === today
      })
      
      return {
        ...category.toObject(),
        hasNewPosts
      }
    })
    
    return NextResponse.json(categoriesWithNewPostFlag)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// CREATE a new category
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const { name, icon = 'MdCategory', post_ids = [] } = await request.json()

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } })
    if (existingCategory) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 })
    }

    // Validate post_ids if provided
    if (post_ids.length > 0) {
      const validPosts = await Post.find({ _id: { $in: post_ids } })
      if (validPosts.length !== post_ids.length) {
        return NextResponse.json({ error: 'Some post IDs are invalid' }, { status: 400 })
      }
    }

    const category = new Category({ name, icon, post_ids })
    await category.save()

    const populatedCategory = await Category.findById(category._id).populate('post_ids', 'title slug')
    return NextResponse.json(populatedCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
} 