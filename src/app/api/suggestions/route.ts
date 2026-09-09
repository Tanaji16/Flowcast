import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ZoneModel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  occupancy_percent: number;
  status?: string;
}

interface AlternativeCandidate {
  id: string;
  name: string;
  type: 'hotel' | 'venue';
  address: string;
  lat: number;
  lng: number;
  zone_id: string;
  zone_name: string;
  zone_occupancy: number;
  price_per_night?: number;
  rating?: number;
}

// Demo fallback zones
const DEMO_ZONES: ZoneModel[] = [
  {
    id: 'delhi-z1',
    name: 'Gate 4 North FastTrack',
    lat: 28.6190,
    lng: 77.2420,
    occupancy_percent: 92,
    status: 'red',
  },
  {
    id: 'delhi-z2',
    name: 'Plenary Summit Hall A',
    lat: 28.6184,
    lng: 77.2410,
    occupancy_percent: 86,
    status: 'red',
  },
  {
    id: 'delhi-z3',
    name: 'Central Food Court',
    lat: 28.6180,
    lng: 77.2405,
    occupancy_percent: 68,
    status: 'amber',
  },
  {
    id: 'delhi-z4',
    name: 'Innovation Expo Pavilion 2',
    lat: 28.6175,
    lng: 77.2430,
    occupancy_percent: 42, // Underutilized (<60%)
    status: 'green',
  },
  {
    id: 'delhi-z5',
    name: 'Supreme Court Metro Shuttle Hub',
    lat: 28.6210,
    lng: 77.2400,
    occupancy_percent: 35, // Underutilized (<60%)
    status: 'green',
  },
  {
    id: 'mum-z1',
    name: 'Grand Pavilion East',
    lat: 19.0620,
    lng: 72.8640,
    occupancy_percent: 52, // Underutilized (<60%)
    status: 'green',
  },
  {
    id: 'mum-z2',
    name: 'BKC Skywalk Entrance',
    lat: 19.0630,
    lng: 72.8650,
    occupancy_percent: 64,
    status: 'amber',
  },
];

// Demo fallback venues and partner hotels linked to underutilized zones
const DEMO_VENUES_AND_HOTELS: AlternativeCandidate[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: 'The Lalit New Delhi (Partner Lodging)',
    type: 'hotel',
    address: 'Barakhamba Avenue, Connaught Place, New Delhi',
    lat: 28.6315,
    lng: 77.2285,
    zone_id: 'delhi-z5',
    zone_name: 'Supreme Court Metro Shuttle Hub',
    zone_occupancy: 35,
    price_per_night: 8500,
    rating: 4.8,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Innovation Expo Pavilion 2 Garden Dining Lounge',
    type: 'venue',
    address: 'Pragati Maidan Complex Wing B, New Delhi',
    lat: 28.6175,
    lng: 77.2430,
    zone_id: 'delhi-z4',
    zone_name: 'Innovation Expo Pavilion 2',
    zone_occupancy: 42,
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: 'Shangri-La Eros New Delhi',
    type: 'hotel',
    address: '19 Ashoka Road, Janpath, Connaught Place, New Delhi',
    lat: 28.6210,
    lng: 77.2180,
    zone_id: 'delhi-z5',
    zone_name: 'Supreme Court Metro Shuttle Hub',
    zone_occupancy: 35,
    price_per_night: 11200,
    rating: 4.9,
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Supreme Court Metro Express Shuttle Line B',
    type: 'venue',
    address: 'Supreme Court Metro Station Gate 3, New Delhi',
    lat: 28.6210,
    lng: 77.2400,
    zone_id: 'delhi-z5',
    zone_name: 'Supreme Court Metro Shuttle Hub',
    zone_occupancy: 35,
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    name: 'Trident Bandra Kurla (Partner Hotel)',
    type: 'hotel',
    address: 'C 56, G Block BKC, Bandra Kurla Complex, Mumbai',
    lat: 19.0665,
    lng: 72.8670,
    zone_id: 'mum-z1',
    zone_name: 'Grand Pavilion East',
    zone_occupancy: 52,
    price_per_night: 9800,
    rating: 4.7,
  },
];

// Great-circle Haversine formula to compute distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

