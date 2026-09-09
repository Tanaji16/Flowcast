'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { Check, QrCode, ArrowRight, Home, Calendar, Loader2 } from 'lucide-react';

export default function BookingConfirmationPage() {
  const [latestBooking, setLatestBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLatestBooking() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (data) {
            setLatestBooking(data);
          }
        }
      } catch (err) {
        console.warn('Booking load warning:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLatestBooking();
  }, []);

  const bookingDetails = latestBooking?.details || {};
  const bookingTitle = bookingDetails.title || 'Supreme Court Express Shuttle Line B';
  const bookingId = latestBooking?.id
    ? `#FC-${latestBooking.id.substring(0, 5).toUpperCase()}`
    : '#FC-94821';

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-10 px-4 max-w-md mx-auto">
      <Card className="w-full text-center p-8 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <h1 className="font-bold text-2xl text-on-surface">Reservation Confirmed!</h1>
        <p className="text-xs text-on-surface-variant mt-1 mb-6">
          Your alternative booking has been confirmed in Supabase and attached to your Flowcast digital pass.
        </p>

        {/* Receipt Details Card */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-subtle text-left text-xs space-y-2.5 mb-6">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Confirmation ID:</span>
            <span className="font-mono font-bold text-on-surface">{bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Service Type:</span>
            <span className="font-bold text-on-surface">{bookingTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Status:</span>
            <span className="font-bold text-secondary capitalize">{latestBooking?.status || 'Confirmed'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Assigned Time Slot:</span>
            <span className="font-bold text-secondary">Immediate FastTrack Priority</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <Link href="/itinerary" className="block">
            <Button className="w-full">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>View in Schedule</span>
            </Button>
          </Link>
          <Link href="/dashboard" className="block">
            <Button variant="secondary" className="w-full">
              <Home className="w-4 h-4 mr-1.5" />
              <span>Return to Hub</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
