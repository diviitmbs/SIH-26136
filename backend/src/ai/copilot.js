// backend/src/ai/copilot.js
// AI Engine 6: Decision Copilot — Maximum Ability Rewrite
// Chain-of-Thought strategic decision expert | Strict JSON | Intelligent demo fallback
// EXPORT UNCHANGED: { generateDecisionBrief }
// Golden Rule: Scale score is ALWAYS calculated in code, never by AI.

// ──────────────────────────────────────────────────────────────
// SDK IMPORT (graceful)
// ──────────────────────────────────────────────────────────────
let _GoogleGenerativeAI = null;
try { _GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI; } catch (e) { _GoogleGenerativeAI = null; }
const GoogleGenerativeAI = _GoogleGenerativeAI;

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ──────────────────────────────────────────────────────────────
// TRANSPARENT SCALE SCORE FORMULA (code-computed, immutable)
// Scale Readiness Score = 60% KPI success rate + 40% evidence quality
// ──────────────────────────────────────────────────────────────
function calculateScaleScore(kpis, evidenceStrength) {
  if (!kpis || !kpis.length) return 0;

  const achieved      = kpis.filter(k => k.status === "achieved").length;
  const partial       = kpis.filter(k => k.status === "partially_achieved").length;
  const kpiSuccessRate = (achieved + partial * 0.5) / kpis.length;

  const evidenceScore = evidenceStrength === "strong" ? 1.0
                      : evidenceStrength === "medium" ? 0.6
                      : 0.2;

  return Math.round((kpiSuccessRate * 60) + (evidenceScore * 40));
}

// ──────────────────────────────────────────────────────────────
// DEMO DECISION BRIEF
// ──────────────────────────────────────────────────────────────
function demoBrief(challengeTitle, kpis, evidenceStrength, scaleScore) {
  const achieved = kpis.filter(k => k.status === "achieved").length;
  const total    = kpis.length;

  // Final recommendation (rule-driven, deterministic)
  const finalRecommendation = scaleScore >= 80 ? "Approve"
                            : scaleScore >= 50 ? "Extend Pilot"
                            : "Reject";

  // Risk forecast based on score thresholds
  const riskForecast = [
    {
      risk: "Technology integration failure post-scale",
      probability: scaleScore >= 80 ? "Low (12%)" : scaleScore >= 50 ? "Medium (28%)" : "High (55%)"
    },
    {
      risk: "Insufficient evidence to support full procurement audit",
      probability: evidenceStrength === "strong" ? "Low (8%)" : evidenceStrength === "medium" ? "Medium (35%)" : "High (62%)"
    },
    {
      risk: "Vendor capacity constraint during city-wide deployment",
      probability: "Medium (22%)"
    },
    {
      risk: "Citizen adoption below projected rates",
      probability: scaleScore >= 70 ? "Low (15%)" : "Medium (30%)"
    }
  ];

  // Scenario planning
  const scenarioPlanning = {
    best_case: scaleScore >= 70
      ? `Full city-wide deployment achieves ${Math.min(100, Math.round(achieved / total * 120))}% of KPI targets. Citizen adoption reaches 75%+ within 90 days. Annual ROI exceeds 2.5x budget. Solution becomes a replicable model for other wards/cities.`
      : `Focused remediation pilot (45 days) closes the performance gap. Re-evaluation in 60 days shows improvement. Provisional scale approval granted with enhanced monitoring SLA.`,
    worst_case: scaleScore >= 70
      ? `Integration challenges during scale cause 4–6 week delay. 2 of ${total} KPIs regress during transition. Budget overrun of 15–20% due to additional customisation. Requires contract renegotiation.`
      : `Scale approval is premature; ${total - achieved} failing KPIs persist at city scale. Vendor unable to meet SLA. Contract terminated. Procurement restarted. Estimated delay: 8–12 months.`,
    most_likely: scaleScore >= 80
      ? `Solution scales with minor integration friction (2–3 week delay). Achieves ${Math.round(achieved / total * 100)}% of KPIs at city level. Citizen satisfaction exceeds 75/100. Procurement progresses to GeM listing within 30 days of officer approval.`
      : scaleScore >= 50
        ? `Extended pilot (45 days) with targeted interventions improves success score by 15–20 points. Scale decision deferred to next review cycle. Additional evidence collection required.`
        : `Pilot is terminated. Comprehensive lessons-learned report is produced. New procurement cycle initiated with revised RFP incorporating learnings from this pilot.`
  };

  // Audit trail
  const auditTrailSummary = `Decision Brief generated at ${new Date().toISOString()} | Challenge: "${challengeTitle}" | KPI Success: ${achieved}/${total} | Evidence Strength: ${evidenceStrength} | Scale Readiness Score: ${scaleScore}/100 | Recommendation: ${finalRecommendation}. This is an AI-generated advisory output. The final procurement decision rests with the authorised government procurement officer and is subject to applicable GFR/CVC compliance requirements.`;

  return {
    final_recommendation: finalRecommendation,
    scale_readiness_score: scaleScore,
    risk_forecast: riskForecast,
    scenario_planning: scenarioPlanning,
    audit_trail_summary: auditTrailSummary,
    // Legacy fields for backward compatibility
    recommendation: finalRecommendation === "Approve" ? "PROCEED TO PROCUREMENT REVIEW"
                  : finalRecommendation === "Extend Pilot" ? "EXTEND PILOT WITH MODIFICATIONS"
                  : "STOP / REJECT",
    executive_summary: `Scale Readiness Score: ${scaleScore}/100. AI Copilot Recommendation: ${finalRecommendation}. ${scenarioPlanning.most_likely} This is an advisory output only — the final decision rests with the government procurement officer.`,
    risk_flags: evidenceStrength === "weak"
      ? ["Evidence package is weak. Independent verification required before any financial commitment."]
      : scaleScore < 50
        ? ["Pilot performance is below threshold. Proceeding to scale carries high risk of operational failure and audit non-compliance."]
        : [],
    next_steps: finalRecommendation === "Approve"
      ? ["Initiate GeM/Government e-Marketplace procurement hand-off", "Draft contract based on pilot SLA metrics", "Commission independent scale-readiness audit", "Publish public impact summary for transparency"]
      : finalRecommendation === "Extend Pilot"
        ? ["Address identified KPI gaps with targeted interventions", "Commission independent third-party evidence verification", "Redefine KPI targets for the extended pilot window", "Schedule 45-day review with enhanced monitoring"]
        : ["Issue formal pilot termination notice to vendor", "Produce comprehensive lessons-learned report", "Revise RFP based on pilot findings", "Restart procurement cycle with updated requirements"]
  };
}

