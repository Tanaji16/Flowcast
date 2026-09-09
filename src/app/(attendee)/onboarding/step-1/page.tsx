'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Check, Sparkles, Presentation, Cpu, UtensilsCrossed, Coffee } from 'lucide-react';

const PRIORITIES = [
  { id: 'keynotes', title: 'Plenary & Keynote Sessions', desc: 'Main stage announcements and high-impact talks', icon: Presentation },
  { id: 'tech', title: 'Technical Workshops & Expo', desc: 'Hands-on code labs, booths, and tech showcases', icon: Cpu },
  { id: 'networking', title: 'Quiet Networking & Lounges', desc: 'Spaces designed for relaxed conversation with low noise', icon: Coffee },
  { id: 'dining', title: 'Dining & Refreshment Hubs', desc: 'Off-peak meal alerts and dining pass bookings', icon: UtensilsCrossed },
];

export default function OnboardingStep1Page() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(['keynotes', 'tech']);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl border border-outline-subtle shadow-xl p-6 sm:p-10">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-primary-container tracking-wider uppercase">
            Step 1 of 2
          </span>
          <span className="text-xs text-on-surface-variant">Preferences</span>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mb-6">
          <div className="bg-primary-container h-full rounded-full w-1/2 transition-all duration-300" />
        </div>

        <h1 className="font-bold text-2xl text-on-surface tracking-tight">
          What matters most at this event?
        </h1>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 mb-6">
          Flowcast uses your priorities to curate routes that avoid bottlenecks between your key sessions.
        </p>

        {/* Selection list */}
        <div className="space-y-3 mb-8">
          {PRIORITIES.map(({ id, title, desc, icon: Icon }) => {
            const isChecked = selected.includes(id);
            return (
              <div
                key={id}
                onClick={() => toggle(id)}
                className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                  isChecked
                    ? 'border-primary-container bg-surface-container-low/80 shadow-xs ring-1 ring-primary-container'
                    : 'border-outline-subtle bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                    isChecked ? 'bg-primary-container border-primary-container text-white' : 'border-outline-subtle'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary-container" />
                    <h4 className="font-bold text-sm text-on-surface">{title}</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Button onClick={() => router.push('/onboarding/step-2')} className="w-full py-3.5">
          <span>Continue to Step 2</span>
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    </div>
  );
}
