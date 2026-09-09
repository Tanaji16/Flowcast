# Flowcast Architecture & System Design

## 1. Overview
Flowcast is designed with a dual-persona architecture:
1. **Organizer Command Center**: High-density real-time monitoring, predictive congestion simulation, automated alert broadcasting, and multi-venue logistical oversight.
2. **Attendee Experience**: Dynamic itinerary personalization, low-friction congestion nudges, interactive zone maps, and transit/lodging alternative recommendations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          FLOWCAST PLATFORM                             │
├───────────────────────────────────┬────────────────────────────────────┤
│       Attendee Experience         │     Organizer Command Center       │
│  - Dynamic Itinerary              │  - Real-time Zone Congestion Map   │
│  - Congestion Avoidance Nudges    │  - Scenario Simulation Engine      │
│  - Alternative Accommodations     │  - Multi-channel Alert Dispatcher  │
│  - Real-time Notifications        │  - Transport & Venue Capacity KPIs │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │             Next.js 14+ App Router Client/API           │
       │    - Server Components for Fast First Render            │
       │    - Supabase Auth Session Middleware                   │
       │    - Route Handlers (/api/simulate, /api/alerts)        │
       └───────────────────────────┬─────────────────────────────┘
                                   │
                                   ▼
       ┌─────────────────────────────────────────────────────────┐
       │                   Supabase Cloud Backend                │
       │    - PostgreSQL Database (RLS Enabled)                  │
       │    - Realtime Engine (Postgres Changes via WebSockets)   │
       │    - Edge Functions (Deno TS Simulation & Suggestions)  │
       │    - Supabase Auth (JWT & Role-based Access)            │
       └─────────────────────────────────────────────────────────┘
```

## 2. Key Data Flows
- **Realtime Zone Updates**: Supabase Realtime emits updates on `zones` occupancy. The Organizer `ZoneMap` and Attendee `MapPin` dynamically update statuses.
- **Nudge Engine**: When an area exceeds critical threshold (>85% capacity), the system pushes micro-incentives/alternative suggestions to nearby attendees.
- **Scenario Simulation**: Organizers can test synthetic stress-tests (e.g., sudden rainstorm, delayed transit line) via `/api/simulate` or the edge function.
