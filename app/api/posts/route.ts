import { NextResponse } from 'next/server'
import Post from '@/models/Post'
import connectDB from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const sort = searchParams.get('sort') || 'createdAt:desc'
    
    // Parse sort parameter (format: field:direction)
    const [sortField, sortDirection] = sort.split(':')
    const sortObject: Record<string, 1 | -1> = { [sortField]: sortDirection === 'desc' ? -1 : 1 }
    
    let query = Post.find()
      .sort(sortObject)
      .select('title slug content metadata category coverImage createdAt updatedAt readTime')
      .lean()
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (limitNum > 0) {
        query = query.limit(limitNum)
      }
    }
    
    const posts = await query.exec()

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
} 