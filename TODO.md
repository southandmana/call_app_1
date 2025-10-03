# TODO: Pending Tasks

---

## 🎨 UI REDESIGN - PHASE 1 & 2 COMPLETE (Oct 1, 2025) ✅

### Phase 1: Layout & Visual Structure (COMPLETED)
- ✅ Page frame with 24px padding
- ✅ Main content in bordered card (bg-secondary)
- ✅ Header redesign: Noodlie logo, navigation (Home/Discover/Settings), online count
- ✅ Status title (48px) and subtitle (18px) components
- ✅ Interest tags display (shows user's selected interests)
- ✅ Call button resized to 120px with 36px icon
- ✅ Removed old UI elements (AirTalk logo, auto-call checkbox, call history button, ad placeholder)

### Phase 2: ControlBar Component (COMPLETED) ✅
- ✅ Created unified ControlBar component with pill-shaped design
- ✅ **Idle state:** Interest input with typewriter animation, blinking cursor, character counter (0/20), purple gradient underline
- ✅ **Connected state:** Mute, Skip, Add Friend, Block, Report buttons
- ✅ Implemented state-based visibility (idle vs connected mode)
- ✅ Added proper styling (border, shadow, background, hover effects)
- ✅ Positioned at bottom of main content area
- ✅ All testing passed successfully

### Phase 3: Animations & Polish (COMPLETED) ✅
- ✅ Interest tag appear/remove animations (scale + fade)
- ✅ Control bar slide-up animation (already implemented)
- ✅ Hover effects (subtle glow, no lift per user preference)
- ✅ Theme toggle transition refinements (rotate + scale on click)
- ✅ All animations tested and approved

**Design Reference:** HTML file at `/Users/southerncoromandel/Desktop/noodlie-voice-app (1).html`

---

## 🐛 BUG FIXES - CRITICAL ISSUES RESOLVED (Oct 2, 2025) ✅

### Bug Fix 1: End Call Button Not Working (COMPLETED)
- ✅ Fixed button disabled during connected calls
- ✅ Changed condition from `disabled={callState !== 'idle'}` to `disabled={callState === 'no-users'}`
- ✅ File: `src/app/page.tsx` (line 598)

### Bug Fix 2: Call Restart Race Condition (COMPLETED)
- ✅ Fixed window that ends call getting stuck and unable to restart
- ✅ Root cause: Async peer 'close' event overwrote 'idle' state to 'disconnected'
- ✅ Solution: Implemented `isCleaningUp` flag with proper timing
- ✅ Flag prevents 'close' handler from changing state during cleanup
- ✅ Flag reset AFTER async close event fires (not before - key insight)
- ✅ File: `src/lib/webrtc/manager.ts` (lines 27, 178-185, 215-252, 290-299)
- ✅ Testing: Both windows can now end calls and restart successfully

---

## 🚨 CURRENT STATUS - DEPLOYED TO PRODUCTION ✅

**Production URLs:**
- 🌐 **Frontend:** https://call-app-1.vercel.app
- 🔌 **Socket.io:** https://callapp1-production.up.railway.app
- 💾 **Database:** Supabase (skyffnybsqwfbbkbqcxy.supabase.co)

**Deployment Status:**
- ✅ Railway deployment complete (Socket.io server)
- ✅ Vercel deployment complete (Next.js frontend)
- ✅ Environment variables configured on both platforms
- ✅ CORS configured for production
- ✅ Health check endpoint functional
- ✅ Cross-browser testing completed successfully
- ✅ Phone verification bypass working on both platforms

**What Works in Production:**
- ✅ Voice calling between users (WebRTC)
- ✅ Interest-based matching
- ✅ Online user count (real-time)
- ✅ Error handling (mic permission, connection drops, no users)
- ✅ Google OAuth authentication (Phase 1 complete)
- ✅ Phone verification bypass for testing
- ✅ Chrome, Firefox, and Safari all tested successfully
- ✅ Railway build optimized (nixpacks.toml configuration)
- ✅ Socket connection stability improved (race condition fixes)
- ✅ Call ringing persists through tab switches

**System Status:**
- 🟢 **Fully Operational** - Ready for friend testing
- 🔓 Phone verification bypassed (NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true)
- 🌐 All major browsers working (Chrome, Firefox, Safari)

**Last Deployed Commit:** 0f32207 "fix: use absolute path for .env.local in socket-server"

**⚠️ ROLLBACK PLAN:**
If deployment breaks anything, revert to this commit:
```bash
git reset --hard 9a0fab7
git push --force origin main
# Railway and Vercel will auto-redeploy
```

---

## 🐛 PRODUCTION FIXES COMPLETED (Oct 4, 2025) ✅

### Fix 1: Railway Build Failure (COMPLETED)
- ✅ **Issue:** Railway build timing out due to NextAuth dependencies
- ✅ **Root cause:** Socket.IO server doesn't need NextAuth but `npm ci` installed everything
- ✅ **Solution:** Created `nixpacks.toml` to install only required packages (socket.io, @supabase/supabase-js, dotenv)
- ✅ **Files:** `nixpacks.toml` (new file), `railway.json` (modified)
- ✅ **Result:** Build time reduced from timeout to <2 minutes

### Fix 2: Runtime Error "setIsVerified is not defined" (COMPLETED)
- ✅ **Issue:** Error when authentication required callback triggered
- ✅ **Root cause:** Leftover code from Phase 1 OAuth migration referencing removed state variable
- ✅ **Solution:** Removed `setIsVerified(false);` line from onAuthRequired callback
- ✅ **Files:** `src/app/page.tsx` (line 244 removed)
- ✅ **Result:** No more runtime errors on auth failure

### Fix 3: Persistent "Connection lost. Reconnecting..." Banner (COMPLETED)
- ✅ **Issue:** Banner showing even when socket connected successfully
- ✅ **Root cause:** Race condition - socket connected without userId, rejected, then reconnected
- ✅ **Solution:**
  - Changed socket connection useEffect to wait for authenticated session before connecting
  - Pass userId to socket.connect()
  - Added onReconnected() call on initial connect event
- ✅ **Files:** `src/app/page.tsx`, `src/lib/webrtc/socket-client.ts`
- ✅ **Result:** Banner only shows when truly disconnected

### Fix 4: Ringing Sound Stops on Tab Switch (COMPLETED)
- ✅ **Issue:** Ringing stops when user switches browser tabs during call search
- ✅ **Root cause:** NextAuth's `refetchOnWindowFocus` changes session object → useEffect cleanup runs → ringing stops
- ✅ **Solution:** Added `refetchOnWindowFocus={false}` to SessionProvider
- ✅ **Files:** `src/app/layout.tsx` (line 39)
- ✅ **Result:** Ringing continues until call connects or cancelled

### Fix 5: Broken Call Matching After userId Fix Attempt (COMPLETED)
- ✅ **Issue:** Random call matching stopped working entirely
- ✅ **Root cause:** Changed useEffect dependency from `[status, session]` to `[status, userId]` caused WebRTC manager destruction when userId changed from null to actual value
- ✅ **Solution:** Reverted to `[status, session]` dependency (works with `refetchOnWindowFocus={false}`)
- ✅ **Files:** `src/app/page.tsx` (reverted lines 24 and 223)
- ✅ **Result:** Call matching fully restored, works as before Phase 1 migration

---

## 📋 LAUNCH PLAN

**See [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) for the complete 6-week roadmap, timeline, and cost estimates.**

This includes:
- Week-by-week breakdown from beta testing to public launch
- Investment summary: $2,500-6,000 upfront + $95-425/month
- Risk assessment and mitigation strategies
- Success metrics and go/no-go decision gates

---

## 🚨 LAUNCH READINESS - Required Before Public Release

### BLOCKING ISSUES (Cannot launch without these)

#### Legal Compliance (Est: 2-3 days + legal review)
- [ ] **Terms of Service document**
  - User conduct rules (no harassment, hate speech, illegal activity)
  - Liability limitations (not responsible for user meetups)
  - Account termination policy (ban conditions)
  - Dispute resolution process
  - **Action**: Draft or hire lawyer ($500-2000)
  - **Risk**: Launching without ToS = no legal protection

- [ ] **Privacy Policy document**
  - What data is collected (phone numbers, call metadata, IP addresses, session data)
  - How data is stored and protected (Supabase encryption, Telnyx compliance)
  - Data retention periods (how long we keep call history, reports)
  - User rights (access, deletion, portability under GDPR/CCPA)
  - Third-party services (Telnyx, Supabase, Vercel)
  - Cookie policy
  - **Action**: Draft or hire lawyer ($500-2000)
  - **Risk**: GDPR fines up to €20M or 4% revenue, CCPA fines up to $7,500 per violation

- [ ] **Age Verification Enhancement**
  - Current: Phone verification only (insufficient legal protection)
  - Required: Government ID verification or credit card check
  - Liability risk: Minors accessing dating platform = massive legal exposure
  - Alternatives:
    - Telnyx Identity Verification (~$0.50/check)
    - Stripe Identity (~$1.50/check)
    - Manual ID review (labor intensive)
  - **Action**: Implement ID verification (2-3 hours integration)
  - **Risk**: COPPA violations = $50,120 per violation, potential criminal charges

#### Safety Infrastructure (Est: 1-2 weeks)
- [ ] **Moderation System**
  - Who reviews reports? (You? Hire moderator? Automated AI?)
  - Response time SLA (24 hours? 72 hours?)
  - Escalation process for serious threats (suicide, violence, minors)
  - Moderator training materials
  - **Action**: Define process, hire moderator ($15-25/hr) OR implement automated review
  - **Cost**: $2,000-4,000/month for part-time moderator

- [ ] **Incident Response Plan**
  - What happens when user reports assault/harassment after meetup?
  - Contact law enforcement protocol (when and how?)
  - Evidence preservation (call logs, reports, ban history)
  - Victim support resources (hotlines, counseling services)
  - Documentation requirements for legal requests
  - **Action**: Write documented procedure (1 day)
  - **Risk**: Improper handling = lawsuits, bad PR, regulatory scrutiny

- [ ] **Content Moderation Policy**
  - Instant ban: Threats, hate speech, solicitation, minors, drugs
  - Warning: Spam, mild rudeness, excessive disconnects
  - Manual review: Gray areas, appeals
  - Appeals process (how users contest bans)
  - Ban duration (permanent vs temporary)
  - **Action**: Write policy document (4-6 hours)
  - **Risk**: Inconsistent moderation = discrimination lawsuits

#### Operational Requirements (Est: 1-2 days setup + ongoing)
- [ ] **Support System**
  - Dedicated support email (support@airtalk.com)
  - Expected response time (24-48 hours)
  - FAQ/Help documentation
  - Ticketing system (e.g., Zendesk, Freshdesk)
  - **Action**: Set up support email, write FAQ (1 day)
  - **Cost**: Free (email) to $49+/month (ticketing system)

- [ ] **Monitoring & Alerts**
  - Server uptime monitoring (UptimeRobot, Pingdom)
  - Error tracking (Sentry, LogRocket)
  - Usage analytics (PostHog, Mixpanel)
  - Alert notifications (PagerDuty, Slack)
  - **Action**: Set up monitoring tools (4-6 hours)
  - **Cost**: Free tiers available, $10-100/month for paid plans

- [ ] **Backup & Recovery**
  - Database backups (automated daily via Supabase)
  - Point-in-time recovery enabled
  - Disaster recovery plan documented
  - Test restore procedure quarterly
  - **Action**: Configure Supabase backups, write recovery plan (1-2 hours)
  - **Cost**: Included in Supabase Pro plan ($25/month)

---

### ⚠️ HIGH PRIORITY (Should have before launch)

#### Enhanced Safety Features (Est: 1 week)
- [ ] **Emergency Contact Sharing**
  - Users can share their date details with a trusted friend
  - "Check-in" feature to confirm safety after meetup
  - Auto-notify emergency contact if check-in missed
  - **Action**: Build feature (1-2 days)
  - **Benefit**: Reduces liability, shows duty of care

- [ ] **In-App Safety Resources**
  - Link to crisis hotlines (suicide prevention, assault support)
  - Safety tips for meeting strangers from internet
  - How to spot red flags (controlling behavior, pressure tactics)
  - Reporting harassment guide
  - **Action**: Create resources page (4-6 hours)
  - **Benefit**: Demonstrates platform responsibility

- [ ] **Photo Verification (Optional but Recommended)**
  - Verify user's identity with selfie
  - Reduces catfishing and fake profiles
  - Increases user trust
  - **Action**: Integrate photo verification API (1 day)
  - **Cost**: $0.50-1.50 per verification

- [ ] **Block List Enhancements**
  - Currently: Basic ban system exists
  - Needed: Users can block specific people permanently
  - Blocked users never matched again
  - **Action**: Add user-level blocking (3-4 hours)

#### Business Operations (Est: 2-3 weeks)
- [ ] **Insurance**
  - General liability insurance ($500-2,000/year)
  - Cyber liability insurance ($1,000-7,500/year)
  - Professional liability (E&O) insurance
  - Check requirements based on jurisdiction
  - **Action**: Consult insurance broker
  - **Risk**: One lawsuit without insurance = bankruptcy

- [ ] **Business Entity**
  - Form LLC or C-Corp to limit personal liability
  - Separate business bank account
  - Business credit card for expenses
  - EIN from IRS
  - **Action**: Register business entity (varies by state)
  - **Cost**: $100-800 for LLC filing + $800/year CA franchise tax

- [ ] **Scaling Plan**
  - Current: Socket.io server on single machine = single point of failure
  - Needed: Load balancing, horizontal scaling, CDN
  - Monitoring: When to spin up additional servers?
  - Cost projections: What happens at 1K, 10K, 100K users?
  - **Action**: Document scaling architecture (1-2 days)

- [ ] **Revenue Model**
  - Current: Free with no monetization
  - Options: Ads, premium features, subscriptions
  - Financial sustainability plan
  - **Action**: Define monetization strategy

#### Technical Hardening (Est: 1 week)
- [ ] **Rate Limiting Everywhere**
  - API routes (prevent abuse)
  - Socket connections (prevent DDoS)
  - Report submissions (prevent spam)
  - **Action**: Add rate limits to all endpoints (1 day)

- [ ] **SQL Injection Prevention Audit**
  - Review all database queries
  - Ensure parameterized queries
  - Test with SQLMap
  - **Action**: Security audit (1-2 days)

- [ ] **XSS Prevention Audit**
  - Review all user input rendering
  - Ensure proper escaping
  - Content Security Policy headers
  - **Action**: Security audit (1-2 days)

- [ ] **Environment Variable Security**
  - Ensure no secrets in git history
  - Use proper secret management (Vercel env vars, AWS Secrets Manager)
  - Rotate all API keys before launch
  - **Action**: Audit and rotate secrets (2-3 hours)

---

## Phone Verification - PENDING APPROVAL ⏳

### 🚨 CURRENT STATUS: BYPASSED FOR TESTING
**Phone verification is currently DISABLED via feature flag to allow friend testing before Telnyx approval.**

**Feature flag location**: `.env.local`
```bash
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true  # Currently bypassed for testing
```

### ⚠️ CRITICAL: Before Public Launch Checklist
- [ ] **MUST DO**: Set `NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=false` in .env.local
- [ ] Restart Next.js dev server
- [ ] Restart Socket.io server
- [ ] Test that phone verification modal appears
- [ ] Verify unverified users cannot connect to Socket.io

### Telnyx Number Activation (Waiting 24-48 hours)
- [ ] Wait for Telnyx documentation approval (check email)
- [ ] Once approved, test SMS sending with real phone number
- [ ] Verify rate limiting works (5 attempts/hour per phone)
- [ ] Test code expiration (5 minutes)
- [ ] Test max attempts per code (3 attempts)
- [ ] Test Socket.io auth enforcement (disconnects unverified users)
- [ ] Test session validation on page reload
- [ ] **AFTER TESTING WORKS**: Set bypass flag to `false` in production

**Note**: Phone verification code is complete and committed. Telnyx phone number (+6498734038) requires documentation review before it can send SMS. This is a standard Telnyx compliance requirement. The bypass flag allows testing with friends in the meantime.

---

## 🚀 PERFORMANCE & SCALING

### Socket.IO Optimization (HIGH PRIORITY - 3-4x Capacity Boost!)

**When to implement:** Now OR when Railway credits >80% used

**Impact:**
- Current capacity: 50-100 concurrent users
- After optimization: 150-200 concurrent users
- Memory savings: 65% (200KB → 70KB per connection)
- Cost: Still $0/month on Railway free tier

**Tasks:**
- [ ] **Update `socket-server.js` configuration** (5 minutes)
  - Change `pingInterval: 2000` to `pingInterval: 10000`
  - Add `transports: ['websocket']`
  - Add `perMessageDeflate: false`
  - See [SCALING.md](./SCALING.md) Phase 1 for code

- [ ] **Install performance binaries** (2 minutes)
  ```bash
  npm install --save-optional bufferutil utf-8-validate
  ```

- [ ] **Add monitoring code** (10 minutes)
  - Memory usage logging
  - Connection count tracking
  - Stale connection cleanup
  - See [SCALING.md](./SCALING.md) Phase 1 for code

- [ ] **Test locally** (10 minutes)
  - Two-tab testing
  - Verify calls still work
  - Check memory usage in logs

- [ ] **Deploy to production** (5 minutes)
  ```bash
  git add .
  git commit -m "perf: optimize Socket.IO for 3-4x capacity"
  git push origin main
  ```

- [ ] **Monitor Railway metrics** (ongoing)
  - Check credits usage
  - Verify memory decreased
  - Confirm connection count increased

**See:** [SCALING.md](./SCALING.md) for complete implementation guide
**See:** [CAPACITY.md](./CAPACITY.md) for capacity analysis

---

## Immediate Next Steps

### 1. ✅ Safari Socket.io Connection Issue (RESOLVED)
- [x] Root cause: Socket.io server not loading .env.local correctly (relative path issue)
- [x] Fixed by using absolute path: `path.join(__dirname, '../../.env.local')`
- [x] Phone verification bypass now working on server-side
- [x] Tested successfully on Safari macOS - WebRTC connections working
- [x] Added debug logs to verify environment variables load on startup

### 2. Test with Real Users (In Progress)
- [ ] Share production URL with 5-10 friends
- [ ] Monitor Railway logs for errors
- [ ] Monitor Vercel logs for frontend issues
- [ ] Collect feedback on call quality and matching speed
- [ ] Test on different networks (WiFi, cellular, corporate)
- [ ] Track Railway credits usage (set alert at 80%)

### 3. Set Up Monitoring (NEW - 30 minutes)
- [ ] Set up Railway alerts for credit usage >80%
- [ ] Monitor concurrent user count
- [ ] Track average session duration
- [ ] Set up error rate alerts

---

## Next Features to Build (Priority Order)

### 2. Call History System (1-2 hours)
- [ ] Display last 5 calls on homepage
- [ ] Store call data in Supabase (call_history table already exists)
- [ ] Show: timestamp, duration, report status
- [ ] Add "View History" modal/page

### 2. Report System with Auto-Ban (2-3 hours)
- [ ] Implement report button functionality (currently placeholder)
- [ ] Store reports in Supabase (reports table already exists)
- [ ] Auto-ban logic: 3 reports within 2 hours = ban
- [ ] Check bans table before allowing calls
- [ ] Show appropriate error message to banned users

### 3. Error Handling & Edge Cases (1 hour)
- [ ] Handle microphone permission denied
- [ ] Handle connection drops gracefully
- [ ] Handle socket disconnections during call
- [ ] Add retry logic for failed connections
- [ ] Show user-friendly error messages

### 4. Additional Pages (1-2 hours)
- [ ] About page
- [ ] Contact page
- [ ] Blog page (optional)
- [ ] Privacy policy
- [ ] Terms of service

### 5. Footer (30 min)
- [ ] Add footer with links
- [ ] Social media icons
- [ ] Copyright notice

### 6. Production Readiness
- [ ] Environment variables in Vercel
- [ ] Deploy Socket.io server separately (not Vercel)
- [ ] Set up proper logging/monitoring
- [ ] Test on mobile browsers
- [ ] Optimize audio quality
- [ ] Add analytics

---

## 📈 Scaling Milestones

**Current Status:** 0-100 concurrent users, Railway free tier, $0/month

### Milestone 1: First 100 Users ✅ (Current)
- [x] Railway deployment working
- [x] Vercel deployment working
- [x] Basic phone verification (bypassed for testing)
- [ ] Implement Socket.IO optimizations
- [ ] Set up monitoring

### Milestone 2: 100-500 Users (ETA: 1-3 months)
- [ ] Socket.IO optimizations deployed (3-4x capacity)
- [ ] Railway credits monitored weekly
- [ ] Consider adding payment method to Railway OR
- [ ] Plan Hetzner migration (if costs >$20/month)

### Milestone 3: 500-1,000 Users (ETA: 3-6 months)
- [ ] Migrate to Hetzner CX11 ($5.50/month)
- [ ] Set up PM2 process manager
- [ ] Configure automatic deployments
- [ ] Set up SSL with Let's Encrypt
- [ ] Monitoring dashboard (Uptime Robot, Sentry)

### Milestone 4: 1,000-10,000 Users (ETA: 6-12 months)
- [ ] Upgrade to Hetzner CPX11 ($11/month)
- [ ] Optimize database queries
- [ ] Consider Supabase Pro ($25/month)
- [ ] Implement caching strategies
- [ ] Set up CDN for static assets

### Milestone 5: 10,000+ Users (ETA: 12+ months)
- [ ] Implement load balancing
- [ ] Set up Redis adapter
- [ ] Multiple Socket.IO servers
- [ ] Consider multi-region deployment
- [ ] Hire DevOps engineer

**See [SCALING.md](./SCALING.md) for complete scaling roadmap and [CAPACITY.md](./CAPACITY.md) for cost analysis at each milestone.**

---

## Future Enhancements (Low Priority)

- [ ] Country detection for filter matching
- [ ] Profile pictures (optional)
- [ ] In-call text chat
- [ ] Call quality rating
- [ ] Gender preference filter
- [ ] Language preference filter
- [ ] Desktop notifications for matches
- [ ] Friend/contact system (add strangers you like during calls)