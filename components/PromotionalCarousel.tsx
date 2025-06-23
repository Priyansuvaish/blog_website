"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  badge?: string;
}

const carouselData: CarouselSlide[] = [
  {
    id: 1,
    title: "Discover Property Insights",
    subtitle: "Latest Market Analysis",
    description: "Explore comprehensive property analysis, market trends, and investment opportunities with our expert insights.",
    ctaText: "Explore Properties",
    ctaLink: "/category/Property%20Analysis",
    backgroundImage: "/Promotion/1.png",
    badge: "Featured"
  },
  {
    id: 2,
    title: "Village Revenue Analytics",
    subtitle: "Revenue Growth Platform",
    description: "Unlock the potential of rural development with our advanced village revenue tracking and analysis tools.",
    ctaText: "View Analytics",
    ctaLink: "/category/Village%20Development",
    backgroundImage: "/Promotion/village_revenue.png",
    badge: "New"
  },
  {
    id: 3,
    title: "Join Our Community",
    subtitle: "Earthfields Journal",
    description: "Connect with industry experts, access exclusive content, and stay updated with the latest in property and development.",
    ctaText: "Read Articles",
    ctaLink: "/category/Industry%20Insights",
    backgroundImage: "/EF_Journal_Logo.png",
    badge: "Popular"
  }
];

export default function PromotionalCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  return (
    <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] w-full overflow-hidden">
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselData.map((slide, index) => (
          <div key={slide.id} className="min-w-full h-full relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.backgroundImage}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="max-w-2xl">
                  {/* Badge */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-2 bg-[#009FFF]/20 backdrop-blur-sm border border-[#009FFF]/30 px-4 py-2 rounded-full mb-4 sm:mb-6">
                      <div className="w-2 h-2 bg-[#009FFF] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white">
                        {slide.badge}
                      </span>
                    </div>
                  )}

                  {/* Subtitle */}
                  <p className="text-[#009FFF] font-medium text-sm sm:text-base mb-2 sm:mb-3 tracking-wide uppercase letter-spacing-wide">
                    {slide.subtitle}
                  </p>

                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                    {slide.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-200 text-base sm:text-lg font-light mb-6 sm:mb-8 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <Link href={slide.ctaLink}>
                    <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#009FFF] to-[#007ACC] hover:from-[#007ACC] hover:to-[#009FFF] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-medium text-sm sm:text-base transition-all duration-300 hover:shadow-2xl hover:shadow-[#009FFF]/30 hover:-translate-y-1 transform">
                      <span>{slide.ctaText}</span>
                      <svg 
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 pointer-events-none">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="pointer-events-auto group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#009FFF] transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="pointer-events-auto group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#009FFF] transition-colors duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 sm:gap-3">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-[#009FFF] scale-125 shadow-lg shadow-[#009FFF]/50'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-6 sm:top-8 right-6 sm:right-8">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full p-2 sm:p-3 transition-all duration-300"
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
        >
          {isPlaying ? (
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-[#009FFF] transition-colors duration-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-[#009FFF] transition-colors duration-300 ml-0.5" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-[#009FFF] to-[#007ACC] transition-all duration-300"
          style={{ 
            width: `${((currentSlide + 1) / carouselData.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
} 