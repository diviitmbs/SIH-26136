// backend/src/ai/structurer.js
// AI Feature 1: Challenge Structurer
// Gemini-powered with a smart demo fallback.

let GoogleGenerativeAI = null;

try {
  GoogleGenerativeAI =
    require("@google/generative-ai").GoogleGenerativeAI;
} catch (e) {
  GoogleGenerativeAI = null;
}

const SYSTEM_PROMPT = `
You are an assistant to a government innovation officer on a public procurement platform.

Your job is to convert a raw problem description from a government department into a clean, structured challenge that startups can solve.

Return ONLY valid JSON with exactly these fields:

{
  "title": string,
  "problem_statement": string,
  "domain": string,
  "objective": string,
  "requirements": array of strings,
  "success_metrics": array of strings,
  "expected_outcome": string,
  "risks_or_considerations": array of strings
}

Strict rules:

- The domain should describe the broad sector or problem area, such as Healthcare, Urban Mobility, Waste Management, Education, Agriculture, etc.
- Requirements should describe practical solution capabilities needed to address the problem.
- Success metrics must be measurable and should include units or percentages where possible.
- NEVER invent government laws, policies, budgets, statistics, or eligibility criteria.
- NEVER invent facts that are not supported by the problem description.
- If something is unknown, phrase it generically or add "(to be verified by the department)".
- You are an assistant only. Never make procurement or vendor decisions.
- Do not add extra fields.
- Return only the JSON object.
`;

const HEALTH = {
  title: "Optimization of Patient Flow and Reduction of Waiting Times in Public Hospitals",
  problem_statement:
    "Government hospitals currently experience severe bottlenecks in patient processing, leading to excessive waiting times, overcrowded waiting areas, and decreased patient satisfaction.",
  domain: "Healthcare",
  objective:
    "To identify, pilot, and scale a technology-driven solution that significantly reduces average patient waiting times and optimizes hospital staff workflow.",
  requirements: [
    "Real-time patient queue management and digital token system.",
    "Predictive analytics to forecast patient rush hours and optimize staff allocation.",
    "Mobile-friendly interface for patients to check wait times and receive notifications.",
    "Integration capability with existing hospital management information systems (HMIS)."
  ],
  success_metrics: [
    "Average patient waiting time from registration to consultation.",
    "Number of patients processed per hour/day.",
    "Patient satisfaction score from post-visit surveys.",
    "Percentage reduction in peak-hour overcrowding."
  ],
  expected_outcome:
    "A scalable, proven solution deployed in pilot hospitals that improves patient flow and patient experience.",
  risks_or_considerations: [
    "Resistance to change from hospital staff.",
    "Data privacy and security concerns regarding patient information.",
    "Infrastructure limitations such as poor internet connectivity."
  ]
};

const WASTE = {
  title: "Smart Solid Waste Collection and Monitoring System",
  problem_statement:
    "Irregular garbage collection, unmonitored waste bins and lack of real-time visibility over collection vehicles lead to overflowing bins and citizen complaints in several wards.",
  domain: "Waste Management",
  objective:
    "To pilot a technology solution that monitors bin status, optimizes collection routes and tracks complaint redressal end-to-end.",
  requirements: [
    "Bin fill-level monitoring using IoT sensors or QR-based tracking.",
    "Route planning and live tracking of collection vehicles.",
    "Citizen complaint registration with status updates.",
    "Ward-level dashboard for municipal officers."
  ],
  success_metrics: [
    "Percentage of bins cleared within 24 hours.",
    "Average complaint resolution time in hours.",
    "Collection route efficiency measured by distance/time per trip.",
    "Citizen satisfaction score in pilot wards."
  ],
  expected_outcome:
    "Regular, verifiable garbage collection in pilot wards with faster complaint redressal and data-driven supervision.",
  risks_or_considerations: [
    "Sensor maintenance, battery and vandalism risks.",
    "Training and adoption by ground staff and contractors.",
    "Integration with existing municipal systems.",
    "Network connectivity across wards."
  ]
};

