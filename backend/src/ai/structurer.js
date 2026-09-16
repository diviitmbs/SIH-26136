// backend/src/ai/structurer.js
// AI Engine 1: Challenge Structurer — Maximum Ability Rewrite
// Chain-of-Thought reasoning | Strict JSON enforcement | Intelligent demo fallback

// ─────────────────────────────────────────────────────────────
// SDK IMPORT (graceful — never crashes if absent)
// ─────────────────────────────────────────────────────────────
let OpenAI = null;
try { OpenAI = require("openai").OpenAI; } catch (e) { OpenAI = null; }

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Lightweight keyword-to-domain classifier */
function detectDomain(text) {
  const t = text.toLowerCase();
  if (t.match(/pothole|road|bridge|infrastructure|pavement|highway/))  return "infrastructure";
  if (t.match(/hospital|health|patient|clinic|doctor|medicine|ehr/))   return "healthcare";
  if (t.match(/garbage|waste|trash|sanitation|landfill|recycl/))       return "waste_management";
  if (t.match(/traffic|congestion|signal|junction|commute|transport/)) return "traffic";
  if (t.match(/water|flood|drain|sewage|pipeline/))                    return "water";
  if (t.match(/school|education|student|teacher|learning/))            return "education";
  if (t.match(/power|energy|electricity|solar|grid/))                  return "energy";
  return "general";
}

