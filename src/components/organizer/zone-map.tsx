'use client';

import React from 'react';
import type { ZoneTelemetry } from '@/types/organizer.types';

export function ZoneMap({ zones }: { zones: ZoneTelemetry[] }) {
  return (
    <div className="relative h-96 w-full rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>LIVE TELEMETRY DIGITAL TWIN</span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          FEED ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h5 className="font-medium text-slate-200 text-sm">{zone.name}</h5>
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  zone.status === 'red'
                    ? 'bg-rose-950 text-rose-300'
                    : zone.status === 'yellow'
                    ? 'bg-amber-950 text-amber-300'
                    : 'bg-emerald-950 text-emerald-300'
                }`}
              >
                {zone.occupancyRate}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  zone.status === 'red'
                    ? 'bg-rose-500'
                    : zone.status === 'yellow'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${zone.occupancyRate}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>{zone.currentOccupancy} / {zone.maxCapacity}</span>
              <span className="capitalize">Trend: {zone.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-slate-500 text-right">
        Auto-refreshes via Supabase Realtime Channels
      </div>
    </div>
  );
}
