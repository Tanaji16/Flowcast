'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';
import {
  ShieldCheck,
  Clock,
  MapPin,
  QrCode,
  ArrowRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  Shuffle,
  RefreshCw,
  Sparkles,
  Compass,
  Check,
} from 'lucide-react';

export default function DashboardPage() {
  const [userName, setUserName] = useState('Aarav');
  const [hasRerouted, setHasRerouted] = useState(false);
  const [timeSaved, setTimeSaved] = useState(45);
  const [selectedZone, setSelectedZone] = useState<string>('Gate 4 North');
  const [activeTab, setActiveTab] = useState<'all' | 'priority'>('all');
  const [showPassModal, setShowPassModal] = useState(false);

  // Dynamic live zone list that reacts to rerouting
  const [zones, setZones] = useState([
    { id: 'z-gate4', name: 'Gate 4 North FastTrack', type: 'entrance', occ: 92, status: 'critical', wait: 24 },
    { id: 'z-gate2', name: 'West Concourse Gate 2', type: 'entrance', occ: 38, status: 'safe', wait: 2 },
    { id: 'z-plenary', name: 'Plenary Summit Hall A', type: 'hall', occ: 84, status: 'warning', wait: 12 },
    { id: 'z-pavilion', name: 'Pavilion 2 Garden Dining', type: 'dining', occ: 32, status: 'safe', wait: 0 },
    { id: 'z-metro', name: 'Metro Electric Shuttle Hub', type: 'transit', occ: 45, status: 'safe', wait: 4 },
  ]);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const metaName = user.user_metadata?.full_name;
          if (metaName) setUserName(metaName.split(' ')[0]);
        }
      } catch (err) {
        console.warn('User load note:', err);
      }
    }
    loadUser();
  }, []);

  // Handler: When attendee clicks "Accept Reroute"
  const handleAcceptReroute = () => {
    setHasRerouted(true);
    setTimeSaved(65); // Increases time saved by 20 mins!
    // Dynamically update the zones state (demonstrating crowd redistribution)
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === 'z-gate4') return { ...z, occ: 68, status: 'warning', wait: 10 };
        if (z.id === 'z-gate2') return { ...z, occ: 52, status: 'safe', wait: 4 };
        return z;
      })
    );
  };

  // Handler: Reset simulation
  const handleResetSimulation = () => {
    setHasRerouted(false);
    setTimeSaved(45);
    setZones([
      { id: 'z-gate4', name: 'Gate 4 North FastTrack', type: 'entrance', occ: 92, status: 'critical', wait: 24 },
      { id: 'z-gate2', name: 'West Concourse Gate 2', type: 'entrance', occ: 38, status: 'safe', wait: 2 },
      { id: 'z-plenary', name: 'Plenary Summit Hall A', type: 'hall', occ: 84, status: 'warning', wait: 12 },
      { id: 'z-pavilion', name: 'Pavilion 2 Garden Dining', type: 'dining', occ: 32, status: 'safe', wait: 0 },
      { id: 'z-metro', name: 'Metro Electric Shuttle Hub', type: 'transit', occ: 45, status: 'safe', wait: 4 },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header & Greeting */}
      <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-subtle shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-primary-container text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-primary-container/25 shrink-0">
            {userName[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-on-surface">
                Hi, {userName}! Event Companion Hub
              </h1>
              <Badge variant="teal">AI Flow Active</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Live crowd telemetry: Bharat Mandapam • Pragati Maidan complex
            </p>
          </div>
        </div>

        {/* Dynamic Reset / Simulation Toggle */}
        <div className="flex items-center gap-2">
          {hasRerouted ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleResetSimulation}
              className="text-xs cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-secondary" />
              <span>Reset Reroute Demo</span>
            </Button>
          ) : (
            <StatusPill status="safe" label="SafeHaven Sync: 99.4% On Track" />
          )}
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-surface-container-lowest transition-all">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Time Saved
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-primary-container mt-1 flex items-baseline gap-1">
            {timeSaved}m
            {hasRerouted && (
              <span className="text-xs font-bold text-secondary animate-bounce">+20m</span>
            )}
          </div>
          <span className="text-[10px] text-secondary font-semibold">
            {hasRerouted ? 'Active Reroute Applied' : 'via smart routing'}
          </span>
        </Card>

        <Card className="p-4 bg-surface-container-lowest">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            FastTrack Pass
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-secondary mt-1">
            {hasRerouted ? 'Gate 2 Priority' : 'Gate 4 Standard'}
          </div>
          <span className="text-[10px] text-on-surface-variant">Pass #FC-94821</span>
        </Card>

        <Card className="p-4 bg-surface-container-lowest">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Queue Congestion
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold mt-1">
            <span className={hasRerouted ? 'text-secondary' : 'text-primary-container'}>
              {hasRerouted ? '2 mins (Low)' : '24 mins (High)'}
            </span>
          </div>
          <span className="text-[10px] text-on-surface-variant">
            {hasRerouted ? 'West Concourse Bypass' : 'North Gate 4 Bottleneck'}
          </span>
        </Card>

        <Card className="p-4 bg-surface-container-lowest">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
            Next Session
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">10:30 AM</div>
          <span className="text-[10px] text-on-surface-variant">Plenary Hall A (Row F)</span>
        </Card>
      </div>

      {/* THE MAGIC MOMENT: DYNAMIC AUTONOMOUS NUDGE BANNER */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 shadow-md ${
          hasRerouted
            ? 'bg-secondary/10 border-secondary/40'
            : 'bg-primary-container/10 border-primary-container/40 ring-2 ring-primary-container/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                hasRerouted ? 'bg-secondary text-white' : 'bg-primary-container text-white animate-pulse'
              }`}
            >
              {hasRerouted ? <Check className="w-6 h-6 stroke-[3]" /> : <AlertTriangle className="w-6 h-6" />}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    hasRerouted ? 'text-secondary' : 'text-primary-container'
                  }`}
                >
                  {hasRerouted ? 'Reroute Accepted & Confirmed' : 'Flowcast Autonomous Nudge'}
                </span>
                <Badge variant={hasRerouted ? 'teal' : 'coral'}>
                  {hasRerouted ? 'Safe Transit' : 'Bottleneck Detected'}
                </Badge>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-on-surface">
                {hasRerouted
                  ? 'Active Reroute: West Concourse Gate 2 FastTrack Assigned'
                  : 'Gate 4 North Overcrowded (+24m queue) — Divert to Gate 2'}
              </h3>

              <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">
                {hasRerouted
                  ? 'Your pass has been upgraded to West Concourse Gate 2 with instant turnstile priority. You bypassed 20 minutes of congestion!'
                  : 'Turnstile sensors report 92% density at Gate 4. Diverting 500m to West Concourse Gate 2 gets you in within 2 minutes and saves 20 minutes!'}
              </p>
            </div>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            {hasRerouted ? (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setShowPassModal(true)}
                  className="bg-secondary hover:bg-secondary/90 text-white cursor-pointer"
                >
                  <QrCode className="w-4 h-4 mr-1.5" />
                  <span>Show Gate 2 Pass</span>
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={handleAcceptReroute}
                className="w-full sm:w-auto shadow-lg shadow-primary-container/30 cursor-pointer text-xs sm:text-sm py-3 px-5 font-bold"
              >
                <span>Accept Reroute & Save 20m</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Dynamic Itinerary & Live Zone Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Dynamic Itinerary */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-subtle p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-surface-container-high">
              <div>
                <h2 className="font-bold text-base sm:text-lg text-on-surface">
                  Today&apos;s Live Flow Schedule
                </h2>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Dynamically adapts when you accept reroutes and off-peak suggestions
                </p>
              </div>
              <Link href="/itinerary">
                <Button variant="ghost" size="sm" className="text-xs text-secondary">
                  Full Schedule →
                </Button>
              </Link>
            </div>

            {/* Dynamic Items */}
            <div className="space-y-4">
              {/* Event 1: Morning Gate */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  hasRerouted
                    ? 'bg-secondary/10 border-secondary/30'
                    : 'bg-surface-container-low border-outline-subtle'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-on-surface flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" />
                    09:30 AM - 10:00 AM
                  </span>
                  <Badge variant={hasRerouted ? 'teal' : 'coral'}>
                    {hasRerouted ? 'Rerouted (FastTrack)' : 'Congested Queue'}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  {hasRerouted
                    ? 'West Concourse Gate 2 Expedited Entry'
                    : 'Gate 4 North Entrance & RFID Badge Collection'}
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {hasRerouted
                    ? 'Assigned Lane 1 • Estimated wait: ~2 mins'
                    : 'North Gate • Heavy queue: ~24 mins wait time'}
                </p>
              </div>

              {/* Event 2: Keynote */}
              <div className="p-4 rounded-xl bg-white border border-primary-container/40 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-primary-container flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    UP NEXT • 10:30 AM - 12:00 PM
                  </span>
                  <Badge variant="coral">84% Full</Badge>
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  Keynote: AI Spatial Coordination in Mega-Events
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-outline" />
                  Plenary Hall A • Seat Reserved (Row F, 22)
                </p>
              </div>

              {/* Event 3: Lunch */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-subtle">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-on-surface-variant">12:30 PM</span>
                  <Badge variant="teal">0m Queue Wait</Badge>
                </div>
                <h4 className="font-bold text-sm text-on-surface">
                  Recommended Lunch: Pavilion 2 Garden Dining
                </h4>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  AI reroute recommends bypassing the packed Central Food Court
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Zone Density Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-on-surface">Live Zone Density</h3>
                <p className="text-xs text-on-surface-variant">Click any zone to inspect & route</p>
              </div>
              <Link href="/map" className="text-xs text-secondary font-bold hover:underline">
                Open Map →
              </Link>
            </div>

            <div className="space-y-2.5">
              {zones.map((z) => (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedZone === z.name
                      ? 'bg-secondary/10 border-secondary ring-1 ring-secondary'
                      : 'bg-surface-container-low border-outline-subtle hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-on-surface">{z.name}</span>
                    <Badge variant={z.status === 'critical' ? 'coral' : z.status === 'warning' ? 'amber' : 'teal'}>
                      {z.occ}% Full
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-on-surface-variant mt-1.5">
                    <span>Wait time: ~{z.wait} mins</span>
                    <span className="text-secondary font-semibold">
                      {z.occ > 80 ? 'Heavy Density' : 'Smooth Flow'}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        z.occ > 80 ? 'bg-primary-container' : z.occ > 50 ? 'bg-tertiary-dark' : 'bg-secondary'
                      }`}
                      style={{ width: `${z.occ}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Zone Quick Advice */}
            <div className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-subtle text-xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                Selected Zone Telemetry
              </span>
              <p className="font-bold text-on-surface">{selectedZone}</p>
              <p className="text-on-surface-variant text-[11px]">
                {selectedZone.includes('Gate 4')
                  ? 'Heavy surge detected. Divert to Gate 2 for immediate entry.'
                  : 'Operating at optimal transit speed. Green safety clearance.'}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* QR Pass Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full border border-outline-subtle shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-on-surface">West Concourse Gate 2 Pass</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                FastTrack QR Code • Valid for immediate entrance
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-outline-subtle inline-block shadow-sm">
              <QrCode className="w-36 h-36 text-charcoal mx-auto" />
              <span className="font-mono text-xs font-bold text-secondary block mt-2">
                FC-GATE2-EXPRESS
              </span>
            </div>

            <Button className="w-full" onClick={() => setShowPassModal(false)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
