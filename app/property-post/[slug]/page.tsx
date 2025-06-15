"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/Loading";

interface PropertyBlog {
  _id: string;
  name: string;
  slug: string;
  hero_image: string;
  sub_images?: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Function to format relative date
const formatRelativeDate = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "1d ago";
  } else {
    return `${diffInDays}d ago`;
  }
};

// Function to format full date
const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function PropertyBlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [propertyBlog, setPropertyBlog] = useState<PropertyBlog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);

  useEffect(() => {
    const fetchPropertyBlog = async () => {
      try {
        const response = await fetch(`/api/property-posts/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("Property not found");
          } else {
            setError("Failed to load property details");
          }
          return;
        }
        
        const data = await response.json();
        setPropertyBlog(data);
      } catch (error) {
        console.error("Error fetching property blog:", error);
        setError("Failed to load property details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPropertyBlog();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <Loading 
        variant="spinner" 
        size="xl" 
        text="Loading property details..." 
        fullScreen={true} 
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 rounded-3xl p-8 sm:p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-4">{error}</h1>
              <p className="text-gray-600 font-light mb-8 leading-relaxed">The property you're looking for might have been moved or doesn't exist.</p>
              <Link 
                href="/home" 
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#009FFF] to-[#007ACC] text-white px-8 py-4 rounded-2xl hover:shadow-lg hover:shadow-[#009FFF]/25 transition-all duration-300 font-medium hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!propertyBlog) {
    return null;
  }

  // Prepare all images (hero + sub images)
  const allImages = [
    propertyBlog.hero_image,
    ...(propertyBlog.sub_images || [])
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Breadcrumb */}
      {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-6">
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/home" className="text-gray-500 hover:text-[#009FFF] transition-colors duration-300 font-medium">
              Home
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/properties" className="text-gray-500 hover:text-[#009FFF] transition-colors duration-300 font-medium">
              Properties
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">Property Details</span>
          </nav>
        </div>
      </div> */}

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#009FFF]/10 to-[#007ACC]/10 text-[#009FFF] px-4 py-2 rounded-full text-sm font-medium border border-[#009FFF]/20">
                <div className="w-2 h-2 bg-[#009FFF] rounded-full animate-pulse"></div>
                Featured Property
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatRelativeDate(propertyBlog.createdAt)}
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
              {propertyBlog.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[#009FFF]/20 to-[#007ACC]/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#009FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0v8a2 2 0 01-2 2v0a2 2 0 01-2-2V7z" />
                  </svg>
                </div>
                <span className="font-light">Published {formatFullDate(propertyBlog.createdAt)}</span>
              </div>
              {propertyBlog.updatedAt !== propertyBlog.createdAt && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="font-light">Updated {formatFullDate(propertyBlog.updatedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-light">{allImages.length} Photos Available</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content - Takes 3 columns */}
            <div className="xl:col-span-3">
              {/* Enhanced Image Gallery */}
              {allImages.length > 0 && (
                <div className="mb-12 sm:mb-16">
                  {/* Main Image */}
                  <div className="relative aspect-[16/9] rounded-3xl overflow-hidden mb-6 group shadow-2xl shadow-gray-900/20">
                    <Image
                      src={allImages[selectedImageIndex]}
                      alt={propertyBlog.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Enhanced Image Navigation */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
                          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white text-gray-800 p-3 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {/* Enhanced Image Counter */}
                    {allImages.length > 1 && (
                      <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-medium">
                        {selectedImageIndex + 1} of {allImages.length}
                      </div>
                    )}

                    {/* View All Photos Button */}
                    <button
                      onClick={() => setIsImageGalleryOpen(true)}
                      className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md text-gray-800 px-4 py-2 rounded-2xl text-sm font-medium hover:bg-white transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        View All Photos
                      </div>
                    </button>
                  </div>

                  {/* Enhanced Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                      {allImages.slice(0, 8).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                            selectedImageIndex === index 
                              ? 'border-[#009FFF] shadow-lg shadow-[#009FFF]/25 scale-105' 
                              : 'border-gray-200 hover:border-[#009FFF]/50'
                          }`}
                        >
                          <Image
                            src={image}
                            alt={`${propertyBlog.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === 7 && allImages.length > 8 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">+{allImages.length - 8}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Content */}
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
                <div className="prose prose-lg prose-gray max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed font-light [&>h1]:text-3xl [&>h1]:font-light [&>h1]:text-gray-900 [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-light [&>h2]:text-gray-900 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:text-gray-900 [&>h3]:mb-3 [&>p]:mb-6 [&>ul]:mb-6 [&>ol]:mb-6 [&>blockquote]:border-l-4 [&>blockquote]:border-[#009FFF] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: propertyBlog.content }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar - Takes 1 column */}
            <div className="xl:col-span-1">
              <div className="sticky top-8 space-y-8">
                {/* Enhanced Property Info Card */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-200 shadow-lg shadow-gray-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Property Details</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-light">Property Name</span>
                      <span className="font-medium text-gray-900 text-right text-sm">{propertyBlog.name}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-light">Listed</span>
                      <span className="font-medium text-gray-900">{formatRelativeDate(propertyBlog.createdAt)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-light">Total Photos</span>
                      <span className="font-medium text-gray-900">{allImages.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3">
                      <span className="text-gray-600 font-light">Availability</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent text-sm font-medium">
                          Available Now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Contact Card */}
                <div className="bg-gradient-to-br from-[#009FFF]/5 via-[#009FFF]/10 to-[#007ACC]/5 border border-[#009FFF]/20 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#009FFF]/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#009FFF] to-[#007ACC] rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-light text-gray-900">Get In Touch</h3>
                    </div>
                    
                    <p className="text-gray-700 font-light mb-8 leading-relaxed">
                      Interested in this property? Contact our expert team for detailed information, site visits, or personalized consultation.
                    </p>
                    
                    <div className="space-y-4">
                      <button className="w-full bg-gradient-to-r from-[#009FFF] to-[#007ACC] text-white py-4 px-6 rounded-2xl hover:shadow-lg hover:shadow-[#009FFF]/25 transition-all duration-300 font-medium hover:scale-105">
                        Contact Our Experts
                      </button>
                      
                      <button className="w-full border-2 border-[#009FFF] text-[#009FFF] py-4 px-6 rounded-2xl hover:bg-[#009FFF]/5 transition-all duration-300 font-medium hover:scale-105">
                        Schedule Site Visit
                      </button>
                      
                      <button className="w-full bg-white/50 backdrop-blur-sm text-gray-700 py-4 px-6 rounded-2xl hover:bg-white/80 transition-all duration-300 font-medium border border-gray-200">
                        Request Brochure
                      </button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Share & Save Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg shadow-gray-200/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-light text-gray-900">Share & Save</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-2xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-sm font-medium hover:scale-105">
                      Share Property
                    </button>
                    
                    <button className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-300 transition-all duration-300 text-sm font-medium hover:scale-105">
                      Save for Later
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 font-light text-center">
                      Share this property with friends or save it to your favorites for quick access later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Navigation Footer */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <Link 
                href="/home" 
                className="inline-flex items-center gap-3 text-[#009FFF] hover:text-[#007ACC] transition-all duration-300 font-medium group"
              >
                <div className="w-10 h-10 bg-[#009FFF]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#009FFF]/20 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </div>
                <span className="text-lg">Browse All Properties</span>
              </Link>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-light">Property ID:</span>
                <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                  {propertyBlog._id.slice(-8).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}