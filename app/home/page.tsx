"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CategoryIcon from "@/components/CategoryIcon";
import { DotLoader } from "react-spinners";

interface Category {
  _id: string;
  name: string;
  icon: string;
  post_ids: Array<{
    _id: string;
    title: string;
    slug: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  hasNewPosts: boolean;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  category: string;
  coverImage?: string;
}

interface PropertyPost {
  _id: string;
  name: string;
  slug: string;
  hero_image?: string;
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

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [propertyPosts, setPropertyPosts] = useState<PropertyPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories");
        if (!categoriesResponse.ok) {
          throw new Error("Failed to fetch categories");
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        // Fetch latest posts
        const postsResponse = await fetch(
          "/api/posts?limit=5&sort=createdAt:desc"
        );
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setLatestPosts(postsData);
        }

        // Fetch property posts
        const propertyPostsResponse = await fetch(
          "/api/property-posts?sort=createdAt:desc"
        );
        if (propertyPostsResponse.ok) {
          const propertyPostsData = await propertyPostsResponse.json();
          setPropertyPosts(propertyPostsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <DotLoader color="#009FFF" size={40} speedMultiplier={1.2} />
            <p className="mt-4 text-sm text-gray-600 font-light">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 sm:px-6 py-4 rounded-xl text-center max-w-md mx-auto">
            <p className="font-medium text-sm sm:text-base">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 xl:gap-16">
          {/* Left Side - Main Content */}
          <div className="xl:w-3/4">
            {/* Categories Section */}
            <div className="mb-16 sm:mb-20">
              <div className="mb-8 sm:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-2 sm:mb-3 tracking-tight">
                  Explore Topics
                </h1>
                <p className="text-base sm:text-lg text-gray-600 font-light">
                  Discover content across different categories
                </p>
              </div>

              {categories.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <div className="max-w-sm mx-auto px-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                      No categories yet
                    </h3>
                    <p className="text-gray-500 font-light text-sm sm:text-base">
                      Categories will appear here once they are created.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {categories.map((category, index) => (
                    <Link
                      key={category._id}
                      href={`/category/${encodeURIComponent(category.name)}`}
                      className="group"
                    >
                      <div 
                        className="relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#009FFF]/10 transition-all duration-700 hover:-translate-y-4 border border-gray-100 hover:border-[#009FFF]/20 h-[200px] flex flex-col"
                        style={{ 
                          animationDelay: `${index * 100}ms`,
                          animation: 'fadeInUp 0.6s ease-out forwards'
                        }}
                      >
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                          <div className="w-full h-full bg-gradient-to-br from-[#009FFF] to-transparent rounded-bl-3xl"></div>
                        </div>

                        {/* New post indicator with animation */}
                        {category.hasNewPosts && (
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-[#009FFF] rounded-full animate-pulse"></div>
                            <span className="text-xs bg-[#009FFF]/10 text-[#009FFF] px-2 py-1 rounded-full font-medium">
                              New
                            </span>
                          </div>
                        )}

                        {/* Main Content */}
                        <div className="flex-1 p-6 flex flex-col">
                          {/* Icon Container */}
                          <div className="mb-4">
                            <div className="relative">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#009FFF]/10 to-[#009FFF]/5 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#009FFF]/20 group-hover:to-[#009FFF]/10 transition-all duration-500">
                                <CategoryIcon
                                  iconName={category.icon || "MdCategory"}
                                  className="w-6 h-6 text-[#009FFF] group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              
                              {/* Floating accent dots */}
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#009FFF]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#009FFF]/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                            </div>
                          </div>

                          {/* Category Info */}
                          <div className="flex-1 flex flex-col">
                            <h3 className="text-lg font-light text-gray-900 group-hover:text-gray-700 transition-colors duration-300 mb-2 tracking-tight leading-6 line-clamp-2">
                              {category.name}
                            </h3>
                            
                            {/* Post count with enhanced styling */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-1.5 bg-[#009FFF] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                              <span className="text-sm text-gray-600 font-light group-hover:text-[#009FFF] transition-colors duration-300">
                                {category.post_ids?.length || 0} {(category.post_ids?.length || 0) === 1 ? 'article' : 'articles'}
                              </span>
                            </div>

                            {/* Category description - truncated */}
                            <p className="text-gray-500 text-sm font-light line-clamp-2 mb-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                              Explore insights and articles about {category.name.toLowerCase()}
                            </p>
                          </div>

                          {/* Enhanced Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100 group-hover:border-[#009FFF]/20 transition-colors duration-300 mt-auto">
                            <span className="text-xs text-gray-500 font-light">
                              Browse Category
                            </span>
                            
                            <div className="flex items-center text-gray-400 group-hover:text-[#009FFF] transition-all duration-300 group-hover:translate-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Sliding accent bar */}
                        <div className="h-1 bg-gradient-to-r from-[#009FFF] to-[#007ACC] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 rounded-3xl border-2 border-[#009FFF]/20"></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Property Posts Section */}
            <div>
              <div className="mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-2 sm:mb-3 tracking-tight">
                  Featured Properties
                </h2>
                <p className="text-base sm:text-lg text-gray-600 font-light">
                  Explore our latest property listings and insights
                </p>
              </div>

              {propertyPosts.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <div className="max-w-sm mx-auto px-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                      No properties yet
                    </h3>
                    <p className="text-gray-500 font-light text-sm sm:text-base">
                      Property posts will appear here once they are created.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {propertyPosts.map((propertyPost) => (
                    <Link
                      key={propertyPost._id}
                      href={`/property-post/${propertyPost.slug}`}
                      className="group"
                    >
                      <article className="relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-[#009FFF]/10 transition-all duration-700 hover:-translate-y-4 border border-gray-100 hover:border-[#009FFF]/20">
                        {/* Hero Image */}
                        {propertyPost.hero_image && (
                          <div className="relative h-48 sm:h-56 md:h-64 w-full overflow-hidden">
                            <Image
                              src={propertyPost.hero_image}
                              alt={propertyPost.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            
                            {/* Dynamic Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Floating Badge with Animation */}
                            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 transform group-hover:scale-110 transition-transform duration-300">
                              <span className="bg-white/95 backdrop-blur-sm text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium shadow-lg border border-white/20">
                                Featured Property
                              </span>
                            </div>

                            {/* Sliding Info Panel */}
                            <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-6">
                              <div className="text-white">
                                <p className="text-xs sm:text-sm text-white/80 mb-1">Quick Preview</p>
                                <p className="text-sm sm:text-base font-medium line-clamp-2">
                                  {propertyPost.content.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                </p>
                              </div>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-0 left-0 w-0 h-0 group-hover:w-16 group-hover:h-16 transition-all duration-500">
                              <div className="w-full h-full bg-gradient-to-br from-[#009FFF] to-transparent opacity-20"></div>
                            </div>
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="p-6 sm:p-8">
                          {/* Category Tag */}
                          <div className="mb-4">
                            <span className="inline-block bg-[#009FFF]/5 text-[#009FFF] px-3 py-1 rounded-full text-xs font-medium border border-[#009FFF]/10">
                              Property Listing
                            </span>
                          </div>

                          {/* Title with Better Typography */}
                          <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2 leading-7 sm:leading-8 tracking-tight">
                            {propertyPost.name}
                          </h3>

                          {/* Enhanced Excerpt */}
                          <p className="text-gray-600 mb-6 sm:mb-8 line-clamp-3 leading-relaxed font-light text-sm sm:text-base">
                            {propertyPost.content.replace(/<[^>]*>/g, '').substring(0, 160)}...
                          </p>

                          {/* Enhanced Footer */}
                          <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-gray-100 group-hover:border-[#009FFF]/20 transition-colors duration-300">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#009FFF] rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                              <span className="text-sm text-gray-600 font-light group-hover:text-[#009FFF] transition-colors duration-300">
                                {formatRelativeDate(propertyPost.createdAt)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#009FFF] transition-all duration-300 group-hover:translate-x-1">
                              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                View Details
                              </span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 rounded-3xl border-2 border-[#009FFF]/20"></div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Latest Posts Sidebar */}
          <div className="xl:w-1/4">
            <div className="xl:sticky xl:top-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-light text-gray-900 mb-2 tracking-tight">
                  Latest Stories
                </h2>
                <p className="text-gray-600 font-light text-sm">
                  Recent articles and updates
                </p>
              </div>

              {latestPosts.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-light">No posts yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {latestPosts.slice(0, 5).map((post, index) => (
                    <Link
                      key={post._id}
                      href={`/post/${post.slug}`}
                      className="block group"
                    >
                      <article className="relative bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 border border-gray-50 hover:border-gray-100 hover:-translate-y-1">
                        <div className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                          {/* Index Number */}
                          <div className="flex-shrink-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                              <span className="text-xs sm:text-sm font-medium text-gray-500 group-hover:text-blue-600">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 leading-5 sm:leading-6">
                              {post.title}
                            </h4>

                            {/* Meta Info */}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-light">
                                {formatRelativeDate(post.createdAt)}
                              </span>
                              
                              <div className="flex items-center text-gray-300 group-hover:text-blue-400 transition-colors duration-300">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Color Strip */}
                        <div className="h-1 bg-[#009FFF] transition-all duration-300"></div>

                        {/* Sliding Image Overlay */}
                        {post.coverImage && (
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-95 transition-all duration-500 transform translate-y-full group-hover:translate-y-0">
                            <div className="relative w-full h-full">
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                              
                              {/* Overlay Content */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                                <h4 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 leading-5 sm:leading-6">
                                  {post.title}
                                </h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-white/80">
                                    {formatRelativeDate(post.createdAt)}
                                  </span>
                                  <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                                    Read More
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}