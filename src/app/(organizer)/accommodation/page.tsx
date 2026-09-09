'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { Hotel, Bed, ShieldCheck, Bus, Plus } from 'lucide-react';

export default function OrganizerAccommodationPage() {
  const [hotels, setHotels] = useState<any[]>([]);

  useEffect(() => {
    async function loadHotels() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('hotels').select('*');
        if (data && data.length > 0) {
          setHotels(data);
        } else {
          setHotels([
            {
              id: 'h-1',
              name: 'The Grand Heritage Annex (Pragati Maidan Partner)',
              address: 'Karasuma Concourse, New Delhi',
              total_rooms: 350,
              available_rooms: 38,
              rate: 89,
              shuttlesActive: 6,
            },
            {
              id: 'h-2',
              name: 'Aerocity Express Transit Hotel',
              address: 'Aerocity Hospitality District, Delhi',
              total_rooms: 500,
              available_rooms: 110,
              rate: 78,
              shuttlesActive: 8,
            },
            {
              id: 'h-3',
              name: 'Tech Park Overflow Dormitory Hub',
              address: 'East Noida Expo Corridor',
              total_rooms: 600,
              available_rooms: 450,
              rate: 25,
              shuttlesActive: 4,
            },
          ]);
        }
      } catch (err) {
        console.warn('Hotels load error:', err);
      }
    }
    loadHotels();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-white tracking-tight">Accommodation Load Balancing</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor partner room inventories and trigger overflow lodging allocations.
          </p>
        </div>
        <Button className="bg-secondary text-white self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Partner Lodging</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Total Partner Bed Inventory</span>
          <div className="text-3xl font-extrabold text-white mt-1">1,450 Beds</div>
          <span className="text-[11px] text-secondary font-semibold">3 Partner Venues Active</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Average Occupancy Rate</span>
          <div className="text-3xl font-extrabold text-white mt-1">68.2%</div>
          <span className="text-[11px] text-secondary font-semibold">Optimal capacity margin</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Connected Shuttle Routes</span>
          <div className="text-3xl font-extrabold text-white mt-1">18 Shuttles</div>
          <span className="text-[11px] text-secondary font-semibold">Dedicated express corridors</span>
        </div>
      </div>

      <div className="space-y-4">
        {hotels.map((h) => {
          const total = h.total_rooms || 100;
          const available = h.available_rooms || 20;
          const occupied = total - available;
          const occPercent = Math.round((occupied / total) * 100);

          return (
            <div key={h.id || h.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                    <Hotel className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{h.name}</h3>
                    <p className="text-xs text-slate-400">{h.address}</p>
                  </div>
                </div>

                <Badge variant={occPercent > 85 ? 'coral' : 'teal'}>
                  {occPercent}% Occupancy
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Room Inventory Allocation</span>
                  <span>{occupied} / {total} Rooms Occupied</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${occPercent > 85 ? 'bg-primary-container' : 'bg-secondary'}`}
                    style={{ width: `${occPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
