'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Compass, ShieldAlert, Accessibility, BellRing } from 'lucide-react';

const MOBILITY_OPTIONS = [
  { id: 'standard', title: 'Standard Flow (Balanced)', desc: 'Balanced walking pace with occasional stairs and escalators', icon: Compass },
  { id: 'crowd-averse', title: 'Crowd-Averse (Quiet Corridors)', desc: 'Re-routes you to low-density halls even if it adds 2-3 mins', icon: ShieldAlert },
  { id: 'accessible', title: 'Step-Free & Accessible Only', desc: 'Prioritizes elevators, flat walkways, and priority shuttle seats', icon: Accessibility },
];

export default function OnboardingStep2Page() {
  const router = useRouter();
  const [selectedMobility, setSelectedMobility] = useState('crowd-averse');
  const [enableNudges, setEnableNudges] = useState(true);

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl border border-outline-subtle shadow-xl p-6 sm:p-10">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-secondary tracking-wider uppercase">
            Step 2 of 2
          </span>
          <span className="text-xs text-on-surface-variant">Mobility & Nudges</span>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mb-6">
          <div className="bg-secondary h-full rounded-full w-full transition-all duration-300" />
        </div>

        <h1 className="font-bold text-2xl text-on-surface tracking-tight">
          How would you like to travel?
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 mb-6">
          Personalize your walking corridors and automated crowd avoidance nudges.
        </p>

        {/* Mobility Options */}
        <div className="space-y-3 mb-6">
          {MOBILITY_OPTIONS.map(({ id, title, desc, icon: Icon }) => {
            const isSelected = selectedMobility === id;
            return (
              <div
                key={id}
                onClick={() => setSelectedMobility(id)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-secondary bg-surface-container-low/80 shadow-xs ring-1 ring-secondary'
                    : 'border-outline-subtle bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSelected ? 'border-secondary bg-secondary text-white' : 'border-outline-subtle'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-secondary" />
                    <h4 className="font-bold text-sm text-on-surface">{title}</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notification toggle */}
        <div className="p-4 rounded-xl border border-outline-subtle bg-surface-container-low mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container/15 text-primary flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-bold text-xs text-on-surface">Live Congestion Nudges</h5>
              <p className="text-[11px] text-on-surface-variant">Notify me before a hall or dining zone exceeds 80% capacity</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={enableNudges}
            onChange={(e) => setEnableNudges(e.target.checked)}
            className="w-5 h-5 accent-secondary cursor-pointer"
          />
        </div>

        <Button
          variant="teal"
          onClick={() => router.push('/dashboard')}
          className="w-full py-3.5"
        >
          <span>Complete Setup & Launch Dashboard</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
