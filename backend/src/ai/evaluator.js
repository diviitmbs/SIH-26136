// backend/src/ai/evaluator.js
// AI Feature 4: Evaluation Assistant
// Live mode: OpenAI writes balanced comparisons. Demo mode: rule-based.

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

function demoEvaluate(challenge, candidates) {
  const comparisons = candidates.map((c) => {
    const strengths = [];
    const concerns = [];
    const stats = c.stats || "";

    if (c.score >= 60) strengths.push("Strong capability overlap with the challenge (" + c.score + "/100 match).");
    else if (c.score >= 35) strengths.push("Moderate overlap with the challenge (" + c.score + "/100 match).");
    else concerns.push("Low demonstrated overlap with this challenge domain (" + c.score + "/100).");

    if (/DPIIT/i.test(stats)) strengths.push("DPIIT-recognized startup (as per registry).");

    const eff = stats.match(/Efficiency:\s*(\d+)/i);
    if (eff && Number(eff[1]) >= 85) strengths.push("High efficiency score in capability passport (" + eff[1] + "/100) - verify supporting evidence.");

    const pc = stats.match(/Projects:\s*(\d+)/i);
    if (pc) {
      if (Number(pc[1]) >= 3) strengths.push("Multiple completed projects reported (" + pc[1] + ").");
      if (Number(pc[1]) <= 1) concerns.push("Limited number of reported projects (" + pc[1] + ") - request references.");
    }

    if (!strengths.length) strengths.push("Registered startup with a capability passport on the platform.");
    if (!concerns.length) concerns.push("No red flags visible in the passport - still verify originals.");

    return {
      startup: c.startup,
      domain: c.domain || "",
      match_score: c.score,
      strengths,
      concerns,
      verification_checklist: [
        "Request original deployment certificates / work orders.",
        "Validate claimed metrics against pilot data (use the Document Analyzer).",
        "Confirm team capacity for a 2-3 month pilot.",
        "Check references from previous government clients, if any."
      ]
    };
  });

  const sorted = [...comparisons].sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  const gap = sorted.length > 1 ? sorted[0].match_score - sorted[1].match_score : 0;

  const overall_notes =
    "Based on capability passports, " + sorted[0].startup + " currently shows the strongest fit." +
    (gap >= 20
      ? " The gap to the next candidate is large (" + gap + " points)."
      : " The top candidates are close - compare their verification documents carefully.") +
    " This is decision support only; the final shortlisting decision rests with the government officer.";

  return { comparisons: sorted, overall_notes };
}

async function evaluateStartups(challenge, candidates) {
  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE: evaluating top startups...");
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: 'You are an evaluation assistant to a government officer. You will receive a challenge and candidate startup profiles with match scores. Return ONLY valid JSON: { "comparisons": [ { "startup": string, "domain": string, "match_score": number, "strengths": [], "concerns": [], "verification_checklist": [] } ], "overall_notes": string }. Rules: NEVER declare a final winner; give balanced strengths and concerns based ONLY on the provided data; never invent facts; always remind that the government officer makes the final decision.'
          },
          { role: "user", content: JSON.stringify({ challenge, candidates }) }
        ]
      });
      const parsed = JSON.parse(response.choices[0].message.content);
      return { mode: "live", comparisons: parsed.comparisons || [], overall_notes: parsed.overall_notes || "" };
    } catch (err) {
      console.error("❌ OpenAI evaluate failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️ DEMO MODE: rule-based evaluation");
  }

  await new Promise((r) => setTimeout(r, 1200));
  return { mode: "demo", ...demoEvaluate(challenge, candidates) };
}

module.exports = { evaluateStartups };