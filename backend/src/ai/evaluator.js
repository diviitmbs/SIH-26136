// backend/src/ai/evaluator.js
// AI Engine 3: Proposal & Startup Evaluator — Maximum Ability Rewrite
// Chain-of-Thought expert prompting | Strict JSON schema | Intelligent demo fallback
// EXPORT UNCHANGED: { evaluateStartups }

// ──────────────────────────────────────────────────────────────
// SDK IMPORT (graceful)
// ──────────────────────────────────────────────────────────────
let _GoogleGenerativeAI = null;
try { _GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI; } catch (e) { _GoogleGenerativeAI = null; }

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function detectChallengeDomain(challenge) {
  const text = JSON.stringify(challenge).toLowerCase();
  if (text.match(/pothole|road|infrastructure/)) return "infrastructure";
  if (text.match(/hospital|health|patient/))     return "healthcare";
  if (text.match(/waste|garbage|sanitation/))    return "waste";
  if (text.match(/traffic|congestion|signal/))   return "traffic";
  return "general";
}

// ──────────────────────────────────────────────────────────────
// DOMAIN-KEYED DEMO REFERENCE DATA
// ──────────────────────────────────────────────────────────────
const DEMO_REFS = {
  infrastructure: {
    strengths_pool: [
      "Computer-vision pothole detection deployed in 4 Smart City missions with documented 94% detection accuracy.",
      "Existing REST API integration with major municipal ERP platforms (SAP ByDesign, Oracle UGIS).",
      "Android crowdsourcing app with offline capability already in production — reduces deployment risk."
    ],
    concerns_pool: [
      "Team size may limit ability to support simultaneous multi-ward rollouts — request capacity plan.",
      "Contractor dispatch module is currently in beta; request GA release timeline and bug SLA.",
      "No documented data-privacy policy for citizen-submitted GPS imagery — a compliance gap."
    ]
  },
  healthcare: {
    strengths_pool: [
      "Live deployment in government district hospitals with documented OPD wait-time reduction from 3.8 hrs to 52 mins.",
      "HL7 FHIR R4 compliant API — ready for direct NHM HMIS integration without middleware.",
      "WhatsApp-first token issuance requires zero app installation — maximises citizen adoption."
    ],
    concerns_pool: [
      "Premium pricing above budget estimate — negotiate milestone-based SLA-linked payments.",
      "Surge prediction model trained on South Indian data; accuracy in other regions is unverified.",
      "Kiosk hardware lead time is 6–8 weeks — may compress the pilot window; confirm stock availability."
    ]
  },
  waste: {
    strengths_pool: [
      "IoT bin sensors deployed across 12 wards in 2 ULBs with documented 31% fuel cost reduction.",
      "Dynamic route engine supports NB-IoT and LoRaWAN — dual-protocol resilience for coverage gaps.",
      "Driver mobile app has offline sync capability and supports 6 regional languages."
    ],
    concerns_pool: [
      "Sensor tamper-resistance has not been independently certified — request IP67 compliance certificate.",
      "Fleet GPS module requires OBD-II port; verify compatibility with older vehicle models in the fleet.",
      "Cloud hosting is on AWS Mumbai — confirm alignment with government data sovereignty policy."
    ]
  },
  general: {
    strengths_pool: [
      "Proven track record with 6 state government deployments across 4 domains.",
      "Modular architecture allows rapid configuration without significant re-engineering.",
      "Strong cybersecurity posture with CERT-In empanelled audit completed in FY 2024-25."
    ],
    concerns_pool: [
      "High customisation dependency — most deployments required 8–14 weeks of bespoke development.",
      "Limited mobile-first experience; current product is desktop-optimised, which may impact citizen adoption.",
      "Generalist domain experience — depth in this specific challenge domain is unclear from proposal."
    ]
  }
};

