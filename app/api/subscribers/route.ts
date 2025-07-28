import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogSubscribers from '@/models/BlogSubscribers';

// POST - Subscribe email
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email } = await request.json();
    
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await BlogSubscribers.findOne({ email: email.toLowerCase().trim() });
    
    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'Email already subscribed', alreadySubscribed: true },
        { status: 200 }
      );
    }

    // Create new subscriber
    const newSubscriber = new BlogSubscribers({
      email: email.toLowerCase().trim(),
    });

    await newSubscriber.save();

    return NextResponse.json(
      { message: 'Successfully subscribed!', subscribed: true },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET - Check if email is subscribed
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const subscriber = await BlogSubscribers.findOne({ email: email.toLowerCase().trim() });
    
    return NextResponse.json({
      subscribed: !!subscriber
    });
    
  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
} 