// ──────────────────────────────────────────────────────────────
// MAIN FUNCTION — signature UNCHANGED: generateDecisionBrief(challengeTitle, kpis, evidenceStrength)
// ──────────────────────────────────────────────────────────────
async function generateDecisionBrief(challengeTitle, kpis, evidenceStrength) {
  // Scale score is ALWAYS computed in code — Gemini is NOT allowed to modify it
  const scaleScore = calculateScaleScore(kpis, evidenceStrength);

  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  // ── LIVE GEMINI MODE ────────────────────────────────────────
  if (hasKey && _GoogleGenerativeAI) {
    try {
      console.log("🤖 LIVE GEMINI MODE [decision copilot]: chain-of-thought decision brief...");
      const gemini = new _GoogleGenerativeAI(apiKey);
      const model  = gemini.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-3.6-flash",
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      });

      const finalRec = scaleScore >= 80 ? "Approve"
                     : scaleScore >= 50 ? "Extend Pilot"
                     : "Reject";

      const prompt = `You are a Tier-1 Strategic Government Procurement Decision Advisor with 25 years of experience advising Indian ministries and state departments on technology procurement scale-up decisions.

PRE-COMPUTED SCALE READINESS SCORE (DO NOT MODIFY): ${scaleScore}/100
MANDATED FINAL RECOMMENDATION (DO NOT OVERRIDE): "${finalRec}"

CHAIN-OF-THOUGHT MANDATE — reason through these steps before producing JSON:
Step 1 — Review the KPI results and evidence strength. Identify the 3 strongest risk factors for scaling.
Step 2 — Assign realistic probability ranges to each risk (Low <20%, Medium 20-50%, High >50%).
Step 3 — Write a detailed best-case, worst-case, and most-likely scenario for city-wide deployment.
Step 4 — Write an audit trail summary that would satisfy a government audit/CAG review.
Step 5 — Generate a concise executive summary for the procurement officer.

STRICT OUTPUT RULES:
- Return ONLY valid JSON. No markdown, no prose outside JSON.
- Use EXACTLY "${finalRec}" for final_recommendation. Do NOT change it.
- Use EXACTLY ${scaleScore} for scale_readiness_score. Do NOT change it.
- NEVER claim procurement has been approved — this is advisory only.
- The government officer makes the final decision.

REQUIRED JSON SCHEMA:
{
  "final_recommendation": "${finalRec}",
  "scale_readiness_score": ${scaleScore},
  "risk_forecast": [{"risk": "string", "probability": "string"}],
  "scenario_planning": {
    "best_case": "string",
    "worst_case": "string",
    "most_likely": "string"
  },
  "audit_trail_summary": "string",
  "recommendation": "string",
  "executive_summary": "string",
  "risk_flags": ["string"],
  "next_steps": ["string"]
}

INPUT:
${JSON.stringify({ challengeTitle, kpis, evidenceStrength, scaleScore }, null, 2)}`;

      const result  = await model.generateContent(prompt);
      const rawText = result.response.text();
      const parsed  = JSON.parse(rawText);

      // Safety: always enforce code-computed values regardless of AI output
      parsed.scale_readiness_score = scaleScore;
      parsed.final_recommendation  = finalRec;

      console.log("✅ generateDecisionBrief LIVE — recommendation:", finalRec, "score:", scaleScore);
      return {
        mode: "live",
        brief: parsed
      };

    } catch (err) {
      console.error("❌ Gemini decision copilot failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [decision copilot]: generating comprehensive decision brief...");
    await sleep(1500);
  }

  // ── DEMO MODE ────────────────────────────────────────────────
  return {
    mode: "demo",
    brief: demoBrief(challengeTitle, kpis, evidenceStrength, scaleScore)
  };
}

