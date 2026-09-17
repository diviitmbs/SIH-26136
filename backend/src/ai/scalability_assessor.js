// backend/src/ai/scalability_assessor.js
// Advanced AI Module: Scalability Assessor
// Tier-1 Architecture, Concurrency & Municipal Scale Readiness Engine

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
const DEMO_SCALABILITY = {
  infrastructure: {
    scalability_score: 84,
    scaling_bottlenecks: [
      "Edge video ingestion bandwidth: Concurrent video upload streams from 250+ patrol vehicles will saturate single-region cloud ingress endpoints.",
      "Geospatial query serialization: Unindexed PostGIS spatial polygon lookups create database lock contention during citywide 10x query surges.",
      "Contractor offline sync reconciliation: Two-way field photo reconciliation incurs merge conflicts when 100+ field crews sync simultaneously post-shift.",
      "Batch inference queue starvation: Peak-hour dashboard workloads starve background computer-vision frame processing without dedicated GPU tenant isolation."
    ],
    required_infrastructure_upgrades: [
      {
        component: "Distributed Edge Pre-Processing & Filter Layer",
        current_capacity: "25 concurrent stream uploads to central ingress",
        target_scaled_capacity: "500+ edge-compressed event-based telemetry streams",
        estimated_cost_inr: 750000
      },
      {
        component: "PostGIS Spatial Partitioning & Geohash Clustering",
        current_capacity: "Single-instance relational database (max 400 QPS)",
        target_scaled_capacity: "Distributed read-replicas with H3 spatial indexing (>4,000 QPS)",
        estimated_cost_inr: 450000
      },
      {
        component: "Sovereign S3 Cold-Storage Auto-Tiering",
        current_capacity: "10 TB local NVMe block storage",
        target_scaled_capacity: "Automated lifecycle tiering to MeitY sovereign object storage (>150 TB)",
        estimated_cost_inr: 320000
      }
    ],
    geographic_expansion_readiness: {
      tier_2_3_cities_readiness: "High",
      network_bandwidth_resilience: "High (operates on 2G/3G store-and-forward telemetry)",
      vernacular_localization_readiness: "Medium (requires Kannada, Marathi, and Tamil field prompts)",
      verdict: "Readily scalable from ward-level pilot to entire municipal corporation and state highway networks, provided distributed edge filtering is deployed to decouple cloud bandwidth from vehicle fleet size."
    }
  },

  healthcare: {
    scalability_score: 79,
    scaling_bottlenecks: [
      "Heavy DICOM imaging payload overhead across low-bandwidth 3G PHC connections.",
      "Centralized inference worker contention during peak morning PHC OPD registration hours (09:00 - 12:00 IST).",
      "Statewide ABDM health record consent gateway API rate-limiting under high concurrency.",
      "Biometric sensor driver fragmentation across non-standardized state rural tablet variants."
    ],
    required_infrastructure_upgrades: [
      {
        component: "Quantized On-Device Edge Inference Engine (TFLite/INT8)",
        current_capacity: "Server-side cloud GPU inference only",
        target_scaled_capacity: "Zero-latency local screening on Android tablets across 500+ PHCs",
        estimated_cost_inr: 850000
      },
      {
        component: "Asynchronous ABDM Event Queue (Kafka/RabbitMQ)",
        current_capacity: "Synchronous blocking REST calls to state gateway",
        target_scaled_capacity: "Fault-tolerant queued event broker handling 25,000 requests/hour",
        estimated_cost_inr: 600000
      },
      {
        component: "HIPAA & ABDM Audited Sovereign Multi-Tenant Isolation",
        current_capacity: "Single-tenant state deployment schema",
        target_scaled_capacity: "District-level multi-tenant database partitioning with dynamic KMS keys",
        estimated_cost_inr: 520000
      }
    ],
    geographic_expansion_readiness: {
      tier_2_3_cities_readiness: "High",
      network_bandwidth_resilience: "Moderate (requires edge INT8 quantization to avoid raw frame uploads)",
      vernacular_localization_readiness: "High (supports 8 scheduled Indian languages for ASHA workers)",
      verdict: "High clinical scalability. Transitioning inference from central cloud GPUs to quantized edge models on PHC tablets unlocks immediate statewide expansion to 1,200+ health centers without linear cloud cost inflation."
    }
  },

  general: {
    scalability_score: 82,
    scaling_bottlenecks: [
      "Monolithic application bottlenecks on background notification and batch report generation.",
      "Database connection pooling limits reached during concurrent morning civic office logins.",
      "Uncached static assets and raster GIS layers degrading low-speed 4G client rendering.",
      "Absence of multi-region high availability failover in current single-zone cluster setup."
    ],
    required_infrastructure_upgrades: [
      {
        component: "Redis Caching & API Rate-Limiting Mesh",
        current_capacity: "Direct database hits for repetitive session & config queries",
        target_scaled_capacity: "Sub-5ms in-memory cache layer serving 90% of read operations",
        estimated_cost_inr: 350000
      },
      {
        component: "Kubernetes Horizontal Pod Autoscaling (HPA)",
        current_capacity: "Fixed 3-node VM setup",
        target_scaled_capacity: "Auto-elastic scaling between 3 and 25 microservice pods based on CPU/RAM saturation",
        estimated_cost_inr: 550000
      },
      {
        component: "Multi-Zone Sovereign Cloud Disaster Recovery Replica",
        current_capacity: "Single data center availability zone",
        target_scaled_capacity: "Hot-standby secondary zone with automated RPO < 15min failover",
        estimated_cost_inr: 680000
      }
    ],
    geographic_expansion_readiness: {
      tier_2_3_cities_readiness: "High",
      network_bandwidth_resilience: "High",
      vernacular_localization_readiness: "Medium",
      verdict: "Solution architecture shows strong horizontal decoupling. Implementing Redis caching and container autoscaling enables seamless scaling from municipal pilot to state-level rollout with predictable linear operational costs."
    }
  }
};

