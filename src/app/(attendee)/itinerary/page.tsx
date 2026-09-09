'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Calendar, QrCode, Clock, MapPin, Shuffle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ItineraryPage() {
  const [selectedDay, setSelectedDay] = useState<'day1' | 'day2' | 'day3'>('day1');
  const [activeModalItem, setActiveModalItem] = useState<any | null>(null);
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [liveZones, setLiveZones] = useState<any[]>([]);

  useEffect(() => {
    async function loadItineraryData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Query bookings table
        if (user) {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id);
          if (bookings && bookings.length > 0) {
            setDbBookings(bookings);
          }
        }

        // 2. Query zones table for live occupancy
        const { data: zones } = await supabase.from('zones').select('*');
        if (zones && zones.length > 0) {
          setLiveZones(zones);
        }
      } catch (err) {
        console.warn('Itinerary Supabase load error:', err);
      }
    }

    loadItineraryData();
  }, []);

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
      occupancy: liveZones.find(z => z.name?.includes('Plenary'))?.occupancy_percent || 82,
      congestion: 'moderate',
      passId: 'PASS-9483',
    },
    {
      id: 'it-3',
      time: '12:30 PM - 01:45 PM',
      title: 'Networking Lunch & Expo Showcase',
      location: 'Dining Pavilion 2 (Alternative Low-Queue Hub)',
      status: 'upcoming',
      occupancy: liveZones.find(z => z.name?.includes('Food') || z.name?.includes('Dining'))?.occupancy_percent || 38,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">Smart Attendee Schedule</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Synchronized with live turnstile occupancy to recommend optimal transit departures.
          </p>
        </div>

        {/* Day Selector */}
        <div className="inline-flex rounded-full bg-surface-container p-1 self-start sm:self-auto">
          {(['day1', 'day2', 'day3'] as const).map((day, idx) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                selectedDay === day
                  ? 'bg-primary-container text-white shadow-xs'
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
          <Card key={item.id} className="p-5 hover:border-secondary/40 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    {item.time}
                  </span>
                  {item.status === 'completed' ? (
                    <Badge variant="teal">Completed</Badge>
                  ) : item.occupancy >= 80 ? (
                    <Badge variant="coral">Crowd Advisory: {item.occupancy}% Full</Badge>
                  ) : (
                    <Badge variant="neutral">Scheduled</Badge>
                  )}
                </div>

                <h3 className="font-bold text-base text-on-surface">{item.title}</h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-outline" />
                  {item.location}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                {item.occupancy >= 80 && (
                  <Link href="/alternatives">
                    <Button variant="secondary" size="sm" className="text-xs">
                      <Shuffle className="w-3.5 h-3.5 mr-1" />
                      <span>Reroute</span>
                    </Button>
                  </Link>
                )}
                <Button
                  size="sm"
                  onClick={() => setActiveModalItem(item)}
                  className="text-xs cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 mr-1.5" />
                  <span>View Pass</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for QR Pass */}
      <Modal
        isOpen={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
        title="Digital FastTrack Access Pass"
      >
        {activeModalItem && (
          <div className="space-y-4 text-center py-2">
            <div className="p-6 rounded-2xl bg-white border border-outline-subtle inline-block shadow-sm">
              <div className="w-44 h-44 mx-auto bg-surface-container-high rounded-xl flex flex-col items-center justify-center text-outline">
                <QrCode className="w-28 h-28 text-charcoal stroke-1" />
                <span className="text-[10px] font-mono text-outline mt-2 font-bold tracking-widest">
                  {activeModalItem.passId}
                </span>
              </div>
            </div>

            <div className="text-left space-y-1 bg-surface-container-low p-4 rounded-xl text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Session:</span>
                <span className="font-bold text-on-surface">{activeModalItem.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Venue:</span>
                <span className="font-bold text-on-surface">{activeModalItem.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Encrypted Key:</span>
                <span className="font-mono text-secondary font-bold">SHA256: 8f4b...19a2</span>
              </div>
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
