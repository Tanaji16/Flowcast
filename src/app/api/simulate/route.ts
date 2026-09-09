import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface SimulateInput {
  extra_visitors?: number;
  extraVisitorCount?: number;
  transport_disrupted?: boolean;
  transportDisruption?: boolean;
  transport_disruption_flag?: boolean;
  time_of_day?: 'morning' | 'afternoon' | 'evening' | 'night' | string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night' | string;
}

interface ZoneData {
  id: string;
  name: string;
  max_capacity: number;
  current_occupancy: number;
  occupancy_percent: number;
  status: string;
  type?: string;
}

const DEFAULT_DEMO_ZONES: ZoneData[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Main Exhibition Hall A',
    max_capacity: 5000,
    current_occupancy: 4100,
    occupancy_percent: 82,
    status: 'red',
    type: 'hall',
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'Gate 4 North FastTrack Entrance',
    max_capacity: 2000,
    current_occupancy: 1560,
    occupancy_percent: 78,
    status: 'amber',
    type: 'entrance',
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'Central Food & Dining Court',
    max_capacity: 2500,
    current_occupancy: 1700,
    occupancy_percent: 68,
    status: 'amber',
    type: 'dining',
  },
  {
    id: '11111111-1111-1111-1111-111111111104',
    name: 'Plenary Summit Keynote Stage',
    max_capacity: 4000,
    current_occupancy: 2800,
    occupancy_percent: 70,
    status: 'amber',
    type: 'hall',
  },
  {
    id: '11111111-1111-1111-1111-111111111105',
    name: 'East Networking Lounge & Sanctuary',
    max_capacity: 1500,
    current_occupancy: 420,
    occupancy_percent: 28,
    status: 'green',
    type: 'sanctuary',
  },
  {
    id: '11111111-1111-1111-1111-111111111106',
    name: 'Metro Shuttle Transit Feeder Hub',
    max_capacity: 2000,
    current_occupancy: 640,
    occupancy_percent: 32,
    status: 'green',
    type: 'transit',
  },
];

