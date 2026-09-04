// backend/src/ai/matcher.js
// AI Feature 2: Startup Matcher
// Reads startup capability passports from Supabase when available,
// falls back to built-in sample profiles otherwise.
// Live mode (OpenAI key): real AI ranks. Demo mode: keyword scoring.

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

let pg = null;
try { pg = require("pg"); } catch (e) { pg = null; }

// Fallback sample profiles (used only if the database is unreachable)
const FALLBACK_STARTUPS = [
  { name: "QueueCare Technologies", domain: "HealthTech", description: "Digital token and hospital queue management systems.", tags: ["hospital", "patient", "queue", "waiting", "token", "health"] },
  { name: "MedFlow Analytics", domain: "HealthTech / Data", description: "Predictive analytics for patient rush hours.", tags: ["hospital", "analytics", "patient", "staff", "waiting", "health"] },
  { name: "WasteWise Systems", domain: "CivicTech / Waste", description: "IoT bin monitoring and smart route planning.", tags: ["garbage", "waste", "collection", "route", "municipal", "iot", "sensors"] },
  { name: "FinServe Digital", domain: "FinTech", description: "Digital payment gateway solutions.", tags: ["fintech", "payments", "banking"] },
  { name: "AgriSense", domain: "AgriTech", description: "IoT soil and crop monitoring.", tags: ["agriculture", "iot", "sensors", "crops", "farmers"] },
  { name: "UrbanIQ", domain: "Smart City", description: "City dashboards and IoT traffic monitoring.", tags: ["traffic", "congestion", "junction", "signal", "iot", "sensors"] }
];

// Civic synonyms so keyword scoring "understands" government topics
const TOPIC_EXPANSIONS = [
  { detect: ["hospital", "health", "patient", "doctor", "clinic", "waiting"], add: ["hospital", "patient", "health", "analytics", "automation", "queue"] },
  { detect: ["garbage", "waste", "trash", "collection", "cleaning", "solid"], add: ["logistics", "route", "tracking", "iot", "sensors", "municipal", "automation", "analytics"] },
  { detect: ["traffic", "transport", "road", "congestion", "signal", "parking"], add: ["iot", "sensors", "analytics", "automation", "tracking", "vision"] }
];

const STOPWORDS = ["the", "and", "for", "with", "that", "this", "space", "solutions", "innovative", "focusing", "efficiency", "recognized", "from", "are", "our", "your"];

function buildTags(row) {
  const raw = [
    row.industry || "",
    row.summary || "",
    ...(row.coreCapabilities || []),
    ...(row.techStack || []),
    ...(row.certifications || [])
  ].join(" ").toLowerCase();
  const words = raw.split(/[^a-z0-9.#+]+/).filter(w => w.length >= 4 && !STOPWORDS.includes(w));
  return [...new Set(words)];
}

// READ-ONLY database access. Never writes anything.
async function loadStartupsFromDB() {
  if (!pg) return null;
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  const pool = new pg.Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    const res = await pool.query(`
      SELECT s.name, s.city, s.industry, s."foundedYear", s."dpiitRecognized",
             p.summary, p."coreCapabilities", p."techStack", p.certifications,
             p."projectCount", p."efficiencyScore"
      FROM "Startup" s
      LEFT JOIN "CapabilityPassport" p ON p."startupId" = s.id
      ORDER BY s."createdAt"
      LIMIT 50
    `);
    if (!res.rows.length) return null;
    console.log("🗄️ Loaded " + res.rows.length + " startups from Supabase");
    return res.rows.map(r => ({
      name: r.name,
      domain: (r.industry || "General") + (r.city ? " · " + r.city : ""),
      description: r.summary || "",
      dpiit: !!r.dpiitRecognized,
      projectCount: r.projectCount,
      efficiencyScore: r.efficiencyScore,
      tags: buildTags(r)
    }));
  } catch (err) {
    console.error("⚠️ DB read failed, using built-in samples:", err.message);
    return null;
  } finally {
    pool.end().catch(() => {});
  }
}

function demoMatch(challenge, startups) {
  const base = JSON.stringify(challenge).toLowerCase();
  const expanded = [];
  for (const t of TOPIC_EXPANSIONS) {
    if (t.detect.some(k => base.includes(k))) expanded.push(...t.add);
  }
  const haystack = base + " " + expanded.join(" ");

  const results = startups.map(s => {
    const matched = s.tags.filter(t => haystack.includes(t));
    let score = 15 + matched.length * 8 + Math.round((s.efficiencyScore || 0) / 10);
    score = Math.min(95, score);
    return {
      startup: s.name,
      domain: s.domain,
      score,
      reason: matched.length
        ? "Capability passport overlaps on: " + matched.slice(0, 6).join(", ") + "."
        : "No clear overlap with this challenge.",
      stats: "Projects: " + (s.projectCount ?? "–") + " · Efficiency: " + (s.efficiencyScore ?? "–") + (s.dpiit ? " · DPIIT recognized" : ""),
      note: "Recommendation only - final shortlisting is done by the government officer."
    };
  });
  return results.sort((a, b) => b.score - a.score);
}

async function matchStartups(challenge) {
  let startups = await loadStartupsFromDB();
  const source = startups ? "supabase" : "builtin";
  if (!startups) startups = FALLBACK_STARTUPS;

  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE: matching startups...");
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: 'You are an assistant helping a government officer discover suitable startups for a public challenge. You will receive a challenge and a list of startup profiles. Return ONLY valid JSON: { "matches": [ { "startup": name, "domain": domain, "score": 0-100, "reason": string } ] } sorted by score descending. Rules: base scores ONLY on the provided profiles; never invent deployments, certifications or experience; you only recommend, the government makes the final decision.'
          },
          { role: "user", content: JSON.stringify({ challenge, startups }) }
        ]
      });
      const parsed = JSON.parse(response.choices[0].message.content);
      return { mode: "live", source, matches: parsed.matches || [] };
    } catch (err) {
      console.error("❌ OpenAI match failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️ DEMO MODE: keyword matching on " + (source === "supabase" ? "Supabase data" : "built-in samples"));
  }

  await new Promise((r) => setTimeout(r, 1200));
  return { mode: "demo", source, matches: demoMatch(challenge, startups) };
}

module.exports = { matchStartups, STARTUPS: FALLBACK_STARTUPS };