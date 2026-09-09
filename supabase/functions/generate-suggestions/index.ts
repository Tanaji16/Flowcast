// Edge Function: generate-suggestions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const suggestions = [
      {
        id: "sugg-auto-1",
        title: "Less Congested Dining Pavilion",
        description: "Pavilion 2 is currently at 35% capacity. Visiting now saves ~20 minutes.",
      },
    ];
    return new Response(JSON.stringify({ suggestions }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }
});
