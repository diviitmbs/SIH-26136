// backend/src/ai/analyzer.js

// AI Feature 3: Startup Document Analyzer
// Live mode: Gemini extracts facts. Demo mode: rule-based extraction.

const { GoogleGenerativeAI } = require("@google/generative-ai");

const TECH_LIST = [
  "react",
  "node.js",
  "node",
  "python",
  "django",
  "flutter",
  "android",
  "ios",
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "postgresql",
  "mysql",
  "mongodb",
  "iot",
  "sensors",
  "computer vision",
  "machine learning",
  "blockchain",
  "redis",
  "kafka"
];

const GOV_WORDS = [
  "government",
  "municipal",
  "ministry",
  "corporation",
  "panchayat",
  "smart city",
  "public",
  "department",
  "citizen"
];

function guessDocType(lower) {
  if (lower.includes("case study")) return "Case Study";
  if (lower.includes("pitch")) return "Pitch Deck Text";
  if (lower.includes("report")) return "Deployment Report";
  if (lower.includes("profile")) return "Company Profile";

  return "Startup Document";
}

function demoAnalyze(text) {
  const lower = text.toLowerCase();

  const metrics =
    (text.match(/\d+(\.\d+)?\s*(%|percent|x)/gi) || [])
      .slice(0, 6);

  const years =
    [...new Set(text.match(/20\d\d/g) || [])]
      .slice(0, 6);

  const tech =
    TECH_LIST.filter(t => lower.includes(t));

  const gov =
    GOV_WORDS.filter(w => lower.includes(w));

  const deployments = [];

  const depMatches =
    text.match(
      /[^.!?]*(deployed|pilot|implemented|rolled out)[^.!?]*[.!?]/gi
    ) || [];

  depMatches
    .slice(0, 3)
    .forEach(s => deployments.push(s.trim()));

  const gaps = [];

  if (
    !lower.includes("security") &&
    !lower.includes("privacy")
  ) {
    gaps.push(
      "No mention of data security or privacy measures."
    );
  }

  if (metrics.length === 0) {
    gaps.push(
      "No measurable outcomes (numbers/percentages) mentioned."
    );
  }

  if (gov.length === 0) {
    gaps.push(
      "No prior government/public-sector experience mentioned."
    );
  }

  if (!lower.includes("scal")) {
    gaps.push(
      "No mention of a scalability plan."
    );
  }

  if (gaps.length === 0) {
    gaps.push(
      "No obvious gaps detected in this text (manual verification still recommended)."
    );
  }

  return {
    document_type: guessDocType(lower),

    domain_experience: gov.length
      ? "Public-sector related experience detected (" +
        gov.slice(0, 3).join(", ") +
        ")."
      : "No clear public-sector experience detected.",

    relevant_deployments:
      deployments.length
        ? deployments
        : ["No specific deployment sentences detected."],

    technology_stack:
      tech.length
        ? tech
        : ["No common technologies detected."],

    claimed_metrics:
      metrics.length
        ? metrics
        : ["No quantitative metrics mentioned."],

    timeline_years:
      years.length
        ? years
        : ["—"],

    potential_gaps: gaps,

    verification_note:
      "AI extraction only - officer must verify originals before evaluation."
  };
}


async function analyzeDocument(text) {

  const apiKey =
    process.env.GEMINI_API_KEY;

  const hasKey =
    apiKey &&
    apiKey !== "paste_your_key_here" &&
    apiKey.trim() !== "";

  if (hasKey) {

    try {

      console.log(
        "🤖 LIVE GEMINI MODE: analyzing document..."
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


      const prompt = `You are an assistant to a government evaluation officer.

Extract facts ONLY from the provided startup document text.

Return ONLY valid JSON.

The JSON must contain exactly these fields:

{
  "document_type": string,
  "domain_experience": string,
  "relevant_deployments": [],
  "technology_stack": [],
  "claimed_metrics": [],
  "timeline_years": [],
  "potential_gaps": [],
  "verification_note": string
}

Rules:

1. NEVER invent facts.
2. Use only information explicitly supported by the document.
3. If a field has no evidence in the document, write "Not mentioned in document".
4. relevant_deployments must contain only deployments, pilots, implementations, or rollouts actually mentioned.
5. technology_stack must contain only technologies explicitly mentioned.
6. claimed_metrics must contain only quantitative claims explicitly present.
7. timeline_years must contain only years explicitly present.
8. potential_gaps should identify information that is missing or unclear from the document.
9. verification_note must clearly state that extracted claims require officer verification.

STARTUP DOCUMENT:

${text}`;


      const result =
        await model.generateContent(prompt);


      const response =
        result.response;


      const rawText =
        response.text();


      const parsed =
        JSON.parse(rawText);


      console.log(
        "✅ Gemini document analysis completed."
      );


      return {
        mode: "live",
        analysis:
          parsed.analysis || parsed
      };


    } catch (err) {

      console.error(
        "❌ Gemini analyze failed, falling back to demo:",
        err.message
      );

    }

  } else {

    console.log(
      "ℹ️ DEMO MODE: rule-based document analysis"
    );

  }


  await new Promise(
    r => setTimeout(r, 1200)
  );


  return {
    mode: "demo",
    analysis:
      demoAnalyze(text)
  };

}


module.exports = {
  analyzeDocument
};