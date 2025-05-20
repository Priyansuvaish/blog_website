import React from 'react'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Land Valuation in India',
    excerpt: 'Learn about the key factors that influence land prices and how to make informed decisions.',
    date: 'March 15, 2024',
    category: 'Land Valuation',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Legal Aspects of Land Transactions',
    excerpt: 'A comprehensive guide to legal documentation and processes in land transactions.',
    date: 'March 10, 2024',
    category: 'Legal',
    readTime: '8 min read',
  },
  {
    id: 3,
    title: 'Sustainable Land Development Practices',
    excerpt: 'Explore modern approaches to sustainable land development and environmental conservation.',
    date: 'March 5, 2024',
    category: 'Development',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Digital Transformation in Real Estate',
    excerpt: 'How technology is revolutionizing the way we buy, sell, and manage properties.',
    date: 'February 28, 2024',
    category: 'Technology',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Investment Strategies in Indian Real Estate',
    excerpt: 'Expert insights on making smart real estate investments in the Indian market.',
    date: 'February 20, 2024',
    category: 'Investment',
    readTime: '9 min read',
  },
  {
    id: 6,
    title: 'Urban Planning and Smart Cities',
    excerpt: 'The future of urban development and the role of smart city initiatives.',
    date: 'February 15, 2024',
    category: 'Development',
    readTime: '6 min read',
  },
]

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Latest Articles</h1>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="px-4 py-2 bg-custom-blue text-white rounded-lg">All</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Land Valuation</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Legal</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Development</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Technology</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Investment</button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-blue-600 text-sm font-semibold">{post.category}</span>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex gap-2">
            <button className="px-4 py-2 bg-custom-blue text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">2</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">3</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Next →</button>
          </nav>
        </div>
      </div>
    </div>
  )
} 