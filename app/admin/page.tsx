import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/posts" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Posts</h2>
          <p className="text-gray-600">View, edit, and delete blog posts</p>
        </Link>

        <Link href="/admin/categories" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
          <p className="text-gray-600">Create and organize post categories</p>
        </Link>

        <Link href="/admin/create-post" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Create New Post</h2>
          <p className="text-gray-600">Write and publish a new blog post</p>
        </Link>

        <Link href="/admin/property-posts" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Property Posts</h2>
          <p className="text-gray-600">View, edit, and delete property blog posts</p>
        </Link>

        <Link href="/admin/create-property-post" className="bg-white p-6 rounded-lg shadow border hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-teal-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Create Property Post</h2>
          <p className="text-gray-600">Create a new property blog post</p>
        </Link>
      </div>
    </div>
  )
} 