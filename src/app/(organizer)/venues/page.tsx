'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Sliders, ShieldCheck } from 'lucide-react';

const VENUES = [
  {
    name: 'Bharat Mandapam & Pragati Maidan',
    location: 'New Delhi, Delhi NCR',
    totalCap: 18000,
    activeAttendees: 14200,
    safeThreshold: 85,
    sensors: '142 Turnstiles • 48 WiFi Nodes',
  },
  {
    name: 'Jio World Convention Centre',
    location: 'Bandra Kurla Complex, Mumbai',
    totalCap: 12000,
    activeAttendees: 9800,
    safeThreshold: 85,
    sensors: '96 Turnstiles • 32 WiFi Nodes',
  },
  {
    name: 'BIEC Exhibition Centre',
    location: 'Madavara, Bengaluru',
    totalCap: 15000,
    activeAttendees: 11400,
    safeThreshold: 85,
    sensors: '110 Turnstiles • 40 WiFi Nodes',
  },
  {
    name: 'HICC Novotel Campus',
    location: 'HITEC City, Hyderabad',
    totalCap: 9000,
    activeAttendees: 6400,
    safeThreshold: 85,
    sensors: '72 Turnstiles • 24 WiFi Nodes',
  },
];

export default function OrganizerVenuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-white tracking-tight">Venues & Safety Thresholds</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure maximum fire code occupancy limits and automated trigger thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VENUES.map((venue) => {
          const occPercent = Math.round((venue.activeAttendees / venue.totalCap) * 100);
          return (
            <div key={venue.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-container" />
                    <h3 className="font-bold text-base text-white">{venue.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{venue.location}</p>
                </div>
                <Badge variant={occPercent > 80 ? 'amber' : 'teal'}>
                  {occPercent}% Live
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Current Headcount</span>
                  <span className="font-mono font-bold text-white">{venue.activeAttendees.toLocaleString()} / {venue.totalCap.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-container"
                    style={{ width: `${occPercent}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Telemetric Sensors</span>
                <span className="text-slate-200 font-semibold">{venue.sensors}</span>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" variant="secondary">
                  <Sliders className="w-3.5 h-3.5 mr-1" />
                  <span>Configure Thresholds</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
