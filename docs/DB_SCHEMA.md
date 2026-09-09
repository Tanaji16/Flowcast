# Database Schema Documentation

## ERD Overview
The database is built on PostgreSQL inside Supabase, utilizing Row Level Security (RLS) for attendee/organizer data separation.

### Core Tables
1. **profiles**: Extends `auth.users` with user role (`attendee`, `organizer`, `admin`) and profile info.
2. **venues**: Master event venues.
3. **zones**: Distinct sub-areas inside venues with defined capacity limits and live occupancy counters.
4. **accommodations**: Partner hotels, dormitories, and lodging options with room inventories.
5. **transport_routes**: Transit options (shuttles, metro lines, ride-share hubs) with frequency and delay states.
6. **alerts**: System and organizer dispatched alerts with severity levels (`info`, `warning`, `critical`).
7. **bookings**: Attendee reservations for accommodations, transport, or limited-seat sessions.
8. **attendee_feedback**: Real-time sentiment and crowd reports from attendees.
9. **simulations**: Saved scenario configurations and results.
