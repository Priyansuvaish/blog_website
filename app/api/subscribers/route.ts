import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogSubscribers, { BlogSubscriberUtils } from '@/models/BlogSubscribers';

// POST - Subscribe email or update email
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, oldEmail, action } = await request.json();
    
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

    // Handle email update
    if (action === 'update' && oldEmail) {
      const result = await BlogSubscriberUtils.updateSubscriberEmail(oldEmail, email);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          message: result.message, 
          subscribed: true,
          alreadySubscribed: result.alreadySubscribed 
        },
        { status: 200 }
      );
    }

    // Handle new subscription
    const result = await BlogSubscriberUtils.subscribeEmail(email);
    
    return NextResponse.json(
      { 
        message: result.message, 
        subscribed: true,
        alreadySubscribed: result.alreadySubscribed 
      },
      { status: result.alreadySubscribed ? 200 : 201 }
    );
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again later.' },
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

    const isSubscribed = await BlogSubscriberUtils.isEmailSubscribed(email);
    
    return NextResponse.json({
      subscribed: isSubscribed
    });
    
  } catch (error) {
    console.error('Check subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
} 