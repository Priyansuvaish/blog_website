"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Color theme options for slides
type ColorTheme = 'blue' | 'orange' | 'green' | 'purple' | 'red' | 'teal' | 'indigo' | 'pink';

interface ColorConfig {
  primary: string;
  secondary: string;
  accent: string;
  light: string;
  gradient: string;
  shadow: string;
}

// Color theme configurations
const COLOR_THEMES: Record<ColorTheme, ColorConfig> = {
  blue: {
    primary: '#009FFF',
    secondary: '#007ACC',
    accent: '#0EA5E9',
    light: '#009FFF/10',
    gradient: 'from-[#009FFF] to-[#007ACC]',
    shadow: '#009FFF/25'
  },
  orange: {
    primary: '#EA7C16',
    secondary: '#DC7632',
    accent: '#F97316',
    light: '#EA7C16/10',
    gradient: 'from-[#EA7C16] to-[#DC7632]',
    shadow: '#EA7C16/25'
  },
  green: {
    primary: '#10B981',
    secondary: '#059669',
    accent: '#34D399',
    light: '#10B981/10',
    gradient: 'from-[#10B981] to-[#059669]',
    shadow: '#10B981/25'
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    accent: '#A78BFA',
    light: '#8B5CF6/10',
    gradient: 'from-[#8B5CF6] to-[#7C3AED]',
    shadow: '#8B5CF6/25'
  },
  red: {
    primary: '#EF4444',
    secondary: '#DC2626',
    accent: '#F87171',
    light: '#EF4444/10',
    gradient: 'from-[#EF4444] to-[#DC2626]',
    shadow: '#EF4444/25'
  },
  teal: {
    primary: '#14B8A6',
    secondary: '#0D9488',
    accent: '#5EEAD4',
    light: '#14B8A6/10',
    gradient: 'from-[#14B8A6] to-[#0D9488]',
    shadow: '#14B8A6/25'
  },
  indigo: {
    primary: '#6366F1',
    secondary: '#4F46E5',
    accent: '#818CF8',
    light: '#6366F1/10',
    gradient: 'from-[#6366F1] to-[#4F46E5]',
    shadow: '#6366F1/25'
  },
  pink: {
    primary: '#EC4899',
    secondary: '#DB2777',
    accent: '#F472B6',
    light: '#EC4899/10',
    gradient: 'from-[#EC4899] to-[#DB2777]',
    shadow: '#EC4899/25'
  }
};

// Enhanced interface for infographic slides
interface InfographicSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  priority: number;
  isActive: boolean;
  image: string;
  highlights: string[];
  description: string;
  emoji: string;
  colorTheme: ColorTheme;
  badge?: string; // Optional badge text
}

// Enhanced Promotional Slides Configuration
const PROMOTIONAL_SLIDES: InfographicSlide[] = [
  {
    id: 'survey-documents',
    title: 'Survey Documents',
    subtitle: 'Access detailed land hissa tippani and other important survey documents.',
    ctaText: 'Search Documents',
    ctaLink: 'https://www.earthfields.in/signup',
    priority: 1,
    isActive: true,
    image: '/Promotion/1.png',
    highlights: [
      'Access Official Survey Documents Instantly',
      '15-Second Average Search Time',
      'Covers 2.1 Million+ Properties Across Kerala',
      '99.8% Document Accuracy from Official Sources'
    ],
    description: 'Explore land history, sketch maps, and tippani documents with just a click.',
    emoji: '📄',
    colorTheme: 'blue',
    badge: 'Most Popular'
  },

  {
    id: 'village-revenue-map',
    title: 'Village Map (Revenue Map)',
    subtitle: `Discover the latest revenue map of Karnataka's villages instantly`,
    ctaText: 'Explore Village Maps',
    ctaLink: 'https://www.earthfields.in/signup',
    priority: 2,
    isActive: true,
    image: '/Promotion/village_revenue.png',
    highlights: [
      'Latest Government-Issued Revenue Maps',
      'Instant Search by Village Name or Survey No',
      '30,000+ Villages Across Karnataka Covered',
      'Useful for Land Verification & Legal Use'
    ],
    description: `Discover Karnataka's official village maps in seconds — clear, accurate, and ready to explore.`,
    emoji: '🗺️',
    colorTheme: 'teal',
    badge: 'New Feature'
  }
]; 

