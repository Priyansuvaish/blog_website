import { NextResponse } from 'next/server'
import PropertyBlog from '@/models/PropertyBlog'
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
    
    let query = PropertyBlog.find()
      .sort(sortObject)
      .select('name slug hero_image sub_images content createdAt updatedAt')
      .lean()
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (limitNum > 0) {
        query = query.limit(limitNum)
      }
    }
    
    const propertyPosts = await query.exec()

    return NextResponse.json(propertyPosts)
  } catch (error) {
    console.error('Error fetching property posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property posts' },
      { status: 500 }
    )
  }
} 