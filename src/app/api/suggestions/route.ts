import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FALLBACK_SUGGESTIONS = [
  {
    id: '55555555-5555-5555-5555-555555555501',
    title: 'Less Crowded Dining Option',
    description: 'West Food Plaza is at 70% capacity. East Lounge has artisan coffee and quick food items with zero wait.',
    originalZone: 'West Food & Dining Plaza',
    originalZoneId: '11111111-1111-1111-1111-111111111103',
    alternativeZone: 'East Networking Lounge',
    alternativeZoneId: '11111111-1111-1111-1111-111111111105',
    incentive: 'Free Espresso & Pastry Voucher',
    estimatedWaitDifferenceMinutes: 20,
    timeSaved: 'Saves 20 mins',
    type: 'Dining Hub',
  },
  {
    id: '55555555-5555-5555-5555-555555555502',
    title: 'Keynote Overflow Stream Lounge',
    description: 'Keynote hall is filling up fast. Watch the live broadcast in comfort at South Tech Pavilion.',
    originalZone: 'Keynote Grand Auditorium',
    originalZoneId: '11111111-1111-1111-1111-111111111102',
    alternativeZone: 'South Tech Pavilion & Demos',
    alternativeZoneId: '11111111-1111-1111-1111-111111111104',
    incentive: 'Guaranteed Seating & Device Charging',
    estimatedWaitDifferenceMinutes: 15,
    timeSaved: 'Saves 15 mins queue',
    type: 'Session Streaming',
  },
  {
    id: '55555555-55555-5555-5555-555555555503',
    title: 'Waterfront Tech Hub Alternative',
    description: 'Avoid Main Hall crowds by checking into the scenic waterfront Pier 48 Satellite for startup demos.',
    originalZone: 'Main Exhibition Hall A',
    originalZoneId: '11111111-1111-1111-1111-111111111101',
    alternativeZone: 'Waterfront Pier 48 Satellite',
    alternativeZoneId: '11111111-1111-1111-1111-111111111106',
    incentive: 'Complimentary Bay Ferry Return Pass',
    estimatedWaitDifferenceMinutes: 25,
    timeSaved: 'Saves 25 mins intake',
    type: 'Venue Hub',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get('zoneId');
    const userId = searchParams.get('userId');

    let suggestions = FALLBACK_SUGGESTIONS;

    try {
      const supabase = createClient();
      let query = (supabase.from('suggestions') as any)
        .select(`
          id,
          title,
          description,
          incentive,
          estimated_wait_difference_minutes,
          active,
          original_zone_id,
          alternative_zone_id,
          user_id
        `)
        .eq('active', true);

      if (zoneId) {
        query = query.eq('original_zone_id', zoneId);
      }
      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        suggestions = (data as any[]).map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          originalZone: s.original_zone_id,
          originalZoneId: s.original_zone_id,
          alternativeZone: s.alternative_zone_id || 'Alternative Zone',
          alternativeZoneId: s.alternative_zone_id || '',
          incentive: s.incentive || undefined,
          estimatedWaitDifferenceMinutes: s.estimated_wait_difference_minutes,
          timeSaved: `Saves ${s.estimated_wait_difference_minutes} mins`,
          type: 'Crowd Nudge',
        }));
      }
    } catch {
      // Graceful fallback to rich static suggestions
    }

    // Filter fallback if zoneId specified and fallback is used
    if (zoneId && suggestions === FALLBACK_SUGGESTIONS) {
      const filtered = suggestions.filter((s) => s.originalZoneId === zoneId);
      if (filtered.length > 0) suggestions = filtered;
    }

    return NextResponse.json({
      success: true,
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve suggestions', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, originalZoneId, alternativeZoneId, incentive, waitDifference } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data, error } = await (supabase.from('suggestions') as any)
      .insert({
        title,
        description,
        original_zone_id: originalZoneId,
        alternative_zone_id: alternativeZoneId,
        incentive,
        estimated_wait_difference_minutes: waitDifference || 15,
        active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, suggestion: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create suggestion', details: String(error) },
      { status: 500 }
    );
  }
}
