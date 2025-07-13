import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Post from '@/models/Post'

// GET all categories
export async function GET() {
  try {
    await connectDB()
    
    // Ensure Post model is registered before populate
    Post
    
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