'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/components/Loading'


export default function RootPageWithLogo() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loadingStage, setLoadingStage] = useState('logo')
  const [logoVisible, setLogoVisible] = useState(false)
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const logoTimer = setTimeout(() => setLogoVisible(true), 200)
    const loadingTimer = setTimeout(() => {
      setLoadingStage('loading')
      setShowLoading(true)
    }, 1000)
    const navigationTimer = setTimeout(() => {
      setLoadingStage('complete')
      router.replace('/home')
    }, 3000)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(loadingTimer)
      clearTimeout(navigationTimer)
    }
  }, [router, mounted])

  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/earthfieldslinklogo.png";

  // Show nothing until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 py-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="mb-8">
              <div className="relative mb-6">
                <div className="relative w-32 h-32 mx-auto">
                  <img 
                    src={logoUrl} 
                    alt="Property Hub Logo" 
                    className="w-full h-full object-contain opacity-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          
          {/* Replace this section with your actual logo */}
          <div className={`mb-8 transition-all duration-1000 ease-out transform ${
            logoVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            
            {/* Your actual logo image */}
            <div className="relative mb-6">
              <div className={`absolute inset-0 w-32 h-32 mx-auto  rounded-3xl blur-2xl transition-all duration-1000 ${
                logoVisible ? 'opacity-20 scale-110' : 'opacity-0 scale-100'
              }`}></div>
              
              <div className="relative w-32 h-32 mx-auto">
                {/* Replace src with your actual logo path */}
                <img 
                  src={logoUrl} 
                  alt="Property Hub Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* <h1 className={`text-3xl sm:text-4xl font-light text-gray-900 tracking-tight transition-all duration-1000 delay-300 ${
              logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              Property Hub
            </h1> */}
          </div>

          {/* Loading section remains the same */}
          <div className={`transition-all duration-800 ease-out ${
            showLoading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {showLoading && (
              <Loading 
                variant="spinner" 
                size="lg" 
                text="Preparing your experience" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
