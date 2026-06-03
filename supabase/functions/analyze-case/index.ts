// LEO — analyze-case Edge Function
// Receives raw case material, runs it through Claude with a strict LEO output
// schema, stores the result in the `cases` table, and returns the saved row.
//
// Requires the secret ANTHROPIC_API_KEY (set in Supabase → Edge Functions → Secrets).
// SUPABASE_URL and SUPABASE_ANON_KEY are injected automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

// Model: Sonnet 4.6 — strong clinical-operational reasoning at sensible cost.
// Swap to "claude-haiku-4-5-20251001" (cheaper) or "claude-opus-4-8" (sharper).
const MODEL = "claude-sonnet-4-6";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `You are LEO (Linking Evidence & Operations), an operational continuity intelligence system for healthcare. You analyze raw case material — clinical notes, referral orders, messages, scheduling records, audit logs — to detect OPERATIONAL CONTINUITY BREAKS: points where information, intent, ownership, action, timing, or verification degraded as work passed across people, systems, and time.

You do NOT give clinical/medical advice or judge clinical decisions. You assess the OPERATIONAL integrity of the workflow: did the right information, intent, and accountability survive each handoff, and did the loop close and get verified?

THE SIX CONTINUITY DIMENSIONS (score each 0–100, where HIGHER = MORE DEGRADED):
- information: Data lost, truncated, or altered across handoffs.
- intent: The clinical reasoning / "why" behind an action surviving downstream.
- ownership: Whether a clear, active owner holds each task — or whether no one does.
- action: What was actually done vs. what was intended.
- timing: Latency and sequencing vs. the clinical/operational target.
- verification: Confirmation that the loop closed and was acknowledged.

THE FIVE FAILURE ARCHETYPES (recurring patterns; assign per finding where they fit):
- borrowed-stability: Workflow appears stable because a downstream actor silently compensates; status looks green while degradation is masked.
- human-middleware: A person informally bridges two systems, carrying info/intent in memory rather than through a formal path; breaks when they change context.
- intent-drift: The original "why" is progressively lost or diluted across handoffs and system boundaries.
- reconciliation-failure: Two conflicting signals/priorities/values were never reconciled; the contradiction persists silently.
- ownership-failure: No individual or role has clear active ownership; work sits unowned and nothing moves.

YOUR TASK: From the submitted material, identify each continuity break (a "finding"). For each finding:
- Classify the primary dimension, a severity (critical/high/medium/low), and a confidence 0–1.
- State the contradiction as observed vs. expected, plus a delta explaining the operational gap.
- Extract supporting EVIDENCE as SHORT VERBATIM QUOTES drawn ONLY from the submitted text. Never invent quotes, names, dates, or values not present in the source. Each evidence item names the artifact type, the actor/source/time IF stated, the dimension it speaks to, the quote, and the single most telling phrase as "highlight" (must be an exact substring of the quote).
- Suggest 1–3 archetypes with confidence and a one-sentence rationale grounded in the evidence.
- Provide a verification path: ordered, checkable steps an analyst would follow to confirm the break.
- List the affected dimensions.

Also produce: a short de-identified case title, a one-line context, a plain-language summary, an overall operational risk 0–100, the six dimension scores, and a few prioritized recommendations (Immediate vs Systemic) each with an owner and the findings they address.

RULES:
- Ground every claim in the submitted text. Do not fabricate. If evidence is thin, lower confidence and note it in the detail.
- Treat all input as already de-identified synthetic data; never add identifying details.
- Number findings F-01, F-02, … and reference those IDs in each recommendation's "addresses".
- If the material shows NO meaningful continuity break, return an empty findings array, low scores, and a summary saying the loop appears intact.
- Always respond by calling the submit_analysis tool.`;

const DIM_ENUM = ["information", "intent", "ownership", "action", "timing", "verification"];
const ARCH_ENUM = ["borrowed-stability", "human-middleware", "intent-drift", "reconciliation-failure", "ownership-failure"];

