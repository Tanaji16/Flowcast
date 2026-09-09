-- =========================================================================
-- FLOWCAST COMPLETE SUPABASE BACKEND SETUP SCRIPT
-- Run this in your Supabase Dashboard SQL Editor:
-- https://supabase.com/dashboard/project/djjpgtykdxrlhtkupmqj/sql/new
-- =========================================================================

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. DROP EXISTING TABLES IF RE-INITIALIZING
-- =========================================================================
drop view if exists public.attendee_feedback cascade;
drop view if exists public.accommodations cascade;
drop view if exists public.profiles cascade;
drop table if exists public.feedback cascade;
drop table if exists public.suggestions cascade;
drop table if exists public.alerts cascade;
drop table if exists public.bookings cascade;
drop table if exists public.transport_routes cascade;
drop table if exists public.hotels cascade;
drop table if exists public.zones cascade;
drop table if exists public.venues cascade;
drop table if exists public.users cascade;

-- =========================================================================
-- 2. CREATE CORE TABLES
-- =========================================================================

-- 1. USERS TABLE (synchronized with auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'attendee' check (role in ('attendee', 'organizer')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backwards compatibility view for profiles
create or replace view public.profiles as
  select id, email, full_name, role, avatar_url, created_at, updated_at
  from public.users;

-- 2. VENUES TABLE
create table public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  lat double precision,
  lng double precision,
  total_capacity int not null default 5000,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. ZONES TABLE (with lat/lng, occupancy_percent, status)
create table public.zones (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues(id) on delete cascade,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  max_capacity int not null default 1000,
  current_occupancy int not null default 0,
  occupancy_percent int not null default 0,
  status text not null default 'green' check (status in ('green', 'amber', 'red', 'low', 'moderate', 'critical')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. HOTELS TABLE
create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  lat double precision,
  lng double precision,
  total_rooms int not null default 100,
  available_rooms int not null default 50,
  price_per_night numeric(10, 2) not null default 150.00,
  rating numeric(2, 1) default 4.5,
  contact_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backwards compatibility view for accommodations
create or replace view public.accommodations as
  select id, name, address, total_rooms, available_rooms, contact_info, created_at
  from public.hotels;

-- 5. TRANSPORT ROUTES TABLE
create table public.transport_routes (
  id uuid primary key default gen_random_uuid(),
  route_name text not null,
  start_point text not null,
  end_point text not null,
  frequency_minutes int not null default 10,
  status text not null default 'normal' check (status in ('normal', 'delayed', 'congested')),
  current_delay_minutes int not null default 0,
  capacity int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. BOOKINGS TABLE
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('hotel', 'accommodation', 'transport', 'session', 'venue')),
  item_id uuid not null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'pending')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 7. ALERTS TABLE (severity, zone_id, message, resolved)
create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  message text not null,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  zone_id uuid references public.zones(id) on delete set null,
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- 8. SUGGESTIONS TABLE (for the nudge engine)
create table public.suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  original_zone_id uuid references public.zones(id) on delete cascade,
  alternative_zone_id uuid references public.zones(id) on delete set null,
  incentive text,
  estimated_wait_difference_minutes int not null default 15,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 9. FEEDBACK TABLE
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  zone_id uuid references public.zones(id) on delete cascade,
  congestion_rating int check (congestion_rating between 1 and 5),
  comments text,
  created_at timestamptz not null default now()
);

-- Backwards compatibility view for attendee_feedback
create or replace view public.attendee_feedback as
  select id, user_id, zone_id, congestion_rating, comments, created_at
  from public.feedback;

-- =========================================================================
-- 3. HELPER FUNCTIONS & TRIGGERS
-- =========================================================================

-- Function to verify organizer role
create or replace function public.is_organizer()
returns boolean as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'organizer'
  );
$$ language sql security definer stable;

-- Trigger to sync auth.users to public.users on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'attendee')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.users.full_name),
    role = coalesce(excluded.role, public.users.role),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger to update zone occupancy_percent automatically
create or replace function public.calculate_zone_occupancy_percent()
returns trigger as $$
begin
  if new.max_capacity > 0 then
    new.occupancy_percent := round((new.current_occupancy::numeric / new.max_capacity::numeric) * 100);
  else
    new.occupancy_percent := 0;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_zone_occupancy_percent on public.zones;
