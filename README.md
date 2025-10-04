# CQPDUK - Voice-First Connection Platform

Voice-first dating and friendship platform that facilitates authentic connections through anonymous voice calls, events, and AI-powered matching.

## 🌐 Production URLs

- **Frontend:** https://call-app-1.vercel.app
- **Socket.io Server:** https://callapp1-production.up.railway.app
- **Database:** Supabase PostgreSQL

## 🚀 Features

- ✅ Voice calling between random users (WebRTC)
- ✅ Interest-based matching algorithm
- ✅ Real-time online user count
- ✅ Comprehensive error handling (mic permissions, connection drops, no users)
- ✅ Phone verification system (pending Telnyx approval, currently bypassed for testing)
- ✅ Auto-call feature for continuous connections
- ✅ Country preference filtering (partially implemented)

## 🛠 Tech Stack

- **Frontend:** Next.js 15.5.4, React 19.1.0, Tailwind CSS 4
- **Backend:** Socket.IO 4.8.1 (WebRTC signaling server)
- **WebRTC:** simple-peer 9.11.1 (peer-to-peer voice)
- **Database:** Supabase PostgreSQL
- **Authentication:** Phone verification via Telnyx SMS API
- **Hosting:** Vercel (frontend) + Railway (Socket.IO server)

## 📊 Current Capacity & Costs

### **Current Setup (As of Oct 2025)**

**Concurrent User Capacity:**
- **Current Configuration:** 50-100 concurrent users
- **With Optimizations:** 150-200 concurrent users (3-4x improvement)
- **Bottleneck:** Railway free tier ($5 credits/month)

**Monthly Costs:**
- **Railway (Socket.IO):** $0 (free tier, ~500 hours/month)
- **Vercel (Frontend):** $0 (free tier, 100GB bandwidth)
- **Supabase (Database):** $0 (free tier, 500MB storage)
- **Total:** **$0/month** for up to 100 concurrent users

### **Scaling Costs**

| Concurrent Users | Platform | Monthly Cost | Notes |
|-----------------|----------|--------------|-------|
| **0-100** | Railway Free | $0 | Current setup |
| **100-500** | Railway Free (optimized) | $0 | With Socket.IO optimizations |
| **500-1,000** | Railway Paid | $5-10 | Credits needed |
| **1,000-10,000** | Hetzner CX11 (€5) | $5.50 | Migrate to VPS |
| **10,000-30,000** | Hetzner CPX11 (€10) | $11 | 4GB RAM VPS |
| **30,000-100,000** | Multiple Hetzner | $30-70 | Load balanced instances |

**📖 Quick Reference:** See [QUICK_REFERENCE.md](./docs/archived/QUICK_REFERENCE.md) for TL;DR summary
**📊 Detailed Analysis:** See [CAPACITY.md](./docs/archived/CAPACITY.md) for complete capacity breakdown
**📈 Scaling Guide:** See [SCALING.md](./docs/archived/SCALING.md) for step-by-step scaling instructions

### Key Takeaway

Your WebRTC peer-to-peer architecture is extremely cost-efficient:
- ✅ Free tier sufficient for first 6-12 months
- ✅ Simple optimizations = 3-4x capacity (still free)
- ✅ $5.50/month handles 10,000 concurrent users
- ✅ Voice streams P2P (not through your server)

## 📦 Local Development

### Prerequisites

- Node.js 22.19.0 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start Socket.io server (Terminal 1)
node src/lib/socket-server.js

# Start Next.js dev server (Terminal 2)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

Create a `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telnyx (optional, for phone verification)
TELNYX_API_KEY=your_telnyx_api_key
TELNYX_PHONE_NUMBER=your_telnyx_phone

# Feature Flags
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true  # Set to false for production
```

## 📚 Core Documentation

**Essential Reading (Start Here):**

