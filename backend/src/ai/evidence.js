// backend/src/ai/evidence.js
// AI Feature 6: Evidence Summarizer
// Live mode: Gemini assesses conservatively.
// Demo mode: rule-based strength rules.

const { GoogleGenerativeAI } = require("@google/generative-ai");

const gemini = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const EVIDENCE_RULES = {
  "Pilot completion report (submitted by startup)": {
    strength: "medium",
    note: "Self-reported by the startup - useful but should be cross-checked."
  },

  "Raw operational data (system/hospital exports)": {
    strength: "strong",
    note: "Primary operational data is strong evidence if the source system is trusted."
  },

  "User / citizen feedback survey": {
    strength: "medium",
    note: "Shows user experience; check sample size and methodology."
  },

  "Independent third-party verification note": {
    strength: "strong",
    note: "Independent verification significantly strengthens the claim."
  },

  "Field photos / system logs / screenshots": {
    strength: "weak",
    note: "Supporting material only - easy to stage; use as corroboration."
  }
};

function demoEvidence(items, excerpt) {
  const results = items.map((t) => {
    const r = EVIDENCE_RULES[t] || {
      strength: "medium",
      note: ""
    };

    return {
      type: t,
      strength: r.strength,
      note: r.note
    };
  });

  const hasIndependent = items.some((i) => /independent/i.test(i));
  const hasRaw = items.some((i) => /raw operational/i.test(i));

  const excerptNotes = [];

  if (excerpt) {
    if (/\d+(\.\d+)?\s*(%|percent)/i.test(excerpt)) {
      excerptNotes.push(
        "The excerpt contains quantitative figures - good for cross-checking KPIs."
      );
    }

    if (/20\d\d/.test(excerpt)) {
      excerptNotes.push(
        "The excerpt mentions dates - helpful for timeline verification."
      );
    }

    if (/verified|independent|audit/i.test(excerpt)) {
      excerptNotes.push(
        "The excerpt claims verification - confirm who performed it."
      );
    }

    if (!excerptNotes.length) {
      excerptNotes.push(
        "The excerpt is qualitative - pair it with numerical data where possible."
      );
    }
  }

  const gaps = [];

  if (!items.length) {
    gaps.push("No evidence items selected.");
  }

  if (!hasIndependent) {
    gaps.push("No independent third-party verification in the package.");
  }

  if (!hasRaw) {
    gaps.push("No raw operational data provided.");
  }

  let overall;

  if (hasIndependent && hasRaw) {
    overall =
      "Strong evidence package: combines primary operational data with independent verification. Suitable for the SCALE decision review.";
  } else if (hasIndependent || hasRaw) {
    overall =
      "Moderately strong evidence package, but one pillar (independence or raw data) is missing. Consider requesting the missing item before the scale-up decision.";
  } else {
    overall =
      "Currently weak evidence (mostly self-reported). Recommend independent verification before any scale-up decision.";
  }

  return {
    items: results,
    excerpt_notes: excerptNotes,
    gaps,
    overall_assessment:
      overall +
      " Final acceptance of evidence rests with the government officer."
  };
}

async function summarizeEvidence(items, excerpt) {
  const apiKey = process.env.GEMINI_API_KEY;

  const hasKey =
    apiKey &&
    apiKey !== "paste_your_key_here" &&
    apiKey.trim() !== "";

  if (hasKey && gemini) {
    try {
      console.log("🤖 LIVE GEMINI MODE: assessing evidence package...");

      const model = gemini.getGenerativeModel({
        model: "gemini-3.6-flash"
      });

      const prompt = `
You are an evidence assessment assistant for a government officer.

You will receive:
1. A list of submitted evidence items.
2. An optional excerpt from the evidence.

Assess the evidence conservatively.

Return ONLY valid JSON in exactly this structure:

{
  "items": [
    {
      "type": "evidence item",
      "strength": "strong",
      "note": "assessment of this evidence"
    }
  ],
  "excerpt_notes": [
    "observation about the excerpt"
  ],
  "gaps": [
    "missing evidence or verification"
  ],
  "overall_assessment": "overall conservative assessment"
}

Rules:
- Assess ONLY the evidence items and excerpt provided.
- NEVER invent documents, data, certifications, audits, or verification.
- Self-reported evidence should generally be treated as medium or weak.
- Raw operational data can be strong evidence when the source system is trusted.
- Independent third-party verification can be strong evidence.
- Field photos, screenshots, and similar materials should generally be treated as supporting evidence rather than definitive proof.
- Identify important evidence gaps.
- Do not claim something is independently verified unless the provided information explicitly supports that.
- Be conservative when assessing evidence.
- Mention that final acceptance of evidence rests with the government officer.
- Return ONLY JSON. No Markdown. No explanation outside JSON.

Evidence items:
${JSON.stringify(items)}

Excerpt:
${JSON.stringify(excerpt || "")}
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const clean = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(clean);

      console.log("✅ Gemini evidence assessment completed.");

      return {
        mode: "live",
        items: parsed.items || [],
        excerpt_notes: parsed.excerpt_notes || [],
        gaps: parsed.gaps || [],
        overall_assessment: parsed.overall_assessment || ""
      };
    } catch (err) {
      console.error(
        "❌ Gemini evidence assessment failed, falling back to demo:",
        err.message
      );
    }
  } else {
    console.log("ℹ️ DEMO MODE: rule-based evidence assessment");
  }

  await new Promise((r) => setTimeout(r, 1200));

  return {
    mode: "demo",
    ...demoEvidence(items, excerpt)
  };
}

module.exports = { summarizeEvidence };