-- Sessions table: tracks anonymous users via browser cookies
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    interests TEXT[], -- array of interest tags
    preferred_countries TEXT[], -- array of country codes
    non_preferred_countries TEXT[] -- array of country codes
);

-- Call history: stores last 5 calls per user
CREATE TABLE call_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    partner_country TEXT,
    call_started_at TIMESTAMPTZ NOT NULL,
    call_duration_seconds INTEGER,
    partner_online BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports: tracks user reports for moderation
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    reported_session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (LENGTH(reason) BETWEEN 10 AND 300),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bans: tracks banned users
CREATE TABLE bans (
    session_id UUID PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
    banned_at TIMESTAMPTZ DEFAULT NOW(),
    ban_expires_at TIMESTAMPTZ,
    report_count INTEGER DEFAULT 0,
    permanent BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX idx_sessions_session_id ON sessions(session_id);
CREATE INDEX idx_call_history_session_id ON call_history(session_id);
CREATE INDEX idx_call_history_created_at ON call_history(created_at DESC);
CREATE INDEX idx_reports_reported_session ON reports(reported_session_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_bans_expires ON bans(ban_expires_at) WHERE ban_expires_at IS NOT NULL;