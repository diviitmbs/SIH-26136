// backend/src/ai/devil_advocate.js
// Advanced AI Module: Devil's Advocate Adversarial Evaluation Engine
// Performs dual-perspective (Optimist vs Skeptic) adversarial audit on procurement proposals under GFR 2017 & CVC guidelines

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
const DEMO_DEVIL_ANALYSIS = {
  infrastructure: {
    optimist_view: {
      strengths: [
        "Leverages cutting-edge computer vision on existing municipal patrol fleet, avoiding capital expenditure on dedicated inspection vehicles.",
        "Demonstrates direct integration capability with municipal PWD work-order ERP, reducing manual audit latency by ~85%.",
        "Strong alignment with MoHUA Smart Cities Mission priorities and Make in India public procurement guidelines.",
        "DPIIT startup status allows relaxation of prior turnover/experience criteria under GFR Rule 173(i) without compromising technical quality."
      ],
      approval_recommendation: "Strongly recommend approval for 90-day pilot deployment across 5 high-density ward zones subject to milestone-based SLA sign-off.",
      confidence_score: 88.5
    },
    skeptic_view: {
      concerns: [
        "Edge camera mounting stability under high monsoon vibration and dust conditions has not been stress-tested across 10,000+ continuous lane-km.",
        "High reliance on third-party cloud API bandwidth in low-connectivity outer ward areas could trigger data sync delays.",
        "Vendor's financial liquidity buffer (₹15 Lakhs cash reserve) presents mild risk if hardware replacements are required simultaneously.",
        "Absence of CERT-In cybersecurity audit certificate for edge-to-cloud telemetry transmission protocol."
      ],
      rejection_recommendation: "Request mandatory technical revision requiring CERT-In security clearance and escrow deposit of core AI inference model code before final award.",
      risk_flags: [
        "Hardware Longevity Vulnerability (IP67 certification required for monsoon operations)",
        "Cybersecurity & GIS Spatial Data Sovereignty Compliance",
        "Financial Liquidity & Service Maintenance Risk"
      ]
    },
    final_judgment: {
      verdict: "Request_Revision",
      confidence_percentage: 84.0,
      key_decision_factors: [
        "High innovation value and cost-efficiency ratio vs conventional manual road audits.",
        "Critical need for CERT-In cybersecurity audit certification prior to production ERP sync.",
        "Need for clear hardware replacement SLA response timelines during monsoon peak season."
      ],
      conditions_for_approval: [
        "Submission of CERT-In empaneled agency cybersecurity audit certificate within 15 days of conditional letter of intent.",
        "Execution of Source Code & Model Weights Escrow Agreement with empaneled escrow agent.",
        "Increase of Performance Bank Guarantee (PBG) to 3% of contract value as per MoF guidelines."
      ],
      mitigation_requirements: [
        "Contractor must maintain minimum 10% spare IP67 optical camera units in local ward depot for immediate swap-outs.",
        "Local edge storage caching buffer must retain up to 72 hours of un-synced telemetry during cellular network blackouts."
      ]
    }
  },

  healthcare: {
    optimist_view: {
      strengths: [
        "High clinical screening accuracy demonstrated in pilot trials with ICMR empaneled hospital validation.",
        "Complete ABDM M1, M2, M3 integration ensuring seamless patient health ID (ABHA) record sync.",
        "Multi-lingual voice interface empowers rural ASHA and ANM healthcare workers with minimal training."
      ],
      approval_recommendation: "Approve deployment across target rural PHC network with quarterly clinical audit oversight.",
      confidence_score: 91.0
    },
    skeptic_view: {
      concerns: [
        "Data privacy compliance under DPDPA 2023 requires rigorous consent management architecture for patient PHI.",
        "Dependence on local medical officer validation for AI clinical decision support could create bottleneck in high-volume PHCs."
      ],
      rejection_recommendation: "Hold approval until DPDPA consent workflow audit is completed.",
      risk_flags: [
        "Patient Health Information Privacy Risk (DPDPA 2023 compliance)",
        "Clinical Liability & Medical Officer Signature Dependency"
      ]
    },
    final_judgment: {
      verdict: "Request_Revision",
      confidence_percentage: 86.5,
      key_decision_factors: [
        "Proven clinical utility vs regulatory compliance paperwork safeguards.",
        "DPDPA 2023 data consent workflow verification."
      ],
      conditions_for_approval: [
        "Provide third-party DPDPA privacy impact assessment certificate.",
        "Sign explicit Clinical Liability Disclaimer placing final diagnostic authority on registered medical officers."
      ],
      mitigation_requirements: [
        "Implement zero-knowledge encryption for stored patient diagnostic images.",
        "Conduct mandatory bi-weekly retraining for PHC medical staff."
      ]
    }
  },

  general: {
    optimist_view: {
      strengths: [
        "Innovative technological solution resolving long-standing public administrative inefficiencies.",
        "Full alignment with General Financial Rules (GFR 2017) and Make in India procurement mandates.",
        "Competitive financial pricing model offering measurable return on public investment."
      ],
      approval_recommendation: "Recommend proceeding to pilot contract execution following standard due diligence.",
      confidence_score: 85.0
    },
    skeptic_view: {
      concerns: [
        "Vendor operational scalability across multi-district deployments remains unproven.",
        "Potential integration friction with legacy state government software systems."
      ],
      rejection_recommendation: "Conditional approval contingent upon sandbox integration test success.",
      risk_flags: [
        "Operational Scale Risk",
        "Legacy API Integration Interoperability"
      ]
    },
    final_judgment: {
      verdict: "Approve",
      confidence_percentage: 82.0,
      key_decision_factors: [
        "Strong technical proposal meeting all mandatory RFP eligibility criteria.",
        "Reasonable risk profile with adequate financial safeguards."
      ],
      conditions_for_approval: [
        "Submission of required Performance Bank Guarantee (PBG).",
        "Completion of sandbox API integration testing within 30 days."
      ],
      mitigation_requirements: [
        "Establish monthly joint steering committee reviews.",
        "Maintain dedicated technical support team during operational term."
      ]
    }
  }
};

