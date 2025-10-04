# Implementation Plan: Single Source of Truth

**Last Updated:** October 4, 2025
**Purpose:** Complete development roadmap with current state, remaining work, and execution order

---

## How to Use This Document

**For You (Product Owner):**
- Track what's done vs what's left
- See overall progress at a glance
- Update checkboxes as features complete
- Log challenges and solutions

**For AI Assistant:**
- Reference specific phases: "Work on Phase 2, Task 3"
- Understand dependencies between features
- Check current codebase state before starting
- Update this doc after completing tasks

---

## Progress Overview

### Completion Status

| Phase | Status | Progress |
|-------|--------|----------|
| **Phase 1: MVP Foundation** | 🟡 In Progress | 60% (6/10 tasks) |
| **Phase 2: Safety & Ratings** | ⚪ Not Started | 0% (0/8 tasks) |
| **Phase 3: Friend System** | ⚪ Not Started | 0% (0/6 tasks) |
| **Phase 4: Events System** | ⚪ Not Started | 0% (0/9 tasks) |
| **Phase 5: Monetization** | ⚪ Not Started | 0% (0/5 tasks) |
| **Phase 6: Matcher AI** | ⚪ Not Started | 0% (0/6 tasks) |
| **Phase 7: Polish & Scale** | ⚪ Not Started | 0% (0/7 tasks) |

**Overall Progress:** 12% (6/41 tasks)

---

## Current Codebase State

### ✅ Completed Features

