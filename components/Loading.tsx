'use client'

import { useEffect, useState } from 'react'

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'wave' | 'minimal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  fullScreen?: boolean
  overlay?: boolean
}

export default function Loading({ 
  variant = 'spinner', 
  size = 'md', 
  text = '',
  className = '',
  fullScreen = false,
  overlay = false
}: LoadingProps) {
  const [dots, setDots] = useState('.')

  // Animated dots for text
  useEffect(() => {
    if (!text) return
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)
    
    return () => clearInterval(interval)
  }, [text])

  // Size configurations
  const sizeConfig = {
    sm: {
      spinner: 'w-6 h-6',
      dots: 'w-2 h-2',
      text: 'text-sm',
      container: 'gap-3',
      skeleton: 'h-4'
    },
    md: {
      spinner: 'w-8 h-8',
      dots: 'w-3 h-3',
      text: 'text-base',
      container: 'gap-4',
      skeleton: 'h-6'
    },
    lg: {
      spinner: 'w-12 h-12',
      dots: 'w-4 h-4',
      text: 'text-lg',
      container: 'gap-5',
      skeleton: 'h-8'
    },
    xl: {
      spinner: 'w-16 h-16',
      dots: 'w-5 h-5',
      text: 'text-xl',
      container: 'gap-6',
      skeleton: 'h-10'
    }
  }

  const config = sizeConfig[size]

  // Loading variants
  const LoadingSpinner = () => (
    <div className={`${config.spinner} relative`}>
      <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
      <div className="absolute inset-0 rounded-full border-4 border-[#009FFF] border-t-transparent animate-spin"></div>
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#009FFF]/20 to-transparent animate-pulse"></div>
    </div>
  )

  const LoadingDots = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`${config.dots} bg-[#009FFF] rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  )

  const LoadingPulse = () => (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={`w-1 bg-[#009FFF] rounded-full animate-pulse`}
          style={{
            height: size === 'sm' ? '16px' : size === 'md' ? '20px' : size === 'lg' ? '24px' : '28px',
            animationDelay: `${index * 0.1}s`,
            animationDuration: '1.5s'
          }}
        />
      ))}
    </div>
  )

  const LoadingSkeleton = () => (
    <div className="space-y-4 w-full max-w-md">
      {[0, 1, 2].map((index) => (
        <div key={index} className="animate-pulse">
          <div className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl ${config.skeleton}`} 
               style={{ width: `${100 - index * 15}%` }}>
            <div className="bg-gradient-to-r from-transparent via-white/50 to-transparent h-full rounded-2xl animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const LoadingWave = () => (
    <div className="flex items-end gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="w-2 bg-[#009FFF] rounded-full animate-wave"
          style={{
            height: size === 'sm' ? '12px' : size === 'md' ? '16px' : size === 'lg' ? '20px' : '24px',
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  )

  const LoadingMinimal = () => (
    <div className="relative">
      <div className={`${config.spinner} border-2 border-gray-100 rounded-full`}></div>
      <div className={`${config.spinner} absolute inset-0 border-2 border-[#009FFF] border-r-transparent rounded-full animate-spin`}></div>
    </div>
  )

  const renderVariant = () => {
    switch (variant) {
      case 'dots':
        return <LoadingDots />
      case 'pulse':
        return <LoadingPulse />
      case 'skeleton':
        return <LoadingSkeleton />
      case 'wave':
        return <LoadingWave />
      case 'minimal':
        return <LoadingMinimal />
      default:
        return <LoadingSpinner />
    }
  }

  const content = (
    <div className={`flex flex-col items-center justify-center ${config.container} ${className}`}>
      {renderVariant()}
      {text && (
        <div className={`${config.text} text-gray-600 font-light tracking-wide`}>
          {text}{dots}
        </div>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          {content}
        </div>
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-3xl">
        <div className="text-center">
          {content}
        </div>
      </div>
    )
  }

  return content
}

// Custom CSS for animations (add to your global CSS or component)
const loadingStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes wave {
    0%, 40%, 100% { transform: scaleY(0.4); }
    20% { transform: scaleY(1); }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
  
  .animate-wave {
    animation: wave 1.2s infinite ease-in-out;
  }
`

// Export styles for use in your app
export { loadingStyles }