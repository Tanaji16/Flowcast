import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { Compass, LayoutDashboard, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-outline-subtle bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-primary-container flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            F
          </div>
          <span className="font-bold text-lg text-on-surface">
            Flow<span className="text-primary-container">cast</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="secondary" size="sm">Sign In</Button>
          </Link>
          <Link href="/command-center">
            <Button size="sm">Organizer HQ</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 max-w-4xl mx-auto space-y-6">
        <StatusPill status="safe" label="Flowcast Event Sentinel Active • India Coordinates" />

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-on-surface leading-tight">
          Intelligent Event Flow & <br className="hidden sm:inline" />
          <span className="text-primary-container">Crowd Dynamics</span>
        </h1>

        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
          The protective, mindful travel companion. Harmonizing attendee itineraries, offering proactive
          congestion rerouting, and empowering organizers with digital twin simulations.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/login">
            <Button size="lg" className="px-8 py-3.5 shadow-lg shadow-primary-container/25">
              <span>Start Attendee Journey</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/command-center">
            <Button variant="secondary" size="lg" className="px-8 py-3.5">
              <LayoutDashboard className="w-4 h-4 mr-2 text-primary-container" />
              <span>Organizer Command Center</span>
            </Button>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left w-full max-w-3xl">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-subtle shadow-xs">
            <span className="text-xs font-bold text-primary-container block mb-1">Dynamic Nudges</span>
            <p className="text-xs text-on-surface-variant">Autonomous recommendations divert attendees away from bottlenecks.</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-subtle shadow-xs">
            <span className="text-xs font-bold text-secondary block mb-1">India Digital Twin</span>
            <p className="text-xs text-on-surface-variant">Default center [20.59°N, 78.96°E] tracking Bharat Mandapam, Jio World & more.</p>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-subtle shadow-xs">
            <span className="text-xs font-bold text-tertiary-dark block mb-1">What-If Simulation</span>
            <p className="text-xs text-on-surface-variant">Test monsoon rainstorms and gate outages before they form.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-on-surface-variant border-t border-outline-subtle">
        Flowcast © 2026 — Warm Reassuring Companion for Mindful Event Flow.
      </footer>
    </div>
  );
}