create trigger trg_zone_occupancy_percent
  before insert or update of current_occupancy, max_capacity on public.zones
  for each row execute function public.calculate_zone_occupancy_percent();

-- =========================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table public.users enable row level security;
alter table public.venues enable row level security;
alter table public.zones enable row level security;
alter table public.hotels enable row level security;
alter table public.transport_routes enable row level security;
alter table public.bookings enable row level security;
alter table public.alerts enable row level security;
alter table public.suggestions enable row level security;
alter table public.feedback enable row level security;

-- USERS POLICIES
create policy "Users can read own profile or organizers read all"
  on public.users for select
  using (auth.uid() = id or public.is_organizer());

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- VENUES POLICIES (public read, organizer write)
create policy "Venues viewable by everyone"
  on public.venues for select
  using (true);

create policy "Organizers can insert venues"
  on public.venues for insert
  with check (public.is_organizer());

create policy "Organizers can update venues"
  on public.venues for update
  using (public.is_organizer());

create policy "Organizers can delete venues"
  on public.venues for delete
  using (public.is_organizer());

-- ZONES POLICIES (public read, organizer write)
create policy "Zones viewable by everyone"
  on public.zones for select
  using (true);

create policy "Organizers can insert zones"
  on public.zones for insert
  with check (public.is_organizer());

create policy "Organizers can update zones"
  on public.zones for update
  using (public.is_organizer());

create policy "Organizers can delete zones"
  on public.zones for delete
  using (public.is_organizer());

-- HOTELS POLICIES (public read, organizer write)
create policy "Hotels viewable by everyone"
  on public.hotels for select
  using (true);

create policy "Organizers can insert hotels"
  on public.hotels for insert
  with check (public.is_organizer());

create policy "Organizers can update hotels"
  on public.hotels for update
  using (public.is_organizer());

create policy "Organizers can delete hotels"
  on public.hotels for delete
  using (public.is_organizer());

-- TRANSPORT ROUTES POLICIES (public read, organizer write)
create policy "Transport routes viewable by everyone"
  on public.transport_routes for select
  using (true);

create policy "Organizers can insert transport routes"
  on public.transport_routes for insert
  with check (public.is_organizer());

create policy "Organizers can update transport routes"
  on public.transport_routes for update
  using (public.is_organizer());

create policy "Organizers can delete transport routes"
  on public.transport_routes for delete
  using (public.is_organizer());

-- BOOKINGS POLICIES (attendees manage own, organizers view all)
create policy "Users can view own bookings or organizers view all"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_organizer());

create policy "Users can insert own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookings"
  on public.bookings for update
  using (auth.uid() = user_id or public.is_organizer());

create policy "Users can delete own bookings"
  on public.bookings for delete
  using (auth.uid() = user_id);

-- ALERTS POLICIES (public read, organizer write)
create policy "Alerts viewable by everyone"
  on public.alerts for select
  using (true);

create policy "Organizers can insert alerts"
  on public.alerts for insert
  with check (public.is_organizer());

create policy "Organizers can update alerts"
  on public.alerts for update
  using (public.is_organizer());

create policy "Organizers can delete alerts"
  on public.alerts for delete
  using (public.is_organizer());

-- SUGGESTIONS POLICIES (attendee read, organizer write)
create policy "Suggestions viewable by user"
  on public.suggestions for select
  using (user_id is null or user_id = auth.uid() or public.is_organizer());

create policy "Organizers can manage suggestions"
  on public.suggestions for all
  using (public.is_organizer());

-- FEEDBACK POLICIES (attendee read/write own, organizer view all)
create policy "Users can view own feedback or organizers view all"
  on public.feedback for select
  using (auth.uid() = user_id or public.is_organizer());

create policy "Users can insert feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

create policy "Users can update feedback"
  on public.feedback for update
  using (auth.uid() = user_id);

-- =========================================================================
-- 5. ENABLE REALTIME ON ZONES AND ALERTS
-- =========================================================================

-- Enable realtime replication for zones and alerts
alter publication supabase_realtime add table public.zones;
alter publication supabase_realtime add table public.alerts;

