'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ShieldCheck,
  Users,
  Info,
  Compass,
  Crosshair,
  Loader2,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ZoneTelemetry } from '@/types/organizer.types';

export interface EventVenue {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  activeAttendees: number;
  capacity: number;
  status: 'safe' | 'notice' | 'alert';
  congestionLevel: number;
  zones: {
    id: string;
    name: string;
    type: 'hall' | 'entrance' | 'dining' | 'transit';
    occupancyPercent: number;
    status: 'safe' | 'notice' | 'alert';
    waitMinutes: number;
  }[];
}

export const VENUES_DATA: EventVenue[] = [
  {
    id: 'venue-delhi',
    name: 'Bharat Mandapam & Pragati Maidan',
    city: 'New Delhi',
    state: 'Delhi NCR',
    lat: 28.6186,
    lng: 77.2415,
    activeAttendees: 14200,
    capacity: 18000,
    status: 'notice',
    congestionLevel: 78,
    zones: [
      { id: 'delhi-z1', name: 'Gate 4 North FastTrack', type: 'entrance', occupancyPercent: 92, status: 'alert', waitMinutes: 24 },
      { id: 'delhi-z2', name: 'Plenary Summit Hall A', type: 'hall', occupancyPercent: 86, status: 'notice', waitMinutes: 12 },
      { id: 'delhi-z3', name: 'Innovation Expo Pavilion 2', type: 'hall', occupancyPercent: 42, status: 'safe', waitMinutes: 2 },
      { id: 'delhi-z4', name: 'Central Food Court', type: 'dining', occupancyPercent: 68, status: 'notice', waitMinutes: 15 },
      { id: 'delhi-z5', name: 'Supreme Court Metro Shuttle Hub', type: 'transit', occupancyPercent: 35, status: 'safe', waitMinutes: 0 },
    ],
  },
  {
    id: 'venue-mumbai',
    name: 'Jio World Convention Centre',
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0626,
    lng: 72.8647,
    activeAttendees: 9800,
    capacity: 12000,
    status: 'safe',
    congestionLevel: 55,
    zones: [
      { id: 'mum-z1', name: 'Grand Pavilion East', type: 'hall', occupancyPercent: 52, status: 'safe', waitMinutes: 0 },
      { id: 'mum-z2', name: 'BKC Skywalk Entrance', type: 'entrance', occupancyPercent: 64, status: 'notice', waitMinutes: 8 },
      { id: 'mum-z3', name: 'Lotus Ballroom Tech Stage', type: 'hall', occupancyPercent: 48, status: 'safe', waitMinutes: 0 },
      { id: 'mum-z4', name: 'Trident Partner Lounge', type: 'dining', occupancyPercent: 38, status: 'safe', waitMinutes: 0 },
    ],
  },
  {
    id: 'venue-bengaluru',
    name: 'BIEC Exhibition Centre',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 13.0645,
    lng: 77.4735,
    activeAttendees: 11400,
    capacity: 15000,
    status: 'safe',
    congestionLevel: 62,
    zones: [
      { id: 'blr-z1', name: 'Main Hall 3A', type: 'hall', occupancyPercent: 70, status: 'notice', waitMinutes: 10 },
      { id: 'blr-z2', name: 'Madavara Metro Feeder Gate', type: 'transit', occupancyPercent: 30, status: 'safe', waitMinutes: 0 },
      { id: 'blr-z3', name: 'Garden Lounge Sanctuary', type: 'dining', occupancyPercent: 25, status: 'safe', waitMinutes: 0 },
    ],
  },
  {
    id: 'venue-hyderabad',
    name: 'HICC Novotel Campus',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.4729,
    lng: 78.3728,
    activeAttendees: 6400,
    capacity: 9000,
    status: 'safe',
    congestionLevel: 45,
    zones: [
      { id: 'hyd-z1', name: 'HITEC Hall 1', type: 'hall', occupancyPercent: 44, status: 'safe', waitMinutes: 0 },
      { id: 'hyd-z2', name: 'Cyberabad Express Gate', type: 'transit', occupancyPercent: 38, status: 'safe', waitMinutes: 2 },
      { id: 'hyd-z3', name: 'Novotel Poolside Terrace', type: 'dining', occupancyPercent: 28, status: 'safe', waitMinutes: 0 },
    ],
  },
];

// Great-circle Haversine formula to compute distance in kilometers
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface UserLocationState {
  lat: number;
  lng: number;
  accuracyMeters?: number;
  isSimulated?: boolean;
}

