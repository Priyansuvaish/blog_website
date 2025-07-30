'use client';

import { useState, useEffect } from 'react';

interface EmailSubscriptionProps {
  className?: string;
}

export default function EmailSubscription({ className = '' }: EmailSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Check localStorage and subscription status on component mount
  useEffect(() => {
    const checkSubscriptionStatus = () => {
      // Check localStorage first
      const localSubscriptionStatus = localStorage.getItem('blog_subscribed');
      const subscribedEmail = localStorage.getItem('blog_subscriber_email');
      
      if (localSubscriptionStatus === 'true' && subscribedEmail) {
        setIsSubscribed(true);
        setEmail(subscribedEmail);
      }
    };

    checkSubscriptionStatus();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.alreadySubscribed) {
          setMessage('You are already subscribed to our newsletter!');
        } else {
          setMessage('Successfully subscribed! Thank you for joining our newsletter.');
        }
        
        // Update localStorage
        localStorage.setItem('blog_subscribed', 'true');
        localStorage.setItem('blog_subscriber_email', email.trim().toLowerCase());
        setIsSubscribed(true);
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = () => {
    // Clear localStorage
    localStorage.removeItem('blog_subscribed');
    localStorage.removeItem('blog_subscriber_email');
    setIsSubscribed(false);
    setEmail('');
    setMessage('');
    setError('');
  };

  if (isSubscribed) {
    return (
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-green-800">You're Subscribed!</h3>
        </div>
        <p className="text-green-700 mb-4">Thank you for subscribing to our newsletter. You'll receive our latest articles directly in your inbox.</p>
        <button
          onClick={handleUnsubscribe}
          className="text-sm text-green-600 hover:text-green-800 underline transition-colors duration-200"
        >
          Change subscription preferences
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-[#009FFF]/5 to-blue-50 border border-[#009FFF]/20 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-[#009FFF]/10 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-[#009FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Stay Updated</h3>
      </div>
      
      <p className="text-gray-600 mb-6 font-light">
        Subscribe to our newsletter and get the latest articles on land transactions, property insights, and market trends delivered directly to your inbox.
      </p>

      <form onSubmit={handleSubscribe} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#009FFF]/20 focus:border-[#009FFF] transition-all duration-200 font-light"
            disabled={isLoading}
            required
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#009FFF] hover:bg-[#007ACC] text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#009FFF]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Subscribe to Newsletter
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
} 