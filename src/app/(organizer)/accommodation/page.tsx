'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hotel, Bed, ShieldCheck, Bus, Plus } from 'lucide-react';

const HOTELS = [
  {
    name: 'The Grand Heritage Annex (Pragati Maidan Partner)',
    address: 'Karasuma Concourse, New Delhi',
    totalRooms: 350,
    occupiedRooms: 312,
    rate: 89,
    shuttlesActive: 6,
    status: 'high',
  },
  {
    name: 'Aerocity Express Transit Hotel',
    address: 'Aerocity Hospitality District, Delhi',
    totalRooms: 500,
    occupiedRooms: 390,
    rate: 78,
    shuttlesActive: 8,
    status: 'optimal',
  },
  {
    name: 'Tech Park Overflow Dormitory Hub',
    address: 'East Noida Expo Corridor',
    totalRooms: 600,
    occupiedRooms: 150,
    rate: 25,
    shuttlesActive: 4,
    status: 'overflow-ready',
  },
];

export default function OrganizerAccommodationPage() {
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

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Total Partner Bed Inventory</span>
          <div className="text-3xl font-extrabold text-white mt-1">1,450 Beds</div>
          <span className="text-[11px] text-secondary font-semibold">3 Partner Venues Active</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Aggregate Occupancy</span>
          <div className="text-3xl font-extrabold text-amber-400 mt-1">79.2%</div>
          <span className="text-[11px] text-slate-400">1,148 Beds Allocated</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Overflow Capacity Available</span>
          <div className="text-3xl font-extrabold text-secondary mt-1">450 Beds</div>
          <span className="text-[11px] text-secondary font-semibold">Ready for immediate diversion</span>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="space-y-4">
        {HOTELS.map((hotel) => (
          <div
            key={hotel.name}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Hotel className="w-4 h-4 text-primary-container" />
                <h3 className="font-bold text-base text-white">{hotel.name}</h3>
                <Badge variant={hotel.rate > 85 ? 'amber' : 'teal'}>
                  {hotel.rate}% Booked
                </Badge>
              </div>
              <p className="text-xs text-slate-400">{hotel.address}</p>
              <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
                <span>Rooms: <strong>{hotel.occupiedRooms}</strong> / {hotel.totalRooms}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-secondary">
                  <Bus className="w-3.5 h-3.5" />
                  {hotel.shuttlesActive} Express Shuttles Linked
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary">
                Adjust Quota
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
