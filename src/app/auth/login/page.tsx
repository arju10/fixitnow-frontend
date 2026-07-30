'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'credentials' | 'not_found' | 'banned' | 'server'>(
    'credentials'
  );

  // Get the redirect URL from query params
  const redirect = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setErrorType('credentials');

    const result = await login(data.email, data.password);

    if (result) {
      // ✅ Redirect to the original page after successful login
      router.push(redirect);
    } else {
      // Check the error from the backend
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await response.json();

        if (json.message?.toLowerCase().includes('invalid credentials')) {
          setErrorType('credentials');
          setError('❌ Invalid email or password. Please check your credentials.');
        } else if (
          json.message?.toLowerCase().includes('not found') ||
          json.message?.toLowerCase().includes('no user')
        ) {
          setErrorType('not_found');
          setError(
            `❌ No account found with email "${data.email}". Please create an account first.`
          );
        } else if (json.message?.toLowerCase().includes('banned')) {
          setErrorType('banned');
          setError('🚫 Your account has been banned. Please contact support.');
        } else {
          setErrorType('server');
          setError(json.message || 'Login failed. Please try again.');
        }
      } catch (err) {
        setErrorType('server');
        setError('⚠️ Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-600">
            🔧
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FixItNow</h1>
          <p className="mt-1 text-gray-500">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {error && (
            <div
              className={`mb-4 flex items-start gap-3 rounded-lg p-4 ${
                errorType === 'not_found'
                  ? 'border border-blue-200 bg-blue-50'
                  : errorType === 'banned'
                    ? 'border border-red-200 bg-red-50'
                    : 'border border-red-200 bg-red-50'
              }`}
            >
              <AlertCircle
                className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                  errorType === 'not_found' ? 'text-blue-600' : 'text-red-600'
                }`}
              />
              <div>
                <p
                  className={`text-sm ${
                    errorType === 'not_found' ? 'text-blue-700' : 'text-red-700'
                  }`}
                >
                  {error}
                </p>
                {errorType === 'not_found' && (
                  <Link
                    href={`/auth/register?redirect=${encodeURIComponent(redirect)}`}
                    className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline"
                  >
                    Create an account →
                  </Link>
                )}
                {errorType === 'banned' && (
                  <p className="mt-1 text-sm text-red-600">
                    Contact support@fixitnow.com for assistance.
                  </p>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={!!errors.email}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  error={!!errors.password}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="group h-11 w-full gap-2 text-base font-medium"
              isLoading={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              {!isLoading && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              href={`/auth/register?redirect=${encodeURIComponent(redirect)}`}
              className="font-medium text-blue-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