#### 1. Authentication System
- **Status:** ✅ Complete
- **Files:**
  - `/src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
  - `/src/app/api/auth/send-code/route.ts` - SMS code sending
  - `/src/app/api/auth/verify-code/route.ts` - SMS code verification
- **Technologies:**
  - NextAuth 4.24.11 (Google OAuth)
  - Supabase (user storage)
  - Phone verification (SMS codes)
- **Features:**
  - Google sign-in
  - Phone number verification
  - Session management
- **Limitations:**
  - Phone verification can be bypassed (feature flag)
  - No government ID verification yet

---

#### 2. Random Voice Calling (Core)
- **Status:** ✅ Complete
- **Files:**
  - `/src/lib/webrtc/manager.ts` - WebRTC call management
  - `/src/lib/webrtc/socket-client.ts` - Signaling client
  - `/src/lib/socket-server.js` - Signaling server
  - `/src/app/page.tsx` - Main UI (call button, states)
- **Technologies:**
  - SimplePeer 9.11.1 (WebRTC)
  - Socket.IO 4.8.1 (signaling)
  - STUN servers (Google, Twilio)
- **Features:**
  - Peer-to-peer voice calls
  - Call states (idle, searching, connected)
  - Microphone permission handling
  - Audio quality settings (echo cancellation, noise suppression)
- **Known Issues:**
  - No 10-minute timer enforced (free tier limit)
  - No call recording/transcription

---

#### 3. Call Filters (Partial)
- **Status:** ⚠️ Partial (UI implemented, backend logic incomplete)
- **Files:**
  - `/src/components/FiltersMenu.tsx` - Filter UI
  - `/src/app/page.tsx` - Filter state management
- **Technologies:**
  - React state (userFilters)
  - Socket.IO (sends filters to backend)
- **Features:**
  - Interest selection (multi-select)
  - Preferred countries (multi-select)
  - Excluded countries (multi-select)
- **Missing:**
  - Backend matching logic (doesn't actually filter users yet)
  - Gender filter (paid feature)
  - Filter priority system (hard vs soft filters)

---

#### 4. Auto-Call Mode
- **Status:** ✅ Complete
- **Files:**
  - `/src/app/page.tsx` - Auto-call toggle + logic
  - `/src/components/AccountMenu.tsx` - Settings UI
- **Features:**
  - Toggle on/off
  - Automatically restarts search after call ends
  - 2-second delay between calls
  - Respects active filters

---

#### 5. Basic UI/UX
- **Status:** ✅ Complete
- **Files:**
  - `/src/app/page.tsx` - Main screen
  - `/src/app/layout.tsx` - App layout
  - `/src/styles/theme.css` - Theme variables
  - `/src/app/globals.css` - Global styles
  - `/src/components/ThemeToggle.tsx` - Dark/light mode
  - `/src/components/ControlBar.tsx` - Call controls
  - `/src/components/VoiceActivityIndicator.tsx` - Voice visualization
- **Technologies:**
  - Tailwind CSS 4
  - CSS custom properties (theme variables)
  - Next.js 15 (React 19)
- **Features:**
  - Dark/light theme toggle
  - Responsive design
  - Call button with states (idle, searching, connected)
  - Mute button
  - Online user counter
  - Voice activity indicator (visual feedback)
- **Design Philosophy:**
  - Flat, minimalist design
  - Professional aesthetic
  - Smooth transitions

---

#### 6. Error Handling
- **Status:** ✅ Complete
- **Files:**
  - `/src/components/ErrorModal.tsx` - Modal for critical errors
  - `/src/components/ErrorToast.tsx` - Toast notifications
  - `/src/components/ErrorBanner.tsx` - Connection status banner
- **Features:**
  - Mic permission errors
  - Connection failures
  - Socket disconnection/reconnection states
  - User-friendly error messages

---

### ⚠️ Partially Implemented Features

#### 1. Phone Verification (Needs Upgrade to ID Verification)
- **Current:** SMS code verification
- **Missing:** Government ID verification (Stripe Identity)
- **Risk:** Minors can access platform
- **Priority:** 🔴 Critical (legal liability)

---

#### 2. Call Filters (Backend Logic Missing)
- **Current:** UI exists, filters sent to server
- **Missing:** Server-side matching algorithm
- **Risk:** Filters don't actually work (user expectations violated)
- **Priority:** 🟡 High

---

#### 3. Report/Block Functionality (Marked TODO)
- **Current:** Buttons exist in UI (disabled)
- **Missing:** Backend implementation
- **Risk:** Users can't protect themselves from abuse
- **Priority:** 🔴 Critical (safety issue)

---

### ❌ Not Implemented Features

(See Phase 2-7 below for complete list)

---

## Phased Implementation Plan

### Phase 1: MVP Foundation (60% Complete)

**Goal:** Launch-ready core functionality with basic safety

**Target Timeline:** 3-4 weeks

**Prerequisites:** None (can start immediately)

---

#### Task 1.1: Upgrade to Government ID Verification ✅ CRITICAL
- [ ] **Sign up for Stripe Identity**
  - Create Stripe account
  - Enable Identity product
  - Get API keys (test + production)
- [ ] **Create verification flow API route**
  - File: `/src/app/api/auth/verify-identity/route.ts`
  - Create Stripe Identity session
  - Return client_secret to frontend
- [ ] **Build verification UI**
  - File: `/src/components/IdentityVerification.tsx`
  - Stripe Identity SDK integration
  - Upload ID flow
  - Waiting/success/failure states
- [ ] **Update user model**
  - Add `id_verified` boolean to Supabase users table
  - Track verification timestamp
  - Store Stripe verification session ID
- [ ] **Enforce verification**
  - Block calling features until ID verified
  - Show verification prompt to unverified users
  - Remove bypass feature flag
- [ ] **Test with real IDs**
  - Use Stripe test mode (test IDs provided)
  - Verify age extraction works (18+ check)
  - Test edge cases (expired ID, blurry photo, etc.)

**Dependencies:** None

**Estimated Time:** 2-3 days

**Files to Create/Modify:**
- `/src/app/api/auth/verify-identity/route.ts` (new)
- `/src/components/IdentityVerification.tsx` (new)
- `/src/app/page.tsx` (update to require verification)
- Supabase schema migration

**Success Criteria:**
- All new users must verify ID before first call
- Minors (< 18) cannot create accounts
- Verification completes in < 60 seconds

---

#### Task 1.2: Implement 10-Minute Call Timer (Free Tier)
- [ ] **Add timer to WebRTC manager**
  - File: `/src/lib/webrtc/manager.ts`
  - Start timer when call connects
  - Emit warning at 9 minutes
  - Auto-end call at 10 minutes
- [ ] **Update UI**
  - File: `/src/app/page.tsx`
  - Show countdown timer (last 2 minutes)
  - Display "Upgrade for unlimited calls" message at 9 min
- [ ] **Check user tier**
  - Query user's subscription status (Supabase)
  - Skip timer if Premium user
- [ ] **Test edge cases**
  - Call ends naturally before 10 min
  - User upgrades mid-call (extend timer)
  - Timer syncs between users

**Dependencies:** None (but pairs well with Task 5.1 Stripe Payments)

**Estimated Time:** 1 day

**Files to Modify:**
- `/src/lib/webrtc/manager.ts`
- `/src/app/page.tsx`

**Success Criteria:**
- Free users limited to 10 minutes
- Premium users have unlimited calls
- Timer is visible and accurate

---

#### Task 1.3: Implement Call Filter Matching Logic (Backend)
- [ ] **Design matching algorithm**
  - File: `/src/lib/socket-server.js`
  - Priority order: Gender (hard) > Excluded countries (hard) > Preferred countries (soft) > Interests (soft)
  - Timeout logic: 30s exact match → 30s relaxed → 30s any match → "No users available"
- [ ] **Update queue system**
  - Store user filters in queue entry
  - Match users based on compatible filters
  - Notify user when relaxing filters ("Expanding search...")
- [ ] **Add gender filter (paid feature check)**
  - Query user subscription status
  - Only apply gender filter if Premium user
  - Store user's selected gender in profile
- [ ] **Test matching scenarios**
  - Same interests, different countries → should match after relaxation
  - Incompatible filters (both exclude each other's country) → no match
  - One free user with gender filter → ignored (not Premium)

**Dependencies:** Task 5.1 (subscription status check)

**Estimated Time:** 2-3 days

**Files to Modify:**
- `/src/lib/socket-server.js` (major changes to queue logic)
- `/src/app/api/profile/update-gender/route.ts` (new, for gender selection)

**Success Criteria:**
- Filters actually work (users matched based on criteria)
- Gender filter only works for Premium users
- "No users available" shown after 90s if no match

---

#### Task 1.4: Add Real-Time Call Moderation ✅ CRITICAL
- [ ] **Sign up for Deepgram + OpenAI APIs**
  - Deepgram: $200 free credit
  - OpenAI: Free Moderation API
  - Add API keys to `.env.local`
- [ ] **Create moderation pipeline**
  - File: `/src/lib/moderation/call-moderator.ts` (new)
  - Capture WebRTC audio stream
  - Send to Deepgram (real-time transcription)
  - Transcription → OpenAI Moderation API
  - If flagged → trigger action
- [ ] **Define moderation actions**
  - File: `/src/lib/moderation/actions.ts` (new)
  - Severity LOW: Log incident (no immediate action)
  - Severity MEDIUM: Auto-warning to user ("Please keep conversations respectful")
  - Severity HIGH: Immediately end call + flag account
- [ ] **Integrate with WebRTC manager**
  - File: `/src/lib/webrtc/manager.ts`
  - Start moderation when call connects
  - Stop moderation when call ends
  - Handle moderation events
- [ ] **Create admin moderation queue**
  - File: `/src/app/admin/moderation/page.tsx` (new)
  - List flagged calls (with transcriptions)
  - Review + take action (warn, ban, dismiss)
- [ ] **Store transcriptions securely**
  - Supabase table: `call_transcriptions`
  - Only store flagged calls (privacy)
  - Auto-delete after 30 days

**Dependencies:** None (but critical for safety)

**Estimated Time:** 3-4 days

**Files to Create:**
- `/src/lib/moderation/call-moderator.ts`
- `/src/lib/moderation/actions.ts`
- `/src/app/admin/moderation/page.tsx`
- `/src/app/api/moderation/flag-call/route.ts`
- Supabase schema (call_transcriptions table)

**Success Criteria:**
- Harmful content detected within 2-3 seconds
- High-severity violations auto-end calls
- Admin can review flagged calls

---

#### Task 1.5: Implement Reporting System
- [ ] **Create report UI (during call)**
  - File: `/src/components/ControlBar.tsx`
  - Enable "Report" button during calls
  - Quick categories: Harassment, Inappropriate, Spam, Other
  - Optional: Text reason
- [ ] **Create report API**
  - File: `/src/app/api/reports/create/route.ts` (new)
  - Store report in Supabase (reports table)
  - Flag reported user
  - Auto-end call if report submitted during call
- [ ] **Create admin review interface**
  - File: `/src/app/admin/reports/page.tsx` (new)
  - List all reports (sorted by severity)
  - Show call transcription (if available)
  - Actions: Warn, Temp Ban, Perm Ban, Dismiss
- [ ] **Implement auto-ban logic**
  - If user receives 3+ HIGH-severity reports → auto-suspend
  - Notify user via email (requires email in profile)
- [ ] **Add appeal process**
  - File: `/src/app/appeal/page.tsx` (new)
  - Banned users can submit appeal
  - Upload evidence, write explanation
  - Admin reviews within 48 hours

**Dependencies:** Task 1.4 (call transcriptions for context)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/api/reports/create/route.ts`
- `/src/app/admin/reports/page.tsx`
- `/src/app/appeal/page.tsx`
- Supabase schema (reports table)

**Success Criteria:**
- Users can report abuse in < 5 seconds
- Admins can review reports efficiently
- Auto-ban prevents repeat offenders