const TRAFFIC = {
  title: "Intelligent Traffic Congestion Management for Key Junctions",
  problem_statement:
    "Recurring congestion at major junctions, long signal waiting times and slow incident response reduce travel speed and increase pollution and citizen frustration.",
  domain: "Urban Mobility",
  objective:
    "To pilot intelligent traffic management that detects congestion in real time and improves signal timing and incident response.",
  requirements: [
    "Real-time congestion detection using CCTV or sensors.",
    "Adaptive signal timing at pilot junctions.",
    "Automatic incident detection and alerts to traffic staff.",
    "Public-facing travel information through VMS or app feeds."
  ],
  success_metrics: [
    "Average waiting time at pilot junctions in seconds.",
    "Vehicle throughput per hour per junction.",
    "Incident detection and response time in minutes.",
    "Average travel time on pilot corridors."
  ],
  expected_outcome:
    "Measurably smoother traffic flow at pilot junctions with faster incident clearance.",
  risks_or_considerations: [
    "Integration with existing signal infrastructure.",
    "Camera/sensor calibration and maintenance.",
    "Privacy considerations for video analytics.",
    "Coordination across traffic police and civic agencies."
  ]
};

const TEMPLATES = [
  {
    keywords: [
      "hospital",
      "health",
      "patient",
      "doctor",
      "clinic",
      "waiting"
    ],
    challenge: HEALTH
  },
  {
    keywords: [
      "garbage",
      "waste",
      "trash",
      "collection",
      "cleaning",
      "solid"
    ],
    challenge: WASTE
  },
  {
    keywords: [
      "traffic",
      "transport",
      "road",
      "congestion",
      "signal",
      "parking"
    ],
    challenge: TRAFFIC
  }
];

function genericChallenge(raw) {
  const clean = raw.trim().replace(/\s+/g, " ");
  const titled =
    clean.charAt(0).toUpperCase() + clean.slice(1);

  const short =
    titled.length > 80
      ? titled.slice(0, 77) + "..."
      : titled;

  const lower = clean.toLowerCase();

  return {
    title:
      "Innovative Technology Solution for: " +
      short,

    problem_statement:
      clean +
      " The department is seeking scalable, proven technology solutions to address this problem efficiently and transparently.",

    domain:
      "To be determined from the challenge context (to be verified by the department).",

    objective:
      "To identify, pilot and scale a startup solution that measurably improves outcomes related to: " +
      lower +
      ".",

    requirements: [
      "The solution must directly address: " + lower + ".",
      "Deployable as a controlled pilot.",
      "Simple dashboard and reports for government officers.",
      "Scalable across the state after a successful pilot."
    ],

    success_metrics: [
      "Baseline vs actual turnaround time for the reported issue.",
      "Service coverage in the pilot area (%).",
      "Citizen / user satisfaction score from post-service surveys.",
      "Number of cases or transactions processed per day."
    ],

    expected_outcome:
      "A validated, measurable improvement during the pilot, with clear evidence to support a scale-up decision.",

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
    if (
      t.keywords.some((k) =>
        text.includes(k)
      )
    ) {
      return t.challenge;
    }
  }

  return genericChallenge(raw);
}

async function structureChallenge(problem) {
  const apiKey = process.env.GEMINI_API_KEY;

  const hasKey =
    apiKey &&
    apiKey !== "paste_your_key_here" &&
    apiKey.trim() !== "";

  if (hasKey && GoogleGenerativeAI) {
    try {
      console.log(
        "🤖 LIVE AI MODE: calling Gemini..."
      );

      const genAI =
        new GoogleGenerativeAI(apiKey);

      const model =
        genAI.getGenerativeModel({
          model: "gemini-3.6-flash",
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json"
          }
        });

      const result =
        await model.generateContent(problem);

      const text =
        result.response.text();

      console.log(
        "🤖 Gemini response received."
      );

      const parsed =
        JSON.parse(text);

      return {
        mode: "live",
        challenge:
          parsed.challenge || parsed
      };

    } catch (err) {
      console.error(
        "❌ Gemini call failed, falling back to demo mode:",
        err.message
      );
    }
  } else {
    console.log(
      "ℹ️ DEMO MODE: smart topic matching"
    );
  }

  await new Promise((r) =>
    setTimeout(r, 1500)
  );

  return {
    mode: "demo",
    challenge: demoChallenge(problem)
  };
}

module.exports = {
  structureChallenge
};