# Friend System Implementation Guide

**Version:** 1.0
**Date:** October 3, 2025
**Status:** Ready for Phase 1 Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Target Architecture](#target-architecture)
4. [Implementation Phases Overview](#implementation-phases-overview)
5. [Phase 1: Google Authentication (DETAILED)](#phase-1-google-authentication-detailed)
6. [Phase 2: Subscription System (OVERVIEW)](#phase-2-subscription-system-overview)
7. [Phase 3: Friend System (OVERVIEW)](#phase-3-friend-system-overview)
8. [Phase 4: Token System (OPTIONAL)](#phase-4-token-system-optional)
9. [Database Schema](#database-schema)
10. [Cost Analysis](#cost-analysis)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Guide](#deployment-guide)

---

## Executive Summary

### Current State
- **Authentication:** Ephemeral sessions based on phone verification (session_id regenerates on re-verification)
- **User Identity:** No permanent user records - cannot build stable friend relationships
- **Features:** Random voice matching with interest filtering only
- **Hosting:** Vercel (frontend) + Railway (Socket.IO server) + Supabase (database)

### Target State
- **Authentication:** Google OAuth (primary) + one-time phone verification (security layer)
- **User Identity:** Permanent users table with google_id as stable identifier
- **Features:** Random matching + friend system + direct calling + subscriptions + optional tokens
- **Monetization:** Free tier (random only) → Basic $4.99 (add friends) → Premium $9.99 (unlimited features)

### Critical Issue Identified
**Problem:** Current `sessions.session_id` is TEXT and regenerates each verification. Cannot build friendships on ephemeral identifiers.

**Solution:** Create permanent `users` table with UUID primary key linked to google_id. Link sessions to users via user_id foreign key.

### Implementation Order (IMPORTANT)
1. **Phase 1:** Google Authentication (3-4 days) ← **START HERE**
2. **Phase 2:** Subscription System (2-3 days)
3. **Phase 3:** Friend System (2-3 days)
4. **Phase 4:** Token System (1-2 days, optional)

**Rationale:** Build monetization infrastructure BEFORE features to maximize revenue from day 1 of friend system launch.

---

## Current State Analysis

### Tech Stack
- **Frontend:** Next.js 15.5.4, React 19.1.0, TypeScript, Tailwind CSS 4
- **Backend:** Socket.IO 4.8.1 (WebRTC signaling)
- **WebRTC:** simple-peer 9.11.1 (P2P voice)
- **Database:** Supabase PostgreSQL
- **SMS:** Telnyx API (phone verification)
- **Hosting:** Vercel (frontend) + Railway (Socket.IO server)

### Current Database Schema

```sql
-- sessions table (CRITICAL ISSUE: session_id is ephemeral)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,  -- ⚠️ REGENERATES ON RE-VERIFICATION
    phone_number TEXT UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- verification_codes table (phone SMS codes)
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unused tables (future features)
CREATE TABLE call_history (...);
CREATE TABLE reports (...);
CREATE TABLE bans (...);
```

### Key Files and Their Current State

#### 1. `/src/app/page.tsx` (859 lines)
**Purpose:** Main app component
**Current Auth:** Uses phone verification modal
**Friend System:** Placeholder at line 366
```typescript
// Line 366: Current implementation (placeholder only)
const handleAddFriend = () => {
  console.log('Add friend clicked');
};
```

**Authentication Check:** Lines 75-85
```typescript
useEffect(() => {
  const checkSession = async () => {
    const storedSessionId = sessionStorage.getItem('session_id');
    if (!storedSessionId && !bypass) {
      setShowPhoneVerification(true);
      return;
    }
    // ... session validation
  };
  checkSession();
}, [bypass]);
```

**Needs Modification:** Replace phone verification with Google OAuth, add user context provider

#### 2. `/src/components/ControlBar.tsx` (161 lines)
**Purpose:** Control bar with Add Friend button
**Current State:** Lines 136-158 have placeholder "Add Friend" button
```typescript
<button
  onClick={handleAddFriend}
  className="p-3 rounded-full bg-purple-600 hover:bg-purple-700..."
>
  <UserPlus className="w-5 h-5" />
</button>
```

**Needs Modification:** Wire up to friend request API, show friend status indicator

#### 3. `/src/lib/socket-server.js` (283 lines)
**Purpose:** Socket.IO signaling server
**Current Auth:** Lines 76-89
```javascript
// Line 76: Current session validation
io.on('connection', async (socket) => {
  const sessionId = socket.handshake.auth.sessionId;

  if (!sessionId) {
    socket.emit('auth_error', { message: 'Session ID required' });
    socket.disconnect();
    return;
  }

  // Validate session in database
  const { data: session, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('phone_verified', true)
    .single();

  if (error || !session) {
    socket.emit('auth_error', { message: 'Invalid or unverified session' });
    socket.disconnect();
    return;
  }

  // Store socket connection
  activeConnections.set(socket.id, {
    sessionId,
    interests: [],
    // ... other metadata
  });
});
```

**Needs Modification:** Change from sessionId to userId, add user_id → socket_id mapping for direct calls

#### 4. `/src/lib/webrtc/socket-client.ts` (234 lines)
**Purpose:** Socket.IO client wrapper
**Current Auth:** Line 59-70
```typescript
// Line 59: Current connection with sessionId
this.socket = io(this.serverUrl, {
  transports: ['websocket'], // Already optimized!
  auth: {
    sessionId: this.sessionId,
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});
```

**Needs Modification:** Pass userId instead of sessionId

#### 5. `/src/app/api/auth/verify-code/route.ts` (141 lines)
**Purpose:** Phone verification endpoint
**Current Behavior:** Lines 90-122 create/update session with new session_id
```typescript
// Lines 90-122: CRITICAL - Regenerates session_id
const newSessionId = crypto.randomUUID();

const { data: session, error: sessionError } = await supabase
  .from('sessions')
  .upsert({
    session_id: newSessionId,  // ⚠️ NEW ID EVERY TIME
    phone_number: phoneNumber,
    phone_verified: true,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'phone_number'
  })
  .select()
  .single();
```

**Needs Modification:** After Google auth, this becomes one-time security check that updates `users.phone_verified = true`

---

## Target Architecture

### Authentication Flow (NEW)

```
┌─────────────────────────────────────────────────────────────┐
│                    USER VISITS APP                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Google OAuth Sign-In Button                    │
│         "Continue with Google" (NextAuth.js)                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│          Create/Update User in Supabase                     │
│   INSERT INTO users (google_id, email, display_name)        │
│          ON CONFLICT (google_id) DO UPDATE                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Check: phone_verified?                         │
└─────────────────────────────────────────────────────────────┘
            │                               │
      YES (skip)                        NO (first time)
            │                               │
            ▼                               ▼
    ┌─────────────────┐      ┌─────────────────────────────┐
    │  Show Main App  │      │ Show Phone Verification     │
    │  (voice calls)  │      │    (ONE-TIME ONLY)          │
    └─────────────────┘      └─────────────────────────────┘
                                          │
                                          ▼
                             ┌─────────────────────────────┐
                             │ Update users.phone_verified │
                             │      = TRUE                 │
                             └─────────────────────────────┘
                                          │
                                          ▼
                             ┌─────────────────────────────┐
                             │      Show Main App          │
                             └─────────────────────────────┘
```

### User Identity (NEW)

```
Old System (BROKEN):
sessions.session_id (TEXT) → changes every verification → cannot build stable friendships

New System (FIXED):
users.id (UUID) ← PERMANENT
  └─ users.google_id (TEXT UNIQUE) ← STABLE IDENTIFIER
       └─ users.email
       └─ users.phone_number
       └─ users.phone_verified (BOOLEAN)
       └─ users.subscription_tier (TEXT: 'free' | 'basic' | 'premium')
```

### Feature Access by Tier

| Feature | Free | Basic ($4.99) | Premium ($9.99) |
|---------|------|---------------|-----------------|
| Random voice calls | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| Interest filtering | ✅ | ✅ | ✅ |
| Add friends | ❌ | ✅ Up to 50 | ✅ Unlimited |
| Direct call friends | ❌ | ✅ | ✅ |
| Message friends | ❌ | ✅ | ✅ |
| Profile customization | ❌ | ✅ Basic | ✅ Advanced |
| Ad-free experience | ❌ | ✅ | ✅ |
| Priority matching | ❌ | ❌ | ✅ |
| Call recording | ❌ | ❌ | ✅ |

### Socket.IO Architecture (UPDATED)

```javascript
// OLD: Track by sessionId (ephemeral)
activeConnections.set(socket.id, { sessionId, interests });

// NEW: Track by userId (permanent)
activeConnections.set(socket.id, {
  userId,      // UUID from users.id
  interests,
  tier,        // 'free' | 'basic' | 'premium'
  socketId: socket.id
});

// NEW: User to socket mapping (for direct calls)
userToSocket.set(userId, socket.id);
```

**Direct Call Flow:**
1. Friend A clicks "Call Friend B"
2. Frontend sends `call_friend` event with `targetUserId`
3. Server looks up Friend B's socket: `userToSocket.get(targetUserId)`
4. Server sends `incoming_call` event to Friend B's socket
5. WebRTC handshake proceeds normally

---

## Implementation Phases Overview

### Phase 1: Google Authentication (3-4 days) ⭐ START HERE
**Goal:** Replace ephemeral sessions with permanent Google-based user accounts

**Key Changes:**
- Install NextAuth.js
- Set up Google OAuth
- Create users table
- Migrate phone verification to one-time security check
- Update Socket.IO to use userId

**Deliverables:**
- Users can sign in with Google
- Phone verification happens once before first call
- Stable user identity for future friend system

### Phase 2: Subscription System (2-3 days)
**Goal:** Monetization infrastructure before friend features

**Key Changes:**
- Integrate Stripe
- Create subscription management UI
- Implement tier-based feature gating
- Add webhook handlers for subscription events

**Deliverables:**
- Users can subscribe to Basic/Premium
- Features locked behind subscription tiers
- Revenue tracking dashboard

### Phase 3: Friend System (2-3 days)
**Goal:** Core friend functionality

**Key Changes:**
- Create friendships table
- Build friend request UI
- Implement direct calling
- Add friends list page

**Deliverables:**
- Send/accept friend requests during calls
- Direct call friends from friends list
- Gated behind Basic tier ($4.99)

### Phase 4: Token System (1-2 days, OPTIONAL)
**Goal:** Alternative monetization for one-time purchases

**Key Changes:**
- Add tokens column to users table
- Create token purchase flow
- Implement token-gated features (unlock 1 friend for $0.99)

**Deliverables:**
- Buy token packs via Stripe
- Use tokens to unlock individual features
- Free users can try friend system without subscription

---

## Phase 1: Google Authentication (DETAILED)

### Prerequisites

**Required Accounts:**
1. Google Cloud Console account (free)
2. Existing Supabase project (already have)
3. Vercel deployment (already have)
4. Railway deployment (already have)

**Time Estimate:** 3-4 days (including testing)

---

### Step 1.1: Install Dependencies

```bash
# From project root
npm install next-auth@^4.24.5 @next-auth/supabase-adapter
```

**Why these packages?**
- `next-auth`: Industry standard for OAuth in Next.js
- `@next-auth/supabase-adapter`: Stores NextAuth sessions in Supabase

---

### Step 1.2: Set Up Google OAuth Credentials

**1. Go to Google Cloud Console:**
https://console.cloud.google.com/

**2. Create New Project (or select existing):**
- Project name: "AirTalk Voice App"
- Organization: None (personal)

**3. Enable Google+ API:**
- Navigate to: APIs & Services → Library
- Search: "Google+ API"
- Click Enable

**4. Create OAuth Credentials:**
- Navigate to: APIs & Services → Credentials
- Click: Create Credentials → OAuth Client ID
- Application type: Web application
- Name: "AirTalk Production"
- Authorized JavaScript origins:
  - `http://localhost:3000` (for local dev)
  - `https://call-app-1.vercel.app` (production)
- Authorized redirect URIs:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://call-app-1.vercel.app/api/auth/callback/google`

**5. Copy Credentials:**
- You'll get: Client ID and Client Secret
- Keep these for Step 1.3

---

### Step 1.3: Configure Environment Variables

**Add to `.env.local` (for local development):**

```bash
# Existing variables (keep these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TELNYX_API_KEY=your_telnyx_api_key
TELNYX_PHONE_NUMBER=your_telnyx_phone
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true

# NEW: NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_command_below

# NEW: Google OAuth (from Step 1.2)
GOOGLE_CLIENT_ID=your_google_client_id_from_step_1.2
GOOGLE_CLIENT_SECRET=your_google_client_secret_from_step_1.2
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Add to Vercel Environment Variables:**
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add the same variables above, but change:
   - `NEXTAUTH_URL=https://call-app-1.vercel.app`

**Add to Railway Environment Variables:**
1. Go to: Railway dashboard → your project → Variables
2. Add ONLY these (Socket.IO server doesn't need OAuth directly):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### Step 1.4: Create Database Migration

**Run in Supabase SQL Editor:**

```sql
-- ============================================
-- MIGRATION: Add Google Authentication
-- Date: 2025-10-03
-- Phase: 1
-- ============================================

-- 1. Create users table (permanent user identity)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id TEXT UNIQUE NOT NULL,  -- Stable identifier from Google
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,

    -- Phone verification (one-time security check)
    phone_number TEXT UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMPTZ,

    -- Subscription info (for Phase 2)
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
    subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due')),
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    subscription_expires_at TIMESTAMPTZ,

    -- Token system (for Phase 4, optional)
    tokens INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- 2. Create indexes for performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone_number ON users(phone_number);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);

-- 3. Add user_id to sessions table (link sessions to permanent users)
ALTER TABLE sessions ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

-- 4. Make session_id nullable (will deprecate after migration)
ALTER TABLE sessions ALTER COLUMN session_id DROP NOT NULL;

-- 5. Create friendships table (for Phase 3)
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate friendships
    UNIQUE(user_id, friend_id),

    -- Prevent self-friendships
    CHECK (user_id != friend_id)
);

CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- 6. Create function to get mutual friends (for Phase 3)
CREATE OR REPLACE FUNCTION get_friends(p_user_id UUID)
RETURNS TABLE (
    friend_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.display_name,
        u.avatar_url,
        u.subscription_tier
    FROM friendships f
    JOIN users u ON u.id = f.friend_id
    WHERE f.user_id = p_user_id
      AND f.status = 'accepted'
    ORDER BY u.display_name ASC;
END;
$$ LANGUAGE plpgsql;

-- 7. Create subscriptions table (for Phase 2)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- 8. Create payments table (for Phase 2 & 4)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,  -- In cents
    currency TEXT DEFAULT 'usd',
    type TEXT NOT NULL CHECK (type IN ('subscription', 'tokens')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),

    -- For token purchases
    tokens_purchased INTEGER,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_type ON payments(type);

-- 9. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Enable Row Level Security (RLS) - IMPORTANT for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Users can update their own data (except sensitive fields)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can view their friendships
CREATE POLICY "Users can view own friendships" ON friendships
    FOR SELECT USING (user_id::text = auth.uid()::text OR friend_id::text = auth.uid()::text);

-- Users can create friendships
CREATE POLICY "Users can create friendships" ON friendships
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Users can update their own friendship requests
CREATE POLICY "Users can update friendships" ON friendships
    FOR UPDATE USING (friend_id::text = auth.uid()::text);

-- Users can view their subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Users can view their payments
CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
```

**Verify Migration:**
```sql
-- Check tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'friendships', 'subscriptions', 'payments');

-- Should return 4 rows
```

---

### Step 1.5: Create NextAuth Configuration

**Create file:** `/src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // user.id = Google's user ID (stable!)
        // user.email = email from Google
        // user.name = display name from Google
        // user.image = avatar URL from Google

        // Create or update user in Supabase
        const { data, error } = await supabase
          .from('users')
          .upsert({
            google_id: user.id,
            email: user.email,
            display_name: user.name,
            avatar_url: user.image,
            last_login_at: new Date().toISOString(),
          }, {
            onConflict: 'google_id',
            ignoreDuplicates: false,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating/updating user:', error);
          return false;
        }

        // Store user UUID in account for session
        if (account) {
          account.userId = data.id;
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        // Get user from database to get UUID
        const { data } = await supabase
          .from('users')
          .select('id, phone_verified, subscription_tier')
          .eq('google_id', user.id)
          .single();

        if (data) {
          token.userId = data.id;
          token.phoneVerified = data.phone_verified;
          token.subscriptionTier = data.subscription_tier;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).phoneVerified = token.phoneVerified;
        (session.user as any).subscriptionTier = token.subscriptionTier;
      }

      return session;
    },
  },

  pages: {
    signIn: '/',  // Redirect to home page for sign in
  },

  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

### Step 1.6: Update Main Page Component

**File:** `/src/app/page.tsx`

**Replace lines 1-100 (imports and initial state) with:**

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import PhoneVerification from '@/components/PhoneVerification';
import ErrorModal from '@/components/ErrorModal';
import ErrorToast from '@/components/ErrorToast';
import ErrorBanner from '@/components/ErrorBanner';
import ControlBar from '@/components/ControlBar';
import { WebRTCManager } from '@/lib/webrtc/manager';

// ... (keep existing type definitions)

export default function Home() {
  // NEW: NextAuth session
  const { data: session, status } = useSession();

  // Authentication states
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);

  // ... (keep all other existing state variables)

  // NEW: Check phone verification status after Google sign-in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const user = session.user as any;

      if (!user.phoneVerified) {
        setNeedsPhoneVerification(true);
        setShowPhoneVerification(true);
      } else {
        // User is fully authenticated, initialize WebRTC
        initializeWebRTC();
      }
    }
  }, [status, session]);

  const initializeWebRTC = () => {
    if (!session?.user) return;

    const user = session.user as any;
    const userId = user.id;  // UUID from users table

    // Initialize WebRTC manager with userId instead of sessionId
    const manager = new WebRTCManager(
      userId,  // Changed from sessionId
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
    );

    // ... rest of initialization (keep existing code)
  };

  // Handle phone verification completion
  const handlePhoneVerified = () => {
    setShowPhoneVerification(false);
    setNeedsPhoneVerification(false);

    // Refresh session to get updated phoneVerified status
    window.location.reload();
  };

  // Render logic
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-8">
            AirTalk
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Voice-only random chat with friends
          </p>
          <button
            onClick={() => signIn('google')}
            className="px-8 py-4 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-3 mx-auto"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    );
  }

  // Authenticated but needs phone verification
  if (needsPhoneVerification && showPhoneVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <PhoneVerification
          onVerified={handlePhoneVerified}
          userId={(session?.user as any)?.id}
        />
      </div>
    );
  }

  // Fully authenticated - show main app (keep existing JSX)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Keep all existing app UI */}
    </div>
  );
}
```

---

### Step 1.7: Update Phone Verification Component

**File:** `/src/components/PhoneVerification.tsx`

**Add userId prop and update API call:**

```typescript
interface PhoneVerificationProps {
  onVerified: () => void;
  userId: string;  // NEW: UUID from users table
}

export default function PhoneVerification({ onVerified, userId }: PhoneVerificationProps) {
  // ... keep existing state

  const handleVerifyCode = async () => {
    // ... existing validation

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          code,
          userId,  // NEW: Pass userId
        }),
      });

      // ... existing response handling
    } catch (error) {
      // ... existing error handling
    }
  };

  // ... keep rest of component
}
```

---

### Step 1.8: Update Phone Verification API Route

**File:** `/src/app/api/auth/verify-code/route.ts`

**Replace entire file with:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, code, userId } = await req.json();

    // Validate inputs
    if (!phoneNumber || !code || !userId) {
      return NextResponse.json(
        { error: 'Phone number, code, and userId are required' },
        { status: 400 }
      );
    }

    // Verify code
    const { data: verificationData, error: verificationError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone_number', phoneNumber)
      .eq('code', code)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (verificationError || !verificationData) {
      return NextResponse.json(
        { error: 'Invalid or expired verification code' },
        { status: 401 }
      );
    }

    // Update user with phone verification
    const { error: updateError } = await supabase
      .from('users')
      .update({
        phone_number: phoneNumber,
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

    // Delete used verification code
    await supabase
      .from('verification_codes')
      .delete()
      .eq('id', verificationData.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### Step 1.9: Update Socket.IO Server

**File:** `/src/lib/socket-server.js`

**Replace lines 76-117 (connection handler) with:**

```javascript
io.on('connection', async (socket) => {
  console.log('New connection attempt:', socket.id);

  // Get userId from auth (changed from sessionId)
  const userId = socket.handshake.auth.userId;

  if (!userId) {
    console.error('No userId provided');
    socket.emit('auth_error', { message: 'User ID required' });
    socket.disconnect();
    return;
  }

  try {
    // Validate user exists and is phone verified
    const { data: user, error } = await supabase
      .from('users')
      .select('id, phone_verified, subscription_tier')
      .eq('id', userId)
      .single();

    if (error || !user) {
      console.error('Invalid user:', error);
      socket.emit('auth_error', { message: 'Invalid user' });
      socket.disconnect();
      return;
    }

    if (!user.phone_verified) {
      console.error('Phone not verified for user:', userId);
      socket.emit('auth_error', { message: 'Phone verification required' });
      socket.disconnect();
      return;
    }

    // Store connection with userId
    activeConnections.set(socket.id, {
      userId,
      subscriptionTier: user.subscription_tier,
      interests: [],
      socketId: socket.id,
      connectedAt: new Date().toISOString(),
    });

    // NEW: Map userId to socketId (for direct calls in Phase 3)
    userToSocket.set(userId, socket.id);

    console.log(`User ${userId} connected (tier: ${user.subscription_tier})`);

    // Broadcast updated user count
    io.emit('user_count', activeConnections.size);

    // ... rest of event handlers (keep existing)

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Remove from mappings
      const connection = activeConnections.get(socket.id);
      if (connection) {
        userToSocket.delete(connection.userId);
      }

      activeConnections.delete(socket.id);

      // ... rest of disconnect logic
    });
  } catch (error) {
    console.error('Connection error:', error);
    socket.emit('auth_error', { message: 'Server error' });
    socket.disconnect();
  }
});

// NEW: Add at top of file (after imports)
const userToSocket = new Map(); // userId -> socketId mapping
```

---

### Step 1.10: Update Socket.IO Client

**File:** `/src/lib/webrtc/socket-client.ts`

**Replace constructor (lines 30-58) with:**

```typescript
constructor(userId: string, serverUrl: string) {  // Changed from sessionId
  this.userId = userId;  // Store userId
  this.serverUrl = serverUrl;
  this.handlers = new Map();

  // Connect to Socket.IO server with userId
  this.socket = io(this.serverUrl, {
    transports: ['websocket'],
    auth: {
      userId: this.userId,  // Changed from sessionId
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  this.setupEventHandlers();
}

// Update class property
private userId: string;  // Changed from sessionId
```

**Also update manager.ts:**

**File:** `/src/lib/webrtc/manager.ts`

```typescript
constructor(userId: string, socketUrl: string) {  // Changed from sessionId
  this.userId = userId;
  this.socketClient = new SocketClient(userId, socketUrl);
  // ... rest of constructor
}

private userId: string;  // Changed from sessionId
```

---

### Step 1.11: Add Session Provider to App

**File:** `/src/app/layout.tsx`

**Wrap children with SessionProvider:**

```typescript
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
```

---

### Step 1.12: Testing Phase 1

**Test Checklist:**

- [ ] **Local Development Test:**
  ```bash
  # Terminal 1: Start Socket.IO server
  node src/lib/socket-server.js

  # Terminal 2: Start Next.js
  npm run dev
  ```

  1. Open http://localhost:3000
  2. Click "Continue with Google"
  3. Sign in with Google account
  4. Should show phone verification modal
  5. Enter phone number, verify code
  6. Should show main app
  7. Check browser console: Socket connected with userId
  8. Open second tab, sign in with different Google account
  9. Verify both users show in online count

- [ ] **Database Verification:**
  ```sql
  -- Check user created
  SELECT * FROM users WHERE email = 'your-test-email@gmail.com';

  -- Should show:
  -- - id (UUID)
  -- - google_id (populated)
  -- - email
  -- - phone_verified = true (after verification)
  -- - subscription_tier = 'free'
  ```

- [ ] **Socket.IO Server Logs:**
  ```
  Expected output:
  New connection attempt: abc123
  User 550e8400-e29b-41d4-a716-446655440000 connected (tier: free)
  ```

- [ ] **Production Deployment Test:**
  1. Push code to GitHub
  2. Vercel auto-deploys
  3. Railway auto-deploys
  4. Test on https://call-app-1.vercel.app
  5. Verify Google OAuth redirect works
  6. Verify phone verification works
  7. Verify voice calls still work

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "NEXTAUTH_URL not set" | Add to .env.local and Vercel |
| Google OAuth redirect fails | Check authorized redirect URIs in Google Console |
| "Invalid user" on socket connection | userId not being passed correctly, check browser console |
| Phone verification fails | Check TELNYX_API_KEY is set in Vercel environment variables |

---

## Phase 2: Subscription System (OVERVIEW)

**Goal:** Monetization infrastructure before launching friend features

**Time Estimate:** 2-3 days

### Key Changes

1. **Install Stripe SDK:**
   ```bash
   npm install stripe @stripe/stripe-js
   ```

2. **Create Stripe Account:**
   - Sign up at https://stripe.com
   - Get API keys (test mode first)

3. **Create Products in Stripe:**
   - Basic: $4.99/month (price_abc123)
   - Premium: $9.99/month (price_xyz789)

4. **Add Subscription API Routes:**
   - `/api/subscriptions/create` - Create checkout session
   - `/api/subscriptions/portal` - Manage subscription
   - `/api/webhooks/stripe` - Handle Stripe events

5. **Create Subscription UI:**
   - Pricing page
   - "Upgrade" button in header
   - Subscription status indicator

6. **Implement Feature Gating:**
   ```typescript
   const canAddFriends = user.subscription_tier !== 'free';
   ```

7. **Stripe Webhook Handler:**
   - subscription.created → Update users.subscription_tier
   - subscription.updated → Update subscription status
   - subscription.deleted → Downgrade to free

### Testing Checklist
- [ ] Can subscribe to Basic tier
- [ ] Stripe webhook updates database
- [ ] Can cancel subscription
- [ ] Features locked behind tier work correctly

---

## Phase 3: Friend System (OVERVIEW)

**Goal:** Core friend functionality

**Time Estimate:** 2-3 days

### Key Changes

1. **Add Friend Request API Routes:**
   - `/api/friends/request` - Send friend request
   - `/api/friends/accept` - Accept request
   - `/api/friends/reject` - Reject request
   - `/api/friends/list` - Get friends list

2. **Wire Up "Add Friend" Button:**
   ```typescript
   const handleAddFriend = async () => {
     // Get other user's ID from current call
     const otherUserId = currentCall.otherUserId;

     // Send friend request
     await fetch('/api/friends/request', {
       method: 'POST',
       body: JSON.stringify({ friendId: otherUserId }),
     });
   };
   ```

3. **Create Friends List Page:**
   - `/friends` route
   - List accepted friends
   - Show online status (from Socket.IO)
   - "Call" button for each friend

4. **Implement Direct Calling:**
   ```javascript
   // Socket.IO server
   socket.on('call_friend', async ({ targetUserId }) => {
     // Check friendship exists
     const { data } = await supabase
       .from('friendships')
       .select('*')
       .eq('user_id', socket.userId)
       .eq('friend_id', targetUserId)
       .eq('status', 'accepted')
       .single();

     if (!data) {
       socket.emit('error', { message: 'Not friends' });
       return;
     }

     // Get target's socket
     const targetSocketId = userToSocket.get(targetUserId);

     if (!targetSocketId) {
       socket.emit('error', { message: 'Friend is offline' });
       return;
     }

     // Send call invitation
     io.to(targetSocketId).emit('incoming_call', {
       callerId: socket.userId,
       callerName: socket.displayName,
     });
   });
   ```

5. **Feature Gating:**
   - Check subscription tier before allowing friend requests
   - Basic tier: max 50 friends
   - Premium tier: unlimited

### Testing Checklist
- [ ] Can send friend request during call
- [ ] Other user receives notification
- [ ] Can accept/reject requests
- [ ] Friends appear in friends list
- [ ] Can call friend directly
- [ ] Direct call establishes WebRTC connection
- [ ] Feature gating works (free tier blocked)

---

## Phase 4: Token System (OPTIONAL)

**Goal:** Alternative monetization for one-time purchases

**Time Estimate:** 1-2 days

### Key Changes

1. **Token Pricing:**
   - 10 tokens: $0.99
   - 50 tokens: $3.99
   - 100 tokens: $6.99

2. **Token-Gated Features:**
   - Unlock 1 friend slot: 1 token (free users)
   - Skip phone verification: 5 tokens
   - Custom avatar: 2 tokens
   - Priority matching: 3 tokens/day

3. **Token Purchase Flow:**
   ```typescript
   // Create Stripe checkout for tokens
   const session = await stripe.checkout.sessions.create({
     mode: 'payment',  // One-time payment
     line_items: [{
       price: 'price_tokens_10',
       quantity: 1,
     }],
     metadata: {
       userId: user.id,
       tokensPurchased: 10,
     },
   });
   ```

4. **Stripe Webhook:**
   ```typescript
   case 'checkout.session.completed':
     const tokens = session.metadata.tokensPurchased;
     await supabase
       .from('users')
       .update({ tokens: user.tokens + tokens })
       .eq('id', session.metadata.userId);
     break;
   ```

5. **Token Deduction:**
   ```typescript
   async function useTokens(userId: string, amount: number) {
     const { data: user } = await supabase
       .from('users')
       .select('tokens')
       .eq('id', userId)
       .single();

     if (user.tokens < amount) {
       throw new Error('Insufficient tokens');
     }

     await supabase
       .from('users')
       .update({ tokens: user.tokens - amount })
       .eq('id', userId);
   }
   ```

### Testing Checklist
- [ ] Can purchase token packs
- [ ] Tokens added to user account
- [ ] Can unlock friend slot with tokens
- [ ] Token balance displays correctly
- [ ] Insufficient tokens shows error

---

## Database Schema

**Complete schema (all phases):**

```sql
-- ============================================
-- COMPLETE DATABASE SCHEMA
-- All Phases (1-4)
-- ============================================

-- Users table (Phase 1)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    phone_number TEXT UNIQUE,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMPTZ,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
    subscription_status TEXT DEFAULT 'inactive',
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT,
    subscription_expires_at TIMESTAMPTZ,
    tokens INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Friendships table (Phase 3)
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

-- Subscriptions table (Phase 2)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table (Phase 2 & 4)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    type TEXT NOT NULL CHECK (type IN ('subscription', 'tokens')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
    tokens_purchased INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Existing tables (keep)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id TEXT,
    phone_number TEXT,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Cost Analysis

### Development Costs (One-Time)

| Item | Cost | Notes |
|------|------|-------|
| Google OAuth setup | $0 | Free |
| Stripe account | $0 | No setup fee |
| Development time | $0 | Your time (3-4 days Phase 1) |
| **Total** | **$0** | |

### Operational Costs (Monthly)

**Current Infrastructure (0-100 users):**

| Service | Cost | Notes |
|---------|------|-------|
| Railway (Socket.IO) | $0 | Free tier, $5 credits/month |
| Vercel (Frontend) | $0 | Hobby plan |
| Supabase (Database) | $0 | Free tier |
| Stripe fees | $0 | No fixed fee, 2.9% + $0.30 per transaction |
| **Total** | **$0/month** | |

**At 1,000 Users with Subscriptions:**

| Service | Cost | Notes |
|---------|------|-------|
| Hetzner CX11 | $5.50 | Migrated from Railway |
| Vercel | $0 | Still within free tier |
| Supabase | $0 | Still within free tier |
| Stripe fees | ~$140 | 10% conversion = 100 paid users × $4.99 × 2.9% |
| **Total** | **~$145.50/month** | |

**Revenue at 1,000 Users:**

| Tier | Users | Revenue |
|------|-------|---------|
| Basic ($4.99) | 80 | $399.20 |
| Premium ($9.99) | 20 | $199.80 |
| **Total** | **100** | **$599/month** |

**Net Profit:** $599 - $145.50 = **$453.50/month**

---

## Testing Strategy

### Unit Tests (Optional but Recommended)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

**Example: Test friend request API**

```typescript
// __tests__/api/friends/request.test.ts
import { POST } from '@/app/api/friends/request/route';

describe('/api/friends/request', () => {
  it('should create friend request', async () => {
    const req = new Request('http://localhost:3000/api/friends/request', {
      method: 'POST',
      body: JSON.stringify({
        userId: 'user-1',
        friendId: 'user-2',
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('should reject duplicate friend request', async () => {
    // ... test duplicate prevention
  });
});
```

### Integration Tests

**Test Flow:**
1. User signs in with Google
2. User verifies phone
3. User starts random call
4. User sends friend request
5. Friend accepts request
6. User calls friend directly

### Manual Testing Checklist

**Phase 1 (Google Auth):**
- [ ] Can sign in with Google
- [ ] User created in database
- [ ] Phone verification modal shows for new users
- [ ] Phone verification updates user record
- [ ] Socket.IO connects with userId
- [ ] Can make random calls after auth

**Phase 2 (Subscriptions):**
- [ ] Pricing page displays correctly
- [ ] Can create Stripe checkout session
- [ ] Stripe webhook updates database
- [ ] Subscription status reflects in UI
- [ ] Can cancel subscription
- [ ] Features locked behind tier work

**Phase 3 (Friends):**
- [ ] Can send friend request during call
- [ ] Notification appears for receiver
- [ ] Can accept friend request
- [ ] Friend appears in friends list
- [ ] Can call friend directly
- [ ] Direct call uses WebRTC
- [ ] Free tier blocked from adding friends

**Phase 4 (Tokens):**
- [ ] Can purchase tokens
- [ ] Tokens added to account
- [ ] Can unlock feature with tokens
- [ ] Token balance updates correctly

---

## Deployment Guide

### Phase 1 Deployment

**1. Push Code to GitHub:**
```bash
git add .
git commit -m "feat: Add Google OAuth authentication (Phase 1)"
git push origin main
```

**2. Vercel Auto-Deploy:**
- Vercel detects new commit
- Build starts automatically
- Add new environment variables in Vercel dashboard:
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
- Redeploy after adding variables

**3. Railway Auto-Deploy:**
- Railway detects new commit
- Socket.IO server redeploys automatically
- No new environment variables needed

**4. Update Google OAuth:**
- Go to Google Cloud Console
- Update authorized redirect URIs with Vercel production URL

**5. Test Production:**
- Visit https://call-app-1.vercel.app
- Sign in with Google
- Verify phone verification works
- Test voice calls still work

### Environment Variables Summary

**Local (.env.local):**
```bash
# Existing
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
TELNYX_API_KEY=...
TELNYX_PHONE_NUMBER=...
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true

# New (Phase 1)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generated_with_openssl
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Vercel:**
```bash
# All from .env.local but change:
NEXTAUTH_URL=https://call-app-1.vercel.app
```

**Railway:**
```bash
# Keep existing variables (no changes needed for Phase 1)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Troubleshooting

### Common Issues

**Issue: "NEXTAUTH_URL is not set"**
- **Cause:** Missing environment variable
- **Fix:** Add to .env.local and Vercel
- **Verify:** `echo $NEXTAUTH_URL` should print URL

**Issue: Google OAuth redirect fails**
- **Cause:** Unauthorized redirect URI
- **Fix:** Add exact URL to Google Cloud Console authorized redirect URIs
- **Format:** `https://call-app-1.vercel.app/api/auth/callback/google`

**Issue: "Invalid user" on socket connection**
- **Cause:** userId not being passed from frontend
- **Fix:** Check browser console for userId value
- **Debug:** Add `console.log('userId:', userId)` in socket-client.ts

**Issue: Phone verification fails**
- **Cause:** TELNYX_API_KEY not set in Vercel
- **Fix:** Add to Vercel environment variables
- **Test:** Check Vercel function logs for Telnyx errors

**Issue: Database migration fails**
- **Cause:** Syntax error or missing permissions
- **Fix:** Run each CREATE TABLE statement individually in Supabase SQL editor
- **Check:** View Supabase logs for specific error

**Issue: NextAuth session not persisting**
- **Cause:** Missing SessionProvider wrapper
- **Fix:** Ensure layout.tsx wraps children with `<SessionProvider>`
- **Verify:** Check React DevTools for SessionProvider in component tree

---

## Next Steps After Phase 1

1. **Test with Real Users:**
   - Share with 5-10 friends
   - Collect feedback on auth flow
   - Monitor for errors in production

2. **Monitor Metrics:**
   - Supabase dashboard: Check user count growth
   - Vercel analytics: Track page views
   - Railway logs: Monitor Socket.IO connections

3. **Prepare for Phase 2:**
   - Create Stripe account
   - Design pricing page mockup
   - Plan feature gating strategy

4. **Optimize if Needed:**
   - If Railway credits running low, implement Socket.IO optimizations from SCALING.md
   - Monitor database query performance in Supabase

5. **Document Issues:**
   - Keep log of bugs found
   - Track user feedback
   - Update TODO.md with new tasks

---

## Success Criteria

**Phase 1 is complete when:**

- ✅ Users can sign in with Google OAuth
- ✅ New users go through one-time phone verification
- ✅ Returning users skip phone verification
- ✅ Socket.IO authenticates with userId (not sessionId)
- ✅ Voice calls still work end-to-end
- ✅ Users table populated with Google profile data
- ✅ No errors in production logs
- ✅ All tests pass
- ✅ Documentation updated

**Ready for Phase 2 when:**
- 10+ users successfully authenticated
- No critical bugs reported
- Socket.IO stable for 24+ hours
- Database performance acceptable

---

## Contact & Support

**If you encounter issues:**

1. Check this documentation first
2. Review Supabase logs
3. Check Vercel function logs
4. Check Railway deployment logs
5. Test locally to isolate issue

**Common Log Locations:**

- **Supabase:** Dashboard → Logs → Postgres
- **Vercel:** Dashboard → Project → Deployments → [deployment] → Function Logs
- **Railway:** Dashboard → Project → Deployments → View Logs
- **Browser:** DevTools → Console (for client-side errors)

---

**END OF PHASE 1 IMPLEMENTATION GUIDE**

This document contains all information needed to implement Phase 1 (Google Authentication) without additional context. Proceed with Step 1.1 and follow sequentially through Step 1.12.
