# AirTalk - Project Summary for UI/UX Work

**Date:** September 30, 2025
**Current Commit:** `f776a17` - "docs: update deployment completion status"
**Status:** ✅ Fully deployed and operational

---

## 1. Deployment Status

### Production URLs
- **Frontend (Vercel):** https://call-app-1.vercel.app
- **Socket.io Server (Railway):** https://callapp1-production.up.railway.app
- **Database:** Supabase PostgreSQL (skyffnybsqwfbbkbqcxy.supabase.co)

### Environment Variables

**Vercel (Frontend):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://skyffnybsqwfbbkbqcxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key]
NEXT_PUBLIC_SOCKET_URL=https://callapp1-production.up.railway.app
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true  # Currently bypassed for testing
TELNYX_API_KEY=[key]  # For phone verification (pending approval)
TELNYX_PHONE_NUMBER=+6498734038
```

**Railway (Socket.io Server):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://skyffnybsqwfbbkbqcxy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key]
NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true
FRONTEND_URL=https://call-app-1.vercel.app
PORT=3001  # Auto-assigned by Railway
```

### Current Git State
- **Latest Commit:** `f776a17`
- **Branch:** main
- **Deployment:** Auto-deploys on push to both Vercel and Railway

---

## 2. Critical Files (⚠️ DO NOT MODIFY - Will Break Functionality)

### WebRTC Core
- **`src/lib/webrtc/manager.ts`** - WebRTC connection manager
  - Handles peer connections, media streams, signaling
  - Methods: `startCall()`, `endCall()`, `toggleMute()`, `initializePeer()`, `connectToPeer()`
  - Event system for call state changes

- **`src/lib/webrtc/socket-client.ts`** - Socket.io client wrapper
  - Manages WebSocket connections to Railway server
  - Handles: matching, waiting, signaling, disconnections
  - Methods: `connect()`, `joinQueue()`, `leaveQueue()`, `startCall()`, `sendSignal()`, `endCall()`

### Backend
- **`src/lib/socket-server.js`** - Socket.io signaling server
  - Runs on Railway (Node.js standalone process)
  - Handles user matching, queue management, signaling
  - Phone verification bypass logic
  - ⚠️ Uses absolute path for .env.local: `path.join(__dirname, '../../.env.local')`

### State Management in page.tsx (Lines 16-56)
**DO NOT MODIFY** these state variables or their logic:
```typescript
const [callState, setCallState] = useState<CallState>('idle');  // 'idle' | 'searching' | 'connected' | 'no-users'
const [webrtcManager, setWebrtcManager] = useState<WebRTCManager | null>(null);
const [isMuted, setIsMuted] = useState(false);
const [autoCallEnabled, setAutoCallEnabled] = useState(false);
const [onlineUsers, setOnlineUsers] = useState(0);
const [isVerified, setIsVerified] = useState(false);
const [userFilters, setUserFilters] = useState<UserFilters>({ ... });
const autoCallEnabledRef = useRef(autoCallEnabled);  // For closure bug fix
const userFiltersRef = useRef(userFilters);
```

**Critical useEffect hooks** (Lines 59-262):
- Phone verification check on mount
- WebRTC manager initialization and cleanup
- Socket event listeners (matched, waiting, user count, errors)
- Auto-call logic after call ends

**Critical handler functions** (Lines 119-282):
- `handleCallClick()` - Starts call/ends call based on state
- `handleStartCall()` - Initiates WebRTC connection
- `handleEndCall()` - Cleans up WebRTC and socket connections
- `handleToggleMute()` - Mutes/unmutes microphone
- `handleCancelSearch()` - Cancels matching search

### API Routes (Phone Verification - Pending Telnyx Approval)
- `src/app/api/auth/send-code/route.ts` - Sends SMS verification code
- `src/app/api/auth/verify-code/route.ts` - Verifies code and creates session
- `src/app/api/session/status/route.ts` - Checks session validity

---

## 3. Safe Files (✅ OK to Modify for UI/UX)

### UI Components
All components in `src/components/` are safe to modify:

1. **`ErrorModal.tsx`** - Modal for critical errors
   - Props: `isOpen`, `title`, `message`, `type`, `onRetry`, `onClose`
   - Used for: Mic permission errors, connection failures
   - Has browser-specific instructions (Chrome/Firefox/Safari)

2. **`ErrorToast.tsx`** - Toast notifications for non-critical events
   - Props: `isVisible`, `message`, `type`, `onClose`
   - Auto-dismisses after 5 seconds
   - Slide-down animation

3. **`ErrorBanner.tsx`** - Persistent connection status banner
   - Props: `isVisible`, `message`, `type`
   - Used for: "Reconnecting...", "Disconnected"
   - Appears at top of page

