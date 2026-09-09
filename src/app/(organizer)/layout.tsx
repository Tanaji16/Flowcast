'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlayCircle,
  Bell,
  Building,
  Bus,
  MapPin,
  Compass,
  Radio,
  Plus,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

const ORG_LINKS = [
  { href: '/command-center', label: 'Command Center', icon: LayoutDashboard },
  { href: '/simulation', label: 'Simulation Engine', icon: PlayCircle },
  { href: '/alerts', label: 'Broadcast Alerts', icon: Bell },
  { href: '/accommodation', label: 'Accommodation', icon: Building },
  { href: '/transport', label: 'Transport Fleet', icon: Bus },
  { href: '/venues', label: 'Venues & Zones', icon: MapPin },
];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastModalOpen(false);
      setBroadcastTitle('');
      setBroadcastMessage('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
        <Link href="/command-center" className="flex items-center gap-2 font-bold text-base text-primary-container">
          <div className="h-7 w-7 rounded-lg bg-primary-container text-white flex items-center justify-center font-bold text-sm">
            F
          </div>
          <span>Flowcast HQ</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'w-full md:w-64 border-r border-slate-800/80 bg-slate-950/70 p-4 flex flex-col justify-between shrink-0',
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        )}
      >
        <div className="space-y-6">
          {/* Brand */}
          <Link href="/command-center" className="hidden md:flex items-center gap-2.5 px-2">
            <div className="h-9 w-9 rounded-xl bg-primary-container text-white flex items-center justify-center font-bold text-lg shadow-md shadow-primary-container/20">
              F
            </div>
            <div>
              <div className="font-bold text-base text-white tracking-tight leading-none">
                Flow<span className="text-primary-container">cast</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
                Command HQ
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1">
            {ORG_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                    isActive
                      ? 'bg-slate-800/90 text-primary-container font-bold border border-slate-700/60 shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-primary-container' : 'text-slate-400')} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Switch to Attendee & Telemetry Status */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1 text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-secondary animate-pulse" />
                Live Sentinel
              </span>
              <span className="text-secondary font-bold">ACTIVE</span>
            </div>
            <div>India Center: 20.59°N, 78.96°E</div>
          </div>

          <Link href="/dashboard" className="block">
            <Button variant="secondary" size="sm" className="w-full text-xs">
              <Compass className="w-3.5 h-3.5 mr-1.5 text-primary-container" />
              <span>Attendee Portal View</span>
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Header */}
        <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-950/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-secondary animate-ping" />
            <span className="text-xs font-bold text-slate-300 tracking-wide">
              FLOWCAST TELEMETRY DIGITAL TWIN • INDIA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setBroadcastModalOpen(true)}
              className="bg-primary-container text-white text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Broadcast Alert</span>
            </Button>
          </div>
        </header>

        {/* Main Route Content */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* Broadcast Alert Modal */}
      <Modal
        isOpen={broadcastModalOpen}
        onClose={() => setBroadcastModalOpen(false)}
        title="Broadcast Emergency / Congestion Alert"
        description="Dispatches push advisories immediately to connected attendees."
      >
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Alert Headline</label>
            <Input
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              placeholder="e.g. Gate 4 North Congestion Warning"
              className="mt-1 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Advisory Details & Reroute Guidance</label>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Heavy traffic reported. Attendees are advised to use West Concourse Gate 2."
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary-container"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Target Segment</label>
            <select className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 p-2.5 text-xs text-white">
              <option>All Active Attendees in Bharat Mandapam</option>
              <option>Attendees within 200m of Gate 4</option>
              <option>Plenary Hall A Ticket Holders</option>
            </select>
          </div>

          {broadcastSuccess ? (
            <div className="p-3 rounded-xl bg-secondary/20 text-secondary text-xs font-bold text-center">
              ✓ Alert Dispatched to 14,280 Attendees!
            </div>
          ) : (
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setBroadcastModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Dispatch Broadcast
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
