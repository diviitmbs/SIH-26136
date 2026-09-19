// backend/src/ai/rfp_generator.js
// Advanced AI Module: Request for Proposal (RFP) Generator
// Tier-1 Public Procurement Tender Drafting & GFR 2017 Specification Synthesis Engine

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
const DEMO_RFPS = {
  infrastructure: {
    rfp_title: "Request for Proposal for Supply, Installation, and Commissioning of AI-Powered Road Defect & Pothole Monitoring System across Municipal Road Network",
    rfp_id: "RFP/MH-BMC/2026/AI-INFRA-089",
    executive_summary: "The Municipal Corporation invites competitive bids from DPIIT-registered Startups and Empaneled System Integrators for implementing an edge-computer vision driven automated road surface inspection pipeline. The system will ingest real-time optical feed from municipal patrol vehicles to detect potholes, cracks, and road degradation with high spatial precision, integrating directly with the ULB PWD work-order ERP.",
    technical_specifications: [
      "Edge Camera Sensor Array: IP67-rated 4K optical sensors mounted on patrol fleet with dual GPS/GIS telemetry geotagging (<0.5m accuracy).",
      "Real-Time Defect Classification: On-device or cloud inference for detecting Potholes, Alligator Cracks, Rutting, and Ravelling with ≥90% recall.",
      "Work-Order ERP Gateway: Automated conversion of verified defects into actionable PWD maintenance tickets within 4 hours.",
      "Sovereign Cloud Data Lake: OpenGeo/OGC compliant geospatial data storage hosted on MeitY-empaneled cloud within India.",
      "Public Transparency Dashboard: Real-time map view of defect detection, repair status, and contractor SLA compliance."
    ],
    eligibility_criteria: [
      { criterion: "DPIIT Recognized Startup or Registered Tech Vendor in India with minimum 2 years operational history", mandatory: true, weight_percentage: 20 },
      { criterion: "Proven deployment of computer vision / AI object detection models in smart city or civic infrastructure projects", mandatory: true, weight_percentage: 30 },
      { criterion: "Minimum average annual turnover of ₹50 Lakhs over the last 2 financial years (relaxed for DPIIT Startups per GFR Rule 173)", mandatory: false, weight_percentage: 20 },
      { criterion: "ISO 27001 Information Security & ISO 9001 Quality Management Certification", mandatory: true, weight_percentage: 15 },
      { criterion: "Demonstrated local support presence in Maharashtra with 24/7 technical support response capability", mandatory: false, weight_percentage: 15 }
    ],
    evaluation_weightage: {
      technical: 70,
      financial: 20,
      experience: 10
    },
    submission_deadline: "2026-10-15T17:00:00+05:30",
    mandatory_documents: [
      "DPIIT Startup Recognition Certificate / Certificate of Incorporation",
      "Audited Financial Balance Sheets for FY 2023-24 & 2024-25",
      "GST Registration Certificate and Permanent Account Number (PAN)",
      "Technical Capability & Architecture Blueprint Document",
      "Earnest Money Deposit (EMD) Declaration Form / PBG Exemption Certificate"
    ],
    general_terms_conditions: [
      "Bidding is governed by General Financial Rules (GFR 2017) and Public Procurement Order (Preference to Make in India).",
      "Liquidated damages of 0.5% per week of delay shall be levied up to a maximum cap of 10% of contract value.",
      "Disputes shall be settled through arbitration under the Indian Arbitration and Conciliation Act, 1996, in Mumbai jurisdiction.",
      "Data sovereignty is non-negotiable; zero data shall be transmitted or stored on foreign servers."
    ]
  },

  healthcare: {
    rfp_title: "Request for Proposal for Deployment of AI-Driven Clinical Tele-Screening and Diagnostic Support Systems at Primary Health Centres (PHCs)",
    rfp_id: "RFP/KA-NHM/2026/HEALTH-042",
    executive_summary: "National Health Mission invites proposals for deploying AI-assisted diagnostic tools across rural PHCs. The platform will enable frontline healthcare workers (ASHAs/ANMs) to conduct automated screening for diabetic retinopathy, chest X-ray abnormalities, and maternal vitals, linking directly to the Ayushman Bharat Digital Mission (ABDM) health stacks.",
    technical_specifications: [
      "ABDM M1, M2, M3 Compliant Tele-Health Hub with Health ID (ABHA) creation and FHIR R4 schema interoperability.",
      "Offline-Capable AI Diagnostics: Low-latency local model inference for low-connectivity rural PHC environments.",
      "Multi-lingual Voice & UI Interface supporting Kannada, Hindi, and English for ASHA workers.",
      "HIPAA and DPDPA 2023 Data Encryption: AES-256 at rest, TLS 1.3 in transit with sovereign Indian key vault management.",
      "Tele-Consultation Escalation: Automated triage routing to district medical specialists upon critical anomaly detection."
    ],
    eligibility_criteria: [
      { criterion: "Registration as an Indian Healthcare Technology entity with CDSCO / ABDM sandbox certification", mandatory: true, weight_percentage: 30 },
      { criterion: "Clinical validation audit by recognized Indian medical institute (e.g., AIIMS/NIMHANS/ICMR)", mandatory: true, weight_percentage: 35 },
      { criterion: "Prior experience conducting digital health deployments across minimum 10 rural/tier-3 health facilities", mandatory: false, weight_percentage: 20 },
      { criterion: "Robust data security compliance including ISO 27001 and DPDPA privacy impact assessment", mandatory: true, weight_percentage: 15 }
    ],
    evaluation_weightage: {
      technical: 75,
      financial: 15,
      experience: 10
    },
    submission_deadline: "2026-10-20T17:00:00+05:30",
    mandatory_documents: [
      "ABDM Milestone Compliance Certificate",
      "CDSCO Medical Device / Software Registration",
      "ICMR or Empaneled Clinical Validation Test Reports",
      "Company Registration & GST Clearance",
      "Power of Attorney for Authorized Signatory"
    ],
    general_terms_conditions: [
      "Contract adherence governed by National Health Policy and DPDPA 2023 guidelines.",
      "Payment disbursed in 4 milestones tied to field deployment and clinical validation SLA thresholds.",
      "Arbitration in Bengaluru under Indian Arbitration and Conciliation Act, 1996."
    ]
  },

  general: {
    rfp_title: "Request for Proposal for Implementation of Smart Governance AI Analytics Platform",
    rfp_id: "RFP/GOI-MEITY/2026/GOV-015",
    executive_summary: "Invitation of proposals for building an AI-powered public procurement and governance intelligence engine. The solution will automate challenge structuring, tender drafting, and risk detection across central and state government departments.",
    technical_specifications: [
      "Natural Language Processing Engine capable of ingesting Indian government procurement guidelines and GFR 2017.",
      "Automated Market & Vendor Matchmaking using GeM and MSME database integration capabilities.",
      "Real-Time Fraud & Bias Detection analytics with explainable AI model outputs.",
      "Multi-tenant Cloud Architecture with role-based access control (RBAC) and SAML/SSO integration."
    ],
    eligibility_criteria: [
      { criterion: "Registered Indian Technology Entity with active DPIIT startup recognition or 3+ years experience", mandatory: true, weight_percentage: 30 },
      { criterion: "Demonstrated AI/ML model deployment experience in public sector or enterprise workflows", mandatory: true, weight_percentage: 40 },
      { criterion: "Compliance with MeitY Security Guidelines and CERT-In empanelment readiness", mandatory: true, weight_percentage: 30 }
    ],
    evaluation_weightage: {
      technical: 70,
      financial: 20,
      experience: 10
    },
    submission_deadline: "2026-10-30T17:00:00+05:30",
    mandatory_documents: [
      "Company Registration Certificate",
      "Technical Proposal & Solution Architecture Blueprint",
      "Financial Bid (BOQ) with Itemized Cost Breakdown in INR",
      "Non-Disclosure Agreement (NDA) Execution Form"
    ],
    general_terms_conditions: [
      "Governed by Ministry of Finance General Financial Rules (GFR 2017).",
      "Jurisdiction for dispute resolution rests with New Delhi Courts."
    ]
  }
};

