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
  Loader2,
  Bell,
} from 'lucide-react';

export default function DashboardPage() {
  const [userName, setUserName] = useState('Aarav');
  const [zones, setZones] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();

        // 1. Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const metaName = user.user_metadata?.full_name;
          if (metaName) {
            setUserName(metaName.split(' ')[0]);
          }
          // Query users table for profile name
          const { data: profile } = await (supabase
            .from('users') as any)
            .select('full_name')
            .eq('id', user.id)
            .maybeSingle();
          if (profile && (profile as any).full_name) {
            setUserName((profile as any).full_name.split(' ')[0]);
          }

          // 2. Query attendee bookings
          const { data: bookingData } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (bookingData && bookingData.length > 0) {
            setBookings(bookingData);
          }
        }

        // 3. Query zones table for live occupancy & status
        const { data: zonesData } = await supabase
          .from('zones')
          .select('*')
          .order('occupancy_percent', { ascending: false });
        if (zonesData && zonesData.length > 0) {
          setZones(zonesData);
        }

        // 4. Query active alerts
        const { data: alertsData } = await supabase
          .from('alerts')
          .select('*')
          .eq('resolved', false)
          .order('created_at', { ascending: false })
          .limit(3);
        if (alertsData && alertsData.length > 0) {
          setAlerts(alertsData);
        }
      } catch (err) {
        console.warn('Dashboard Supabase fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const criticalCount = zones.filter((z) => z.occupancy_percent >= 85 || z.status === 'red' || z.status === 'critical').length;
  const currentZone = zones.find((z) => z.name?.includes('Plenary')) || zones[0] || {
    name: 'Plenary Hall A',
    occupancy_percent: 78,
    status: 'amber',
  };

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
              <h4 className="font-bold text-sm sm:text-base text-on-surface">
                Welcome, {userName}! Autonomous Guardian Sentinel
              </h4>
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

      {/* Active Alerts Banner if any exist from Supabase */}
      {alerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-danger-container/10 border border-danger/30 space-y-2">
          <div className="flex items-center gap-2 text-danger text-xs font-bold uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Active Live Crowd Advisories ({alerts.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {alerts.map((al) => (
              <div key={al.id} className="p-3 rounded-xl bg-surface-container-lowest border border-outline-subtle text-xs">
                <span className="font-bold text-on-surface block">{al.title}</span>
                <p className="text-on-surface-variant mt-0.5 text-[11px]">{al.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Time Saved</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-primary-container mt-1">45m</div>
          <span className="text-[10px] text-secondary font-semibold">via smart routing</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Active Bookings</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-secondary mt-1">
            {bookings.length > 0 ? `${bookings.length} Passes` : '2 Active'}
          </div>
          <span className="text-[10px] text-on-surface-variant">Gate 4 & Hall A</span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Current Zone Status</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-tertiary-dark mt-1">
            {currentZone.occupancy_percent >= 80 ? 'High' : currentZone.occupancy_percent >= 50 ? 'Moderate' : 'Comfortable'}
          </div>
          <span className="text-[10px] text-tertiary-dark font-semibold">
            {currentZone.name} ({currentZone.occupancy_percent}%)
          </span>
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
                <div className="flex-1 bg-white rounded-xl p-4 border border-primary-container/30 shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-primary-container">UP NEXT • 10:30 AM - 12:00 PM</span>
                    <Badge variant="coral">Moderate Density</Badge>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">Keynote: Spatial AI in Mega-Event Crowd Logistics</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-outline" />
                    Plenary Hall A • Seat Reserved (Row F, 22)
                  </p>

                  <div className="mt-4 pt-3 border-t border-surface-container-high flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-secondary" />
                      <span className="text-xs font-mono font-bold text-on-surface">PASS-94821</span>
                    </div>
                    <Link href="/alternatives">
                      <Button size="sm" variant="secondary" className="text-xs">
                        <Shuffle className="w-3.5 h-3.5 mr-1" />
                        <span>Explore Less Crowded Route</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Item 3: Lunch */}
              <div className="relative flex items-start gap-4">
                <div className="relative z-10 w-8 h-8 rounded-full bg-surface-container-high text-outline flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-surface-container-lowest rounded-xl p-4 border border-outline-subtle">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-on-surface-variant">12:30 PM</span>
                    <Badge variant="neutral">Upcoming</Badge>
                  </div>
                  <h4 className="font-bold text-sm text-on-surface">Networking Lunch Break</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Central Dining Courtyard (Nudge: Pavilion 2 has zero queues)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Nudge Advisory & Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Smart Nudge Card */}
          <div className="p-5 rounded-2xl bg-tertiary-fixed/40 border border-tertiary-dark/20 space-y-3">
            <div className="flex items-center gap-2 text-tertiary-dark font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-tertiary-dark shrink-0" />
              <span>Flowcast Nudge Engine</span>
            </div>
            <h3 className="font-bold text-sm text-on-surface">
              Gate 4 Crowd Spike Warning (+24 min wait)
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Real-time turnstile telemetry detected a 35% surge at North Gate 4. Divert through West Concourse Gate 2 for immediate expedited clearance.
            </p>
            <div className="pt-1">
              <Link href="/alternatives">
                <Button size="sm" className="w-full text-xs">
                  <span>Accept Reroute & Save 20m</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Zone Telemetry Card */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-on-surface">Live Zone Density</h4>
              <Link href="/map" className="text-xs text-secondary font-semibold hover:underline">
                Full Map →
              </Link>
            </div>
            <div className="space-y-2.5">
              {(zones.length > 0 ? zones.slice(0, 4) : [
                { name: 'Gate 4 North FastTrack', occupancy_percent: 92, status: 'red' },
                { name: 'Plenary Summit Hall A', occupancy_percent: 86, status: 'amber' },
                { name: 'Innovation Expo Pavilion 2', occupancy_percent: 42, status: 'green' },
                { name: 'Central Food Court', occupancy_percent: 68, status: 'amber' },
              ]).map((z: any) => (
                <div key={z.name || z.id} className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-on-surface block">{z.name}</span>
                    <span className="text-[10px] text-on-surface-variant">
                      {z.occupancy_percent >= 80 ? 'Heavy Density' : z.occupancy_percent >= 50 ? 'Moderate' : 'Low Queue'}
                    </span>
                  </div>
                  <Badge variant={z.occupancy_percent >= 85 ? 'coral' : z.occupancy_percent >= 60 ? 'amber' : 'teal'}>
                    {z.occupancy_percent}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
