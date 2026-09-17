// backend/src/ai/bias_detector.js
// Advanced AI Module: Algorithmic & Evaluation Bias Detector
// Tier-1 Public Procurement Fairness, Equity & Algorithmic Audit Engine

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
const DEMO_BIAS = {
  infrastructure: {
    bias_risk_score: 34,
    geographic_bias_detected: true,
    demographic_bias_detected: false,
    fairness_recommendations: [
      "Mitigate Ward Allocation Skew: Scoring criteria currently award disproportionate weight to pilot routes in affluent central business districts; balance sample road inspection quotas across peri-urban and informal settlement wards.",
      "Blinded Technical Evaluation: Redact vendor headquarters locations during Stage-1 technical reviews to eliminate unconscious selection bias favoring Tier-1 metropolitan startups over regional state enterprises.",
      "Sensor Calibration for Low-Income Neighborhoods: Ensure road detection algorithms are calibrated on unpaved or cobblestone road surfaces typical of outer wards to prevent uneven detection rates across socio-economic zones."
    ]
  },

  healthcare: {
    bias_risk_score: 42,
    geographic_bias_detected: true,
    demographic_bias_detected: true,
    fairness_recommendations: [
      "Stratified Demographic Dataset Validation: Ensure training and validation cohorts contain at least 40% female patient records and equal representation across pediatric and geriatric age groups.",
      "Rural Primary Health Center Normalization: Re-weight diagnostic inference metrics to account for lower ambient clinic lighting and varying skin pigmentation during dermatological/imaging scans.",
      "Bilingual and Vernacular Usability Testing: Mandate independent accessibility audits for illiterate or non-English-speaking rural patients interacting with consent dashboards."
    ]
  },

  general: {
    bias_risk_score: 28,
    geographic_bias_detected: false,
    demographic_bias_detected: false,
    fairness_recommendations: [
      "Standardize Objective Rubric Scoring: Replace open-ended evaluator commentary with quantitative rubric anchors (e.g. Likert 1-5 scales with explicit technical definitions) to reduce subjective variance.",
      "Startup Age & Turnover De-biasing: Enforce Startup India DPIIT relaxation clauses so young innovators (under 3 years) are not penalized for lower historical balance-sheet turnover during financial scoring.",
      "Multi-Member Evaluation Normalization: Apply z-score normalization across evaluator scorecards to neutralize consistently lenient or overly harsh individual committee reviewers."
    ]
  }
};

/**
 * Detects geographic, demographic, and procedural bias in procurement evaluations and AI algorithms
 * @param {Object|string} decisionData - Scoring matrix, shortlisted proposals, or evaluation committee decisions
 * @returns {Promise<Object>} Bias audit results matching schema
 */
async function detectBias(decisionData) {
  const apiKey = process.env.OPENAI_API_KEY;
  const rawText = typeof decisionData === "string" 
    ? decisionData 
    : JSON.stringify(decisionData || {});
  
  const detectedDomain = detectDomain(rawText);

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [bias_detector]: GPT-4o-mini algorithmic equity audit...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Principal Algorithmic Fairness Auditor and Public Sector Ethics Officer.
You analyze government procurement evaluations, scoring rubrics, shortlisted candidates, and technical deployments to detect systemic geographic bias, demographic exclusions, and procedural unfairness.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Examine the evaluation criteria, scoring distributions, vendor geographical footprints, and affected citizen demographics.
2. Determine a composite bias_risk_score (0-100 integer, where 0 is perfectly equitable and 100 is deeply discriminatory).
3. Evaluate whether geographic_bias_detected is true or false (e.g. undue favor towards metro hubs, neglect of peri-urban/rural zones, biased training data capture locations).
4. Evaluate whether demographic_bias_detected is true or false (e.g. gender disparities, age discrimination, language/vernacular exclusions, socio-economic marginalization).
5. Formulate 3 to 4 actionable, legally grounded fairness_recommendations (e.g. blinded scoring, stratified sampling, DPIIT eligibility waivers, z-score evaluator normalization).

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Booleans must be raw true or false values (not quoted strings).
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "bias_risk_score": 34,
  "geographic_bias_detected": true,
  "demographic_bias_detected": false,
  "fairness_recommendations": [
    "string"
  ]
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Audit this procurement decision / dataset for systemic bias and fairness risks:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ detectBias LIVE — bias risk score:", parsed.bias_risk_score);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI bias_detector failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [bias_detector]: Simulating AI bias audit...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_BIAS[detectedDomain] || DEMO_BIAS.general;

  return {
    mode: "demo",
    bias_risk_score: fallback.bias_risk_score,
    geographic_bias_detected: fallback.geographic_bias_detected,
    demographic_bias_detected: fallback.demographic_bias_detected,
    fairness_recommendations: fallback.fairness_recommendations
  };
}

module.exports = { detectBias };
