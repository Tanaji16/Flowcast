'use client';

import React, { useState, useEffect } from 'react';
import { IndiaMap } from '@/components/shared/india-map';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  AlertTriangle,
  PlayCircle,
  Radio,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  Send,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap,
} from 'lucide-react';

export default function CommandCenterPage() {
  // Interactive scenario states: 'normal' | 'surge' | 'dispersed'
  const [scenario, setScenario] = useState<'normal' | 'surge' | 'dispersed'>('normal');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [dispatchedAlerts, setDispatchedAlerts] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Dynamic zone metrics that visually change during simulation
  const zoneMetrics = {
    normal: [
      { name: 'Gate 4 North FastTrack', occ: 65, status: 'safe', delay: '4m' },
      { name: 'Plenary Summit Hall A', occ: 72, status: 'safe', delay: '6m' },
      { name: 'West Concourse Gate 2', occ: 35, status: 'safe', delay: '1m' },
      { name: 'Innovation Expo Pavilion 2', occ: 42, status: 'safe', delay: '0m' },
    ],
    surge: [
      { name: 'Gate 4 North FastTrack', occ: 96, status: 'critical', delay: '28m' },
      { name: 'Plenary Summit Hall A', occ: 92, status: 'critical', delay: '18m' },
      { name: 'West Concourse Gate 2', occ: 40, status: 'safe', delay: '2m' },
      { name: 'Innovation Expo Pavilion 2', occ: 45, status: 'safe', delay: '0m' },
    ],
    dispersed: [
      { name: 'Gate 4 North FastTrack', occ: 52, status: 'safe', delay: '5m' },
      { name: 'Plenary Summit Hall A', occ: 68, status: 'safe', delay: '6m' },
      { name: 'West Concourse Gate 2', occ: 74, status: 'safe', delay: '4m' },
      { name: 'Innovation Expo Pavilion 2', occ: 62, status: 'safe', delay: '3m' },
    ],
  }[scenario];

  const attendeesCount = {
    normal: 14820,
    surge: 19450,
    dispersed: 14820,
  }[scenario];

  const hotspotsCount = {
    normal: 0,
    surge: 2,
    dispersed: 0,
  }[scenario];

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    setIsBroadcasting(true);
    try {
      const supabase = createClient();
      await supabase.from('alerts').insert({
        title: broadcastTitle,
        message: broadcastMessage || 'Immediate advisory dispatched by Organizer HQ.',
        severity: 'warning',
        resolved: false,
      });
    } catch (err) {
      console.warn('Broadcast note:', err);
    } finally {
      setDispatchedAlerts([broadcastTitle, ...dispatchedAlerts]);
      setBroadcastTitle('');
      setBroadcastMessage('');
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl text-white tracking-tight">Organizer Command Center</h1>
            <Badge variant="teal">Digital Twin Synchronized</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-venue telemetry, crowd dispersal automation, and live what-if simulation.
          </p>
        </div>

        <Link href="/dashboard">
          <Button variant="secondary" size="sm" className="text-xs text-slate-300 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-primary-container" />
            <span>Open Attendee Companion →</span>
          </Button>
        </Link>
      </div>

      {/* WHAT-IF INTERACTIVE SCENARIO CONTROLS (DEMO HIGHLIGHT) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <PlayCircle className="w-5 h-5 text-primary-container" />
            <span>Live Interactive Crowd Simulation & Auto-Dispersal Studio</span>
          </div>
          <span className="text-[11px] text-slate-400">Click any preset to see the digital twin react live:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Preset 1 */}
          <button
            type="button"
            onClick={() => setScenario('normal')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              scenario === 'normal'
                ? 'bg-secondary/20 border-secondary ring-1 ring-secondary'
                : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white">1. Normal Event Flow</span>
              {scenario === 'normal' && <CheckCircle2 className="w-4 h-4 text-secondary" />}
            </div>
            <p className="text-[11px] text-slate-400">Nominal queues across all 4 India venues.</p>
          </button>

          {/* Preset 2 */}
          <button
            type="button"
            onClick={() => setScenario('surge')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              scenario === 'surge'
                ? 'bg-red-500/20 border-red-500 ring-2 ring-red-500/30'
                : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-red-400">2. Simulate Monsoon Surge</span>
              {scenario === 'surge' && <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />}
            </div>
            <p className="text-[11px] text-slate-400">Gate 4 turnstiles jam at 96% code limit (+28m wait).</p>
          </button>

          {/* Preset 3 */}
          <button
            type="button"
            onClick={() => setScenario('dispersed')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
              scenario === 'dispersed'
                ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-slate-900/60 border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-400">3. Autonomous Dispersal</span>
              {scenario === 'dispersed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400">Flowcast nudges attendees to Gate 2 & Pavilion 2. Balanced!</p>
          </button>
        </div>

        {scenario === 'surge' && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-red-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>CRITICAL ALERT:</strong> Gate 4 North turnstiles are at 96% capacity. Code violation imminent.
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => setScenario('dispersed')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md"
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              <span>Execute Autonomous Crowd Dispersal</span>
            </Button>
          </div>
        )}

        {scenario === 'dispersed' && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>DISPERSAL COMPLETE:</strong> Flowcast autonomously rerouted 4,200 attendees to West Concourse Gate 2. All zones restored to safe green thresholds!
              </span>
            </span>
            <button
              type="button"
              onClick={() => setScenario('normal')}
              className="text-[11px] underline text-emerald-400 hover:text-white cursor-pointer"
            >
              Reset to Normal
            </button>
          </div>
        )}
      </div>

      {/* KPI Telemetry Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Active Attendees</span>
            <Users className="w-4 h-4 text-primary-container" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {attendeesCount.toLocaleString()}
          </div>
          <span className="text-[11px] text-secondary font-semibold">
            {scenario === 'surge' ? '+31% crowd influx' : 'Optimal flow density'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Critical Hotspots</span>
            <AlertTriangle className="w-4 h-4 text-primary-container" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            <span className={hotspotsCount > 0 ? 'text-red-400' : 'text-emerald-400'}>
              {hotspotsCount} {hotspotsCount === 1 ? 'Zone' : 'Zones'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">
            {hotspotsCount > 0 ? 'Gate 4 & Plenary breached' : 'All zones compliant'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>India Multi-Venue Sync</span>
            <Radio className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">4 Venues</div>
          <span className="text-[11px] text-secondary font-semibold">Delhi, Mumbai, BLR, HYD</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Flowcast Dispersal AI</span>
            <Clock className="w-4 h-4 text-tertiary" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {scenario === 'dispersed' ? 'Balanced' : scenario === 'surge' ? 'Overloaded' : 'Ready'}
          </div>
          <span className="text-[11px] text-secondary font-semibold">Autonomous Nudge Engine</span>
        </div>
      </div>

      {/* Main Digital Twin Map Component */}
      <IndiaMap variant="organizer" onSelectZone={() => {}} />

      {/* Dynamic Zone Telemetry Table & Live Broadcast Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dynamic Live Zone Gauges */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Live Zone Telemetry Stream</h3>
              <p className="text-xs text-slate-400">Turnstile throughput & wait times</p>
            </div>
            <Badge variant={scenario === 'surge' ? 'coral' : 'teal'}>
              {scenario === 'surge' ? '2 Bottlenecks' : 'Nominal Stream'}
            </Badge>
          </div>

          <div className="space-y-3">
            {zoneMetrics.map((z) => (
              <div
                key={z.name}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{z.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[11px]">Wait: ~{z.delay}</span>
                    <Badge variant={z.occ >= 85 ? 'coral' : z.occ >= 65 ? 'amber' : 'teal'}>
                      {z.occ}% Occupancy
                    </Badge>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-700/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      z.occ >= 85 ? 'bg-red-500' : z.occ >= 65 ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${z.occ}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Broadcast Dispatcher */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Instant Crowd Broadcast</h3>
            <Badge variant="teal">Push to Mobiles</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Broadcast emergency reroutes or crowd notices to all attendees immediately.
          </p>

          <form onSubmit={handleBroadcast} className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Advisory Title</label>
              <Input
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder="e.g. Gate 4 Overcrowded - Divert"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-semibold">Message</label>
              <textarea
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Attendee instructions..."
                rows={2}
                className="w-full rounded-xl bg-slate-800 p-2.5 text-xs text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <Button
              type="submit"
              disabled={isBroadcasting}
              className="w-full bg-primary-container hover:bg-primary-container/90 text-white text-xs cursor-pointer py-2.5"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Broadcast Live to 14k Attendees</span>
            </Button>
          </form>

          {/* Recently Dispatched Feed */}
          {dispatchedAlerts.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400">Recently Dispatched:</span>
              {dispatchedAlerts.slice(0, 2).map((al, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{al}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