4. **`FiltersMenu.tsx`** - Slide-out filters panel
   - Props: `isOpen`, `onClose`, `onApplyFilters`, `currentFilters`
   - Contains: Interests input, country selectors
   - Slides from left with backdrop

5. **`PhoneVerification.tsx`** - Phone verification modal
   - Props: `onVerificationSuccess`
   - Two-step flow: Phone input → Code verification
   - 60-second resend timer
   - **Note:** Currently bypassed via feature flag

### Visual/Layout Sections in page.tsx (Lines 303-500+)

**Safe to modify:**
- `getCallButtonClass()` (Lines 303-319) - Button styling logic
- `getCallButtonText()` (Lines 284-298) - Button text based on state
- Return JSX (Lines 321-500+):
  - Header layout (Lines 340-366)
  - Logo (Lines 372-374)
  - Call button container (Lines 377-400)
  - Mute button (Lines 402-424)
  - Auto-call checkbox (Lines 426-435)
  - Footer buttons (Lines 437-465)
  - Instruction text (Lines 468-470)

**Styling classes are Tailwind - modify freely:**
- Background colors, spacing, fonts, shadows, hover effects, animations
- Current color scheme: Green primary (#10B981), gray backgrounds

### Styling Files
- **`src/app/globals.css`** - Global styles and animations
  - Custom animations: `@keyframes radiating` for call button
  - Toast slide animation
  - Safe to add custom CSS here

- **`tailwind.config.ts`** (root directory) - Tailwind configuration
  - Can extend colors, add custom utilities
  - Currently using Tailwind v4

- **`next.config.js`** - Next.js config
  - ⚠️ DO NOT modify - disables linting for deployment

---

## 4. Current Functionality

### User Flows That Work

**1. App Launch:**
- Phone verification bypassed (auto-creates test session)
- Connects to Socket.io server
- Displays online user count

**2. Call Flow:**
- Click green call button → "Searching..." state (animated pulse)
- Server matches with another waiting user
- WebRTC peer connection establishes
- Both users connected → Button turns red "End Call"
- Either user can hang up → Auto-call triggers (if enabled)

**3. No Users Available:**
- After 30 seconds searching → "No users available" message
- Shows "Try Again" button
- Can cancel search anytime

**4. Error Handling:**
- Mic permission denied → Modal with browser-specific instructions
- Connection drops → Toast notification
- Socket disconnects → "Reconnecting..." banner
- WebRTC fails → Modal with troubleshooting tips

**5. Filters:**
- Click "Filters" button → Slide-out panel from left
- Add interests (text tags)
- Select preferred/non-preferred countries (up to 3 each)
- Click "Apply" → Filters used in next matching

**6. Auto-Call:**
- Enable checkbox → Automatically searches for next call after hangup
- 2-second delay between calls
- Maintains filter preferences

### Existing Components

**Buttons:**
- Main call button (green → red state changes)
- Mute button (microphone icon with slash when muted)
- Filters button (header)
- Report button (currently placeholder - no functionality)
- Call History button (placeholder - no functionality)

**Modals:**
- Phone verification (2-step: phone → code)
- Error modals (mic permission, connection errors)

**Notifications:**
- Toast messages (call disconnected, errors)
- Connection banner (reconnecting, disconnected)

**Panels:**
- Filters slide-out menu

### Current UI/UX State

**Layout:**
- Clean, centered single-page design
- White header with online count and filters button
- Light gray background
- Centered content: Logo → Call Button → Controls → Footer buttons

**Color Scheme:**
- Primary: Green (#10B981 / green-500)
- Danger: Red (#EF4444 / red-500)
- Neutral: Gray shades for backgrounds and text
- Status indicators: Green dot for "Online"

**Typography:**
- System fonts (default Next.js)
- Weights: medium (500), semibold (600), bold (700)
- Sizes: Small (text-sm), base, large (text-lg, text-xl)

**Animations:**
- Call button: Pulsing when searching, radiating glow when idle
- Toast: Slide down on appear
- Filters: Slide from left
- Hover: Scale and color transitions

**Spacing:**
- Generous padding (p-4, p-8)
- Vertical spacing: space-y-8, space-y-4
- Rounded corners: rounded-lg, rounded-full

---

## 5. Tech Stack

### Core Framework
- **Next.js:** 15.5.4 (App Router)
- **React:** 19.1.0
- **TypeScript:** 5.x (strict mode)
- **Node.js:** 22.19.0

### Key Dependencies
- **WebRTC:** simple-peer ^9.11.1
- **Socket.io:** socket.io-client ^4.8.1
- **Database:** @supabase/supabase-js ^2.x
- **HTTP:** axios ^1.12.2
- **Phone:** libphonenumber-js ^1.12.23
- **SMS:** Telnyx API (via HTTP)

### Styling
- **Tailwind CSS:** v4
- **Approach:** Utility-first with inline classes
- **Custom CSS:** Minimal (only for animations in globals.css)
- **Icons:** SVG inline (no icon library)

### Build Tools
- **Turbopack:** Next.js built-in bundler
- **ESLint:** Disabled for deployment (ignoreDuringBuilds: true)
- **TypeScript:** Type errors ignored for deployment

### Deployment
- **Frontend:** Vercel (auto-deploy on git push)
- **Backend:** Railway (Node.js, auto-deploy on git push)
- **Database:** Supabase (managed PostgreSQL)

---

## 6. File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-code/route.ts       # SMS verification
│   │   │   └── verify-code/route.ts     # Code validation
│   │   └── session/
│   │       └── status/route.ts          # Session check
│   ├── globals.css                      # ✅ Safe to modify
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # ⚠️ Main app (functional + visual)
├── components/                          # ✅ All safe to modify
│   ├── ErrorBanner.tsx
│   ├── ErrorModal.tsx
│   ├── ErrorToast.tsx
│   ├── FiltersMenu.tsx
│   └── PhoneVerification.tsx
└── lib/
    ├── countries.ts                     # Country list data
    ├── socket-server.js                 # ⚠️ DO NOT MODIFY (backend)
    ├── supabase/
    │   └── client.ts                    # Database client
    └── webrtc/                          # ⚠️ DO NOT MODIFY
        ├── manager.ts                   # WebRTC manager
        └── socket-client.ts             # Socket.io client
```

---

## 7. UI/UX Improvement Guidelines

### What You Can Change Freely

**Visual Design:**
- Colors, fonts, spacing, sizing
- Animations and transitions
- Layout structure (header, main, footer positions)
- Component styling (borders, shadows, hover effects)
- Icons and graphics

**Component Enhancement:**
- Add new UI components (cards, tooltips, loaders, etc.)
- Improve error messages and user feedback
- Add visual indicators for states
- Enhance accessibility (ARIA labels, keyboard nav)

**User Experience:**
- Loading states and skeleton screens
- Smooth transitions between states
- Better visual feedback for actions
- Improved empty states
- Onboarding flows

### What You Cannot Change

**State Logic:**
- Don't modify useState variables related to calls, connections, mute
- Don't change useEffect hooks that handle WebRTC or Socket.io
- Don't alter handler functions (handleCallClick, handleEndCall, etc.)

**Core Functionality:**
- WebRTC connection establishment
- Socket.io signaling
- Matching algorithm (server-side)
- Audio stream management

### Testing Your Changes

**Local Development:**
```bash
# Terminal 1: Start Socket.io server
node src/lib/socket-server.js

# Terminal 2: Start Next.js dev server
npm run dev
```

**Browser Testing:**
- Open http://localhost:3000 in two tabs
- Test call flow between tabs
- Check all browsers: Chrome, Firefox, Safari

**Production Testing:**
- Changes auto-deploy to Vercel on git push
- Test at https://call-app-1.vercel.app

---

## 8. Important Notes

**Phone Verification:**
- Currently bypassed via `NEXT_PUBLIC_BYPASS_PHONE_VERIFICATION=true`
- Telnyx number (+6498734038) pending approval (24-48 hours)
- Must re-enable before public launch

**Known Limitations:**
- Single Socket.io server instance (no horizontal scaling yet)
- In-memory queue (lost on server restart)
- No call history UI (backend ready, frontend TODO)
- No report system UI (backend ready, frontend TODO)

**Browser Compatibility:**
- ✅ Chrome (tested, working)
- ✅ Firefox (tested, working)
- ✅ Safari (tested, working - fixed Sept 30)
- ✅ Mobile browsers (should work, needs testing)

**Performance:**
- Current capacity: ~100 concurrent users on Railway free tier
- Database: Supabase free tier (500MB, 2GB bandwidth)
- Frontend: Vercel Hobby (100GB bandwidth)

---

## 9. Quick Reference

**Start Local Development:**
```bash
cd "/path/to/call_app_1"
node src/lib/socket-server.js &  # Terminal 1
npm run dev                      # Terminal 2
```

**Check Git Status:**
```bash
git status
git log --oneline -5
```

**Deploy Changes:**
```bash
git add .
git commit -m "ui: your changes here"
git push  # Auto-deploys to both platforms
```

**View Production Logs:**
- Vercel: https://vercel.com/dashboard
- Railway: https://railway.app/dashboard

---

**End of Summary**