'use client'

import { useState } from 'react'
import { 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Link, 
  MessageCircle,
  Check,
  X
} from 'lucide-react'

interface ShareButtonProps {
  title: string
  url: string
  description?: string
  className?: string
}

export default function ShareButton({ title, url, description = '', className = '' }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareData = {
    title,
    url,
    description
  }

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'hover:bg-blue-500 hover:text-white',
      action: () => {
        const text = `${shareData.title}\n\n${shareData.description}`
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareData.url)}&via=earthfields`
        window.open(twitterUrl, '_blank', 'width=600,height=400')
      }
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-600 hover:text-white',
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.title)}`
        window.open(facebookUrl, '_blank', 'width=600,height=400')
      }
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-blue-700 hover:text-white',
      action: () => {
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.description)}`
        window.open(linkedinUrl, '_blank', 'width=600,height=400')
      }
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-500 hover:text-white',
      action: () => {
        const whatsappText = `*${shareData.title}*\n\n${shareData.description}\n\nRead more: ${shareData.url}`
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`
        window.open(whatsappUrl, '_blank')
      }
    }
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareData.url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={handleNativeShare}
        className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#009FFF] to-[#007ACC] text-white rounded-xl hover:shadow-lg hover:shadow-[#009FFF]/25 transition-all duration-300 hover:scale-105"
      >
        <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-medium text-sm">Share</span>
      </button>

      {/* Share Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Share Panel */}
          <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 min-w-[280px] animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Share this article</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Social Media Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon
                return (
                  <button
                    key={platform.name}
                    onClick={() => {
                      platform.action()
                      setIsOpen(false)
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 transition-all duration-200 ${platform.color} hover:border-transparent hover:shadow-md`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium text-sm">{platform.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Copy Link */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 font-mono truncate">
                  {shareData.url}
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    copied 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Link className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 mt-1 animate-in slide-in-from-bottom-1 duration-200">
                  Link copied to clipboard!
                </p>
              )}
            </div>

            {/* Share Stats (Optional) */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Help others discover quality content about land transactions
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 