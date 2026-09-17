// backend/src/ai/negotiation_assistant.js
// Advanced AI Module: Negotiation Assistant
// Tier-1 Public Procurement Price Negotiation & Leverage Strategy Engine

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
const DEMO_NEGOTIATIONS = {
  infrastructure: {
    recommended_opening_offer: {
      amount_inr: 3350000,
      discount_percentage: 18.3,
      rationalization: "Anchor 18.3% below the startup's quoted price by offering municipal survey vehicle mounting access and municipal garage storage at zero charge to offset their operational CapEx."
    },
    walk_away_price: {
      ceiling_inr: 4100000,
      strict_boundary_reason: "Exceeding ₹41,00,000 violates ward-level discretionary pilot allocation ceilings under Smart Cities Mission guidelines and necessitates state-level sanction delays."
    },
    negotiation_leverage_points: [
      "Granting Official Credentialed Public Case Study: The startup desperately requires an authenticated government deployment certificate to bid on upcoming NHAI state highway tenders.",
      "Municipal Asset In-Kind Subsidy: The city provides 25 municipal patrol vehicles as live test beds, eliminating the startup's need to rent private fleet testing capacity (saving them ~₹8L).",
      "Expedited 14-Day Payment Cycles: Counter-offer net-14 milestone settlements instead of standard net-45 public treasury cycles in exchange for an immediate 12% pricing concession.",
      "Multi-Ward Framework Expansion: Offer right of first refusal for 5 adjacent municipal zones upon meeting SMART KPIs, trading immediate margin for guaranteed contract volume."
    ],
    startup_financial_health_assessment: {
      financial_risk_rating: "Moderate",
      estimated_cash_runway_months: 9,
      burn_rate_stability: "Stable",
      revenue_dependency_on_pilot: "High",
      summary: "Startup completed a ₹1.5 Cr angel round 8 months ago. Their current burn is ₹12L/month. Closing this municipal contract establishes product-market fit essential for their imminent institutional Series A fundraise."
    }
  },

  healthcare: {
    recommended_opening_offer: {
      amount_inr: 4900000,
      discount_percentage: 16.9,
      rationalization: "Counter with an opening anchor 16.9% lower by bundling state institutional ethics clearances and providing direct, vetted access to 40 Primary Health Center patient cohorts."
    },
    walk_away_price: {
      ceiling_inr: 5800000,
      strict_boundary_reason: "Ceiling capped strictly at ₹58,00,000 to remain within the National Health Mission state innovation budget without requiring federal co-signature."
    },
    negotiation_leverage_points: [
      "Clinical Validation & Research Paper Co-Authorship: Granting access to state medical college professors to co-author clinical peer-reviewed validation papers is invaluable for the startup's FDA/CDSCO filings.",
      "Statewide Rollout Pre-Qualification: Successful pilot completion grants automatic inclusion into the State Health Mission empanelment list for 300+ district hospitals.",
      "Upfront Mobilization Advance: Offer 25% mobilization upon signing (backed by bank guarantee) to ease the startup's working capital constraints in exchange for a 15% overall contract price reduction.",
      "ABDM Certification Assistance: Provide dedicated state health IT engineers to accelerate the startup's ABDM M2/M3 regulatory compliance pipeline."
    ],
    startup_financial_health_assessment: {
      financial_risk_rating: "Low",
      estimated_cash_runway_months: 14,
      burn_rate_stability: "High",
      revenue_dependency_on_pilot: "Medium",
      summary: "Well-capitalized deep-tech health venture with ₹3.8 Cr seed funding and grant backing. Their primary bottleneck is clinical access and regulatory endorsement rather than immediate liquidity."
    }
  },

  general: {
    recommended_opening_offer: {
      amount_inr: 3100000,
      discount_percentage: 17.5,
      rationalization: "Open with a 17.5% discount proposal justified by providing dedicated municipal cloud credits, testing sandboxes, and accelerated acceptance protocols."
    },
    walk_away_price: {
      ceiling_inr: 3950000,
      strict_boundary_reason: "Budget cap fixed by municipal executive council resolution; bids higher than ₹39.5L cannot be processed under the fast-track innovation envelope."
    },
    negotiation_leverage_points: [
      "Marquee Government Client Credential: A referenceable municipal contract acts as a critical de-risking catalyst for the startup's subsequent enterprise and overseas expansion.",
      "Reduced Legal & Compliance Friction: Authority waives tedious Earnest Money Deposit (EMD) and relaxes prior turnover criteria under Startup India DPP guidelines.",
      "Stage-Gated Cash Releases: Shorter milestone review cycles ensure the startup maintains positive cash flow throughout development.",
      "Future Framework Empanelment: Option for two-year non-competitive renewal upon satisfactory SLA fulfillment."
    ],
    startup_financial_health_assessment: {
      financial_risk_rating: "Moderate",
      estimated_cash_runway_months: 7,
      burn_rate_stability: "Moderate",
      revenue_dependency_on_pilot: "High",
      summary: "Early-stage startup with approximately 7 months of remaining runway. Winning this pilot will serve as the cornerstone for their next financing round, providing strong procurement leverage to negotiate favorable terms."
    }
  }
};

