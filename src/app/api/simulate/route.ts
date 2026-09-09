import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface SimulateRequestBody {
  scenario?: string;
  scenarioName?: string;
  intensityMultiplier?: number;
  disruptedZoneId?: string;
  weatherCondition?: 'clear' | 'heavy_rain' | 'extreme_heat';
  transitDisruptionRate?: number;
}

const FALLBACK_ZONES = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Main Exhibition Hall A',
    max_capacity: 5000,
    current_occupancy: 4600,
    status: 'red',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Keynote Grand Auditorium',
    max_capacity: 4000,
    current_occupancy: 3560,
    status: 'red',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'West Food & Dining Plaza',
    max_capacity: 2500,
    current_occupancy: 1750,
    status: 'amber',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'South Tech Pavilion & Demos',
    max_capacity: 3000,
    current_occupancy: 1800,
    status: 'amber',
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'East Networking Lounge',
    max_capacity: 1500,
    current_occupancy: 420,
    status: 'green',
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Waterfront Pier 48 Satellite',
    max_capacity: 2000,
    current_occupancy: 380,
    status: 'green',
  },
];

export async function POST(req: Request) {
  try {
    const body: SimulateRequestBody = await req.json().catch(() => ({}));
    const scenarioName = body.scenarioName || body.scenario || 'General Surge Simulation';
    const intensity = Math.max(0.5, Math.min(3.5, Number(body.intensityMultiplier || 1.5)));
    const disruptedZoneId = body.disruptedZoneId;
    const weather = body.weatherCondition || 'clear';

    // Attempt to load current live zones from Supabase
    let liveZones = FALLBACK_ZONES;
    try {
      const supabase = createClient();
      const { data, error } = await (supabase.from('zones') as any).select('*');
      if (!error && data && data.length > 0) {
        liveZones = (data as any[]).map((z) => ({
          id: z.id,
          name: z.name,
          max_capacity: z.max_capacity,
          current_occupancy: z.current_occupancy,
          status: z.status,
        }));
      }
    } catch {
      // Fallback to FALLBACK_ZONES if Supabase is initializing
    }

    const now = new Date().toISOString();

    // Compute discrete event simulation projections per zone
    const impacts = liveZones.map((zone, index) => {
      const isDisrupted = disruptedZoneId ? zone.id === disruptedZoneId : index < 2;
      const weatherFactor = weather === 'heavy_rain' ? (zone.name.includes('Plaza') ? 0.6 : 1.3) : 1.0;
      
      let deltaPercent: number;
      if (isDisrupted) {
        deltaPercent = Math.round((intensity - 1.0) * 45 + (weatherFactor - 1.0) * 20);
      } else if (index % 2 === 0) {
        deltaPercent = Math.round((intensity - 1.0) * 20);
      } else {
        deltaPercent = Math.round(-(intensity * 10));
      }

      const baselineOccPercent = Math.round((zone.current_occupancy / zone.max_capacity) * 100);
      const projectedOcc = Math.min(100, Math.max(5, baselineOccPercent + deltaPercent));
      const projectedOccupancy = Math.round((projectedOcc / 100) * zone.max_capacity);

      let risk: 'safe' | 'warning' | 'critical' = 'safe';
      if (projectedOcc >= 85) risk = 'critical';
      else if (projectedOcc >= 60) risk = 'warning';

      return {
        zoneId: zone.id,
        zone: zone.name,
        zoneName: zone.name,
        currentOcc: baselineOccPercent,
        projectedOcc,
        projectedOccupancy,
        delta: deltaPercent >= 0 ? `+${deltaPercent}%` : `${deltaPercent}%`,
        occupancyDelta: deltaPercent >= 0 ? `+${deltaPercent}%` : `${deltaPercent}%`,
        risk,
        riskLevel: risk,
      };
    });

    // Formulate tailored algorithmic mitigation recommendations
    const actions = [
      `Dispatch reserve electric shuttles to alleviate ingress demand for ${scenarioName}.`,
      'Broadcast automated attendee nudge notifications to divert footfall toward underutilized zones.',
      'Enable rapid overflow entry gates with wireless mobile scanners to maintain flow rate.',
    ];

    if (weather === 'heavy_rain') {
      actions.unshift('Open covered interior skybridge corridors to redirect outdoor transit pathways.');
    }

    const result = {
      scenario: scenarioName,
      scenarioName,
      intensityMultiplier: intensity,
      timestamp: now,
      simulatedAt: now,
      impacts,
      affectedZones: impacts.map((i) => ({
        zoneId: i.zoneId,
        zoneName: i.zoneName,
        projectedOccupancy: i.projectedOccupancy,
        riskLevel: i.riskLevel,
      })),
      actions,
      mitigationActions: actions,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute simulation scenario', details: String(error) },
      { status: 500 }
    );
  }
}
