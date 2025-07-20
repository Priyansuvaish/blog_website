import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Earthfields Blog - Land Insights, Property News & Expert Analysis',
    template: '%s | Earthfields Blog'
  },
  description: 'Discover expert insights on land transactions, property market trends, and real estate analysis from India\'s first exclusive land platform - Earthfields.',
  keywords: ['land transactions', 'property blog', 'real estate insights', 'land market', 'property investment', 'Earthfields', 'land platform', 'property news'],
  authors: [{ name: 'Earthfields Team' }],
  creator: 'Earthfields',
  publisher: 'Earthfields',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blog.earthfields.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://blog.earthfields.in',
    title: 'Earthfields Blog - Land Insights, Property News & Expert Analysis',
    description: 'Discover expert insights on land transactions, property market trends, and real estate analysis from India\'s first exclusive land platform - Earthfields.',
    siteName: 'Earthfields Blog',
    images: [
      {
        url: '/EF_Journal_Logo.png',
        width: 1200,
        height: 630,
        alt: 'Earthfields Blog - Land Insights & Property News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earthfields Blog - Land Insights, Property News & Expert Analysis',
    description: 'Discover expert insights on land transactions, property market trends, and real estate analysis from India\'s first exclusive land platform.',
    images: ['/EF_Journal_Logo.png'],
    creator: '@earthfields',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
}

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Earthfields Blog',
  description: 'Expert insights on land transactions, property market trends, and real estate analysis from India\'s first exclusive land platform.',
  url: 'https://blog.earthfields.in',
  publisher: {
    '@type': 'Organization',
    name: 'Earthfields',
    url: 'https://www.earthfields.in',
    logo: {
      '@type': 'ImageObject',
      url: 'https://blog.earthfields.in/EF_Journal_Logo.png',
      width: 400,
      height: 400,
    },
    sameAs: [
      'https://www.earthfields.in',
    ],
  },
  inLanguage: 'en-IN',
  about: {
    '@type': 'Thing',
    name: 'Land Transactions',
    description: 'Information and insights about land transactions, property investment, and real estate market trends in India.',
  },
  keywords: 'land transactions, property blog, real estate insights, land market, property investment, Earthfields',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="application/rss+xml" title="Earthfields Blog RSS Feed" href="/feed.xml" />
        <meta name="theme-color" content="#009FFF" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3215982645128880"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
} 