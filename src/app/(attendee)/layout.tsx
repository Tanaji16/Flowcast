'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar, MobileBottomBar } from '@/components/shared/navbar';

export default function AttendeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrOnboarding =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/onboarding');

  if (isAuthOrOnboarding) {
    return <div className="min-h-screen bg-surface">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col pb-20 md:pb-6">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
        {children}
      </main>
      <MobileBottomBar />
    </div>
  );
}
