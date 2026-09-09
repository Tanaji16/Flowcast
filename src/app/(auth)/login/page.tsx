'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Loader2, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next');
  const setUser = useAuthStore((s) => s.setUser);
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.session?.user) {
        // Query user's role from public.users or fall back to user_metadata
        let userRole: 'attendee' | 'organizer' = 'attendee';
        try {
          const { data: userRecord } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.session.user.id)
            .single();

          const record = userRecord as { role?: 'attendee' | 'organizer' } | null;
          if (record?.role) {
            userRole = record.role;
          } else if (data.session.user.user_metadata?.role) {
            userRole = data.session.user.user_metadata.role;
          }
        } catch {
          userRole = (data.session.user.user_metadata?.role as any) || 'attendee';
        }

        setUser({
          id: data.session.user.id,
          email: data.session.user.email || email,
          role: userRole,
        });

        // Redirect appropriately
        if (nextUrl) {
          router.push(nextUrl);
        } else if (userRole === 'organizer') {
          router.push('/command-center');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Welcome back</h2>
        <p className="text-xs text-slate-500 mt-1">Sign in to your Flowcast account</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="text-xs font-medium">Email</label>
          <Input
            type="email"
            placeholder="name@domain.com"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="text-xs font-medium">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            className="mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 text-xs space-y-2">
        <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider">
          Quick Demo Credentials
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEmail('attendee@flowcast.io');
              setPassword('password123');
            }}
            className="flex-1 py-1.5 px-2 text-center rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 text-[11px] font-medium transition-colors"
          >
            Attendee
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail('organizer@flowcast.io');
              setPassword('password123');
            }}
            className="flex-1 py-1.5 px-2 text-center rounded border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 text-[11px] font-medium transition-colors"
          >
            Organizer
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-xs text-slate-400">Loading form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