module.exports = { generateDecisionBrief };


// 1. TRANSPARENT MATH
// Calculate Scale Readiness Score (0-100)
//
// Formula:
// 60% Pilot KPI Success + 40% Evidence Strength

function calculateScaleScore(kpis, evidenceStrength) {

  if (!kpis || !kpis.length) {
    return 0;
  }


  const achieved =
    kpis.filter(
      k => k.status === "achieved"
    ).length;


  const kpiSuccessRate =
    achieved / kpis.length;


  let evidenceScore = 0;


  if (evidenceStrength === "strong") {

    evidenceScore = 1.0;

  } else if (evidenceStrength === "medium") {

    evidenceScore = 0.6;

  } else {

    evidenceScore = 0.2;

  }


  const rawScore =
    (kpiSuccessRate * 60) +
    (evidenceScore * 40);


  return Math.round(rawScore);

}


// 2. DEMO MODE
// Generate brief without Gemini

function demoBrief(
  challengeTitle,
  kpis,
  evidenceStrength,
  scaleScore
) {

  const achieved =
    kpis.filter(
      k => k.status === "achieved"
    ).length;


  const total =
    kpis.length;


  let recommendation =
    "EXTEND PILOT";


  let reasoning = "";


  if (scaleScore >= 80) {

    recommendation =
      "PROCEED TO PROCUREMENT REVIEW";


    reasoning =
      `The pilot successfully achieved ${achieved}/${total} KPIs with ${evidenceStrength} evidence backing. The solution demonstrates high scale readiness.`;

  } else if (scaleScore >= 50) {

    recommendation =
      "EXTEND PILOT WITH MODIFICATIONS";


    reasoning =
      `The pilot achieved ${achieved}/${total} KPIs. While promising, the ${evidenceStrength} evidence suggests more validation is needed before full procurement.`;

  } else {

    recommendation =
      "STOP / REJECT";


    reasoning =
      `The pilot only achieved ${achieved}/${total} KPIs with ${evidenceStrength} evidence. The solution is not yet ready for scale.`;

  }


  return {

    scale_readiness_score:
      scaleScore,

    recommendation,

    executive_summary:
      `Based on the pilot data for "${challengeTitle}", the AI Copilot recommends to ${recommendation.toLowerCase()}. ${reasoning} This is an advisory output; the final decision rests with the government officer.`,

    risk_flags:
      evidenceStrength === "weak"
        ? [
            "Evidence package is weak. Independent verification required before any financial commitment."
          ]
        : [],

    next_steps:
      recommendation.includes("PROCEED")
        ? [
            "Initiate GeM/procurement hand-off",
            "Draft contract based on pilot SLA",
            "Publish public impact summary"
          ]
        : [
            "Address missing evidence gaps",
            "Redefine KPIs for next pilot phase",
            "Request independent third-party audit"
          ]

  };

}