---

#### Task 1.6: Implement Block Functionality
- [ ] **Create block API**
  - File: `/src/app/api/users/block/route.ts` (new)
  - Add blocked user to Supabase (blocks table)
  - One-way block (blocker can see, blocked cannot)
- [ ] **Enforce block in matching**
  - File: `/src/lib/socket-server.js`
  - Check if users have blocked each other
  - Never match blocked pairs
- [ ] **Handle existing connections**
  - If users are friends + block → remove friendship
  - If in active call + block → end call immediately
  - Delete message history (privacy)
- [ ] **Create unblock functionality**
  - File: `/src/app/settings/blocked-users/page.tsx` (new)
  - List blocked users
  - Unblock button (immediate effect)

**Dependencies:** None

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/app/api/users/block/route.ts`
- `/src/app/api/users/unblock/route.ts`
- `/src/app/settings/blocked-users/page.tsx`
- Supabase schema (blocks table)
- Modify `/src/lib/socket-server.js`

**Success Criteria:**
- Blocked users never matched
- Block takes effect immediately
- Users can unblock if desired

---

#### Task 1.7: Add Terms of Service + Privacy Policy
- [ ] **Hire lawyer OR use template**
  - Option A: Hire lawyer ($500-2,000) - recommended
  - Option B: TermsFeed generator ($300-1,000)
- [ ] **Create ToS page**
  - File: `/src/app/legal/terms/page.tsx` (new)
  - Display full ToS text
  - Link from footer, signup flow
- [ ] **Create Privacy Policy page**
  - File: `/src/app/legal/privacy/page.tsx` (new)
  - GDPR/CCPA compliant
  - Link from footer, signup flow
- [ ] **Require acceptance at signup**
  - File: `/src/app/page.tsx` (onboarding flow)
  - Checkbox: "I agree to Terms of Service and Privacy Policy"
  - Cannot proceed without acceptance
  - Store acceptance timestamp in Supabase

**Dependencies:** None (but legally required before launch)

**Estimated Time:** 1 day (implementation) + 1-2 weeks (legal review)

**Files to Create:**
- `/src/app/legal/terms/page.tsx`
- `/src/app/legal/privacy/page.tsx`
- Supabase schema (tos_acceptance table)

**Success Criteria:**
- Legal documents reviewed by lawyer
- Users must accept before using app
- Acceptance tracked for compliance

---

#### Task 1.8: Apply for Liability Insurance
- [ ] **Get Hiscox quote**
  - Visit [hiscox.com](https://www.hiscox.com)
  - Select "Technology & Digital" → "App Developer"
  - Describe app (voice dating + in-person meetups)
  - Answer underwriting questions
- [ ] **Review coverage**
  - General Liability ($1M)
  - Cyber Liability ($1M)
  - Professional Liability ($1M)
- [ ] **Purchase policy**
  - Expected cost: $2,500-6,000/year
  - Monthly or annual payment
- [ ] **Store policy documents**
  - Add to `/legal/insurance/` (gitignored)
  - Note renewal date

**Dependencies:** Task 1.7 (ToS/Privacy Policy required for underwriting)

**Estimated Time:** 1-2 days (quote) + 1-2 days (approval)

**Success Criteria:**
- Active insurance policy
- Coverage includes in-person meetups
- Policy documents saved

---

#### Task 1.9: Deploy to Production (Railway/Vercel)
- [ ] **Set up production database**
  - Supabase production project
  - Run all migrations
  - Set up backups
- [ ] **Configure environment variables**
  - All API keys (production mode)
  - Database URLs
  - NextAuth secret
- [ ] **Deploy frontend**
  - Vercel deployment
  - Custom domain setup
  - SSL certificate
- [ ] **Deploy Socket.IO server**
  - Railway deployment
  - Ensure WebSocket support
  - Health check endpoint
- [ ] **Test production environment**
  - End-to-end call test
  - Stripe Identity verification
  - All API integrations

**Dependencies:** All previous tasks (this is final MVP step)

**Estimated Time:** 2-3 days

**Success Criteria:**
- App accessible via custom domain
- All features work in production
- No errors in logs

---

#### Task 1.10: MVP Launch Checklist
- [ ] **Age verification:** Government ID required ✅
- [ ] **Call moderation:** Real-time AI scanning ✅
- [ ] **Reporting:** Users can report abuse ✅
- [ ] **Blocking:** Users can block others ✅
- [ ] **Legal:** ToS + Privacy Policy live ✅
- [ ] **Insurance:** Policy active ✅
- [ ] **Performance:** < 2s page load, < 30s time-to-call ✅
- [ ] **Analytics:** Tracking setup (Posthog, Mixpanel, or custom)
- [ ] **Monitoring:** Error tracking (Sentry or similar)
- [ ] **Support:** Help center or support email

**Success Criteria:** All checkboxes ✅ before public launch

---

### Phase 2: Safety & Rating Systems (0% Complete)

**Goal:** Build trust through ratings and comprehensive safety features

**Target Timeline:** 2-3 weeks

**Prerequisites:** Phase 1 complete

---

#### Task 2.1: Implement Post-Call Rating System
- [ ] **Create rating UI**
  - File: `/src/components/CallRatingModal.tsx` (new)
  - Show immediately after call ends
  - 1-5 star rating
  - Optional quick reasons (checkboxes)
  - "Add as Friend" button
- [ ] **Create rating API**
  - File: `/src/app/api/ratings/submit/route.ts` (new)
  - Store rating in Supabase (call_ratings table)
  - Update both users' overall rating scores
- [ ] **Implement blind rating**
  - User A rates User B
  - User A cannot see User B's rating until User A submits
  - Prevents retaliatory ratings
- [ ] **Calculate Overall Rating Score**
  - Weighted average (recent = 60%, historical = 40%)
  - Min 5 ratings before score visible
  - Update real-time after each rating

**Dependencies:** None

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/components/CallRatingModal.tsx`
- `/src/app/api/ratings/submit/route.ts`
- Supabase schema (call_ratings table)

**Success Criteria:**
- All calls end with rating prompt
- Ratings update user scores accurately
- Blind rating prevents gaming

---

#### Task 2.2: Build User Profile Page (Public)
- [ ] **Create profile route**
  - File: `/src/app/profile/[userId]/page.tsx` (new)
  - Show avatar, name, overall rating
  - Show badges (Trusted, Star Member, etc.)
  - Show interests, bio (if provided)
- [ ] **Add profile edit**
  - File: `/src/app/profile/edit/page.tsx` (new)
  - Update name, bio, interests
  - Change avatar
- [ ] **Link profile from friend cards**
  - File: `/src/components/FriendCard.tsx` (Phase 3)
  - Click card → view profile

