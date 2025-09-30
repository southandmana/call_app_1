import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parsePhoneNumber } from 'libphonenumber-js';
import { supabase } from '@/lib/supabase/client';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter: 5 requests per hour per phone number
const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60 * 60, // 1 hour
});

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    let parsedPhone;
    try {
      parsedPhone = parsePhoneNumber(phoneNumber);
      if (!parsedPhone || !parsedPhone.isValid()) {
        return NextResponse.json(
          { error: 'Invalid phone number format' },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const formattedPhone = parsedPhone.number; // E.164 format

    // Check rate limiting
    try {
      await rateLimiter.consume(formattedPhone);
    } catch (rateLimiterRes) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Send SMS via Telnyx
    try {
      console.log('Sending SMS with Telnyx:', {
        from: process.env.TELNYX_PHONE_NUMBER,
        to: formattedPhone,
        hasApiKey: !!process.env.TELNYX_API_KEY
      });

      await axios.post(
        'https://api.telnyx.com/v2/messages',
        {
          from: process.env.TELNYX_PHONE_NUMBER,
          to: formattedPhone,
          text: `Your AirTalk verification code is: ${code}`,
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Telnyx API error details:', JSON.stringify(error.response?.data, null, 2));
      const telnyxError = error.response?.data?.errors?.[0];
      return NextResponse.json(
        {
          error: telnyxError?.detail || 'Failed to send SMS. Please check your Telnyx configuration.',
          telnyxError: telnyxError
        },
        { status: 500 }
      );
    }

    // Store code in database (expires in 5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const { error: dbError } = await supabase
      .from('verification_codes')
      .insert({
        phone_number: formattedPhone,
        code: code,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        verified: false,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save verification code' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
    });
  } catch (error: any) {
    console.error('Send code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}