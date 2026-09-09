'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  created_at: string;
  zone_id?: string | null;
  zone_name?: string | null;
  isRealtime?: boolean;
}

const DEFAULT_DEMO_NOTIFICATIONS: AlertItem[] = [
  {
    id: 'n-1',
    title: 'Main Exhibition Hall Surge Alert',
    message: 'Incoming crowd surge reported at Main Hall A. Please use West Plaza for immediate entry.',
    severity: 'critical',
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    zone_name: 'Main Exhibition Hall A',
  },
  {
    id: 'n-2',
    title: 'Lunch Reroute Suggestion Available',
    message: 'Central Dining Hall has reached 85% capacity. East Networking Lounge has zero wait time right now.',
    severity: 'warning',
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    zone_name: 'West Food Plaza',
  },
  {
    id: 'n-3',
    title: 'Plenary Session FastTrack Reminder',
    message: 'Keynote Spatial AI session begins shortly in Plenary Hall A. FastTrack turnstiles are active.',
    severity: 'info',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    zone_name: 'Plenary Summit Stage',
  },
];

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>(DEFAULT_DEMO_NOTIFICATIONS);
  const [loading, setLoading] = useState(true);
  const [lastLiveEvent, setLastLiveEvent] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const { data, error } = await (supabase.from('alerts') as any)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(15);

        if (!error && data && data.length > 0) {
          const dbAlerts: AlertItem[] = (data as any[]).map((a) => ({
            id: a.id,
            title: a.title || 'System Notification',
            message: a.message,
            severity: a.severity || 'info',
            created_at: a.created_at || new Date().toISOString(),
            zone_id: a.zone_id,
          }));

          setAlerts((prev) => {
            const existingIds = new Set(dbAlerts.map((d) => d.id));
            const merged = [...dbAlerts, ...prev.filter((p) => !existingIds.has(p.id))];
            return merged;
          });
        }
      } catch (err) {
        console.warn('Alerts fetch notice:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();

    // 1. Subscribe to live changes in 'alerts' table
    const alertsChannel = supabase
      .channel('realtime:attendee:alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          const newAlert: AlertItem = {
            id: payload.new.id,
            title: payload.new.title || 'Live Crowd Alert',
            message: payload.new.message,
            severity: payload.new.severity || 'info',
            created_at: payload.new.created_at || new Date().toISOString(),
            zone_id: payload.new.zone_id,
            isRealtime: true,
          };
          setLastLiveEvent(`New alert: ${newAlert.title}`);
          setAlerts((prev) => [newAlert, ...prev]);
        }
      )
      .subscribe();

    // 2. Subscribe to live changes in 'zones' table (updates attendee alerts live on status change)
    const zonesChannel = supabase
      .channel('realtime:attendee:zones')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'zones' },
        (payload) => {
          const updatedZone = payload.new as any;
          const status = updatedZone.status;
          const occ =
            updatedZone.occupancy_percent ||
            Math.round(((updatedZone.current_occupancy || 0) / (updatedZone.max_capacity || 1000)) * 100);

          // If zone changes to critical or warning, push live attendee notification instantly
          if (status === 'critical' || status === 'red' || occ >= 85) {
            const zoneAlert: AlertItem = {
              id: `zone-alert-${updatedZone.id}-${Date.now()}`,
              title: `${updatedZone.name} Congestion Warning`,
              message: `Live telemetry update: ${updatedZone.name} reached ${occ}% capacity. Flowcast Nudge Engine recommends moving to alternative low-crowd zones.`,
              severity: 'critical',
              created_at: new Date().toISOString(),
              zone_id: updatedZone.id,
              zone_name: updatedZone.name,
              isRealtime: true,
            };
            setLastLiveEvent(`Zone congestion spike: ${updatedZone.name}`);
            setAlerts((prev) => [zoneAlert, ...prev]);
          } else if (status === 'moderate' || status === 'amber' || occ >= 65) {
            const zoneNotice: AlertItem = {
              id: `zone-notice-${updatedZone.id}-${Date.now()}`,
              title: `${updatedZone.name} Crowd Advisory`,
              message: `Traffic increasing at ${updatedZone.name} (${occ}% capacity). Expect slight transit wait times.`,
              severity: 'warning',
              created_at: new Date().toISOString(),
              zone_id: updatedZone.id,
              zone_name: updatedZone.name,
              isRealtime: true,
            };
            setLastLiveEvent(`Zone advisory: ${updatedZone.name}`);
            setAlerts((prev) => [zoneNotice, ...prev]);
          } else if (status === 'green' || status === 'low') {
            const zoneClear: AlertItem = {
              id: `zone-clear-${updatedZone.id}-${Date.now()}`,
              title: `${updatedZone.name} Flow Restored`,
              message: `Congestion alleviated at ${updatedZone.name}. Current capacity is now ${occ}% with open access.`,
              severity: 'info',
              created_at: new Date().toISOString(),
              zone_id: updatedZone.id,
              zone_name: updatedZone.name,
              isRealtime: true,
            };
            setLastLiveEvent(`Zone cleared: ${updatedZone.name}`);
            setAlerts((prev) => [zoneClear, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(zonesChannel);
    };
  }, [supabase]);

  return { alerts, loading, lastLiveEvent };
}
