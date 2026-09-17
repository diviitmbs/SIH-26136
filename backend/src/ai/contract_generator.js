// backend/src/ai/contract_generator.js
// Advanced AI Module: Contract Generator
// Tier-1 Public Procurement Master Agreement & SLA Synthesis Engine

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
const DEMO_CONTRACTS = {
  infrastructure: {
    contract_title: "Master Services & Pilot Deployment Agreement for AI Pothole Detection & Rapid Repair Automation",
    key_clauses: [
      "Clause 1 (Data Sovereignty & GIS Telemetry Ownership): All high-resolution spatial imagery, road surface point clouds, and defect telemetry collected within the municipal territory shall remain the exclusive sovereign property of the Municipal Corporation. The Contractor is granted a revocable, non-exclusive license solely for algorithm calibration during the pilot term.",
      "Clause 2 (Source Code Escrow & Open API Portability): Contractor shall deposit core API integration adapters and schema definitions with an empaneled escrow agent. All exported defect datasets must conform to OGC OpenGeo standard schemas without proprietary encryption or lock-in.",
      "Clause 3 (Subcontracting Restrictions): The Contractor shall not assign or subcontract any portion of edge camera installation or direct AI model inference without prior written sanction from the Municipal Commissioner.",
      "Clause 4 (Indemnification & Third-Party Patent Defense): The Contractor shall fully indemnify, hold harmless, and defend the Municipal Authority against any patent infringement, trade secret misappropriation, or vehicular liability claims arising directly from automated inspection equipment.",
      "Clause 5 (Termination for Default & Cure Period): If Contractor fails to maintain ≥90% detection precision or fails to remedy critical API downtime within 72 hours of written notice, the Authority reserves the right to terminate with immediate forfeiture of the Performance Bank Guarantee."
    ],
    sla_terms: [
      {
        metric: "Automated Defect Detection & Dispatch Latency",
        target: "≤ 4 hours from patrol vehicle pass to work-order generation",
        penalty: "0.5% invoice deduction per additional 2-hour delay, capped at 10% of monthly fee"
      },
      {
        metric: "AI False Positive Precision Threshold",
        target: "≥ 92% validated accuracy against physical field inspection",
        penalty: "₹500 per confirmed false-positive work order dispatched to PWD contractors"
      },
      {
        metric: "API & Live Dashboard Uptime",
        target: "≥ 99.5% monthly availability excluding scheduled maintenance",
        penalty: "1.0% deduction of monthly maintenance fee for every 0.1% degradation below 99.5%"
      },
      {
        metric: "Repair Confirmation SLA Verification",
        target: "Secondary verification run within 48 hours of contractor repair closure",
        penalty: "₹2,000 deduction per unverified closed ticket older than 72 hours"
      }
    ],
    payment_milestones: [
      {
        milestone: "Milestone 1: Architecture Blueprint & Sandbox API Integration",
        percentage: 20,
        deliverables: "Validated System Architecture Document, staging API connectors for municipal ERP, and security sign-off",
        trigger: "Formal approval by Municipal Chief Technology Officer"
      },
      {
        milestone: "Milestone 2: Hardware Provisioning & Fleet Retrofit",
        percentage: 30,
        deliverables: "Installation and calibration of IP67 edge cameras across 25 municipal patrol vehicles with GPS synchronization",
        trigger: "Physical joint inspection and 48-hour continuous telemetry sign-off"
      },
      {
        milestone: "Milestone 3: 90-Day Production Pilot & Target KPI Validation",
        percentage: 30,
        deliverables: "Autonomous processing of ≥10,000 lane-km, achieving ≥92% precision and <48hr repair workflow cycle",
        trigger: "Third-party audit report confirming SMART KPI fulfillment"
      },
      {
        milestone: "Milestone 4: Handover, Knowledge Transfer & Final Acceptance",
        percentage: 20,
        deliverables: "Comprehensive training of 40 ward engineers, full API documentation, and 12-month AMC roadmap",
        trigger: "Final Acceptance Certificate (FAC) signed by Municipal Commissioner"
      }
    ],
    legal_disclaimers: [
      "This Agreement is executed under and governed by the laws of India, adhering strictly to General Financial Rules (GFR 2017) and Public Procurement Order (Preference to Make in India).",
      "Any dispute or difference arising out of or in connection with this contract shall be submitted to arbitration under the Indian Arbitration and Conciliation Act, 1996, seated in the state capital.",
      "The Municipal Authority shall bear zero liability for vehicular accidents, traffic disruptions, or hardware theft sustained during unauthorized field operations by the Contractor's personnel."
    ]
  },

  healthcare: {
    contract_title: "Master Services Agreement for Clinical AI Diagnostic Tele-Screening & PHC Telemedicine Integration",
    key_clauses: [
      "Clause 1 (Patient Data Confidentiality & ABDM Compliance): Contractor warrants absolute adherence to Ayushman Bharat Digital Mission (ABDM) standards and the Digital Personal Data Protection Act (DPDPA 2023). Zero identifiable patient health data (PHI) shall be exported outside sovereign Indian borders.",
      "Clause 2 (Clinical Decision Support Disclaimer): The AI system is explicitly classified as a Clinical Decision Support (CDS) tool. Final diagnostic and therapeutic authority rests solely with registered medical officers; Contractor shall prominently display CDS disclaimers on all generated reports.",
      "Clause 3 (Continuous Algorithmic Fairness & Bias Auditing): Contractor must submit semi-annual algorithmic drift and demographic bias reports across gender, age, and caste distributions to the State Health Society.",
      "Clause 4 (Service Continuity & Disaster Recovery): Contractor guarantees RPO ≤ 1 hour and RTO ≤ 4 hours on sovereign MeitY-empaneled cloud infrastructure, with encrypted off-site geo-redundant backups."
    ],
    sla_terms: [
      {
        metric: "Diagnostic Screening Inference Turnaround",
        target: "≤ 60 seconds from image capture to annotated triage report",
        penalty: "₹250 penalty per screening batch exceeding 3 minutes without network anomaly justification"
      },
      {
        metric: "Screening Sensitivity for Critical Pathologies",
        target: "≥ 95% sensitivity against secondary radiologist review",
        penalty: "Mandatory algorithmic freeze and free recalibration audit if sensitivity drops below 94%"
      },
      {
        metric: "PHC Telemedicine Platform Uptime",
        target: "≥ 99.8% monthly uptime during PHC operating hours (08:00 - 18:00 IST)",
        penalty: "2% invoice deduction per hour of unscheduled operational downtime"
      }
    ],
    payment_milestones: [
      {
        milestone: "Milestone 1: Security Audit & ABDM Gateway Certification",
        percentage: 25,
        deliverables: "CERT-In clearance report, ABDM M1/M2/M3 compliance certificate, and PHC pilot configuration",
        trigger: "State Health Mission nodal officer approval"
      },
      {
        milestone: "Milestone 2: 40 PHC Hardware Rollout & ASHA Training",
        percentage: 30,
        deliverables: "Deployment of 40 biometric diagnostic tablets and bilingual training completion for 200 ASHA workers",
        trigger: "District Chief Medical Officer verified attendance and deployment log"
      },
      {
        milestone: "Milestone 3: 50,000 Patient Screenings & Clinical Audit",
        percentage: 25,
        deliverables: "Completion of 50,000 verified tele-screenings with ≥95% sensitivity and zero security incidents",
        trigger: "Institutional Ethics Committee validation sign-off"
      },
      {
        milestone: "Milestone 4: Annual AMC Sign-Off & Long-Term Scaling Plan",
        percentage: 20,
        deliverables: "Comprehensive epidemiological analytics dashboard, state EHR data export, and 3-year expansion blueprint",
        trigger: "Principal Secretary (Health) final milestone sign-off"
      }
    ],
    legal_disclaimers: [
      "All screening outputs represent algorithmic risk estimations and do not constitute independent medical diagnoses under the National Medical Commission Act.",
      "Contractor shall carry comprehensive Professional and Cyber Liability Insurance of not less than ₹5,00,00,000 (Five Crores INR) throughout the contract term."
    ]
  },

  general: {
    contract_title: "Master Services & Innovation Pilot Agreement for Public Sector Civic Technology Implementation",
    key_clauses: [
      "Clause 1 (Intellectual Property & Licensing): Pre-existing IP owned by the Startup shall remain the Startup's property. All bespoke modifications, municipal system integrations, and project-specific telemetry shall vest unconditionally in the Procuring Authority.",
      "Clause 2 (Confidentiality & Non-Disclosure): The Contractor agrees to maintain the strictest confidentiality regarding all civic, demographic, administrative, and strategic datasets disclosed during execution.",
      "Clause 3 (Warranty & Defect Liability): The Contractor provides a 12-month comprehensive warranty against software bugs, regression anomalies, and API breakages following final acceptance.",
      "Clause 4 (Liquidated Damages for Delay): In the event of unexcused milestone delay, liquidated damages at 0.5% of the total contract value per week of delay shall be recovered, up to a maximum of 10%."
    ],
    sla_terms: [
      {
        metric: "System Availability & Service Uptime",
        target: "≥ 99.5% availability measured on a 24x7x365 monthly basis",
        penalty: "1% bill deduction per 0.2% drop below threshold"
      },
      {
        metric: "Critical Incident Resolution Time (P1)",
        target: "≤ 4 hours from initial ticket notification",
        penalty: "₹5,000 per hour of delay beyond 4 hours"
      },
      {
        metric: "Routine Maintenance & Patch Window",
        target: "Restricted strictly to 01:00 - 05:00 IST Sundays with 48-hour prior advisory",
        penalty: "₹10,000 per unnotified daytime disruption"
      }
    ],
    payment_milestones: [
      {
        milestone: "Milestone 1: Project Inception & Technical Architecture Sign-Off",
        percentage: 20,
        deliverables: "Detailed Project Report (DPR), architecture schema, and test-case matrix",
        trigger: "Acceptance by Project Monitoring Unit"
      },
      {
        milestone: "Milestone 2: Alpha Deployment & Sandbox Verification",
        percentage: 30,
        deliverables: "Core system deployment in staging environment with verified integration test passes",
        trigger: "User Acceptance Testing (UAT) sign-off"
      },
      {
        milestone: "Milestone 3: Live Pilot Rollout & Operational Benchmark Pass",
        percentage: 30,
        deliverables: "End-to-end field deployment meeting 100% of baseline SLA targets for 60 consecutive days",
        trigger: "Steering Committee review and sign-off"
      },
      {
        milestone: "Milestone 4: Final Acceptance, Source Escrow & Knowledge Handover",
        percentage: 20,
        deliverables: "Comprehensive user documentation, staff training, and verified code escrow verification",
        trigger: "Final Acceptance Certificate (FAC)"
      }
    ],
    legal_disclaimers: [
      "This Agreement is enforceable under the laws of the Republic of India with exclusive jurisdiction in the competent courts of the state.",
      "Neither party shall be held responsible for delays resulting from Acts of God, civil commotion, or governmental moratoriums constituting Force Majeure."
    ]
  }
};

