'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, Layers, ShieldCheck, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    ],
  },
];

interface IndiaMapProps {
  variant?: 'attendee' | 'organizer';
  onSelectZone?: (zoneName: string) => void;
  className?: string;
}

export function IndiaMap({ variant = 'attendee', onSelectZone, className }: IndiaMapProps) {
  // Default coordinates requirement: India center lat: 20.5937, lng: 78.9629, zoom: 5
  const [zoom, setZoom] = useState<number>(5);
  const [selectedVenue, setSelectedVenue] = useState<EventVenue | null>(null);
  const [selectedZone, setSelectedZone] = useState<any | null>(null);
  const [activeLayer, setActiveLayer] = useState<'density' | 'sanctuary'>('density');

  const handleResetToIndia = () => {
    setZoom(5);
    setSelectedVenue(null);
    setSelectedZone(null);
  };

  const handleSelectVenue = (venue: EventVenue) => {
    setSelectedVenue(venue);
    setZoom(14); // Zooms into the venue level
    setSelectedZone(venue.zones[0] || null);
    if (onSelectZone && venue.zones[0]) {
      onSelectZone(venue.zones[0].name);
    }
  };

  const isOrganizer = variant === 'organizer';

  return (
    <div
      className={cn(
        'relative w-full rounded-2xl overflow-hidden border transition-all duration-300 select-none shadow-sm',
        isOrganizer
          ? 'bg-[#11161d] border-slate-800 text-slate-100 min-h-[460px]'
          : 'bg-[#fffbf8] border-outline-subtle text-on-surface min-h-[440px]',
        className
      )}
    >
      {/* Top Map Status Banner */}
      <div
        className={cn(
          'absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl backdrop-blur-md shadow-sm',
          isOrganizer ? 'bg-slate-900/85 border border-slate-800' : 'bg-surface-container-lowest/90 border border-outline-subtle'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
          </span>
          <span className="text-xs font-bold tracking-tight">
            {selectedVenue ? selectedVenue.name : 'India Event Telemetry (lat: 20.5937, lng: 78.9629)'}
          </span>
          <Badge variant={selectedVenue ? (selectedVenue.status === 'alert' ? 'coral' : selectedVenue.status === 'notice' ? 'amber' : 'teal') : 'teal'}>
            {selectedVenue ? `Zoom ${zoom}x • ${selectedVenue.city}` : `Default Zoom ${zoom}x`}
          </Badge>
        </div>

        {/* Quick Venue Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
          <button
            onClick={handleResetToIndia}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              !selectedVenue
                ? 'bg-primary-container text-white shadow-xs'
                : isOrganizer
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            )}
          >
            🇮🇳 India Overview
          </button>
          {VENUES_DATA.map((v) => (
            <button
              key={v.id}
              onClick={() => handleSelectVenue(v)}
              className={cn(
                'px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                selectedVenue?.id === v.id
                  ? 'bg-secondary text-white shadow-xs'
                  : isOrganizer
                  ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {v.city}
            </button>
          ))}
        </div>
      </div>

      {/* Cartographic Map Canvas (India Geo Projection SVG) */}
      <div className="relative w-full h-[460px] flex items-center justify-center overflow-hidden">
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
              {/* Center Coordinate Indicator Crosshair: Lat 20.5937, Lng 78.9629 */}
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
            </svg>

            {/* Plotted City Venue Pins on the Map */}
            {/* 1. Delhi NCR Pin */}
            <div
              onClick={() => handleSelectVenue(VENUES_DATA[0])}
              className="absolute top-[28%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-primary-container text-primary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-primary-container animate-ping" />
                  <span>Delhi: Bharat Mandapam</span>
                  <span className="text-[10px] opacity-75">({VENUES_DATA[0].congestionLevel}%)</span>
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
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-secondary text-secondary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1">
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
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-secondary text-secondary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1">
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
                <div className="px-2.5 py-1 rounded-full bg-surface-container-lowest border border-secondary text-secondary font-bold text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1">
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
          <div className="relative w-full h-full p-8 flex flex-col justify-center animate-in zoom-in-95 duration-300">
            <div className="max-w-3xl mx-auto w-full">
              {/* Detailed Zone Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedVenue?.zones.map((zone) => {
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
                            ? 'bg-slate-800 border-coral shadow-lg'
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
          'absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-4 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm',
          isOrganizer ? 'bg-slate-900/90 border border-slate-800' : 'bg-surface-container-lowest/90 border border-outline-subtle'
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
          <span>&lt;60% Quiet Sanctuary</span>
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
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
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
