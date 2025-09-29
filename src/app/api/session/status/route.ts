import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Check if session exists and is verified
    const { data: session, error } = await supabase
      .from('sessions')
      .select('id, phone_verified, phone_verified_at, created_at')
      .eq('session_id', sessionId)
      .single();

    if (error || !session) {
      return NextResponse.json(
        { verified: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    // Update last_active timestamp
    await supabase
      .from('sessions')
      .update({ last_active: new Date().toISOString() })
      .eq('session_id', sessionId);

    return NextResponse.json({
      verified: session.phone_verified,
      sessionId: sessionId,
      verifiedAt: session.phone_verified_at,
      createdAt: session.created_at,
    });
  } catch (error: any) {
    console.error('Session status error:', error);
    return NextResponse.json(
      { error: 'Internal server error', verified: false },
      { status: 500 }
    );
  }
}