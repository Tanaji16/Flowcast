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
  ('00000000-0000-0000-0000-000000000001', 'Bharat Mandapam & Pragati Maidan', 'Pragati Maidan, New Delhi, Delhi 110001', 28.6186, 77.2415, 18000),
  ('00000000-0000-0000-0000-000000000002', 'Jio World Convention Centre', 'G Block BKC, Bandra Kurla Complex, Mumbai, MH 400098', 19.0626, 72.8647, 12000),
  ('00000000-0000-0000-0000-000000000003', 'BIEC Exhibition Centre', '10th Mile, Tumkur Road, Madavara Post, Bengaluru, KA 562123', 13.0645, 77.4735, 15000),
  ('00000000-0000-0000-0000-000000000004', 'HICC Novotel Campus', 'Novotel & HICC Complex, HITEC City, Hyderabad, TG 500081', 17.4729, 78.3728, 9000);

-- 2. ZONES (Delivered with live Indian event telemetry)
INSERT INTO public.zones (id, venue_id, name, lat, lng, max_capacity, current_occupancy, occupancy_percent, status)
VALUES
  (
    '11111111-1111-1111-1111-111111111101',
    '00000000-0000-0000-0000-000000000001',
    'Gate 4 North FastTrack',
    28.6190,
    77.2420,
    2000,
    1840,
    92,
    'red'
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    '00000000-0000-0000-0000-000000000001',
    'Plenary Summit Hall A',
    28.6184,
    77.2410,
    4000,
    3440,
    86,
    'red'
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    '00000000-0000-0000-0000-000000000001',
    'Central Food Court',
    28.6180,
    77.2405,
    2500,
    1700,
    68,
    'amber'
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    '00000000-0000-0000-0000-000000000001',
    'Innovation Expo Pavilion 2',
    28.6175,
    77.2430,
    3000,
    1260,
    42,
    'green'
  ),
  (
    '11111111-1111-1111-1111-111111111105',
    '00000000-0000-0000-0000-000000000001',
    'Supreme Court Metro Shuttle Hub',
    28.6210,
    77.2400,
    2000,
    700,
    35,
    'green'
  ),
  (
    '11111111-1111-1111-1111-111111111106',
    '00000000-0000-0000-0000-000000000002',
    'Grand Pavilion East (BKC)',
    19.0620,
    72.8640,
    3000,
    1560,
    52,
    'green'
  );

-- 3. HOTELS (Partner accommodations near Indian event venues)
INSERT INTO public.hotels (id, name, address, lat, lng, total_rooms, available_rooms, price_per_night, rating, contact_info)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'The Lalit New Delhi', 'Barakhamba Avenue, Connaught Place, New Delhi', 28.6315, 77.2285, 461, 45, 8500.00, 4.7, '+91 11 4444 7777'),
  ('22222222-2222-2222-2222-222222222202', 'Shangri-La Eros New Delhi', '19 Ashoka Road, Janpath, Connaught Place, New Delhi', 28.6210, 77.2180, 320, 28, 11200.00, 4.8, '+91 11 4119 1919'),
  ('22222222-2222-2222-2222-222222222203', 'The Taj Mahal Hotel New Delhi', 'Number 1, Mansingh Road, New Delhi', 28.6050, 77.2250, 292, 18, 14500.00, 4.9, '+91 11 6656 6162'),
  ('22222222-2222-2222-2222-222222222204', 'Trident Hotel Bandra Kurla', 'C 56, G Block BKC, Bandra Kurla Complex, Mumbai', 19.0665, 72.8670, 436, 52, 9800.00, 4.7, '+91 22 6672 7777'),
  ('22222222-2222-2222-2222-222222222205', 'Sofitel Mumbai BKC', 'C 57, Bandra Kurla Complex, Mumbai', 19.0650, 72.8685, 302, 36, 10500.00, 4.6, '+91 22 6117 5000'),
  ('22222222-2222-2222-2222-222222222206', 'Novotel Hyderabad Convention Centre', 'Novotel & HICC Complex, HITEC City, Hyderabad', 17.4725, 78.3720, 287, 44, 7200.00, 4.6, '+91 40 6682 4422');

