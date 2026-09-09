-- supabase/seed.sql
-- Realistic seed dataset for Flowcast (San Francisco Demo Scenario)

-- Clean existing data
TRUNCATE TABLE public.feedback CASCADE;
TRUNCATE TABLE public.suggestions CASCADE;
TRUNCATE TABLE public.alerts CASCADE;
TRUNCATE TABLE public.bookings CASCADE;
TRUNCATE TABLE public.transport_routes CASCADE;
TRUNCATE TABLE public.hotels CASCADE;
TRUNCATE TABLE public.zones CASCADE;
TRUNCATE TABLE public.venues CASCADE;

-- 1. VENUES
INSERT INTO public.venues (id, name, location, lat, lng, total_capacity)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Moscone Convention Center', '747 Howard St, San Francisco, CA', 37.7842, -122.4016, 25000),
  ('00000000-0000-0000-0000-000000000002', 'Chase Center Arena', '1 Warriors Way, San Francisco, CA', 37.7680, -122.3877, 18000),
  ('00000000-0000-0000-0000-000000000003', 'Fort Mason Innovation Pier', '2 Marina Blvd, San Francisco, CA', 37.8066, -122.4287, 7500);

-- 2. ZONES (6 zones with varied occupancy across green, amber, red)
INSERT INTO public.zones (id, venue_id, name, lat, lng, max_capacity, current_occupancy, occupancy_percent, status)
VALUES
  (
    '11111111-1111-1111-1111-111111111101',
    '00000000-0000-0000-0000-000000000001',
    'Main Exhibition Hall A',
    37.7840,
    -122.4014,
    5000,
    4600,
    92,
    'red'
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    '00000000-0000-0000-0000-000000000001',
    'Keynote Grand Auditorium',
    37.7848,
    -122.4018,
    4000,
    3560,
    89,
    'red'
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    '00000000-0000-0000-0000-000000000001',
    'West Food & Dining Plaza',
    37.7836,
    -122.4025,
    2500,
    1750,
    70,
    'amber'
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    '00000000-0000-0000-0000-000000000001',
    'South Tech Pavilion & Demos',
    37.7830,
    -122.4010,
    3000,
    1800,
    60,
    'amber'
  ),
  (
    '11111111-1111-1111-1111-111111111105',
    '00000000-0000-0000-0000-000000000001',
    'East Networking Lounge',
    37.7845,
    -122.4005,
    1500,
    420,
    28,
    'green'
  ),
  (
    '11111111-1111-1111-1111-111111111106',
    '00000000-0000-0000-0000-000000000002',
    'Waterfront Pier 48 Satellite',
    37.7725,
    -122.3855,
    2000,
    380,
    19,
    'green'
  );

-- 3. HOTELS (10 hotels with real details, ratings, prices)
INSERT INTO public.hotels (id, name, address, lat, lng, total_rooms, available_rooms, price_per_night, rating, contact_info)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'San Francisco Marriott Marquis', '780 Mission St, San Francisco, CA', 37.7856, -122.4042, 1500, 115, 289.00, 4.6, '+1 415-896-1600'),
  ('22222222-2222-2222-2222-222222222202', 'W San Francisco', '181 3rd St, San Francisco, CA', 37.7850, -122.4007, 400, 32, 340.00, 4.7, '+1 415-777-5300'),
  ('22222222-2222-2222-2222-222222222203', 'Hyatt Regency San Francisco Downtown', '50 3rd St, San Francisco, CA', 37.7882, -122.4023, 680, 84, 245.00, 4.5, '+1 415-393-1234'),
  ('22222222-2222-2222-2222-222222222204', 'The St. Regis San Francisco', '125 3rd St, San Francisco, CA', 37.7860, -122.4008, 260, 14, 495.00, 4.9, '+1 415-284-4000'),
  ('22222222-2222-2222-2222-222222222205', 'InterContinental San Francisco', '888 Howard St, San Francisco, CA', 37.7827, -122.4054, 550, 42, 275.00, 4.6, '+1 415-616-6500'),
  ('22222222-2222-2222-2222-222222222206', 'Palace Hotel, a Luxury Collection Hotel', '2 New Montgomery St, San Francisco, CA', 37.7885, -122.4019, 556, 55, 320.00, 4.8, '+1 415-512-1111'),
  ('22222222-2222-2222-2222-222222222207', 'Hilton San Francisco Union Square', '333 O''Farrell St, San Francisco, CA', 37.7862, -122.4103, 1921, 230, 219.00, 4.3, '+1 415-771-1400'),
  ('22222222-2222-2222-2222-222222222208', 'Hotel Nikko San Francisco', '222 Mason St, San Francisco, CA', 37.7863, -122.4090, 532, 64, 235.00, 4.4, '+1 415-394-1111'),
  ('22222222-2222-2222-2222-222222222209', 'LUMA Hotel San Francisco', '100 Channel St, San Francisco, CA', 37.7712, -122.3912, 299, 41, 265.00, 4.7, '+1 415-266-9999'),
  ('22222222-2222-2222-2222-222222222210', 'Harbor Court Hotel', '165 Steuart St, San Francisco, CA', 37.7925, -122.3920, 131, 19, 225.00, 4.5, '+1 415-788-1234');

