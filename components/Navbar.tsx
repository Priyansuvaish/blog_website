"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

// Navigation links configuration - easily add/remove links here
interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
  isHighlighted?: boolean; // New property for special highlighting
}

const navigationLinks: NavLink[] = [
  { href: "/home", label: "Home" },
  { href: "/about", label: "About" },
  // { 
  //   href: "https://www.earthfields.in/signup", 
  //   label: "Exclusive Tools", 
  //   isExternal: true,
  //   isHighlighted: true // Special highlighted link
  // },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Get logo URL from environment variable
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/EF_Journal_Logo.png";

  // Function to render desktop navigation link
  const renderDesktopLink = (link: NavLink, index: number) => {
    const baseClasses = "group relative no-underline font-light text-base lg:text-lg rounded-xl transition-all duration-300 overflow-hidden";
    
    if (link.isHighlighted) {
      // Elegant highlighted styling for Exclusive Tools
      const highlightedClasses = `${baseClasses} text-[#009FFF] px-4 lg:px-6 py-2 lg:py-3 bg-[#009FFF]/5 border border-[#009FFF]/20 hover:bg-[#009FFF]/10 hover:border-[#009FFF]/30 hover:shadow-md hover:shadow-[#009FFF]/10 font-medium whitespace-nowrap flex items-center`;
      
      return link.isExternal ? (
        <a 
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={highlightedClasses}
        >
          <span className="relative z-10 flex items-center gap-2 flex-nowrap whitespace-nowrap">
            {link.label}
            {/* Subtle badge */}
            <span className="bg-[#009FFF] text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
              NEW
            </span>
          </span>
          {/* Enhanced underline effect */}
          <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-[#009FFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </a>
      ) : (
        <Link href={link.href} className={highlightedClasses}>
          <span className="relative z-10 flex items-center gap-2 flex-nowrap whitespace-nowrap">
            {link.label}
            <span className="bg-[#009FFF] text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
              NEW
            </span>
          </span>
          <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-[#009FFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
      );
    } else {
      // Regular styling for other links
      const regularClasses = `${baseClasses} text-gray-700 px-4 lg:px-6 py-2 lg:py-3 hover:text-[#009FFF] hover:bg-gray-50`;
      
      return link.isExternal ? (
        <a 
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={regularClasses}
        >
          <span className="relative z-10">{link.label}</span>
          <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-[#009FFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </a>
      ) : (
        <Link href={link.href} className={regularClasses}>
          <span className="relative z-10">{link.label}</span>
          <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-[#009FFF] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </Link>
      );
    }
  };

  // Function to render mobile navigation link
  const renderMobileLink = (link: NavLink, index: number) => {
    if (link.isHighlighted) {
      // Elegant mobile styling for Exclusive Tools
      const highlightedMobileClasses = "group flex items-center justify-between text-[#009FFF] no-underline text-lg font-medium p-4 rounded-2xl transition-all duration-300 bg-[#009FFF]/5 border border-[#009FFF]/20 hover:bg-[#009FFF]/10 hover:border-[#009FFF]/30";
      
      return link.isExternal ? (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className={highlightedMobileClasses}
        >
          <span className="flex items-center gap-3">
            {link.label}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#009FFF] text-white px-2 py-1 rounded-full font-medium">NEW</span>
            <div className="w-1.5 h-1.5 bg-[#009FFF] rounded-full transform scale-100 group-hover:scale-125 transition-transform duration-300"></div>
          </div>
        </a>
      ) : (
        <Link 
          href={link.href} 
          onClick={handleLinkClick}
          className={highlightedMobileClasses}
        >
          <span className="flex items-center gap-3">
            {link.label}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#009FFF] text-white px-2 py-1 rounded-full font-medium">NEW</span>
            <div className="w-1.5 h-1.5 bg-[#009FFF] rounded-full transform scale-100 group-hover:scale-125 transition-transform duration-300"></div>
          </div>
        </Link>
      );
    } else {
      // Regular mobile styling
      const regularMobileClasses = "group flex items-center justify-between text-gray-700 no-underline text-lg font-light p-4 rounded-2xl transition-all duration-300 hover:text-[#009FFF] hover:bg-[#009FFF]/5 hover:translate-x-2";
      
      return link.isExternal ? (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLinkClick}
          className={regularMobileClasses}
        >
          <span>{link.label}</span>
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#009FFF] rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </div>
        </a>
      ) : (
        <Link 
          href={link.href} 
          onClick={handleLinkClick}
          className={regularMobileClasses}
        >
          <span>{link.label}</span>
          <div className="w-5 h-5 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-[#009FFF] rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          </div>
        </Link>
      );
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <header className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-gray-200/50 border-b border-gray-100' 
          : 'bg-white border-b border-gray-50'
        }
      `}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center py-4 lg:py-6">
            {/* Logo */}
            <div className="logo group">
              <Link href="/home" className="flex items-center transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src={logoUrl} 
                  alt="Logo" 
                  width={190} 
                  height={40} 
                  className="object-contain transition-opacity duration-300 group-hover:opacity-90" 
                  priority
                />
              </Link>
            </div>

            {/* Mobile menu trigger */}
            <button 
              className="md:hidden relative p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-[#009FFF] transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#009FFF]/20"
              onClick={handleMobileMenuToggle}
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-6 h-6">
                <RiMenu3Line 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`} 
                />
                <IoMdClose 
                  className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`} 
                />
              </div>
            </button>

            {/* Desktop navigation */}
            <nav className="hidden md:flex">
              <ul className="flex list-none m-0 p-0 gap-2 lg:gap-4 items-center">
                {navigationLinks.map((link, index) => (
                  <li key={index} className="m-0">
                    {renderDesktopLink(link, index)}
                  </li>
                ))}
              </ul>
            </nav>
          </nav>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      <div 
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500
          ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
          md:hidden
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile menu */}
      <div className={`
        fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 transform transition-all duration-500 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        md:hidden shadow-2xl
      `}>
        {/* Mobile menu header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="mobile-logo">
            <Link href="/home" onClick={handleLinkClick} className="flex items-center group">
              <Image 
                src={logoUrl} 
                alt="Logo" 
                width={140}
                height={35}
                className="object-contain transition-opacity duration-300 group-hover:opacity-80"
                priority
              />
            </Link>
          </div>
          <button
            className="p-2 text-gray-600 hover:text-[#009FFF] transition-colors duration-300 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#009FFF]/20"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>

        {/* Mobile menu navigation */}
        <div className="p-6 overflow-y-auto">
          <nav>
            <ul className="list-none p-0 m-0 space-y-3">
              {navigationLinks.map((link, index) => (
                <li key={index} className="transform transition-all duration-300" style={{ transitionDelay: `${index * 100}ms` }}>
                  {renderMobileLink(link, index)}
                </li>
              ))}
            </ul>
          </nav>

          {/* Enhanced mobile menu footer */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-light mb-4">
                Discover powerful property tools
              </p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#009FFF] to-transparent mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;