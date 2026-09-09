'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Sliders, ShieldCheck } from 'lucide-react';

export default function OrganizerVenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    async function loadVenues() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('venues').select('*, zones(*)');
        if (data && data.length > 0) {
          setVenues(data);
        } else {
          setVenues([
            {
              id: 'v-1',
              name: 'Bharat Mandapam & Pragati Maidan',
              location: 'New Delhi, Delhi NCR',
              total_capacity: 18000,
              activeAttendees: 14200,
              sensors: '142 Turnstiles • 48 WiFi Nodes',
            },
            {
              id: 'v-2',
              name: 'Jio World Convention Centre',
              location: 'Bandra Kurla Complex, Mumbai',
              total_capacity: 12000,
              activeAttendees: 9800,
              sensors: '96 Turnstiles • 32 WiFi Nodes',
            },
            {
              id: 'v-3',
              name: 'BIEC Exhibition Centre',
              location: 'Madavara, Bengaluru',
              total_capacity: 15000,
              activeAttendees: 11400,
              sensors: '110 Turnstiles • 40 WiFi Nodes',
            },
            {
              id: 'v-4',
              name: 'HICC Novotel Campus',
              location: 'HITEC City, Hyderabad',
              total_capacity: 9000,
              activeAttendees: 6400,
              sensors: '72 Turnstiles • 24 WiFi Nodes',
            },
          ]);
        }
      } catch (err) {
        console.warn('Venues load error:', err);
      }
    }
    loadVenues();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-white tracking-tight">Venues & Safety Thresholds</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure maximum fire code occupancy limits and automated trigger thresholds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {venues.map((venue) => {
          const cap = venue.total_capacity || 10000;
          const active = venue.activeAttendees || Math.round(cap * 0.75);
          const occPercent = Math.round((active / cap) * 100);

          return (
            <div key={venue.id || venue.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{venue.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    {venue.location}
                  </p>
                </div>
                <Badge variant={occPercent > 85 ? 'coral' : 'teal'}>
                  {occPercent}% Occupancy
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Current Live Load</span>
                  <span>{active.toLocaleString()} / {cap.toLocaleString()} capacity</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${occPercent > 85 ? 'bg-primary-container' : 'bg-secondary'}`}
                    style={{ width: `${occPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800">
                <span>{venue.sensors || 'Connected Sensors Active'}</span>
                <Button variant="ghost" size="sm" className="text-secondary hover:text-white p-0">
                  Configure Trigger →
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
