'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';
import { ShieldCheck, Clock, MapPin, QrCode, ArrowRight, Zap, CheckCircle2, AlertTriangle, Utensils, Shuffle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Reassuring Guardian Monitoring Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-subtle shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm sm:text-base text-on-surface">Autonomous Guardian Sentinel</h4>
              <Badge variant="teal">Active</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Live crowd telemetry active for Bharat Mandapam & Pragati Maidan complex.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <StatusPill status="safe" label="SafeHaven Sync: 99.4% On Track" />
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Time Saved</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-primary-container mt-1">45m</div>
          <span className="text-[10px] text-secondary font-semibold">via smart routing</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">FastTrack Passes</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-secondary mt-1">2 Active</div>
          <span className="text-[10px] text-on-surface-variant">Gate 4 & Hall A</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Current Zone Status</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-tertiary-dark mt-1">Moderate</div>
          <span className="text-[10px] text-tertiary-dark font-semibold">Plenary Hall (78%)</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Next Session</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">01:15 PM</div>
          <span className="text-[10px] text-on-surface-variant">in 1h 25m</span>
        </Card>
      </div>

      {/* Two Column Workspace: 65% Timeline / 35% Smart Nudges & Quick Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Schedule Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-subtle p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-surface-container-high">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg text-on-surface">Today&apos;s Itinerary</h2>
                  <span className="text-xs text-on-surface-variant">• Thursday, Oct 24</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">Pragati Maidan Central Campus & Innovation Loop</p>
              </div>
              <Link href="/itinerary">
                <Button variant="ghost" size="sm">View Full Schedule →</Button>
              </Link>
            </div>

            {/* Continuous Timeline */}
            <div className="relative pl-4 space-y-6">
              <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-surface-container-high" />

              {/* Item 1: Completed */}
              <div className="relative flex items-start gap-4">
                <div className="relative z-10 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-surface-container-low/60 rounded-xl p-4 border border-outline-subtle">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">09:30 AM</span>
                    <Badge variant="teal">Completed</Badge>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">Gate 4 Check-in & RFID Badge Collection</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">North Entrance Gate • Express Lane 2</p>
                </div>
              </div>

              {/* Item 2: Up Next */}
              <div className="relative flex items-start gap-4">
                <div className="relative z-10 w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center shrink-0 shadow-md shadow-primary-container/30 ring-4 ring-primary-container/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-xl p-4 border-2 border-primary-container/30 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-primary-container">01:15 PM • Starts in 1h 25m</span>
                    <Badge variant="amber">Moderate (78%)</Badge>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-on-surface">
                        Keynote: Real-Time Spatial AI & City Scaled Crowds
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Plenary Hall A • FastTrack QR Pass Ready
                      </p>
                    </div>
                    <Link href="/itinerary">
                      <Button size="sm" className="shrink-0">
                        <QrCode className="w-3.5 h-3.5 mr-1" />
                        <span>FastTrack Pass</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Item 3: Upcoming with Nudge */}
              <div className="relative flex items-start gap-4">
                <div className="relative z-10 w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-surface-container-low/60 rounded-xl p-4 border border-outline-subtle">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface">02:45 PM</span>
                    <Badge variant="coral">Peak Rush Expected</Badge>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">Networking Lunch & Coffee Break</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Central Food Court • Anticipated wait: 25 mins</p>
                  
                  {/* Embedded Reroute Nudge */}
                  <div className="mt-3 p-2.5 rounded-lg bg-tertiary-fixed/30 border border-tertiary/20 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-tertiary-dark">
                      ⚡ Suggested: Pavilion 2 Lounge has zero queue and reserved seating.
                    </span>
                    <Link href="/alternatives">
                      <Button variant="secondary" size="sm" className="text-xs shrink-0 py-1">
                        Swap Slot
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Smart Rerouting Nudge & Interactive India Map Link */}
        <div className="lg:col-span-4 space-y-4">
          {/* Smart Nudge Card */}
          <Card className="border-l-4 border-l-primary-container">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-primary-container">
                Dynamic Reroute Recommendation
              </span>
              <StatusPill status="alert" label="Save 25m" />
            </div>
            <h3 className="font-bold text-sm text-on-surface">Avoid Central Hall Congestion</h3>
            <p className="text-xs text-on-surface-variant mt-1">
              Plenary Hall A entry gates are currently seeing high influx. Use West Skywalk Corridor for 5-minute direct access.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Link href="/alternatives" className="flex-1">
                <Button size="sm" className="w-full">
                  <Shuffle className="w-3.5 h-3.5 mr-1" />
                  <span>View Alternatives</span>
                </Button>
              </Link>
              <Link href="/map">
                <Button variant="secondary" size="sm">Map</Button>
              </Link>
            </div>
          </Card>

          {/* Quick Map Widget */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <h4 className="font-bold text-xs text-on-surface">Live Venue Digital Twin</h4>
              </div>
              <Badge variant="teal">India [20.59°N, 78.96°E]</Badge>
            </div>
            <p className="text-xs text-on-surface-variant">
              Explore Bharat Mandapam, Jio World, BIEC, and HICC venue maps with live occupancy.
            </p>
            <Link href="/map" className="block">
              <div className="h-32 rounded-xl bg-surface-container flex items-center justify-center border border-outline-subtle hover:border-secondary transition-colors cursor-pointer group">
                <span className="text-xs font-bold text-secondary group-hover:underline flex items-center gap-1">
                  Open Interactive Map View →
                </span>
              </div>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
