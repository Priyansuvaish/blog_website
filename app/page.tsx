'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import SectionBlock from '../components/SectionBlock'
import TrustedLogos from '../components/TrustedLogos'
import Footer from '../components/Footer'

interface Post {
  _id: string;
  title: string;
  content: string;
  coverImage: string;
  sections: string[];
  createdAt: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to My Blog</h1>
        <div className="text-center py-8">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to My Blog</h1>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // Group posts by sections
  const postsBySection = posts.reduce((acc, post) => {
    (post.sections || []).forEach(section => {
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(post);
    });
    return acc;
  }, {} as Record<string, Post[]>);

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      {/* Feature Section */}
      <section className="py-12 bg-white flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="uppercase text-xs text-gray-400 mb-2">Feature</div>
          <h2 className="text-2xl font-bold mb-2">Explore real estate data with ease</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explore valuable and make smarter decisions with our easy-to-use platform.
          </p>
        </div>
        <div className="my-8">
          <div className="w-64 h-40 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="/insights.png" 
              alt="Real Estate Insights" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>
      <main className="container mx-auto px-4 flex-1">
        <h2 className="text-xl font-bold text-center my-8">Begin your journey towards real estate success</h2>
        {/* Multiple article sections */}
        {Object.entries(postsBySection).map(([section, sectionPosts]) => (
          <SectionBlock 
            key={section} 
            title={section} 
            articles={sectionPosts.map(post => ({
              id: post._id,
              title: post.title,
              excerpt: post.content.substring(0, 150) + '...',
              content: post.content,
              image: post.coverImage,
              date: new Date(post.createdAt).toLocaleDateString()
            }))} 
          />
        ))}
      </main>
      <TrustedLogos />
      <Footer />
    </div>
  );
} 