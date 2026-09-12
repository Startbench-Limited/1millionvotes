import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Body {
  lgas?: unknown;
  goal?: unknown;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["lga_targets", "milestones", "reward_tiers", "redemption_rules"],
  properties: {
    lga_targets: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["lga", "target"],
        properties: {
          lga: { type: "string" },
          target: { type: "integer" },
        },
      },
    },
    milestones: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "target"],
        properties: {
          label: { type: "string" },
          target: { type: "integer" },
        },
      },
    },
    reward_tiers: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "min_pledges", "tokens"],
        properties: {
          name: { type: "string" },
          min_pledges: { type: "integer" },
          tokens: { type: "integer" },
        },
      },
    },
    redemption_rules: { type: "string" },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admins only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json().catch(() => ({}))) as Body;
    const lgas = Array.isArray(body.lgas)
      ? body.lgas.filter((l): l is string => typeof l === "string" && l.length > 0).slice(0, 60)
      : [];
    const goal = Number(body.goal);
    if (lgas.length === 0 || !Number.isFinite(goal) || goal <= 0) {
      return new Response(JSON.stringify({ error: "Provide lgas and a positive goal" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = [
      `You are planning a grassroots voter-pledge drive in Kano State, Nigeria.`,
      `Overall pledge goal: ${goal}.`,
      `Local Government Areas (${lgas.length}): ${lgas.join(", ")}.`,
      ``,
      `Produce a realistic plan as json:`,
      `1. lga_targets: one entry per LGA above (exact same names), with a realistic pledge target. Dense urban metropolitan LGAs (Dala, Fagge, Gwale, Kano Municipal, Nassarawa, Tarauni, Ungogo, Kumbotso, Municipal areas) should get clearly larger targets than sparse rural ones. The targets must sum to approximately ${goal}.`,
      `2. milestones: 4 or 5 cumulative campaign milestones with short Hausa/English-friendly labels and ascending targets ending at ${goal}.`,
      `3. reward_tiers: 4 or 5 volunteer reward tiers with ascending min_pledges and tokens.`,
      `4. redemption_rules: 3 to 5 short plain-English sentences on how volunteers redeem tokens, including verification, limits and expiry.`,
    ].join("\n");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: prompt,
        stream: true,
        reasoning: { effort: "low" },
        text: {
          format: {
            type: "json_schema",
            name: "campaign_plan",
            strict: true,
            schema: SCHEMA,
          },
        },
      }),
    });

    if (!aiRes.ok || !aiRes.body) {
      const detail = await aiRes.text().catch(() => "");
      return new Response(JSON.stringify({ error: detail || "AI request failed" }), {
        status: aiRes.status || 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Read the SSE stream and accumulate the output text.
    const reader = aiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            text += evt.delta;
          } else if (evt.type === "response.completed" && typeof evt.response?.output_text === "string") {
            if (!text) text = evt.response.output_text;
          }
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    }

    let plan: unknown;
    try {
      plan = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: "AI returned an unreadable plan" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
