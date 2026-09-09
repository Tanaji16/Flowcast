'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href={isOrganizer ? '/command-center' : '/dashboard'} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center text-white font-black text-sm tracking-tight">
            F
          </div>
          <span className="font-bold text-base tracking-tight text-[#171717]">
            FLOWCAST
          </span>
        </Link>

        {/* Center / Right Links */}
        <div className="flex items-center gap-4 text-xs font-medium text-stone-600">
          {!isOrganizer ? (
            <>
              <Link
                href="/itinerary"
                className="hover:text-[#171717] transition-colors hidden sm:inline"
              >
                My Schedule
              </Link>
              <Link
                href="/map"
                className="hover:text-[#171717] transition-colors hidden sm:inline"
              >
                Map
              </Link>
              <Link
                href="/profile"
                className="hover:text-[#171717] transition-colors hidden sm:inline"
              >
                Profile
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-[#0F9B8E] animate-pulse" />
              <span>Organizer Mode</span>
            </div>
          )}

          {/* 1-Click Role Switcher */}
          <Link
            href={isOrganizer ? '/dashboard' : '/command-center'}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border border-stone-300 hover:border-stone-400 bg-white text-[#171717] shadow-xs"
          >
            {isOrganizer ? 'Switch to Attendee' : 'Organizer View →'}
          </Link>

          {/* Exit / Sign Out */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Log out"
            className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomBar() {
  const pathname = usePathname();
  const isOrganizer = pathname.startsWith('/command-center');

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-stone-200 px-6 py-2.5 flex items-center justify-around text-xs font-medium text-stone-600">
      <Link
        href="/dashboard"
        className={pathname === '/dashboard' ? 'font-bold text-[#171717]' : 'hover:text-[#171717]'}
      >
        Home
      </Link>
      <Link
        href="/itinerary"
        className={pathname === '/itinerary' ? 'font-bold text-[#171717]' : 'hover:text-[#171717]'}
      >
        Schedule
      </Link>
      <Link
        href="/map"
        className={pathname === '/map' ? 'font-bold text-[#171717]' : 'hover:text-[#171717]'}
      >
        Map
      </Link>
      <Link
        href={isOrganizer ? '/dashboard' : '/command-center'}
        className="font-bold text-[#0F9B8E]"
      >
        {isOrganizer ? 'Attendee' : 'Organizer'}
      </Link>
    </nav>
  );
}