const TOOL = {
  name: "submit_analysis",
  description: "Submit the structured LEO continuity analysis for the case.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Short de-identified workflow/case title." },
      context: { type: "string", description: "One-line de-identified context, e.g. '67F · new AFib · cardiology referral'." },
      summary: { type: "string", description: "Plain-language summary of the case's operational continuity status." },
      overallRisk: { type: "integer", minimum: 0, maximum: 100, description: "Overall operational risk; higher = more degraded." },
      dimensionScores: {
        type: "object",
        description: "0–100 per dimension; higher = more degraded.",
        properties: {
          information: { type: "integer", minimum: 0, maximum: 100 },
          intent: { type: "integer", minimum: 0, maximum: 100 },
          ownership: { type: "integer", minimum: 0, maximum: 100 },
          action: { type: "integer", minimum: 0, maximum: 100 },
          timing: { type: "integer", minimum: 0, maximum: 100 },
          verification: { type: "integer", minimum: 0, maximum: 100 },
        },
        required: DIM_ENUM,
      },
      findings: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "F-01, F-02, …" },
            title: { type: "string" },
            dim: { type: "string", enum: DIM_ENUM },
            severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
            confidence: { type: "number", minimum: 0, maximum: 1 },
            where: { type: "string", description: "Where in the workflow this break occurs." },
            detail: { type: "string" },
            contradiction: {
              type: "object",
              properties: {
                observed: { type: "string" },
                expected: { type: "string" },
                delta: { type: "string" },
              },
              required: ["observed", "expected", "delta"],
            },
            evidence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", description: "Artifact type, e.g. 'Encounter note'." },
                  actor: { type: "string" },
                  source: { type: "string" },
                  t: { type: "string", description: "Timestamp/date if stated." },
                  dim: { type: "string", enum: DIM_ENUM },
                  quote: { type: "string", description: "Short verbatim quote from the submitted text." },
                  highlight: { type: "string", description: "Exact substring of quote to emphasize." },
                },
                required: ["type", "dim", "quote"],
              },
            },
            archetypes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  key: { type: "string", enum: ARCH_ENUM },
                  confidence: { type: "number", minimum: 0, maximum: 1 },
                  rationale: { type: "string" },
                },
                required: ["key", "confidence", "rationale"],
              },
            },
            verificationPath: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  step: { type: "integer" },
                  action: { type: "string" },
                },
                required: ["step", "action"],
              },
            },
            affectedDims: { type: "array", items: { type: "string", enum: DIM_ENUM } },
          },
          required: ["id", "title", "dim", "severity", "confidence", "where", "detail", "contradiction", "evidence", "archetypes", "verificationPath", "affectedDims"],
        },
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", description: "R-01, R-02, …" },
            title: { type: "string" },
            detail: { type: "string" },
            priority: { type: "string", enum: ["Immediate", "Systemic"] },
            effort: { type: "string", enum: ["Low", "Medium", "High"] },
            owner: { type: "string" },
            addresses: { type: "array", items: { type: "string" } },
          },
          required: ["id", "title", "detail", "priority", "effort", "owner", "addresses"],
        },
      },
    },
    required: ["title", "context", "summary", "overallRisk", "dimensionScores", "findings", "recommendations"],
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY secret is not set on this function.");

    const { caseText, structured } = await req.json();
    if (!caseText || String(caseText).trim().length < 20) {
      throw new Error("Please provide a case with at least 20 characters of material to analyze.");
    }

    // Identify the calling analyst (runs under their JWT for RLS + attribution).
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Not authenticated." }), {
        status: 401, headers: { ...cors, "content-type": "application/json" },
      });
    }
    const { data: profile } = await supabase
      .from("analyst_profiles").select("name").eq("id", user.id).single();

    const userContent = structured && String(structured).trim()
      ? `${caseText}\n\n--- Structured context provided by analyst ---\n${structured}`
      : String(caseText);

    // Call Claude with forced structured tool output. System prompt is cached.
    const aiResp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 4096,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools: [TOOL],
        tool_choice: { type: "tool", name: "submit_analysis" },
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      throw new Error(`Anthropic API error (${aiResp.status}): ${errText}`);
    }

    const aiData = await aiResp.json();
    const toolUse = (aiData.content || []).find((c: any) => c.type === "tool_use");
    if (!toolUse) throw new Error("The model did not return a structured analysis.");
    const analysis = toolUse.input;

    // Persist the case.
    const { data: row, error } = await supabase
      .from("cases")
      .insert({
        title: analysis.title || "Untitled case",
        context: analysis.context || null,
        raw_text: caseText,
        structured: structured || null,
        analysis: analysis,
        overall_risk: typeof analysis.overallRisk === "number" ? analysis.overallRisk : null,
        submitted_by: user.id,
        submitted_by_name: profile?.name || user.email,
        status: "complete",
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ case: row }), {
      headers: { ...cors, "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 400, headers: { ...cors, "content-type": "application/json" },
    });
  }
});
