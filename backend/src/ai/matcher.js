// backend/src/ai/matcher.js
// AI Feature 2: Startup Matcher (Multi-Source Fusion)
//
// Flow:
// Government Challenge
//      ↓
// Supabase / PostgreSQL startup datasets
//      ↓
// Normalize + merge duplicate startup profiles
//      ↓
// Gemini AI relevance matching
//      ↓
// Ranked startup recommendations
//
// IMPORTANT:
// AI only recommends.
// Final shortlisting remains with the government officer.


// ============================================================
// GEMINI
// ============================================================

let GoogleGenAI = null;

try {
  GoogleGenAI = require("@google/genai").GoogleGenAI;
} catch (e) {
  GoogleGenAI = null;
}


// ============================================================
// POSTGRES
// ============================================================

let pg = null;

try {
  pg = require("pg");
} catch (e) {
  pg = null;
}


// ============================================================
// FALLBACK STARTUPS
//
// Used ONLY if database access fails.
// ============================================================

const FALLBACK_STARTUPS = [

  {
    name: "QueueCare Technologies",
    domain: "HealthTech",
    description:
      "Digital token and hospital queue management systems.",
    tags: [
      "hospital",
      "patient",
      "queue",
      "waiting",
      "token",
      "health"
    ]
  },

  {
    name: "MedFlow Analytics",
    domain: "HealthTech / Data",
    description:
      "Predictive analytics for patient rush hours.",
    tags: [
      "hospital",
      "analytics",
      "patient",
      "staff",
      "waiting",
      "health"
    ]
  },

  {
    name: "WasteWise Systems",
    domain: "CivicTech / Waste",
    description:
      "IoT bin monitoring and smart route planning.",
    tags: [
      "garbage",
      "waste",
      "collection",
      "route",
      "municipal",
      "iot",
      "sensors"
    ]
  },

  {
    name: "FinServe Digital",
    domain: "FinTech",
    description:
      "Digital payment gateway solutions.",
    tags: [
      "fintech",
      "payments",
      "banking"
    ]
  },

  {
    name: "AgriSense",
    domain: "AgriTech",
    description:
      "IoT soil and crop monitoring.",
    tags: [
      "agriculture",
      "iot",
      "sensors",
      "crops",
      "farmers"
    ]
  },

  {
    name: "UrbanIQ",
    domain: "Smart City",
    description:
      "City dashboards and IoT traffic monitoring.",
    tags: [
      "traffic",
      "congestion",
      "junction",
      "signal",
      "iot",
      "sensors"
    ]
  }

];


// ============================================================
// TOPIC EXPANSIONS
//
// Used by fallback keyword matching.
// ============================================================

const TOPIC_EXPANSIONS = [

  {
    detect: [
      "hospital",
      "health",
      "patient",
      "doctor",
      "clinic",
      "waiting"
    ],

    add: [
      "hospital",
      "patient",
      "health",
      "analytics",
      "automation",
      "queue"
    ]
  },

  {
    detect: [
      "garbage",
      "waste",
      "trash",
      "collection",
      "cleaning",
      "solid"
    ],

    add: [
      "logistics",
      "route",
      "tracking",
      "iot",
      "sensors",
      "municipal",
      "automation",
      "analytics"
    ]
  },

  {
    detect: [
      "traffic",
      "transport",
      "road",
      "congestion",
      "signal",
      "parking"
    ],

    add: [
      "iot",
      "sensors",
      "analytics",
      "automation",
      "tracking",
      "vision"
    ]
  }

];


// ============================================================
// STOPWORDS
// ============================================================

const STOPWORDS = [

  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "space",
  "solutions",
  "innovative",
  "focusing",
  "efficiency",
  "recognized",
  "from",
  "are",
  "our",
  "your",
  "based",
  "company",
  "platform",
  "provides"

];


// ============================================================
// CREATE TAGS FROM TEXT
// ============================================================