// ──────────────────────────────────────────────────────────────
// DEMO EVALUATOR
// ──────────────────────────────────────────────────────────────
function demoEvaluate(challenge, candidates) {
  const domain  = detectChallengeDomain(challenge);
  const ref     = DEMO_REFS[domain] || DEMO_REFS.general;

  const comparisons = candidates.map((c) => {
    const score  = c.score || 70;
    const stats  = c.stats || "";
    const strengths = [];
    const concerns  = [];

    // Score-based base strength
    if (score >= 60) {
      strengths.push(`Strong domain alignment (${score}/100 match). ${ref.strengths_pool[0]}`);
    } else {
      concerns.push(`Moderate-to-low domain overlap (${score}/100). Independent capability verification required.`);
    }

    // Additional signals from stats string
    if (/DPIIT/i.test(stats))    strengths.push("DPIIT-recognised startup — regulatory standing is formally confirmed.");
    const effMatch = stats.match(/Efficiency:\s*(\d+)/i);
    if (effMatch && Number(effMatch[1]) >= 85) {
      strengths.push(`High capability passport efficiency score (${effMatch[1]}/100) — verify with original documents.`);
    }
    const projMatch = stats.match(/Projects:\s*(\d+)/i);
    if (projMatch) {
      const proj = Number(projMatch[1]);
      if (proj >= 3) strengths.push(`Multiple completed projects reported (${proj}) — demonstrates delivery track record.`);
      if (proj <= 1) concerns.push(`Very limited number of reported projects (${proj}) — request client references before shortlisting.`);
    }

    // Domain-specific concern
    concerns.push(ref.concerns_pool[0]);

    if (!strengths.length) strengths.push("Registered startup with a capability passport on the ProcureX platform.");
    if (concerns.length < 1)  concerns.push("No immediate red flags in submitted passport — verify originals before shortlisting.");

    const techFeasibility   = Math.min(100, score + Math.floor(Math.random() * 6) + 2);
    const costReasonableness = Math.max(50, score - Math.floor(Math.random() * 10) - 2);

    return {
      startup:              c.startup,
      domain:               c.domain || "Technology",
      match_score:          score,
      overall_score:        score,
      technical_feasibility: techFeasibility,
      cost_reasonableness:  costReasonableness,
      plagiarism_risk:      score >= 70 ? "Low" : "Med",
      sentiment_analysis:   score >= 75
        ? "Confident, evidence-grounded submission with specific deployment references. Key claims require officer verification."
        : "Measured submission. Limited quantitative evidence in proposal — request supporting documentation before evaluation.",
      strengths,
      concerns,
      weaknesses:           concerns,
      verification_checklist: [
        "Request original deployment certificates or signed work orders from all cited government clients.",
        "Validate claimed performance metrics against pilot data using the ProcureX Document Analyser.",
        "Confirm team capacity and key-person continuity plan for the 2–3 month pilot period.",
        "Obtain direct contact references from previous government clients for independent verification."
      ],
      final_recommendation: score >= 75
        ? `Recommended for technical deep-dive. Schedule a live product demonstration and reference call for ${c.startup} before final shortlisting.`
        : `Requires additional documentation. Request verified deployment data and third-party benchmarks before shortlisting ${c.startup}.`
    };
  });

  const sorted = [...comparisons].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  const gap    = sorted.length > 1 ? sorted[0].match_score - sorted[1].match_score : 0;

  const overall_notes = sorted.length
    ? `Based on submitted capability passports, ${sorted[0].startup} demonstrates the strongest alignment (${sorted[0].match_score}/100 match).`
      + (gap >= 20
        ? ` The gap to the next candidate is substantial (${gap} pts) — prioritise deep-dive with ${sorted[0].startup}.`
        : " The top candidates are closely scored — a structured technical presentation round is recommended before final shortlisting.")
      + " This evaluation is advisory only. The final shortlisting decision rests solely with the government procurement officer."
    : "No candidate startups were provided. Please submit at least one candidate profile for evaluation.";

  return { comparisons: sorted, overall_notes };
}



// (demoEvaluate and DEMO_REFS are defined in the header block above)


// ──────────────────────────────────────────────────────────────
// MAIN FUNCTION — signature UNCHANGED: evaluateStartups(challenge, candidates)
// ──────────────────────────────────────────────────────────────
async function evaluateStartups(challenge, candidates) {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  // ── LIVE GEMINI MODE ────────────────────────────────────────
  if (hasKey && _GoogleGenerativeAI) {
    try {
      console.log("🤖 LIVE GEMINI MODE [evaluator]: chain-of-thought proposal evaluation...");
      const gemini = new _GoogleGenerativeAI(apiKey);
      const model  = gemini.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
        generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
      });

      const prompt = `You are a Tier-1 Government Procurement Evaluation Expert with 20 years of experience assessing startup proposals for Indian public-sector innovation challenges.

CHAIN-OF-THOUGHT MANDATE — reason through these steps before producing JSON:
Step 1 — For each candidate, assess technical capability match against the challenge requirements (score 0–100).
Step 2 — Evaluate cost reasonableness relative to the challenge budget and Indian government market rates (score 0–100).
Step 3 — Analyse proposal sentiment: is it evidence-grounded and specific, or vague and hyperbolic?
Step 4 — Assess plagiarism/boilerplate risk: Low (specific, original), Med (some generic language), High (mostly boilerplate).
Step 5 — Identify 3 genuine strengths and 3 genuine concerns using ONLY the provided information.
Step 6 — Write a 4-item practical verification checklist for the procurement officer.
Step 7 — Write a clear, actionable final recommendation per candidate.

STRICT OUTPUT RULES:
- Return ONLY valid JSON. No markdown fences, no prose outside JSON.
- Include ALL candidates in comparisons array, sorted by match_score descending.
- NEVER invent deployments, certifications, funding, or metrics not in the input.
- NEVER declare a winner or make procurement decisions — advisory only.

REQUIRED JSON SCHEMA:
{
  "comparisons": [
    {
      "startup": "string",
      "domain": "string",
      "match_score": 85,
      "overall_score": 85,
      "technical_feasibility": 88,
      "cost_reasonableness": 82,
      "plagiarism_risk": "Low",
      "sentiment_analysis": "string",
      "strengths": ["string"],
      "concerns": ["string"],
      "weaknesses": ["string"],
      "verification_checklist": ["string"],
      "final_recommendation": "string"
    }
  ],
  "overall_notes": "string"
}

GOVERNMENT CHALLENGE:
${JSON.stringify(challenge, null, 2)}

CANDIDATE STARTUPS:
${JSON.stringify(candidates, null, 2)}`;

      const result  = await model.generateContent(prompt);
      const rawText = result.response.text();
      const parsed  = JSON.parse(rawText);

      console.log("✅ evaluateStartups LIVE — candidates evaluated:", (parsed.comparisons || []).length);
      return {
        mode: "live",
        comparisons:   parsed.comparisons || [],
        overall_notes: parsed.overall_notes || ""
      };

    } catch (err) {
      console.error("❌ Gemini evaluator failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [evaluator]: intelligent rule-based evaluation...");
    await sleep(1500);
  }

  // ── DEMO MODE ────────────────────────────────────────────────
  return {
    mode: "demo",
    ...demoEvaluate(challenge, candidates)
  };
}

module.exports = { evaluateStartups };