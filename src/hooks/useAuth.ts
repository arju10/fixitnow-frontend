'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useAuth() {
  const { data: session, status } = useSession();
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
        toast.error(result.error || 'Login failed');
        return false;
      }

      toast.success('Login successful!');
      router.push('/');
      return true;
    } catch (error) {
      toast.error('An error occurred during login');
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
  };
}
