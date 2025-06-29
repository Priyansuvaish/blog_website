import PropertyPostClient from '@/app/property-post/[slug]/PropertyPostClient'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/property-posts/${params.slug}`)
    
    if (!response.ok) {
      return {
        title: 'Property Not Found | Earthfields Blog',
        description: 'The requested property listing could not be found.',
      }
    }

    const property = await response.json()
    
    // Create a description from the property name and content
    const description = `Discover ${property.name} - Explore this featured property listing with detailed insights, images, and expert analysis from Earthfields.`
    
    return {
      title: `${property.name} - Property Listing`,
      description: description,
      keywords: ['property listing', 'land for sale', 'real estate', 'property investment', 'Earthfields', 'land transactions'],
      authors: [{ name: 'Earthfields Team' }],
      creator: 'Earthfields',
      publisher: 'Earthfields',
      alternates: {
        canonical: `/property-post/${property.slug}`,
      },
      openGraph: {
        title: `${property.name} - Property Listing`,
        description: description,
        type: 'article',
        publishedTime: property.createdAt,
        modifiedTime: property.updatedAt,
        authors: ['Earthfields Team'],
        section: 'Property Listings',
        tags: ['property listing', 'land for sale', 'real estate', 'property investment'],
        images: [
          {
            url: property.hero_image || '/EF_Journal_Logo.png',
            width: 1200,
            height: 630,
            alt: property.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${property.name} - Property Listing`,
        description: description,
        images: [property.hero_image || '/EF_Journal_Logo.png'],
        creator: '@earthfields',
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Property Listing | Earthfields Blog',
      description: 'Explore featured property listings and land opportunities from Earthfields.',
    }
  }
}

// Server component that renders the client component
export default function PropertyBlogDetailPage({ params }: { params: { slug: string } }) {
  return <PropertyPostClient params={params} />
}