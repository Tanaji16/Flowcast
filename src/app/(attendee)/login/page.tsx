'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusPill } from '@/components/ui/status-pill';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errors: { email?: string; password?: string } = {};
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailTrimmed) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com)';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(nextUrl);
        router.refresh();
      } else {
        setAuthError('Unable to establish session. Please verify your credentials.');
        setLoading(false);
      }
    } catch (err: any) {
      setAuthError(err?.message || 'An unexpected error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center relative overflow-hidden py-12 px-4 sm:px-6">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 select-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-secondary-container/20 via-primary-fixed/20 to-transparent rounded-full blur-3xl -top-24 -left-24" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-tertiary-fixed/30 via-surface-container/20 to-transparent rounded-full blur-2xl -bottom-10 -right-10" />
        <svg className="w-full max-w-4xl h-full opacity-30" fill="none" viewBox="0 0 1000 700">
          <path
            d="M120 180 C 260 80, 380 320, 520 230 S 760 120, 890 340 C 970 470, 810 600, 680 540 S 390 620, 240 500"
            stroke="#0f9b8e"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <circle cx="120" cy="180" r="6" fill="#ffffff" stroke="#006a61" strokeWidth="3" />
          <circle cx="520" cy="230" r="5" fill="#ff6b57" stroke="#ffffff" strokeWidth="2" />
          <circle cx="890" cy="340" r="7" fill="#0f9b8e" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx="890" cy="340" r="14" stroke="#0f9b8e" strokeWidth="1.5" strokeDasharray="2 4" fill="none" opacity="0.4" />
        </svg>
      </div>

      <div className="mb-6">
        <StatusPill status="safe" label="Flowcast Encrypted Sentinel Active" />
      </div>

      <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl border border-outline-subtle shadow-xl p-8 sm:p-10 transition-all duration-300">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-primary-container flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-primary-container/25 mb-3">
            F
          </div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">
            Welcome back,
          </h1>
          <p className="text-xs text-on-surface-variant mt-1 mb-6">
            Log in to view your trip, crowd advisories & passes
          </p>
        </div>

        {authError && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-danger-container/15 border border-danger/30 flex items-start gap-2.5 text-xs text-danger-container transition-all"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
            <div className="flex-1">
              <span className="font-semibold block text-on-surface">Authentication Error</span>
              <span className="text-on-surface-variant leading-relaxed">{authError}</span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin} noValidate>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface" htmlFor="email">
              Email address <span className="text-danger">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              placeholder="name@domain.com"
              className={fieldErrors.email ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : ''}
              disabled={loading}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-on-surface" htmlFor="password">
                Password <span className="text-danger">*</span>
              </label>
              <Link href="/help" className="text-xs text-secondary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                placeholder="••••••••••••"
                className={'pr-10 ' + (fieldErrors.password ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : '')}
                disabled={loading}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-on-surface-variant hover:text-on-surface cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Log In to Flowcast
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </span>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-2.5 rounded-xl bg-surface-container-low border border-outline-subtle text-[11px] text-on-surface-variant text-center">
          <span>Need a test account? Use </span>
          <button
            type="button"
            className="text-primary-container font-bold underline cursor-pointer"
            onClick={() => {
              setEmail('test_user_flowcast_2026@gmail.com');
              setPassword('Password123!');
              setFieldErrors({});
            }}
          >
            pre-configured demo
          </button>
          <span> or </span>
          <Link href="/signup" className="text-secondary font-bold underline">
            sign up here
          </Link>
        </div>

        <div className="text-center mt-6 pt-2 text-xs text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary-container font-bold hover:underline ml-1">
            Sign up
          </Link>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-6 text-outline text-xs">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          256-Bit TLS Protection
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-secondary" />
          Zero-Knowledge Flowcast Vault
        </span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary-container" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
