// backend/src/ai/market_scanner.js
// Advanced AI Module: Market Scanner
// Tier-1 Global GovTech & Civic Innovation Horizon Scanning Engine

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
const DEMO_MARKET_TRENDS = {
  infrastructure: {
    emerging_technologies: [
      "Edge TensorRT Computer Vision models on low-power vehicle dashcams performing sub-50ms road distress segmentation",
      "Drone-mounted LiDAR point-cloud photogrammetry for sub-millimeter bridge deck deflection and crack measurement",
      "Satellite Synthetic Aperture Radar (InSAR) for millimeter-scale municipal ground subsidence monitoring",
      "Acoustic asphalt resonance sensing embedded in municipal sanitation fleet tires for subsurface void detection"
    ],
    top_global_competitors: [
      "RoadBotics by Michelin (USA / Global - AI road surface condition mapping)",
      "Hayden AI (USA - Mobile camera vision sensors on municipal transit buses)",
      "Vianova (France - Urban mobility & road infrastructure intelligence platform)",
      "EyeVi Technologies (Estonia - On-demand mobile digital-twin road scanning)"
    ],
    recommended_tech_stack_updates: [
      {
        technology_area: "Edge ML Inference",
        current_industry_standard: "YOLOv8 / OpenCV on server GPU",
        next_gen_recommendation: "YOLOv11-Edge quantized with ONNX Runtime & NVIDIA DeepStream pipeline",
        strategic_advantage: "Cuts cloud bandwidth transmission costs by 85% by performing inference on patrol vehicles."
      },
      {
        technology_area: "Geospatial Indexing",
        current_industry_standard: "PostGIS lat/lng bounding box indexing",
        next_gen_recommendation: "Uber H3 Hexagonal Hierarchical Spatial Indexing",
        strategic_advantage: "Accelerates cross-fleet deduplication and municipal ward clustering by 12x."
      }
    ],
    market_maturity_level: "Rapidly Accelerating / Early Growth"
  },

  healthcare: {
    emerging_technologies: [
      "On-device Small Language Models (SLMs) running locally on Android tablets for vernacular patient anamnesis",
      "Multimodal Foundation Models (Med-PaLM / BioGPT architectures) for simultaneous chest X-ray and clinical lab synthesis",
      "Zero-Knowledge Proofs (ZKPs) for verifiable citizen immunization and epidemiological consent sharing",
      "Federated Clinical Learning allowing cross-hospital model training without centralizing sensitive patient EHR records"
    ],
    top_global_competitors: [
      "Qure.ai (India / Global - Regulatory cleared AI for chest X-rays and head CTs)",
      "Babylon Health / eMed (UK / USA - AI tele-triage and primary care routing)",
      "Enlitic (USA - Medical imaging intelligence and DICOM standardization)",
      "Lunit (South Korea - AI-powered cancer diagnostics and screening suites)"
    ],
    recommended_tech_stack_updates: [
      {
        technology_area: "Clinical Model Optimization",
        current_industry_standard: "FP32 ResNet models on cloud clusters",
        next_gen_recommendation: "INT8 Quantized Vision Transformers (ViT) with MobileNet backbones",
        strategic_advantage: "Enables offline screening in rural PHCs with zero cellular connectivity."
      },
      {
        technology_area: "Interoperability Protocol",
        current_industry_standard: "Proprietary REST JSON APIs",
        next_gen_recommendation: "HL7 FHIR Release 4 with ABDM Health Information Exchange (HIE-CM) conformance",
        strategic_advantage: "Guarantees seamless plug-and-play nationwide portability across state EHR systems."
      }
    ],
    market_maturity_level: "Maturing High-Growth"
  },

  general: {
    emerging_technologies: [
      "Agentic AI Workflow Orchestrators with deterministic tool calling for municipal grievance routing",
      "Event-driven Serverless Architectures for zero-idle-cost public citizen portal operations",
      "Decentralized Verifiable Credentials (W3C DID) for citizen certificate and entitlement verification",
      "Automated Continuous Security Compliance Linting (Policy-as-Code) for government cloud deployments"
    ],
    top_global_competitors: [
      "Palantir Foundry (USA - Government data integration and operational decisioning)",
      "Civis Analytics (USA - Data science platform for public sector resource allocation)",
      "GovTech Singapore (Singapore - Open-source digital public goods infrastructure)",
      "Faculty AI (UK - Sovereign AI safety and public sector automation)"
    ],
    recommended_tech_stack_updates: [
      {
        technology_area: "AI Orchestration",
        current_industry_standard: "Monolithic prompt scripts",
        next_gen_recommendation: "LangGraph / Semantic Kernel agentic workflows with strict schema validation",
        strategic_advantage: "Prevents hallucinations and ensures deterministic compliance in public service decisions."
      },
      {
        technology_area: "API Architecture",
        current_industry_standard: "Ad-hoc REST endpoints",
        next_gen_recommendation: "OpenAPI 3.1 specifications with automated contract testing and GraphQL federation",
        strategic_advantage: "Reduces third-party departmental integration lead times from weeks to hours."
      }
    ],
    market_maturity_level: "Mainstream Adoption Phase"
  }
};

/**
 * Scans global market trends, emerging technologies, competitors, and tech stack upgrades for a domain
 * @param {string|Object} domain - Target civic tech domain or challenge context
 * @returns {Promise<Object>} Market intelligence report matching schema
 */
async function scanMarketTrends(domain) {
  const apiKey = process.env.OPENAI_API_KEY;
  const rawText = typeof domain === "string" ? domain : JSON.stringify(domain || {});
  const detectedDomain = detectDomain(rawText);

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [market_scanner]: GPT-4o-mini GovTech horizon scan...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Chief Technology Foresight Officer and Global GovTech Market Analyst.
You identify bleeding-edge technology shifts, benchmark top international and domestic enterprise competitors, recommend modern architectural tech stack upgrades, and classify market maturity levels for government civic innovations.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Deconstruct the target domain and analyze current state-of-the-art developments across global GovTech ecosystems (US, EU, Singapore, India).
2. Detail 4 concrete emerging_technologies disrupting this sector within the next 24-36 months.
3. Name 4 premier global competitors/benchmarks with company name, country of origin, and their exact market positioning.
4. Provide structured recommended_tech_stack_updates contrasting current industry practices against next-gen standards, highlighting strategic advantages for government buyers.
5. Define the overall market_maturity_level (e.g. "Emerging / R&D Stage", "Rapidly Accelerating / Early Growth", "Maturing High-Growth", or "Consolidated Enterprise Phase").

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "emerging_technologies": [
    "string"
  ],
  "top_global_competitors": [
    "string"
  ],
  "recommended_tech_stack_updates": [
    {
      "technology_area": "string",
      "current_industry_standard": "string",
      "next_gen_recommendation": "string",
      "strategic_advantage": "string"
    }
  ],
  "market_maturity_level": "string"
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Conduct a market horizon and competitive scan for this domain:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ scanMarketTrends LIVE — domain maturity:", parsed.market_maturity_level);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI market_scanner failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [market_scanner]: Simulating AI market horizon scanning...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_MARKET_TRENDS[detectedDomain] || DEMO_MARKET_TRENDS.general;

  return {
    mode: "demo",
    emerging_technologies: fallback.emerging_technologies,
    top_global_competitors: fallback.top_global_competitors,
    recommended_tech_stack_updates: fallback.recommended_tech_stack_updates,
    market_maturity_level: fallback.market_maturity_level
  };
}

module.exports = { scanMarketTrends };
