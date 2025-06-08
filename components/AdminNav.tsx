import Link from 'next/link'

export default function AdminNav() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold">Admin Dashboard</Link>
        <div className="flex space-x-6">
          <Link href="/admin/posts" className="hover:text-gray-300">Posts</Link>
          <Link href="/admin/categories" className="hover:text-gray-300">Categories</Link>
          <Link href="/admin/create-post" className="hover:text-gray-300">Create Post</Link>
        </div>
      </div>
    </nav>
  )
} 