# Flowcast API & Edge Functions Reference

## Next.js API Routes

### 1. `POST /api/simulate`
Simulates crowd dynamics based on injected scenario parameters.
- **Request Body**:
  ```json
  {
    "scenarioType": "GATE_CLOSURE" | "WEATHER_RAIN" | "TRANSIT_DELAY",
    "targetZoneId": "uuid",
    "intensity": 0.8
  }
  ```
- **Response**: Predicted zone capacity changes and recommended mitigation actions.

### 2. `GET /api/alerts` & `POST /api/alerts`
Fetch active alerts or dispatch a new organizer alert.

### 3. `GET /api/suggestions`
Fetches personalized attendee nudges based on user's current location and event timetable.

---

## Supabase Edge Functions

### 1. `simulate-scenario`
High-performance Deno function running discrete event simulation calculations.

### 2. `generate-suggestions`
Vector/rule-based nudge generation evaluating zone congestion vs. attendee itinerary preferences.