export interface NearestVenueInfo {
  venue: EventVenue;
  distanceKm: number;
}

interface IndiaMapProps {
  variant?: 'attendee' | 'organizer';
  onSelectZone?: (zoneName: string) => void;
  onSelectVenue?: (venue: EventVenue | null) => void;
  onUserLocationChange?: (location: UserLocationState | null, nearest: NearestVenueInfo | null) => void;
  className?: string;
  liveZones?: ZoneTelemetry[];
}

export function IndiaMap({
  variant = 'attendee',
  onSelectZone,
  onSelectVenue,
  onUserLocationChange,
  className,
  liveZones,
}: IndiaMapProps) {
  // Default coordinates: India center lat: 20.5937, lng: 78.9629, zoom: 5
  const [zoom, setZoom] = useState<number>(5);
  const [selectedVenue, setSelectedVenue] = useState<EventVenue | null>(null);
  const [selectedZone, setSelectedZone] = useState<any | null>(null);

  // Geolocation states
  const [userLocation, setUserLocation] = useState<UserLocationState | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [nearestVenue, setNearestVenue] = useState<NearestVenueInfo | null>(null);

  // Compute live mapped zones for selected venue if liveZones provided
  const displayZones = useMemo(() => {
    if (!selectedVenue) return [];
    if (!liveZones || liveZones.length === 0) return selectedVenue.zones;

    return selectedVenue.zones.map((vz) => {
      const match = liveZones.find(
        (lz) =>
          lz.name.toLowerCase().includes(vz.name.toLowerCase()) ||
          vz.name.toLowerCase().includes(lz.name.toLowerCase()) ||
          lz.id === vz.id
      );
      if (match) {
        return {
          ...vz,
          occupancyPercent: match.occupancyRate,
          status: (match.status === 'red' ? 'alert' : match.status === 'yellow' ? 'notice' : 'safe') as
            | 'safe'
            | 'notice'
            | 'alert',
        };
      }
      return vz;
    });
  }, [selectedVenue, liveZones]);

  // Overall live Delhi congestion level if liveZones available
  const liveDelhiCongestion = useMemo(() => {
    if (!liveZones || liveZones.length === 0) return VENUES_DATA[0].congestionLevel;
    const avg = Math.round(liveZones.reduce((sum, z) => sum + z.occupancyRate, 0) / liveZones.length);
    return avg;
  }, [liveZones]);

  // Handle finding nearest venue when user coordinates change
  const evaluateNearestVenue = useCallback(
    (coords: UserLocationState) => {
      let closestVenue = VENUES_DATA[0];
      let minDistance = Infinity;

      for (const v of VENUES_DATA) {
        const dist = calculateDistanceKm(coords.lat, coords.lng, v.lat, v.lng);
        if (dist < minDistance) {
          minDistance = dist;
          closestVenue = v;
        }
      }

      const nearestInfo: NearestVenueInfo = {
        venue: closestVenue,
        distanceKm: minDistance,
      };

      setNearestVenue(nearestInfo);
      if (onUserLocationChange) {
        onUserLocationChange(coords, nearestInfo);
      }
      return nearestInfo;
    },
    [onUserLocationChange]
  );

  // Trigger GPS Geolocation
  const handleDetectCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring GPS position...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords: UserLocationState = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyMeters: Math.round(pos.coords.accuracy),
          isSimulated: false,
        };
        setUserLocation(coords);
        const nearest = evaluateNearestVenue(coords);
        setLocationStatus(`GPS acquired! You are ${nearest.distanceKm} km from ${nearest.venue.name}.`);
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = 'Could not access GPS.';
        if (err.code === 1) {
          errorMsg = 'GPS permission denied. Tap a city or use demo simulated location below.';
        } else if (err.code === 2) {
          errorMsg = 'GPS position unavailable. Using nearest venue selector.';
        } else if (err.code === 3) {
          errorMsg = 'GPS request timed out. Please try again.';
        }
        setLocationStatus(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  // Simulated Location fallback (useful for testing on desktop)
  const handleSimulateLocation = (preset: 'delhi' | 'mumbai' | 'bengaluru') => {
    let coords: UserLocationState;
    if (preset === 'delhi') {
      // 3.8 km from Bharat Mandapam (e.g. Connaught Place, New Delhi)
      coords = { lat: 28.6315, lng: 77.2167, isSimulated: true };
    } else if (preset === 'mumbai') {
      // 2.1 km from BKC (e.g. Bandra East)
      coords = { lat: 19.055, lng: 72.845, isSimulated: true };
    } else {
      // 4.2 km from BIEC
      coords = { lat: 13.035, lng: 77.51, isSimulated: true };
    }

    setUserLocation(coords);
    const nearest = evaluateNearestVenue(coords);
    setLocationStatus(`Simulated location active: ${nearest.distanceKm} km from ${nearest.venue.name}.`);
  };

  const handleResetToIndia = () => {
    setZoom(5);
    setSelectedVenue(null);
    setSelectedZone(null);
    if (onSelectVenue) onSelectVenue(null);
  };

  const handleSelectVenue = (venue: EventVenue) => {
    setSelectedVenue(venue);
    setZoom(14); // Zooms into the venue level
    setSelectedZone(venue.zones[0] || null);
    if (onSelectVenue) onSelectVenue(venue);
    if (onSelectZone && venue.zones[0]) {
      onSelectZone(venue.zones[0].name);
    }
  };

  const isOrganizer = variant === 'organizer';

  // Compute SVG position for user pin when on India overview
  const userSvgPos = useMemo(() => {
    if (!userLocation) return null;
    const latRatio = (userLocation.lat - 8) / (36 - 8);
    const lngRatio = (userLocation.lng - 68) / (90 - 68);

    const clampedLat = Math.max(0, Math.min(1, latRatio));
    const clampedLng = Math.max(0, Math.min(1, lngRatio));

    const y = 650 - clampedLat * 540;
    const x = 200 + clampedLng * 460;
    return { x, y };
  }, [userLocation]);

  return (
    <div
      className={cn(
        'relative w-full rounded-2xl overflow-hidden border transition-all duration-300 select-none shadow-sm',
        isOrganizer
          ? 'bg-[#11161d] border-slate-800 text-slate-100 min-h-[480px]'
          : 'bg-[#fffbf8] border-outline-subtle text-on-surface min-h-[460px]',
        className
      )}
    >
      {/* Top Header Controls Bar */}
      <div
        className={cn(
          'p-3 sm:p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-md',
          isOrganizer ? 'bg-slate-900/90 border-slate-800' : 'bg-surface-container-lowest/90 border-outline-subtle'
        )}
      >
        {/* Left: Active View & Proximity Badge */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
            </span>
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              {selectedVenue ? selectedVenue.name : 'India Telemetry Network'}
            </span>
          </div>

          <Badge
            variant={
              selectedVenue
                ? selectedVenue.status === 'alert'
                  ? 'coral'
                  : selectedVenue.status === 'notice'
                  ? 'amber'
                  : 'teal'
                : 'teal'
            }
          >
            {selectedVenue ? `${selectedVenue.city} • Zoom ${zoom}x` : `Overview • Zoom ${zoom}x`}
          </Badge>

          {nearestVenue && (
            <Badge variant="neutral" className="gap-1">
              <Compass className="w-3 h-3 text-secondary" />
              <span>
                Nearest: {nearestVenue.venue.city} ({nearestVenue.distanceKm} km)
              </span>
            </Badge>
          )}
        </div>

        {/* Right: Location Selection & GPS Action */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Current Location GPS Button */}
          <Button
            size="sm"
            variant={userLocation ? 'secondary' : 'outline'}
            onClick={handleDetectCurrentLocation}
            disabled={isLocating}
            className="text-xs h-8 px-3 gap-1.5 shadow-xs"
            title="Detect your device's current location via GPS"
          >
            {isLocating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Locating...</span>
              </>
            ) : userLocation ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-secondary" />
                <span>GPS Located</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3.5 h-3.5" />
                <span>Current Location</span>
              </>
            )}
          </Button>

          {/* Location Selector Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={selectedVenue ? selectedVenue.id : 'all'}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') {
                  handleResetToIndia();
                } else {
                  const target = VENUES_DATA.find((v) => v.id === val);
                  if (target) handleSelectVenue(target);
                }
              }}
              className={cn(
                'text-xs font-semibold rounded-lg px-3 py-1.5 pr-8 border appearance-none cursor-pointer outline-none transition-colors shadow-xs',
                isOrganizer
                  ? 'bg-slate-800 border-slate-700 text-slate-100 hover:border-slate-600'
                  : 'bg-white border-outline-subtle text-on-surface hover:border-secondary'
              )}
            >
              <option value="all">🇮🇳 Select Location: All India</option>
              {VENUES_DATA.map((v) => (
                <option key={v.id} value={v.id}>
                  📍 {v.city} - {v.name} ({v.congestionLevel}%)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none opacity-60" />
          </div>

          {/* Quick Simulation Fallback (when GPS denied or on desktop) */}
          {!userLocation && (
            <button
              onClick={() => handleSimulateLocation('delhi')}
              className={cn(
                'text-[11px] font-medium px-2 py-1 rounded transition-colors underline underline-offset-2 opacity-80 hover:opacity-100',
                isOrganizer ? 'text-slate-400 hover:text-slate-200' : 'text-on-surface-variant hover:text-secondary'
              )}
              title="Test location proximity features with simulated Delhi coordinates"
            >
              Simulate GPS
            </button>
          )}
        </div>
      </div>

      {/* Geolocation Status Feedback Pill */}
      {locationStatus && (
        <div
          className={cn(
            'px-4 py-1.5 text-xs flex items-center justify-between gap-2 border-b animate-in fade-in',
            isOrganizer
              ? 'bg-slate-950/80 border-slate-800 text-slate-300'
              : 'bg-surface-container/50 border-outline-subtle text-on-surface-variant'
          )}
        >
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-secondary shrink-0" />
            <span>{locationStatus}</span>
          </div>
          {nearestVenue && !selectedVenue && (
            <button
              onClick={() => handleSelectVenue(nearestVenue.venue)}
              className="text-xs font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Jump to {nearestVenue.venue.city}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Cartographic Map Canvas */}
      <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        {/* Ambient Grid Lines */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: isOrganizer
              ? 'radial-gradient(#334155 1px, transparent 1px)'
              : 'radial-gradient(#8d716c 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {zoom <= 6 ? (
          /* ================= INDIA OVERVIEW (ZOOM 5) ================= */
          <div className="relative w-full max-w-2xl h-full flex items-center justify-center p-6 animate-in fade-in duration-300">
            {/* India Stylized Cartographic Contour Map */}
            <svg
              viewBox="0 0 800 700"
              className={cn(
                'w-full h-full max-h-[380px] transition-transform duration-500',
                isOrganizer ? 'text-slate-800' : 'text-[#f2e6dc]'
              )}
              fill="currentColor"
            >
              {/* Simplified India Landmass Polygon */}
              <path
                d="M 380 40 
                   C 420 45, 460 70, 480 110 
                   C 510 130, 540 160, 530 200 
                   C 570 210, 610 230, 640 260 
                   C 660 300, 620 330, 580 340 
                   C 560 370, 550 410, 520 460 
                   C 480 520, 450 580, 420 640 
                   C 400 680, 390 680, 380 640 
                   C 340 560, 310 500, 300 440 
                   C 280 400, 250 360, 240 320 
                   C 220 290, 230 250, 260 220 
                   C 280 180, 310 120, 340 80 
                   Z"
                stroke={isOrganizer ? '#1e293b' : '#e1bfba'}
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Geographic Center Crosshair: Lat 20.5937, Lng 78.9629 */}
              <circle cx="400" cy="360" r="4" fill="#0f9b8e" />
              <circle cx="400" cy="360" r="18" stroke="#0f9b8e" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
              <text
                x="425"
                y="365"
                fill={isOrganizer ? '#94a3b8' : '#8d716c'}
                fontSize="11"
                fontFamily="Plus Jakarta Sans"
                fontWeight="600"
              >
                Center [20.59°N, 78.96°E]
              </text>

              {/* Plotted User Location in SVG if available */}
              {userSvgPos && (
                <g>
                  <circle cx={userSvgPos.x} cy={userSvgPos.y} r="8" fill="#3b82f6" fillOpacity="0.4">
                    <animate attributeName="r" values="6;22;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={userSvgPos.x} cy={userSvgPos.y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                </g>
              )}
            </svg>

            {/* Plotted City Venue Pins on the Map */}
            {/* 1. Delhi NCR Pin */}
            <div
              onClick={() => handleSelectVenue(VENUES_DATA[0])}
              className="absolute top-[28%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-primary-container text-primary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary-container animate-ping" />
                  <span>Delhi: Bharat Mandapam</span>
                  <span className="text-[10px] opacity-75">({liveDelhiCongestion}%)</span>
                </div>
                <div className="w-2 h-2 rotate-45 -mt-1 bg-surface-container-lowest border-r border-b border-primary-container" />
              </div>
            </div>

            {/* 2. Mumbai Pin */}
            <div
              onClick={() => handleSelectVenue(VENUES_DATA[1])}
              className="absolute top-[52%] left-[34%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-secondary text-secondary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Mumbai: Jio World</span>
                  <span className="text-[10px] opacity-75">({VENUES_DATA[1].congestionLevel}%)</span>
                </div>
                <div className="w-2 h-2 rotate-45 -mt-1 bg-surface-container-lowest border-r border-b border-secondary" />
              </div>
            </div>

            {/* 3. Bengaluru Pin */}
            <div
              onClick={() => handleSelectVenue(VENUES_DATA[2])}
              className="absolute top-[72%] left-[44%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-secondary text-secondary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Bengaluru: BIEC</span>
                  <span className="text-[10px] opacity-75">({VENUES_DATA[2].congestionLevel}%)</span>
                </div>
                <div className="w-2 h-2 rotate-45 -mt-1 bg-surface-container-lowest border-r border-b border-secondary" />
              </div>
            </div>

            {/* 4. Hyderabad Pin */}
            <div
              onClick={() => handleSelectVenue(VENUES_DATA[3])}
              className="absolute top-[58%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-secondary text-secondary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span>Hyderabad: HICC</span>
                  <span className="text-[10px] opacity-75">({VENUES_DATA[3].congestionLevel}%)</span>
                </div>
                <div className="w-2 h-2 rotate-45 -mt-1 bg-surface-container-lowest border-r border-b border-secondary" />
              </div>
            </div>
          </div>
        ) : (
          /* ================= DETAILED EVENT VENUE DIGITAL TWIN (ZOOM 14+) ================= */
          <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-center animate-in zoom-in-95 duration-300">
            <div className="max-w-3xl mx-auto w-full">
              {/* Back to India bar */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleResetToIndia}
                  className="text-xs font-bold text-secondary hover:underline cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>← Back to All India Map</span>
                </button>
                <div className="text-xs text-on-surface-variant">
                  Showing real-time zones for <span className="font-bold text-on-surface">{selectedVenue?.name}</span>
                </div>
              </div>

              {/* Detailed Zone Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {displayZones.map((zone) => {
                  const isAlert = zone.status === 'alert';
                  const isNotice = zone.status === 'notice';
                  const isSelected = selectedZone?.id === zone.id;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone);
                        if (onSelectZone) onSelectZone(zone.name);
                      }}
                      className={cn(
                        'p-4 rounded-xl border transition-all cursor-pointer duration-200',
                        isOrganizer
                          ? isSelected
                            ? 'bg-slate-800 border-coral shadow-lg ring-1 ring-coral/40'
                            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                          : isSelected
                          ? 'bg-surface-container-lowest border-primary-container shadow-md ring-2 ring-primary-container/20'
                          : 'bg-surface-container-lowest/80 border-outline-subtle hover:bg-white'
                      )}
                    >
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span className="text-xs font-bold leading-snug">{zone.name}</span>
                        <span
                          className={cn(
                            'text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0',
                            isAlert
                              ? 'bg-primary-container text-white'
                              : isNotice
                              ? 'bg-tertiary-container text-white'
                              : 'bg-secondary text-white'
                          )}
                        >
                          {zone.occupancyPercent}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden mt-1 mb-2">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            isAlert ? 'bg-primary-container' : isNotice ? 'bg-tertiary' : 'bg-secondary'
                          )}
                          style={{ width: `${zone.occupancyPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                        <span>Wait: ~{zone.waitMinutes}m</span>
                        <span className="capitalize">{zone.status === 'safe' ? 'Quiet Corridor' : zone.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Left Legend */}
      <div
        className={cn(
          'absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-4 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm',
          isOrganizer ? 'bg-slate-900/90 border border-slate-800' : 'bg-surface-container-lowest/90 border border-outline-subtle'
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span>&lt;60% Sanctuary</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
          <span>60-85% Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
          <span>&gt;85% Peak Caution</span>
        </div>
      </div>

      {/* Floating Controls Bottom Right */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
        <div
          className={cn(
            'flex items-center rounded-full p-1 shadow-sm backdrop-blur-md',
            isOrganizer ? 'bg-slate-900/90 border border-slate-800' : 'bg-surface-container-lowest/90 border border-outline-subtle'
          )}
        >
          <button
            onClick={() => setZoom((z) => Math.min(18, z + 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-outline-subtle" />
          <button
            onClick={() => setZoom((z) => Math.max(3, z - 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-outline-subtle" />
          <button
            onClick={handleResetToIndia}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container text-secondary transition-colors cursor-pointer"
            title="Reset to India View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


