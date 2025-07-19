"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Loading from "@/components/Loading";
import ShareButton from "@/components/ShareButton";
import SafeImage from "@/components/SafeImage";

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

// Helper function to format date
function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper function to format date for mobile
function formatMobileDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function PropertyPostClient({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const slug = params.slug;
  
  const [propertyBlog, setPropertyBlog] = useState<PropertyBlog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);

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

  // Handle scroll for floating header
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingHeader(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        {/* Desktop Error */}
        <div className="hidden xl:block container mx-auto px-4 sm:px-6 py-16 sm:py-24">
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
        
        {/* Mobile Error */}
        <div className="xl:hidden px-4 py-8">
          <div className="max-w-sm mx-auto text-center">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <h1 className="text-lg font-medium text-gray-900 mb-2">{error}</h1>
              <p className="text-gray-600 text-sm mb-4">Property might have been moved or doesn't exist.</p>
              <Link 
                href="/home" 
                className="inline-flex items-center gap-2 bg-[#009FFF] text-white px-4 py-2.5 rounded-xl text-sm font-medium active:scale-95 transition-transform duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Floating Header */}
      <div className={`xl:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-40 transition-all duration-300 ${
        showFloatingHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h1 className="flex-1 mx-3 text-sm font-medium text-gray-900 truncate">
              {propertyBlog.name}
            </h1>
            
            <ShareButton 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/property-post/${propertyBlog.slug}`}
              title={propertyBlog.name}
            />
          </div>
        </div>
      </div>

      {/* Mobile Hero Section */}
      <div className="xl:hidden relative">
        {propertyBlog.hero_image && (
          <div className="relative h-[60vh] overflow-hidden">
            <SafeImage
              s3Key={propertyBlog.hero_image}
              alt={propertyBlog.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
            
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.back()}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl active:scale-95 transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2">
                  {allImages.length > 1 && (
                    <button
                      onClick={() => {
                        setSelectedImageIndex(0);
                        setIsImageGalleryOpen(true);
                      }}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl active:scale-95 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-white text-sm font-medium">{allImages.length}</span>
                    </button>
                  )}
                  
                  <ShareButton 
                    url={`${typeof window !== 'undefined' ? window.location.origin : ''}/property-post/${propertyBlog.slug}`}
                    title={propertyBlog.name}
                  />
                </div>
              </div>
            </div>

            {/* Property Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h1 className="text-2xl font-medium text-white mb-2 leading-tight">
                {propertyBlog.name}
              </h1>
              <div className="flex items-center gap-3 text-white/90 text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Property Details
                </span>
                <span className="w-1 h-1 bg-white/60 rounded-full"></span>
                <span>{formatMobileDate(propertyBlog.createdAt)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Hero Section */}
      <div className="hidden xl:block relative">
        {propertyBlog.hero_image && (
          <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
            <SafeImage
              s3Key={propertyBlog.hero_image}
              alt={propertyBlog.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-10">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 bg-white/95 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-xl hover:bg-white transition-all duration-300 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
            </div>

            {/* Property Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-8 lg:p-12">
              <div className="container mx-auto">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4 leading-tight">
                  {propertyBlog.name}
                </h1>
                <div className="flex items-center gap-4 text-white/90 text-sm sm:text-base">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Property Details
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6m-6 0v6a2 2 0 002 2h2a2 2 0 002-2V7" />
                    </svg>
                    {formatFullDate(propertyBlog.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Content */}
      <div className="xl:hidden px-4 py-6">
        {/* Property Content */}
        <div className="prose prose-sm max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: propertyBlog.content }}
          />
        </div>

        {/* Sub Images Gallery */}
        {propertyBlog.sub_images && propertyBlog.sub_images.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Gallery</h3>
              <span className="text-sm text-gray-500">{propertyBlog.sub_images.length} photos</span>
            </div>
            
            {/* Horizontal Scrolling Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {propertyBlog.sub_images.map((image, index) => (
                <div 
                  key={index}
                  className="relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden active:scale-95 transition-transform duration-200"
                  onClick={() => {
                    setSelectedImageIndex(index + 1); // +1 because hero image is at index 0
                    setIsImageGalleryOpen(true);
                  }}
                >
                  <SafeImage
                    s3Key={image}
                    alt={`${propertyBlog.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 active:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                      <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Property Details Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Updated {formatMobileDate(propertyBlog.updatedAt)}</span>
            <ShareButton 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/property-post/${propertyBlog.slug}`}
              title={propertyBlog.name}
            />
          </div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="hidden xl:block container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Share Button */}
          <div className="mb-8 flex justify-end">
            <ShareButton 
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/property-post/${propertyBlog.slug}`}
              title={propertyBlog.name}
            />
          </div>

          {/* Property Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: propertyBlog.content }}
            />
          </div>

          {/* Sub Images Gallery */}
          {propertyBlog.sub_images && propertyBlog.sub_images.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-light text-gray-900 mb-8">Property Gallery</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {propertyBlog.sub_images.map((image, index) => (
                  <div 
                    key={index}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setSelectedImageIndex(index + 1); // +1 because hero image is at index 0
                      setIsImageGalleryOpen(true);
                    }}
                  >
                    <SafeImage
                      s3Key={image}
                      alt={`${propertyBlog.name} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Property Details Footer */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                <span>Last updated: {formatFullDate(propertyBlog.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-4">
                <ShareButton 
                  url={`${typeof window !== 'undefined' ? window.location.origin : ''}/property-post/${propertyBlog.slug}`}
                  title={propertyBlog.name}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="xl:hidden h-8"></div>

      {/* Desktop Image Gallery Modal */}
      {isImageGalleryOpen && (
        <div className="hidden xl:flex fixed inset-0 bg-black/95 z-50 items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Close Button */}
            <button
              onClick={() => setIsImageGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImageIndex(selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Current Image */}
            <div className="relative max-w-5xl max-h-[80vh]">
              <SafeImage
                s3Key={allImages[selectedImageIndex]}
                alt={`${propertyBlog.name} - Gallery Image`}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] w-auto"
                sizes="100vw"
              />
            </div>

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Image Gallery Modal */}
      {isImageGalleryOpen && (
        <div className="xl:hidden fixed inset-0 bg-black z-50">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsImageGalleryOpen(false)}
                className="flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl active:scale-95 transition-all duration-200"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {allImages.length > 1 && (
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-xl">
                  <span className="text-white text-sm font-medium">
                    {selectedImageIndex + 1} / {allImages.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Image Container */}
          <div className="flex items-center justify-center w-full h-full p-4">
            <div className="relative w-full h-full max-w-lg">
              <SafeImage
                s3Key={allImages[selectedImageIndex]}
                alt={`${propertyBlog.name} - Gallery Image`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Navigation - Swipe Areas */}
          {allImages.length > 1 && (
            <>
              {/* Left Swipe Area */}
              <div 
                className="absolute left-0 top-0 w-1/3 h-full flex items-center justify-start pl-4"
                onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1)}
              >
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-50 active:opacity-100 active:scale-95 transition-all duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </div>

              {/* Right Swipe Area */}
              <div 
                className="absolute right-0 top-0 w-1/3 h-full flex items-center justify-end pr-4"
                onClick={() => setSelectedImageIndex(selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0)}
              >
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-50 active:opacity-100 active:scale-95 transition-all duration-200">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </>
          )}

          {/* Dots Indicator */}
          {allImages.length > 1 && allImages.length <= 8 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    selectedImageIndex === index 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 active:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
} 