async function getSuggestionsForZone(targetZoneId?: string | null) {
  // 1. Fetch live zones from database or fallback
  let allZones: ZoneModel[] = DEMO_ZONES;
  try {
    const supabase = createClient();
    const { data } = await (supabase.from('zones') as any).select('*');
    if (data && data.length > 0) {
      allZones = (data as any[]).map((z) => ({
        id: z.id,
        name: z.name,
        lat: Number(z.lat) || 37.784,
        lng: Number(z.lng) || -122.401,
        occupancy_percent:
          z.occupancy_percent ||
          Math.round(((z.current_occupancy || 0) / (z.max_capacity || 1000)) * 100),
        status: z.status,
      }));
    }
  } catch {
    // fallback
  }

  // 2. Identify the origin zone
  let sourceZone: ZoneModel | undefined;
  if (targetZoneId) {
    sourceZone = allZones.find(
      (z) => z.id === targetZoneId || z.name.toLowerCase().includes(targetZoneId.toLowerCase())
    );
  }
  // Default to highest occupancy zone if not specified
  if (!sourceZone) {
    sourceZone = [...allZones].sort((a, b) => b.occupancy_percent - a.occupancy_percent)[0];
  }

  // 3. Filter for underutilized zones (occupancy < 60%)
  const underutilizedZones = allZones.filter(
    (z) => z.occupancy_percent < 60 && z.id !== sourceZone?.id
  );
  const underutilizedZoneIds = new Set(underutilizedZones.map((z) => z.id));

  // 4. Fetch alternative hotels & venues in these underutilized zones
  let candidates: AlternativeCandidate[] = [];

  try {
    const supabase = createClient();
    // Check hotels in DB
    const { data: hotelsData } = await (supabase.from('hotels') as any).select('*');
    if (hotelsData && hotelsData.length > 0) {
      hotelsData.forEach((h: any) => {
        // Find nearest underutilized zone for each hotel
        let nearestZone = underutilizedZones[0];
        let minD = 99999;
        underutilizedZones.forEach((uz) => {
          const d = calculateDistanceKm(uz.lat, uz.lng, Number(h.lat) || uz.lat, Number(h.lng) || uz.lng);
          if (d < minD) {
            minD = d;
            nearestZone = uz;
          }
        });

        if (nearestZone) {
          candidates.push({
            id: h.id,
            name: h.name,
            type: 'hotel',
            address: h.address,
            lat: Number(h.lat) || nearestZone.lat,
            lng: Number(h.lng) || nearestZone.lng,
            zone_id: nearestZone.id,
            zone_name: nearestZone.name,
            zone_occupancy: nearestZone.occupancy_percent,
            price_per_night: h.price_per_night,
            rating: h.rating,
          });
        }
      });
    }

    // Check venues in DB
    const { data: venuesData } = await (supabase.from('venues') as any).select('*');
    if (venuesData && venuesData.length > 0) {
      venuesData.forEach((v: any) => {
        const matchingZone = underutilizedZones.find((uz) => uz.name.includes(v.name) || uz.occupancy_percent < 60);
        if (matchingZone) {
          candidates.push({
            id: v.id,
            name: `${v.name} (Alternative Campus)`,
            type: 'venue',
            address: v.location,
            lat: Number(v.lat) || matchingZone.lat,
            lng: Number(v.lng) || matchingZone.lng,
            zone_id: matchingZone.id,
            zone_name: matchingZone.name,
            zone_occupancy: matchingZone.occupancy_percent,
          });
        }
      });
    }
  } catch {
    // Fallback
  }

  // If DB candidates empty, use curated demo candidates from underutilized zones
  if (candidates.length === 0) {
    candidates = DEMO_VENUES_AND_HOTELS.filter((c) =>
      underutilizedZoneIds.has(c.zone_id) || c.zone_occupancy < 60
    );
  }

  // 5. Calculate distance from source_zone, mock discount percentage, and sort by distance
  const scoredSuggestions = candidates.map((item) => {
    const distanceKm = calculateDistanceKm(
      sourceZone.lat,
      sourceZone.lng,
      item.lat,
      item.lng
    );

    // Rule-based mock discount percentage to simulate incentive engine:
    // Lower occupancy = higher incentive discount (e.g. 19% occupancy gives ~31% discount)
    const discountPercent = Math.min(
      35,
      Math.max(10, Math.round((60 - item.zone_occupancy) * 0.5 + 10))
    );

    const timeSavedMinutes = Math.max(
      10,
      Math.round((sourceZone.occupancy_percent - item.zone_occupancy) * 0.35)
    );

    let incentiveText = '';
    if (item.type === 'hotel') {
      incentiveText = `${discountPercent}% Off Room Rate + Complimentary Express Shuttle Pass`;
    } else {
      incentiveText = `${discountPercent}% Dining Discount + Reserved Lounge Workspace`;
    }

    const explanation = `Located in ${item.zone_name} (only ${item.zone_occupancy}% occupied, zero queue). Distance: ${distanceKm} km. Saves approx ${timeSavedMinutes} mins waiting time.`;

    return {
      id: item.id,
      name: item.name,
      type: item.type,
      address: item.address,
      zone_id: item.zone_id,
      zone_name: item.zone_name,
      zone_occupancy_percent: item.zone_occupancy,
      distance_km: distanceKm,
      distance_formatted: `${distanceKm} km away`,
      mock_discount_percent: discountPercent,
      discount_percent: discountPercent,
      discount_label: `${discountPercent}% OFF`,
      incentive: incentiveText,
      explanation,
      estimated_wait_minutes: item.zone_occupancy < 30 ? 2 : 5,
      time_saved_minutes: timeSavedMinutes,
      rating: item.rating || 4.7,
      price_per_night: item.price_per_night,
      // Backward compatibility fields:
      title: item.name,
      description: explanation,
      originalZone: sourceZone.name,
      alternativeZone: item.zone_name,
      estimatedWaitDifferenceMinutes: timeSavedMinutes,
    };
  });

  // Sort strictly by distance ascending
  scoredSuggestions.sort((a, b) => a.distance_km - b.distance_km);

  // Return top 2-3 alternatives
  const topSuggestions = scoredSuggestions.slice(0, 3);

  return {
    success: true,
    rule_applied: 'Underutilized zones with occupancy < 60% sorted by distance + dynamic incentive discount',
    source_zone: {
      id: sourceZone.id,
      name: sourceZone.name,
      current_occupancy_percent: sourceZone.occupancy_percent,
      status: sourceZone.status || (sourceZone.occupancy_percent > 75 ? 'critical' : 'normal'),
    },
    underutilized_zones_evaluated: underutilizedZones.length,
    count: topSuggestions.length,
    suggestions: topSuggestions,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get('zone_id') || searchParams.get('zoneId');
    const result = await getSuggestionsForZone(zoneId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve suggestions', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const zoneId = body.zone_id || body.zoneId;
    const result = await getSuggestionsForZone(zoneId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process suggestion query', details: String(error) },
      { status: 500 }
    );
  }
}
