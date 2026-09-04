// backend/src/ai/copilot.js
// AI Feature 7: Decision Copilot (The SCALE Stage)
// Generates a Procurement-Readiness Brief and Scale Readiness Score.
// Golden Rule: Math is computed in code (transparent). Prose is written by AI (or fallback).

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

// 1. TRANSPARENT MATH: Calculate Scale Readiness Score (0-100)
// Formula (from Master Doc 6.6): 60% Pilot KPI Success + 40% Evidence Strength
function calculateScaleScore(kpis, evidenceStrength) {
  if (!kpis || !kpis.length) return 0;
  
  const achieved = kpis.filter(k => k.status === 'achieved').length;
  const kpiSuccessRate = achieved / kpis.length; // 0.0 to 1.0
  
  let evidenceScore = 0;
  if (evidenceStrength === 'strong') evidenceScore = 1.0;
  else if (evidenceStrength === 'medium') evidenceScore = 0.6;
  else evidenceScore = 0.2; // weak or missing

  const rawScore = (kpiSuccessRate * 60) + (evidenceScore * 40);
  return Math.round(rawScore);
}

// 2. DEMO MODE: Generate Brief without OpenAI
function demoBrief(challengeTitle, kpis, evidenceStrength, scaleScore) {
  const achieved = kpis.filter(k => k.status === 'achieved').length;
  const total = kpis.length;
  
  let recommendation = "EXTEND PILOT";
  let reasoning = "";
  
  if (scaleScore >= 80) {
    recommendation = "PROCEED TO PROCUREMENT REVIEW";
    reasoning = `The pilot successfully achieved ${achieved}/${total} KPIs with ${evidenceStrength} evidence backing. The solution demonstrates high scale readiness.`;
  } else if (scaleScore >= 50) {
    recommendation = "EXTEND PILOT WITH MODIFICATIONS";
    reasoning = `The pilot achieved ${achieved}/${total} KPIs. While promising, the ${evidenceStrength} evidence suggests more validation is needed before full procurement.`;
  } else {
    recommendation = "STOP / REJECT";
    reasoning = `The pilot only achieved ${achieved}/${total} KPIs with ${evidenceStrength} evidence. The solution is not yet ready for scale.`;
  }

  return {
    scale_readiness_score: scaleScore,
    recommendation,
    executive_summary: `Based on the pilot data for "${challengeTitle}", the AI Copilot recommends to ${recommendation.toLowerCase()}. ${reasoning} This is an advisory output; the final decision rests with the government officer.`,
    risk_flags: evidenceStrength === 'weak' ? ["Evidence package is weak. Independent verification required before any financial commitment."] : [],
    next_steps: recommendation.includes("PROCEED") 
      ? ["Initiate GeM/procurement hand-off", "Draft contract based on pilot SLA", "Publish public impact summary"]
      : ["Address missing evidence gaps", "Redefine KPIs for next pilot phase", "Request independent third-party audit"]
  };
}

// 3. MAIN FUNCTION
async function generateDecisionBrief(challengeTitle, kpis, evidenceStrength) {
  const scaleScore = calculateScaleScore(kpis, evidenceStrength);
  
  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE: generating decision brief...");
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a Decision Copilot for a government procurement officer. You will receive a challenge title, pilot KPI results, and evidence strength. The Scale Readiness Score is ALREADY calculated as ${scaleScore}/100. Return ONLY valid JSON: { "scale_readiness_score": number, "recommendation": "PROCEED TO PROCUREMENT REVIEW" | "EXTEND PILOT WITH MODIFICATIONS" | "STOP / REJECT", "executive_summary": string, "risk_flags": [], "next_steps": [] }. Rules: Be conservative. If score < 50, recommend STOP. If 50-79, recommend EXTEND. If 80+, recommend PROCEED. Always state that the officer makes the final decision.`
          },
          { role: "user", content: JSON.stringify({ challengeTitle, kpis, evidenceStrength }) }
        ]
      });
      return { mode: "live", brief: JSON.parse(response.choices[0].message.content) };
    } catch (err) {
      console.error(" OpenAI brief failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️ DEMO MODE: template decision brief");
  }

  await new Promise((r) => setTimeout(r, 1200));
  return { mode: "demo", brief: demoBrief(challengeTitle, kpis, evidenceStrength) };
}

module.exports = { generateDecisionBrief };