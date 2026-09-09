'use client';

import React, { useState } from 'react';
import { IndiaMap } from '@/components/shared/india-map';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Users, AlertTriangle, PlayCircle, Radio, Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function CommandCenterPage() {
  const [selectedZone, setSelectedZone] = useState<string>('Gate 4 North FastTrack');

  return (
    <div className="space-y-6">
      {/* Top Telemetry KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Active Attendees</span>
            <Users className="w-4 h-4 text-primary-container" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">14,820</div>
          <span className="text-[11px] text-secondary font-semibold">+8.4% flow vs expected</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Critical Congestion Hotspots</span>
            <AlertTriangle className="w-4 h-4 text-primary-container" />
          </div>
          <div className="text-3xl font-extrabold text-primary-container mt-1">1 Zone</div>
          <span className="text-[11px] text-primary-container font-semibold">Gate 4 North (92% code limit)</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>India Venues Synchronized</span>
            <Radio className="w-4 h-4 text-secondary" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">4 Venues</div>
          <span className="text-[11px] text-secondary font-semibold">Delhi, Mumbai, BLR, HYD</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Average Dwell Time</span>
            <Clock className="w-4 h-4 text-tertiary" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">38m</div>
          <span className="text-[11px] text-secondary font-semibold">-6m wait time saved</span>
        </div>
      </div>

      {/* Main Digital Twin Map Component */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              India Multi-Venue Digital Twin Map
            </h2>
            <p className="text-xs text-slate-400">
              Default coordinates: lat 20.5937, lng 78.9629 (Zoom 5x). Click any city node to pan & inspect zone telemetry.
            </p>
          </div>
          <Link href="/simulation">
            <Button size="sm" className="bg-primary-container text-white text-xs">
              <PlayCircle className="w-3.5 h-3.5 mr-1" />
              <span>Test Surge Scenario</span>
            </Button>
          </Link>
        </div>

        <IndiaMap
          variant="organizer"
          onSelectZone={(zone) => setSelectedZone(zone)}
        />
      </div>

      {/* Two Column Section: Live Zone Occupancy & Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Zones */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-bold text-base text-white mb-4">Bharat Mandapam Live Zone Telemetry</h3>
            <div className="space-y-3 text-xs">
              {[
                { name: 'Gate 4 North FastTrack', occ: 92, cap: '1,840 / 2,000', status: 'critical', trend: '+14% surge' },
                { name: 'Plenary Summit Hall A', occ: 86, cap: '4,300 / 5,000', status: 'moderate', trend: '+4% steady' },
                { name: 'Central Food Court', occ: 68, cap: '1,360 / 2,000', status: 'moderate', trend: '-2% clearing' },
                { name: 'Innovation Expo Pavilion 2', occ: 42, cap: '1,260 / 3,000', status: 'safe', trend: 'steady' },
                { name: 'Supreme Court Metro Shuttle Hub', occ: 35, cap: '700 / 2,000', status: 'safe', trend: 'optimal' },
              ].map((zone) => (
                <div key={zone.name} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-200">{zone.name}</span>
                    <div className="text-[11px] text-slate-400">Headcount: {zone.cap} • Trend: {zone.trend}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        zone.status === 'critical'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : zone.status === 'moderate'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {zone.occ}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Automated Nudge Engine Log */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white">Nudge Engine Dispatch Feed</h3>
              <Badge variant="teal">Auto-Pilot Active</Badge>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-container">Gate 4 Reroute Push</span>
                  <span className="text-[10px] text-slate-500">2m ago</span>
                </div>
                <p className="text-slate-300">Redirected 340 incoming attendees to West Concourse Gate 2.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">Pavilion 2 Lunch Incentive</span>
                  <span className="text-[10px] text-slate-500">14m ago</span>
                </div>
                <p className="text-slate-300">Offered priority dining pass to divert 18% of lunch footfall from Central Court.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-secondary">Shuttle Line B Frequency Scaled</span>
                  <span className="text-[10px] text-slate-500">28m ago</span>
                </div>
                <p className="text-slate-300">Dispatched 2 reserve electric shuttles to absorb Metro surge.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
