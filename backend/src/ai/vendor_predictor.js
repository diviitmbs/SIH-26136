// backend/src/ai/vendor_predictor.js
// Advanced AI Module: Vendor Performance Predictor
// Tier-1 Vendor Reliability, Milestone SLA Adherence & Execution Risk Engine

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Lightweight keyword-to-domain classifier */
function detectDomain(text) {
  const t = (text || "").toLowerCase();
  if (t.match(/pothole|road|bridge|infrastructure|pavement|highway|civil/)) return "infrastructure";
  if (t.match(/hospital|health|patient|clinic|doctor|medicine|ehr|diagnostic/)) return "healthcare";
  if (t.match(/garbage|waste|trash|sanitation|landfill|recycl|segregat/)) return "waste_management";
  if (t.match(/traffic|congestion|signal|junction|commute|transport|transit/)) return "traffic";
  if (t.match(/water|flood|drain|sewage|pipeline|scada|leakage/)) return "water";
  if (t.match(/school|education|student|teacher|learning|curriculum/)) return "education";
  if (t.match(/power|energy|electricity|solar|grid|smart meter/)) return "energy";
  return "general";
}

// ─────────────────────────────────────────────────────────────
// DOMAIN-KEYED DEMO FALLBACK DATA
// ─────────────────────────────────────────────────────────────
const DEMO_VENDORS = {
  infrastructure: {
    on_time_delivery_probability: 84.5,
    on_budget_probability: 89.0,
    early_warning_signs: [
      "Hardware supply chain exposure: Reliance on imported wide-angle CMOS image sensors with 6-week lead times poses mild delivery risk during geopolitical shipping spikes.",
      "Field engineering team bandwidth: Core ML engineers are currently double-hatting as physical camera mounting technicians, risking algorithm optimization focus.",
      "Contractor relationship friction: Vendor lacks pre-existing relationships with municipal PWD labor unions, potentially slowing initial vehicle retrofit approvals."
    ],
    overall_vendor_reliability_score: 87
  },

  healthcare: {
    on_time_delivery_probability: 78.0,
    on_budget_probability: 85.5,
    early_warning_signs: [
      "Regulatory compliance lead times: CDSCO and state ethics committee clearance procedures historically introduce 4-8 week milestone variances.",
      "Clinical data validation bottlenecks: Availability of empaneled government radiologists for ground-truth validation is subject to departmental scheduling priorities.",
      "ASHA worker onboarding cycle: Frontline vernacular training timeline is vulnerable to local administrative and public holiday schedules."
    ],
    overall_vendor_reliability_score: 82
  },

  general: {
    on_time_delivery_probability: 86.0,
    on_budget_probability: 91.5,
    early_warning_signs: [
      "Key technical contributor concentration: Lead AI architect holds exclusive knowledge of core model pipeline; team lacks documented cross-training redundancy.",
      "Cash flow timing sensitivity: Milestone payments tied to bureaucratic sign-offs require vendor to bridge 45-day payroll cycles from reserve capital.",
      "Scope creep vulnerability: High responsiveness to municipal ad-hoc requests risks expanding feature backlog beyond contracted sprint definitions."
    ],
    overall_vendor_reliability_score: 88
  }
};

/**
 * Predicts vendor milestone delivery reliability, budget discipline, and operational warning flags
 * @param {Object|string} startupData - Startup team, historical track record, financials, and pilot capacity
 * @returns {Promise<Object>} Vendor reliability prediction matching schema
 */
async function predictVendorPerformance(startupData) {
  const apiKey = process.env.OPENAI_API_KEY;
  const rawText = typeof startupData === "string" 
    ? startupData 
    : JSON.stringify(startupData || {});
  
  const detectedDomain = detectDomain(
    typeof startupData === "object"
      ? `${startupData?.name || ""} ${startupData?.solution || ""} ${startupData?.track_record || ""} ${startupData?.domain || ""}`
      : rawText
  );

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [vendor_predictor]: GPT-4o-mini vendor execution modeling...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Principal Public Sector Vendor Risk Analyst and Technology Delivery Auditor.
You assess startup vendor execution capacity for government contracts, analyzing engineering team depth, past milestone track record, supply chain resilience, cash flow buffers, and bureaucratic compliance readiness.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Deconstruct the vendor's team size, key personnel redundancy, prior public/private delivery credentials, and funding runway.
2. Estimate an empirical on_time_delivery_probability (0-100 percentage) factoring in hardware procurement, field deployment friction, and software sprint velocity.
3. Estimate an on_budget_probability (0-100 percentage) evaluating cost discipline, third-party licensing fees, and scope creep vulnerability.
4. Identify 3 to 4 specific, actionable early_warning_signs (avoid generic truisms; pinpoint supply chains, single-point personnel risks, or regulatory bottlenecks).
5. Compute an overall_vendor_reliability_score (0-100 integer) summarizing operational trustworthiness.

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "on_time_delivery_probability": 84.5,
  "on_budget_probability": 89.0,
  "early_warning_signs": [
    "string"
  ],
  "overall_vendor_reliability_score": 87
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Predict vendor delivery performance and reliability risks for this startup:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ predictVendorPerformance LIVE — reliability score:", parsed.overall_vendor_reliability_score);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI vendor_predictor failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [vendor_predictor]: Simulating AI vendor performance prediction...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_VENDORS[detectedDomain] || DEMO_VENDORS.general;

  return {
    mode: "demo",
    on_time_delivery_probability: fallback.on_time_delivery_probability,
    on_budget_probability: fallback.on_budget_probability,
    early_warning_signs: fallback.early_warning_signs,
    overall_vendor_reliability_score: fallback.overall_vendor_reliability_score
  };
}

module.exports = { predictVendorPerformance };