**Dependencies:** Task 2.1 (rating score display)

**Estimated Time:** 2 days

**Files to Create:**
- `/src/app/profile/[userId]/page.tsx`
- `/src/app/profile/edit/page.tsx`

**Success Criteria:**
- Public profiles viewable
- Users can edit their own profile
- Privacy settings respected

---

#### Task 2.3: Implement Admin Dashboard
- [ ] **Create admin authentication**
  - File: `/src/middleware.ts` (update)
  - Check if user is admin (role in Supabase)
  - Redirect non-admins away from /admin
- [ ] **Build moderation queue**
  - File: `/src/app/admin/moderation/page.tsx` (from Task 1.4)
  - Review flagged calls
  - Review reports
  - Take actions (warn, ban, dismiss)
- [ ] **Build user management**
  - File: `/src/app/admin/users/page.tsx` (new)
  - Search users
  - View user details (call history, ratings, reports)
  - Manual ban/unban
- [ ] **Build analytics dashboard**
  - File: `/src/app/admin/analytics/page.tsx` (new)
  - Daily active users
  - Call volume
  - Conversion rates
  - Top reported users

**Dependencies:** Tasks 1.4, 1.5

**Estimated Time:** 3-4 days

**Files to Create:**
- `/src/app/admin/users/page.tsx`
- `/src/app/admin/analytics/page.tsx`
- Update `/src/middleware.ts`

**Success Criteria:**
- Admins can moderate efficiently
- User search works quickly
- Analytics provide actionable insights

---

#### Task 2.4: Add Voice Activity Visualization (Enhanced)
- [ ] **Enhance existing indicator**
  - File: `/src/components/VoiceActivityIndicator.tsx`
  - Show both users' voice levels
  - Animate during speaking
- [ ] **Add "listening" state**
  - When user is silent but listening
  - Different animation than speaking

**Dependencies:** None (enhancement of existing feature)

**Estimated Time:** 1 day

**Success Criteria:**
- Visual feedback for both users
- Smooth animations

---

#### Task 2.5: Implement Low Rating Consequences
- [ ] **Create warning system**
  - File: `/src/app/api/ratings/check-score/route.ts` (new)
  - If user's score drops below 3.0 → send warning email
  - Show in-app banner: "Your rating is low. Please be respectful."
- [ ] **Implement auto-suspension**
  - If score < 2.5 → temporary suspension (7 days)
  - If score < 2.0 → permanent ban (with appeal option)
- [ ] **Create appeal flow**
  - File: `/src/app/appeal/page.tsx` (from Task 1.5)
  - Suspended users can appeal
  - Admin review required

**Dependencies:** Task 2.1 (rating system)

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/app/api/ratings/check-score/route.ts`
- Update `/src/app/appeal/page.tsx`

**Success Criteria:**
- Low-rated users warned
- Chronic bad actors suspended
- Fair appeal process

---

#### Task 2.6: Add "New User" Onboarding Tutorial
- [ ] **Create tutorial flow**
  - File: `/src/components/OnboardingTutorial.tsx` (new)
  - Step 1: "How random calls work"
  - Step 2: "How to add friends"
  - Step 3: "Safety tips"
  - Step 4: "Community guidelines"
- [ ] **Show only once**
  - Track in Supabase (onboarding_completed)
  - Skip if user has completed
- [ ] **Make skippable**
  - "Skip Tutorial" button
  - Can re-access from Help menu

**Dependencies:** None

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/components/OnboardingTutorial.tsx`
- Supabase schema (user.onboarding_completed)

**Success Criteria:**
- New users understand how app works
- Tutorial is skippable
- Can be re-accessed

---

#### Task 2.7: Implement Community Guidelines Page
- [ ] **Write community guidelines**
  - What's allowed/not allowed
  - Examples of violations
  - Consequences of violations
- [ ] **Create guidelines page**
  - File: `/src/app/legal/guidelines/page.tsx` (new)
  - Clear, friendly tone
  - Link from footer, onboarding
- [ ] **Show during onboarding**
  - Must read before first call
  - Checkbox: "I agree to follow guidelines"

**Dependencies:** None

**Estimated Time:** 1 day (writing) + 0.5 day (implementation)

**Files to Create:**
- `/src/app/legal/guidelines/page.tsx`

**Success Criteria:**
- Guidelines are clear
- Users must acknowledge before calling

---

#### Task 2.8: Add Safety Tips (In-App)
- [ ] **Create safety tips modal**
  - File: `/src/components/SafetyTipsModal.tsx` (new)
  - Meeting in person? Tips for safe meetups
  - Link to panic button setup
- [ ] **Show before first meetup request**
  - Trigger when user clicks "Send Meetup Request"
  - One-time modal (can be re-accessed)
- [ ] **Add to Help Center**
  - File: `/src/app/help/safety/page.tsx` (new)
  - Full safety guide

**Dependencies:** None (but pairs with Phase 4 meetup features)

**Estimated Time:** 1 day

**Files to Create:**
- `/src/components/SafetyTipsModal.tsx`
- `/src/app/help/safety/page.tsx`

**Success Criteria:**
- Safety tips easily accessible
- Users educated before first meetup

---

### Phase 3: Friend System (0% Complete)

**Goal:** Enable users to build connections beyond random calls

**Target Timeline:** 2 weeks

**Prerequisites:** Phase 2 complete (rating system)

---

#### Task 3.1: Implement Friend Requests
- [ ] **Create friend request API**
  - File: `/src/app/api/friends/request/route.ts` (new)
  - Send friend request (mutual consent model)
  - Notify recipient via Socket.IO
- [ ] **Create friend request UI**
  - File: `/src/components/FriendRequestModal.tsx` (new)
  - Show after call rating
  - "Add [User] as Friend" button
  - Pending state if request sent
- [ ] **Create notifications**
  - File: `/src/components/Notifications.tsx` (new)
  - Bell icon in header
  - Show friend requests
  - Accept/Decline buttons