-- 4. TRANSPORT ROUTES (Delhi NCR & Mumbai event transit lines)
INSERT INTO public.transport_routes (id, route_name, start_point, end_point, frequency_minutes, status, current_delay_minutes, capacity)
VALUES
  ('33333333-3333-3333-3333-333333333301', 'Supreme Court Metro Express Shuttle Line B', 'Supreme Court Metro Station', 'Gate 4 North FastTrack', 5, 'normal', 0, 100),
  ('33333333-3333-3333-3333-333333333302', 'Pragati Maidan EV Feeder Loop', 'ITO Metro Station Gate 2', 'Plenary Summit Hall A', 8, 'delayed', 10, 80),
  ('33333333-3333-3333-3333-333333333303', 'BKC Skywalk Electric Shuttle', 'Bandra East Railway Hub', 'Jio World Convention Centre', 6, 'normal', 0, 120),
  ('33333333-3333-3333-3333-333333333304', 'Madavara Metro Feeder', 'Madavara Metro Terminal', 'BIEC Main Entrance', 10, 'normal', 0, 150),
  ('33333333-3333-3333-3333-333333333305', 'Indira Gandhi Airport Express EV', 'IGI Airport Terminal 3', 'Bharat Mandapam VIP Bay', 25, 'normal', 0, 60);

-- 5. ALERTS
INSERT INTO public.alerts (id, title, message, severity, zone_id, resolved, created_at, resolved_at)
VALUES
  (
    '44444444-4444-4444-4444-444444444401',
    'Gate 4 FastTrack Overcrowding Surge',
    'Gate 4 North turnstile occupancy has reached 92%. Arriving attendees are nudged toward West Concourse Gate 2.',
    'critical',
    '11111111-1111-1111-1111-111111111101',
    false,
    now() - interval '8 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444402',
    'Plenary Summit Hall A Near Capacity',
    'Hall A seating occupancy at 86%. Overflow live screening available at Innovation Expo Pavilion 2 with zero queue.',
    'critical',
    '11111111-1111-1111-1111-111111111102',
    false,
    now() - interval '18 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444403',
    'Central Food Court Peak Wait Times',
    'Wait times exceed 20 mins. Pavilion 2 Garden Dining Lounge has current capacity of 42% with open tables.',
    'warning',
    '11111111-1111-1111-1111-111111111103',
    false,
    now() - interval '32 minutes',
    null
  ),
  (
    '44444444-4444-4444-4444-444444444404',
    'Gate 4 Scanner Calibration Complete',
    'FastTrack scanners operational. Entry delays reduced from 24 mins to normal flow.',
    'info',
    '11111111-1111-1111-1111-111111111101',
    true,
    now() - interval '60 minutes',
    now() - interval '10 minutes'
  );

-- 6. SUGGESTIONS
INSERT INTO public.suggestions (id, title, description, original_zone_id, alternative_zone_id, incentive, estimated_wait_difference_minutes, active)
VALUES
  (
    '55555555-5555-5555-5555-555555555501',
    'Low Crowd Garden Dining Alternative',
    'Central Food Court is at 68% capacity with queues. Innovation Expo Pavilion 2 features artisan food stalls with zero wait.',
    '11111111-1111-1111-1111-111111111103',
    '11111111-1111-1111-1111-111111111104',
    'Free Artisan Masala Chai & Snack Voucher',
    20,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555502',
    'Keynote Overflow Stream Lounge',
    'Plenary Summit Hall A is nearing 90% capacity. Watch high-definition livestream at Innovation Expo Pavilion 2.',
    '11111111-1111-1111-1111-111111111102',
    '11111111-1111-1111-1111-111111111104',
    'Guaranteed Seating & High-Speed Device Charging',
    15,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555503',
    'Supreme Court Metro Express Shuttle',
    'Bypass congested Gate 1 vehicle entrance by boarding the direct zero-queue electric shuttle from Supreme Court Metro Hub.',
    '11111111-1111-1111-1111-111111111101',
    '11111111-1111-1111-1111-111111111105',
    'Complimentary VIP FastTrack Pass',
    25,
    true
  );
