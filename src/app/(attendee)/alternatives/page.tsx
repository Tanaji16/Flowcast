'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Bus, Hotel, Utensils, Clock, Check, ArrowRight, Loader2 } from 'lucide-react';

export default function AlternativesPage() {
  const router = useRouter();
  const [bookingModal, setBookingModal] = useState<any | null>(null);
  const [reserving, setReserving] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const supabase = createClient();
        const { data } = await supabase.from('suggestions').select('*').limit(5);
        if (data && data.length > 0) {
          setSuggestions(data);
        }
      } catch (err) {
        console.warn('Suggestions fetch warning:', err);
      }
    }
    loadSuggestions();
  }, []);

  const ALTERNATIVES = [
    {
      id: 'alt-transit',
      type: 'transit',
      title: 'Supreme Court Metro Express Shuttle Line B',
      desc: 'Bypasses congested Gate 1 highway entrance with designated bus-only express lanes.',
      timeSaved: '20 mins faster',
      frequency: 'Every 8 mins • Zero queue',
      icon: Bus,
      tag: 'Eco Electric Shuttle',
    },
    {
      id: 'alt-hotel',
      type: 'hotel',
      title: 'The Grand Heritage Annex (Partner Lodging)',
      desc: 'Direct priority shuttle connection to Bharat Mandapam. 14 reserved rooms available for verified attendees.',
      timeSaved: 'Saves 35m transit daily',
      frequency: 'Includes Dedicated FastTrack Lane',
      icon: Hotel,
      tag: 'Partner Verified',
    },
    {
      id: 'alt-food',
      type: 'dining',
      title: 'Pavilion 2 Garden Dining Lounge',
      desc: 'Quiet alternative to the packed Central Food Court. Artisan Indian & continental options.',
      timeSaved: '0 min wait (saves 25 mins)',
      frequency: 'Current capacity: 34%',
      icon: Utensils,
      tag: 'Low Crowd Sanctuary',
    },
  ];

  const handleConfirmReservation = async () => {
    setReserving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && bookingModal) {
        // Real insert into Supabase bookings table
        const itemType = (bookingModal.type === 'transit' ? 'transport' : bookingModal.type === 'hotel' ? 'hotel' : 'venue') as 'transport' | 'hotel' | 'venue';
        await (supabase.from('bookings') as any).insert({
          user_id: user.id,
          item_type: itemType,
          item_id: '00000000-0000-0000-0000-000000000001',
          status: 'confirmed',
          details: {
            title: bookingModal.title,
            timeSaved: bookingModal.timeSaved,
            timestamp: new Date().toISOString(),
          },
        });
      }
    } catch (err) {
      console.warn('Booking insertion non-blocking note:', err);
    } finally {
      setReserving(false);
      setBookingModal(null);
      router.push('/booking-confirmation');
    }
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
        {ALTERNATIVES.map((alt) => {
          const Icon = alt.icon;
          return (
            <Card key={alt.id} className="p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="teal">{alt.tag}</Badge>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block">
                    {alt.type}
                  </span>
                  <h3 className="font-bold text-base text-on-surface mt-0.5">{alt.title}</h3>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">{alt.desc}</p>
              </div>

              <div className="pt-3 border-t border-surface-container-high space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary-container">{alt.timeSaved}</span>
                  <span className="text-[11px] text-on-surface-variant">{alt.frequency}</span>
                </div>

                <Button
                  className="w-full text-xs"
                  onClick={() => setBookingModal(alt)}
                >
                  <span>Select Alternative</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={!!bookingModal}
        onClose={() => setBookingModal(null)}
        title="Confirm Alternative Option"
      >
        {bookingModal && (
          <div className="space-y-4 py-2 text-xs">
            <p className="text-on-surface">
              Would you like to reserve <strong>{bookingModal.title}</strong>? This reservation will attach to your Flowcast digital pass and adjust your personal timeline.
            </p>
            <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Benefit:</span>
                <span className="font-bold text-primary-container">{bookingModal.timeSaved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Cost:</span>
                <span className="font-bold text-secondary">Included with Pass</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setBookingModal(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleConfirmReservation} disabled={reserving}>
                {reserving ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Confirming...
                  </span>
                ) : (
                  'Confirm Reservation'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
