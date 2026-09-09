// Edge Function: simulate-scenario
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const { scenarioType, intensity } = await req.json();
    const result = {
      scenarioType: scenarioType || "SURGE_DEFAULT",
      intensity: intensity || 1.0,
      computationTimestamp: new Date().toISOString(),
      mitigationRecommendation: "Reallocate 20% flow to secondary gateway",
    };
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
});
