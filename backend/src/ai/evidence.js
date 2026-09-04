// backend/src/ai/evidence.js
// AI Feature 6: Evidence Summarizer
// Live mode: OpenAI assesses conservatively. Demo mode: rule-based strength rules.

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

const EVIDENCE_RULES = {
  "Pilot completion report (submitted by startup)": { strength: "medium", note: "Self-reported by the startup - useful but should be cross-checked." },
  "Raw operational data (system/hospital exports)": { strength: "strong", note: "Primary operational data is strong evidence if the source system is trusted." },
  "User / citizen feedback survey": { strength: "medium", note: "Shows user experience; check sample size and methodology." },
  "Independent third-party verification note": { strength: "strong", note: "Independent verification significantly strengthens the claim." },
  "Field photos / system logs / screenshots": { strength: "weak", note: "Supporting material only - easy to stage; use as corroboration." }
};

function demoEvidence(items, excerpt) {
  const results = items.map(t => {
    const r = EVIDENCE_RULES[t] || { strength: "medium", note: "" };
    return { type: t, strength: r.strength, note: r.note };
  });

  const hasIndependent = items.some(i => /independent/i.test(i));
  const hasRaw = items.some(i => /raw operational/i.test(i));

  const excerptNotes = [];
  if (excerpt) {
    if (/\d+(\.\d+)?\s*(%|percent)/i.test(excerpt)) excerptNotes.push("The excerpt contains quantitative figures - good for cross-checking KPIs.");
    if (/20\d\d/.test(excerpt)) excerptNotes.push("The excerpt mentions dates - helpful for timeline verification.");
    if (/verified|independent|audit/i.test(excerpt)) excerptNotes.push("The excerpt claims verification - confirm who performed it.");
    if (!excerptNotes.length) excerptNotes.push("The excerpt is qualitative - pair it with numerical data where possible.");
  }

  const gaps = [];
  if (!items.length) gaps.push("No evidence items selected.");
  if (!hasIndependent) gaps.push("No independent third-party verification in the package.");
  if (!hasRaw) gaps.push("No raw operational data provided.");

  let overall;
  if (hasIndependent && hasRaw) {
    overall = "Strong evidence package: combines primary operational data with independent verification. Suitable for the SCALE decision review.";
  } else if (hasIndependent || hasRaw) {
    overall = "Moderately strong evidence package, but one pillar (independence or raw data) is missing. Consider requesting the missing item before the scale-up decision.";
  } else {
    overall = "Currently weak evidence (mostly self-reported). Recommend independent verification before any scale-up decision.";
  }

  return {
    items: results,
    excerpt_notes: excerptNotes,
    gaps,
    overall_assessment: overall + " Final acceptance of evidence rests with the government officer."
  };
}

async function summarizeEvidence(items, excerpt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE: assessing evidence package...");
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: 'You are an evidence assessment assistant for a government officer. You will receive a list of submitted evidence items and an optional excerpt. Return ONLY valid JSON: { "items": [ { "type": string, "strength": "strong"|"medium"|"weak", "note": string } ], "excerpt_notes": [], "gaps": [], "overall_assessment": string }. Rules: assess ONLY the provided items; never invent documents; be conservative (self-reported = medium/weak, raw data or independent verification = strong); always remind that final acceptance rests with the government officer.'
          },
          { role: "user", content: JSON.stringify({ items, excerpt }) }
        ]
      });
      const parsed = JSON.parse(response.choices[0].message.content);
      return { mode: "live", items: parsed.items || [], excerpt_notes: parsed.excerpt_notes || [], gaps: parsed.gaps || [], overall_assessment: parsed.overall_assessment || "" };
    } catch (err) {
      console.error("❌ OpenAI evidence assessment failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️ DEMO MODE: rule-based evidence assessment");
  }

  await new Promise((r) => setTimeout(r, 1200));
  return { mode: "demo", ...demoEvidence(items, excerpt) };
}

module.exports = { summarizeEvidence };