'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Check if error is from the backend
        if (result.error.includes('Invalid credentials')) {
          toast.error('Invalid email or password');
        } else if (result.error.includes('not found')) {
          toast.error('Account not found. Please register first.');
        } else if (result.error.includes('banned')) {
          toast.error('Account banned. Contact support.');
        } else {
          toast.error(result.error || 'Login failed');
        }
        return false;
      }

      await update();
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Login failed';
      if (message.includes('not found')) {
        toast.error('Account not found. Please register first.');
      } else {
        toast.error(message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
    toast.success('Logged out successfully');
  };

  return {
    user: session?.user?.user || null,
    token: session?.user?.token || null,
    role: session?.user?.role || null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || loading,
    login,
    logout,
    session,
    update,
  };
}
