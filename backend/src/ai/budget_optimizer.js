// backend/src/ai/budget_optimizer.js
// Advanced AI Module: Budget Optimizer
// Tier-1 Public Spend Benchmarking & Cost-Efficiency Engine

let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Lightweight keyword-to-domain classifier */
function detectDomain(text) {
  const t = (text || "").toLowerCase();
  if (t.match(/pothole|road|bridge|infrastructure|pavement|highway|civil/)) return "infrastructure";
  if (t.match(/hospital|health|patient|clinic|doctor|medicine|ehr|diagnostic/)) return "healthcare";
  if (t.match(/garbage|waste|trash|sanitation|landfill|recycl|segregat/)) return "waste_management";
  if (t.match(/traffic|congestion|signal|junction|commute|transport|transit/)) return "traffic";
  if (t.match(/water|flood|drain|sewage|pipeline|scada|leakage/)) return "water";
  if (t.match(/school|education|student|teacher|learning|curriculum/)) return "education";
  if (t.match(/power|energy|electricity|solar|grid|smart meter/)) return "energy";
  return "general";
}

// ─────────────────────────────────────────────────────────────
// DOMAIN-KEYED DEMO FALLBACK DATA
// ─────────────────────────────────────────────────────────────
const DEMO_BUDGETS = {
  infrastructure: {
    suggested_budget_range: {
      min_inr: 3400000,
      max_inr: 4800000,
      optimal_inr: 4100000,
      currency: "INR"
    },
    cost_breakdown: [
      { category: "Edge CV Hardware & Camera Retrofits", percentage: 32, amount_inr: 1312000, justification: "Ruggedized multi-camera dashcam units and low-power edge compute for 25 municipal patrol vehicles" },
      { category: "Cloud Infrastructure & Inference Pipeline", percentage: 22, amount_inr: 902000, justification: "Automated frame ingestion, model hosting on sovereign cloud (MeitY empaneled), and GeoTIFF pipeline" },
      { category: "System Integration & Municipal ERP Gateway", percentage: 18, amount_inr: 738000, justification: "Bidirectional sync with ULB PWD work-order systems and GIS asset databases" },
      { category: "Field Validation & QA Crew", percentage: 16, amount_inr: 656000, justification: "Ground-truth calibration across 120 lane-km and field engineer operational allowance" },
      { category: "Contingency & Statutory Compliance", percentage: 12, amount_inr: 492000, justification: "Buffer for road permits, monsoon weather delays, and hardware replacements" }
    ],
    potential_savings_percentage: 23.5,
    cost_overrun_risk: "Low",
    historical_comparison: {
      similar_projects_analyzed: 16,
      avg_historical_cost_inr: 5350000,
      variance_explanation: "Re-using existing municipal inspection vehicles with non-invasive magnetic camera mounts avoids dedicated survey vehicle procurement, saving ~23.5% vs conventional road audit tenders.",
      benchmark_unit_cost: "₹34,166 per lane-km audited / year"
    }
  },

  healthcare: {
    suggested_budget_range: {
      min_inr: 5200000,
      max_inr: 7500000,
      optimal_inr: 6100000,
      currency: "INR"
    },
    cost_breakdown: [
      { category: "Clinical Diagnostic AI Models & Licensing", percentage: 34, amount_inr: 2074000, justification: "Validated medical imaging and screening algorithms trained on regional demographic cohorts" },
      { category: "HIPAA/ABDM Compliant Sovereign Cloud & Security", percentage: 24, amount_inr: 1464000, justification: "Encrypted data lake, zero-trust access control, and ABDM M1/M2/M3 milestone certification" },
      { category: "PHC Tablet Hardware & Field Diagnostic Kits", percentage: 20, amount_inr: 1220000, justification: "Ruggedized 10-inch Android tablets with biometric scanners for 40 Primary Health Centers" },
      { category: "Frontline Health Worker (ASHA) Training", percentage: 12, amount_inr: 732000, justification: "Bilingual vernacular interactive training modules and continuous on-site clinical supervision" },
      { category: "Clinical Trial Validation & Audit", percentage: 10, amount_inr: 610000, justification: "Independent institutional ethics committee review and third-party algorithmic audit" }
    ],
    potential_savings_percentage: 18.2,
    cost_overrun_risk: "Med",
    historical_comparison: {
      similar_projects_analyzed: 11,
      avg_historical_cost_inr: 7450000,
      variance_explanation: "Federated learning pipeline eliminates recurring high-bandwidth raw DICOM transfers, cutting cloud egress and storage charges by 18.2% relative to central repository pilots.",
      benchmark_unit_cost: "₹152.50 per validated patient tele-triage screening"
    }
  },

  waste_management: {
    suggested_budget_range: {
      min_inr: 2800000,
      max_inr: 4200000,
      optimal_inr: 3400000,
      currency: "INR"
    },
    cost_breakdown: [
      { category: "Ultrasonic Bin IoT Sensors & LoRaWAN Gateway", percentage: 35, amount_inr: 1190000, justification: "IP68-rated ultrasonic volumetric fill sensors for 450 municipal public dumpsters" },
      { category: "Dynamic Route Optimization Platform", percentage: 25, amount_inr: 850000, justification: "Real-time dispatch server, fuel-efficiency routing engine, and driver navigation tablet app" },
      { category: "Vehicle Telematics & OBD-II Units", percentage: 18, amount_inr: 612000, justification: "GPS and fuel-sensor telematics integration for 60 compactor trucks" },
      { category: "Sanitation Staff Enablement & Change Management", percentage: 12, amount_inr: 408000, justification: "Field ward officer training workshops and multilingual audio prompt app" },
      { category: "Hardware Replacement & Environmental Buffer", percentage: 10, amount_inr: 340000, justification: "Provision for sensor wear, thermal degradation, and vandalism spares" }
    ],
    potential_savings_percentage: 26.8,
    cost_overrun_risk: "Low",
    historical_comparison: {
      similar_projects_analyzed: 22,
      avg_historical_cost_inr: 4650000,
      variance_explanation: "Adopting open-standard LoRaWAN rather than 4G/LTE cellular modules per bin reduces recurring SIM recurring fees by 70%, translating to a 26.8% total lifecycle cost saving.",
      benchmark_unit_cost: "₹7,555 per smart bin sensor lifecycle / year"
    }
  },

  traffic: {
    suggested_budget_range: {
      min_inr: 4500000,
      max_inr: 6800000,
      optimal_inr: 5400000,
      currency: "INR"
    },
    cost_breakdown: [
      { category: "Adaptive Traffic Signal Controller Interfaces", percentage: 33, amount_inr: 1782000, justification: "Hardware actuation relays for 18 primary intersections connecting into central ATCS" },
      { category: "Computer Vision Queue & Density Estimators", percentage: 26, amount_inr: 1404000, justification: "Real-time edge analytics tapping into existing ITMS Pan-Tilt-Zoom security cameras" },
      { category: "Central Command Center (ICCC) Dashboard", percentage: 18, amount_inr: 972000, justification: "Operator UI, dynamic congestion forecasting, and corridor priority override modules" },
      { category: "Field Traffic Calibration & Peak Load Audits", percentage: 13, amount_inr: 702000, justification: "Manual baseline intersection traffic counts and peak-hour queue length calibration" },
      { category: "Network Redundancy & Fail-Safe Hardware", percentage: 10, amount_inr: 540000, justification: "Cellular fallback dongles and automated yellow-flash safety fallback controllers" }
    ],
    potential_savings_percentage: 24.1,
    cost_overrun_risk: "Med",
    historical_comparison: {
      similar_projects_analyzed: 14,
      avg_historical_cost_inr: 7120000,
      variance_explanation: "Retrofitting video analytics onto existing municipal smart city cameras avoids replacing 72 loop-detector poles, driving a 24.1% cost efficiency compared to legacy induction loop tenders.",
      benchmark_unit_cost: "₹300,000 per adaptive signal intersection"
    }
  },

  general: {
    suggested_budget_range: {
      min_inr: 3000000,
      max_inr: 4500000,
      optimal_inr: 3750000,
      currency: "INR"
    },
    cost_breakdown: [
      { category: "Core Software & AI Algorithm Development", percentage: 32, amount_inr: 1200000, justification: "Domain-specific model fine-tuning, backend orchestration, and secure role-based API development" },
      { category: "Cloud Infrastructure & Managed Database", percentage: 23, amount_inr: 862500, justification: "High-availability compute, encrypted storage, and automated failover architecture" },
      { category: "Legacy System Integration & Data Ingestion", percentage: 20, amount_inr: 750000, justification: "Custom connectors, data cleaning pipeline, and automated schema migration" },
      { category: "User Acceptance Testing & Pilot Training", percentage: 15, amount_inr: 562500, justification: "Stakeholder enablement sessions, user manuals, and multi-tier sandbox testing" },
      { category: "Statutory Compliance & Security Audit", percentage: 10, amount_inr: 375000, justification: "CERT-In empaneled third-party vulnerability assessment and penetration testing" }
    ],
    potential_savings_percentage: 20.0,
    cost_overrun_risk: "Low",
    historical_comparison: {
      similar_projects_analyzed: 19,
      avg_historical_cost_inr: 4680000,
      variance_explanation: "Modular microservices architecture and open APIs reduce vendor lock-in and implementation overhead by 20.0% compared to monolithic enterprise suites.",
      benchmark_unit_cost: "₹625,000 per functional deployment module"
    }
  }
};