// ─────────────────────────────────────────────────────────────
// DEMO DATA — domain-keyed, highly realistic, fully structured
// ─────────────────────────────────────────────────────────────
const DEMO_DATA = {
  infrastructure: {
    title: "AI-Powered Pothole Detection & Rapid Repair Management System",
    problem_statement: "Urban road infrastructure in the target ward suffers severe degradation, with 200–350 potholes reported monthly. Each incident causes avg vehicle damage of ₹3,200, raises accident rates by 18%, and adds 35+ minutes of daily commute delay for citizens.",
    objective: "Deploy an AI-driven detection and work-order platform to cut avg repair time from 14 days to <48 hours, achieve ≥92% detection accuracy, and resolve 90%+ of citizen complaints within 6 months.",
    smart_kpis: [
      "Avg pothole repair cycle time (Baseline: 14 days → Target: <48 hours)",
      "AI detection accuracy (Baseline: N/A → Target: ≥92%)",
      "Citizen complaint resolution rate (Baseline: 40% → Target: ≥90%)",
      "Road Quality Index score (Baseline: 42/100 → Target: ≥65/100)",
      "Cost-per-repair reduction (Baseline: ₹8,400 → Target: ≤₹5,000)"
    ],
    requirements: [
      "Computer-vision pipeline on Android/iOS for crowdsourced pothole mapping with GPS tagging",
      "Automated work-order generation with contractor dispatch and SLA tracking",
      "Real-time repair-status dashboard for ward officers with heat-map overlay",
      "Two-way citizen feedback via WhatsApp/SMS with acknowledgement receipt",
      "REST API integration layer for existing municipal ERP/SAP systems"
    ],
    risks: [
      { risk: "Low smartphone adoption among field staff", mitigation: "Provide offline PWA; run 2-day hands-on onboarding workshops for all field teams" },
      { risk: "Integration friction with legacy municipal ERP", mitigation: "Deliver a middleware adapter with standard REST/SOAP bridge; budget 4-week integration sprint" },
      { risk: "Monsoon season disrupts pilot measurement window", mitigation: "Front-load detection phase pre-monsoon; schedule repair KPI measurement post-monsoon" },
      { risk: "Contractor resistance to digital work orders", mitigation: "Mandate e-WO compliance in revised SLA; introduce payment-on-verified-completion incentive" }
    ],
    estimated_budget_inr: 4200000,
    estimated_timeline_months: 6,
    refinement_questions: [
      "What is the ward's current annual road-maintenance budget and carry-over balance?",
      "How many potholes were reported and resolved in the last 3 months (for KPI baseline calibration)?",
      "Is there an existing GIS/GPS mapping system or does one need to be provisioned from scratch?",
      "What is the average contractor response time under the current maintenance SLA?"
    ]
  },
  healthcare: {
    title: "Intelligent Patient Flow & Queue Management Platform for Government OPDs",
    problem_statement: "Government hospitals handle 800–1,200 OPD visits daily via a single manual token system, producing 3.5-hour avg wait times, 22% patient dropout, and severe diagnostic throughput loss. Overburdened front desks lack real-time department-load visibility, causing uneven patient distribution.",
    objective: "Implement predictive queue management and digital triage to reduce avg wait time from 3.5 hrs to <60 min, increase daily patient throughput by 35%, and achieve a citizen satisfaction score ≥80/100 within 6 months.",
    smart_kpis: [
      "Avg outpatient waiting time (Baseline: 3.5 hrs → Target: <60 min)",
      "Daily patient throughput (Baseline: 900 → Target: ≥1,215 patients)",
      "Patient satisfaction index (Baseline: 54/100 → Target: ≥80/100)",
      "Department load variance (Baseline: ±45% → Target: ±15%)",
      "No-show/dropout rate (Baseline: 22% → Target: <10%)"
    ],
    requirements: [
      "Digital token issuance via kiosk, WhatsApp, and web portal with live queue display screens",
      "ML-based patient-surge prediction (72-hour rolling forecast) for staff rostering",
      "Department load-balancing dashboard for charge nurses and hospital administrators",
      "Integration with existing HMIS/NHM health management information systems via HL7 FHIR",
      "Bilingual (Hindi + regional language) interface with voice-guided navigation for low-literacy patients"
    ],
    risks: [
      { risk: "Staff reluctance to abandon manual workflows", mitigation: "Conduct role-specific change-management workshops; appoint floor change-champions" },
      { risk: "Power/internet outages at facility", mitigation: "Deploy offline-first PWA with 4G cellular backup kiosks; ensure auto-sync on reconnect" },
      { risk: "HMIS integration blocked by IT security policy", mitigation: "Coordinate NIC/NHM approval during procurement; use FHIR R4 standard from day one" },
      { risk: "Low patient literacy hinders kiosk self-service", mitigation: "Station 'Digital Helpers' for first 30 days; add audio-prompt capability to kiosk UI" }
    ],
    estimated_budget_inr: 5800000,
    estimated_timeline_months: 6,
    refinement_questions: [
      "What is the current daily OPD footfall and how does it break down by peak vs off-peak hours?",
      "Which HMIS platform (Arogya, CPIS, custom) is in use and does it expose an API layer?",
      "What is the current avg first-consultation-to-discharge cycle time in minutes?",
      "Is there existing LAN/Wi-Fi infrastructure inside the hospital premises for kiosk connectivity?"
    ]
  },
  waste_management: {
    title: "IoT-Enabled Smart Waste Collection & Dynamic Route Optimisation Platform",
    problem_statement: "The municipal corporation manages 480 collection points across 32 wards using fixed routes set in 2017. Current coverage is 71%, with 140+ missed-collection complaints per week, 34% vehicle idle time, and increasing landfill overflow due to un-monitored bin fill levels.",
    objective: "Deploy IoT bin monitoring and AI route-optimisation to achieve 95% waste collection coverage, cut vehicle idle time by 40%, and reduce weekly missed-collection complaints to <20 within 6 months.",
    smart_kpis: [
      "Waste collection coverage rate (Baseline: 71% → Target: ≥95%)",
      "Vehicle idle/dead-run time (Baseline: 34% → Target: <20%)",
      "Weekly missed-collection complaints (Baseline: 140 → Target: <20)",
      "Avg bin fill-level at collection time (Baseline: 48% → Target: 70–85%)",
      "Fuel cost per tonne collected (Baseline: ₹340 → Target: <₹220)"
    ],
    requirements: [
      "Solar-powered IoT fill-level sensors with NB-IoT/LoRa connectivity for all bins",
      "AI dynamic route engine refreshed every 4 hours based on real-time fill data",
      "Fleet tracking dashboard with GPS telemetry and driver mobile app (offline-capable)",
      "Automated citizen complaint portal with 24-hour SLA tracking and escalation alerts",
      "Analytics module for daily/weekly waste-generation trend reporting for ward-level planning"
    ],
    risks: [
      { risk: "IoT sensor theft or vandalism in public areas", mitigation: "Use tamper-evident enclosures; GPS asset-track sensors; include in hardware insurance policy" },
      { risk: "Network dead zones in dense or slum areas", mitigation: "Deploy LoRaWAN gateways as fallback in low-connectivity zones; pilot in best-coverage ward first" },
      { risk: "Driver adoption of mobile route app", mitigation: "Offline-capable app with regional-language UI; link on-time completion to monthly performance bonus" },
      { risk: "Hardware procurement delays via GeM", mitigation: "Use GeM-listed IoT vendors; maintain 15% sensor buffer inventory; pre-order 6 weeks ahead" }
    ],
    estimated_budget_inr: 6500000,
    estimated_timeline_months: 8,
    refinement_questions: [
      "What is the total number of waste collection points and current fleet size (vehicles)?",
      "Is there existing GPS tracking on the fleet or does it need to be provisioned as part of this contract?",
      "What is the average daily waste volume in tonnes and what is the current landfill lifespan estimate?",
      "Does the ULB have a central IT room or command centre for hosting and operating the platform?"
    ]
  },
  traffic: {
    title: "Adaptive AI Traffic Signal Control & Congestion Management System",
    problem_statement: "The city's 46 signalised intersections run on fixed-cycle timings from 2014, causing peak-hour queue lengths of 800+ metres, avg commute delays of 42 minutes, emergency vehicle response times 28% above national norms, and a 19% YoY rise in intersection accidents.",
    objective: "Implement computer-vision adaptive signal control to reduce peak-hour commute delay by 30%, cut avg intersection wait from 4.2 to <2.5 minutes, and improve emergency corridor clearance to <90 seconds within 9 months.",
    smart_kpis: [
      "Avg peak-hour commute delay (Baseline: 42 min → Target: <30 min)",
      "Avg intersection waiting time (Baseline: 4.2 min → Target: <2.5 min)",
      "Emergency vehicle clearance time (Baseline: 7.2 min → Target: <1.5 min)",
      "Intersection accident rate (Baseline: +19% YoY → Target: −25% reduction)",
      "Signal controller uptime (Baseline: 78% → Target: ≥99%)"
    ],
    requirements: [
      "Edge-AI cameras with vehicle-count and queue-length detection at pilot junctions",
      "Centralised adaptive signal timing engine with sub-10-second update cycles",
      "Priority corridor management module for ambulances and fire engines",
      "Operator SCADA dashboard with real-time incident alerts and remote override capability",
      "Integration with NCRB accident reporting portal and existing city traffic management centre"
    ],
    risks: [
      { risk: "Power interruptions at junction controller boxes", mitigation: "Install 4-hour UPS backup; auto-failover to pre-programmed safe fixed-time plan" },
      { risk: "Camera vandalism or monsoon visibility degradation", mitigation: "IP67 housings; IR night vision; contractual 48-hour field-maintenance SLA" },
      { risk: "Traffic police operational resistance to AI control", mitigation: "Co-design override controls with police; include mandatory police training in deployment plan" },
      { risk: "Public privacy concerns from street cameras", mitigation: "On-edge anonymisation; zero PII storage; publish data policy; comply with MeitY guidelines" }
    ],
    estimated_budget_inr: 8900000,
    estimated_timeline_months: 9,
    refinement_questions: [
      "How many junctions are targeted in Phase 1 and what is the current controller brand/model?",
      "Is there existing fibre or wireless backhaul connectivity at the target junctions?",
      "What emergency vehicle priority protocols, if any, are currently in use at these junctions?",
      "Has the city traffic police been consulted and what are their primary operational concerns?"
    ]
  },
  general: {
    title: "Digital Innovation Platform for Civic Service Delivery Improvement",
    problem_statement: "The government body faces significant operational inefficiencies in civic service delivery, resulting in high citizen complaint volumes, extended resolution times, and poor satisfaction scores. The absence of real-time monitoring causes sub-optimal resource allocation and accountability gaps.",
    objective: "Procure a scalable technology solution that improves the primary service delivery KPI by at least 50%, achieves citizen satisfaction ≥80/100, and establishes a real-time monitoring framework within 6 months.",
    smart_kpis: [
      "Primary service KPI improvement (Baseline: Current → Target: 50% improvement)",
      "Citizen complaint resolution time (Baseline: 10 days → Target: <3 days)",
      "Citizen satisfaction score (Baseline: 52/100 → Target: ≥80/100)",
      "Digital adoption rate (Baseline: 0% → Target: ≥60% of target users)",
      "Cost per service transaction (Baseline: ₹320 → Target: <₹180)"
    ],
    requirements: [
      "Cloud-hosted platform with 99.5% SLA uptime guarantee on NIC/Meghraj infrastructure",
      "Mobile-first citizen interface (Android/iOS) with offline-capable operation",
      "Real-time analytics dashboard for departmental officers with drill-down reporting",
      "Secure API integration layer for legacy government system connectivity (REST/SOAP)",
      "Multi-lingual support for at least 3 regional Indian languages"
    ],
    risks: [
      { risk: "Low digital literacy among target user base", mitigation: "Assisted onboarding at government service centres; community awareness drives with NGO support" },
      { risk: "Integration complexity with legacy IT systems", mitigation: "Standard API gateways; allocate 4-week integration buffer in timeline" },
      { risk: "Data security and sovereignty concerns", mitigation: "Host on NIC/Meghraj cloud; conduct CERT-In empanelled security audit pre-launch" },
      { risk: "Change management resistance from department staff", mitigation: "Structured training programme; designate departmental change champions; link to performance reviews" }
    ],
    estimated_budget_inr: 3500000,
    estimated_timeline_months: 6,
    refinement_questions: [
      "What is the current measurable baseline metric for the primary service delivery problem?",
      "Which legacy IT systems must the new solution integrate with, and do they have API access?",
      "What is the target citizen population size and their avg digital literacy level?",
      "What is the approved budget envelope and procurement timeline for this initiative?"
    ]
  }
};

