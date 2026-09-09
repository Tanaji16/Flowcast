'use client';

import React, { useState } from 'react';
import { IndiaMap } from '@/components/shared/india-map';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Navigation, Info, Shuffle, ShieldCheck } from 'lucide-react';

export default function AttendeeMapPage() {
  const [selectedZoneName, setSelectedZoneName] = useState<string>('Gate 4 North FastTrack');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">Interactive Map & Nearby</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Default center set to India [lat: 20.5937, lng: 78.9629, zoom 5]. Click any venue or zone to zoom in.
          </p>
        </div>
        <Badge variant="teal">Live Sensor Telemetry</Badge>
      </div>

      {/* Main Map Component */}
      <IndiaMap
        variant="attendee"
        onSelectZone={(zone) => setSelectedZoneName(zone)}
      />

      {/* Selected Zone Quick Advisory Card */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Selected Destination</span>
                <Badge variant="neutral">Estimated Walk: ~3 mins</Badge>
              </div>
              <h3 className="font-bold text-base text-on-surface mt-0.5">{selectedZoneName}</h3>
              <p className="text-xs text-on-surface-variant">
                Recommended approach via West Concourse for low congestion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/alternatives">
              <Button variant="secondary" size="sm">
                <Shuffle className="w-3.5 h-3.5 mr-1" />
                <span>Find Alternatives</span>
              </Button>
            </Link>
            <Link href="/itinerary">
              <Button size="sm">Add to Schedule</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
