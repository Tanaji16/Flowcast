'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useRouter } from 'next/navigation';
import { Bus, Hotel, Utensils, Clock, Check, ArrowRight } from 'lucide-react';

export default function AlternativesPage() {
  const router = useRouter();
  const [bookingModal, setBookingModal] = useState<any | null>(null);

  const ALTERNATIVES = [
    {
      id: 'alt-transit',
      type: 'Transit Feeder',
      title: 'Supreme Court Metro Express Shuttle Line B',
      desc: 'Bypasses congested Gate 1 highway entrance with designated bus-only express lanes.',
      timeSaved: '20 mins faster',
      frequency: 'Every 8 mins • Zero queue',
      icon: Bus,
      tag: 'Eco Electric Shuttle',
    },
    {
      id: 'alt-hotel',
      type: 'Accommodation Partner',
      title: 'The Grand Heritage Annex (Partner Lodging)',
      desc: 'Direct priority shuttle connection to Bharat Mandapam. 14 reserved rooms available for verified attendees.',
      timeSaved: 'Saves 35m transit daily',
      frequency: 'Includes Dedicated FastTrack Lane',
      icon: Hotel,
      tag: 'Partner Verified',
    },
    {
      id: 'alt-food',
      type: 'Dining Hub',
      title: 'Pavilion 2 Garden Dining Lounge',
      desc: 'Quiet alternative to the packed Central Food Court. Artisan Indian & continental options.',
      timeSaved: '0 min wait (saves 25 mins)',
      frequency: 'Current capacity: 34%',
      icon: Utensils,
      tag: 'Low Crowd Sanctuary',
    },
  ];

  const handleConfirmReservation = () => {
    setBookingModal(null);
    router.push('/booking-confirmation');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-on-surface tracking-tight">Smart Alternatives & Rerouting</h1>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Beat the crowds by opting for verified alternative transport, off-peak dining, and partner lodging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ALTERNATIVES.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="flex flex-col justify-between p-5 sm:p-6 border-l-4 border-l-secondary">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <Badge variant="teal">{item.tag}</Badge>
                </div>
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{item.type}</span>
                <h3 className="font-bold text-base text-on-surface mt-1">{item.title}</h3>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{item.desc}</p>
                
                <div className="mt-4 p-2.5 rounded-xl bg-surface-container text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.timeSaved}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-surface-container-high">
                <Button
                  className="w-full"
                  onClick={() => setBookingModal(item)}
                >
                  <span>Reserve Alternative</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!bookingModal}
        onClose={() => setBookingModal(null)}
        title="Confirm Alternative Reservation"
        description="Reserve priority access to alleviate peak congestion"
      >
        {bookingModal && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low text-xs space-y-1">
              <div><strong>Service:</strong> {bookingModal.title}</div>
              <div><strong>Advantage:</strong> {bookingModal.timeSaved}</div>
              <div><strong>Status:</strong> Instant Confirmation</div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setBookingModal(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirmReservation}>
                Confirm Reservation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
