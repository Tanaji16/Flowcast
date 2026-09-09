'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Bell, AlertTriangle, Info, CheckCircle2, Clock, Shuffle } from 'lucide-react';

export default function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'alerts' | 'updates'>('all');

  const NOTIFICATIONS = [
    {
      id: 'n-1',
      title: 'Gate 4 North Congestion Warning',
      desc: 'Incoming crowd surge reported at Gate 4. Please use West Entrance Gate 2 for immediate entry.',
      severity: 'coral',
      type: 'Congestion Alert',
      time: '3 mins ago',
      actionUrl: '/map',
      actionLabel: 'View Gate on Map',
    },
    {
      id: 'n-2',
      title: 'Lunch Reroute Suggestion Available',
      desc: 'Central Dining Hall has reached 85% capacity. Pavilion 2 has zero wait time right now.',
      severity: 'amber',
      type: 'Nudge Engine',
      time: '18 mins ago',
      actionUrl: '/alternatives',
      actionLabel: 'View Alternative Dining',
    },
    {
      id: 'n-3',
      title: 'Plenary Session Starts in 30 Mins',
      desc: 'Real-time Spatial AI talk begins at 01:15 PM in Plenary Hall A. FastTrack turnstiles are open.',
      severity: 'teal',
      type: 'Schedule Reminder',
      time: '45 mins ago',
      actionUrl: '/itinerary',
      actionLabel: 'Open FastTrack Pass',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">Notifications & Crowd Alerts</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time logistical updates dispatched by the Flowcast Nudge Engine.
          </p>
        </div>
        <div className="inline-flex rounded-full bg-surface-container p-1 self-start sm:self-auto">
          {(['all', 'alerts', 'updates'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize cursor-pointer ${
                filter === f ? 'bg-white text-on-surface font-bold shadow-xs' : 'text-on-surface-variant'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {NOTIFICATIONS.map((n) => (
          <Card key={n.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    n.severity === 'coral'
                      ? 'bg-error-container/60 text-error'
                      : n.severity === 'amber'
                      ? 'bg-tertiary-fixed/40 text-tertiary-dark'
                      : 'bg-secondary/15 text-secondary'
                  }`}
                >
                  {n.severity === 'coral' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.severity === 'amber' ? (
                    <Info className="w-4 h-4" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-on-surface">{n.title}</h3>
                    <Badge variant={n.severity as any}>{n.type}</Badge>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{n.desc}</p>
                </div>
              </div>
              <span className="text-[10px] text-on-surface-variant shrink-0">{n.time}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-container-high flex justify-end">
              <Link href={n.actionUrl}>
                <Button size="sm" variant="secondary" className="text-xs">
                  {n.actionLabel} →
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
