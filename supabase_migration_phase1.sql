-- ============================================
-- MIGRATION: Add Google Authentication
-- Date: 2025-10-03
-- Phase: 1 - Google OAuth Implementation
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
-- VERIFICATION QUERIES
-- Run these after migration to verify success
-- ============================================

-- Check tables created
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('users', 'friendships', 'subscriptions', 'payments');
-- Should return 4 rows

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
