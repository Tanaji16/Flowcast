'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/dashboard';

  const [email, setEmail] = useState('test_user_flowcast_2026@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError('Could not connect to authentication service');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-[#171717]">
            FLOWCAST
          </h1>
          <p className="text-xs font-semibold text-stone-500">
            Log in to your event companion
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FF6B57]/15 border border-[#FF6B57]/30 text-xs text-[#FF6B57] font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-stone-300 text-sm text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••••"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-stone-300 text-sm text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-black text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
          >
            {loading ? 'Logging in...' : 'Log in →'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-bold text-[#171717] underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs font-bold">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
