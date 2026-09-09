'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Calendar, QrCode, Clock, MapPin, Shuffle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2' | 'day3'>('day1');
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);

  const SCHEDULE_ITEMS = [
    {
      id: 'it-1',
      time: '09:00 AM - 10:00 AM',
      title: 'Morning Registration & RFID Badge Activation',
      location: 'Gate 4 North • FastTrack Entrance',
      status: 'completed',
      occupancy: 45,
      passId: 'PASS-9482',
    },
    {
      id: 'it-2',
      time: '10:30 AM - 12:00 PM',
      title: 'Keynote: Intelligent Spatial Flow & Urban Scale Infrastructure',
      location: 'Plenary Hall A',
      status: 'upcoming',
      occupancy: 82,
      congestion: 'moderate',
      passId: 'PASS-9483',
    },
    {
      id: 'it-3',
      time: '12:30 PM - 01:45 PM',
      title: 'Networking Lunch & Expo Showcase',
      location: 'Dining Pavilion 2 (Alternative Low-Queue Hub)',
      status: 'upcoming',
      occupancy: 38,
      congestion: 'safe',
      passId: 'PASS-9484',
    },
    {
      id: 'it-4',
      time: '02:15 PM - 03:45 PM',
      title: 'Technical Deep-Dive: Autonomous Crowd Rerouting Algorithms',
      location: 'Hall 3 Tech Stage',
      status: 'upcoming',
      occupancy: 60,
      congestion: 'safe',
      passId: 'PASS-9485',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">Full Event Schedule</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Personalized agenda synchronized with real-time zone congestion telemetry.
          </p>
        </div>
        
        {/* Day Selector Tabs */}
        <div className="inline-flex rounded-full bg-surface-container p-1 self-start sm:self-auto">
          {(['day1', 'day2', 'day3'] as const).map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-white text-on-surface shadow-xs font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Day {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {SCHEDULE_ITEMS.map((item) => (
          <Card key={item.id} className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-on-surface">{item.time}</span>
                  <span className="text-on-surface-variant">•</span>
                  <Badge
                    variant={
                      item.status === 'completed'
                        ? 'teal'
                        : item.congestion === 'moderate'
                        ? 'amber'
                        : 'teal'
                    }
                  >
                    {item.status === 'completed'
                      ? 'Completed'
                      : `Occupancy ${item.occupancy}%`}
                  </Badge>
                </div>
                <h3 className="font-bold text-base text-on-surface">{item.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5 text-secondary" />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveModalItem(item)}
                >
                  <QrCode className="w-3.5 h-3.5 mr-1" />
                  <span>FastTrack Pass</span>
                </Button>
                <Link href="/alternatives">
                  <Button variant="ghost" size="sm">
                    <Shuffle className="w-3.5 h-3.5 mr-1" />
                    <span>Alternatives</span>
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* QR Pass Modal */}
      <Modal
        isOpen={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
        title="FastTrack Access Pass"
        description="Present this verified QR code at gate turnstiles for contact-free entry"
      >
        {activeModalItem && (
          <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-primary-container shadow-sm">
              {/* Stylized QR placeholder */}
              <div className="w-44 h-44 bg-surface-container flex flex-col items-center justify-center rounded-xl p-2">
                <QrCode className="w-32 h-32 text-charcoal" />
                <span className="text-[10px] font-mono text-on-surface-variant mt-1">
                  {activeModalItem.passId}
                </span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-sm text-on-surface">{activeModalItem.title}</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">{activeModalItem.location}</p>
            </div>
            <Button className="w-full" onClick={() => setActiveModalItem(null)}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
