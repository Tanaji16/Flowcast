'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Compass,
  Calendar,
  Map,
  Shuffle,
  Bell,
  User,
  LayoutDashboard,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const ATTENDEE_LINKS = [
  { href: '/dashboard', label: 'Live Hub', icon: Compass },
  { href: '/itinerary', label: 'My Schedule', icon: Calendar },
  { href: '/map', label: 'Venue Map', icon: Map },
  { href: '/notifications', label: 'Advisories', icon: Bell },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isOrganizer = pathname.startsWith('/command-center') ||
    pathname.startsWith('/simulation') ||
    pathname.startsWith('/alerts') ||
    pathname.startsWith('/accommodation') ||
    pathname.startsWith('/transport') ||
    pathname.startsWith('/venues');

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-subtle shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link href={isOrganizer ? '/command-center' : '/dashboard'} className="flex items-center gap-2.5 group cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-primary-container flex items-center justify-center text-white font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-on-surface">
              Flow<span className="text-primary-container">cast</span>
            </span>
            <span className="text-[10px] text-secondary font-bold -mt-1 tracking-wider uppercase">
              {isOrganizer ? 'Organizer HQ' : 'Attendee Companion'}
            </span>
          </div>
        </Link>

        {/* Center: Simplified Navigation (Attendee Mode) */}
        {!isOrganizer && (
          <nav className="hidden md:flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-outline-subtle">
            {ATTENDEE_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-primary-container text-white shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Center: Organizer Navigation */}
        {isOrganizer && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-full border border-slate-800">
            <Link
              href="/command-center"
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                pathname === '/command-center'
                  ? 'bg-primary-container text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Command Center</span>
            </Link>
            <Link
              href="/alerts"
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                pathname === '/alerts'
                  ? 'bg-primary-container text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Broadcasts</span>
            </Link>
            <Link
              href="/transport"
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                pathname === '/transport'
                  ? 'bg-primary-container text-white shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <span>Shuttle Fleet</span>
            </Link>
          </nav>
        )}

        {/* Right Controls: 1-Click Role Switcher & Sign Out */}
        <div className="flex items-center gap-2">
          {/* Quick 1-Click Role Switcher Pill */}
          <Link
            href={isOrganizer ? '/dashboard' : '/command-center'}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer',
              isOrganizer
                ? 'bg-secondary text-white hover:bg-secondary/90'
                : 'bg-charcoal text-white hover:bg-black'
            )}
            title="Switch between Attendee Companion & Organizer Command Center"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-fixed" />
            <span className="hidden sm:inline">
              {isOrganizer ? 'Switch to Attendee' : 'Switch to Organizer'}
            </span>
            <span className="sm:hidden">
              {isOrganizer ? 'Attendee' : 'Organizer'}
            </span>
          </Link>

          {/* Sign Out */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-danger hover:bg-danger-container/15 transition-all border border-danger/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isOrganizer = pathname.startsWith('/command-center') || pathname.startsWith('/alerts');

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      router.push('/login');
    }
  };

  const MOBILE_ITEMS = isOrganizer
    ? [
        { href: '/command-center', label: 'HQ', icon: LayoutDashboard },
        { href: '/alerts', label: 'Broadcasts', icon: Bell },
        { href: '/dashboard', label: 'Attendee', icon: Compass },
      ]
    : [
        { href: '/dashboard', label: 'Hub', icon: Compass },
        { href: '/itinerary', label: 'Schedule', icon: Calendar },
        { href: '/map', label: 'Map', icon: Map },
        { href: '/notifications', label: 'Alerts', icon: Bell },
        { href: '/command-center', label: 'HQ', icon: LayoutDashboard },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-lg border-t border-outline-subtle px-3 py-2 flex items-center justify-around shadow-lg">
      {MOBILE_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all',
              isActive
                ? 'text-primary-container font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleSignOut}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-[10px] font-semibold text-danger hover:text-danger-container transition-all cursor-pointer"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
        <span>Exit</span>
      </button>
    </nav>
  );
}
