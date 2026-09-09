'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Compass, Calendar, Map, Shuffle, Bell, User, LayoutDashboard, HelpCircle, FileText } from 'lucide-react';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Hub', icon: Compass },
  { href: '/itinerary', label: 'Schedule', icon: Calendar },
  { href: '/map', label: 'Nearby Map', icon: Map },
  { href: '/alternatives', label: 'Alternatives', icon: Shuffle },
  { href: '/notifications', label: 'Alerts', icon: Bell },
  { href: '/trip-summary', label: 'Summary', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-outline-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
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

        {/* Desktop Navigation Links */}
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

        {/* Switch to Organizer Command Center button */}
        <div className="flex items-center gap-3">
          <Link
            href="/command-center"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-charcoal text-white hover:bg-black text-xs font-semibold transition-all shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-primary-container" />
            <span className="hidden sm:inline">Organizer HQ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomBar() {
  const pathname = usePathname();

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
            <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