// 3. MAIN FUNCTION

async function generateDecisionBrief(
  challengeTitle,
  kpis,
  evidenceStrength
) {

  // IMPORTANT:
  // Scale score is calculated entirely in code.
  // Gemini is NOT allowed to change it.

  const scaleScore =
    calculateScaleScore(
      kpis,
      evidenceStrength
    );


  const apiKey =
    process.env.GEMINI_API_KEY;


  const hasKey =
    apiKey &&
    apiKey !== "paste_your_key_here" &&
    apiKey.trim() !== "";


  if (hasKey) {

    try {

      console.log(
        "🤖 LIVE GEMINI MODE: generating decision brief..."
      );


      const gemini =
        new GoogleGenerativeAI(apiKey);


      const model =
        gemini.getGenerativeModel({

          model:
            process.env.GEMINI_MODEL ||
            "gemini-3.6-flash",

          generationConfig: {

            temperature: 0.2,

            responseMimeType:
              "application/json"

          }

        });


      const prompt = `You are a Decision Copilot for a government procurement officer.

You will receive:

- A challenge title
- Pilot KPI results
- Evidence strength
- A Scale Readiness Score that has ALREADY been calculated by software

The Scale Readiness Score is:

${scaleScore}/100

DO NOT recalculate, modify, or replace this score.

Return ONLY valid JSON in exactly this structure:

{
  "scale_readiness_score": 0,
  "recommendation": "PROCEED TO PROCUREMENT REVIEW",
  "executive_summary": "string",
  "risk_flags": [],
  "next_steps": []
}

The recommendation MUST be exactly one of:

"PROCEED TO PROCUREMENT REVIEW"

"EXTEND PILOT WITH MODIFICATIONS"

"STOP / REJECT"

Rules:

1. Be conservative.
2. If score is below 50, recommend "STOP / REJECT".
3. If score is 50-79, recommend "EXTEND PILOT WITH MODIFICATIONS".
4. If score is 80 or higher, recommend "PROCEED TO PROCUREMENT REVIEW".
5. Do not change the provided Scale Readiness Score.
6. Base statements only on the provided KPI results and evidence strength.
7. NEVER invent external facts.
8. Do not invent users, savings, contracts, deployments, certifications, audits, clients, or other evidence.
9. Risk flags should only identify risks supported by the provided information.
10. Next steps should be practical procurement/pilot validation actions.
11. This is an advisory decision-support output.
12. ALWAYS state that the government officer makes the final decision.
13. Never claim that procurement has already been approved.
14. If information is missing, explicitly say that it is not provided instead of guessing.

INPUT:

${JSON.stringify(
  {
    challengeTitle,
    kpis,
    evidenceStrength
  },
  null,
  2
)}
`;


      const result =
        await model.generateContent(
          prompt
        );


      const response =
        result.response;


      const rawText =
        response.text();


      const parsed =
        JSON.parse(rawText);


      // Safety: the score calculated by our code
      // always wins over anything returned by Gemini.

      parsed.scale_readiness_score =
        scaleScore;


      console.log(
        "✅ Gemini decision brief completed."
      );


      return {

        mode: "live",

        brief: parsed

      };


    } catch (err) {

      console.error(
        "❌ Gemini brief failed, falling back to demo:",
        err.message
      );

    }

  } else {

    console.log(
      "ℹ️ DEMO MODE: template decision brief"
    );

  }


  await new Promise(
    (r) => setTimeout(r, 1200)
  );


  return {

    mode: "demo",

    brief:
      demoBrief(
        challengeTitle,
        kpis,
        evidenceStrength,
        scaleScore
      )

  };

}


module.exports = {
  generateDecisionBrief
};