-- =========================================================================
-- 6. DEMO SEED DATA
-- =========================================================================

-- Venues
INSERT INTO public.venues (id, name, location, lat, lng, total_capacity)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Bharat Mandapam & Pragati Maidan', 'Pragati Maidan, New Delhi, Delhi 110001', 28.6186, 77.2415, 18000),
  ('00000000-0000-0000-0000-000000000002', 'Jio World Convention Centre', 'G Block BKC, Bandra Kurla Complex, Mumbai, MH 400098', 19.0626, 72.8647, 12000),
  ('00000000-0000-0000-0000-000000000003', 'BIEC Exhibition Centre', '10th Mile, Tumkur Road, Madavara Post, Bengaluru, KA 562123', 13.0645, 77.4735, 15000),
  ('00000000-0000-0000-0000-000000000004', 'HICC Novotel Campus', 'Novotel & HICC Complex, HITEC City, Hyderabad, TG 500081', 17.4729, 78.3728, 9000);

-- Zones (Delivered with live Indian event telemetry)
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

-- Hotels (Partner accommodations near Indian event venues)
INSERT INTO public.hotels (id, name, address, lat, lng, total_rooms, available_rooms, price_per_night, rating, contact_info)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'The Lalit New Delhi', 'Barakhamba Avenue, Connaught Place, New Delhi', 28.6315, 77.2285, 461, 45, 8500.00, 4.7, '+91 11 4444 7777'),
  ('22222222-2222-2222-2222-222222222202', 'Shangri-La Eros New Delhi', '19 Ashoka Road, Janpath, Connaught Place, New Delhi', 28.6210, 77.2180, 320, 28, 11200.00, 4.8, '+91 11 4119 1919'),
  ('22222222-2222-2222-2222-222222222203', 'The Taj Mahal Hotel New Delhi', 'Number 1, Mansingh Road, New Delhi', 28.6050, 77.2250, 292, 18, 14500.00, 4.9, '+91 11 6656 6162'),
  ('22222222-2222-2222-2222-222222222204', 'Trident Hotel Bandra Kurla', 'C 56, G Block BKC, Bandra Kurla Complex, Mumbai', 19.0665, 72.8670, 436, 52, 9800.00, 4.7, '+91 22 6672 7777'),
  ('22222222-2222-2222-2222-222222222205', 'Sofitel Mumbai BKC', 'C 57, Bandra Kurla Complex, Mumbai', 19.0650, 72.8685, 302, 36, 10500.00, 4.6, '+91 22 6117 5000'),
  ('22222222-2222-2222-2222-222222222206', 'Novotel Hyderabad Convention Centre', 'Novotel & HICC Complex, HITEC City, Hyderabad', 17.4725, 78.3720, 287, 44, 7200.00, 4.6, '+91 40 6682 4422');

-- Transport Routes (Delhi NCR & Mumbai event transit lines)
INSERT INTO public.transport_routes (id, route_name, start_point, end_point, frequency_minutes, status, current_delay_minutes, capacity)
VALUES
  ('33333333-3333-3333-3333-333333333301', 'Supreme Court Metro Express Shuttle Line B', 'Supreme Court Metro Station', 'Gate 4 North FastTrack', 5, 'normal', 0, 100),
  ('33333333-3333-3333-3333-333333333302', 'Pragati Maidan EV Feeder Loop', 'ITO Metro Station Gate 2', 'Plenary Summit Hall A', 8, 'delayed', 10, 80),
  ('33333333-3333-3333-3333-333333333303', 'BKC Skywalk Electric Shuttle', 'Bandra East Railway Hub', 'Jio World Convention Centre', 6, 'normal', 0, 120),
  ('33333333-3333-3333-3333-333333333304', 'Madavara Metro Feeder', 'Madavara Metro Terminal', 'BIEC Main Entrance', 10, 'normal', 0, 150),
  ('33333333-3333-3333-3333-333333333305', 'Indira Gandhi Airport Express EV', 'IGI Airport Terminal 3', 'Bharat Mandapam VIP Bay', 25, 'normal', 0, 60);

-- Alerts
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

-- Suggestions
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
