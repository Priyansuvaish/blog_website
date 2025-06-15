'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClimbingBoxLoader, DotLoader } from "react-spinners";

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/home')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
    <DotLoader speedMultiplier={5} />
    </div>
  </div>
  )
} 