-- 4. TRANSPORT ROUTES (5 key transit routes)
INSERT INTO public.transport_routes (id, route_name, start_point, end_point, frequency_minutes, status, current_delay_minutes, capacity)
VALUES
  ('33333333-3333-3333-3333-333333333301', 'Convention Express Shuttle', 'Powell St BART Station', 'Moscone North Entrance', 5, 'normal', 0, 120),
  ('33333333-3333-3333-3333-333333333302', 'Downtown Loop Transit', 'Union Square Station', 'Moscone South Plaza', 8, 'congested', 12, 200),
  ('33333333-3333-3333-3333-333333333303', 'Mission Bay Rapid Link', 'Caltrain 4th & King', 'Chase Center Arena', 10, 'normal', 0, 180),
  ('33333333-3333-3333-3333-333333333304', 'Waterfront Ferry Connector', 'SF Ferry Building', 'Pier 48 Satellite Hub', 15, 'normal', 0, 300),
  ('33333333-3333-3333-3333-333333333305', 'Airport Express Bus (SFO Direct)', 'SFO International Terminal', 'Moscone West Gate', 20, 'delayed', 18, 80);

-- 5. ALERTS (6 alerts: info, warning, critical, active & resolved)
INSERT INTO public.alerts (id, title, message, severity, zone_id, resolved, created_at, resolved_at)
VALUES
  (
    '44444444-4444-4444-4444-444444444401',
    'Main Hall Overcrowding Surge',
    'Exhibition Hall A occupancy has reached 92%. New attendee arrivals are redirected to South Pavilion.',
    'critical',
    '11111111-1111-1111-1111-111111111101',
    false,
    now() - interval '12 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    'Keynote Theater Near Seating Limit',
    'Auditorium capacity at 89%. Overflow live screening now open at South Tech Pavilion with open seating.',
    'critical',
    '11111111-1111-1111-1111-111111111102',
    false,
    now() - interval '25 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444403',
    'BART Powell St Transit Congestion',
    'BART signal disruption causing +12 min delays near Powell St. We recommend taking the Convention Express Shuttle.',
    'warning',
    null,
    false,
    now() - interval '40 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444404',
    'Food Plaza Lunch Rush',
    'West Food Plaza wait times exceed 20 minutes. East Networking Terrace features walk-up gourmet food stalls.',
    'warning',
    '11111111-1111-1111-1111-111111111103',
    false,
    now() - interval '8 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444405',
    'East Terrace Barista Lounge Open',
    'Fresh artisan coffee and open power desks available at East Networking Lounge with zero queues.',
    'info',
    '11111111-1111-1111-1111-111111111105',
    false,
    now() - interval '60 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444406',
    'Gate C Turnstile Check-in Cleared',
    'Badge scanners recalibrated at Gate C. Entry delay is back down to 1 minute.',
    'info',
    '11111111-1111-1111-1111-111111111101',
    true,
    now() - interval '90 minutes',
    now() - interval '15 minutes'
  );

-- 6. SUGGESTIONS (Nudge engine data)
INSERT INTO public.suggestions (id, title, description, original_zone_id, alternative_zone_id, incentive, estimated_wait_difference_minutes, active)
VALUES
  (
    '55555555-5555-5555-5555-555555555501',
    'Less Crowded Dining Option',
    'West Food Plaza is at 70% capacity. East Lounge has artisan coffee and quick food items with no wait.',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111105',
    'Free Espresso & Pastry Voucher',
    20,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555502',
    'Keynote Overflow Stream Lounge',
    'Keynote hall is filling up fast. Watch the live broadcast in comfort at South Tech Pavilion.',
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111104',
    'Guaranteed Seating & Device Charging',
    15,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555503',
    'Waterfront Tech Hub Alternative',
    'Visit the waterfront Pier 48 Satellite for startup demos and harbor views.',
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111106',
    'Complimentary Bay Ferry Return Pass',
    25,
    true
  );
