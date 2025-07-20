import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Category from '@/models/Category'
import Post from '@/models/Post'

// GET all categories
export async function GET() {
  try {
    await connectDB()
    
    // Ensure Post model is registered
    Post
    
    // Get all categories (without populating post_ids since we'll query dynamically)
    const categories = await Category.find({}).sort({ name: 1 })
    
    // Dynamically populate post_ids by querying posts for each category
    const categoriesWithDynamicPosts = await Promise.all(
      categories.map(async (category) => {
        // Query posts that belong to this category
        const posts = await Post.find({ category: category.name })
          .select('title slug createdAt')
          .sort({ createdAt: -1 })
          .lean()
        
        // Check if category has posts created today
        const today = new Date().toDateString()
        const hasNewPosts = posts.some((post: any) => {
          const postDate = new Date(post.createdAt).toDateString()
          return postDate === today
        })
        
        // Return category with dynamically populated post_ids
        return {
          ...category.toObject(),
          post_ids: posts, // Dynamically populated with current posts
          hasNewPosts
        }
      })
    )
    
    return NextResponse.json(categoriesWithDynamicPosts)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
} 