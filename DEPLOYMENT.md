# Deployment Guide

## ✅ Deployment Complete (Sept 30, 2025)

**Production URLs:**
- 🌐 **Frontend:** https://call-app-1.vercel.app
- 🔌 **Socket.io Server:** https://callapp1-production.up.railway.app
- 💾 **Database:** Supabase (skyffnybsqwfbbkbqcxy.supabase.co)

## Pre-Deployment Checklist

- [x] All features working locally
- [x] Two-tab testing successful
- [x] Database schema finalized (Supabase)
- [x] Environment variables documented
- [x] Socket.io server code complete
- [x] Phone verification bypass enabled for testing
- [x] Railway deployment (Socket.io)
- [x] Vercel deployment (Next.js)
- [x] Environment variables configured on both platforms
- [x] CORS configured for production
- [x] Health check endpoint functional
- [x] Cross-browser testing complete (Chrome, Firefox, Safari all working)
- [x] Phone verification bypass working on both platforms

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

**Commit Hash:** `9a0fab7` (Production deployment: Linting disabled, Railway + Vercel live)
**Date:** September 30, 2025
**Status:** ✅ Deployed to production
**Previous Backup:** `774b86a` (Pre-deployment: All features working locally)

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

### Current Infrastructure (As Deployed)

**Railway (Socket.IO Server):**
- **Free Tier:** $5/month credits (~500 hours runtime)
- **Current Config:** Supports 50-100 concurrent users
- **Optimized Config:** Supports 150-200 concurrent users (3-4x improvement)
- **When Credits Run Out:** Server pauses (add payment method to resume)

**Vercel (Next.js Frontend):**
- **Hobby Plan:** FREE
  - 100 GB bandwidth/month
  - Serverless functions included
  - Sufficient for 50,000+ monthly visitors

**Supabase (Database):**
- **Free Tier:** Currently using
  - 500 MB database storage
  - Unlimited API requests
  - 50,000 MAU (Monthly Active Users)
  - Sufficient for 10,000-50,000 users

### Cost by User Scale

| Concurrent Users | Platform | Monthly Cost | Notes |
|-----------------|----------|--------------|-------|
| **0-100** | Railway Free | $0 | Current setup |
| **100-200** | Railway Free (optimized) | $0 | With Socket.IO optimizations |
| **200-500** | Railway Paid | $5-15 | Credits needed |
| **500-10,000** | Hetzner CX11 | $5.50 | **Recommended migration** |
| **10,000-30,000** | Hetzner CPX11 | $11 | 4GB RAM VPS |
| **30,000-100,000** | Multiple Hetzner | $30-70 | Load balanced |

**Current Total Monthly Cost:** **$0** (free tier)

**See [CAPACITY.md](./CAPACITY.md) for detailed capacity analysis and [SCALING.md](./SCALING.md) for scaling guides.**

---

---

## Alternative: Hetzner VPS Deployment

**When to use:** 500+ concurrent users OR Railway costs >$20/month

**Benefits:**
- Much cheaper ($5.50/month vs $20+/month Railway)
- 10x more capacity (10,000+ users vs 1,000)
- 20TB bandwidth included
- Full server control

**Drawbacks:**
- Manual setup (2-3 hours one-time)
- Requires basic Linux knowledge
- Manual deployments (or set up CI/CD)

**See [SCALING.md](./SCALING.md) Phase 3 for complete Hetzner migration guide.**

**Quick Overview:**
1. Create Hetzner Cloud account
2. Spin up CX11 server (€5/month, 2GB RAM)
3. Install Node.js, clone repo, install dependencies
4. Set up PM2 process manager
5. Configure firewall
6. Update Vercel environment variable to point to Hetzner IP
7. Optional: Set up SSL with Nginx + Let's Encrypt

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
- [ ] Implement Socket.IO optimizations (see [SCALING.md](./SCALING.md) Phase 1)
- [ ] Set up monitoring/alerts for Railway credits
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