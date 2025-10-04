# AI Workflow Guide: Executing Implementation Phases

**Last Updated:** October 4, 2025
**Purpose:** Step-by-step processes for working with AI to build features efficiently

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Starting a New Phase](#starting-a-new-phase)
3. [During Development](#during-development)
4. [Error Handling Workflow](#error-handling-workflow)
5. [Validation & Testing](#validation--testing)
6. [Best Practices](#best-practices)
7. [Common Pitfalls](#common-pitfalls)

---

## Core Principles

### 1. The AI Needs Context
- AI doesn't remember previous sessions
- Always reference the Implementation Plan
- Provide current state (what's done, what's not)

### 2. Be Specific
- Instead of: "Build the friend system"
- Use: "Work on Phase 3, Task 3.1: Implement Friend Requests"

### 3. Validate Frequently
- Don't assume AI's code works
- Test each feature before moving on
- Perform full codebase scans when errors occur

### 4. Update Documentation
- After each task, update IMPLEMENTATION_PLAN.md
- Check off completed items
- Log challenges encountered

---

## Starting a New Phase

### Step 1: Review the Phase Plan

**Before asking AI to start work:**

1. Open `IMPLEMENTATION_PLAN.md`
2. Review the entire phase (not just one task)
3. Understand dependencies between tasks
4. Check prerequisites are complete

**Example:**
```
Before starting Phase 3 (Friend System), confirm:
✅ Phase 2 complete (rating system exists)
✅ Database has users table
✅ WebRTC calling works
```

---

### Step 2: Set Context with AI

**Good Prompt Structure:**

```
I want to start [Phase Name, Task Number: Task Name].

Current state:
- [List what's already done related to this task]
- [Mention relevant files that exist]
- [Note any blockers or concerns]

Goal:
- [What should be accomplished]
- [Success criteria from Implementation Plan]

Please:
1. Scan the codebase to understand current implementation
2. Propose an approach
3. Ask clarifying questions if needed
```

**Example Prompt:**

```
I want to start Phase 3, Task 3.1: Implement Friend Requests.

Current state:
- Post-call rating system is complete (Phase 2, Task 2.1)
- User profiles exist (Phase 2, Task 2.2)
- Supabase is set up with users table
- Socket.IO is working for real-time features

Goal:
- Users can send friend requests after calls
- Both users must accept (mutual consent)
- Real-time notifications via Socket.IO

Please:
1. Scan /src/app/api to understand current API structure
2. Check Supabase schema (is there a friendships table?)
3. Propose database schema for friend_requests and friendships tables
4. Outline the implementation approach
5. Ask any clarifying questions
```

---

### Step 3: Confirm AI's Understanding

**Before AI starts coding, verify:**

- [ ] AI has scanned relevant files
- [ ] AI understands the existing architecture
- [ ] AI's proposed approach aligns with your tech stack
- [ ] AI identified any blockers or dependencies

**If AI's approach seems off:**
```
Before we proceed, I want to clarify:
- [Your concern or correction]
- [Preferred approach]
- [Reason for preference]

Does this change your proposed implementation?
```

---

## During Development

### Remind AI of Context (When Needed)

**When to remind:**
- After AI makes 3-4 file changes (context can drift)
- When AI suggests something inconsistent with your stack
- If AI seems confused about what's already done

**Reminder Template:**

```
Quick context reminder:
- We're working on [Phase X, Task X.X]
- Our stack is Next.js 15 + React 19 + TypeScript + Tailwind CSS 4
- We use Supabase for database, Socket.IO for real-time
- [Any other relevant constraints]

Continue with [next step].
```

---

### Request Codebase Scans (Strategically)

**When to request scans:**
1. **Before starting a new task** (understand current state)
2. **When encountering errors** (find root cause)
3. **After significant changes** (verify nothing broke)
4. **When AI suggests modifying existing code** (check if file still exists/matches AI's assumption)

**Scan Request Template:**

```
Before we proceed, please:
1. Scan /src/app/api to check [specific thing]
2. Read /src/lib/[specific file] to understand [specific logic]
3. Verify [assumption] is still true

Then continue with [next step].
```

**Example:**

```
Before we add the friend request notification, please:
1. Scan /src/components to see if Notifications.tsx already exists
2. Read /src/lib/webrtc/socket-client.ts to understand current Socket.IO implementation
3. Verify we're using Socket.IO version 4.8.1

Then propose how to integrate friend request notifications.
```

---

### Validate Each Step

**After AI completes a subtask:**

1. **Review the code** (don't blindly accept)
2. **Run the app** (test the feature)
3. **Check for errors** (terminal + browser console)

**If it works:**
```
Great! That works. Let's move to the next subtask: [describe next step].
```

**If it doesn't work:**
(See Error Handling Workflow below)

---

## Error Handling Workflow

**When something breaks, follow this process systematically:**

### Step 1: Gather Error Information

**Terminal Errors:**
```
There's an error in the terminal. Here's the full output:

[Paste entire error message, including stack trace]

Please analyze and propose a fix.
```

**Browser Console Errors:**
```
The browser console shows this error:

[Paste error message]

URL where error occurs: [paste URL]
Steps to reproduce: [describe what you did]

Please analyze and propose a fix.
```

**Runtime Errors (no error message):**
```
The feature isn't working as expected. Here's what happens:

Expected: [describe expected behavior]
Actual: [describe actual behavior]
Steps to reproduce:
1. [step 1]
2. [step 2]

No error messages appear.

Please:
1. Scan [relevant files] to identify the issue
2. Check browser console (I'll paste any errors)
3. Propose debugging steps
```

---

### Step 2: Request Full Codebase Scan (If Needed)

**When errors are unclear:**

```
I'm getting [describe error]. Before we debug, please:

1. Perform a full codebase scan to verify:
   - All required files exist
   - Imports are correct
   - No duplicate files or naming conflicts

2. Check the following files specifically:
   - [File 1]
   - [File 2]
   - [File 3]

3. Verify our environment:
   - Node modules installed correctly
   - .env.local has required variables
   - Database schema matches expectations

Then propose a fix based on what you find.
```

---

### Step 3: Community Research (For Persistent Issues)

**When AI's fixes don't work after 2-3 attempts:**

```
We've tried [list attempted fixes] but the error persists.

Please:
1. Research this error on Stack Overflow, GitHub issues, and official documentation
2. Find recent solutions (2024-2025) for our specific stack:
   - Next.js 15
   - React 19
   - [other relevant tech]
3. Propose a solution based on community best practices

Error: [paste error]
Our stack: [list versions]
```

---

### Step 4: Rollback Strategy (Last Resort)

**If nothing works:**

```
The error is blocking progress. Let's rollback this change.

Please:
1. Revert [specific file changes]
2. Restore to working state (before we started [Task X.X])
3. Propose an alternative approach for implementing [feature]

We'll try a different strategy.
```

---

## Validation & Testing

### After Completing a Task

**Before marking task as complete, validate:**

1. **Functional Testing**
   ```
   I've tested the feature. Here's what I found:

   ✅ Works: [list working scenarios]
   ❌ Doesn't work: [list broken scenarios]

   [If broken] Please fix [specific issue].
   [If all works] Great! Please update IMPLEMENTATION_PLAN.md:
   - Mark Task [X.X] as complete
   - Update phase progress percentage
   ```

2. **Edge Case Testing**
   ```
   The feature works for the happy path. Let's test edge cases:

   1. What happens if [edge case 1]?
   2. What if [edge case 2]?
   3. How does it handle [edge case 3]?

   Please add error handling for these scenarios if missing.
   ```

3. **Cross-Browser Testing** (For UI features)
   ```
   Tested in:
   - ✅ Chrome: Works
   - ✅ Firefox: Works
   - ❌ Safari: [describe issue]

   Please fix Safari issue.
   ```

4. **Mobile Responsiveness** (For UI features)
   ```
   Tested on mobile:
   - ✅ iPhone: Works
   - ❌ Android: [describe issue]

   Please fix mobile layout.
   ```

---

### Performance Validation

**For performance-critical features (calls, real-time updates):**

```
Please verify performance:

1. Time to [action]: Should be < [threshold]
2. Memory usage during [action]: Should stay under [threshold]
3. Network requests: Should be < [number] per action

Run performance tests and report findings.
```

---

### Security Validation

**For authentication, payments, or sensitive features:**

```
Please verify security:

1. Are API routes protected (authentication required)?
2. Is user input sanitized (SQL injection, XSS prevention)?
3. Are API keys/secrets stored in .env.local (not hardcoded)?
4. Is sensitive data encrypted (passwords, IDs)?

Scan [relevant files] and confirm security best practices are followed.
```

---

## Best Practices

### 1. One Task at a Time

**Don't:**
```
Build the entire friend system (Tasks 3.1-3.6).
```

**Do:**
```
Build Task 3.1 (Friend Requests), then we'll test it before moving to Task 3.2.
```

**Reason:** Easier to debug, isolate issues, and validate progress.

---

### 2. Incremental Development

**Don't:**
```
Build the full messaging system with all features at once.
```

**Do:**
```
Phase 1: Send/receive messages (basic)
Phase 2: Add typing indicators
Phase 3: Add read receipts
Phase 4: Add message moderation

Let's build Phase 1 first and test it.
```

**Reason:** Reduces complexity, allows for early testing, easier to pivot if needed.

---

### 3. Document Decisions

**When making a design decision:**

```
We decided to use [approach A] instead of [approach B] because:
- [Reason 1]
- [Reason 2]

Please proceed with approach A and add a comment in the code explaining this decision.
```

**Reason:** Future you (or AI) will understand why this approach was chosen.

---

### 4. Communicate Assumptions

**When AI makes an assumption:**

```
AI: "I'm assuming the user's location is stored in the users table. Is that correct?"

✅ Good response:
"Correct, it's in users.location (type: geography). Proceed."

OR

"Actually, location is stored in a separate user_locations table. Let me provide the schema: [paste schema]."
```

**Reason:** Prevents AI from building on incorrect assumptions.

---

### 5. Reference Existing Patterns

**When building similar features:**

```
We're building [new feature], which is similar to [existing feature].

Please:
1. Scan /src/[path to existing feature] to understand the pattern
2. Follow the same structure for consistency
3. Ask if any differences are needed for [new feature]
```

**Example:**

```
We're building the event rating system (Task 4.7), which is similar to the post-call rating system (Task 2.1).

Please:
1. Read /src/components/CallRatingModal.tsx
2. Follow the same UI pattern
3. Adapt it for events (rate host instead of call partner)
```

**Reason:** Maintains consistency, reuses tested patterns, faster development.

---

## Common Pitfalls

### Pitfall #1: Assuming AI Remembers

**❌ Wrong:**
```
"Continue where we left off."
```

**✅ Right:**
```
"We were working on Task 3.4 (Direct Messaging). We completed the messaging API. Now let's build the chat UI (as outlined in the Implementation Plan)."
```

**Why:** AI doesn't have memory across sessions. Always re-establish context.

---

### Pitfall #2: Vague Instructions

**❌ Wrong:**
```
"The friend system isn't working."
```

**✅ Right:**
```
"When I click 'Add Friend' after a call, nothing happens. Browser console shows: [paste error]. Please debug."
```

**Why:** Specific errors lead to specific solutions.

---

### Pitfall #3: Skipping Validation

**❌ Wrong:**
```
AI: "I've completed Tasks 3.1-3.3."
User: "Great! Move to Phase 4."
[Later: Everything is broken because Tasks 3.1-3.3 weren't tested]
```

**✅ Right:**
```
AI: "I've completed Tasks 3.1-3.3."
User: "Let me test each task before we move on. [Tests] Task 3.2 has a bug: [describe]. Please fix."
```

**Why:** Bugs compound. Fix early, fix often.

---

### Pitfall #4: Not Reading AI's Code

**❌ Wrong:**
```
[AI posts code]
User: "Looks good, apply it."
[Code has a critical security flaw]
```

**✅ Right:**
```
[AI posts code]
User: [Reviews code] "This looks good, but I noticed the API route isn't checking authentication. Please add auth check."
```

**Why:** AI makes mistakes. You're the final reviewer.

---

### Pitfall #5: Ignoring Errors

**❌ Wrong:**
```
[Console shows warning]
User: "It works, let's move on."
[Warning causes crash later]
```

**✅ Right:**
```
[Console shows warning]
User: "There's a warning in the console: [paste]. Should we fix this before moving on?"
```

**Why:** Warnings today are errors tomorrow.

---

## Workflow Cheat Sheet

### Starting a Task

```
1. Open IMPLEMENTATION_PLAN.md
2. Read the task description, dependencies, estimated time
3. Check success criteria

Prompt AI:
"Start [Phase X, Task X.X]. Current state: [what's done]. Goal: [what to build]. Please scan [files] and propose approach."

4. Review AI's proposal
5. Confirm or correct
6. Begin implementation
```

---

### During Implementation

```
Every 3-4 file changes:
- Remind AI of context (stack, phase, constraints)

Every subtask completion:
- Test the feature
- If works: Move to next subtask
- If broken: Error Handling Workflow

When AI suggests modifying existing code:
- Request scan of that file first
- Verify AI's assumption matches reality
```

---

### Handling Errors

```
1. Gather error info (terminal + browser console)
2. Paste full error message to AI
3. If unclear, request codebase scan
4. If AI's fix doesn't work (2-3 attempts), request community research
5. If still stuck, rollback and try alternative approach
```

---

### Completing a Task

```
1. Functional testing (happy path + edge cases)
2. Cross-browser testing (if UI)
3. Performance validation (if critical)
4. Security validation (if sensitive)

If all pass:
- Update IMPLEMENTATION_PLAN.md (check off task)
- Update phase progress percentage
- Log any challenges encountered
- Move to next task

If issues remain:
- Log as blocker in IMPLEMENTATION_PLAN.md
- Continue debugging or move to different task
```

---

## Phase-Specific Tips

### Phase 1 (MVP Foundation): Critical Safety Features

**Extra Validation:**
- Test ID verification with real IDs (Stripe test mode)
- Verify call moderation flags actual harmful content
- Test reporting flow end-to-end
- Confirm blocked users never match

**Don't Skip:**
- Legal review of ToS/Privacy Policy
- Insurance application (required for launch)
- Real-time moderation (liability risk)

---

### Phase 2 (Ratings): Data Integrity

**Extra Validation:**
- Verify ratings update correctly (both users)
- Test blind rating (user A can't see user B's rating before submitting)
- Check score calculation matches formula
- Test low-score consequences (warnings, suspensions)

**Watch For:**
- Rating manipulation attempts (users gaming system)
- Edge case: What if user deletes account after receiving rating?

---

### Phase 3 (Friends): Real-Time Sync

**Extra Validation:**
- Test friend requests across multiple devices (real-time notifications)
- Verify message delivery (Socket.IO)
- Test unfriend while in active call (should end call)
- Check message moderation (harmful content blocked)

**Watch For:**
- Race conditions (both users send friend request simultaneously)
- Socket.IO connection drops (messages lost?)

---

### Phase 4 (Events): GPS & Location

**Extra Validation:**
- Test GPS check-in (must be within 100m)
- Verify venue validation (no residential addresses)
- Test event creation on slow connections (Google Places API timeout?)
- Check no-show penalties (3 no-shows = restriction)

**Watch For:**
- GPS accuracy varies by device (allow 100m margin)
- Google Places API costs (monitor usage)

---

### Phase 5 (Monetization): Payment Security

**Extra Validation:**
- Test Stripe webhooks (use Stripe CLI for local testing)
- Verify subscription status updates correctly
- Test edge cases (payment fails, user cancels mid-month)
- Confirm Premium features gated correctly

**Watch For:**
- Webhook failures (must retry, don't lose subscription updates)
- Race condition: User subscribes during call (should extend timer immediately)

---

### Phase 6 (Matcher AI): Cost Control

**Extra Validation:**
- Monitor AI costs (should be < $0.01/match with caching)
- Test interview flow (10-15 min target)
- Verify matches make sense (not random)
- Check batch processing (overnight job succeeds)

**Watch For:**
- Prompt caching not working (costs spike)
- AI hallucinations (inventing user data)
- Batch job failures (users get no matches)

---

### Phase 7 (Polish): Performance

**Extra Validation:**
- Run Lighthouse audit (score > 90)
- Test on slow connections (3G simulation)
- Monitor bundle size (< 500KB)
- Check Core Web Vitals (LCP, FID, CLS)

**Watch For:**
- Image optimization (use Next.js Image component)
- Lazy loading (don't load everything upfront)
- API caching (Redis or Vercel KV)

---

## Updating This Guide

**As you learn new patterns, add them here:**

```
### New Pattern: [Name]

**Situation:** [When this pattern applies]

**Approach:**
1. [Step 1]
2. [Step 2]

**Why It Works:** [Explanation]

**Example:** [Code or prompt example]
```

---

**Last Updated:** October 4, 2025
**Next Review:** After MVP launch (refine based on lessons learned)
