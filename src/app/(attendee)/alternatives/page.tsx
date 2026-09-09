'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Bus,
  Hotel,
  Utensils,
  Clock,
  Check,
  ArrowRight,
  Loader2,
  Shuffle,
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronDown,
  Percent,
} from 'lucide-react';

const ORIGIN_ZONE_OPTIONS = [
  { id: 'delhi-z1', name: 'Gate 4 North FastTrack (92% Occ)' },
  { id: 'delhi-z2', name: 'Plenary Summit Hall A (86% Occ)' },
  { id: 'delhi-z3', name: 'Central Food Court (68% Occ)' },
  { id: 'mum-z2', name: 'BKC Skywalk Entrance (64% Occ)' },
];

function AlternativesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialZone = searchParams.get('zone_id') || 'delhi-z1';

  const [selectedOriginZone, setSelectedOriginZone] = useState<string>(initialZone);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestionsData, setSuggestionsData] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'hotel' | 'venue'>('all');
  const [bookingModal, setBookingModal] = useState<any | null>(null);
  const [reserving, setReserving] = useState(false);

  // Fetch smart suggestions dynamically from /api/suggestions
  useEffect(() => {
    let isMounted = true;
    async function fetchAlternatives() {
      setLoading(true);
      try {
        const res = await fetch(`/api/suggestions?zone_id=${encodeURIComponent(selectedOriginZone)}`);
        const data = await res.json();
        if (isMounted) {
          setSuggestionsData(data);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAlternatives();
    return () => {
      isMounted = false;
    };
  }, [selectedOriginZone]);

  const handleConfirmReservation = async () => {
    if (!bookingModal) return;
    setReserving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const itemType = (bookingModal.type === 'transit' ? 'transport' : bookingModal.type === 'hotel' ? 'hotel' : 'venue') as
        | 'transport'
        | 'hotel'
        | 'venue';

      // Insert real booking in Supabase bookings table
      if (user) {
        await (supabase.from('bookings') as any).insert({
          user_id: user.id,
          item_type: itemType,
          item_id: bookingModal.id || '00000000-0000-0000-0000-000000000001',
          status: 'confirmed',
          details: {
            title: bookingModal.name || bookingModal.title,
            discount: bookingModal.discount_label || '20% OFF',
            distance: bookingModal.distance_formatted || `${bookingModal.distance_km} km`,
            timeSaved: `${bookingModal.time_saved_minutes || 15} mins faster`,
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

  const suggestionsList = suggestionsData?.suggestions || [];
  const filteredSuggestions = filterType === 'all' ? suggestionsList : suggestionsList.filter((s: any) => s.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header with Origin Zone Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl text-on-surface tracking-tight">Smart Alternatives & Nudge Engine</h1>
            <Badge variant="teal" className="gap-1 text-xs">
              <Sparkles className="w-3 h-3" />
              <span>AI Flow Optimization</span>
            </Badge>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Bypass congested bottlenecks by opting for underutilized partner lounges, quiet sanctuaries, and expedited transit.
          </p>
        </div>

        {/* Origin Zone Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-on-surface-variant shrink-0">Origin Bottleneck:</span>
          <div className="relative">
            <select
              value={selectedOriginZone}
              onChange={(e) => setSelectedOriginZone(e.target.value)}
              className="text-xs font-bold rounded-xl px-3 py-2 pr-8 border border-outline-subtle bg-surface-container-lowest text-on-surface appearance-none cursor-pointer hover:border-secondary outline-none shadow-xs"
            >
              {ORIGIN_ZONE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>
        </div>
      </div>

      {/* Origin Zone Context Banner */}
      {suggestionsData?.source_zone && (
        <div className="p-4 rounded-xl border border-primary-container/30 bg-primary-container/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-container text-white flex items-center justify-center shrink-0 font-bold text-xs">
              {suggestionsData.source_zone.current_occupancy_percent}%
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-container">
                Heavy Congestion Detected
              </span>
              <h3 className="font-bold text-sm text-on-surface">{suggestionsData.source_zone.name}</h3>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant sm:text-right max-w-md">
            Rerouting incoming footfall toward {suggestionsData.underutilized_zones_evaluated || 3} underutilized zones (&lt;60%
            capacity) with active attendee rewards.
          </p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-container-high pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'all'
              ? 'bg-secondary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          All Recommendations ({suggestionsList.length})
        </button>
        <button
          onClick={() => setFilterType('venue')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'venue'
              ? 'bg-secondary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          Venues & Dining Sanctuaries
        </button>
        <button
          onClick={() => setFilterType('hotel')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterType === 'hotel'
              ? 'bg-secondary text-white shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          Partner Lodging & Stays
        </button>
      </div>

      {/* Dynamic Suggestions Grid */}
      {loading ? (
        <div className="p-12 flex flex-col items-center justify-center gap-3 text-on-surface-variant">
          <Loader2 className="w-6 h-6 animate-spin text-secondary" />
          <p className="text-xs font-semibold">Analyzing underutilized zones and calculating optimal distances...</p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="p-8 text-center text-on-surface-variant text-xs">
          No alternative suggestions available for this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredSuggestions.map((alt: any) => {
            const isHotel = alt.type === 'hotel';
            const Icon = isHotel ? Hotel : Utensils;

            return (
              <Card
                key={alt.id}
                className="p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow border-outline-subtle"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="teal" className="gap-1 font-bold">
                      <Percent className="w-3 h-3" />
                      <span>{alt.discount_label || `${alt.discount_percent}% OFF`}</span>
                    </Badge>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                      {isHotel ? 'Partner Lodging' : 'Quiet Corridor Sanctuary'}
                    </span>
                    <h3 className="font-bold text-base text-on-surface mt-0.5">{alt.name || alt.title}</h3>
                    <p className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0 text-secondary" />
                      <span className="truncate">{alt.address}</span>
                    </p>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed">{alt.explanation || alt.description}</p>
                </div>

                <div className="pt-3 border-t border-surface-container-high space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-primary-container">
                      Saves ~{alt.time_saved_minutes || 20} mins wait
                    </span>
                    <span className="text-[11px] font-semibold text-secondary">
                      {alt.distance_formatted || `${alt.distance_km} km away`}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-surface-container/60 text-[11px] text-on-surface-variant flex items-center justify-between">
                    <span>Destination Occupancy:</span>
                    <span className="font-bold text-secondary">{alt.zone_occupancy_percent || 30}% (Quiet)</span>
                  </div>

                  <Button className="w-full text-xs" onClick={() => setBookingModal(alt)}>
                    <span>Select Alternative</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={!!bookingModal} onClose={() => setBookingModal(null)} title="Confirm Smart Alternative">
        {bookingModal && (
          <div className="space-y-4 py-2 text-xs">
            <p className="text-on-surface leading-relaxed">
              Would you like to reserve <strong>{bookingModal.name || bookingModal.title}</strong>? This reservation will automatically
              attach to your Flowcast digital pass and adjust your itinerary.
            </p>
            <div className="p-3 bg-surface-container-low rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Destination:</span>
                <span className="font-bold text-on-surface">{bookingModal.zone_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Incentive Applied:</span>
                <span className="font-bold text-secondary">{bookingModal.incentive || '25% Discount Applied'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Time Saved:</span>
                <span className="font-bold text-primary-container">~{bookingModal.time_saved_minutes || 20} mins</span>
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
                    Confirming Reservation...
                  </span>
                ) : (
                  'Confirm & Claim Discount'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AlternativesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center text-xs text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin mr-2 text-secondary" />
          Loading smart alternatives...
        </div>
      }
    >
      <AlternativesContent />
    </Suspense>
  );
}