**Dependencies:** Task 2.1 (rating system)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/api/friends/request/route.ts`
- `/src/app/api/friends/accept/route.ts`
- `/src/app/api/friends/decline/route.ts`
- `/src/components/FriendRequestModal.tsx`
- `/src/components/Notifications.tsx`
- Supabase schema (friend_requests, friendships tables)

**Success Criteria:**
- Users can send/accept friend requests
- Both users must agree (mutual consent)
- Real-time notifications

---

#### Task 3.2: Build Friend List UI
- [ ] **Create friends page**
  - File: `/src/app/friends/page.tsx` (new)
  - Grid of friend cards
  - Search/filter friends
  - Tabs: All Friends, Online, Offline
- [ ] **Create friend card component**
  - File: `/src/components/FriendCard.tsx` (new)
  - Show avatar, name, last active
  - Actions: Call, Message, Send Meetup Request
- [ ] **Show online status**
  - Socket.IO presence system
  - Green dot = online
  - Last active timestamp if offline

**Dependencies:** Task 3.1 (friendships exist)

**Estimated Time:** 2 days

**Files to Create:**
- `/src/app/friends/page.tsx`
- `/src/components/FriendCard.tsx`

**Success Criteria:**
- All friends displayed
- Online status accurate
- Actions work (call, message)

---

#### Task 3.3: Implement Direct Calling (Friends)
- [ ] **Add "Call Friend" functionality**
  - File: `/src/lib/webrtc/manager.ts` (update)
  - New method: `startDirectCall(friendId)`
  - Bypass queue (direct peer connection)
- [ ] **Create call invitation UI**
  - File: `/src/components/IncomingCallModal.tsx` (new)
  - "[Friend] is calling you..."
  - Accept/Decline buttons
- [ ] **No time limit for friend calls**
  - Skip 10-minute timer
  - Unlimited duration (even for free users)

**Dependencies:** Task 3.2 (friend list)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/components/IncomingCallModal.tsx`
- Update `/src/lib/webrtc/manager.ts`

**Success Criteria:**
- Friends can call each other directly
- No time limit on friend calls
- Call invitations work smoothly

---

#### Task 3.4: Implement Direct Messaging (Friends Only)
- [ ] **Create messaging backend**
  - File: `/src/app/api/messages/send/route.ts` (new)
  - Store messages in Supabase
  - Real-time delivery via Socket.IO
- [ ] **Create chat UI**
  - File: `/src/app/messages/[friendId]/page.tsx` (new)
  - Message thread
  - Text input
  - Send button
  - Typing indicators
  - Read receipts
- [ ] **Moderate messages**
  - File: `/src/lib/moderation/message-moderator.ts` (new)
  - OpenAI Moderation API scans messages
  - Auto-block harmful content
  - Notify user if message blocked
- [ ] **Add message notifications**
  - Desktop notifications (if enabled)
  - In-app badge (unread count)

**Dependencies:** Task 3.2 (friend list)

**Estimated Time:** 3-4 days

**Files to Create:**
- `/src/app/api/messages/send/route.ts`
- `/src/app/messages/[friendId]/page.tsx`
- `/src/components/ChatWindow.tsx`
- `/src/lib/moderation/message-moderator.ts`
- Supabase schema (messages table)

**Success Criteria:**
- Real-time messaging works
- Moderation blocks harmful content
- Unread counts accurate

---

#### Task 3.5: Add "Remove Friend" Functionality
- [ ] **Create unfriend API**
  - File: `/src/app/api/friends/remove/route.ts` (new)
  - Delete friendship record
  - Keep message history (privacy option)
- [ ] **Add confirmation dialog**
  - "Are you sure you want to remove [Friend]?"
  - Option: "Delete message history"
- [ ] **Handle unfriend edge cases**
  - If in active call → end call first
  - If unfriended → cannot message

**Dependencies:** Task 3.2 (friend list)

**Estimated Time:** 1 day

**Files to Create:**
- `/src/app/api/friends/remove/route.ts`
- Update `/src/components/FriendCard.tsx`

**Success Criteria:**
- Users can remove friends
- Confirmation prevents accidents
- Message history handled per privacy setting

---

#### Task 3.6: Build Inbox/Messages Page
- [ ] **Create messages list**
  - File: `/src/app/messages/page.tsx` (new)
  - List all message threads
  - Sort by most recent
  - Show unread count per thread
- [ ] **Add search**
  - Search messages
  - Filter by friend name
- [ ] **Link from navigation**
  - Add "Messages" tab to header
  - Badge shows total unread count

**Dependencies:** Task 3.4 (messaging system)

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/app/messages/page.tsx`

**Success Criteria:**
- All message threads accessible
- Unread counts visible
- Search works

---

### Phase 4: Events System (0% Complete)

**Goal:** Enable in-person meetups through events

**Target Timeline:** 3-4 weeks

**Prerequisites:** Phase 3 complete (friend system), Insurance active

---

#### Task 4.1: Set Up Mapbox Integration
- [ ] **Sign up for Mapbox**
  - Create account at [mapbox.com](https://www.mapbox.com)
  - Get API token (free tier: 50K loads/month)
- [ ] **Install Mapbox SDK**
  - `npm install mapbox-gl`
  - Add token to `.env.local`
- [ ] **Create basic map component**
  - File: `/src/components/EventsMap.tsx` (new)
  - Display map centered on user's location
  - Test rendering

**Dependencies:** None

**Estimated Time:** 0.5 day

**Files to Create:**
- `/src/components/EventsMap.tsx`

**Success Criteria:**
- Map displays correctly
- User location works

---

#### Task 4.2: Create Event Model & Database Schema
- [ ] **Design Supabase schema**
  - Table: `events`
  - Columns: id, host_id, title, description, category, location (lat/lng + address), start_time, end_time, capacity, requirements, created_at
  - Indexes: location (for geo queries), start_time, host_id
- [ ] **Create event creation API**
  - File: `/src/app/api/events/create/route.ts` (new)
  - Validate inputs
  - Check if location is public (Google Places API)
  - Store event in database

**Dependencies:** None

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/app/api/events/create/route.ts`
- Supabase migration (events table)

**Success Criteria:**
- Events stored correctly
- Geolocation queries work

---

#### Task 4.3: Build Event Creation Form
- [ ] **Create event creation UI**
  - File: `/src/app/events/create/page.tsx` (new)
  - Form fields: Title, Category, Description, Location (autocomplete), Date/Time, Capacity, Requirements
  - Map preview (show selected location)
- [ ] **Implement location validation**
  - Google Places API autocomplete
  - Check if location is public (not residential)
  - Show error if residential: "Please choose a public venue"
- [ ] **Verify user is ID-verified**
  - Only verified users can create events
  - Show verification prompt if unverified

**Dependencies:** Task 4.2 (event model)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/events/create/page.tsx`
- `/src/components/LocationAutocomplete.tsx`

**Success Criteria:**
- Event creation form works
- Location validation prevents residential addresses
- Only verified users can create events

---

#### Task 4.4: Display Events on Map
- [ ] **Fetch nearby events**
  - File: `/src/app/api/events/nearby/route.ts` (new)
  - Geo query (events within 25km of user)
  - Filter: Local vs Global (toggle)
  - Filter: Friends' events vs All events
- [ ] **Render event markers**
  - File: `/src/components/EventsMap.tsx` (update)
  - Add markers for each event
  - Cluster nearby events (Mapbox clustering)
  - Color-code by category
- [ ] **Event detail popup**
  - Click marker → show event details
  - Preview: Title, Host, Date/Time, Attendee count
  - "View Details" button

**Dependencies:** Task 4.3 (events exist)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/api/events/nearby/route.ts`
- Update `/src/components/EventsMap.tsx`

