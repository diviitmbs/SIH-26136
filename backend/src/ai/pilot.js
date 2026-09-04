// backend/src/ai/pilot.js
// AI Feature 5: Pilot Result Analyst
// Math is always computed in code (accurate). Prose by OpenAI if key exists, else templates.

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

function computeKpis(kpis) {
  return kpis.map((k) => {
    const b = Number(k.baseline) || 0;
    const t = Number(k.target) || 0;
    const a = Number(k.actual) || 0;
    const lower = k.direction !== "higher";

    let status, improvement;
    if (lower) {
      improvement = b !== 0 ? ((b - a) / b) * 100 : 0;
      status = a <= t ? "achieved" : a <= t * 1.1 ? "partially_achieved" : "not_achieved";
    } else {
      improvement = b !== 0 ? ((a - b) / b) * 100 : 0;
      status = a >= t ? "achieved" : a >= t * 0.9 ? "partially_achieved" : "not_achieved";
    }

    return {
      name: k.name,
      baseline: b,
      target: t,
      actual: a,
      direction: lower ? "lower_is_better" : "higher_is_better",
      improvement_pct: Math.round(improvement * 10) / 10,
      status
    };
  });
}

function demoSummary(results) {
  const achieved = results.filter(r => r.status === "achieved").length;
  const partial = results.filter(r => r.status === "partially_achieved").length;
  const not = results.filter(r => r.status === "not_achieved").length;
  const sorted = [...results].sort((a, b) => b.improvement_pct - a.improvement_pct);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return achieved + " of " + results.length + " KPIs fully achieved, " + partial +
    " partially achieved, " + not + " not achieved. " +
    "Strongest improvement vs baseline: " + best.name + " (" + best.improvement_pct + "%). " +
    "Smallest improvement vs baseline: " + worst.name + " (" + worst.improvement_pct + "%). " +
    "Measurement support only - the final pilot verdict is taken by the government officer in the SCALE stage, supported by evidence.";
}

async function analyzePilot(kpis) {
  const results = computeKpis(kpis);

  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE: writing pilot narrative...");
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: 'You are a pilot analyst assistant for a government officer. You will receive pre-computed KPI results (statuses and improvement percentages are ALREADY calculated - do not change them). Return ONLY valid JSON: { "overall_summary": string, "kpi_comments": [ { "name": string, "comment": string } ] }. Base every statement ONLY on the numbers provided. Never invent external facts. Remind that the officer decides the final verdict.'
          },
          { role: "user", content: JSON.stringify(results) }
        ]
      });
      const parsed = JSON.parse(response.choices[0].message.content);
      const comments = {};
      (parsed.kpi_comments || []).forEach(c => { comments[c.name] = c.comment; });
      results.forEach(r => { r.comment = comments[r.name] || ""; });
      return { mode: "live", kpi_results: results, overall_summary: parsed.overall_summary || demoSummary(results) };
    } catch (err) {
      console.error("❌ OpenAI pilot narrative failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️ DEMO MODE: template pilot narrative");
  }

  await new Promise((r) => setTimeout(r, 1200));
  return { mode: "demo", kpi_results: results, overall_summary: demoSummary(results) };
}

module.exports = { analyzePilot };