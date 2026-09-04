// backend/src/ai/copilot.js
// AI Feature 7: Decision Copilot (The SCALE Stage)
// Generates a Procurement-Readiness Brief and Scale Readiness Score.
// Golden Rule: Math is computed in code (transparent).
// Prose is written by Gemini (or fallback).

const { GoogleGenerativeAI } = require("@google/generative-ai");


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