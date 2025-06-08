"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { RiMenu3Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";

// Navigation links configuration - easily add/remove links here
interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

const navigationLinks: NavLink[] = [
  { href: "/home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Get logo URL from environment variable
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/EF_Journal_Logo.png";

  return (
    <>
      {/* Main Navbar */}
      <div className="relative bg-white shadow-sm px-4 lg:px-8 z-50 border-b border-zinc-300">
        <nav className="flex justify-between items-center max-w-8xl mx-auto py-4">
          {/* Logo */}
          <div className="logo">
            <Link href="/home" className="flex items-center ">
              <Image src={logoUrl} alt="Logo" width={190} height={10} className="object-contain" priority/>
              </Link>
          </div>

          {/* Mobile menu trigger */}
          <div 
            className="md:hidden cursor-pointer p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
            onClick={handleMobileMenuToggle}
          >
            {isMobileMenuOpen ? (
              <IoMdClose className="text-2xl" />
            ) : (
              <RiMenu3Line className="text-2xl" />
            )}
          </div>

          {/* Desktop navigation */}
          <ul className="hidden md:flex list-none m-0 p-0 gap-8">
            {navigationLinks.map((link, index) => (
              <li key={index} className="m-0">
                {link.isExternal ? (
                  <a 
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 no-underline font-medium px-4 py-2 rounded transition-all duration-200 hover:text-blue-600 hover:bg-gray-50"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link 
                    href={link.href}
                    className="text-gray-700 no-underline font-medium px-4 py-2 rounded transition-all duration-200 hover:text-blue-600 hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <div className={`
        fixed inset-0 bg-white z-40 transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        md:hidden
      `}>
        {/* Mobile menu backdrop */}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        
        {/* Mobile menu content */}
        <div className="relative bg-white h-full shadow-2xl max-w-sm ml-auto">
          {/* Mobile menu header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="mobile-logo">
              <Link href="/home" onClick={handleLinkClick} className="flex items-center">
                <Image 
                  src={logoUrl} 
                  alt="Logo" 
                  width={120}
                  height={45}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>
            <button
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 rounded-full hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <IoMdClose className="text-2xl" />
            </button>
          </div>

          {/* Mobile menu navigation */}
          <div className="p-6">
            <ul className="list-none p-0 m-0 space-y-2">
              {navigationLinks.map((link, index) => (
                <li key={index}>
                  {link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="block text-gray-700 no-underline text-lg font-medium p-4 rounded-lg transition-all duration-200 hover:text-[#009DFF] hover:bg-blue-50"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link 
                      href={link.href} 
                      onClick={handleLinkClick}
                      className="block text-gray-700 no-underline text-lg font-medium p-4 rounded-lg transition-all duration-200 hover:text-[#009DFF] hover:bg-blue-50"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
