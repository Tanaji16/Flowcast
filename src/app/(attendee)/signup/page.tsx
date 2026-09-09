'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusPill } from '@/components/ui/status-pill';
import { ArrowRight, ShieldCheck, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});

  const validate = () => {
    const errors: { fullName?: string; email?: string; password?: string } = {};
    const nameTrimmed = fullName.trim();
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameTrimmed) {
      errors.fullName = 'Full Name is required';
    }

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);

    // Validation checks BEFORE submitting
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();

      // 1. Register through backend API (uses Supabase Admin to bypass email rate limits)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          fullName: cleanName,
          role: 'attendee',
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Unable to complete registration');
      }

      // 2. Sign in to establish client session
      const supabase = createClient();
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInErr) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 1200);
        return;
      }

      if (signInData.session) {
        router.push('/onboarding/step-1');
        router.refresh();
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Unexpected error during signup');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center relative overflow-hidden py-12 px-4 sm:px-6">
      <div className="mb-6">
        <StatusPill status="safe" label="Join Flowcast Companion" />
      </div>

      <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl border border-outline-subtle shadow-xl p-8 sm:p-10">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-secondary/25 mb-3">
            F
          </div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">
            Create your account
          </h1>
          <p className="text-xs text-on-surface-variant mt-1 mb-6">
            Get personalized itineraries, smart crowd avoidance & instant passes
          </p>
        </div>

        {authError && (
          <div
            role="alert"
            className="mb-5 p-3.5 rounded-xl bg-danger-container/15 border border-danger/30 flex items-start gap-2.5 text-xs text-danger-container"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
            <div className="flex-1">
              <span className="font-semibold block text-on-surface">Registration Error</span>
              <span className="text-on-surface-variant leading-relaxed">{authError}</span>
            </div>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            className="mb-5 p-3.5 rounded-xl bg-primary-container/15 border border-primary-container/30 flex items-start gap-2.5 text-xs text-primary-container"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary-container" />
            <div className="flex-1">
              <span className="font-semibold block text-on-surface">Success</span>
              <span className="text-on-surface-variant leading-relaxed">{successMessage}</span>
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignup} noValidate>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface" htmlFor="fullName">
              Full Name <span className="text-danger">*</span>
            </label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fieldErrors.fullName) {
                  setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
                }
              }}
              placeholder="Aarav Sharma"
              className={fieldErrors.fullName ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : ''}
              disabled={loading}
              aria-invalid={!!fieldErrors.fullName}
              aria-describedby={fieldErrors.fullName ? 'name-error' : undefined}
            />
            {fieldErrors.fullName && (
              <p id="name-error" className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1">
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface" htmlFor="signup-email">
              Email address <span className="text-danger">*</span>
            </label>
            <Input
              id="signup-email"
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
              aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
            />
            {fieldErrors.email && (
              <p id="signup-email-error" className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface" htmlFor="signup-password">
              Create Password <span className="text-danger">*</span>
            </label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              placeholder="Min. 6 characters"
              className={fieldErrors.password ? 'border-danger/60 focus:border-danger focus:ring-danger/20' : ''}
              disabled={loading}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'signup-password-error' : undefined}
            />
            {fieldErrors.password && (
              <p id="signup-password-error" className="text-[11px] text-danger font-medium flex items-center gap-1 mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Continue to Personalization
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </span>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center mt-6 pt-2 text-xs text-on-surface-variant">
          Already have an account?{' '}
          <Link href="/login" className="text-secondary font-bold hover:underline ml-1">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
