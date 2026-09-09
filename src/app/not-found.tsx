'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-surface">
      <div className="w-16 h-16 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">404 - Zone Not Found</h1>
      <p className="text-xs text-on-surface-variant max-w-md mt-2 mb-6 leading-relaxed">
        The corridor or telemetry channel you are looking for does not exist or has been redirected to another event zone.
      </p>
      <Link href="/dashboard">
        <Button size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Attendee Dashboard</span>
        </Button>
      </Link>
    </div>
  );
}
