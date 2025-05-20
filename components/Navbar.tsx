'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toLocaleDateString());
  }, []);

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'https://www.earthfields.in/about';
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'https://www.earthfields.in/contact';
  };

  return (
    <nav className="w-full bg-white shadow flex items-center justify-between px-4 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="font-bold text-lg text-blue-700">Earthfields</Link>
      </div>
      {/* Nav Links */}
      <div className="hidden md:flex gap-6">
        <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <Link href="#" className="text-gray-700 hover:text-blue-600">Insights</Link>
        <Link href="/create" className="text-gray-700 hover:text-blue-600">Create Post</Link>
        <a 
          href="https://www.earthfields.in/about" 
          onClick={handleAboutClick}
          className="text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          About
        </a>
        <a 
          href="https://www.earthfields.in/contact" 
          onClick={handleContactClick}
          className="text-gray-700 hover:text-blue-600 cursor-pointer"
        >
          Contact
        </a>
      </div>
      {/* Auth Buttons */}
      <div className="flex gap-2">
        <Link href="#" className="border border-custom-blue text-custom-blue px-4 py-1 rounded hover:bg-blue-50 transition">Login</Link>
        <Link href="#" className="bg-custom-blue text-white px-4 py-1 rounded hover:bg-opacity-90 transition">Sign up</Link>
      </div>
    </nav>
  )
}