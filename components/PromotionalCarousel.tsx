"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Gavel, Rocket, Building2, IndianRupee, MapPin, Bubbles, Map, FileQuestionMark, Mountain, ChartCandlestick, DraftingCompass, BookCheck } from 'lucide-react';

interface CarouselItem {
  text: string;
  link: string;
  icon: string | React.ComponentType<any>; // Support both emoji strings and React components
}

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  items: CarouselItem[];
  backgroundImage: string;
  badge?: string;
}

const carouselData: CarouselSlide[] = [
  {
    id: 1,
    title: "Land Services (Coming Soon)",
    subtitle: "Traditional Land Services",
    items: [
      { text: "Legal/Liaisoning", link: "https://www.earthfields.in/signup", icon: Gavel },
      { text: "Drone Services", link: "https://www.earthfields.in/signup", icon: Rocket },
      { text: "Architecture/Design", link: "https://www.earthfields.in/signup", icon: Building2 },
      { text: "Financial Consultancy", link: "https://www.earthfields.in/signup", icon: IndianRupee },
      { text: "Land Surveys", link: "https://www.earthfields.in/signup", icon: MapPin },
      { text: "Borewell", link: "https://www.earthfields.in/signup", icon: Bubbles }
    ],
    backgroundImage: "/Promotion/LandService.png",
    badge: "Featured"
  },
  {
    id: 2,
    title: "Tools",
    subtitle: "Search and access important documents related to lands",
    items: [
      { text: "Village Maps", link: "https://www.earthfields.in/signup", icon: Map },
      { text: "Master Plans", link: "https://www.earthfields.in/signup", icon: FileQuestionMark },
      { text: "RTC", link: "https://www.earthfields.in/signup", icon: Mountain },
      { text: "Guidance Value", link: "https://www.earthfields.in/signup", icon: ChartCandlestick },
      { text: "Shape Band", link: "https://www.earthfields.in/signup", icon: DraftingCompass },
      { text: "Survey Documents", link: "https://www.earthfields.in/signup", icon: BookCheck }
    ],
    backgroundImage: "/Promotion/Tools.png",
    badge: "Exculsive"
  }
];

