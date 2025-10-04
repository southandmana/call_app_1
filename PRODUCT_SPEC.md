# Product Specification: Voice-First Connection Platform

**App Name:** CQPDUK (TBD: Define acronym meaning)
**Version:** 1.0
**Last Updated:** October 4, 2025
**Document Owner:** Product Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Vision & Mission](#vision--mission)
3. [Target Audience](#target-audience)
4. [Core Value Proposition](#core-value-proposition)
5. [Feature Specifications](#feature-specifications)
6. [User Flows](#user-flows)
7. [Safety & Moderation](#safety--moderation)
8. [Monetization Strategy](#monetization-strategy)
9. [Technical Requirements](#technical-requirements)
10. [Open Questions & Decisions](#open-questions--decisions)

---

## Executive Summary

CQPDUK is a voice-first dating and friendship platform that facilitates authentic human connections through anonymous voice conversations. Unlike traditional dating apps that rely on profile browsing and swiping, we prioritize emotional compatibility and genuine conversation over physical appearance.

**Key Differentiators:**
- Voice-only initial connections (no photos/profiles first)
- 10-minute time-limited calls create urgency and focus
- AI-powered compatibility matching (Matcher AI)
- Real-world meetup coordination with event discovery
- Multiple trust/scoring systems for safety

---

## Vision & Mission

### Vision
Create the most effective app for building genuine human connections in a digital world.

### Mission
Enable people to form authentic relationships based on personality, values, and emotional compatibility rather than superficial profile browsing.

### Problem Statement
Current dating apps fail at fostering authentic relationships because:
1. **Appearance bias** - Swiping culture prioritizes looks over personality
2. **Shallow interactions** - Text-based chat doesn't reveal communication style
3. **Low engagement** - Endless browsing without meaningful connections
4. **Misaligned expectations** - Profiles don't match reality

### Our Solution
Voice-first interactions create natural, real-life-like conversations that build emotional connections before visual judgment.

---

## Target Audience

### Primary Audience
**Young adults (22-35) seeking authentic connections**
- Dating-focused initially (easier to market, higher urgency)
- Friendship/networking features available but secondary

### User Personas

#### 1. **Sarah, 26 - Serial Swiper**
- **Problem:** Tired of superficial matches on Tinder/Bumble
- **Goal:** Meet someone who genuinely vibes with her personality
- **Pain Point:** Conversations fizzle after exchanging photos
- **Our Solution:** Voice calls reveal chemistry immediately

#### 2. **Marcus, 31 - Busy Professional**
- **Problem:** No time for endless messaging
- **Goal:** Efficiently find compatible partners
- **Pain Point:** Wastes time on dates with zero chemistry
- **Our Solution:** 10-minute calls filter compatibility fast

#### 3. **Emily, 28 - Relocated to New City**
- **Problem:** Needs friends in new location
- **Goal:** Build local social circle
- **Pain Point:** Meetup.com events feel forced/awkward
- **Our Solution:** Voice-first friendships + local events

---

## Core Value Proposition

### For Users
**"Find real connections through voice, meet in person through shared interests"**

**Benefits:**
1. **Authentic connections** - No catfishing, no misleading profiles
2. **Time-efficient** - 10-minute calls > hours of messaging
3. **Safety-first** - Ratings, verification, panic buttons
4. **Local community** - Events map connects you with nearby users

### Competitive Advantages

| Feature | Traditional Dating Apps | CQPDUK |
|---------|------------------------|--------|
| **First Interaction** | Text messaging | Voice calls |
| **Profile Focus** | Photos + bio | Voice + conversation |
| **Matching** | Swipe algorithm | AI compatibility + filters |
| **In-Person Meetups** | Self-organized | Platform-facilitated with safety |
| **Trust System** | Basic verification | Multi-layered (call ratings, meetup reliability, host scores) |
| **Connection Speed** | Days of messaging | 10-minute calls |

---

## Feature Specifications

### 1. **Anonymous Voice Calling** (Core Feature)

#### 1.1 Random Call Matching
**Status:** ✅ Implemented

**Description:**
Users press a "Call" button to be matched with a random stranger for a voice-only conversation.

**Specifications:**
- **Duration:** 10 minutes per call (free tier)
- **Audio quality:** 48kHz, echo cancellation, noise suppression
- **Connection:** WebRTC peer-to-peer
- **Anonymity:** No personal info shared until users choose to connect

**User Controls:**
- Mute/unmute microphone
- End call
- Skip to next person (with confirmation)
- Report/block user

**Technical Implementation:**
- SimplePeer for WebRTC
- Socket.IO for signaling
- STUN servers: Google, Twilio

---

#### 1.2 Call Filters
**Status:** ⚠️ Partially Implemented (interests + countries)

**Free Filters:**
- **Preferred Countries:** Select countries you want to match with
- **Excluded Countries:** Countries to avoid
- **Interests:** Select from predefined list (or allow custom - TBD)

**Paid Filters (Premium):**
- **Gender Preference:** Male, Female, Non-binary
- (Additional filters TBD based on user feedback)

**Filter Matching Logic:**

```
Priority Order:
1. Hard Filters (never relax): Gender (paid), Excluded countries
2. Soft Filters (relax if no matches): Preferred countries, Interests

Process:
1. Search for exact match (all filters)
2. Wait 30 seconds
3. If no match: Relax interests (keep geography)
4. Wait 30 seconds
5. If no match: Relax to any country (keep gender if paid)
6. Wait 30 seconds
7. If no match: Show "No users available" state

User Notification: "No matches found with all filters. Expanding search..."
```

**Open Question:** Should users be able to type custom interests, or only select from predefined list?
- **Pros of custom:** More specific matching
- **Cons of custom:** Abuse potential, harder to moderate, difficult to match

**Decision:** Start with predefined list (50-100 interests), add custom interests in Phase 2 after moderation system proven.

---

#### 1.3 Auto-Call Mode
**Status:** ✅ Implemented

**Description:**
After a call ends, automatically search for the next caller (no need to press "Call" again).

**Specifications:**
- Toggle on/off in Account Menu
- 2-second delay between calls (prevent spam)
- Respects all active filters
- Can be canceled during search

**Use Case:** Power users who want continuous conversations

---

### 2. **Post-Call Rating & Friend System**

#### 2.1 Post-Call Rating
**Status:** ❌ Not Implemented

**Description:**
After each call, users rate their experience (influences both users' scores).

**Rating UI:**
```
How was your call with [Anonymous User]?

[⭐] [⭐⭐] [⭐⭐⭐] [⭐⭐⭐⭐] [⭐⭐⭐⭐⭐]

Optional: Why this rating?
[ ] Great conversation
[ ] Rude/inappropriate
[ ] No chemistry
[ ] Technical issues

[Submit Rating] [Add as Friend]
```

**Rating Impact:**
- Both users' Overall Rating Score updated
- Low ratings (<2 stars) trigger review
- Consistent low ratings = temporary suspension/ban

**Anti-Manipulation Measures:**
- Mutual rating requirement (both must rate for scores to count)
- Weight by account age (new accounts have less impact)
- Flag outliers (user consistently 1-stars everyone)

---

#### 2.2 Friend System
**Status:** ❌ Not Implemented

**Description:**
Users can add each other as friends after a call, enabling direct communication.

**Friend Request Flow:**
```
1. User A clicks "Add as Friend" after call
2. User B receives notification: "[User A] wants to be friends!"
3. User B accepts or declines
4. If accepted: Both users added to each other's friend list
5. Profiles now visible to each other (previously anonymous)
```

**Friend List Display:**
- Grid/list of friend cards
- Each card shows:
  - Profile photo (if uploaded, else avatar)
  - Name
  - Last active
  - Compatibility score (if Matcher AI used)

**Friend Actions:**
- **Call:** Direct 1-on-1 call (no time limit)
- **Message:** Open chat window
- **Send Meetup Request**
- **View Profile**
- **Remove Friend**

**Open Question:** Should friends be mutual (both agree) or one-way following?
**Decision:** Mutual friends only (prevents unwanted contact)

---

#### 2.3 Direct Messaging (Friends Only)
**Status:** ❌ Not Implemented

**Description:**
Text-based chat for friends (not available with strangers).

**Specifications:**
- Real-time messaging (Socket.IO)
- Message history stored
- Read receipts
- Typing indicators
- Link/image sharing (moderated)

**Safety Features:**
- OpenAI Moderation API scans all messages
- Flagged messages auto-reported
- Block feature (ends friendship, deletes messages)

**Technical Stack:**
- Socket.IO for real-time delivery
- Supabase for message storage
- OpenAI Moderation for content filtering

---

### 3. **Events System**

#### 3.1 Event Discovery Map
**Status:** ❌ Not Implemented

**Description:**
Interactive map showing user-created events (meetups, hangouts, activities).

**Map Views:**
- **Local Events:** Events near user's location (default 25km radius)
- **Global Events:** Events worldwide (for online friends)

**Additional Filters:**
- **Friends' Events:** Only events created by friends
- **Other Users' Events:** Events created by anyone

**Event Markers:**
- Cluster nearby events
- Color-coded by category (social, sports, dining, etc.)
- Click to expand event details

**Technologies:**
- Mapbox for map rendering
- Google Places API for venue validation

---

#### 3.2 Event Creation
**Status:** ❌ Not Implemented

**Description:**
Users can create public events and invite others.

**Event Creation Form:**
```
Create Event

Title: [                    ]
Category: [Dropdown: Social, Sports, Dining, Music, etc.]
Description: [Textarea]

Location: [Address field with autocomplete]
→ Map preview (ensure it's a public place)

Date: [Date picker]
Start Time: [Time picker]
End Time: [Time picker]

Capacity (optional): [Number] attendees max
Requirements (optional): [e.g., "18+", "Bring a frisbee"]

[Create Event] [Cancel]
```

**Venue Validation:**
- Must be a public place (not residential address)
- Google Places API validates location type
- If residential detected: "Please choose a public venue"

**Restrictions:**
- Verified users only (phone + ID verification)
- Max 5 active events per user
- Events auto-delete 24 hours after end time

---

#### 3.3 Event Attendance
**Status:** ❌ Not Implemented

**Description:**
Users can RSVP to events and check in when they arrive.

**RSVP Flow:**
```
1. User clicks event marker on map
2. Event detail modal opens
3. User clicks "Attend Event"
4. Confirmation: "You're going to [Event Name]!"
5. Event added to user's "My Events" list
```

**Check-In System:**
- GPS-based check-in (must be within 100m of venue)
- Check-in window: 30 min before → 30 min after start time
- Push notification: "Don't forget to check in to [Event]!"

**Check-Out (for reliability tracking):**
- Auto check-out 30 min after event end time
- Manual check-out option

**No-Show Penalty:**
- If user RSVPs but doesn't check in → impacts Meetup Reliability Score
- 3 no-shows = temporary event restriction

---

#### 3.4 Host Rating System
**Status:** ❌ Not Implemented

**Description:**
Attendees rate event hosts after events end (build trust for hosting).

**Rating Flow:**
```
1. Event ends (reaches end time)
2. All attendees receive notification:
   "How was [Event Name] hosted by [Host]?"
3. Attendees rate host (1-5 stars)
4. Optional: Leave review comment
```

**Host Score Display:**
- Visible on all events they create
- Tier system:
  - New Host (< 3 events)
  - Good Host (3+ events, 4+ avg rating)
  - Trusted Host (10+ events, 4.5+ avg rating)
  - Star Host (50+ events, 4.8+ avg rating)

**Benefits of Higher Tier:**
- Higher placement in event search
- Can create more events (Star Hosts: 10 max)
- Trust badge on profile

---

### 4. **Meetup Requests (Friend-to-Friend)**

#### 4.1 Direct Meetup Requests
**Status:** ❌ Not Implemented

**Description:**
Friends can send meetup requests to each other (separate from public events).

**Meetup Request Flow:**
```
1. User A clicks friend's card → "Send Meetup Request"
2. Map opens showing nearby venues/events
3. User A selects:
   - Location (address or event)
   - Date
   - Time
4. Optional: Add message ("Want to grab coffee?")
5. Request sent to User B
6. User B receives notification with all details
7. User B accepts or declines
   - If accepts: Both users receive confirmation
   - If declines: User A notified (no penalty)
```

**For International Meetups:**
- **Flight Suggestions:** Show cheapest flights via Skyscanner API
- **Disclaimer:** "Prices are estimates. We don't book flights. Confirm plans before booking."

---

#### 4.2 Meetup Reliability Score
**Status:** ❌ Not Implemented

**Description:**
Separate score tracking whether users actually show up to accepted meetups.

**How It Works:**
```
1. Both users accept meetup
2. At meetup time, app prompts: "Did [Friend] show up?"
3. Both users confirm or report no-show
4. If both confirm: Reliability score increases
5. If one reports no-show: Other user's score decreases
```

**Score Tiers:**
- **New:** < 5 meetups
- **Reliable:** 5+ meetups, 90%+ show rate
- **Very Reliable:** 20+ meetups, 95%+ show rate

**No-Show Penalty:**
- 1st no-show: Warning
- 2nd no-show: 7-day meetup restriction
- 3rd no-show: 30-day restriction
- Chronic no-shows: Meetup feature disabled

**Appeals Process:**
- Users can dispute no-show reports
- Provide evidence (screenshot of messages, etc.)
- Manual review by moderation team

---

### 5. **Matcher AI** (Paid Feature)

#### 5.1 Compatibility Analysis
**Status:** ❌ Not Implemented (Requires payment system first)

**Description:**
Voice-based AI interview that collects user info and finds compatible matches.

**User Experience:**
```
1. User opens "Matcher" tab
2. Clicks "Start Matcher AI"
3. AI voice greeting: "Hi! I'm your Matcher AI. I'll ask you some questions to find your perfect matches. Ready?"
4. User responds via voice (conversation flows naturally)
5. AI asks follow-up questions if info insufficient
6. After 10-15 min interview, AI says: "All set! I'll find matches for you."
7. AI runs background matching (overnight batch processing)
8. Next day: "We found 5 great matches for you!"
```

**Questions Template (AI adapts based on responses):**
- Personality: Introvert/extrovert, communication style, humor
- Values: Family, career, lifestyle, spirituality/beliefs
- Interests: Hobbies, music, travel, food
- Relationship Goals: Casual, serious, friendship, romance
- Deal-breakers: What's non-negotiable?

**AI Technology:**
- OpenAI Whisper for voice transcription
- Claude Sonnet 4.5 for analysis and matching
- Prompt caching for cost efficiency (~$0.001/match)

---

#### 5.2 Match Suggestions
**Status:** ❌ Not Implemented

**Description:**
AI-curated matches delivered daily/weekly.

**Match Presentation:**
```
Your Top Matches This Week

[User Avatar]
Name: Sarah, 26
Compatibility: "Great match!"
Connection Points:
- Both introverted bookworms
- Shared love of indie music
- Similar career ambitions

Conversation Starters:
- "Ask about her favorite book from 2024"
- "Discuss favorite local coffee shops"

[Start Call] [View Full Profile] [Pass]
```

**Match Delivery:**
- Free users: 5 matches/week
- Premium users: Unlimited + daily suggestions

**Match Expiration:**
- Matches expire after 7 days if not contacted
- Encourages timely action

---

### 6. **Avatar System**

#### 6.1 Avatar Selection
**Status:** ❌ Not Implemented

**Description:**
Users choose from predefined avatar styles (anonymous representation).

**Avatar Library:**
- DiceBear API (30+ styles)
- Categories: Cartoon, Geometric, Animals, Abstract
- Customization: Color palette selection

**Default Assignment:**
- If user doesn't choose, random avatar assigned
- Avatar visible during calls (replaces profile photo)

---

#### 6.2 Voice-Animated Avatars
**Status:** ❌ Not Implemented

**Description:**
Avatar's mouth moves when user speaks (creates illusion of talking).

**Technical Implementation:**
- WebRTC audio stream analyzed in real-time
- Web Audio API detects voice activity
- CSS animation triggers when voice detected (threshold: 20dB)

**Animation:**
```css
@keyframes mouth-open {
  0% { transform: scaleY(1); }
  100% { transform: scaleY(1.1); }
}

.avatar.talking {
  animation: mouth-open 0.2s infinite alternate;
}
```

**Fallback:**
- If audio analysis fails, show static avatar
- No impact on call functionality

---

### 7. **Safety & Moderation**

#### 7.1 Age Verification (18+ Gate)
**Status:** ⚠️ Partial (Phone verification only - insufficient)

**Required:**
- Government ID verification (Stripe Identity)
- Extract date of birth
- Verify user is 18+

**Current Status:**
- Phone verification implemented
- Can be bypassed with feature flag (development only)

**Action Needed:**
- Integrate Stripe Identity
- Make ID verification mandatory before first call
- Remove bypass feature flag for production

---

#### 7.2 Real-Time Call Moderation
**Status:** ❌ Not Implemented

**Description:**
AI monitors calls for abuse, harassment, threats.

**Process:**
```
1. Call audio streams through Deepgram (transcription)
2. Transcribed text → OpenAI Moderation API
3. If flagged:
   - Severity LOW: Log incident
   - Severity MEDIUM: Auto-warning to user
   - Severity HIGH: Immediately end call + flag account
4. Repeat offenders → escalating penalties
```

**Categories Detected:**
- Sexual harassment
- Hate speech
- Threats/violence
- Self-harm
- Doxxing attempts (sharing personal info)

**User Privacy:**
- Transcriptions stored for 30 days (flagged incidents only)
- Auto-deleted after review
- GDPR/CCPA compliant

---

#### 7.3 Reporting System
**Status:** ❌ Not Implemented (Marked TODO in code)

**Description:**
Users can report abuse during or after calls.

**Report Flow:**
```
During Call:
1. User clicks "Report" button
2. Quick select: [Harassment, Inappropriate, Spam, Other]
3. Optional: Add details
4. Submit → Call auto-ends (if during call)

After Call:
1. Rating screen includes "Report User" option
2. Same flow as above
```

**Moderation Queue:**
- All reports go to review queue
- High-severity auto-flagged for immediate review
- Low-severity batched for daily review

**Review Process:**
1. Check if call was transcribed (AI-moderated)
2. Review transcription + user report
3. Decision: Warning, Temporary Ban, Permanent Ban, or No Action
4. User notified of decision (reporters remain anonymous)

**Appeal Process:**
- Banned users can submit appeal
- Include evidence (screenshots, explanation)
- Manual review within 48 hours

---

#### 7.4 Block Functionality
**Status:** ❌ Not Implemented (Marked TODO in code)

**Description:**
Users can block others to prevent future interactions.

**Block Effects:**
- Blocked user cannot be matched in random calls
- Cannot send friend requests
- If already friends: Friendship removed, messages deleted
- Block is one-way (blocked user doesn't know)

**Unblock:**
- Users can unblock from "Blocked Users" list
- Unblock takes effect immediately

---

#### 7.5 Emergency Panic Button
**Status:** ❌ Not Implemented

**Description:**
One-tap SOS button during in-person meetups.

**How It Works:**
```
1. User taps panic button
2. App captures GPS location
3. Sends SMS to emergency contacts:
   "🚨 EMERGENCY: [User] triggered panic button at [Address].
    Location: [Google Maps link]"
4. Calls primary contact via Twilio
5. Logs incident for platform review
```

**Setup Required:**
- Users add 3-5 emergency contacts in settings
- Verify contact phone numbers
- Test button (sends "This is a test" message)

**Cost per Use:** ~$0.05 (SMS + call)

---

#### 7.6 In-App Safety Guidelines
**Status:** ❌ Not Implemented

**Description:**
Educational content about safe meetups.

**Content:**
- "Meeting in Person? Stay Safe" guide
- Tips:
  - Meet in public places
  - Tell a friend where you're going
  - Don't share home address early
  - Trust your instincts
- Link to panic button setup

**Display:**
- Before first meetup request sent
- In meetup confirmation screen
- Accessible in Help Center

---

### 8. **User Scoring Systems**

#### 8.1 Overall Rating Score
**Status:** ❌ Not Implemented

**Description:**
Aggregate score based on post-call ratings.

**Calculation:**
```
Score = Weighted Average of Call Ratings

Weights:
- Recent ratings (last 30 days): 60%
- Historical ratings (30-90 days): 30%
- Older ratings (90+ days): 10%

New users: No score until 5+ ratings
```

**Display:**
- Not shown as exact number (prevents gaming)
- Shown as tier:
  - New (< 5 ratings)
  - Good Standing (3.5+ avg)
  - Trusted (4.0+ avg, 20+ calls)
  - Star Member (4.5+ avg, 100+ calls)

**Low Score Consequences:**
- < 3.0 avg: Warning notification
- < 2.5 avg: Temporary suspension (review required)
- < 2.0 avg: Permanent ban

---

#### 8.2 Meetup Reliability Score
**Status:** ❌ Not Implemented

(See section 4.2 - Meetup Reliability Score)

---

#### 8.3 Host Score
**Status:** ❌ Not Implemented

(See section 3.4 - Host Rating System)

---

### 9. **Monetization Features**

#### 9.1 Free Tier

**Included:**
- Unlimited random calls (10 min each)
- Country filters
- Interest filters
- Friend system (unlimited friends)
- Direct calling with friends (no time limit)
- Messaging friends
- Event discovery
- Event attendance
- Basic profile

---

#### 9.2 Premium Tier ($9.99/month or $79.99/year)

**Exclusive Features:**
1. **Unlimited Call Duration** (with strangers)
   - No 10-minute limit on random calls
2. **Gender Filter** (choose preferred gender)
3. **Priority Matching** (matched faster in queue)
4. **Profile Boost** (appear first in Matcher AI suggestions)
5. **Advanced Stats** (call history, match success rate)
6. **Ad-free experience** (if we add ads later)

---

#### 9.3 Matcher AI Add-On ($14.99/month)

**Why Separate Pricing?**
- High AI processing cost (~$0.001/match with caching, but adds up)
- Not everyone wants AI matching
- Can be bundled with Premium for $19.99/month

**Includes:**
- AI compatibility interview
- Daily match suggestions
- Unlimited AI-curated matches
- Re-run analysis monthly (track preference changes)

---

#### 9.4 Pricing Tiers Summary

| Feature | Free | Premium | Premium + AI |
|---------|------|---------|--------------|
| **Price** | $0 | $9.99/mo | $19.99/mo |
| Random calls (10 min) | ✅ | ✅ | ✅ |
| Unlimited call duration | ❌ | ✅ | ✅ |
| Country/interest filters | ✅ | ✅ | ✅ |
| Gender filter | ❌ | ✅ | ✅ |
| Friend system | ✅ | ✅ | ✅ |
| Events | ✅ | ✅ | ✅ |
| Matcher AI | ❌ | ❌ | ✅ |
| Priority matching | ❌ | ✅ | ✅ |

---

#### 9.5 Revenue Projections (Year 1)

**Assumptions:**
- 10,000 registered users
- 15% conversion to Premium ($9.99/mo)
- 5% purchase Matcher AI add-on ($14.99/mo)

**Monthly Recurring Revenue (MRR):**
```
Premium: 1,500 users × $9.99 = $14,985
Matcher AI: 500 users × $14.99 = $7,495

Total MRR: $22,480
Annual Revenue: $269,760
```

**Costs (at 10,000 users):**
- Platform costs: $2,660/month ($31,920/year)
- **Profit Margin:** 88%

---

### 10. **Branding & Design**

#### 10.1 Mascot
**Status:** ❌ Not Designed

**Purpose:**
- Strengthen brand identity (like Discord's Wumpus, GitHub's Octocat)
- Use in marketing, app store assets, loading screens

**Design Direction:**
- Friendly, approachable character
- Represents connection/communication (e.g., character with headphones)
- Avoid: Overtly romantic (limits friendship use case)

**Action:** Hire illustrator on Fibre/99designs ($200-500)

---

#### 10.2 Design Philosophy
**Current:** Flat design, minimalist

**Evolution:**
- Gradually add subtle stylistic elements
- Micro-interactions (button animations, sound effects)
- Playful but professional tone

**Reference Apps:**
- Discord (friendly, gaming-inspired)
- Bumble (approachable, modern)
- Clubhouse (clean, voice-focused)

---

#### 10.3 App Name & Tagline
**Current:** CQPDUK

**Open Questions:**
- What does CQPDUK stand for?
- Is it memorable/pronounceable?
- Alternative names to test?

**Tagline Options:**
1. "Find real connections through voice"
2. "Voice-first dating for authentic connections"
3. "Skip the swipe. Start the conversation."

**Action:** User testing with 3-5 taglines, pick winner

---

## User Flows

### Flow 1: New User Onboarding

```
1. Download app / Visit website
2. Sign up:
   - Google OAuth
   - Enter phone number
   - Verify SMS code
3. Age verification:
   - Upload government ID (Stripe Identity)
   - Wait 30 seconds for verification
   - ✅ Approved → Continue
4. Profile setup:
   - Choose avatar
   - Set display name
   - Select interests (min 3)
5. Onboarding tutorial:
   - "How random calls work"
   - "How to add friends"
   - "Safety tips"
6. → Main screen (ready to call)
```

---

### Flow 2: Random Call

```
1. User on main screen
2. Clicks "Call" button
3. System checks:
   - ✅ Mic permission granted?
   - ✅ Age verified?
   - ✅ Account in good standing?
4. State: "Searching for match..."
   - Apply filters (interests, countries)
   - Wait for available user
5. Match found!
   - State: "Connecting..."
   - WebRTC handshake
6. State: "Connected"
   - Timer starts (10 min for free users)
   - Avatars displayed
   - Voice activity indicators
7. Call ends:
   - Either user hangs up, OR
   - 10-min timer expires
8. Post-call rating:
   - Rate 1-5 stars
   - Optional: Add as friend
   - Optional: Report user
9. → Return to main screen
```

---

### Flow 3: Sending Meetup Request

```
1. User clicks friend's card
2. Clicks "Send Meetup Request"
3. Map opens
4. User selects:
   - Location (search address or click map)
   - Date (calendar picker)
   - Time (dropdown)
5. Optional: Add message
6. Click "Send Request"
7. Friend receives notification
8. Friend reviews:
   - See location on map
   - Check date/time
   - Read message
9. Friend accepts or declines
10. If accepted:
    - Both receive confirmation
    - Meetup added to calendar
    - Reminder 24 hours before
    - Reminder 1 hour before
11. At meetup time:
    - Both prompted: "Check in to confirm"
    - GPS verification (within 100m of location)
12. After meetup:
    - Both prompted: "Did [Friend] show up?"
    - Reliability score updated
```

---

### Flow 4: Creating an Event

```
1. User clicks "Events" tab
2. Map loads with nearby events
3. User clicks "Create Event" button
4. Fill out form:
   - Title
   - Category
   - Description
   - Location (validated as public place)
   - Date/Time
   - Capacity (optional)
5. Review event details
6. Click "Create Event"
7. Event submitted for approval:
   - Automated checks (public venue, no spam keywords)
   - If passes: Auto-approved
   - If flagged: Manual review (within 1 hour)
8. Event published:
   - Appears on map
   - Notifications sent to nearby users (if opted in)
9. Attendees RSVP
10. Host receives updates:
    - "5 people are attending your event!"
11. Day of event:
    - Attendees check in
    - Host manages event
12. After event:
    - Attendees rate host
    - Host score updated
```

---

## Safety & Moderation

### Multi-Layered Safety Approach

#### Layer 1: Prevention
1. **Age verification** - 18+ only, government ID required
2. **Phone verification** - Reduces fake accounts
3. **Account limits** - Max 1 account per phone number
4. **Onboarding education** - Safety tips, community guidelines

#### Layer 2: Detection
1. **Real-time AI moderation** - Deepgram + OpenAI scan calls
2. **Text moderation** - OpenAI scans messages, event descriptions
3. **Behavioral analysis** - Flag suspicious patterns (mass reporting, frequent blocks)

#### Layer 3: Response
1. **Automated actions** - Auto-end calls for high-severity violations
2. **Moderation queue** - Human review of flagged content
3. **Escalating penalties** - Warning → Temporary ban → Permanent ban
4. **Appeals process** - Users can dispute bans

#### Layer 4: User Empowerment
1. **Report button** - One-tap reporting during/after calls
2. **Block functionality** - Prevent future interactions
3. **Panic button** - Emergency SOS for in-person meetups
4. **Safety guidelines** - In-app education

---

### Legal Requirements

#### Terms of Service (ToS)
**Must Include:**
- User age requirement (18+)
- Prohibited conduct (harassment, hate speech, etc.)
- Platform liability disclaimer (meetups at user's own risk)
- Recording prohibition (users cannot record calls)
- Data privacy policy (GDPR/CCPA compliance)
- Dispute resolution (arbitration clause)

**Action:** Hire lawyer to draft ToS ($500-2,000)

---

#### Privacy Policy
**Must Include:**
- What data we collect (voice transcriptions, location, etc.)
- How we use it (moderation, matching, analytics)
- Third-party sharing (Stripe, Deepgram, etc.)
- User rights (data deletion, access, portability)
- Cookie policy

**Action:** Use TermsFeed or hire lawyer ($300-1,000)

---

#### Liability Insurance
**Required Before Launch:**
- General Liability ($1M coverage)
- Cyber Liability ($1M coverage)
- Professional Liability ($1M coverage)

**Provider:** Hiscox ($2,500-6,000/year)

**Action:** Get quote before launching meetup features

---

## Technical Requirements

### Compatibility Matrix

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 15.5.4 |
| Runtime | React | 19.1.0 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS | 4 |
| Auth | NextAuth | 4.24.11 |
| Database | Supabase (PostgreSQL) | Latest |
| Real-time | Socket.IO | 4.8.1 |
| WebRTC | SimplePeer | 9.11.1 |

**All new features must be compatible with this stack.**

---

### Performance Requirements

#### Call Quality
- **Latency:** < 300ms (real-time)
- **Audio quality:** 48kHz, 16-bit
- **Packet loss tolerance:** < 5%

#### App Responsiveness
- **Time to first call:** < 30 seconds (from click to connected)
- **Page load time:** < 2 seconds
- **API response time:** < 500ms (p95)

#### Scalability
- **Concurrent calls:** 10,000+
- **Database queries:** < 100ms (p95)
- **WebSocket connections:** 50,000+

---

### Browser/Device Support

#### Web
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- **Not supported:** IE11, older mobile browsers

#### Mobile (Future)
- React Native app (iOS/Android)
- **Phase:** Post-MVP (after web validation)

---

## Open Questions & Decisions Needed

### High Priority (Blocking MVP)

1. **Custom vs Predefined Interests**
   - **Question:** Allow users to type custom interests, or only select from list?
   - **Recommendation:** Start with predefined list (50-100 options)
   - **Reason:** Easier to moderate, better matching
   - **Decision:** ⏳ Pending

2. **App Name & Branding**
   - **Question:** What does CQPDUK stand for? Is it the final name?
   - **Recommendation:** User testing with alternative names
   - **Action:** ⏳ Pending

3. **Friend System: Mutual or One-Way?**
   - **Question:** Do both users need to agree to be friends, or can one "follow" the other?
   - **Recommendation:** Mutual friends only (safer)
   - **Decision:** ✅ Mutual friends

4. **Call Recording Disclaimer**
   - **Question:** Do we show "Calls may be recorded for safety" warning?
   - **Recommendation:** Yes (legal protection + deters abuse)
   - **Decision:** ✅ Show disclaimer

---

### Medium Priority (Pre-Launch)

5. **Monetization: Pricing Validation**
   - **Question:** Are $9.99 (Premium) and $19.99 (AI) the right price points?
   - **Action:** Survey target users, A/B test pricing page
   - **Decision:** ⏳ Pending

6. **Events: Public vs Friends-Only**
   - **Question:** Should users be able to create private events (friends-only)?
   - **Recommendation:** Yes, add "Private Event" toggle (Phase 2)
   - **Decision:** ⏳ Pending

7. **Matcher AI: Interview Length**
   - **Question:** How long should AI interview be? (Currently 10-15 min)
   - **Recommendation:** Test with beta users, optimize
   - **Decision:** ⏳ Pending

---

### Low Priority (Post-MVP)

8. **International Flight Suggestions**
   - **Question:** Keep flight suggestion feature, or remove due to liability risk?
   - **Recommendation:** Keep as informational only (no booking), add strong disclaimers
   - **Decision:** ✅ Keep (informational)

9. **Avatar Customization**
   - **Question:** Allow users to upload profile photos, or keep avatar-only?
   - **Recommendation:** Avatar-only initially (maintains anonymity focus)
   - **Decision:** ✅ Avatar-only for MVP

10. **Text Chat with Strangers**
    - **Question:** Add text chat during voice calls?
    - **Recommendation:** No (defeats voice-first purpose)
    - **Decision:** ✅ No text chat with strangers

---

## Success Metrics

### North Star Metric
**Meaningful Connections Made** = Friend additions after calls

---

### Key Performance Indicators (KPIs)

#### Acquisition
- App downloads/signups per week
- Cost per acquisition (CPA)
- Referral rate

#### Activation
- % users who complete first call
- Time to first call (from signup)
- % users who verify ID

#### Engagement
- Daily Active Users (DAU)
- Average calls per user per week
- Average call rating (should be > 4.0)

#### Retention
- Day 1, Day 7, Day 30 retention
- Churn rate (monthly)
- Friend connections per user

#### Revenue
- Conversion to Premium (target: 15%)
- Conversion to Matcher AI (target: 5%)
- Monthly Recurring Revenue (MRR)
- Lifetime Value (LTV)

#### Safety
- % calls flagged by AI moderation
- User reports per 1,000 calls
- Moderation resolution time (target: < 24 hours)

---

### Success Criteria (6 Months Post-Launch)

- 10,000+ registered users
- 40%+ Day 7 retention
- 15%+ Premium conversion
- < 1% calls flagged for abuse
- 4.2+ average call rating

---

## Roadmap Summary

### Phase 1: MVP (Months 1-3)
- ✅ Random voice calling
- ✅ Basic filters (interests, countries)
- ⏳ Post-call rating
- ⏳ Friend system
- ⏳ ID verification (Stripe Identity)
- ⏳ Real-time moderation
- ⏳ Report/block functionality
- ⏳ Premium subscriptions

### Phase 2: Core Features (Months 4-6)
- Events system (creation, discovery, attendance)
- Meetup requests (friend-to-friend)
- Check-in system
- Host/meetup reliability scores
- Direct messaging (friends)
- Safety features (panic button, guidelines)

### Phase 3: Advanced Features (Months 7-9)
- Matcher AI (voice interview, compatibility)
- Gender filter (paid)
- Priority matching
- Flight suggestions
- Advanced analytics

### Phase 4: Polish & Scale (Months 10-12)
- Mobile apps (iOS/Android)
- Mascot branding
- Referral program
- Internationalization (multiple languages)
- Performance optimization

---

**Next Steps:**
1. Review this spec with stakeholders
2. Finalize open decisions (app name, pricing, etc.)
3. Move to IMPLEMENTATION_PLAN.md for technical breakdown

---

**Document Version:** 1.0
**Last Updated:** October 4, 2025
**Next Review:** After MVP launch