/**
 * Generate a complete RFP specification document for Indian Government Procurement
 * @param {Object|String} challengeData
 * @returns {Promise<Object>} RFP JSON Schema
 */
async function generateRFP(challengeData) {
  const challengeStr = typeof challengeData === "object" ? JSON.stringify(challengeData) : String(challengeData || "");
  const domain = detectDomain(challengeStr);

  if (process.env.OPENAI_API_KEY && OpenAI) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are a Senior Indian Public Procurement Officer drafting a formal Request for Proposal (RFP) under General Financial Rules (GFR 2017).
Analyze the following challenge/project data and output a structured JSON RFP document.

Challenge/Project Data:
${challengeStr}

STRICT JSON OUTPUT FORMAT (DO NOT INCLUDE ANY TEXT OUTSIDE JSON):
{
  "rfp_title": "Full formal title of the RFP",
  "rfp_id": "Unique RFP Reference ID (e.g. RFP/MH-BMC/2026/AI-INFRA-089)",
  "executive_summary": "Comprehensive executive summary tailored to Indian public sector procurement",
  "technical_specifications": ["Spec 1", "Spec 2", "Spec 3", "Spec 4", "Spec 5"],
  "eligibility_criteria": [
    { "criterion": "Description", "mandatory": true/false, "weight_percentage": 25 }
  ],
  "evaluation_weightage": { "technical": 70, "financial": 20, "experience": 10 },
  "submission_deadline": "ISO date format (e.g., 2026-10-15T17:00:00+05:30)",
  "mandatory_documents": ["Doc 1", "Doc 2", "Doc 3"],
  "general_terms_conditions": ["Term 1", "Term 2", "Term 3"]
}

Ensure all terms adhere to Indian laws (GFR 2017, Public Procurement Order Make in India, DPDPA 2023, Arbitration Act 1996).`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      if (parsed && parsed.rfp_title && parsed.eligibility_criteria) {
        return parsed;
      }
    } catch (e) {
      console.warn("OpenAI RFP Generation failed or missing key, falling back to Demo Mode:", e.message);
    }
  }

  // Demo Fallback Mode
  await sleep(1500);
  const fallback = DEMO_RFPS[domain] || DEMO_RFPS.general;
  
  // Customizing fallback title/summary slightly if specific input was passed
  const customTitle = challengeData && challengeData.title 
    ? `Request for Proposal for ${challengeData.title} under Indian Procurement Guidelines`
    : fallback.rfp_title;

  return {
    ...fallback,
    rfp_title: customTitle
  };
}

module.exports = { generateRFP };
