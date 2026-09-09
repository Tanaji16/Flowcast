'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ShieldCheck, Leaf, Award, ArrowLeft, Download } from 'lucide-react';

export default function TripSummaryPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl text-on-surface tracking-tight">Event Flow Summary</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Your mindful travel stats and crowd optimization impact.
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Dashboard</span>
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 text-center bg-gradient-to-br from-white to-surface-container-low">
          <div className="w-10 h-10 rounded-full bg-primary-container/15 text-primary-container flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-primary-container">1h 20m</div>
          <span className="text-xs font-bold text-on-surface mt-1 block">Crowd Wait Time Bypassed</span>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Calculated vs average un-routed attendee</p>
        </Card>

        <Card className="p-5 text-center bg-gradient-to-br from-white to-surface-container-low">
          <div className="w-10 h-10 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-secondary">4.2 kg</div>
          <span className="text-xs font-bold text-on-surface mt-1 block">Carbon Footprint Saved</span>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Via electric shuttle & shared transit</p>
        </Card>

        <Card className="p-5 text-center bg-gradient-to-br from-white to-surface-container-low">
          <div className="w-10 h-10 rounded-full bg-tertiary/15 text-tertiary-dark flex items-center justify-center mx-auto mb-2">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-tertiary-dark">94%</div>
          <span className="text-xs font-bold text-on-surface mt-1 block">Smooth Journey Score</span>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Top 5% among event participants</p>
        </Card>
      </div>

      {/* Highlights */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-base text-on-surface">Journey Highlights</h3>
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
            <span>Morning Check-in (Gate 4 Express)</span>
            <Badge variant="teal">0m Wait</Badge>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
            <span>Reroute: Pavilion 2 Garden Dining</span>
            <Badge variant="teal">Saved 25m</Badge>
          </div>
          <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
            <span>FastTrack Entry: Plenary Hall A</span>
            <Badge variant="teal">On Time</Badge>
          </div>
        </div>

        <Button variant="secondary" className="w-full mt-4">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          <span>Export Digital Journey Log (PDF)</span>
        </Button>
      </Card>
    </div>
  );
}
