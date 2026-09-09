'use client';

import { useState } from 'react';
import type { ItineraryItem } from '@/types/attendee.types';

export function useItinerary() {
  const [items] = useState<ItineraryItem[]>([
    {
      id: '1',
      title: 'Keynote Address: Future of AI & Spatial Flow',
      location: 'Main Auditorium A',
      zoneId: 'zone-auditorium-a',
      startTime: '09:30 AM',
      endTime: '11:00 AM',
      congestionStatus: 'high',
      isAlternativeSuggested: true,
    },
    {
      id: '2',
      title: 'Networking Lunch & Expo Exploration',
      location: 'Dining Hall Pavilion 2',
      zoneId: 'zone-pavilion-2',
      startTime: '11:15 AM',
      endTime: '12:45 PM',
      congestionStatus: 'moderate',
    },
    {
      id: '3',
      title: 'Breakout Session: Real-Time Telemetry',
      location: 'Hall B - Room 104',
      zoneId: 'zone-hall-b',
      startTime: '01:00 PM',
      endTime: '02:30 PM',
      congestionStatus: 'low',
    },
  ]);

  return { items };
}