async function handleSimulation(input: SimulateInput) {
  const extraVisitors = Math.max(
    0,
    Number(input.extra_visitors ?? input.extraVisitorCount ?? 1500)
  );
  const transportDisrupted = Boolean(
    input.transport_disrupted ??
    input.transportDisruption ??
    input.transport_disruption_flag ??
    false
  );
  const timeOfDay = String(input.time_of_day ?? input.timeOfDay ?? 'afternoon').toLowerCase();

  // Load current zones from Supabase or fallback
  let zones: ZoneData[] = DEFAULT_DEMO_ZONES;
  try {
    const supabase = createClient();
    const { data, error } = await (supabase.from('zones') as any).select('*');
    if (!error && data && data.length > 0) {
      zones = (data as any[]).map((z) => ({
        id: z.id,
        name: z.name,
        max_capacity: z.max_capacity || 1000,
        current_occupancy: z.current_occupancy || 0,
        occupancy_percent:
          z.occupancy_percent ||
          Math.round(((z.current_occupancy || 0) / (z.max_capacity || 1000)) * 100),
        status: z.status || 'green',
        type: z.name.toLowerCase().includes('gate') || z.name.toLowerCase().includes('entrance')
          ? 'entrance'
          : z.name.toLowerCase().includes('food') || z.name.toLowerCase().includes('dining')
          ? 'dining'
          : z.name.toLowerCase().includes('metro') || z.name.toLowerCase().includes('shuttle')
          ? 'transit'
          : z.name.toLowerCase().includes('lounge') || z.name.toLowerCase().includes('sanctuary')
          ? 'sanctuary'
          : 'hall',
      }));
    }
  } catch {
    // Use DEFAULT_DEMO_ZONES
  }

  // Total capacity across all zones for proportional visitor allocation
  const totalCapacity = zones.reduce((sum, z) => sum + z.max_capacity, 0) || 1;

  // Evaluate rule-based impact per zone
  const zoneSimulations = zones.map((zone) => {
    const baseOcc = zone.occupancy_percent;

    // 1. Extra visitor impact:
    // Entrance zones & main stages have higher intake sensitivity weight
    let intakeWeight = 1.0;
    if (zone.type === 'entrance') intakeWeight = 1.6;
    else if (zone.type === 'hall') intakeWeight = 1.2;
    else if (zone.type === 'dining') intakeWeight = 1.1;
    else if (zone.type === 'transit') intakeWeight = 1.3;
    else if (zone.type === 'sanctuary') intakeWeight = 0.5;

    const allocatedVisitors = (extraVisitors * (zone.max_capacity / totalCapacity)) * intakeWeight;
    const visitorImpact = Math.round((allocatedVisitors / zone.max_capacity) * 100);

    // 2. Transport disruption impact:
    let transportImpact = 0;
    if (transportDisrupted) {
      if (zone.type === 'entrance' || zone.type === 'transit') {
        // High queue congestion at bottlenecks when transit lines halt
        transportImpact = 18;
      } else if (zone.type === 'hall') {
        transportImpact = 8;
      } else {
        transportImpact = 4;
      }
    }

    // 3. Time of day impact:
    let timeOfDayImpact = 0;
    if (timeOfDay.includes('morning')) {
      if (zone.type === 'entrance') timeOfDayImpact = 14;
      else if (zone.type === 'hall') timeOfDayImpact = 8;
    } else if (timeOfDay.includes('afternoon') || timeOfDay.includes('lunch')) {
      if (zone.type === 'dining') timeOfDayImpact = 18;
      else if (zone.type === 'hall') timeOfDayImpact = 10;
    } else if (timeOfDay.includes('evening')) {
      if (zone.type === 'sanctuary' || zone.type === 'dining') timeOfDayImpact = 12;
      else if (zone.type === 'transit') timeOfDayImpact = 15;
    } else if (timeOfDay.includes('night')) {
      if (zone.type === 'transit') timeOfDayImpact = 14;
    }

    const estimatedImpact = visitorImpact + transportImpact + timeOfDayImpact;
    const projectedOccupancy = baseOcc + estimatedImpact;

    // Rule-based capacity threshold check:
    // if occupancy_percent + estimated_impact > 90%, mark as "critical"; > 75%, mark as "warning"
    let status: 'critical' | 'warning' | 'normal' = 'normal';
    if (projectedOccupancy > 90) {
      status = 'critical';
    } else if (projectedOccupancy > 75) {
      status = 'warning';
    }

    // Explainable rationale
    let explanation = `Base occupancy: ${baseOcc}%. Extra visitors (+${visitorImpact}%)`;
    if (transportDisrupted) explanation += `, transit disruption (+${transportImpact}%)`;
    if (timeOfDayImpact > 0) explanation += `, ${timeOfDay} schedule (+${timeOfDayImpact}%)`;
    explanation += ` = ${projectedOccupancy}% projected occupancy.`;

    if (status === 'critical') {
      explanation += ` Exceeds 90% critical threshold. Urgent attendee diversion required.`;
    } else if (status === 'warning') {
      explanation += ` Exceeds 75% warning threshold. Nudge alternatives recommended.`;
    } else {
      explanation += ` Within safe operating capacity limits.`;
    }

    return {
      zone_id: zone.id,
      zone_name: zone.name,
      zone_type: zone.type,
      current_occupancy_percent: baseOcc,
      estimated_impact_percent: estimatedImpact,
      projected_occupancy_percent: projectedOccupancy,
      status, // 'critical' | 'warning' | 'normal'
      threshold_breached: status === 'critical' || status === 'warning',
      breakdown: {
        visitor_impact_percent: visitorImpact,
        transport_disruption_impact_percent: transportImpact,
        time_of_day_impact_percent: timeOfDayImpact,
      },
      explanation,
    };
  });

  const criticalZones = zoneSimulations.filter((z) => z.status === 'critical');
  const warningZones = zoneSimulations.filter((z) => z.status === 'warning');
  const safeZones = zoneSimulations.filter((z) => z.status === 'normal');
  const breachedZones = zoneSimulations.filter((z) => z.threshold_breached);

  // Recommended rule-based mitigation actions
  const mitigationActions: string[] = [];
  if (criticalZones.length > 0) {
    criticalZones.forEach((z) => {
      mitigationActions.push(
        `Immediate push nudge: Divert incoming attendees away from ${z.zone_name} to underutilized sanctuaries.`
      );
    });
  }
  if (transportDisrupted) {
    mitigationActions.push(
      'Deploy 4 reserve rapid electric shuttle buses to relieve transit bottlenecks.'
    );
  }
  if (warningZones.length > 0) {
    mitigationActions.push(
      `Pre-emptively open auxiliary check-in turnstiles for ${warningZones.map((w) => w.zone_name).join(', ')}.`
    );
  }
  if (mitigationActions.length === 0) {
    mitigationActions.push('All zones operate within normal safety thresholds. Maintain standard monitoring.');
  }

  return {
    scenario_inputs: {
      extra_visitors: extraVisitors,
      transport_disrupted: transportDisrupted,
      time_of_day: timeOfDay,
    },
    simulated_at: new Date().toISOString(),
    threshold_rules_applied: {
      critical_threshold: '> 90% occupancy',
      warning_threshold: '> 75% occupancy',
    },
    summary: {
      total_zones_evaluated: zoneSimulations.length,
      critical_count: criticalZones.length,
      warning_count: warningZones.length,
      safe_count: safeZones.length,
      has_threshold_breaches: breachedZones.length > 0,
    },
    threshold_breaches: breachedZones,
    critical_zones: criticalZones,
    warning_zones: warningZones,
    safe_zones: safeZones,
    all_zones: zoneSimulations,
    mitigation_actions: mitigationActions,
    // UI backwards compatibility mappings:
    timestamp: new Date().toLocaleTimeString(),
    impacts: zoneSimulations.map((z) => ({
      zone: z.zone_name,
      delta: `+${z.estimated_impact_percent}%`,
      projectedOcc: z.projected_occupancy_percent,
      risk: z.status === 'critical' ? 'critical' : z.status === 'warning' ? 'warning' : 'safe',
    })),
    actions: mitigationActions,
  };
}

export async function POST(req: Request) {
  try {
    const body: SimulateInput = await req.json().catch(() => ({}));
    const result = await handleSimulation(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to run simulation', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const extraVisitors = searchParams.get('extra_visitors') || searchParams.get('extraVisitorCount');
    const transportDisrupted =
      searchParams.get('transport_disrupted') ||
      searchParams.get('transportDisruption') ||
      searchParams.get('transport_disruption_flag');
    const timeOfDay = searchParams.get('time_of_day') || searchParams.get('timeOfDay');

    const result = await handleSimulation({
      extra_visitors: extraVisitors ? Number(extraVisitors) : undefined,
      transport_disrupted: transportDisrupted === 'true' || transportDisrupted === '1',
      time_of_day: timeOfDay || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to run simulation', details: String(error) },
      { status: 500 }
    );
  }
}
