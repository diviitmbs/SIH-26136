// backend/src/ai/evidence.js
// AI Engine 5: Evidence Verifier — Maximum Ability Rewrite
// Chain-of-Thought fraud-detection expert | Strict JSON schema | Intelligent demo fallback
// EXPORT UNCHANGED: { summarizeEvidence }

// ──────────────────────────────────────────────────────────────
// SDK IMPORT (graceful)
// ──────────────────────────────────────────────────────────────
let _GoogleGenerativeAI = null;
try { _GoogleGenerativeAI = require("@google/generative-ai").GoogleGenerativeAI; } catch (e) { _GoogleGenerativeAI = null; }

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ──────────────────────────────────────────────────────────────
// DOCUMENT STRENGTH RULES — conservative by design
// ──────────────────────────────────────────────────────────────
const DOC_STRENGTH = {
  "Pilot completion report (submitted by startup)":          { strength: "medium", weight: 0.5, note: "Self-reported by startup — useful but must be cross-referenced with independent data." },
  "Raw operational data (system/hospital exports)":          { strength: "strong", weight: 0.9, note: "Primary operational data is strong evidence when the source system is trusted and auditable." },
  "User / citizen feedback survey":                          { strength: "medium", weight: 0.5, note: "Shows user experience; check sample size, methodology, and selection bias before accepting." },
  "Independent third-party verification note":               { strength: "strong", weight: 0.9, note: "Independent verification significantly strengthens the evidence package — confirm the verifier's credentials." },
  "Field photos / system logs / screenshots":                { strength: "weak",   weight: 0.2, note: "Supporting material only — easily staged. Use solely as corroboration, never as primary evidence." },
  "Signed MoU or work order from government client":         { strength: "strong", weight: 0.85, note: "Official government document — verify authenticity via the issuing department directly." },
  "Audited financial statements":                            { strength: "strong", weight: 0.8, note: "Audited statements provide financial credibility — verify the auditing firm's credentials." },
  "DPIIT certificate / startup registration":                { strength: "medium", weight: 0.6, note: "Confirms registration status; does not validate technical capability or performance claims." },
  "Patent or IP documentation":                              { strength: "medium", weight: 0.55, note: "Demonstrates innovation commitment; verify grant status vs. filed-only claims." },
  "Media coverage / press releases":                         { strength: "weak",   weight: 0.15, note: "PR material — no evidentiary value for procurement. Use only for background context." }
};

// ──────────────────────────────────────────────────────────────
// DEMO EVIDENCE VERIFIER
// ──────────────────────────────────────────────────────────────
function demoVerifyEvidence(items, excerpt) {
  // Score each document type
  const evaluated = items.map(item => {
    const rule = DOC_STRENGTH[item] || { strength: "medium", weight: 0.5, note: "Document type not in standard taxonomy — assess manually." };
    return { type: item, strength: rule.strength, weight: rule.weight, note: rule.note };
  });

  // Compute verification score (0–100) based on weighted document strength
  const totalWeight = evaluated.reduce((sum, e) => sum + e.weight, 0);
  const maxPossible = Math.max(items.length * 0.9, 1);
  const verificationScore = Math.min(100, Math.round((totalWeight / maxPossible) * 100));

  // Classify as verified vs unverified claims based on strength
  const verifiedClaims   = evaluated.filter(e => e.strength === "strong").map(e => e.type);
  const unverifiedClaims = evaluated.filter(e => e.strength !== "strong").map(e => e.type);

  // Fraud risk assessment
  const hasIndependent = items.some(i => /independent/i.test(i));
  const hasRaw         = items.some(i => /raw operational/i.test(i));
  const hasWeak        = evaluated.every(e => e.strength === "weak");

  let fraudRisk;
  if (hasIndependent && hasRaw) {
    fraudRisk = "Low";
  } else if (hasWeak || items.length === 0) {
    fraudRisk = "High";
  } else {
    fraudRisk = "Med";
  }

  // Cross-reference analysis of the excerpt
  const crossRefMatches = [];
  if (excerpt) {
    if (/\d+(\.\d+)?\s*(%|percent)/i.test(excerpt)) {
      crossRefMatches.push("Excerpt contains quantitative percentage figures — cross-check these against KPI data from the Pilot Analyst.");
    }
    if (/20\d\d/i.test(excerpt)) {
      crossRefMatches.push("Excerpt references specific years — verify these dates align with the stated deployment timeline.");
    }
    if (/verified|independent|audit|certified/i.test(excerpt)) {
      crossRefMatches.push("Excerpt claims verification or audit — confirm the identity and credentials of the verifying entity.");
    }
    if (/crore|lakh|₹|\bINR\b/i.test(excerpt)) {
      crossRefMatches.push("Excerpt mentions financial figures — cross-reference with submitted financial statements or GeM transaction records.");
    }
    if (!crossRefMatches.length) {
      crossRefMatches.push("Excerpt is qualitative in nature — supplement with quantitative data before proceeding to scale decision.");
    }
  } else {
    crossRefMatches.push("No document excerpt provided — cannot perform text-level cross-referencing.");
  }

  // Gaps
  const gaps = [];
  if (!items.length)      gaps.push("No evidence documents selected. A complete evidence package is required before any scale decision.");
  if (!hasIndependent)    gaps.push("No independent third-party verification present — this is the most critical gap in the evidence package.");
  if (!hasRaw)            gaps.push("No raw operational data submitted — without source-system exports, performance claims cannot be validated.");
  if (fraudRisk === "High") gaps.push("Evidence package is predominantly weak/self-reported. High risk of unverified or exaggerated claims.");

  // Recommendations
  const recommendations = [];
  if (!hasIndependent) recommendations.push("Commission an independent third-party verification note from a CERT-In empanelled or STQC-accredited agency.");
  if (!hasRaw)         recommendations.push("Request raw operational data exports directly from the system (e.g., hospital HMIS, municipal ERP) — not from the startup.");
  recommendations.push("Cross-reference all claimed metrics in the excerpt against the KPI actuals submitted in the pilot stage.");
  recommendations.push("Verify authenticity of any government-issued documents (MoU, work orders) directly with the issuing department via official channels.");

  const overallAssessment = hasIndependent && hasRaw
    ? "Strong evidence package: combines primary operational data with independent verification. Suitable for the SCALE decision review, subject to final officer assessment."
    : hasIndependent || hasRaw
      ? "Moderately strong package — one core pillar (independence or raw data) is missing. Request the missing element before committing to a scale decision."
      : "Weak evidence package — predominantly self-reported. Independent verification is critical before any financial commitment. This is high-risk for procurement approval.";

  return {
    verification_score:    verificationScore,
    verified_claims:       verifiedClaims,
    unverified_claims:     unverifiedClaims,
    fraud_risk:            fraudRisk,
    cross_reference_matches: crossRefMatches,
    recommendations,
    items:                 evaluated,
    gaps,
    overall_assessment:    overallAssessment + " Final acceptance of evidence rests with the government procurement officer."
  };
}

