# TODO: Pending Tasks

---

## 🚨 CURRENT STATUS - READY TO DEPLOY

**Last Working Commit:** [This commit - backup before deployment]

**What Works Locally:**
- ✅ Voice calling between users (WebRTC)
- ✅ Interest-based matching
- ✅ Online user count (real-time)
- ✅ Error handling (mic permission, connection drops, no users)
- ✅ Phone verification bypass for testing
- ✅ Two-tab local testing successful
- ✅ Socket.io on port 3001
- ✅ Next.js on port 3000

**Next Immediate Steps:**
1. [ ] Deploy Socket.io server to Railway
2. [ ] Deploy Next.js frontend to Vercel
3. [ ] Update CORS and connection URLs for production
4. [ ] Test with friends at deployed URL

**⚠️ BACKUP PLAN:**
If deployment breaks anything, revert to this commit:
```bash
git log  # Find this commit hash
git reset --hard [commit-hash]
# Redeploy from working state
```

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

## Next Features to Build (Priority Order)

### 1. Call History System (1-2 hours)
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

## Future Enhancements (Low Priority)

- [ ] Country detection for filter matching
- [ ] Profile pictures (optional)
- [ ] In-call text chat
- [ ] Call quality rating
- [ ] Gender preference filter
- [ ] Language preference filter
- [ ] Desktop notifications for matches