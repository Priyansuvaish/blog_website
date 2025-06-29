import CategoryClient from './CategoryClient'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { name: string } }) {
  try {
    const categoryName = decodeURIComponent(params.name)
    
    // Fetch posts count for this category
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts?category=${encodeURIComponent(categoryName)}`)
    let postsCount = 0
    
    if (response.ok) {
      const posts = await response.json()
      postsCount = posts.length
    }
    
    const description = `Explore ${postsCount} insightful articles about ${categoryName.toLowerCase()} from Earthfields Blog. Discover expert perspectives on land transactions, property insights, and real estate trends.`
    
    return {
      title: `${categoryName} Articles & Insights`,
      description: description,
      keywords: [categoryName.toLowerCase(), 'land transactions', 'property blog', 'real estate insights', 'Earthfields', 'property category'],
      authors: [{ name: 'Earthfields Team' }],
      creator: 'Earthfields',
      publisher: 'Earthfields',
      alternates: {
        canonical: `/category/${encodeURIComponent(categoryName)}`,
      },
      openGraph: {
        title: `${categoryName} Articles & Insights | Earthfields Blog`,
        description: description,
        type: 'website',
        images: [
          {
            url: '/EF_Journal_Logo.png',
            width: 1200,
            height: 630,
            alt: `${categoryName} articles from Earthfields Blog`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} Articles & Insights | Earthfields Blog`,
        description: description,
        images: ['/EF_Journal_Logo.png'],
        creator: '@earthfields',
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    const categoryName = decodeURIComponent(params.name)
    return {
      title: `${categoryName} | Earthfields Blog`,
      description: `Discover articles and insights about ${categoryName.toLowerCase()} from Earthfields Blog.`,
    }
  }
}

// Server component that renders the client component
export default function CategoryPage({ params }: { params: { name: string } }) {
  return <CategoryClient params={params} />
}