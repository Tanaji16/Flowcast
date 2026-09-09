'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAlerts } from '@/hooks/useAlerts';
import { Bell, AlertTriangle, Info, CheckCircle2, Radio, Zap } from 'lucide-react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'alerts' | 'updates'>('all');
  const { alerts, loading, lastLiveEvent } = useAlerts();

  const filteredAlerts = alerts.filter((item) => {
    if (filter === 'alerts') return item.severity === 'critical' || item.severity === 'warning';
    if (filter === 'updates') return item.severity === 'info';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl text-on-surface tracking-tight">Notifications & Crowd Alerts</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 border border-emerald-500/25">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Realtime Active
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time logistical updates dispatched live by Supabase when zone status shifts.
          </p>
        </div>

        <div className="inline-flex rounded-full bg-surface-container p-1 self-start sm:self-auto">
          {(['all', 'alerts', 'updates'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer transition-all ${
                filter === f ? 'bg-white text-on-surface font-bold shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {lastLiveEvent && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs text-primary flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
          <Zap className="w-4 h-4 shrink-0 text-primary animate-bounce" />
          <span className="font-medium">Live Supabase Event Broadcast: {lastLiveEvent}</span>
        </div>
      )}

      {loading && alerts.length === 0 ? (
        <div className="p-8 text-center text-xs text-on-surface-variant">Connecting to Supabase Realtime feed...</div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((n) => (
            <Card key={n.id} className="p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      n.severity === 'critical'
                        ? 'bg-error-container/60 text-error'
                        : n.severity === 'warning'
                        ? 'bg-tertiary-fixed/40 text-tertiary-dark'
                        : 'bg-secondary/15 text-secondary'
                    }`}
                  >
                    {n.severity === 'critical' ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : n.severity === 'warning' ? (
                      <Info className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-on-surface">{n.title}</h3>
                      <Badge variant={n.severity === 'critical' ? 'coral' : n.severity === 'warning' ? 'amber' : 'teal'}>
                        {n.severity === 'critical' ? 'Urgent Alert' : n.severity === 'warning' ? 'Advisory' : 'Update'}
                      </Badge>
                      {n.isRealtime && (
                        <span className="px-2 py-0.2 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          LIVE PUSH
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{n.message}</p>
                    {n.zone_name && (
                      <span className="inline-block mt-2 text-[11px] font-semibold text-secondary">
                        Target Zone: {n.zone_name}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-on-surface-variant shrink-0 whitespace-nowrap">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container-high flex justify-end gap-2">
                <Link href="/alternatives">
                  <Button size="sm" variant="secondary" className="text-xs">
                    View Smart Alternatives →
                  </Button>
                </Link>
                <Link href="/map">
                  <Button size="sm" variant="outline" className="text-xs">
                    Inspect Map
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
