import { MetadataRoute } from 'next'
import connectDB from '../lib/mongodb'
import Post from '../models/Post'
import PropertyBlog from '../models/PropertyBlog'
import Category from '../models/Category'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blog.earthfields.in'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ]

  try {
    await connectDB()

    // Get all posts
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean()
    const postPages = posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Get all property posts
    const propertyPosts = await PropertyBlog.find({}).sort({ createdAt: -1 }).lean()
    const propertyPages = propertyPosts.map((property) => ({
      url: `${baseUrl}/property-post/${property.slug}`,
      lastModified: new Date(property.updatedAt || property.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // Get all categories
    const categories = await Category.find({}).lean()
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/category/${encodeURIComponent(category.name)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [
      ...staticPages,
      ...postPages,
      ...propertyPages,
      ...categoryPages,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages if database connection fails
    return staticPages
  }
} 