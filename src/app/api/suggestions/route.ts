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
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Main Exhibition Hall A',
    lat: 37.7840,
    lng: -122.4014,
    occupancy_percent: 92,
    status: 'red',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Gate 4 North FastTrack Entrance',
    lat: 37.7848,
    lng: -122.4018,
    occupancy_percent: 89,
    status: 'red',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'West Food & Dining Plaza',
    lat: 37.7836,
    lng: -122.4025,
    occupancy_percent: 70,
    status: 'amber',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'South Tech Pavilion & Demos',
    lat: 37.7830,
    lng: -122.4010,
    occupancy_percent: 54, // Underutilized (<60%)
    status: 'green',
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'East Networking Lounge & Terrace',
    lat: 37.7845,
    lng: -122.4005,
    occupancy_percent: 28, // Underutilized (<60%)
    status: 'green',
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Waterfront Pier 48 Satellite Hub',
    lat: 37.7725,
    lng: -122.3855,
    occupancy_percent: 19, // Underutilized (<60%)
    status: 'green',
  },
];

// Demo fallback venues and partner hotels linked to zones
const DEMO_VENUES_AND_HOTELS: AlternativeCandidate[] = [
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: 'W San Francisco (Partner Hotel)',
    type: 'hotel',
    address: '181 3rd St, San Francisco, CA',
    lat: 37.7850,
    lng: -122.4007,
    zone_id: '11111111-1111-1111-1111-111111111105',
    zone_name: 'East Networking Lounge & Terrace',
    zone_occupancy: 28,
    price_per_night: 340,
    rating: 4.7,
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'South Tech Pavilion Garden Lounge',
    type: 'venue',
    address: 'South Plaza Wing 2, Moscone Center',
    lat: 37.7830,
    lng: -122.4010,
    zone_id: '11111111-1111-1111-1111-111111111104',
    zone_name: 'South Tech Pavilion & Demos',
    zone_occupancy: 54,
  },
  {
    id: '22222222-2222-2222-2222-222222222206',
    name: 'Palace Hotel Luxury Annex',
    type: 'hotel',
    address: '2 New Montgomery St, San Francisco, CA',
    lat: 37.7885,
    lng: -122.4019,
    zone_id: '11111111-1111-1111-1111-111111111105',
    zone_name: 'East Networking Lounge & Terrace',
    zone_occupancy: 28,
    price_per_night: 320,
    rating: 4.8,
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Pier 48 Waterfront Satellite Pavilion',
    type: 'venue',
    address: 'Pier 48, Mission Rock, San Francisco, CA',
    lat: 37.7725,
    lng: -122.3855,
    zone_id: '11111111-1111-1111-1111-111111111106',
    zone_name: 'Waterfront Pier 48 Satellite Hub',
    zone_occupancy: 19,
  },
  {
    id: '22222222-2222-2222-2222-222222222209',
    name: 'LUMA Hotel Mission Bay',
    type: 'hotel',
    address: '100 Channel St, San Francisco, CA',
    lat: 37.7712,
    lng: -122.3912,
    zone_id: '11111111-1111-1111-1111-111111111106',
    zone_name: 'Waterfront Pier 48 Satellite Hub',
    zone_occupancy: 19,
    price_per_night: 265,
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
