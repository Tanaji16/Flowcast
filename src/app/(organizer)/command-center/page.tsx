'use client';

import React, { useState, useEffect } from 'react';
import { IndiaMap } from '@/components/shared/india-map';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRealtimeZones } from '@/hooks/useRealtimeZones';
import {
  Users,
  AlertTriangle,
  PlayCircle,
  Radio,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  LogOut,
  Zap,
  RefreshCw,
} from 'lucide-react';

export default function CommandCenterPage() {
  const router = useRouter();
  const [selectedZone, setSelectedZone] = useState<string>('Gate 4 North FastTrack Entrance');
  const [alertsCount, setAlertsCount] = useState<number>(2);
  const { zones: liveZones, loading, lastUpdated, updateZoneStatus } = useRealtimeZones();
  const [isSimulatingSurge, setIsSimulatingSurge] = useState(false);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const supabase = createClient();
        const { data } = await (supabase.from('alerts') as any).select('id').eq('resolved', false);
        if (data && data.length > 0) {
          setAlertsCount(data.length);
        }
      } catch (err) {
        // use fallback count
      }
    }
    loadAlerts();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  // Compute live aggregates from realtime zones
  const totalHeadcount = liveZones.reduce((acc, z) => acc + (z.currentOccupancy || 0), 0);
  const criticalZones = liveZones.filter((z) => z.occupancyRate >= 85 || z.status === 'red');
  const criticalCount = criticalZones.length;

  // Realtime simulation test: toggle zone occupancy to demonstrate instant live updates
  const handleToggleSurge = async (zoneId: string, currentOcc: number, maxCap: number) => {
    setIsSimulatingSurge(true);
    const isCurrentlyHigh = (currentOcc / maxCap) >= 0.85;
    const newOccupancy = isCurrentlyHigh ? Math.round(maxCap * 0.45) : Math.round(maxCap * 0.94);
    const newStatus = isCurrentlyHigh ? 'green' : 'red';

    await updateZoneStatus(zoneId, newOccupancy, newStatus);
    setTimeout(() => setIsSimulatingSurge(false), 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Realtime Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div>
            <span className="text-xs font-bold text-white tracking-wide">
              Supabase Realtime Stream: Digital Twin Live
            </span>
            <span className="text-[11px] text-slate-400 ml-2">
              Last packet: {lastUpdated.toLocaleTimeString()} (zero refresh needed)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/simulation">
            <Button size="sm" className="bg-primary-container text-white text-xs h-8">
              <PlayCircle className="w-3.5 h-3.5 mr-1" />
              <span>Simulate Scenario</span>
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSignOut}
            className="text-xs text-red-400 hover:text-red-300 border border-red-900/40 h-8 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Top Telemetry KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Active Attendees</span>
            <Users className="w-4 h-4 text-primary-container" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {totalHeadcount.toLocaleString()}
          </div>
          <span className="text-[11px] text-secondary font-semibold">Live turnstile telemetry</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Critical Congestion Hotspots</span>
            <AlertTriangle className="w-4 h-4 text-primary-container" />
          </div>
          <div className="text-3xl font-extrabold text-primary-container mt-1">
            {criticalCount} {criticalCount === 1 ? 'Zone' : 'Zones'}
          </div>
          <span className="text-[11px] text-primary-container font-semibold">
            {criticalZones[0] ? `${criticalZones[0].name} (${criticalZones[0].occupancyRate}%)` : 'All zones optimal'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Monitored Venues</span>
            <Radio className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">4 Venues</div>
          <span className="text-[11px] text-secondary font-semibold">Delhi, Mumbai, BLR, HYD</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Broadcast Alerts</span>
            <Clock className="w-4 h-4 text-tertiary" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">{alertsCount} Live</div>
          <span className="text-[11px] text-secondary font-semibold">Autonomous Nudge Engine</span>
        </div>
      </div>

      {/* Main Map Component with Live Realtime Zone Data */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Event Digital Twin Map
          </h2>
          <p className="text-xs text-slate-400">
            Realtime bidirectional link enabled. Click any zone node to inspect live flow parameters.
          </p>
        </div>

        <IndiaMap
          variant="organizer"
          liveZones={liveZones}
          onSelectZone={(zone) => setSelectedZone(zone)}
        />
      </div>

      {/* Bottom Command Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Live Zone Telemetry Stream</h3>
              <p className="text-xs text-slate-400">Turnstile sensors push live updates via Postgres changes.</p>
            </div>
            <Badge variant="teal">Supabase Channel Active</Badge>
          </div>

          <div className="space-y-2.5">
            {liveZones.map((z) => {
              const isHigh = z.occupancyRate >= 85;
              const isWarning = z.occupancyRate >= 60;
              return (
                <div
                  key={z.id}
                  className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{z.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({z.currentOccupancy.toLocaleString()} / {z.maxCapacity.toLocaleString()})
                      </span>
                    </div>
                    {/* Live occupancy bar */}
                    <div className="w-full bg-slate-700/50 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHigh ? 'bg-primary-container' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${Math.min(100, z.occupancyRate)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-white text-sm">{z.occupancyRate}%</span>
                    <Badge variant={isHigh ? 'coral' : isWarning ? 'amber' : 'teal'}>
                      {isHigh ? 'Critical' : isWarning ? 'Warning' : 'Optimal'}
                    </Badge>
                    <button
                      type="button"
                      disabled={isSimulatingSurge}
                      onClick={() => handleToggleSurge(z.id, z.currentOccupancy, z.maxCapacity)}
                      className="px-2 py-1 rounded bg-slate-700/80 hover:bg-slate-600 text-[10px] text-slate-300 font-medium transition-colors cursor-pointer"
                      title="Simulate surge or clear occupancy"
                    >
                      Toggle Surge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Automated Nudge Engine</h3>
            <Badge variant="teal">Autonomous</Badge>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Flowcast actively calculates zone deltas in real-time. When a zone breaches 85% capacity, attendee notifications receive instant rerouting nudges with zero page reload.
          </p>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-center gap-2 text-primary-container font-bold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Realtime Threshold Watcher</span>
            </div>
            <p className="text-xs text-slate-300">
              {criticalZones.length > 0
                ? `${criticalZones.map((c) => c.name).join(', ')} currently exceeding threshold (>85%). Push nudges active.`
                : 'All monitored corridors operating inside safety envelopes.'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <Link href="/simulation" className="block">
              <Button className="w-full bg-primary-container text-white text-xs">
                <span>Run Scenario Simulation Engine →</span>
              </Button>
            </Link>
            <Link href="/alerts" className="block">
              <Button variant="secondary" className="w-full text-xs text-slate-300">
                <span>View Dispatched Advisories</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
