// backend/src/ai/matcher.js
// AI Feature 2: Startup Matcher (Multi-Source Fusion)
// Reads 5 live Supabase sources, normalizes them, and merges duplicates.

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

let pg = null;
try { pg = require("pg"); } catch (e) { pg = null; }

const FALLBACK_STARTUPS = [
  { name: "QueueCare Technologies", domain: "HealthTech", description: "Digital token and hospital queue management systems.", tags: ["hospital", "patient", "queue", "waiting", "token", "health"] },
  { name: "MedFlow Analytics", domain: "HealthTech / Data", description: "Predictive analytics for patient rush hours.", tags: ["hospital", "analytics", "patient", "staff", "waiting", "health"] },
  { name: "WasteWise Systems", domain: "CivicTech / Waste", description: "IoT bin monitoring and smart route planning.", tags: ["garbage", "waste", "collection", "route", "municipal", "iot", "sensors"] },
  { name: "FinServe Digital", domain: "FinTech", description: "Digital payment gateway solutions.", tags: ["fintech", "payments", "banking"] },
  { name: "AgriSense", domain: "AgriTech", description: "IoT soil and crop monitoring.", tags: ["agriculture", "iot", "sensors", "crops", "farmers"] },
  { name: "UrbanIQ", domain: "Smart City", description: "City dashboards and IoT traffic monitoring.", tags: ["traffic", "congestion", "junction", "signal", "iot", "sensors"] }
];

const TOPIC_EXPANSIONS = [
  { detect: ["hospital", "health", "patient", "doctor", "clinic", "waiting"], add: ["hospital", "patient", "health", "analytics", "automation", "queue"] },
  { detect: ["garbage", "waste", "trash", "collection", "cleaning", "solid"], add: ["logistics", "route", "tracking", "iot", "sensors", "municipal", "automation", "analytics"] },
  { detect: ["traffic", "transport", "road", "congestion", "signal", "parking"], add: ["iot", "sensors", "analytics", "automation", "tracking", "vision"] }
];

const STOPWORDS = ["the", "and", "for", "with", "that", "this", "space", "solutions", "innovative", "focusing", "efficiency", "recognized", "from", "are", "our", "your", "based", "company", "platform", "provides"];

function tagsFromText(raw) {
  const words = String(raw).toLowerCase().split(/[^a-z0-9.#+]+/).filter(w => w.length >= 4 && !STOPWORDS.includes(w));
  return [...new Set(words)];
}

// Smart normalizer: finds the right column regardless of table schema
function findCol(row, keywords) {
  const keys = Object.keys(row);
  for (const k of keywords) {
    const found = keys.find(k2 => k2.toLowerCase().includes(k));
    if (found) return row[found];
  }
  return null;
}

function normalizeRow(row, sourceName) {
  const name = findCol(row, ["name", "company", "brand", "startup"]) || "Unknown Startup";
  const domain = findCol(row, ["industry", "sector", "category"]) || "General";
  const desc = findCol(row, ["description", "summary", "what it does", "about"]) || "";
  
  // Combine all text for tagging
  const rawText = [domain, desc, JSON.stringify(row)].join(" ");
  const tags = tagsFromText(rawText);

  return {
    name: String(name).trim(),
    domain: String(domain).trim(),
    description: String(desc).trim(),
    source: sourceName,
    tags
  };
}

// Merge duplicates by name so a startup from multiple datasets becomes one rich profile
function mergeByName(profiles) {
  const map = new Map();
  for (const p of profiles) {
    const key = p.name.toLowerCase().trim();
    if (!key || key === "unknown startup") continue;
    
    if (map.has(key)) {
      const m = map.get(key);
      m.tags = [...new Set([...m.tags, ...p.tags])];
      m.sources = [...new Set([...(m.sources || [m.source]), p.source])];
      if (p.description && !m.description.includes(p.description)) {
        m.description = (m.description + " | " + p.description).trim();
      }
    } else {
      map.set(key, { ...p, sources: [p.source] });
    }
  }
  return [...map.values()];
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
    const profiles = [];
    let counts = {};

    // 1. Registry (Has ratings/efficiency)
    try {
      const r1 = await pool.query(`SELECT s.name, s.industry, p.summary, p."techStack", p."coreCapabilities" FROM "Startup" s LEFT JOIN "CapabilityPassport" p ON p."startupId" = s.id LIMIT 100`);
      r1.rows.forEach(r => profiles.push(normalizeRow({ ...r, description: r.summary, industry: r.industry }, "registry")));
      counts.registry = r1.rows.length;
    } catch (e) { console.error("⚠️ Registry read failed:", e.message); }

    // 2. Funding Dataset
    try {
      const r2 = await pool.query(`SELECT * FROM startup_funding_2021 LIMIT 150`);
      r2.rows.forEach(r => profiles.push(normalizeRow(r, "funding2021")));
      counts.funding = r2.rows.length;
    } catch (e) { console.error("⚠️ Funding read failed:", e.message); }

    // 3. Indian Startup Data
    try {
      const r3 = await pool.query(`SELECT * FROM "Indian_Startup_Data.csv" LIMIT 150`);
      r3.rows.forEach(r => profiles.push(normalizeRow(r, "indian_data")));
      counts.indian = r3.rows.length;
    } catch (e) { console.error("⚠️ Indian Data read failed:", e.message); }

    // 4. National Awards
    try {
      const r4 = await pool.query(`SELECT * FROM national_startup_awards_2022 LIMIT 100`);
      r4.rows.forEach(r => profiles.push(normalizeRow(r, "awards2022")));
      counts.awards = r4.rows.length;
    } catch (e) { console.error("⚠️ Awards read failed:", e.message); }

    if (!profiles.length) return null;
    const merged = mergeByName(profiles);
    console.log("🗄️ DB Loaded ->", counts, "| Merged unique profiles:", merged.length);
    return merged;
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
    let score = 15 + matched.length * 8;
    score = Math.min(95, score);

    const sources = s.sources && s.sources.length > 1 ? "Data sources: " + s.sources.join(" + ") + "." : "";

    return {
      startup: s.name,
      domain: s.domain,
      score,
      reason: matched.length
        ? "Profile overlaps on: " + matched.slice(0, 6).join(", ") + ". " + sources
        : "No clear overlap with this challenge. " + sources,
      stats: s.description ? "Context: " + s.description.substring(0, 100) + "..." : "",
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
    console.log("ℹ️ DEMO MODE: keyword matching on " + (source === "supabase" ? "merged Supabase data" : "built-in samples"));
  }

  await new Promise((r) => setTimeout(r, 1200));
  return { mode: "demo", source, matches: demoMatch(challenge, startups) };
}

module.exports = { matchStartups, STARTUPS: FALLBACK_STARTUPS };