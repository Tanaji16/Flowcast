'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bus, Clock, ShieldCheck, Plus, Radio } from 'lucide-react';

const ROUTES = [
  {
    name: 'Supreme Court Metro ↔ Bharat Mandapam Gate 4',
    shuttles: 10,
    headway: 'Every 5 mins',
    avgQueue: '4 mins',
    flow: '1,420 pax/hr',
    status: 'optimal',
  },
  {
    name: 'Aerocity Hotel Hub ↔ Gate 2 West',
    shuttles: 8,
    headway: 'Every 8 mins',
    avgQueue: '6 mins',
    flow: '940 pax/hr',
    status: 'optimal',
  },
  {
    name: 'East Parking Lot Feeder ↔ South Pavilion',
    shuttles: 6,
    headway: 'Every 10 mins',
    avgQueue: '14 mins',
    flow: '720 pax/hr',
    status: 'congested',
  },
];

export default function OrganizerTransportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-white tracking-tight">Transport & Shuttle Fleet Telemetry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time fleet tracking, headway adherence, and gate queue wait times.
          </p>
        </div>
        <Button className="bg-primary-container text-white self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Dispatch Reserve Fleet</span>
        </Button>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Active Electric Shuttles</span>
          <div className="text-3xl font-extrabold text-white mt-1">24 Units</div>
          <span className="text-[11px] text-secondary font-semibold">100% Zero Emission Fleet</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Average Queue Wait Time</span>
          <div className="text-3xl font-extrabold text-secondary mt-1">8 Mins</div>
          <span className="text-[11px] text-secondary font-semibold">Saves 16m vs public transit</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Peak Flow Capacity</span>
          <div className="text-3xl font-extrabold text-white mt-1">3,080 pax/hr</div>
          <span className="text-[11px] text-slate-400">Current load: 74%</span>
        </div>
      </div>

      {/* Route List */}
      <div className="space-y-4">
        {ROUTES.map((route) => (
          <div
            key={route.name}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-secondary" />
                <h3 className="font-bold text-base text-white">{route.name}</h3>
                <Badge variant={route.status === 'optimal' ? 'teal' : 'amber'}>
                  {route.status === 'optimal' ? 'On Schedule' : 'Queue Spike'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Fleet: <strong>{route.shuttles} Shuttles</strong></span>
                <span>•</span>
                <span>Frequency: <strong>{route.headway}</strong></span>
                <span>•</span>
                <span>Avg Queue: <strong className="text-white">{route.avgQueue}</strong></span>
                <span>•</span>
                <span>Throughput: {route.flow}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary">
                Reroute Fleet
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
