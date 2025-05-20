'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Image from 'next/image';
import { uploadToS3, generateUniqueKey } from '../../lib/aws-s3';
import Editor from '../components/SunEditor';

// Define section type
interface Section {
  id: string;
  title: string;
}

export default function CreateBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sections, setSections] = useState<Section[]>([
    { id: Date.now().toString(), title: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSectionDropdown, setShowSectionDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      const key = generateUniqueKey(file);
      return await uploadToS3({ file, key });
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      throw error;
    }
  };

  const addSection = () => {
    setSections([...sections, { id: Date.now().toString(), title: '' }]);
    setShowSectionDropdown(false);
  };

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(section => section.id !== id));
    }
  };

  const updateSection = (id: string, value: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, title: value } : section
    ));
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a blog title');
      return;
    }
    
    if (!content.trim()) {
      setError('Please enter blog content');
      return;
    }
    
    if (!imageFile) {
      setError('Please upload a cover image');
      return;
    }

    const invalidSections = sections.some(section => !section.title.trim());
    if (invalidSections) {
      setError('Please fill in all section titles');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // First, upload the image
      const imageUrl = await handleImageUpload(imageFile);

      // Then, create the post with the image URL
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          coverImage: imageUrl,
          sections: sections.map(section => section.title),
        }),
      });

      if (!postResponse.ok) {
        throw new Error('Failed to create post');
      }

      const post = await postResponse.json();
      router.push(`/article/${post._id}`);
    } catch (err) {
      console.error('Error creating blog post:', err);
      setError('Failed to create blog post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatContent = (text: string) => {
    return text.split('\n').map((paragraph, i) => (
      paragraph.trim() ? <p key={i} className="mb-4">{paragraph}</p> : null
    ));
  };

  const BlogPreview = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg">
        <div className="bg-blue-700 text-white py-4 px-6 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-medium">Blog Post Preview</h2>
          <button
            onClick={togglePreview}
            className="px-4 py-1 bg-white text-custom-blue rounded-lg hover:bg-blue-50 transition-colors"
          >
            Back to Editor
          </button>
        </div>

        <div className="p-8">
          {imagePreview && (
            <div className="h-96 w-full mb-8 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt={title || "Blog cover"}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {title ? (
            <h1 className="text-4xl font-bold mb-6">{title}</h1>
          ) : (
            <div className="h-12 bg-gray-100 rounded-lg mb-6 flex items-center justify-center text-gray-400">
              No title provided
            </div>
          )}

          <div className="flex items-center mb-8 text-gray-500">
            <span className="mr-4">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            {content ? (
              formatContent(content)
            ) : (
              <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No content provided
              </div>
            )}
          </div>

          {sections.length > 0 && (
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="border-t pt-8">
                  {section.title ? (
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  ) : (
                    <div className="h-8 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 w-2/3">
                      No section title provided
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {isPreviewMode ? (
          <div className="animate-fade-in">
            <BlogPreview />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto animate-slide-up">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-2xl font-bold mb-6">Create New Blog Post</h1>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 animate-slide-down">
                  {error}
                </div>
              )}

              {/* Title Input */}
              <div className="mb-6 animate-fade-in">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Blog Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter your blog title"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="mb-6 animate-fade-in">
                <label className="block text-gray-700 font-medium mb-2">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer bg-blue-50 text-custom-blue px-4 py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setImageFile(file);
                          
                          // Create a preview
                          const reader = new FileReader();
                          reader.onload = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative w-20 h-20 animate-scale">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Rich Text Editor */}
              <div className="mb-6 animate-fade-in">
                <label className="block text-gray-700 font-medium mb-2">
                  Content
                </label>
                {mounted && (
                  <Editor
                    value={content}
                    onChange={setContent}
                    onImageUpload={handleImageUpload}
                  />
                )}
              </div>

              {/* Sections Dropdown */}
              <div className="mb-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Sections</h2>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSectionDropdown(!showSectionDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-custom-blue rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105"
                    >
                      <span>Add Section</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${showSectionDropdown ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showSectionDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-10 animate-slide-down">
                        <button
                          type="button"
                          onClick={addSection}
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 text-custom-blue transition-colors duration-200"
                        >
                          Add New Section
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    className="border rounded-lg p-4 mb-4 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-center">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Section Title"
                      />
                      {sections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSection(section.id)}
                          className="ml-4 text-red-600 hover:text-red-700 transition-colors duration-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center animate-fade-in">
                <button
                  type="button"
                  onClick={togglePreview}
                  className="px-6 py-2 border border-custom-blue text-custom-blue rounded-lg hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-custom-blue text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}