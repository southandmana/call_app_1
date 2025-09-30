# AirTalk - Voice-Only Random Chat App

Voice-only random chat app with interest-based matching, built with Next.js, Socket.io, and WebRTC.

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

- **Frontend:** Next.js 15.5.4, React, Tailwind CSS
- **Backend:** Socket.io 4.8.1 (signaling server)
- **WebRTC:** simple-peer 9.11.1
- **Database:** Supabase PostgreSQL
- **Phone Verification:** Telnyx SMS API
- **Hosting:** Vercel (frontend) + Railway (Socket.io)

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

## 📚 Documentation

- [PROGRESS.md](./PROGRESS.md) - Development session logs
- [TODO.md](./TODO.md) - Pending features and tasks
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide for Railway + Vercel
- [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) - 6-week roadmap to public launch

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

**Current Status:** Deployed to production, friend testing in progress

**Known Issues:**
- Safari Socket.io connection needs debugging
- Phone verification pending Telnyx approval (ETA: 24-48 hours)

**Before Public Launch:**
- [ ] Enable phone verification (set bypass flag to false)
- [ ] Implement call history feature
- [ ] Add report system with auto-ban logic
- [ ] Create Terms of Service and Privacy Policy
- [ ] Enhance age verification (ID check)
- [ ] Set up moderation system

See [LAUNCH_PLAN.md](./LAUNCH_PLAN.md) for complete pre-launch checklist.

## 📄 License

Private project - not open source.