**Success Criteria:**
- Events display on map
- Filters work (Local/Global, Friends/All)
- Markers clustered correctly

---

#### Task 4.5: Build Event Detail Page
- [ ] **Create event detail route**
  - File: `/src/app/events/[eventId]/page.tsx` (new)
  - Show all event info
  - Host profile (name, host score)
  - Attendee list (avatars)
  - Map preview of location
- [ ] **Add RSVP button**
  - "Attend Event" button
  - Check capacity (if full, show "Event Full")
  - Add user to attendees list
- [ ] **Show RSVP status**
  - "You're attending!" if already RSVP'd
  - "Cancel RSVP" button

**Dependencies:** Task 4.4 (event display)

**Estimated Time:** 2 days

**Files to Create:**
- `/src/app/events/[eventId]/page.tsx`
- `/src/app/api/events/rsvp/route.ts`

**Success Criteria:**
- Event details fully displayed
- RSVP works
- Capacity limits enforced

---

#### Task 4.6: Implement Check-In System
- [ ] **Create check-in API**
  - File: `/src/app/api/events/checkin/route.ts` (new)
  - Verify user is within 100m of event location (GPS)
  - Check-in window: 30 min before → 30 min after start
  - Update attendee status to "checked in"
- [ ] **Create check-in UI**
  - File: `/src/components/EventCheckIn.tsx` (new)
  - Show on event day (push notification + in-app banner)
  - "Check In" button (GPS-based)
  - Success message: "Checked in to [Event]!"
- [ ] **Auto check-out**
  - 30 min after event end → auto check-out
  - Or manual "Check Out" button
