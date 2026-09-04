// backend/src/ai/pilot.js
// AI Feature 5: Pilot Result Analyst
// Math is always computed in code (accurate).
// Prose by Gemini if key exists, else templates.

const { GoogleGenerativeAI } = require("@google/generative-ai");


function computeKpis(kpis) {

  return kpis.map((k) => {

    const b = Number(k.baseline) || 0;
    const t = Number(k.target) || 0;
    const a = Number(k.actual) || 0;

    const lower = k.direction !== "higher";

    let status;
    let improvement;

    if (lower) {

      improvement =
        b !== 0
          ? ((b - a) / b) * 100
          : 0;

      status =
        a <= t
          ? "achieved"
          : a <= t * 1.1
            ? "partially_achieved"
            : "not_achieved";

    } else {

      improvement =
        b !== 0
          ? ((a - b) / b) * 100
          : 0;

      status =
        a >= t
          ? "achieved"
          : a >= t * 0.9
            ? "partially_achieved"
            : "not_achieved";

    }


    return {

      name: k.name,

      baseline: b,

      target: t,

      actual: a,

      direction:
        lower
          ? "lower_is_better"
          : "higher_is_better",

      improvement_pct:
        Math.round(improvement * 10) / 10,

      status

    };

  });

}


function demoSummary(results) {

  const achieved =
    results.filter(
      r => r.status === "achieved"
    ).length;

  const partial =
    results.filter(
      r => r.status === "partially_achieved"
    ).length;

  const not =
    results.filter(
      r => r.status === "not_achieved"
    ).length;


  const sorted =
    [...results].sort(
      (a, b) =>
        b.improvement_pct -
        a.improvement_pct
    );


  const best = sorted[0];

  const worst =
    sorted[sorted.length - 1];


  if (!results.length) {

    return (
      "No KPI results were provided. " +
      "Measurement support only - the final pilot verdict is taken by the government officer in the SCALE stage, supported by evidence."
    );

  }


  return (
    achieved +
    " of " +
    results.length +
    " KPIs fully achieved, " +
    partial +
    " partially achieved, " +
    not +
    " not achieved. " +

    "Strongest improvement vs baseline: " +
    best.name +
    " (" +
    best.improvement_pct +
    "%). " +

    "Smallest improvement vs baseline: " +
    worst.name +
    " (" +
    worst.improvement_pct +
    "%). " +

    "Measurement support only - the final pilot verdict is taken by the government officer in the SCALE stage, supported by evidence."
  );

}


async function analyzePilot(kpis) {

  // IMPORTANT:
  // All KPI calculations happen here in code.
  // Gemini must NOT modify these numbers.

  const results =
    computeKpis(kpis);


  const apiKey =
    process.env.GEMINI_API_KEY;


  const hasKey =
    apiKey &&
    apiKey !== "paste_your_key_here" &&
    apiKey.trim() !== "";


  if (hasKey) {

    try {

      console.log(
        "🤖 LIVE GEMINI MODE: writing pilot narrative..."
      );


      const gemini =
        new GoogleGenerativeAI(apiKey);


      const model =
        gemini.getGenerativeModel({

          model:
            process.env.GEMINI_MODEL ||
            "gemini-3.6-flash",

          generationConfig: {

            temperature: 0.3,

            responseMimeType:
              "application/json"

          }

        });


      const prompt = `You are a pilot analyst assistant for a government officer.

You will receive PRE-COMPUTED KPI results.

The KPI values, improvement percentages, directions, and statuses have already been calculated accurately by software.

DO NOT recalculate, modify, reinterpret, or replace any of these values.

Return ONLY valid JSON in exactly this structure:

{
  "overall_summary": "string",
  "kpi_comments": [
    {
      "name": "KPI name",
      "comment": "short evidence-based comment"
    }
  ]
}

Rules:

1. Base every statement ONLY on the KPI numbers provided.
2. NEVER invent external facts.
3. NEVER change baseline, target, actual, improvement_pct, direction, or status.
4. Explain what the provided numbers indicate.
5. Mention achieved, partially achieved, or not achieved status where relevant.
6. Do not claim causes for performance unless those causes are explicitly provided.
7. Do not invent pilot outcomes, users, savings, deployments, or operational impacts.
8. Provide comments for the supplied KPIs.
9. Keep the overall summary balanced and factual.
10. This is measurement support only.
11. The government officer makes the final pilot verdict.
12. If information is missing, say that it is not provided instead of guessing.

PRE-COMPUTED KPI RESULTS:

${JSON.stringify(results, null, 2)}
`;


      const result =
        await model.generateContent(prompt);


      const response =
        result.response;


      const rawText =
        response.text();


      const parsed =
        JSON.parse(rawText);


      const comments = {};


      (parsed.kpi_comments || [])
        .forEach((c) => {

          if (c && c.name) {

            comments[c.name] =
              c.comment || "";

          }

        });


      results.forEach((r) => {

        r.comment =
          comments[r.name] || "";

      });


      console.log(
        "✅ Gemini pilot narrative completed."
      );


      return {

        mode: "live",

        kpi_results: results,

        overall_summary:
          parsed.overall_summary ||
          demoSummary(results)

      };


    } catch (err) {

      console.error(
        "❌ Gemini pilot narrative failed, falling back to demo:",
        err.message
      );

    }

  } else {

    console.log(
      "ℹ️ DEMO MODE: template pilot narrative"
    );

  }


  await new Promise(
    (r) => setTimeout(r, 1200)
  );


  return {

    mode: "demo",

    kpi_results: results,

    overall_summary:
      demoSummary(results)

  };

}


module.exports = {
  analyzePilot
};