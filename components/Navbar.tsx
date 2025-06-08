"use client";

import Link from "next/link";
import { RiMenu3Line } from "react-icons/ri";

// Navigation links configuration - easily add/remove links here
interface NavLink {
  href: string;
  label: string;
  isExternal?: boolean;
}

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

const navigationLinks: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  // Get logo URL from environment variable
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || "/earthfieldslogo.png";

  return (
    <div className="relative bg-white shadow-md px-4 lg:px-8">
      <nav className="flex justify-between items-center max-w-6xl mx-auto py-4">
        {/* Logo */}
        <div className="logo">
          <Link href="/">
            <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div 
          className="md:hidden cursor-pointer p-2 text-gray-700 hover:text-gray-900"
          onClick={onMobileMenuToggle}
        >
          <RiMenu3Line className="text-2xl" />
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
  );
};

export default Navbar;
