import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // user.id = Google's user ID (stable!)
        // user.email = email from Google
        // user.name = display name from Google
        // user.image = avatar URL from Google

        // Create or update user in Supabase
        const { data, error } = await supabase
          .from('users')
          .upsert({
            google_id: user.id,
            email: user.email,
            display_name: user.name,
            avatar_url: user.image,
            last_login_at: new Date().toISOString(),
          }, {
            onConflict: 'google_id',
            ignoreDuplicates: false,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating/updating user:', error);
          return false;
        }

        // Store user UUID in account for session
        if (account) {
          account.userId = data.id;
        }

        return true;
      } catch (error) {
        console.error('Sign in error:', error);
        return false;
      }
    },

    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        // Get user from database to get UUID
        const { data } = await supabase
          .from('users')
          .select('id, phone_verified, subscription_tier')
          .eq('google_id', user.id)
          .single();

        if (data) {
          token.userId = data.id;
          token.phoneVerified = data.phone_verified;
          token.subscriptionTier = data.subscription_tier;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).phoneVerified = token.phoneVerified;
        (session.user as any).subscriptionTier = token.subscriptionTier;
      }

      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',  // Redirect to dedicated sign-in page
  },

  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