/**
 * Suggests strategic negotiation positions, price boundaries, and leverage points
 * @param {Object|string} challengeData - Challenge scope, budget limitations, requirements
 * @param {Object|string} startupData - Startup proposal, pricing quote, team profile
 * @returns {Promise<Object>} Negotiation strategy matching schema
 */
async function suggestNegotiationPoints(challengeData, startupData) {
  const apiKey = process.env.OPENAI_API_KEY;
  const challengeStr = typeof challengeData === "string" ? challengeData : JSON.stringify(challengeData || {});
  const startupStr = typeof startupData === "string" ? startupData : JSON.stringify(startupData || {});
  
  const detectedDomain = detectDomain(`${challengeStr} ${startupStr}`);

  if (apiKey && OpenAI) {
    try {
      console.log("🤖 LIVE AI MODE [negotiation_assistant]: GPT-4o-mini strategic negotiation analysis...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Principal Public Procurement Commercial Negotiator and Venture Capital Due Diligence Advisor.
You assist government procurement officers in maximizing public spend value when negotiating with innovative tech startups.
You analyze pricing models, assess startup runway and financial dependency, calculate aggressive yet realistic opening bids, establish hard walk-away ceilings, and identify non-monetary leverage levers.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Analyze the startup's quoted price vs the government challenge budget and market benchmarks.
2. Determine an aggressive, defensible recommended_opening_offer with precise INR amounts, discount percentages, and an ironclad public procurement justification.
3. Calculate the walk_away_price ceiling (INR amount and bureaucratic/statutory reason why bids exceeding this threshold must be rejected).
4. Identify 4 distinct negotiation_leverage_points that the government holds (e.g. municipal testbed access, fast-tracked payment cycles, referenceable credentials, IP concessions, follow-on scale rights).
5. Conduct a realistic startup_financial_health_assessment evaluating cash runway, burn rate, and revenue dependency to empower the procurement committee.

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "recommended_opening_offer": {
    "amount_inr": 3200000,
    "discount_percentage": 18.5,
    "rationalization": "string"
  },
  "walk_away_price": {
    "ceiling_inr": 4200000,
    "strict_boundary_reason": "string"
  },
  "negotiation_leverage_points": [
    "string"
  ],
  "startup_financial_health_assessment": {
    "financial_risk_rating": "Moderate",
    "estimated_cash_runway_months": 8,
    "burn_rate_stability": "High",
    "revenue_dependency_on_pilot": "High",
    "summary": "string"
  }
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Advise the procurement committee on negotiation strategy for this startup proposal:\n\nGOVERNMENT CHALLENGE:\n${challengeStr}\n\nSTARTUP PROPOSAL & PROFILE:\n${startupStr}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ suggestNegotiationPoints LIVE — opening offer INR:", parsed.recommended_opening_offer?.amount_inr);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI negotiation_assistant failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [negotiation_assistant]: Simulating AI negotiation strategy...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_NEGOTIATIONS[detectedDomain] || DEMO_NEGOTIATIONS.general;

  return {
    mode: "demo",
    recommended_opening_offer: fallback.recommended_opening_offer,
    walk_away_price: fallback.walk_away_price,
    negotiation_leverage_points: fallback.negotiation_leverage_points,
    startup_financial_health_assessment: fallback.startup_financial_health_assessment
  };
}

module.exports = { suggestNegotiationPoints };
