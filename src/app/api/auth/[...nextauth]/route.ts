import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@/lib/db';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      credits?: number;
      plan?: string;
    };
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user from OAuth
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split('@')[0],
              avatar: user.image,
              emailVerified: true, // OAuth emails are already verified
              credits: 100, // Free credits for new users
              plan: 'free',
            },
          });
        } else {
          // Update avatar if changed
          if (user.image && user.image !== existingUser.avatar) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { avatar: user.image },
            });
          }
        }

        return true;
      } catch (error) {
        console.error('OAuth sign in error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user?.email) {
        // Get full user data from database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
            credits: true,
            plan: true,
            emailVerified: true,
          },
        });

        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).credits = dbUser.credits;
          (session.user as any).plan = dbUser.plan;
        }
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`✅ OAuth sign in: ${user.email} via ${account?.provider}`);
    },
    async signOut({ token }) {
      console.log(`👋 User signed out`);
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