/**
 * Perform adversarial Devil's Advocate evaluation on a government procurement proposal
 * @param {Object|String} proposalData 
 * @returns {Promise<Object>} Devil's Advocate Analysis JSON Schema
 */
async function runDevilAdvocateAnalysis(proposalData) {
  const proposalStr = typeof proposalData === "object" ? JSON.stringify(proposalData) : String(proposalData || "");
  const domain = detectDomain(proposalStr);

  if (process.env.OPENAI_API_KEY && OpenAI) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are a Senior Indian Public Procurement Evaluator & CVC Vigilance Audit Expert.
Perform an adversarial "Devil's Advocate" evaluation on the following vendor proposal.

Proposal Data:
${proposalStr}

Your response must pit an Optimist Advocate (highlighting innovation, GFR compliance, value for money) against a Skeptic Vigilance Audit Advocate (highlighting risk flags, technical edge cases, vendor fragility, legal liabilities).
Then deliver a balanced Final Judgment.

STRICT JSON OUTPUT FORMAT (DO NOT INCLUDE ANY TEXT OUTSIDE JSON):
{
  "optimist_view": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "approval_recommendation": "Detailed recommendation string",
    "confidence_score": 88.5
  },
  "skeptic_view": {
    "concerns": ["Concern 1", "Concern 2", "Concern 3"],
    "rejection_recommendation": "Detailed skeptic recommendation string",
    "risk_flags": ["Flag 1", "Flag 2"]
  },
  "final_judgment": {
    "verdict": "Request_Revision",
    "confidence_percentage": 84.0,
    "key_decision_factors": ["Factor 1", "Factor 2"],
    "conditions_for_approval": ["Condition 1", "Condition 2"],
    "mitigation_requirements": ["Requirement 1", "Requirement 2"]
  }
}

Note:
- verdict MUST BE EXACTLY ONE OF: "Approve", "Reject", or "Request_Revision".
- Ensure Indian laws, GFR 2017 rules, CVC audit mandates, and Make in India guidelines are reflected throughout.`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      if (parsed && parsed.optimist_view && parsed.skeptic_view && parsed.final_judgment) {
        return parsed;
      }
    } catch (e) {
      console.warn("OpenAI Devil's Advocate failed or missing key, falling back to Demo Mode:", e.message);
    }
  }

  // Demo Fallback Mode
  await sleep(1500);
  return DEMO_DEVIL_ANALYSIS[domain] || DEMO_DEVIL_ANALYSIS.general;
}

module.exports = { runDevilAdvocateAnalysis };
