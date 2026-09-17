// backend/src/ai/risk_predictor.js
// Advanced AI Module: Risk Predictor
// Tier-1 Public Sector Deployment Risk Modeling & Mitigation Engine

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
const DEMO_RISKS = {
  infrastructure: {
    top_risks: [
      {
        risk_name: "Severe Monsoon Camera Lens Occlusion & Sensor Degradation",
        probability_percentage: 72,
        impact_level: "High",
        mitigation_strategy: "Mandate IP67/IP69K camera housings with hydrophobic nanocoatings and automated wiper triggers; deploy an automated blur/occlusion detection algorithm to flag non-viable video frames."
      },
      {
        risk_name: "Field PWD Contractor Work-Order Non-Compliance & System Bypassing",
        probability_percentage: 58,
        impact_level: "High",
        mitigation_strategy: "Incorporate cryptographic geo-fenced before/after photo verification into contractor milestone release triggers; enforce automated penalty deductions for delayed SLA repairs."
      },
      {
        risk_name: "Municipal GIS & Legacy ERP Data Pipeline Sync Latency",
        probability_percentage: 45,
        impact_level: "Medium",
        mitigation_strategy: "Implement an asynchronous Kafka-based message broker with a 72-hour local SQLite fallback queue on patrol vehicles, preventing data loss during network blackouts."
      },
      {
        risk_name: "Citizen Alert Fatigue & Spurious Pothole Triangulation",
        probability_percentage: 38,
        impact_level: "Medium",
        mitigation_strategy: "Deploy DBSCAN clustering with a 5-meter spatial tolerance threshold to deduplicate crowdsourced citizen reports into unified incident IDs before dispatching work orders."
      }
    ],
    overall_risk_score: 54
  },

  healthcare: {
    top_risks: [
      {
        risk_name: "Protected Health Information (PHI) & ABDM Data Privacy Breach",
        probability_percentage: 64,
        impact_level: "High",
        mitigation_strategy: "Enforce AES-256 field-level encryption at rest, TLS 1.3 in transit, automated DICOM de-identification pipelines, and undergo quarterly CERT-In third-party security audits."
      },
      {
        risk_name: "Algorithmic Diagnostic Bias in Rural & Underserved Cohorts",
        probability_percentage: 52,
        impact_level: "High",
        mitigation_strategy: "Conduct stratified sub-population cross-validation across diverse socio-demographic clinical cohorts; mandate mandatory human-in-the-loop medical officer sign-off for critical classifications."
      },
      {
        risk_name: "Intermittent Rural PHC Connectivity & Cellular Dropouts",
        probability_percentage: 68,
        impact_level: "Medium",
        mitigation_strategy: "Deploy quantized on-device Edge-AI models (TFLite/ONNX) capable of performing zero-bandwidth local inferences, syncing batches asynchronously upon network restoration."
      },
      {
        risk_name: "Frontline Health Worker (ASHA) Tech Adoption Resistance",
        probability_percentage: 42,
        impact_level: "Medium",
        mitigation_strategy: "Design a vernacular voice-assisted mobile UI with visual iconography; institute performance-linked micro-incentives (₹50 per verified digital screening) via DBT."
      }
    ],
    overall_risk_score: 57
  },

  waste_management: {
    top_risks: [
      {
        risk_name: "Ultrasonic Bin Sensor Vandalism & Physical Tampering",
        probability_percentage: 65,
        impact_level: "High",
        mitigation_strategy: "Deploy flush-mount tamper-evident bracket housings with internal tilt and accelerometer sensors configured to dispatch real-time ward supervisor alerts if displaced."
      },
      {
        risk_name: "Corrosive Chemical & Biological Sensor Diaphragm Wear",
        probability_percentage: 55,
        impact_level: "Medium",
        mitigation_strategy: "Specify chemically inert fluoropolymer (PTFE) protective membranes and mandate biannual ultrasonic transducer recalibration cycles in the vendor SLA."
      },
      {
        risk_name: "Driver Route Deviations & Compactor Truck Off-Path Idling",
        probability_percentage: 48,
        impact_level: "Medium",
        mitigation_strategy: "Integrate OBD-II CAN bus sensors with geo-fenced route adherence corridors; trigger automated operational escalation if a vehicle idles outside designated pickup zones for >15 minutes."
      },
      {
        risk_name: "LoRaWAN Gateway RF Signal Shadowing in Dense Urban Slums",
        probability_percentage: 40,
        impact_level: "Low",
        mitigation_strategy: "Mount redundant high-gain 868MHz omnidirectional antennas on municipal water towers and high-rise public infrastructure to achieve 98% line-of-sight coverage."
      }
    ],
    overall_risk_score: 52
  },

  traffic: {
    top_risks: [
      {
        risk_name: "Gridlock Propagation from Cascade Algorithmic Signal Timing Errors",
        probability_percentage: 42,
        impact_level: "High",
        mitigation_strategy: "Hardcode fail-safe hardware overrides that instantly revert traffic light controllers to time-of-day fixed cycle plans or yellow flashing mode if detector telemetry drops for >60 seconds."
      },
      {
        risk_name: "Severe Optical Sensor Blindness Under Low-Light & Fog Conditions",
        probability_percentage: 60,
        impact_level: "High",
        mitigation_strategy: "Fuse optical computer vision streams with thermal imaging and radar detectors at key arterial bottleneck junctions to sustain vehicle classification accuracy above 88% in heavy fog."
      },
      {
        risk_name: "Inter-Departmental Coordination Bottlenecks (Traffic Police vs ULB)",
        probability_percentage: 56,
        impact_level: "Medium",
        mitigation_strategy: "Establish a Joint Steering Committee with a unified SLA dashboard granting both city traffic police control rooms and municipal engineers co-management privileges."
      },
      {
        risk_name: "Power Surge & Voltage Fluctuation Damage to Junction Controllers",
        probability_percentage: 38,
        impact_level: "Medium",
        mitigation_strategy: "Install 2kVA pure sine-wave online UPS units with solar trickle chargers and industrial surge protection devices (SPDs) at each critical signalized intersection."
      }
    ],
    overall_risk_score: 49
  },

  general: {
    top_risks: [
      {
        risk_name: "Legacy Municipal System API Integration Deadlock",
        probability_percentage: 62,
        impact_level: "High",
        mitigation_strategy: "Deploy an intermediate ESB/API gateway with simulated mock stubs to allow parallel pilot testing while municipal database administrators review firewall whitelisting."
      },
      {
        risk_name: "Procurement Vendor Lock-In & Proprietary Data Formats",
        probability_percentage: 48,
        impact_level: "High",
        mitigation_strategy: "Mandate open-source SDKs, RESTful JSON APIs, and weekly full-database SQL/CSV automated dumps into a government-owned sovereign S3 bucket."
      },
      {
        risk_name: "Bureaucratic Approval Delays & Milestone Sign-Off Stagnation",
        probability_percentage: 54,
        impact_level: "Medium",
        mitigation_strategy: "Institute a 'Deemed Acceptance' clause in the master agreement whereby deliverables are formally accepted if no written rejection is filed within 14 calendar days."
      },
      {
        risk_name: "Cybersecurity Vulnerabilities & Zero-Day Endpoint Exploits",
        probability_percentage: 36,
        impact_level: "Medium",
        mitigation_strategy: "Implement mandatory OWASP Top 10 continuous security linting, multi-factor authentication for all administrative tiers, and biannual CERT-In compliance reviews."
      }
    ],
    overall_risk_score: 50
  }
};

