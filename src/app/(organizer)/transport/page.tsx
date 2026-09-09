'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { Bus, Clock, ShieldCheck, Plus, Radio } from 'lucide-react';

export default function OrganizerTransportPage() {
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    async function loadRoutes() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('transport_routes').select('*');
        if (data && data.length > 0) {
          setRoutes(data);
        } else {
          setRoutes([
            {
              id: 'r-1',
              route_name: 'Supreme Court Metro ↔ Bharat Mandapam Gate 4',
              frequency_minutes: 5,
              current_delay_minutes: 0,
              status: 'normal',
              capacity: 100,
            },
            {
              id: 'r-2',
              route_name: 'Aerocity Hotel Hub ↔ Gate 2 West',
              frequency_minutes: 8,
              current_delay_minutes: 2,
              status: 'normal',
              capacity: 100,
            },
            {
              id: 'r-3',
              route_name: 'East Parking Lot Feeder ↔ South Pavilion',
              frequency_minutes: 10,
              current_delay_minutes: 8,
              status: 'delayed',
              capacity: 80,
            },
          ]);
        }
      } catch (err) {
        console.warn('Transport routes load error:', err);
      }
    }
    loadRoutes();
  }, []);

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Active Electric Shuttles</span>
          <div className="text-3xl font-extrabold text-white mt-1">24 Units</div>
          <span className="text-[11px] text-secondary font-semibold">100% Zero Emission Fleet</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Average Queue Wait Time</span>
          <div className="text-3xl font-extrabold text-white mt-1">4.2 mins</div>
          <span className="text-[11px] text-secondary font-semibold">-55% vs unmanaged hubs</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Transit Routes Connected</span>
          <div className="text-3xl font-extrabold text-white mt-1">{routes.length} Corridors</div>
          <span className="text-[11px] text-secondary font-semibold">Supabase transport_routes</span>
        </div>
      </div>

      <div className="space-y-4">
        {routes.map((route) => (
          <div key={route.id || route.route_name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary-container flex items-center justify-center shrink-0">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{route.route_name}</h3>
                  <p className="text-xs text-slate-400">Headway: Every {route.frequency_minutes} mins • Delay: {route.current_delay_minutes} mins</p>
                </div>
              </div>

              <Badge variant={route.status === 'delayed' ? 'amber' : 'teal'}>
                {route.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
