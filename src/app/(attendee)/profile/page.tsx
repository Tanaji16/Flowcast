'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { User, ShieldCheck, Clock, Settings, FileText, HelpCircle, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const [name, setName] = useState('Aarav Sharma');
  const [email, setEmail] = useState('aarav.sharma@example.com');
  const [crowdNudges, setCrowdNudges] = useState(true);
  const [dietaryAlerts, setDietaryAlerts] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-primary-container text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-primary-container/25">
            A
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-bold text-xl text-on-surface">{name}</h1>
              <Badge variant="teal">Verified Attendee</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{email}</p>
            <p className="text-xs text-secondary font-semibold mt-1">Pragati Maidan Summit Pass #FC-94821</p>
          </div>
          <Link href="/trip-summary">
            <Button variant="secondary" size="sm">
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>Trip Summary</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Preferences Card */}
      <Card className="p-6 space-y-5">
        <h3 className="font-bold text-base text-on-surface">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">Email Address</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <h3 className="font-bold text-base text-on-surface pt-3 border-t border-surface-container-high">
          Flowcast Nudge Settings
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer">
            <div>
              <span className="text-xs font-bold text-on-surface">Autonomous Congestion Rerouting</span>
              <p className="text-[11px] text-on-surface-variant">Push alerts when scheduled sessions exceed 80% occupancy</p>
            </div>
            <input
              type="checkbox"
              checked={crowdNudges}
              onChange={(e) => setCrowdNudges(e.target.checked)}
              className="w-5 h-5 accent-primary-container cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer">
            <div>
              <span className="text-xs font-bold text-on-surface">Dietary & Dining Off-Peak Advice</span>
              <p className="text-[11px] text-on-surface-variant">Suggest low-wait food hubs during peak meal breaks</p>
            </div>
            <input
              type="checkbox"
              checked={dietaryAlerts}
              onChange={(e) => setDietaryAlerts(e.target.checked)}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-between items-center">
          <Link href="/login">
            <Button variant="danger" size="sm">
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Log Out</span>
            </Button>
          </Link>
          <Button size="sm">Save Preferences</Button>
        </div>
      </Card>
    </div>
  );
}
