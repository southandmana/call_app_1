import { NextRequest, NextResponse } from 'next/server';
import { parsePhoneNumber } from 'libphonenumber-js';
import { supabase } from '@/lib/supabase/client';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code, userId } = await request.json();

    if (!phoneNumber || !code || !userId) {
      return NextResponse.json(
        { error: 'Phone number, code, and userId are required' },
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

    const formattedPhone = parsedPhone.number;

    // Find the most recent non-expired, non-verified code for this phone
    const { data: verificationData, error: fetchError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone_number', formattedPhone)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !verificationData) {
      return NextResponse.json(
        { error: 'No valid verification code found. Please request a new code.' },
        { status: 404 }
      );
    }

    // Check if code has expired
    if (new Date(verificationData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check max attempts (3 attempts per code)
    if (verificationData.attempts >= 3) {
      return NextResponse.json(
        { error: 'Too many attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // Verify code
    if (verificationData.code !== code) {
      // Increment attempts
      await supabase
        .from('verification_codes')
        .update({ attempts: verificationData.attempts + 1 })
        .eq('id', verificationData.id);

      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Code is correct! Mark as verified
    await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('id', verificationData.id);

    // Update user with phone verification (one-time security check)
    const { error: updateError } = await supabase
      .from('users')
      .update({
        phone_number: formattedPhone,
        phone_verified: true,
        phone_verified_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify phone number' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Phone verified successfully',
    });
  } catch (error: any) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}