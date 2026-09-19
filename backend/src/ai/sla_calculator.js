// backend/src/ai/sla_calculator.js
// Advanced AI Module: Service Level Agreement (SLA) & Penalty Calculation Engine
// Formulates GFR 2017 & Indian Contract Act compliant liquidated damages, penalty tiers, and security retention

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
const DEMO_SLAS = {
  infrastructure: {
    penalty_clauses: [
      {
        violation_type: "System Availability & Live Dashboard Downtime (<99.5% Uptime)",
        penalty_percentage: 1.0,
        cap_percentage: 10.0,
        grace_period_days: 1,
        calculation_method: "Deduction of 1.0% of total monthly operational fee for every 0.1% uptime degradation below 99.5% benchmark."
      },
      {
        violation_type: "Defect Processing & Work Order Dispatch SLA Breach (>4 Hours)",
        penalty_percentage: 0.5,
        cap_percentage: 5.0,
        grace_period_days: 0,
        calculation_method: "Deduction of ₹1,000 per delayed defect batch beyond 4 hours from patrol vehicle telemetry capture."
      },
      {
        violation_type: "AI Model False Positive Threshold Exceeded (>8% Error Rate)",
        penalty_percentage: 2.0,
        cap_percentage: 8.0,
        grace_period_days: 3,
        calculation_method: "₹500 fine per false-positive ticket dispatched to field maintenance crews verified by PWD audit."
      },
      {
        violation_type: "Patrol Fleet Sensor Camera Hardware Outage (>24 Hours)",
        penalty_percentage: 1.5,
        cap_percentage: 10.0,
        grace_period_days: 2,
        calculation_method: "Deduction of ₹2,500 per day per vehicle sensor unit remaining uncalibrated or unoperational."
      }
    ],
    liquidated_damages_per_day: 15000, // ₹15,000 per day for project milestone delay
    maximum_liability_percentage: 10.0, // Cap on overall contract penalties under GFR Rule 175
    performance_security_percentage: 3.0, // Reduced Performance Security as per recent MoF Guidelines
    payment_hold_percentage: 10.0, // Retention money held until final acceptance certificate
    dispute_resolution_process: [
      "Stage 1: Informal resolution attempt by Joint Monitoring Committee chaired by Superintending Engineer within 14 days.",
      "Stage 2: Formal escalation to Municipal Commissioner / Administrative Secretary within 30 days.",
      "Stage 3: Sole Arbitrator appointment under Indian Arbitration and Conciliation Act 1996 seated in state capital.",
      "Stage 4: Recourse to High Court having territorial jurisdiction over the municipal authority."
    ]
  },

  healthcare: {
    penalty_clauses: [
      {
        violation_type: "PHC Diagnostic Tele-Screening API Outage (<99.9% Uptime)",
        penalty_percentage: 2.0,
        cap_percentage: 12.0,
        grace_period_days: 0,
        calculation_method: "Deduction of 2% of monthly SLA payout per hour of critical system outage during operational PHC hours (8 AM - 8 PM)."
      },
      {
        violation_type: "ABDM Health Record Gateway Sync Failure (>2 Hours)",
        penalty_percentage: 1.0,
        cap_percentage: 5.0,
        grace_period_days: 1,
        calculation_method: "₹2,000 per day for un-synced patient record queue exceeding 100 entries."
      },
      {
        violation_type: "Clinical Diagnostic Sensitivity Breach (<95% Audit Precision)",
        penalty_percentage: 5.0,
        cap_percentage: 15.0,
        grace_period_days: 0,
        calculation_method: "Immediate suspension of algorithm licensing fee component and mandatory retraining period."
      }
    ],
    liquidated_damages_per_day: 20000,
    maximum_liability_percentage: 10.0,
    performance_security_percentage: 5.0,
    payment_hold_percentage: 15.0,
    dispute_resolution_process: [
      "Stage 1: Technical review by State Health Mission Dispute Redressal Cell.",
      "Stage 2: Conciliation by Mission Director (NHM).",
      "Stage 3: Binding Arbitration under Indian Arbitration and Conciliation Act 1996."
    ]
  },

  general: {
    penalty_clauses: [
      {
        violation_type: "Service Availability & API Response Latency Breach",
        penalty_percentage: 1.0,
        cap_percentage: 10.0,
        grace_period_days: 2,
        calculation_method: "Deduction of 1% monthly payout for every 1% drop in service availability below 99.0%."
      },
      {
        violation_type: "Milestone Delivery Delay",
        penalty_percentage: 0.5,
        cap_percentage: 10.0,
        grace_period_days: 7,
        calculation_method: "0.5% of milestone value per week of unexcused delay per GFR guidelines."
      },
      {
        violation_type: "Data Security or Privacy Protocol Non-Compliance",
        penalty_percentage: 5.0,
        cap_percentage: 20.0,
        grace_period_days: 0,
        calculation_method: "Immediate penalty of 5% contract value + indemnity against third-party DPDPA liability."
      }
    ],
    liquidated_damages_per_day: 10000,
    maximum_liability_percentage: 10.0,
    performance_security_percentage: 3.0,
    payment_hold_percentage: 10.0,
    dispute_resolution_process: [
      "Stage 1: Executive Escalation to Nodal Officer within 15 days.",
      "Stage 2: Arbitration under Indian Arbitration and Conciliation Act, 1996."
    ]
  }
};

/**
 * Calculate SLA Penalty Tiers, Liquidated Damages, and Dispute Workflows
 * @param {Object|String} contractData 
 * @returns {Promise<Object>} SLA Calculator JSON Schema
 */
async function calculateSLAPenalties(contractData) {
  const contractStr = typeof contractData === "object" ? JSON.stringify(contractData) : String(contractData || "");
  const domain = detectDomain(contractStr);

  if (process.env.OPENAI_API_KEY && OpenAI) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are an Indian Public Procurement Legal Expert specializing in Contract SLAs, Liquidated Damages (GFR Rule 175), and Dispute Resolution under Indian Law.
Analyze the following contract specifications and return a structured JSON SLA penalty schedule.

Contract Data:
${contractStr}

STRICT JSON OUTPUT FORMAT (DO NOT INCLUDE ANY TEXT OUTSIDE JSON):
{
  "penalty_clauses": [
    {
      "violation_type": "Description of violation",
      "penalty_percentage": 1.0,
      "cap_percentage": 10.0,
      "grace_period_days": 1,
      "calculation_method": "Detailed calculation formula"
    }
  ],
  "liquidated_damages_per_day": 15000,
  "maximum_liability_percentage": 10.0,
  "performance_security_percentage": 3.0,
  "payment_hold_percentage": 10.0,
  "dispute_resolution_process": [
    "Stage 1...",
    "Stage 2...",
    "Stage 3..."
  ]
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      if (parsed && Array.isArray(parsed.penalty_clauses) && parsed.liquidated_damages_per_day) {
        return parsed;
      }
    } catch (e) {
      console.warn("OpenAI SLA Calculator failed or missing key, falling back to Demo Mode:", e.message);
    }
  }

  // Demo Fallback Mode
  await sleep(1500);
  return DEMO_SLAS[domain] || DEMO_SLAS.general;
}

module.exports = { calculateSLAPenalties };