export default function PromotionalCarousel() {
  const [currentSlide, setCurrentSlide] = useState(1); // Start at 1 (first real slide)
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Create extended slides array for infinite loop
  const extendedSlides = [
    carouselData[carouselData.length - 1], // Last slide duplicate at start
    ...carouselData,                       // Original slides
    carouselData[0]                        // First slide duplicate at end
  ];

  // Auto-play functionality - pause when hovering (desktop) or touch (mobile)
  useEffect(() => {
    if (!isPlaying || isTransitioning) return;
    
    // Pause on hover for desktop, pause on touch for mobile
    const shouldPause = isHovering || (touchStart !== null);

    if (shouldPause) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, isHovering, isTransitioning, touchStart]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index + 1); // +1 because of duplicate at start
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 700); // Match transition duration
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
  };

  // Touch event handlers for swipe gestures (mobile only)
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handle infinite loop transitions
  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      if (currentSlide === 0) {
        // Jump from first duplicate to last real slide (no animation)
        setCurrentSlide(carouselData.length);
      } else if (currentSlide === extendedSlides.length - 1) {
        // Jump from last duplicate to first real slide (no animation)
        setCurrentSlide(1);
      }
      setIsTransitioning(false);
    }, 700); // Match CSS transition duration

    return () => clearTimeout(timer);
  }, [currentSlide, isTransitioning]);

  return (
    <div className="relative h-[320px] xl:h-[500px] xl:sm:h-[550px] xl:md:h-[600px] xl:lg:h-[650px] w-full overflow-hidden rounded-2xl">
      {/* Slides Container */}
      <div 
        className={`flex h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {extendedSlides.map((slide, index) => (
          <div key={`${slide.id}-${index}`} className="min-w-full h-full relative">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.backgroundImage}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={index <= 2} // Prioritize first few slides
              />
              {/* Gradient Overlay - Responsive */}
              <div className="absolute inset-0 bg-gradient-to-b xl:bg-gradient-to-r from-black/60 xl:from-black/70 via-black/40 to-black/70 xl:to-transparent"></div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden xl:flex absolute inset-0 items-center justify-center">
              <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-12">
                <div className="max-w-5xl">
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
                  <p className="text-[#009FFF] font-medium text-sm sm:text-base mb-2 sm:mb-3 tracking-wide uppercase">
                    {slide.subtitle}
                  </p>

                  {/* Main Title */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 sm:mb-8 leading-tight tracking-tight">
                    {slide.title}
                  </h2>

                  {/* Cards Grid - Hover Detection */}
                  <div 
                    className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    {slide.items.map((item, itemIndex) => (
                      <Link 
                        key={itemIndex} 
                        href={item.link}
                        className="group block"
                      >
                        <div className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-[#009FFF]/50 rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#009FFF]/20 h-full">
                          {/* Icon */}
                          <div className="text-center mb-2 sm:mb-3">
                            {typeof item.icon === 'string' ? (
                              <span className="text-2xl sm:text-3xl block group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                              </span>
                            ) : (
                              <div className="flex justify-center group-hover:scale-110 transition-transform duration-300">
                                <item.icon 
                                  className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-[#009FFF] transition-colors duration-300" 
                                />
                              </div>
                            )}
                          </div>
                          
                          {/* Text */}
                          <div className="text-center">
                            <span className="text-white text-xs sm:text-sm font-medium group-hover:text-[#009FFF] transition-colors duration-300 block leading-tight">
                              {item.text === "Legal/Liaisoning" ? (
                                <>
                                  <span className="xl:hidden">Legal/<br />Liaisoning</span>
                                  <span className="hidden xl:inline">Legal/Liaisoning</span>
                                </>
                              ) : item.text === "Architecture/Design" ? (
                                <>
                                  <span className="xl:hidden">Architecture/<br />Design</span>
                                  <span className="hidden xl:inline">Architecture/Design</span>
                                </>
                              ) : (
                                item.text
                              )}
                            </span>
                          </div>
                          
                          {/* Hover Arrow */}
                          <div className="text-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <svg 
                              className="w-3 h-3 sm:w-4 sm:h-4 text-[#009FFF] mx-auto group-hover:translate-y-1 transition-transform duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="xl:hidden absolute inset-0 flex flex-col justify-between p-4">
              {/* Top Section */}
              <div>
                {/* Badge */}
                {slide.badge && (
                  <div className="inline-flex items-center gap-2 bg-[#009FFF]/20 backdrop-blur-sm border border-[#009FFF]/30 px-3 py-1.5 rounded-full mb-3">
                    <div className="w-1.5 h-1.5 bg-[#009FFF] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-white">
                      {slide.badge}
                    </span>
                  </div>
                )}

                {/* Subtitle */}
                <p className="text-[#009FFF] font-medium text-xs mb-1 tracking-wide uppercase">
                  {slide.subtitle}
                </p>

                {/* Main Title - Shorter for mobile */}
                <h2 className="text-lg font-medium text-white mb-4 leading-tight tracking-tight">
                  {slide.title}
                </h2>
              </div>

              {/* Services Grid - Mobile optimized */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {slide.items.slice(0, 6).map((item, itemIndex) => (
                  <Link 
                    key={itemIndex} 
                    href={item.link}
                    className="group block"
                  >
                    <div className="bg-white/10 backdrop-blur-sm active:bg-white/20 border border-white/20 rounded-xl p-2.5 transition-all duration-200 active:scale-95 h-full min-h-[70px] flex flex-col justify-center">
                      {/* Icon */}
                      <div className="text-center mb-1">
                        {typeof item.icon === 'string' ? (
                          <span className="text-lg block group-active:scale-110 transition-transform duration-200">
                            {item.icon}
                          </span>
                        ) : (
                          <div className="flex justify-center group-active:scale-110 transition-transform duration-200">
                            <item.icon 
                              className="w-5 h-5 text-white group-active:text-[#009FFF] transition-colors duration-200" 
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Text */}
                      <div className="text-center">
                        <span className="text-white text-xs font-medium group-active:text-[#009FFF] transition-colors duration-200 block leading-tight">
                          {item.text === "Legal/Liaisoning" ? (
                            <>Legal/<br />Liaisoning</>
                          ) : item.text === "Architecture/Design" ? (
                            <>Architecture/<br />Design</>
                          ) : (
                            item.text
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Bottom Section */}
              <div className="flex items-center justify-between">
                {/* Dot Indicators */}
                <div className="flex items-center gap-2">
                  {carouselData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      disabled={isTransitioning}
                      className={`w-2 h-2 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                        (currentSlide === index + 1) || 
                        (currentSlide === 0 && index === carouselData.length - 1) || 
                        (currentSlide === extendedSlides.length - 1 && index === 0)
                          ? 'bg-[#009FFF] scale-125 shadow-md shadow-[#009FFF]/50'
                          : 'bg-white/40'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white/10 backdrop-blur-sm active:bg-white/20 border border-white/20 rounded-full p-2 transition-all duration-200 active:scale-95"
                  aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
                >
                  {isPlaying ? (
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg 
                      className="w-4 h-4 text-white ml-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls - Desktop Only */}
      <div className="hidden xl:flex absolute inset-0 items-center justify-between px-4 sm:px-6 pointer-events-none">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="pointer-events-auto group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
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
          disabled={isTransitioning}
          className="pointer-events-auto group bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Dot Indicators - Desktop Only */}
      <div className="hidden xl:block absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-2 sm:gap-3">
          {carouselData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                (currentSlide === index + 1) || (currentSlide === 0 && index === carouselData.length - 1) || (currentSlide === extendedSlides.length - 1 && index === 0)
                  ? 'bg-[#009FFF] scale-125 shadow-lg shadow-[#009FFF]/50'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause Button - Desktop Only */}
      <div className="hidden xl:block absolute top-6 sm:top-8 right-6 sm:right-8">
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

      {/* Swipe Indicator - Mobile Only */}
      <div className="xl:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full opacity-0 animate-pulse">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="text-xs text-white font-medium">Swipe</span>
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Mobile Navigation Hints */}
      <div className="xl:hidden absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-transparent to-transparent pointer-events-none" />
      <div className="xl:hidden absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-transparent to-transparent pointer-events-none" />

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div 
          className="h-full bg-gradient-to-r from-[#009FFF] to-[#007ACC] transition-all duration-300"
          style={{ 
            width: `${(((currentSlide - 1 + carouselData.length) % carouselData.length + 1) / carouselData.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
} 