1. **[PRODUCT_SPEC.md](./docs/PRODUCT_SPEC.md)** - Complete feature specifications
   - What we're building and why
   - All planned features with detailed descriptions
   - User flows, monetization strategy, success metrics

2. **[IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md)** - Your single source of truth
   - Current state (what's done vs. what's left)
   - Phased roadmap (MVP → Launch)
   - Task-by-task breakdown with dependencies
   - Progress tracking and challenge log

3. **[TECHNOLOGY_STACK.md](./docs/TECHNOLOGY_STACK.md)** - Technology & API selections
   - All APIs researched (ID verification, AI, payments, etc.)
   - Cost breakdowns (MVP: ~$530/month, Growth: ~$2,660/month)
   - Implementation guides for each service
   - 90% cost savings strategies

4. **[AI_WORKFLOW_GUIDE.md](./docs/AI_WORKFLOW_GUIDE.md)** - How to work with AI effectively
   - Step-by-step processes for each development phase
   - Error handling workflows
   - Validation and testing procedures
   - Best practices and common pitfalls

5. **[LANDING_PAGE_STRUCTURE.md](./docs/LANDING_PAGE_STRUCTURE.md)** - GitHub-inspired landing page design
   - 9 sections with placeholder content
   - Design system (colors, typography, components)
   - Responsive breakpoints and accessibility

**Archived Documentation:**
- Older docs moved to `/docs/archived/` (reference only)

## 🔧 Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Main app page
│   └── api/               # API routes
├── components/            # React components
│   ├── ErrorModal.tsx
│   ├── ErrorToast.tsx
│   ├── ErrorBanner.tsx
│   └── PhoneVerification.tsx
└── lib/
    ├── webrtc/           # WebRTC logic
    │   ├── manager.ts    # WebRTC manager
    │   └── socket-client.ts  # Socket.io client
    ├── socket-server.js  # Socket.io signaling server
    └── supabase/         # Database client and schema
```

## 🚨 Status

**Current Status:** ✅ Fully deployed and operational - Ready for testing

**System Health:**
- 🟢 Railway (Socket.io): Running
- 🟢 Vercel (Frontend): Running
- 🟢 WebRTC: Working on all major browsers (Chrome, Firefox, Safari)
- 🔓 Phone verification: Bypassed for testing (NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true)

**Recent Updates:**
- ✅ Critical production fixes completed (Oct 4, 2025):
  - Railway build failure fixed (nixpacks.toml skips NextAuth dependencies)
  - Runtime error "setIsVerified is not defined" fixed (removed leftover Phase 1 code)
  - Socket connection banner fixed (resolved race condition with userId)
  - Ringing sound persistence fixed (disabled refetchOnWindowFocus in SessionProvider)
  - Call matching restored (reverted dependency array to prevent WebRTC manager destruction)
- ✅ Phase 1 complete: Google OAuth authentication (Oct 4, 2025)
- ✅ Header redesign: Online counter with user icon in filled rectangle, circular navigation buttons (Oct 3, 2025)
- ✅ UI refinements: Minimalist transparent container design (Oct 2, 2025)
- ✅ Major UI redesign: New layout, ControlBar, animations (Oct 1, 2025)
- ✅ Critical bug fixes: End Call button and call restart issues resolved (Oct 2, 2025)
- ✅ Safari Socket.io connection issue resolved (Sept 30, 2025)
- ✅ Cross-browser testing completed successfully
- ✅ Phone verification bypass working on both platforms
- ⏳ Telnyx phone number approval pending (ETA: 24-48 hours)

**Before Public Launch:**
- [ ] Enable phone verification (set bypass flag to false)
- [ ] Implement call history feature
- [ ] Add report system with auto-ban logic
- [ ] Create Terms of Service and Privacy Policy
- [ ] Enhance age verification (ID check)
- [ ] Set up moderation system

See [LAUNCH_PLAN.md](./docs/archived/LAUNCH_PLAN.md) for complete pre-launch checklist.

## 📄 License

Private project - not open source.