function tagsFromText(raw) {

  const words =
    String(raw)
      .toLowerCase()
      .split(/[^a-z0-9.#+]+/)
      .filter(
        word =>
          word.length >= 4 &&
          !STOPWORDS.includes(word)
      );

  return [...new Set(words)];

}


// ============================================================
// SMART COLUMN FINDER
//
// Different datasets have different column names.
// This attempts to identify the correct field automatically.
// ============================================================

function findCol(row, keywords) {

  const keys =
    Object.keys(row);

  for (const keyword of keywords) {

    const found =
      keys.find(
        key =>
          key
            .toLowerCase()
            .includes(keyword)
      );

    if (found) {
      return row[found];
    }

  }

  return null;

}


// ============================================================
// NORMALIZE DATABASE ROW
// ============================================================

function normalizeRow(row, sourceName) {

  const name =
    findCol(
      row,
      [
        "name",
        "company",
        "brand",
        "startup"
      ]
    ) || "Unknown Startup";


  const domain =
    findCol(
      row,
      [
        "industry",
        "sector",
        "category"
      ]
    ) || "General";


  const desc =
    findCol(
      row,
      [
        "description",
        "summary",
        "what it does",
        "about"
      ]
    ) || "";


  // Combine available information to generate
  // searchable tags for fallback matching.

  const rawText = [
    domain,
    desc,
    JSON.stringify(row)
  ].join(" ");


  const tags =
    tagsFromText(rawText);


  return {

    name:
      String(name).trim(),

    domain:
      String(domain).trim(),

    description:
      String(desc).trim(),

    source:
      sourceName,

    tags

  };

}


// ============================================================
// MERGE DUPLICATES
//
// If the same startup appears in multiple datasets,
// combine its information into one richer profile.
// ============================================================

function mergeByName(profiles) {

  const map =
    new Map();


  for (const profile of profiles) {

    const key =
      profile.name
        .toLowerCase()
        .trim();


    if (
      !key ||
      key === "unknown startup"
    ) {
      continue;
    }


    if (map.has(key)) {

      const existing =
        map.get(key);


      // Merge tags

      existing.tags =
        [
          ...new Set([
            ...existing.tags,
            ...profile.tags
          ])
        ];


      // Merge source datasets

      existing.sources =
        [
          ...new Set([
            ...(existing.sources || [
              existing.source
            ]),
            profile.source
          ])
        ];


      // Merge useful descriptions

      if (
        profile.description &&
        !existing.description.includes(
          profile.description
        )
      ) {

        existing.description =
          (
            existing.description +
            " | " +
            profile.description
          ).trim();

      }

    } else {

      map.set(
        key,
        {
          ...profile,
          sources: [
            profile.source
          ]
        }
      );

    }

  }


  return [
    ...map.values()
  ];

}


// ============================================================
// LOAD STARTUPS FROM DATABASE
//
// READ ONLY.
// No INSERT / UPDATE / DELETE operations.
// ============================================================

async function loadStartupsFromDB() {

  if (!pg) {

    console.error(
      "⚠️ pg package not available."
    );

    return null;

  }


  const url =
    process.env.DATABASE_URL;


  if (!url) {

    console.error(
      "⚠️ DATABASE_URL missing."
    );

    return null;

  }


  const pool =
    new pg.Pool({

      connectionString: url,

      ssl: {
        rejectUnauthorized: false
      },

      connectionTimeoutMillis: 5000

    });


  try {

    const profiles = [];

    const counts = {};


    // ========================================================
    // 1. PROCUREX STARTUP REGISTRY
    // ========================================================

    try {

      const r1 =
        await pool.query(`
          SELECT
            s.name,
            s.industry,
            p.summary,
            p."techStack",
            p."coreCapabilities"
          FROM "Startup" s
          LEFT JOIN "CapabilityPassport" p
            ON p."startupId" = s.id
          LIMIT 100
        `);


      r1.rows.forEach(row => {

        profiles.push(

          normalizeRow(

            {
              ...row,
              description: row.summary,
              industry: row.industry
            },

            "registry"

          )

        );

      });


      counts.registry =
        r1.rows.length;


    } catch (e) {

      console.error(
        "⚠️ Registry read failed:",
        e.message
      );

    }


    // ========================================================
    // 2. FUNDING DATASET
    // ========================================================

    try {

      const r2 =
        await pool.query(`
          SELECT *
          FROM startup_funding_2021
          LIMIT 150
        `);


      r2.rows.forEach(row => {

        profiles.push(

          normalizeRow(
            row,
            "funding2021"
          )

        );

      });


      counts.funding =
        r2.rows.length;


    } catch (e) {

      console.error(
        "⚠️ Funding read failed:",
        e.message
      );

    }


    // ========================================================
    // 3. INDIAN STARTUP DATASET
    // ========================================================

    try {

      const r3 =
        await pool.query(`
          SELECT *
          FROM "Indian_Startup_Data.csv"
          LIMIT 150
        `);


      r3.rows.forEach(row => {

        profiles.push(

          normalizeRow(
            row,
            "indian_data"
          )

        );

      });


      counts.indian =
        r3.rows.length;


    } catch (e) {

      console.error(
        "⚠️ Indian Data read failed:",
        e.message
      );

    }


    // ========================================================
    // 4. NATIONAL STARTUP AWARDS
    // ========================================================

    try {

      const r4 =
        await pool.query(`
          SELECT *
          FROM national_startup_awards_2022
          LIMIT 100
        `);


      r4.rows.forEach(row => {

        profiles.push(

          normalizeRow(
            row,
            "awards2022"
          )

        );

      });


      counts.awards =
        r4.rows.length;


    } catch (e) {

      console.error(
        "⚠️ Awards read failed:",
        e.message
      );

    }


    // ========================================================
    // NOTHING LOADED
    // ========================================================

    if (!profiles.length) {

      console.error(
        "⚠️ No startup profiles found in database."
      );

      return null;

    }


    // ========================================================
    // MERGE DUPLICATES
    // ========================================================

    const merged =
      mergeByName(profiles);


    console.log(
      "🗄️ DB Loaded ->",
      counts,
      "| Merged unique profiles:",
      merged.length
    );


    return merged;


  } catch (err) {

    console.error(
      "⚠️ DB read failed, using built-in samples:",
      err.message
    );


    return null;


  } finally {

    pool
      .end()
      .catch(() => {});

  }

}


// ============================================================
// DEMO / FALLBACK MATCHER
//
// Used only when Gemini cannot be used.
// ============================================================

function demoMatch(
  challenge,
  startups
) {

  const base =
    JSON
      .stringify(challenge)
      .toLowerCase();


  const expanded = [];


  for (const topic of TOPIC_EXPANSIONS) {

    if (
      topic.detect.some(
        keyword =>
          base.includes(keyword)
      )
    ) {

      expanded.push(
        ...topic.add
      );

    }

  }


  const haystack =
    base +
    " " +
    expanded.join(" ");


  const results =
    startups.map(startup => {


      const matched =
        startup.tags.filter(
          tag =>
            haystack.includes(tag)
        );


      let score =
        15 +
        matched.length * 8;


      score =
        Math.min(
          95,
          score
        );


      const sources =
        startup.sources &&
        startup.sources.length > 1

          ? "Data sources: " +
            startup.sources.join(" + ") +
            "."

          : "";


      return {

        startup:
          startup.name,

        domain:
          startup.domain,

        score,

        reason:
          matched.length

            ? "Profile overlaps on: " +
              matched
                .slice(0, 6)
                .join(", ") +
              ". " +
              sources

            : "No clear overlap with this challenge. " +
              sources,


        stats:
          startup.description

            ? "Context: " +
              startup.description.substring(
                0,
                100
              ) +
              "..."

            : "",


        note:
          "Recommendation only - final shortlisting is done by the government officer."

      };

    });


  return results.sort(
    (a, b) =>
      b.score - a.score
  );

}


// ============================================================
// GEMINI MATCHER
// ============================================================

async function matchStartups(challenge) {

  // ==========================================================
  // LOAD STARTUP DATA
  // ==========================================================

  let startups =
    await loadStartupsFromDB();


  const source =
    startups
      ? "supabase"
      : "builtin";


  if (!startups) {

    startups =
      FALLBACK_STARTUPS;

  }


  // ==========================================================
  // CHECK GEMINI CONFIGURATION
  // ==========================================================

  const apiKey =
    process.env.GEMINI_API_KEY;


  const hasKey =
    Boolean(
      apiKey &&
      apiKey.trim() &&
      apiKey !== "paste_your_key_here"
    );


  // ==========================================================
  // LIVE GEMINI MODE
  // ==========================================================

  if (
    hasKey &&
    GoogleGenAI
  ) {

    try {

      console.log(
        "🤖 LIVE GEMINI MODE: matching startups..."
      );


      // ======================================================
      // INITIALIZE GEMINI
      // ======================================================

      const ai =
        new GoogleGenAI({
          apiKey
        });


      // ======================================================
      // PREPARE CLEAN STARTUP DATA
      //
      // Do not send unnecessary internal data to Gemini.
      // ======================================================

      const startupProfiles =
        startups.map(
          startup => ({

            name:
              startup.name,

            domain:
              startup.domain,

            description:
              startup.description,

            sources:
              startup.sources || [
                startup.source
              ]

          })
        );


      // ======================================================
      // PROMPT
      // ======================================================

      const prompt = `
You are an AI assistant helping a government officer discover
suitable startups for a public-sector innovation challenge.

Evaluate the supplied startup profiles against the government
challenge.

STRICT RULES:

1. Use ONLY information contained in the supplied startup profiles.

2. Do NOT invent:
   - customers
   - deployments
   - certifications
   - government experience
   - technical capabilities
   - funding
   - awards
   - performance claims

3. Evaluate relevance between the challenge and each startup profile.

4. Score relevant startups from 0 to 100.

5. Higher scores must indicate stronger evidence of relevance.

6. Explain briefly why each startup matches the challenge.

7. Return the strongest matches first.

8. Return a maximum of 10 recommendations.

9. Do not recommend clearly unrelated startups.

10. AI recommendations are advisory only.
    Final shortlisting is performed by the government officer.

Return JSON only.

Required structure:

{
  "matches": [
    {
      "startup": "Startup Name",
      "domain": "Startup Domain",
      "score": 85,
      "reason": "Short evidence-based explanation"
    }
  ]
}

GOVERNMENT CHALLENGE:

${JSON.stringify(challenge)}

STARTUP PROFILES:

${JSON.stringify(startupProfiles)}
`;


      // ======================================================
      // CALL GEMINI
      //
      // Current Google GenAI SDK.
      // ======================================================

      const response =
        await ai.models.generateContent({

          model:
            process.env.GEMINI_MODEL ||
            "gemini-2.5-flash",

          contents:
            prompt,

          config: {

            temperature:
              0.2,

            responseMimeType:
              "application/json"

          }

        });


      // ======================================================
      // READ RESPONSE
      // ======================================================

      const text =
        response.text;


      if (
        !text ||
        !text.trim()
      ) {

        throw new Error(
          "Gemini returned an empty response."
        );

      }


      // ======================================================
      // PARSE JSON
      // ======================================================

      const parsed =
        JSON.parse(
          text.trim()
        );


      if (
        !parsed ||
        !Array.isArray(
          parsed.matches
        )
      ) {

        throw new Error(
          "Gemini response did not contain a matches array."
        );

      }


      // ======================================================
      // VALIDATE + CLEAN MATCHES
      // ======================================================

      const knownStartups =
        new Map(
          startups.map(
            startup => [
              startup.name
                .toLowerCase()
                .trim(),
              startup
            ]
          )
        );


      const matches =
        parsed.matches

          .filter(match => {

            if (
              !match ||
              !match.startup
            ) {
              return false;
            }


            const key =
              String(match.startup)
                .toLowerCase()
                .trim();


            // Prevent Gemini from returning
            // a startup that wasn't in our database.

            return knownStartups.has(
              key
            );

          })

          .map(match => {

            const key =
              String(match.startup)
                .toLowerCase()
                .trim();


            const original =
              knownStartups.get(key);


            let score =
              Number(match.score);


            if (
              !Number.isFinite(score)
            ) {
              score = 0;
            }


            score =
              Math.max(
                0,
                Math.min(
                  100,
                  Math.round(score)
                )
              );


            return {

              startup:
                original.name,

              domain:
                original.domain,

              score,

              reason:
                String(
                  match.reason || ""
                ).trim(),

              stats:
                original.description

                  ? "Context: " +
                    original.description.substring(
                      0,
                      100
                    ) +
                    (
                      original.description.length > 100
                        ? "..."
                        : ""
                    )

                  : "",

              note:
                "AI recommendation only - final shortlisting is done by the government officer."

            };

          })

          .sort(
            (a, b) =>
              b.score - a.score
          )

          .slice(
            0,
            10
          );


      console.log(
        "✅ Gemini returned",
        matches.length,
        "validated startup matches"
      );


      return {

        mode:
          "live",

        source,

        matches

      };


    } catch (err) {

      console.error(
        "❌ Gemini match failed:",
        err.message
      );


      console.log(
        "↪ Falling back to keyword matcher."
      );

    }

  } else {


    // ========================================================
    // EXPLAIN WHY GEMINI ISN'T AVAILABLE
    // ========================================================

    if (!hasKey) {

      console.log(
        "⚠️ GEMINI_API_KEY missing or invalid."
      );

    }


    if (!GoogleGenAI) {

      console.log(
        "⚠️ @google/genai package is not installed."
      );

    }

  }


  // ==========================================================
  // FALLBACK MODE
  // ==========================================================

  console.log(
    "ℹ️ DEMO MODE: keyword matching on " +
    (
      source === "supabase"
        ? "merged Supabase data"
        : "built-in samples"
    )
  );


  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        1200
      )
  );


  return {

    mode:
      "demo",

    source,

    matches:
      demoMatch(
        challenge,
        startups
      )

  };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  matchStartups,

  STARTUPS:
    FALLBACK_STARTUPS

};