/**
 * Evaluates deployment, operational, and regulatory risks for procurement initiatives
 * @param {Object|string} projectData - Project scope, challenge details, or pilot specs
 * @returns {Promise<Object>} Risk prediction matching schema
 */
async function predictRisks(projectData) {
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
      console.log("🤖 LIVE AI MODE [risk_predictor]: GPT-4o-mini chain-of-thought risk prediction...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Chief Public Sector Risk Officer and Infrastructure Reliability Engineer specializing in municipal civic-tech deployments.
Your role is to foresee operational failure modes, technical bottlenecks, adoption resistance, and regulatory hurdles, providing quantitative probabilities and actionable mitigations.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Examine the project scope, operating environment, field conditions, and technical dependencies.
2. Identify the top 4 most critical, highly specific failure vectors (avoid generic statements like "budget might run out").
3. Assign an empirical probability percentage (1-100) based on municipal operational realities.
4. Classify impact level strictly as one of: "High", "Medium", or "Low".
5. Formulate an actionable, technically specific mitigation strategy referencing hardware standards, SLA terms, fallback architectures, or operational protocols.
6. Calculate an overall composite risk score (0-100 integer, where 0 represents zero risk and 100 represents severe systemic failure).

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "top_risks": [
    {
      "risk_name": "string",
      "probability_percentage": 75,
      "impact_level": "High",
      "mitigation_strategy": "string"
    }
  ],
  "overall_risk_score": 68
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Identify and predict operational risks for this civic project:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ predictRisks LIVE — overall risk score:", parsed.overall_risk_score);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI risk_predictor failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [risk_predictor]: Simulating AI risk prediction...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_RISKS[detectedDomain] || DEMO_RISKS.general;

  return {
    mode: "demo",
    top_risks: fallback.top_risks,
    overall_risk_score: fallback.overall_risk_score
  };
}

module.exports = { predictRisks };
