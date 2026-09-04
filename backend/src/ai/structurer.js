// backend/src/ai/structurer.js
// AI Feature 1: Challenge Structurer
// Real OpenAI if a key exists; otherwise a smart multi-topic demo brain.

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

const SYSTEM_PROMPT = `
You are an assistant to a government innovation officer on a public procurement platform.
Your job is to convert a raw problem description from a government department into a clean, structured "challenge" that startups can solve.

Return ONLY valid JSON with exactly these fields:
{
  "title": string,
  "problem_statement": string,
  "objective": string,
  "key_requirements": array of strings,
  "suggested_kpis": array of strings,
  "expected_outcome": string,
  "risks_or_considerations": array of strings
}

Strict rules:
- KPIs must be measurable (include units or percentages where possible).
- NEVER invent government laws, policies, budgets, statistics, or eligibility criteria.
- If something is unknown, phrase it generically or add "(to be verified by the department)".
- You are an assistant only. Never make procurement or vendor decisions.
- Do not add extra fields. Return only the JSON object.
`;

const HEALTH = {
  title: "Optimization of Patient Flow and Reduction of Waiting Times in Public Hospitals",
  problem_statement: "Government hospitals currently experience severe bottlenecks in patient processing, leading to excessive waiting times, overcrowded waiting areas, and decreased patient satisfaction.",
  objective: "To identify, pilot, and scale a technology-driven solution that significantly reduces average patient waiting times and optimizes hospital staff workflow.",
  key_requirements: [
    "Real-time patient queue management and digital token system.",
    "Predictive analytics to forecast patient rush hours and optimize staff allocation.",
    "Mobile-friendly interface for patients to check wait times and receive notifications.",
    "Integration capability with existing hospital management information systems (HMIS)."
  ],
  suggested_kpis: [
    "Average patient waiting time (from registration to consultation).",
    "Number of patients processed per hour/day.",
    "Patient satisfaction score (post-visit survey).",
    "Percentage reduction in peak-hour overcrowding."
  ],
  expected_outcome: "A scalable, proven solution deployed in pilot hospitals that reduces average waiting times by at least 40% and improves patient experience.",
  risks_or_considerations: [
    "Resistance to change from hospital staff accustomed to manual processes.",
    "Data privacy and security concerns regarding patient health information.",
    "Infrastructure limitations (e.g., poor internet connectivity in some hospitals)."
  ]
};

const WASTE = {
  title: "Smart Solid Waste Collection and Monitoring System",
  problem_statement: "Irregular garbage collection, unmonitored waste bins and lack of real-time visibility over collection vehicles lead to overflowing bins and citizen complaints in several wards.",
  objective: "To pilot a technology solution that monitors bin status, optimizes collection routes and tracks complaint redressal end-to-end.",
  key_requirements: [
    "Bin fill-level monitoring (IoT sensors or QR-based tracking).",
    "Route planning and live tracking of collection vehicles.",
    "Citizen complaint registration with status updates.",
    "Ward-level dashboard for municipal officers."
  ],
  suggested_kpis: [
    "Percentage of bins cleared within 24 hours.",
    "Average complaint resolution time (hours).",
    "Collection route efficiency (km/time per trip).",
    "Citizen satisfaction score in pilot wards."
  ],
  expected_outcome: "Regular, verifiable garbage collection in pilot wards with faster complaint redressal and data-driven supervision.",
  risks_or_considerations: [
    "Sensor maintenance, battery and vandalism risks.",
    "Training and adoption by ground staff and contractors.",
    "Integration with existing municipal systems.",
    "Network connectivity in all wards."
  ]
};

const TRAFFIC = {
  title: "Intelligent Traffic Congestion Management for Key Junctions",
  problem_statement: "Recurring congestion at major junctions, long signal waiting times and slow incident response reduce travel speed and increase pollution and citizen frustration.",
  objective: "To pilot intelligent traffic management that detects congestion in real time and improves signal timing and incident response.",
  key_requirements: [
    "Real-time congestion detection (CCTV/sensor-based).",
    "Adaptive signal timing at pilot junctions.",
    "Automatic incident detection and alerts to traffic staff.",
    "Public-facing travel information (VMS or app feeds)."
  ],
  suggested_kpis: [
    "Average waiting time at pilot junctions (seconds).",
    "Vehicle throughput per hour per junction.",
    "Incident detection and response time (minutes).",
    "Average travel time on pilot corridors."
  ],
  expected_outcome: "Measurably smoother traffic flow at pilot junctions with faster incident clearance.",
  risks_or_considerations: [
    "Integration with existing signal infrastructure.",
    "Camera/sensor calibration and maintenance.",
    "Privacy considerations for video analytics.",
    "Coordination across traffic police and civic agencies."
  ]
};

const TEMPLATES = [
  { keywords: ["hospital", "health", "patient", "doctor", "clinic", "waiting"], challenge: HEALTH },
  { keywords: ["garbage", "waste", "trash", "collection", "cleaning", "solid"], challenge: WASTE },
  { keywords: ["traffic", "transport", "road", "congestion", "signal", "parking"], challenge: TRAFFIC }
];

function genericChallenge(raw) {
  const clean = raw.trim().replace(/\s+/g, " ");
  const titled = clean.charAt(0).toUpperCase() + clean.slice(1);
  const short = titled.length > 80 ? titled.slice(0, 77) + "..." : titled;
  const lower = clean.toLowerCase();
  return {
    title: "Innovative Technology Solution for: " + short,
    problem_statement: clean + " The department is seeking scalable, proven technology solutions to address this problem efficiently and transparently.",
    objective: "To identify, pilot and scale a startup solution that measurably improves outcomes related to: " + lower + ".",
    key_requirements: [
      "The solution must directly address: " + lower + ".",
      "Deployable as a controlled pilot (limited locations, 2-3 months).",
      "Simple dashboard and reports for government officers.",
      "Scalable across the state after a successful pilot."
    ],
    suggested_kpis: [
      "Baseline vs actual turnaround time for the reported issue.",
      "Service coverage in the pilot area (%).",
      "Citizen / user satisfaction score from post-service surveys.",
      "Number of cases or transactions processed per day."
    ],
    expected_outcome: "A validated, measurable improvement during the pilot, with clear evidence to support a scale-up decision.",
    risks_or_considerations: [
      "Data availability and quality from existing systems.",
      "Field staff adoption and training.",
      "Integration with existing government platforms.",
      "Budget and procurement rules to be verified by the department."
    ]
  };
}

function demoChallenge(raw) {
  const text = raw.toLowerCase();
  for (const t of TEMPLATES) {
    if (t.keywords.some((k) => text.includes(k))) return t.challenge;
  }
  return genericChallenge(raw);
}

async function structureChallenge(problem) {
  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";

  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE: calling OpenAI...");
      const client = new OpenAI();
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: problem }
        ]
      });
      const parsed = JSON.parse(response.choices[0].message.content);
      return { mode: "live", challenge: parsed.challenge || parsed };
    } catch (err) {
      console.error("❌ OpenAI call failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️ DEMO MODE: smart topic matching");
  }

  await new Promise((r) => setTimeout(r, 1500));
  return { mode: "demo", challenge: demoChallenge(problem) };
}

module.exports = { structureChallenge };