- [ ] **No-show penalty**
  - If RSVP'd but didn't check in → impact reliability score
  - 3 no-shows → temporary event restriction (can't RSVP for 7 days)

**Dependencies:** Task 4.5 (RSVP system)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/api/events/checkin/route.ts`
- `/src/app/api/events/checkout/route.ts`
- `/src/components/EventCheckIn.tsx`

**Success Criteria:**
- GPS-based check-in works
- No-shows penalized
- Auto check-out after event

---

#### Task 4.7: Implement Host Rating System
- [ ] **Create host rating API**
  - File: `/src/app/api/events/rate-host/route.ts` (new)
  - After event ends, prompt attendees
  - 1-5 star rating + optional comment
- [ ] **Calculate host score**
  - Weighted average (recent = 60%, historical = 40%)
  - Display tier: New Host, Good Host, Trusted Host, Star Host
- [ ] **Show host score on events**
  - Event detail page shows host's score
  - Badge on event cards (map markers)

**Dependencies:** Task 4.6 (check-in system)

**Estimated Time:** 2 days

**Files to Create:**
- `/src/app/api/events/rate-host/route.ts`
- Supabase schema (host_ratings table)

**Success Criteria:**
- Attendees can rate hosts
- Host score displayed accurately
- Tiers motivate good hosting

---

#### Task 4.8: Add Event Notifications
- [ ] **Nearby event notifications**
  - When event is created near user → push notification
  - "New event near you: [Event Title]"
  - Opt-in setting (user preference)
- [ ] **RSVP reminders**
  - 24 hours before event: "Don't forget! [Event] tomorrow"
  - 1 hour before: "Check in to [Event]"
- [ ] **Check-in reminder**
  - At event start time: "Check in now!"

**Dependencies:** Task 4.6 (check-in system)

**Estimated Time:** 1-2 days

**Success Criteria:**
- Notifications timely
- Users can opt-out
- Reminders reduce no-shows

---

#### Task 4.9: Build "My Events" Page
- [ ] **Create events dashboard**
  - File: `/src/app/events/my-events/page.tsx` (new)
  - Tabs: Hosting, Attending, Past
  - Show event cards
  - Quick actions: Edit, Cancel, Check In
- [ ] **Add event management (hosts)**
  - Edit event details
  - Cancel event (notify attendees)
  - View attendee list

**Dependencies:** Task 4.5 (events exist)

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/app/events/my-events/page.tsx`

**Success Criteria:**
- Users can manage their events
- Past events archived

---

### Phase 5: Monetization (0% Complete)

**Goal:** Enable revenue through subscriptions

**Target Timeline:** 1-2 weeks

**Prerequisites:** Phase 1 complete (can run in parallel with Phase 2-4)

---

#### Task 5.1: Set Up Stripe Subscriptions
- [ ] **Create Stripe products**
  - Premium ($9.99/month or $79.99/year)
  - Matcher AI Add-On ($14.99/month)
  - Premium + AI Bundle ($19.99/month)
- [ ] **Create subscription API**
  - File: `/src/app/api/stripe/create-checkout/route.ts` (new)
  - Create Stripe checkout session
  - Redirect to Stripe hosted checkout
- [ ] **Handle webhooks**
  - File: `/src/app/api/stripe/webhook/route.ts` (new)
  - Listen for `checkout.session.completed`
  - Update user's subscription status in Supabase
  - Listen for `customer.subscription.deleted` (cancellation)

**Dependencies:** Task 1.1 (Stripe account setup)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/api/stripe/create-checkout/route.ts`
- `/src/app/api/stripe/webhook/route.ts`
- Supabase schema (subscriptions table)

**Success Criteria:**
- Users can subscribe
- Subscriptions tracked in database
- Webhooks update status correctly

---

#### Task 5.2: Build Pricing Page
- [ ] **Create pricing page**
  - File: `/src/app/pricing/page.tsx` (new)
  - 3 tiers: Free, Premium, Premium + AI
  - Feature comparison table
  - "Subscribe" buttons
- [ ] **Add trial period**
  - 7-day free trial for Premium
  - No credit card required (Stripe trial_period_days)
- [ ] **Show current plan**
  - If user is subscribed → show "Current Plan" badge

**Dependencies:** Task 5.1 (Stripe setup)

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/app/pricing/page.tsx`

**Success Criteria:**
- Pricing clear and compelling
- Trial period works
- Current plan displayed

---

#### Task 5.3: Implement Subscription Status Checks
- [ ] **Create subscription check middleware**
  - File: `/src/lib/subscription-check.ts` (new)
  - Function: `isPremiumUser(userId): boolean`
  - Query Supabase for active subscription
- [ ] **Enforce Premium features**
  - Gender filter: Check `isPremiumUser()` before applying
  - Unlimited calls: Skip timer if Premium
  - Priority matching: Boost Premium users in queue
- [ ] **Add upsell prompts**
  - 9-min mark on free tier call: "Upgrade for unlimited calls"
  - Gender filter UI: "Premium feature" badge + upgrade button

**Dependencies:** Task 5.1 (subscriptions exist)

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/lib/subscription-check.ts`
- Update `/src/lib/webrtc/manager.ts` (timer logic)
- Update `/src/lib/socket-server.js` (gender filter, priority)

**Success Criteria:**
- Premium features gated correctly
- Upsells timely and non-intrusive

---

#### Task 5.4: Build Subscription Management (User Portal)
- [ ] **Create account settings page**
  - File: `/src/app/settings/subscription/page.tsx` (new)
  - Show current plan
  - Next billing date
  - Payment method
- [ ] **Add Stripe Customer Portal**
  - Link to Stripe-hosted portal
  - Users can update payment, cancel subscription
- [ ] **Handle cancellation**
  - Webhook updates subscription status
  - User retains Premium until end of billing period

**Dependencies:** Task 5.1 (Stripe setup)

**Estimated Time:** 1 day

**Files to Create:**
- `/src/app/settings/subscription/page.tsx`

**Success Criteria:**
- Users can manage subscriptions easily
- Cancellation works smoothly

---

#### Task 5.5: Add Revenue Analytics
- [ ] **Create revenue dashboard (admin)**
  - File: `/src/app/admin/revenue/page.tsx` (new)
  - Monthly Recurring Revenue (MRR)
  - Churn rate
  - Conversion rate (free → Premium)
  - Lifetime Value (LTV)
- [ ] **Track subscription events**
  - New subscriptions
  - Cancellations
  - Upgrades/downgrades

**Dependencies:** Task 5.1 (subscriptions exist)

**Estimated Time:** 1-2 days

**Files to Create:**
- `/src/app/admin/revenue/page.tsx`

**Success Criteria:**
- Revenue metrics accurate
- Trends visualized

---

### Phase 6: Matcher AI (0% Complete)

**Goal:** AI-powered compatibility matching

**Target Timeline:** 2-3 weeks

**Prerequisites:** Phase 5 complete (payment required for AI feature)

---

#### Task 6.1: Set Up Claude API & Prompt Engineering
- [ ] **Sign up for Anthropic Claude API**
  - Get API key
  - Set up billing
- [ ] **Design compatibility template**
  - File: `/src/lib/matcher-ai/compatibility-template.ts` (new)
  - Define matching criteria (personality, values, interests, goals)
  - Create prompt for AI analysis
- [ ] **Test prompt with sample data**
  - Run test matches
  - Refine prompt for accuracy

**Dependencies:** None

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/lib/matcher-ai/compatibility-template.ts`

**Success Criteria:**
- Prompt produces high-quality match scores
- Cost < $0.01 per match with caching

---

#### Task 6.2: Build Matcher AI Voice Interview
- [ ] **Create voice interview UI**
  - File: `/src/app/matcher/interview/page.tsx` (new)
  - AI avatar (talking animation)
  - "Start Interview" button
  - Voice recording UI
- [ ] **Implement voice-to-text**
  - OpenAI Whisper API
  - Record user's responses
  - Transcribe to text
- [ ] **AI conversation flow**
  - AI asks question via text-to-speech
  - User responds via voice
  - AI analyzes response, asks follow-ups
  - 10-15 min interview

**Dependencies:** Task 6.1 (AI setup)

**Estimated Time:** 4-5 days (complex feature)

**Files to Create:**
- `/src/app/matcher/interview/page.tsx`
- `/src/lib/matcher-ai/interview-agent.ts`

**Success Criteria:**
- Interview feels natural
- AI adapts to user responses
- Transcription accurate

---

#### Task 6.3: Implement Compatibility Matching Algorithm
- [ ] **Create matching API**
  - File: `/src/app/api/matcher/find-matches/route.ts` (new)
  - Input: User's interview data
  - Process: Compare against all other users' data
  - Output: Top 10 compatible matches
- [ ] **Use Claude with prompt caching**
  - Cache compatibility template (90% cost savings)
  - Batch process overnight (50% discount)
  - Cost: ~$0.001 per match
- [ ] **Store match results**
  - Supabase table: `ai_matches`
  - Columns: user_id, match_user_id, score, connection_points, challenges, conversation_starters

**Dependencies:** Task 6.2 (interview data exists)

**Estimated Time:** 3-4 days

**Files to Create:**
- `/src/app/api/matcher/find-matches/route.ts`
- Supabase schema (ai_matches table)

**Success Criteria:**
- Matches generated accurately
- Cost stays under $0.01/match
- Overnight batch processing works

---

#### Task 6.4: Build Match Suggestions UI
- [ ] **Create matches page**
  - File: `/src/app/matcher/matches/page.tsx` (new)
  - Display top matches (cards)
  - Show compatibility score (not number, description: "Great match!")
  - Show connection points
  - Show conversation starters
- [ ] **Add match actions**
  - "Start Call" button (direct call)
  - "Pass" button (hide match)
  - "View Full Profile"

**Dependencies:** Task 6.3 (matches exist)

**Estimated Time:** 2 days

**Files to Create:**
- `/src/app/matcher/matches/page.tsx`
- `/src/components/MatchCard.tsx`

**Success Criteria:**
- Matches displayed attractively
- Actions work (call, pass)
- Conversation starters helpful

---

#### Task 6.5: Add Match Notifications
- [ ] **Daily match email**
  - Send at 9am user's timezone
  - "You have 3 new matches!"
  - Link to matches page
- [ ] **In-app notifications**
  - Badge on "Matcher" tab
  - "New matches available"

**Dependencies:** Task 6.4 (matches UI)

**Estimated Time:** 1 day

**Success Criteria:**
- Notifications timely
- Users can opt-out

---

#### Task 6.6: Add "Re-run Interview" Feature
- [ ] **Monthly re-interview**
  - Prompt users to re-run interview (preferences change)
  - Update match results
- [ ] **Track changes**
  - Compare old vs new interview data
  - Show user: "Your preferences have changed!"

**Dependencies:** Task 6.2 (interview exists)

**Estimated Time:** 1-2 days

**Success Criteria:**
- Users can re-run interview
- Matches updated accordingly

---

### Phase 7: Polish & Scale (0% Complete)

**Goal:** Finalize app for public launch and scale

**Target Timeline:** 3-4 weeks

**Prerequisites:** Phases 1-6 complete

---

#### Task 7.1: Design & Implement Mascot
- [ ] **Hire illustrator**
  - Fiverr, 99designs, Dribbble
  - Budget: $200-500
- [ ] **Design mascot**
  - Friendly, connection-themed character
  - Multiple poses (happy, talking, listening, etc.)
- [ ] **Integrate mascot**
  - Loading screens
  - Empty states ("No events near you yet")
  - Error pages
  - App store assets

**Dependencies:** None

**Estimated Time:** 1-2 weeks (designer time)

**Success Criteria:**
- Mascot strengthens brand identity
- Used consistently throughout app

---

#### Task 7.2: Implement Emergency Panic Button
- [ ] **Create panic button UI**
  - File: `/src/components/PanicButton.tsx` (new)
  - Red SOS button (prominent)
  - Confirmation: "Are you sure? This will alert your emergency contacts"
- [ ] **Create panic API**
  - File: `/src/app/api/emergency/panic/route.ts` (new)
  - Capture GPS location
  - Geocode to address (Google Maps API)
  - Send SMS to emergency contacts (Twilio)
  - Call primary contact
- [ ] **Add emergency contacts setup**
  - File: `/src/app/settings/emergency-contacts/page.tsx` (new)
  - Add 3-5 contacts (name + phone)
  - Test panic button (sends "This is a test" message)

**Dependencies:** None

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/components/PanicButton.tsx`
- `/src/app/api/emergency/panic/route.ts`
- `/src/app/settings/emergency-contacts/page.tsx`

**Success Criteria:**
- Panic button works instantly
- GPS location accurate
- Emergency contacts notified

---

#### Task 7.3: Build Help Center
- [ ] **Create help center**
  - File: `/src/app/help/page.tsx` (new)
  - FAQs (categorized)
  - Troubleshooting guides
  - Contact support form
- [ ] **Add search**
  - Search help articles
  - Suggest relevant FAQs

**Dependencies:** None

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/help/page.tsx`
- `/src/app/help/[articleId]/page.tsx`

**Success Criteria:**
- Common questions answered
- Easy to navigate
- Support form works

---

#### Task 7.4: Implement Referral Program
- [ ] **Create referral system**
  - File: `/src/app/api/referrals/create/route.ts` (new)
  - Generate unique referral code per user
  - Track referrals (who invited whom)
- [ ] **Add referral incentives**
  - Referrer gets 1 month free Premium
  - Referee gets 1 week free Premium
- [ ] **Build referral page**
  - File: `/src/app/referrals/page.tsx` (new)
  - Show referral code
  - Copy button
  - Track referrals ("You've referred 5 friends!")

**Dependencies:** Task 5.1 (subscriptions)

**Estimated Time:** 2-3 days

**Files to Create:**
- `/src/app/api/referrals/create/route.ts`
- `/src/app/referrals/page.tsx`
- Supabase schema (referrals table)

**Success Criteria:**
- Referrals tracked accurately
- Incentives awarded automatically

---

#### Task 7.5: Performance Optimization
- [ ] **Optimize bundle size**
  - Code splitting (Next.js dynamic imports)
  - Tree shaking
  - Remove unused dependencies
- [ ] **Optimize images**
  - Next.js Image component
  - WebP/AVIF formats
  - Lazy loading
- [ ] **Optimize API calls**
  - Implement caching (Redis or Vercel KV)
  - Debounce search inputs
  - Prefetch friend list
- [ ] **Optimize database queries**
  - Add indexes (Supabase)
  - Use database views for complex queries
  - Implement pagination

**Dependencies:** None (ongoing throughout development)

**Estimated Time:** 1 week

**Success Criteria:**
- Page load < 2s
- Lighthouse score > 90
- API calls < 500ms (p95)

---

#### Task 7.6: Internationalization (i18n)
- [ ] **Add i18n library**
  - next-intl or react-i18next
  - Define supported languages (start with English + 2-3 others)
- [ ] **Translate UI**
  - All static text
  - Error messages
  - Email templates
- [ ] **Test with different languages**
  - RTL support (Arabic, Hebrew)
  - Character sets (Chinese, Japanese)

**Dependencies:** None

**Estimated Time:** 1-2 weeks (depends on languages)

**Success Criteria:**
- App works in multiple languages
- Translations accurate
- Language switcher works

---

#### Task 7.7: Mobile App (React Native)
- [ ] **Set up React Native project**
  - Expo or bare React Native
  - Reuse web components where possible
- [ ] **Implement core features**
  - Voice calling (WebRTC on mobile)
  - Push notifications (Expo Notifications)
  - GPS/location services
- [ ] **Submit to app stores**
  - Apple App Store
  - Google Play Store
- [ ] **Add deep linking**
  - Link from web → app (if installed)

**Dependencies:** All previous tasks (web app must be stable)

**Estimated Time:** 4-6 weeks (major undertaking)

**Success Criteria:**
- Mobile app feature parity with web
- App store approval
- Deep linking works

---

## Challenge Log

Use this section to document challenges encountered during implementation and their solutions.

### Format:
```
**Challenge #X: [Brief Description]**
- **Date:** YYYY-MM-DD
- **Phase/Task:** Phase X, Task X.X
- **Problem:** [Detailed description]
- **Solution:** [How it was resolved]
- **Outcome:** [Result, any follow-up needed]
```

---

### Example Entry:

**Challenge #1: WebRTC Connection Failures on Mobile Safari**
- **Date:** 2025-10-15
- **Phase/Task:** Phase 1, Task 1.9
- **Problem:** SimplePeer connections failing on iOS Safari (getUserMedia errors)
- **Solution:** Added polyfill for Safari, updated STUN server configuration
- **Outcome:** Connections now work on iOS, need to test across devices

---

## Tracking Progress

### How to Update This Document:

1. **When starting a task:**
   - Update task status from `[ ]` to `[X]` when complete
   - Update phase progress percentage
   - Add notes if needed

2. **When encountering challenges:**
   - Add entry to Challenge Log
   - Update task with blockers if needed

3. **Weekly review:**
   - Update Progress Overview table
   - Review remaining tasks
   - Adjust timeline if needed

---

## Next Steps

### Immediate (This Week):
1. **Complete Phase 1 remaining tasks** (40% left)
   - Task 1.1: Government ID verification (CRITICAL)
   - Task 1.3: Call filter matching logic
   - Task 1.4: Real-time call moderation (CRITICAL)

### Short-Term (Next 2 Weeks):
1. **Finish Phase 1** (MVP Foundation)
2. **Start Phase 2** (Safety & Ratings)
3. **Apply for insurance** (Hiscox)

### Medium-Term (Next Month):
1. **Complete Phases 2-3** (Safety + Friend System)
2. **Begin Phase 4** (Events System)
3. **Launch Premium subscriptions** (Phase 5)

### Long-Term (Next 3 Months):
1. **Complete Phases 4-6** (Events, Monetization, Matcher AI)
2. **Polish & optimize** (Phase 7)
3. **Public launch**

---

**Last Updated:** October 4, 2025
**Next Review:** Weekly (update progress, add challenges)
