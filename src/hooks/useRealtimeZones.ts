'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ZoneTelemetry } from '@/types/organizer.types';

export function useRealtimeZones() {
  const [zones, setZones] = useState<ZoneTelemetry[]>([
    {
      id: 'z-1',
      name: 'Main Entrance & Registration',
      venueName: 'Expo Center North',
      currentOccupancy: 840,
      maxCapacity: 1000,
      occupancyRate: 84,
      status: 'yellow',
      trend: 'rising',
    },
    {
      id: 'z-2',
      name: 'Keynote Grand Hall',
      venueName: 'Expo Center North',
      currentOccupancy: 1920,
      maxCapacity: 2000,
      occupancyRate: 96,
      status: 'red',
      trend: 'rising',
    },
    {
      id: 'z-3',
      name: 'Tech Pavilion South',
      venueName: 'Expo Center South',
      currentOccupancy: 420,
      maxCapacity: 1200,
      occupancyRate: 35,
      status: 'green',
      trend: 'steady',
    },
  ]);

  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-zones')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'zones' },
        (payload) => {
          const updated = payload.new as any;
          setZones((prev) =>
            prev.map((zone) =>
              zone.id === updated.id
                ? {
                    ...zone,
                    currentOccupancy: updated.current_occupancy,
                    occupancyRate: Math.round(
                      (updated.current_occupancy / zone.maxCapacity) * 100
                    ),
                    status: updated.status === 'critical' ? 'red' : updated.status === 'moderate' ? 'yellow' : 'green',
                  }
                : zone
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  return { zones };
}