// ──────────────────────────────────────────────────────────────
// MAIN FUNCTION — signature UNCHANGED: summarizeEvidence(items, excerpt)
// ──────────────────────────────────────────────────────────────
async function summarizeEvidence(items, excerpt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  // ── LIVE GEMINI MODE ────────────────────────────────────────
  if (hasKey && _GoogleGenerativeAI) {
    try {
      console.log("🤖 LIVE GEMINI MODE [evidence verifier]: chain-of-thought fraud risk analysis...");
      const gemini = new _GoogleGenerativeAI(apiKey);
      const model  = gemini.getGenerativeModel({
        model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      });

      const prompt = `You are a Tier-1 Government Procurement Fraud Detection Expert and Evidence Assessor with 20 years of experience reviewing startup evidence packages for Indian public-sector procurement decisions.

CHAIN-OF-THOUGHT MANDATE — reason through these steps before producing JSON:
Step 1 — Assess each document type's evidentiary strength: strong (independent, primary data), medium (self-reported with corroboration), or weak (easily fabricated, PR material).
Step 2 — Compute a verification_score (0–100) based on the overall quality and completeness of the evidence package.
Step 3 — Classify which submitted documents verify claims (verified_claims) and which leave claims unverified (unverified_claims).
Step 4 — Assess fraud_risk (Low/Med/High) based on absence of independent verification, over-reliance on self-reporting, or suspicious patterns in the excerpt.
Step 5 — Identify cross-reference matches or conflicts between the excerpt text and the submitted document types.
Step 6 — Write specific, actionable recommendations for the procurement officer.

STRICT OUTPUT RULES:
- Return ONLY valid JSON. No markdown, no prose outside JSON.
- Be CONSERVATIVE — when in doubt, downgrade strength and upgrade fraud risk.
- NEVER invent documents, certifications, or data not provided.
- Final acceptance of evidence ALWAYS rests with the government officer.

REQUIRED JSON SCHEMA:
{
  "verification_score": 72,
  "verified_claims": ["string"],
  "unverified_claims": ["string"],
  "fraud_risk": "Med",
  "cross_reference_matches": ["string"],
  "recommendations": ["string"],
  "items": [{"type": "string", "strength": "strong", "note": "string"}],
  "gaps": ["string"],
  "overall_assessment": "string"
}

SUBMITTED EVIDENCE ITEMS:
${JSON.stringify(items)}

DOCUMENT EXCERPT (if provided):
${JSON.stringify(excerpt || "")}`;

      const result  = await model.generateContent(prompt);
      const rawText = result.response.text();
      // Strip any markdown fences that might slip through
      const clean   = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
      const parsed  = JSON.parse(clean);

      console.log("✅ summarizeEvidence LIVE — fraud risk:", parsed.fraud_risk);
      return {
        mode: "live",
        verification_score:      parsed.verification_score      || 0,
        verified_claims:         parsed.verified_claims         || [],
        unverified_claims:       parsed.unverified_claims       || [],
        fraud_risk:              parsed.fraud_risk              || "Med",
        cross_reference_matches: parsed.cross_reference_matches || [],
        recommendations:         parsed.recommendations         || [],
        items:                   parsed.items                   || [],
        gaps:                    parsed.gaps                    || [],
        overall_assessment:      parsed.overall_assessment      || ""
      };

    } catch (err) {
      console.error("❌ Gemini evidence verifier failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [evidence verifier]: intelligent rule-based assessment...");
    await sleep(1500);
  }

  // ── DEMO MODE ────────────────────────────────────────────────
  return {
    mode: "demo",
    ...demoVerifyEvidence(items, excerpt)
  };
}

module.exports = { summarizeEvidence };