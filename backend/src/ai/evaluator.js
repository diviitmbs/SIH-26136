// backend/src/ai/evaluator.js
// AI Feature 4: Evaluation Assistant
// Live mode: Gemini writes balanced comparisons. Demo mode: rule-based.

const { GoogleGenerativeAI } = require("@google/generative-ai");


function demoEvaluate(challenge, candidates) {

  const comparisons = candidates.map((c) => {

    const strengths = [];
    const concerns = [];
    const stats = c.stats || "";

    if (c.score >= 60) {
      strengths.push(
        "Strong capability overlap with the challenge (" +
        c.score +
        "/100 match)."
      );

    } else if (c.score >= 35) {

      strengths.push(
        "Moderate overlap with the challenge (" +
        c.score +
        "/100 match)."
      );

    } else {

      concerns.push(
        "Low demonstrated overlap with this challenge domain (" +
        c.score +
        "/100)."
      );

    }


    if (/DPIIT/i.test(stats)) {

      strengths.push(
        "DPIIT-recognized startup (as per registry)."
      );

    }


    const eff =
      stats.match(/Efficiency:\s*(\d+)/i);

    if (
      eff &&
      Number(eff[1]) >= 85
    ) {

      strengths.push(
        "High efficiency score in capability passport (" +
        eff[1] +
        "/100) - verify supporting evidence."
      );

    }


    const pc =
      stats.match(/Projects:\s*(\d+)/i);

    if (pc) {

      if (Number(pc[1]) >= 3) {

        strengths.push(
          "Multiple completed projects reported (" +
          pc[1] +
          ")."
        );

      }

      if (Number(pc[1]) <= 1) {

        concerns.push(
          "Limited number of reported projects (" +
          pc[1] +
          ") - request references."
        );

      }

    }


    if (!strengths.length) {

      strengths.push(
        "Registered startup with a capability passport on the platform."
      );

    }


    if (!concerns.length) {

      concerns.push(
        "No red flags visible in the passport - still verify originals."
      );

    }


    return {

      startup:
        c.startup,

      domain:
        c.domain || "",

      match_score:
        c.score,

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


  const sorted =
    [...comparisons].sort(
      (a, b) =>
        (b.match_score || 0) -
        (a.match_score || 0)
    );


  const gap =
    sorted.length > 1
      ? sorted[0].match_score -
        sorted[1].match_score
      : 0;


  const overall_notes =
    sorted.length
      ? "Based on capability passports, " +
        sorted[0].startup +
        " currently shows the strongest fit." +
        (gap >= 20
          ? " The gap to the next candidate is large (" +
            gap +
            " points)."
          : " The top candidates are close - compare their verification documents carefully.") +
        " This is decision support only; the final shortlisting decision rests with the government officer."
      : "No candidate startups were provided for evaluation.";


  return {
    comparisons: sorted,
    overall_notes
  };

}


async function evaluateStartups(
  challenge,
  candidates
) {

  const apiKey =
    process.env.GEMINI_API_KEY;


  const hasKey =
    apiKey &&
    apiKey !== "paste_your_key_here" &&
    apiKey.trim() !== "";


  if (hasKey) {

    try {

      console.log(
        "🤖 LIVE GEMINI MODE: evaluating top startups..."
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


      const prompt = `You are an evaluation assistant to a government officer.

You will receive:

1. A government challenge.
2. Candidate startup profiles with match scores.

Return ONLY valid JSON in exactly this structure:

{
  "comparisons": [
    {
      "startup": "startup name",
      "domain": "startup domain",
      "match_score": 0,
      "strengths": [],
      "concerns": [],
      "verification_checklist": []
    }
  ],
  "overall_notes": "balanced overall assessment"
}

Rules:

1. NEVER declare a final winner.
2. Give balanced strengths and concerns.
3. Use ONLY information provided in the challenge and candidate profiles.
4. NEVER invent deployments, clients, technologies, certifications, metrics, funding, government experience, or other facts.
5. Preserve the provided match score unless there is explicit evidence that it should be interpreted differently.
6. Include all provided candidates in the comparisons array.
7. Sort comparisons by match_score from highest to lowest.
8. verification_checklist should contain practical items the government officer should verify.
9. Always make clear that the government officer makes the final decision.
10. Do not make procurement decisions on behalf of the government.
11. If information is missing, explicitly say that it is not provided rather than guessing.

GOVERNMENT CHALLENGE:

${JSON.stringify(challenge, null, 2)}

CANDIDATE STARTUPS:

${JSON.stringify(candidates, null, 2)}
`;


      const result =
        await model.generateContent(prompt);


      const response =
        result.response;


      const rawText =
        response.text();


      const parsed =
        JSON.parse(rawText);


      console.log(
        "✅ Gemini evaluation completed."
      );


      return {

        mode: "live",

        comparisons:
          parsed.comparisons || [],

        overall_notes:
          parsed.overall_notes || ""

      };


    } catch (err) {

      console.error(
        "❌ Gemini evaluate failed, falling back to demo:",
        err.message
      );

    }

  } else {

    console.log(
      "ℹ️ DEMO MODE: rule-based evaluation"
    );

  }


  await new Promise(
    (r) => setTimeout(r, 1200)
  );


  return {

    mode: "demo",

    ...demoEvaluate(
      challenge,
      candidates
    )

  };

}


module.exports = {
  evaluateStartups
};