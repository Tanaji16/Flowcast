'use client';

import React from 'react';
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
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Hub', icon: Compass },
  { href: '/itinerary', label: 'Schedule', icon: Calendar },
  { href: '/map', label: 'Nearby Map', icon: Map },
  { href: '/alternatives', label: 'Alternatives', icon: Shuffle },
  { href: '/notifications', label: 'Alerts', icon: Bell },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-outline-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 group cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-primary-container flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-on-surface">
              Flow<span className="text-primary-container">cast</span>
            </span>
            <span className="text-[10px] text-secondary font-semibold -mt-1 tracking-wider uppercase">
              Companion
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-primary-container/10 text-primary-container font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            href="/command-center"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal text-white hover:bg-black text-xs font-semibold transition-all shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-primary-container" />
            <span className="hidden sm:inline">Organizer HQ</span>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-danger hover:bg-danger-container/15 transition-all border border-danger/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomBar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      router.push('/login');
    }
  };

  const MOBILE_ITEMS = [
    { href: '/dashboard', label: 'Hub', icon: Compass },
    { href: '/itinerary', label: 'Schedule', icon: Calendar },
    { href: '/map', label: 'Map', icon: Map },
    { href: '/alternatives', label: 'Reroute', icon: Shuffle },
    { href: '/notifications', label: 'Alerts', icon: Bell },
    { href: '/profile', label: 'Me', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/90 backdrop-blur-lg border-t border-outline-subtle px-3 py-2 flex items-center justify-around">
      {MOBILE_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition-all',
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
        className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold text-danger hover:text-danger-container transition-all"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
        <span>Exit</span>
      </button>
    </nav>
  );
}
