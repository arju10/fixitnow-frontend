'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/validations';
import api from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Lock, Phone, Users, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const roleOptions = [
  { value: 'CUSTOMER', label: 'Customer', icon: '👤', description: 'Book services' },
  { value: 'TECHNICIAN', label: 'Technician', icon: '🔧', description: 'Provide services' },
  { value: 'ADMIN', label: 'Admin', icon: '🛡️', description: 'Manage platform' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'CUSTOMER',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      await api.post('/auth/register', data);
      toast.success('Registration successful! Please login.');
      router.push('/auth/login');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-600">
            🔧
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FixItNow</h1>
          <p className="mt-1 text-gray-500">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  error={!!errors.name}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>

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

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="+880 17XXXXXXXX"
                  {...register('phone')}
                  error={!!errors.phone}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                I want to join as
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-3 text-center transition-all hover:border-blue-400 hover:bg-blue-50 ${
                      selectedRole === option.value
                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200'
                    } `}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('role')}
                      className="sr-only"
                    />
                    <span className="text-2xl">{option.icon}</span>
                    <span className="mt-1 text-xs font-medium">{option.label}</span>
                    <span className="text-[10px] text-gray-500">{option.description}</span>
                  </label>
                ))}
              </div>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
            </div>

            <Button
              type="submit"
              className="group h-11 w-full gap-2 text-base font-medium"
              isLoading={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
              {!isLoading && (
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