/**
 * Assesses technical scalability, architectural bottlenecks, and geographic expansion readiness
 * @param {Object|string} solutionData - Solution architecture, tech stack, and pilot performance
 * @returns {Promise<Object>} Scalability assessment matching schema
 */
async function assessScalability(solutionData) {
  const apiKey = process.env.OPENAI_API_KEY;
  const rawText = typeof solutionData === "string" 
    ? solutionData 
    : JSON.stringify(solutionData || {});
  
  const detectedDomain = detectDomain(
    typeof solutionData === "object"
      ? `${solutionData?.title || ""} ${solutionData?.solution || ""} ${solutionData?.tech_stack || ""} ${solutionData?.domain || ""}`
      : rawText
  );

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [scalability_assessor]: GPT-4o-mini architectural stress-test analysis...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Principal Cloud Systems Architect and Chief Infrastructure Scalability Assessor for enterprise government civic-tech platforms.
You stress-test startup solution architectures, identify concurrency and I/O bottlenecks, estimate infrastructure upgrade requirements, and evaluate statewide geographic expansion readiness across Tier-2/3 Indian civic environments.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Deconstruct the solution's software architecture, data pipelines, database engines, edge hardware, and network protocols.
2. Determine a composite scalability_score (0-100 integer) reflecting architectural decoupling and elastic scaling capability.
3. Identify exactly 4 specific, highly technical scaling_bottlenecks (e.g. spatial query lock contention, uncompressed edge payloads, synchronous RPC cascades, connection pool exhaustion).
4. Detail required_infrastructure_upgrades with component names, current capacity, target scaled capacity, and estimated upgrade cost in INR.
5. Provide a rigorous geographic_expansion_readiness evaluation covering Tier-2/3 city resilience, network bandwidth tolerance, vernacular readiness, and an executive scaling verdict.

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "scalability_score": 84,
  "scaling_bottlenecks": [
    "string"
  ],
  "required_infrastructure_upgrades": [
    {
      "component": "string",
      "current_capacity": "string",
      "target_scaled_capacity": "string",
      "estimated_cost_inr": 850000
    }
  ],
  "geographic_expansion_readiness": {
    "tier_2_3_cities_readiness": "High",
    "network_bandwidth_resilience": "High",
    "vernacular_localization_readiness": "Medium",
    "verdict": "string"
  }
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.25,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Assess the technical scalability and expansion readiness for this solution:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ assessScalability LIVE — scalability score:", parsed.scalability_score);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI scalability_assessor failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [scalability_assessor]: Simulating AI scalability assessment...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_SCALABILITY[detectedDomain] || DEMO_SCALABILITY.general;

  return {
    mode: "demo",
    scalability_score: fallback.scalability_score,
    scaling_bottlenecks: fallback.scaling_bottlenecks,
    required_infrastructure_upgrades: fallback.required_infrastructure_upgrades,
    geographic_expansion_readiness: fallback.geographic_expansion_readiness
  };
}

module.exports = { assessScalability };
