// backend/src/ai/timeline_predictor.js
// Advanced AI Module: Timeline Predictor
// Tier-1 Critical Path Analysis, Schedule Variance & Delay Forecasting Engine

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

/** Generates a future date string based on offset months */
function getFutureDate(offsetMonths) {
  const d = new Date();
  d.setMonth(d.getMonth() + offsetMonths);
  return d.toISOString().split("T")[0];
}

// ─────────────────────────────────────────────────────────────
// DOMAIN-KEYED DEMO FALLBACK DATA
// ─────────────────────────────────────────────────────────────
const DEMO_TIMELINES = {
  infrastructure: {
    predicted_completion_date: getFutureDate(6),
    confidence_interval_months: 1.2,
    critical_path_milestones: [
      "M1: Vehicle Mount Prototyping & PWD Safety Clearance (Duration: 3 weeks, Slack: 0 days — Critical Path)",
      "M2: 25-Fleet Hardware Retrofit & GPS/IMU Sensor Synchronization (Duration: 4 weeks, Slack: 0 days — Critical Path)",
      "M3: Staging AI Pipeline & Municipal GIS Work-Order Bridge (Duration: 5 weeks, Slack: 3 days)",
      "M4: 10,000 Lane-Km Live Inspection & Ground-Truth Calibration (Duration: 8 weeks, Slack: 0 days — Critical Path)",
      "M5: Steering Committee Review & Final Acceptance Sign-Off (Duration: 2 weeks, Slack: 0 days — Critical Path)"
    ],
    delay_probability_percentage: 28.5
  },

  healthcare: {
    predicted_completion_date: getFutureDate(8),
    confidence_interval_months: 1.8,
    critical_path_milestones: [
      "M1: Institutional Ethics Committee Review & Protocol Approval (Duration: 6 weeks, Slack: 0 days — Critical Path)",
      "M2: Sovereign Cloud ABDM M1/M2/M3 Gateway Clearance (Duration: 5 weeks, Slack: 2 days)",
      "M3: 40 PHC Hardware Deployment & ASHA Vernacular Training (Duration: 6 weeks, Slack: 0 days — Critical Path)",
      "M4: 50,000 Validated Patient Screenings & Independent Radiologist Audit (Duration: 10 weeks, Slack: 0 days — Critical Path)",
      "M5: State Health Mission Technical Committee Final Sign-Off (Duration: 3 weeks, Slack: 0 days — Critical Path)"
    ],
    delay_probability_percentage: 36.0
  },

  general: {
    predicted_completion_date: getFutureDate(5),
    confidence_interval_months: 1.0,
    critical_path_milestones: [
      "M1: Requirements Finalization & System Architecture Sign-Off (Duration: 3 weeks, Slack: 0 days — Critical Path)",
      "M2: Alpha Platform Integration & Legacy Database Connectors (Duration: 6 weeks, Slack: 0 days — Critical Path)",
      "M3: User Acceptance Testing (UAT) & Departmental Security Audit (Duration: 4 weeks, Slack: 4 days)",
      "M4: Controlled Live Pilot Operations & KPI Benchmark Validation (Duration: 6 weeks, Slack: 0 days — Critical Path)",
      "M5: Final Knowledge Transfer & Production Handover (Duration: 2 weeks, Slack: 0 days — Critical Path)"
    ],
    delay_probability_percentage: 22.0
  }
};

/**
 * Predicts project milestone completion dates, schedule confidence intervals, and critical path risks
 * @param {Object|string} projectData - Scope, baseline timeline, milestones, and team resources
 * @returns {Promise<Object>} Timeline prediction matching schema
 */
async function predictTimeline(projectData) {
  const apiKey = process.env.OPENAI_API_KEY;
  const rawText = typeof projectData === "string" 
    ? projectData 
    : JSON.stringify(projectData || {});
  
  const detectedDomain = detectDomain(
    typeof projectData === "object"
      ? `${projectData?.title || ""} ${projectData?.description || ""} ${projectData?.timeline || ""} ${projectData?.domain || ""}`
      : rawText
  );

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [timeline_predictor]: GPT-4o-mini critical path timeline analysis...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Principal Public Sector Program Director and Critical Path Method (CPM/PERT) Schedule Analyst.
You model realistic completion dates, schedule confidence intervals, critical path dependencies, and probability of delays for government innovation pilots.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Examine the project scope, technical complexity, external dependency risks (permits, hardware sourcing, field trials), and baseline schedule.
2. Determine a realistic predicted_completion_date in ISO format (YYYY-MM-DD), accounting for Indian public sector procurement and audit cycles.
3. Compute a confidence_interval_months (number, e.g. 1.2 or 1.5) reflecting schedule variance.
4. Identify 4 to 5 critical_path_milestones (explicitly noting milestone name, estimated duration, slack time, and whether it lies on the zero-float Critical Path).
5. Calculate a statistically defensible delay_probability_percentage (0-100 float) considering weather/monsoon windows, regulatory sign-offs, and inter-departmental clearances.

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Numbers must be raw numbers.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "predicted_completion_date": "2027-03-31",
  "confidence_interval_months": 1.2,
  "critical_path_milestones": [
    "string"
  ],
  "delay_probability_percentage": 28.5
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Predict the realistic completion timeline and critical path for this project:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ predictTimeline LIVE — completion date:", parsed.predicted_completion_date);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI timeline_predictor failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [timeline_predictor]: Simulating AI timeline prediction...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_TIMELINES[detectedDomain] || DEMO_TIMELINES.general;

  return {
    mode: "demo",
    predicted_completion_date: fallback.predicted_completion_date,
    confidence_interval_months: fallback.confidence_interval_months,
    critical_path_milestones: fallback.critical_path_milestones,
    delay_probability_percentage: fallback.delay_probability_percentage
  };
}

module.exports = { predictTimeline };
