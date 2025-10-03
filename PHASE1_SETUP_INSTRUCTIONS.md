# Phase 1: Google Authentication - Setup Instructions

## ✅ What Has Been Completed

All code changes for Phase 1 have been implemented:

1. ✅ NextAuth.js and Supabase adapter installed
2. ✅ Environment variables configured (`.env.local`)
3. ✅ Database migration SQL file created
4. ✅ NextAuth API route created
5. ✅ Main page updated for Google OAuth
6. ✅ PhoneVerification component updated
7. ✅ Phone verification API route updated
8. ✅ Socket.IO server updated for userId authentication
9. ✅ Socket.IO client and WebRTC manager updated
10. ✅ SessionProvider added to app layout

---

## 🔧 Required Manual Steps

### Step 1: Set Up Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project (or select existing):**
   - Project name: "CQPDUK Voice App" (or your preferred name)
   - Organization: None (personal)

3. **Enable Google+ API:**
   - Navigate to: **APIs & Services → Library**
   - Search for: "Google+ API"
   - Click **Enable**

4. **Create OAuth Credentials:**
   - Navigate to: **APIs & Services → Credentials**
   - Click: **Create Credentials → OAuth Client ID**
   - Application type: **Web application**
   - Name: "CQPDUK Production"

   **Authorized JavaScript origins:**
   - `http://localhost:3000` (for local development)
   - `https://call-app-1.vercel.app` (production - adjust to your domain)

   **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
   - `https://call-app-1.vercel.app/api/auth/callback/google`

5. **Copy Your Credentials:**
   - You'll receive a **Client ID** and **Client Secret**
   - Keep these for Step 2

---

### Step 2: Update Environment Variables

**Edit `.env.local` file:**

Replace these placeholder values with your actual credentials:

```bash
# Replace these two lines with your Google OAuth credentials:
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
```

**Note:** All other variables are already configured, including:
- `NEXTAUTH_URL=http://localhost:3000` ✅
- `NEXTAUTH_SECRET=nEPHK3kRJwiyc8mRKqSzTzMWmCdRcbPNq1cbJ02Dq4s=` ✅

---

### Step 3: Run Database Migration

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/skyffnybsqwfbbkbqcxy

2. **Navigate to SQL Editor:**
   - Click **SQL Editor** in the left sidebar

3. **Run Migration:**
   - Open the file: `supabase_migration_phase1.sql` (in your project root)
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click **Run** or press `Ctrl+Enter`

4. **Verify Migration Success:**
   - Run this verification query:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('users', 'friendships', 'subscriptions', 'payments');
   ```
   - Should return 4 rows (users, friendships, subscriptions, payments)

---

### Step 4: Update Vercel Environment Variables

For production deployment, add these to Vercel:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/your-project/settings/environment-variables

2. **Add These Variables:**
   ```
   NEXTAUTH_URL=https://call-app-1.vercel.app
   NEXTAUTH_SECRET=nEPHK3kRJwiyc8mRKqSzTzMWmCdRcbPNq1cbJ02Dq4s=
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GOOGLE_CLIENT_SECRET=<your_google_client_secret>
   ```

3. **Keep Existing Variables:**
   - All other environment variables remain the same

---

## 🧪 Testing Phase 1

### Local Testing

1. **Start Socket.IO Server:**
   ```bash
   npm run socket-server
   ```

2. **Start Next.js Development Server:**
   ```bash
   npm run dev
   ```

3. **Test Authentication Flow:**
   - Open: http://localhost:3000
   - Click **"Continue with Google"**
   - Sign in with your Google account
   - You should see the phone verification modal (one-time only)
   - Enter phone number and verify code
   - You should now see the main app

4. **Test Voice Calls:**
   - Open a second browser tab (incognito mode recommended)
   - Sign in with a different Google account
   - Verify phone for second account
   - Click **"Start Call"** on both tabs
   - Voice call should connect

### Production Testing

After deploying to Vercel:

1. Visit: https://call-app-1.vercel.app
2. Test Google OAuth flow
3. Verify phone verification works
4. Test voice calls with another user

---

## 🔍 Troubleshooting

### Issue: "NEXTAUTH_URL is not set"
**Solution:** Ensure `.env.local` has `NEXTAUTH_URL=http://localhost:3000`

### Issue: Google OAuth redirect fails
**Solution:**
- Check authorized redirect URIs in Google Cloud Console
- Make sure the URL exactly matches: `http://localhost:3000/api/auth/callback/google`

### Issue: "Invalid user" on socket connection
**Solution:**
- Check browser console for userId value
- Ensure database migration completed successfully
- Verify user was created in `users` table

### Issue: Phone verification fails
**Solution:**
- Check `TELNYX_API_KEY` is set in Vercel environment variables
- Verify Telnyx account has credits

### Issue: Database migration errors
**Solution:**
- Run each CREATE TABLE statement individually
- Check Supabase logs for specific error messages
- Ensure you have proper permissions in Supabase

---

## 📊 Verification Checklist

Before considering Phase 1 complete, verify:

- [ ] Google OAuth sign-in works
- [ ] User is created in `users` table in Supabase
- [ ] Phone verification modal shows for new users
- [ ] Phone verification updates `users.phone_verified = true`
- [ ] Socket.IO connects with userId (check server logs)
- [ ] Voice calls work end-to-end
- [ ] Second sign-in skips phone verification (already verified)
- [ ] Sign out and sign in again works correctly

---

## 📝 Database Verification Queries

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check if user was created
SELECT id, google_id, email, display_name, phone_verified, subscription_tier
FROM users
WHERE email = 'your-test-email@gmail.com';

-- Check all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'friendships', 'subscriptions', 'payments');

-- Count total users
SELECT COUNT(*) FROM users;
```

---

## 🚀 What's Next?

After Phase 1 is complete and tested:

1. **Phase 2: Subscription System** (2-3 days)
   - Stripe integration
   - Pricing page
   - Feature gating by subscription tier

2. **Phase 3: Friend System** (2-3 days)
   - Send/accept friend requests
   - Friends list
   - Direct calling friends

3. **Phase 4: Token System** (1-2 days, optional)
   - Token purchases
   - Token-gated features

---

## 🆘 Need Help?

If you encounter issues:

1. Check this document's troubleshooting section
2. Review logs:
   - **Browser Console:** DevTools → Console
   - **Supabase Logs:** Dashboard → Logs → Postgres
   - **Vercel Logs:** Dashboard → Deployments → Function Logs
   - **Railway Logs:** Dashboard → Deployments → View Logs

3. Verify all environment variables are set correctly
4. Ensure database migration completed without errors

---

## 🎉 Success!

Once all manual steps are complete and testing passes, Phase 1 is done!

Your app now has:
- ✅ Stable user identity with Google OAuth
- ✅ One-time phone verification for security
- ✅ Permanent user records in database
- ✅ Foundation ready for friend system (Phase 3)
- ✅ Infrastructure ready for subscriptions (Phase 2)

Time to move on to Phase 2: Subscription System! 🚀
