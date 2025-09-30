# TODO: Pending Tasks

## Phone Verification - PENDING APPROVAL ⏳

### Telnyx Number Activation
- [ ] Wait for Telnyx documentation approval (check email in 24-48 hours)
- [ ] Once approved, test SMS sending with real phone number
- [ ] Verify rate limiting works (5 attempts/hour per phone)
- [ ] Test code expiration (5 minutes)
- [ ] Test max attempts per code (3 attempts)
- [ ] Test Socket.io auth enforcement (disconnects unverified users)
- [ ] Test session validation on page reload

**Note**: Phone verification code is complete and committed. Telnyx phone number (+6498734038) requires documentation review before it can send SMS. This is a standard Telnyx compliance requirement.

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