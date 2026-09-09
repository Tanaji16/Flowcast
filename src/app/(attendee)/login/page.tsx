'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusPill } from '@/components/ui/status-pill';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [password, setPassword] = useState('flowcast2026');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center relative overflow-hidden py-12 px-4 sm:px-6">
      {/* Ambient Cartographic Radial Glow & Route SVG */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 select-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-secondary-container/20 via-primary-fixed/20 to-transparent rounded-full blur-3xl -top-24 -left-24" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-tertiary-fixed/30 via-surface-container/20 to-transparent rounded-full blur-2xl -bottom-10 -right-10" />
        
        {/* Organic Dashed Travel Route Line */}
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

      {/* Sentinel Micro Pill */}
      <div className="mb-6">
        <StatusPill status="safe" label="Flowcast Encrypted Sentinel Active" />
      </div>

      {/* Central Login Card */}
      <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-2xl border border-outline-subtle shadow-xl p-8 sm:p-10 transition-all duration-300">
        {/* Brand Header */}
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

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-on-surface" htmlFor="email">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav.sharma@example.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-on-surface" htmlFor="password">
                Password
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="pr-10"
                required
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
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full py-3">
              <span>Log In to Flowcast</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-full h-px bg-surface-container-high" />
          <span className="absolute bg-surface-container-lowest px-3 text-[11px] font-semibold text-outline uppercase tracking-wider">
            or
          </span>
        </div>

        {/* Quick Demo Bypass Buttons */}
        <div className="space-y-2">
          <Button
            variant="secondary"
            className="w-full text-xs"
            onClick={() => router.push('/onboarding/step-1')}
          >
            Start First-Time Onboarding
          </Button>

          <Link href="/command-center" className="block">
            <Button variant="ghost" className="w-full text-xs text-secondary">
              Open Organizer Command Center →
            </Button>
          </Link>
        </div>

        {/* Sign up prompt */}
        <div className="text-center mt-6 pt-2 text-xs text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary-container font-bold hover:underline ml-1">
            Sign up
          </Link>
        </div>
      </div>

      {/* Security Context Footer */}
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