/**
 * Optimizes procurement budget for civic innovation projects
 * @param {Object|string} projectData - Project details or challenge specification
 * @returns {Promise<Object>} Budget analysis matching schema
 */
async function optimizeBudget(projectData) {
  const apiKey = process.env.OPENAI_API_KEY;
  const rawText = typeof projectData === "string" 
    ? projectData 
    : JSON.stringify(projectData || {});
  
  const detectedDomain = detectDomain(
    typeof projectData === "object"
      ? `${projectData?.title || ""} ${projectData?.description || ""} ${projectData?.problem_statement || ""} ${projectData?.domain || ""}`
      : rawText
  );

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [budget_optimizer]: GPT-4o-mini chain-of-thought spend analysis...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Principal Public Procurement Financial Analyst and Chief Cost Estimator for government civic-tech innovation.
You analyze project scopes, calculate defensible budget ranges in Indian Rupees (INR), identify potential savings vs traditional tenders, assess overrun risks, and benchmark against historical public procurement data.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Deconstruct the project scope, technical requirements, sensor/hardware footprints, and software engineering workload.
2. Determine realistic low, optimal, and high budget boundaries (INR numbers) aligned with standard Schedule of Rates (SoR) and GeM (Government e-Marketplace) price indices.
3. Allocate the optimal budget across exactly 5 critical cost categories with realistic percentages summing to 100%, exact INR amounts, and defensible public procurement justifications.
4. Calculate potential savings percentage achievable through innovative startup architectures (e.g. edge AI, open protocols, cloud elasticity) compared to monolithic legacy vendor contracts.
5. Determine cost_overrun_risk strictly as one of: "Low", "Med", or "High" based on deployment complexity, hardware supply chain, and legacy integration dependencies.
6. Provide an authoritative historical comparison including sample size, average historical tender cost, variance explanation, and standardized benchmark unit cost.

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- All monetary values must be raw integers in INR.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "suggested_budget_range": {
    "min_inr": 3500000,
    "max_inr": 4800000,
    "optimal_inr": 4100000,
    "currency": "INR"
  },
  "cost_breakdown": [
    {
      "category": "string",
      "percentage": 30,
      "amount_inr": 1230000,
      "justification": "string"
    }
  ],
  "potential_savings_percentage": 22.5,
  "cost_overrun_risk": "Low",
  "historical_comparison": {
    "similar_projects_analyzed": 14,
    "avg_historical_cost_inr": 5250000,
    "variance_explanation": "string",
    "benchmark_unit_cost": "string"
  }
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze and optimize the budget for this public sector innovation initiative:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ optimizeBudget LIVE — optimal budget INR:", parsed.suggested_budget_range?.optimal_inr);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI budget_optimizer failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [budget_optimizer]: Simulating AI cost optimization...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_BUDGETS[detectedDomain] || DEMO_BUDGETS.general;

  return {
    mode: "demo",
    suggested_budget_range: fallback.suggested_budget_range,
    cost_breakdown: fallback.cost_breakdown,
    potential_savings_percentage: fallback.potential_savings_percentage,
    cost_overrun_risk: fallback.cost_overrun_risk,
    historical_comparison: fallback.historical_comparison
  };
}

module.exports = { optimizeBudget };
