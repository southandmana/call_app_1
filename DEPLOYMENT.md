# Deployment Guide

## Pre-Deployment Checklist

- [x] All features working locally
- [x] Two-tab testing successful
- [x] Database schema finalized (Supabase)
- [x] Environment variables documented
- [x] Socket.io server code complete
- [x] Phone verification bypass enabled for testing
- [ ] Railway deployment (Socket.io)
- [ ] Vercel deployment (Next.js)
- [ ] Production testing with friends

---

## Environment Variables Needed

### Socket.io Server (Railway)

```bash
# Supabase Connection (get from .env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=false  # Set to false for production!

# Production Config
FRONTEND_URL=https://your-app.vercel.app  # Update after Vercel deployment
PORT=3001  # Railway will provide this automatically
```

### Next.js Frontend (Vercel)

```bash
# Supabase Connection (get from .env.local)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Feature Flags
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true  # Keep true until Telnyx approved

# Socket.io Connection
NEXT_PUBLIC_SOCKET_URL=https://your-railway-app.railway.app  # Update after Railway deployment

# Telnyx (for phone verification - optional until approved, get from .env.local)
TELNYX_API_KEY=your_telnyx_api_key
TELNYX_PHONE_NUMBER=your_telnyx_phone_number
```

---

## Deployment Steps

### Step 1: Deploy Socket.io Server to Railway

1. **Create Railway Account:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select `call_app_1` repository

3. **Configure Service:**
   - **Start Command:** `node src/lib/socket-server.js`
   - **Build Command:** `npm install`
   - **Port:** Railway auto-detects (uses PORT env var)

4. **Add Environment Variables:**
   - Copy all variables from "Socket.io Server" section above
   - Add them in Railway dashboard → Variables tab

5. **Deploy:**
   - Railway will auto-deploy on git push
   - Wait for deployment to complete
   - Copy the public URL (e.g., `https://your-app.railway.app`)

6. **Update FRONTEND_URL:**
   - After Vercel deployment, come back and update this variable

### Step 2: Deploy Next.js Frontend to Vercel

1. **Create Vercel Account:**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Repository:**
   - Click "Add New Project"
   - Select `call_app_1` repository
   - Framework: Next.js (auto-detected)

3. **Configure Build:**
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   - Copy all variables from "Next.js Frontend" section above
   - Update `NEXT_PUBLIC_SOCKET_URL` with Railway URL from Step 1
   - Add them in Vercel → Project Settings → Environment Variables

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Copy the deployment URL (e.g., `https://your-app.vercel.app`)

6. **Update Railway FRONTEND_URL:**
   - Go back to Railway dashboard
   - Update `FRONTEND_URL` variable with Vercel URL
   - Railway will auto-redeploy

### Step 3: Update CORS in Socket Server

**Before deploying to Railway, update socket-server.js:**

```javascript
// Change line 16 from:
origin: "http://localhost:3000"

// To:
origin: process.env.FRONTEND_URL || "http://localhost:3000"
```

This allows Railway to connect from your Vercel frontend.

### Step 4: Test Production Deployment

1. **Open Vercel URL** in browser
2. **Check browser console** for Socket.io connection
3. **Open second tab** with same URL
4. **Test voice call** between tabs
5. **Verify:**
   - Online user count updates
   - Matching works
   - Voice connection establishes
   - End call works

---

## Troubleshooting

### Socket.io Connection Failed
- Check Railway logs: `railway logs`
- Verify `FRONTEND_URL` matches Vercel URL exactly
- Ensure CORS is updated in socket-server.js

### "Auth Required" Error
- Check `NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true` in Vercel
- Verify Supabase credentials are correct
- Check Railway logs for authentication errors

### No Audio
- Check browser console for WebRTC errors
- Verify microphone permissions granted
- Test on different network (some corporate networks block WebRTC)

### Railway "Application Failed to Start"
- Check start command is `node src/lib/socket-server.js`
- Verify all environment variables are set
- Check Railway logs for specific error

---

## Last Known Working State

**Commit Hash:** `774b86a` (Pre-deployment backup: All features working, ready for Railway + Vercel)
**Date:** September 30, 2025
**Status:** ✅ Fully functional local deployment

**What Works:**
- Voice calling (WebRTC)
- Interest matching
- Online user count
- Error handling
- Phone verification bypass
- Two-tab testing

**Dependencies Installed:**
- Node.js 22.19.0
- Next.js 15.5.4
- Socket.io 4.8.1
- Supabase client
- dotenv (for Railway)

**Database Tables:**
- `sessions` (phone verification)
- `call_history` (not yet used)
- `reports` (not yet used)
- `bans` (not yet used)
- `verification_codes` (phone codes)

---

## Rollback Plan

If deployment breaks:

```bash
# Find this commit
git log

# Revert to working state
git reset --hard [commit-hash-from-above]

# Redeploy
git push --force origin main
```

Both Railway and Vercel will auto-redeploy from the reverted commit.

---

## Cost Estimates

### Railway (Socket.io Server)
- **Free Tier:** $5/month credit
- **0-100 users:** $0-5/month (likely free)
- **100-500 users:** $10-20/month
- **500-1000 users:** $20-40/month

### Vercel (Next.js Frontend)
- **Hobby Plan:** FREE
  - 100 GB bandwidth/month
  - Unlimited sites
  - Should be sufficient for 100-500 users

### Supabase (Database)
- **Free Tier:** Currently using
  - 500 MB database
  - 2 GB bandwidth
  - Upgrade to $25/month if needed

**Total Monthly Cost (0-100 users):** $0-5/month

---

## Post-Deployment Tasks

After successful deployment:

- [ ] Share Vercel URL with 5-10 friends for testing
- [ ] Monitor Railway logs for errors
- [ ] Check Vercel analytics for traffic
- [ ] Test from different devices (mobile, tablet)
- [ ] Test from different networks (WiFi, cellular)
- [ ] Document any issues in GitHub Issues
- [ ] Wait for Telnyx approval, then disable bypass flag
- [ ] Implement call history feature (next sprint)
- [ ] Implement report system (next sprint)

---

## Production Checklist (Before Public Launch)

⚠️ **DO NOT share publicly until these are complete:**

- [ ] Phone verification enabled (bypass flag = false)
- [ ] Telnyx phone number approved and tested
- [ ] Terms of Service written and displayed
- [ ] Privacy Policy written and displayed
- [ ] Age verification enhanced (ID check, not just checkbox)
- [ ] Report system functional with auto-ban
- [ ] Call history system implemented
- [ ] Support email set up (support@yourdomain.com)
- [ ] LLC formed (personal liability protection)
- [ ] Insurance obtained (cyber + general liability)
- [ ] Moderation plan documented
- [ ] Incident response plan written
- [ ] Safety resources page created
- [ ] Beta testing complete (30+ users, no critical bugs)

See [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) for full 6-week roadmap.