/**
 * Generates an end-to-end public procurement contract and SLA terms
 * @param {Object|string} challengeData - Challenge requirements, budget, timeline
 * @param {Object|string} startupData - Startup proposal, profile, capabilities
 * @returns {Promise<Object>} Contract terms matching schema
 */
async function generateContract(challengeData, startupData) {
  const apiKey = process.env.OPENAI_API_KEY;
  const challengeStr = typeof challengeData === "string" ? challengeData : JSON.stringify(challengeData || {});
  const startupStr = typeof startupData === "string" ? startupData : JSON.stringify(startupData || {});
  
  const detectedDomain = detectDomain(`${challengeStr} ${startupStr}`);

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [contract_generator]: GPT-4o-mini legal synthesis...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Senior Legal Counsel and Public Procurement Contracts Specialist specializing in government technology pilots under General Financial Rules (GFR 2017).
You draft legally binding, enforceable pilot procurement contracts, Service Level Agreements (SLAs), structured payment milestones, and legal disclaimers balancing startup agility with municipal risk mitigation.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Synthesize the challenge requirements and startup capabilities to establish the contractual scope and legal relationship.
2. Formulate an authoritative contract_title reflecting the exact technological domain and civic jurisdiction.
3. Draft 4 to 5 rigorous key_clauses addressing IP ownership (sovereign data vs startup IP), data security, code escrow, subcontracting restrictions, and default termination.
4. Establish 3 to 4 quantitative, highly enforceable sla_terms with specific metrics, target thresholds, and liquidated damages / penalty formulas.
5. Define 4 stage-gated payment_milestones totaling exactly 100%, linking payout percentages to tangible deliverables and explicit verification triggers.
6. Provide authoritative legal_disclaimers citing Indian law (GFR 2017, Indian Contract Act 1872, Arbitration and Conciliation Act).

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "contract_title": "string",
  "key_clauses": [
    "string"
  ],
  "sla_terms": [
    {
      "metric": "string",
      "target": "string",
      "penalty": "string"
    }
  ],
  "payment_milestones": [
    {
      "milestone": "string",
      "percentage": 25,
      "deliverables": "string",
      "trigger": "string"
    }
  ],
  "legal_disclaimers": [
    "string"
  ]
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a public procurement contract and SLA for the following challenge and startup proposal:\n\nCHALLENGE SPECIFICATION:\n${challengeStr}\n\nSTARTUP PROPOSAL:\n${startupStr}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ generateContract LIVE — contract:", parsed.contract_title);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI contract_generator failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [contract_generator]: Simulating AI contract generation...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_CONTRACTS[detectedDomain] || DEMO_CONTRACTS.general;

  return {
    mode: "demo",
    contract_title: fallback.contract_title,
    key_clauses: fallback.key_clauses,
    sla_terms: fallback.sla_terms,
    payment_milestones: fallback.payment_milestones,
    legal_disclaimers: fallback.legal_disclaimers
  };
}

module.exports = { generateContract };
