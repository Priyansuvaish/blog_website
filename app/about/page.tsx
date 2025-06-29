import AboutClient from '@/app/about/AboutClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Earthfields - Revolutionizing Land Transactions',
  description: 'Learn about Earthfields, India\'s first exclusive platform for land transactions. We combine technology and expertise to empower organized demand, supply, and transactions in the land market.',
  keywords: ['about Earthfields', 'land platform', 'property technology', 'land transactions', 'real estate innovation', 'land market', 'property platform'],
  authors: [{ name: 'Earthfields Team' }],
  creator: 'Earthfields',
  publisher: 'Earthfields',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Earthfields - Revolutionizing Land Transactions',
    description: 'Learn about Earthfields, India\'s first exclusive platform for land transactions. We combine technology and expertise to empower organized demand, supply, and transactions.',
    type: 'website',
    images: [
      {
        url: '/EF_Journal_Logo.png',
        width: 1200,
        height: 630,
        alt: 'About Earthfields - Land Transaction Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Earthfields - Revolutionizing Land Transactions',
    description: 'Learn about Earthfields, India\'s first exclusive platform for land transactions.',
    images: ['/EF_Journal_Logo.png'],
    creator: '@earthfields',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Server component that renders the client component
export default function AboutPage() {
  return <AboutClient />
}