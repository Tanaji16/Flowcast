'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusPill } from '@/components/ui/status-pill';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('flowcast2026');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding/step-1');
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

        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface">Full Name</label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aarav Sharma"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface">Email address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface">Create Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-3">
              <span>Continue to Personalization</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
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
