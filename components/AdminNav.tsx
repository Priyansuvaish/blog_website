import Link from 'next/link'

export default function AdminNav() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/admin" className="text-xl font-bold">Admin Dashboard</Link>
      </div>
    </nav>
  )
} 