// ─────────────────────────────────────────────────────────────
// MAIN FUNCTION (signature unchanged)
// ─────────────────────────────────────────────────────────────
async function structureChallenge(problem) {
  const apiKey         = process.env.OPENAI_API_KEY;
  const hasKey         = apiKey && apiKey !== "paste_your_key_here" && apiKey.trim() !== "";
  const detectedDomain = detectDomain(problem);

  // ── LIVE MODE ────────────────────────────────────────────────
  if (hasKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [structurer]: GPT-4o-mini chain-of-thought analysis...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Tier-1 Government Procurement Consultant with 25 years of experience
structuring public-sector innovation challenges for Indian ministries, ULBs, and state departments.

CHAIN-OF-THOUGHT — follow these steps internally before producing output:
1. Identify the civic domain (infrastructure / healthcare / waste_management / traffic / water / education / energy / general).
2. Expand the raw problem into a precise 2–3 sentence crisis description with quantified impact.
3. Formulate one measurable, time-bound objective with explicit improvement targets.
4. Generate exactly 5 SMART KPIs: each must name Metric, Baseline, and Target.
5. List exactly 5 technical/functional requirements a startup MUST fulfil.
6. Identify 4 domain-specific risks; for each write a concrete mitigation action.
7. Estimate a realistic Indian government pilot budget (INR integer) and timeline (months integer).
8. Write 4 sharp refinement questions a procurement officer must answer before issuing an RFP.

OUTPUT RULES — CRITICAL:
- Return ONLY valid JSON. No markdown fences, no prose outside JSON.
- Match this schema EXACTLY. Do not add or rename keys.
- All numbers must be raw JSON numbers, not quoted strings.

REQUIRED JSON SCHEMA:
{
  "detected_domain": "string",
  "confidence_score": 0.93,
  "challenge": {
    "title": "string (max 90 chars, professional title case)",
    "problem_statement": "string (2–3 sentences, quantified impact)",
    "objective": "string (measurable, time-bound, starts with an action verb)",
    "smart_kpis": ["Metric Name (Baseline: X → Target: Y)"],
    "requirements": ["string"],
    "risks": [{"risk": "string", "mitigation": "string"}],
    "estimated_budget_inr": 4500000,
    "estimated_timeline_months": 6
  },
  "refinement_questions": ["string?"]
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: `Structure this government procurement challenge:\n\n${problem}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ structureChallenge LIVE — domain:", parsed.detected_domain);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI structurer failed, falling back to demo:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [structurer]: simulating AI thinking...");
    await sleep(1500);
  }

  // ── DEMO MODE ────────────────────────────────────────────────
  const demo = DEMO_DATA[detectedDomain] || DEMO_DATA.general;

  return {
    mode: "demo",
    detected_domain: detectedDomain,
    confidence_score: detectedDomain === "general" ? 0.61 : 0.88,
    challenge: {
      title:                     demo.title,
      problem_statement:         `Context: ${problem}. ${demo.problem_statement}`,
      objective:                 demo.objective,
      smart_kpis:                demo.smart_kpis,
      requirements:              demo.requirements,
      risks:                     demo.risks,
      estimated_budget_inr:      demo.estimated_budget_inr,
      estimated_timeline_months: demo.estimated_timeline_months
    },
    refinement_questions: demo.refinement_questions
  };
}

module.exports = { structureChallenge };