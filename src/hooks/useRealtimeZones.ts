'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ZoneTelemetry } from '@/types/organizer.types';

const INITIAL_FALLBACK_ZONES: ZoneTelemetry[] = [
  {
    id: 'delhi-z1',
    name: 'Gate 4 North FastTrack',
    venueName: 'Bharat Mandapam',
    currentOccupancy: 1840,
    maxCapacity: 2000,
    occupancyRate: 92,
    status: 'red',
    trend: 'rising',
  },
  {
    id: 'delhi-z2',
    name: 'Plenary Summit Hall A',
    venueName: 'Bharat Mandapam',
    currentOccupancy: 3440,
    maxCapacity: 4000,
    occupancyRate: 86,
    status: 'red',
    trend: 'rising',
  },
  {
    id: 'delhi-z3',
    name: 'Central Food Court',
    venueName: 'Bharat Mandapam',
    currentOccupancy: 1700,
    maxCapacity: 2500,
    occupancyRate: 68,
    status: 'yellow',
    trend: 'rising',
  },
  {
    id: 'delhi-z4',
    name: 'Innovation Expo Pavilion 2',
    venueName: 'Bharat Mandapam',
    currentOccupancy: 1260,
    maxCapacity: 3000,
    occupancyRate: 42,
    status: 'green',
    trend: 'steady',
  },
  {
    id: 'delhi-z5',
    name: 'Supreme Court Metro Shuttle Hub',
    venueName: 'Delhi NCR Transit',
    currentOccupancy: 700,
    maxCapacity: 2000,
    occupancyRate: 35,
    status: 'green',
    trend: 'declining',
  },
  {
    id: 'mum-z1',
    name: 'Grand Pavilion East',
    venueName: 'Jio World Centre',
    currentOccupancy: 1560,
    maxCapacity: 3000,
    occupancyRate: 52,
    status: 'green',
    trend: 'steady',
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
