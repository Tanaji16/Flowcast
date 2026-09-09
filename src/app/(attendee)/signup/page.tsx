'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Tanaji Parab');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'attendee',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Auto-confirm helper for instant hackathon access
      if (data.user) {
        try {
          await fetch('/api/auth/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: data.user.id,
              email: email.trim(),
              fullName: fullName.trim(),
            }),
          });
        } catch (_) {}
      }

      router.push('/onboarding/step-1');
    } catch (err: any) {
      setError(err?.message || 'Error signing up');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-[#171717]">
            FLOWCAST
          </h1>
          <p className="text-xs font-semibold text-stone-500">
            Your smart event companion
          </p>
          <p className="text-xs text-stone-400 pt-1">
            Find sessions. Avoid crowds. Save time.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-[#FF6B57]/15 border border-[#FF6B57]/30 text-xs text-[#FF6B57] font-semibold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tanaji Parab"
              required
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-stone-300 text-sm text-[#171717] focus:outline-none focus:border-[#171717]"
            />
          </div>

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
            {loading ? 'Creating...' : 'Create account →'}
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#171717] underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
