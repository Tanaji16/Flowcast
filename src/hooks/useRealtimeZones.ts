'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ZoneTelemetry } from '@/types/organizer.types';

const INITIAL_FALLBACK_ZONES: ZoneTelemetry[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Main Exhibition Hall A',
    venueName: 'Moscone Convention Center',
    currentOccupancy: 4600,
    maxCapacity: 5000,
    occupancyRate: 92,
    status: 'red',
    trend: 'rising',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Keynote Grand Auditorium',
    venueName: 'Moscone Convention Center',
    currentOccupancy: 3560,
    maxCapacity: 4000,
    occupancyRate: 89,
    status: 'red',
    trend: 'rising',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'West Food & Dining Plaza',
    venueName: 'Moscone Convention Center',
    currentOccupancy: 1750,
    maxCapacity: 2500,
    occupancyRate: 70,
    status: 'yellow',
    trend: 'rising',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'South Tech Pavilion & Demos',
    venueName: 'Moscone Convention Center',
    currentOccupancy: 1800,
    maxCapacity: 3000,
    occupancyRate: 60,
    status: 'yellow',
    trend: 'steady',
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'East Networking Lounge & Sanctuary',
    venueName: 'Moscone Convention Center',
    currentOccupancy: 420,
    maxCapacity: 1500,
    occupancyRate: 28,
    status: 'green',
    trend: 'steady',
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Waterfront Pier 48 Satellite Hub',
    venueName: 'Chase Center Area',
    currentOccupancy: 380,
    maxCapacity: 2000,
    occupancyRate: 19,
    status: 'green',
    trend: 'declining',
  },
];

function mapDbRowToTelemetry(row: any): ZoneTelemetry {
  const maxCap = row.max_capacity || 1000;
  const currentOcc = row.current_occupancy || 0;
  const occRate =
    row.occupancy_percent !== undefined && row.occupancy_percent !== null
      ? row.occupancy_percent
      : Math.round((currentOcc / maxCap) * 100);

  let status: 'green' | 'yellow' | 'red' = 'green';
  if (row.status === 'critical' || row.status === 'red' || occRate >= 85) {
    status = 'red';
  } else if (row.status === 'moderate' || row.status === 'amber' || row.status === 'warning' || occRate >= 60) {
    status = 'yellow';
  }

  let trend: 'rising' | 'steady' | 'declining' = 'steady';
  if (occRate > 80) trend = 'rising';
  else if (occRate < 40) trend = 'declining';

  return {
    id: row.id,
    name: row.name,
    venueName: 'Flowcast Digital Twin',
    currentOccupancy: currentOcc,
    maxCapacity: maxCap,
    occupancyRate: occRate,
    status,
    trend,
  };
}

export function useRealtimeZones() {
  const [zones, setZones] = useState<ZoneTelemetry[]>(INITIAL_FALLBACK_ZONES);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const supabase = createClient();

  useEffect(() => {
    async function fetchInitialZones() {
      try {
        const { data, error } = await (supabase.from('zones') as any).select('*').order('name');
        if (!error && data && data.length > 0) {
          setZones((data as any[]).map(mapDbRowToTelemetry));
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.warn('Initial zones fetch error, using local fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialZones();

    // Set up Supabase Realtime channel for live zone changes
    const channel = supabase
      .channel('realtime:public:zones')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'zones' },
        (payload) => {
          setLastUpdated(new Date());

          if (payload.eventType === 'INSERT') {
            const newZone = mapDbRowToTelemetry(payload.new);
            setZones((prev) => [...prev.filter((z) => z.id !== newZone.id), newZone]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = mapDbRowToTelemetry(payload.new);
            setZones((prev) =>
              prev.map((zone) => (zone.id === updated.id ? updated : zone))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any)?.id;
            if (deletedId) {
              setZones((prev) => prev.filter((z) => z.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Helper function to update zone in database (triggers realtime broadcast to all listeners)
  const updateZoneStatus = useCallback(
    async (zoneId: string, currentOccupancy: number, status: 'green' | 'amber' | 'red') => {
      // Optimistic local update
      setZones((prev) =>
        prev.map((z) => {
          if (z.id === zoneId) {
            const occRate = Math.round((currentOccupancy / z.maxCapacity) * 100);
            return {
              ...z,
              currentOccupancy,
              occupancyRate: occRate,
              status: status === 'red' ? 'red' : status === 'amber' ? 'yellow' : 'green',
            };
          }
          return z;
        })
      );

      try {
        await (supabase.from('zones') as any)
          .update({
            current_occupancy: currentOccupancy,
            occupancy_percent: Math.round(
              (currentOccupancy / (zones.find((z) => z.id === zoneId)?.maxCapacity || 1000)) * 100
            ),
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', zoneId);
      } catch (err) {
        console.warn('Realtime update broadcast attempt:', err);
      }
    },
    [supabase, zones]
  );

  return { zones, loading, lastUpdated, updateZoneStatus };
}
