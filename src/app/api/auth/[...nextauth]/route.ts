import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import type { AuthResponse } from '@/types';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password');
        }

        try {
          const response = await axios.post<AuthResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.data?.success && response.data?.data) {
            const { user, token } = response.data.data;
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              token: token,
              user: user,
            };
          }

          // Check for specific error messages from backend
          if (response.data?.message) {
            throw new Error(response.data.message);
          }

          throw new Error('Invalid credentials');
        } catch (error: any) {
          // Handle different error types
          const message = error.response?.data?.message || error.message || 'Login failed';

          // If email not found, show specific message
          if (
            message.toLowerCase().includes('not found') ||
            message.toLowerCase().includes('no user')
          ) {
            throw new Error('Account not found. Please register first.');
          }

          // If banned
          if (message.toLowerCase().includes('banned')) {
            throw new Error('Account banned. Contact support.');
          }

          throw new Error(message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.token = user.token;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.token = token.token as string;
        session.user.user = token.user as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
