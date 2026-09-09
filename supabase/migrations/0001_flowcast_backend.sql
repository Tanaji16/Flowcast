-- 0001_flowcast_backend.sql
-- Complete Flowcast backend schema: 9 core tables, RLS policies, views, triggers.

-- 1. USERS TABLE (profiles sync with auth.users)
create table if not exists public.users (
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
create table if not exists public.venues (
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
create table if not exists public.zones (
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
create table if not exists public.hotels (
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
create table if not exists public.transport_routes (
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
create table if not exists public.bookings (
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
create table if not exists public.alerts (
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
create table if not exists public.suggestions (
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
create table if not exists public.feedback (
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
-- HELPER FUNCTIONS & TRIGGERS
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all 9 tables
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

-- VENUES POLICIES (everyone can view, organizer can write)
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

-- ZONES POLICIES (everyone can view, organizer can write)
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

-- HOTELS POLICIES (everyone can view, organizer can write)
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

-- TRANSPORT ROUTES POLICIES (everyone can view, organizer can write)
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

-- BOOKINGS POLICIES (attendees read/write own rows, organizers can view)
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

-- ALERTS POLICIES (everyone can view, organizer can write)
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

-- SUGGESTIONS POLICIES (attendee reads relevant, organizers manage)
create policy "Suggestions viewable by user"
  on public.suggestions for select
  using (user_id is null or user_id = auth.uid() or public.is_organizer());

create policy "Organizers can manage suggestions"
  on public.suggestions for all
  using (public.is_organizer());

-- FEEDBACK POLICIES (attendees read/write own, organizers can view all)
create policy "Users can view own feedback or organizers view all"
  on public.feedback for select
  using (auth.uid() = user_id or public.is_organizer());

create policy "Users can insert feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id);

create policy "Users can update feedback"
  on public.feedback for update
  using (auth.uid() = user_id);
