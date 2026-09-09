'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhoneCall, ShieldAlert, ChevronDown, ChevronUp, MessageSquare, MapPin } from 'lucide-react';

const FAQS = [
  {
    q: 'How does Flowcast calculate live zone congestion?',
    a: 'Flowcast combines turnstile scan rates, WiFi density telemetry, and digital twin predictive simulation models to project bottlenecks 15-30 minutes ahead of time.',
  },
  {
    q: 'What happens if my keynote session reaches 100% code capacity?',
    a: 'You will receive an automatic high-priority nudge offering overflow viewing lounges or priority reserved seating in adjacent tech halls with zero wait time.',
  },
  {
    q: 'Where are the emergency medical and safety desks located?',
    a: 'Medical stations are active at Gate 4 North and Hall 3 East Concourse. Dedicated event emergency teams can be reached 24/7 via the hotline below.',
  },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Emergency Hotline Banner */}
      <div className="p-5 rounded-2xl bg-error-container/40 border border-error/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-error">Venue Safety & Emergency Desk</h3>
            <p className="text-xs text-on-surface-variant">24/7 Rapid Incident Response Team on-site</p>
          </div>
        </div>
        <a href="tel:+911123371500">
          <Button variant="danger" size="sm" className="whitespace-nowrap">
            <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
            <span>Call Safety Desk</span>
          </Button>
        </a>
      </div>

      {/* FAQs */}
      <Card className="p-6 space-y-4">
        <h2 className="font-bold text-lg text-on-surface">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-outline-subtle rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-on-surface bg-surface-container-low/40 hover:bg-surface-container-low cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs text-on-surface-variant leading-relaxed bg-surface-container-lowest border-t border-surface-container-high">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
