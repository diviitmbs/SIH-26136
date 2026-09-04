// backend/src/ai/analyzer.js
// AI Feature 3: Startup Document Analyzer
// Live mode: OpenAI extracts facts. Demo mode: rule-based extraction.

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

const TECH_LIST = ["react", "node.js", "node", "python", "django", "flutter", "android", "ios", "aws", "azure", "docker", "kubernetes", "postgresql", "mysql", "mongodb", "iot", "sensors", "computer vision", "machine learning", "blockchain", "redis", "kafka"];
const GOV_WORDS = ["government", "municipal", "ministry", "corporation", "panchayat", "smart city", "public", "department", "citizen"];

function guessDocType(lower) {
  if (lower.includes("case study")) return "Case Study";
  if (lower.includes("pitch")) return "Pitch Deck Text";
  if (lower.includes("report")) return "Deployment Report";
  if (lower.includes("profile")) return "Company Profile";
  return "Startup Document";
}

function demoAnalyze(text) {
  const lower = text.toLowerCase();

  const metrics = (text.match(/\d+(\.\d+)?\s*(%|percent|x)/gi) || []).slice(0, 6);
  const years = [...new Set((text.match(/20\d\d/g) || []))].slice(0, 6);
  const tech = TECH_LIST.filter(t => lower.includes(t));
  const gov = GOV_WORDS.filter(w => lower.includes(w));

  const deployments = [];
  const depMatches = text.match(/[^.!?]*(deployed|pilot|implemented|rolled out)[^.!?]*[.!?]/gi) || [];
  depMatches.slice(0, 3).forEach(s => deployments.push(s.trim()));

  const gaps = [];
  if (!lower.includes("security") && !lower.includes("privacy")) gaps.push("No mention of data security or privacy measures.");
  if (metrics.length === 0) gaps.push("No measurable outcomes (numbers/percentages) mentioned.");
  if (gov.length === 0) gaps.push("No prior government/public-sector experience mentioned.");
  if (!lower.includes("scal")) gaps.push("No mention of a scalability plan.");
  if (gaps.length === 0) gaps.push("No obvious gaps detected in this text (manual verification still recommended).");

  return {
    document_type: guessDocType(lower),
    domain_experience: gov.length
      ? "Public-sector related experience detected (" + gov.slice(0, 3).join(", ") + ")."
      : "No clear public-sector experience detected.",
    relevant_deployments: deployments.length ? deployments : ["No specific deployment sentences detected."],
    technology_stack: tech.length ? tech : ["No common technologies detected."],
    claimed_metrics: metrics.length ? metrics : ["No quantitative metrics mentioned."],
    timeline_years: years.length ? years : ["—"],
    potential_gaps: gaps,
    verification_note: "AI extraction only - officer must verify originals before evaluation."
  };
}

async function analyzeDocument(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE: analyzing document...");
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: 'You are an assistant to a government evaluation officer. Extract facts ONLY from the provided startup document text. Return ONLY valid JSON with fields: document_type, domain_experience, relevant_deployments (array), technology_stack (array), claimed_metrics (array), timeline_years (array), potential_gaps (array), verification_note. NEVER invent facts. If a field has no evidence in the text, write "Not mentioned in document".'
          },
          { role: "user", content: text }
        ]
      });
      const parsed = JSON.parse(response.choices[0].message.content);
      return { mode: "live", analysis: parsed.analysis || parsed };
    } catch (err) {
      console.error("❌ OpenAI analyze failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️ DEMO MODE: rule-based document analysis");
  }

  await new Promise((r) => setTimeout(r, 1200));
  return { mode: "demo", analysis: demoAnalyze(text) };
}

module.exports = { analyzeDocument };