'use client'

import PropertyPostEditor from '@/components/PropertyPostEditor'

export default function CreatePropertyPostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Property Post</h1>
      <PropertyPostEditor />
    </div>
  )
} 