// Enhanced Infographic Slide Component
const InfographicSlide = ({ slide }: { slide: InfographicSlide }) => {
  const colors = COLOR_THEMES[slide.colorTheme];
  
  return (
    <div className="p-6 sm:p-8 relative z-10 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-110 transition-all duration-500"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              boxShadow: `0 8px 25px ${colors.shadow}`
            }}
          >
            {slide.emoji}
          </div>
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-1 tracking-tight leading-tight">
              {slide.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
              {slide.subtitle}
            </p>
          </div>
        </div>
        
        {/* Optional Badge */}
        {slide.badge && (
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-md"
            style={{ backgroundColor: colors.primary }}
          >
            {slide.badge}
          </div>
        )}
      </div>

      {/* Enhanced Infographic Preview */}
      <div className="relative rounded-3xl overflow-hidden mb-6 shadow-xl group/image">
        <div className="relative h-40 sm:h-48">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover transition-transform duration-700 group-hover/image:scale-105"
          />
          {/* Enhanced Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `linear-gradient(45deg, ${colors.primary}15, transparent 70%, ${colors.secondary}10)`
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          
          {/* Floating Description */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <p className="text-white text-sm sm:text-base font-medium leading-relaxed drop-shadow-md">
              {slide.description}
            </p>
          </div>

          {/* Corner Accent */}
          <div 
            className="absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse shadow-lg"
            style={{ backgroundColor: colors.accent }}
          ></div>
        </div>
      </div>

      {/* Enhanced Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 flex-1">
        {slide.highlights.map((highlight, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-white/70 transition-all duration-300 group/highlight"
          >
            <div 
              className="w-2 h-2 rounded-full mt-2 group-hover/highlight:scale-125 transition-transform duration-300 shadow-sm"
              style={{ backgroundColor: colors.primary }}
            ></div>
            <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
              {highlight}
            </span>
          </div>
        ))}
      </div>

      {/* Enhanced CTA Button */}
      <Link href={slide.ctaLink} target="_blank" className="mt-auto">
        <button 
          className="w-full py-4 sm:py-5 rounded-2xl text-white font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl relative overflow-hidden group/button"
          style={{ 
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            boxShadow: `0 10px 30px ${colors.shadow}`
          }}
        >
          {/* Button Hover Effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover/button:opacity-20 transition-opacity duration-300"
            style={{ background: `linear-gradient(45deg, ${colors.accent}, transparent)` }}
          ></div>
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {slide.ctaText}
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover/button:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </button>
      </Link>
    </div>
  );
};

// Main Enhanced Promotional Carousel Component
export default function PromotionalCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Get active slides sorted by priority
  const activeSlides = PROMOTIONAL_SLIDES
    .filter(slide => slide.isActive)
    .sort((a, b) => a.priority - b.priority);

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying || activeSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeSlides.length);
    }, 7000); // Changed to 7 seconds for better UX

    return () => clearInterval(interval);
  }, [isAutoPlaying, activeSlides.length]);

  if (activeSlides.length === 0) return null;

  const currentSlideData = activeSlides[currentSlide];
  const colors = COLOR_THEMES[currentSlideData.colorTheme];

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl border-2 transition-all duration-700 group cursor-pointer min-h-[450px] sm:min-h-[500px] shadow-2xl"
      style={{ 
        background: `linear-gradient(135deg, ${colors.light}, white, ${colors.light})`,
        borderColor: `${colors.primary}20`,
        boxShadow: `0 25px 50px -12px ${colors.shadow}`
      }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Enhanced Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-700">
        <div 
          className="absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-20"
          style={{ background: `linear-gradient(225deg, ${colors.primary}, transparent)` }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full opacity-15"
          style={{ background: `linear-gradient(45deg, ${colors.secondary}, transparent)` }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
          style={{ background: `radial-gradient(circle, ${colors.accent}, transparent)` }}
        ></div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20 group/nav"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <svg 
              className="w-6 h-6 mx-auto transition-colors duration-300 group-hover/nav:scale-110" 
              style={{ color: colors.primary }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/20 group/nav"
            style={{ backdropFilter: 'blur(10px)' }}
          >
            <svg 
              className="w-6 h-6 mx-auto transition-colors duration-300 group-hover/nav:scale-110" 
              style={{ color: colors.primary }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Content */}
      <div className="relative z-10 h-full">
        <InfographicSlide slide={currentSlideData} />
      </div>

      {/* Enhanced Slide Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {activeSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(index)}
              className="relative group/indicator"
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-500 shadow-md ${
                  index === currentSlide ? 'w-8 scale-125' : 'hover:scale-110'
                }`}
                style={{ 
                  backgroundColor: index === currentSlide 
                    ? COLOR_THEMES[activeSlides[index].colorTheme].primary 
                    : '#94A3B8'
                }}
              ></div>
              {index === currentSlide && (
                <div 
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ backgroundColor: `${colors.primary}40` }}
                ></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Floating Accent Elements */}
      <div 
        className="absolute top-6 right-6 w-4 h-4 rounded-full animate-pulse shadow-lg"
        style={{ backgroundColor: colors.accent }}
      ></div>
      <div 
        className="absolute bottom-20 left-6 w-3 h-3 rounded-full animate-pulse delay-1000 shadow-md"
        style={{ backgroundColor: colors.secondary }}
      ></div>
    </div>
  );
}