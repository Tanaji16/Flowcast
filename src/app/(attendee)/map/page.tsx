'use client';

import React, { useState } from 'react';
import { IndiaMap, type EventVenue, type UserLocationState, type NearestVenueInfo } from '@/components/shared/india-map';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Navigation, Info, Shuffle, ShieldCheck, MapPin, Compass, ArrowRight } from 'lucide-react';

export default function AttendeeMapPage() {
  const [selectedZoneName, setSelectedZoneName] = useState<string>('Gate 4 North FastTrack');
  const [activeVenue, setActiveVenue] = useState<EventVenue | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocationState | null>(null);
  const [nearestVenue, setNearestVenue] = useState<NearestVenueInfo | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">Interactive Map & Live Navigation</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time digital twin monitoring crowd flow, queue lengths, and low-congestion sanctuary paths across India.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {nearestVenue ? (
            <Badge variant="teal" className="gap-1 text-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>{nearestVenue.distanceKm} km from {nearestVenue.venue.city}</span>
            </Badge>
          ) : (
            <Badge variant="teal">Live Sensor Telemetry</Badge>
          )}
        </div>
      </div>

      {/* Main Map Component with Geolocation & Location Dropdown */}
      <IndiaMap
        variant="attendee"
        onSelectZone={(zone) => setSelectedZoneName(zone)}
        onSelectVenue={(venue) => setActiveVenue(venue)}
        onUserLocationChange={(loc, nearest) => {
          setUserLocation(loc);
          setNearestVenue(nearest);
        }}
      />

      {/* Selected Zone / Live Advisory Card */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  {activeVenue ? activeVenue.name : 'Target Destination'}
                </span>
                <Badge variant="neutral">
                  Estimated Walk: ~{selectedZoneName.toLowerCase().includes('gate') ? '4 mins' : '2 mins'}
                </Badge>
                {nearestVenue && (
                  <Badge variant="teal">
                    Proximity: {nearestVenue.distanceKm} km away
                  </Badge>
                )}
              </div>

              <h3 className="font-bold text-base text-on-surface mt-1">{selectedZoneName}</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {selectedZoneName.toLowerCase().includes('gate') || selectedZoneName.toLowerCase().includes('hall')
                  ? 'High density predicted. Recommended approach via covered West Concourse or alternative gates.'
                  : 'Low congestion sanctuary. Ideal for quiet workspace, meetings, and quick check-in.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/alternatives?zone_id=${encodeURIComponent(selectedZoneName)}`}>
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Shuffle className="w-3.5 h-3.5" />
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

