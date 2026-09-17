// backend/src/ai/impact_forecaster.js
// Advanced AI Module: Impact Forecaster
// Tier-1 Public Value, Socio-Economic ROI & ESG Impact Modeling Engine

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
const DEMO_IMPACTS = {
  infrastructure: {
    five_year_roi_percentage: 318.5,
    societal_impact_score: 87,
    estimated_jobs_created: 46,
    environmental_benefit_score: 74,
    taxpayer_value_generated: {
      total_value_inr: 28400000,
      formatted_summary: "₹2.84 Cr in aggregate taxpayer value generated over 5 years through direct road resurfacing cost reduction, vehicular damage mitigation, and citizen fuel savings.",
      annual_net_benefit_inr: 5680000,
      key_drivers: [
        "Elimination of emergency road patching surcharges via proactive early-stage crack detection (₹1.2 Cr saved)",
        "Citizen vehicular maintenance savings from avoided axle/tire pothole damages across 45,000 ward commuters (₹1.1 Cr saved)",
        "Reduced idle fuel consumption and carbon emissions during road disruption detours (₹54 Lakhs saved)"
      ]
    }
  },

  healthcare: {
    five_year_roi_percentage: 412.0,
    societal_impact_score: 96,
    estimated_jobs_created: 62,
    environmental_benefit_score: 68,
    taxpayer_value_generated: {
      total_value_inr: 43500000,
      formatted_summary: "₹4.35 Cr in economic value generated through early pathology detection, reduced late-stage tertiary hospitalizations, and preservation of productive disability-adjusted life years (DALYs).",
      annual_net_benefit_inr: 8700000,
      key_drivers: [
        "Early non-communicable disease triage preventing high-cost tertiary ICU admissions (₹2.4 Cr saved)",
        "Out-of-pocket rural diagnostic transit expense reduction for over 85,000 low-income households (₹1.35 Cr saved)",
        "Productive working days saved for agrarian families through localized PHC diagnostic resolutions (₹60 Lakhs saved)"
      ]
    }
  },

  waste_management: {
    five_year_roi_percentage: 285.4,
    societal_impact_score: 84,
    estimated_jobs_created: 38,
    environmental_benefit_score: 93,
    taxpayer_value_generated: {
      total_value_inr: 21200000,
      formatted_summary: "₹2.12 Cr in municipal spend optimization and environmental value created through dynamic fuel-efficient routing, landfill diversion, and automated resource recovery.",
      annual_net_benefit_inr: 4240000,
      key_drivers: [
        "Municipal compactor diesel expenditure slashed by 26% through dynamic on-demand routing (₹98 Lakhs saved)",
        "Increased secondary dry-waste recycling recovery revenues for sanitation workers (₹66 Lakhs generated)",
        "Avoidance of unscientific open-burning air pollution penalties and leachate groundwater remediation costs (₹48 Lakhs saved)"
      ]
    }
  },

  traffic: {
    five_year_roi_percentage: 345.0,
    societal_impact_score: 90,
    estimated_jobs_created: 32,
    environmental_benefit_score: 88,
    taxpayer_value_generated: {
      total_value_inr: 32600000,
      formatted_summary: "₹3.26 Cr in macro-economic citizen value unlocked through a 22% reduction in junction wait times, lower vehicular idle emissions, and expedited emergency vehicle transit.",
      annual_net_benefit_inr: 6520000,
      key_drivers: [
        "Citizen commute time savings valued at state average hourly productivity rates (₹1.75 Cr value unlocked)",
        "Automotive fuel conservation during corridor red-light queue idling (₹1.1 Cr saved)",
        "Faster emergency vehicle corridor preemption saving critical life intervention minutes (₹41 Lakhs economic value)"
      ]
    }
  },

  general: {
    five_year_roi_percentage: 295.0,
    societal_impact_score: 85,
    estimated_jobs_created: 40,
    environmental_benefit_score: 78,
    taxpayer_value_generated: {
      total_value_inr: 25000000,
      formatted_summary: "₹2.50 Cr in cumulative public value delivered through process digitalization, administrative friction reduction, and civic infrastructure longevity.",
      annual_net_benefit_inr: 5000000,
      key_drivers: [
        "Operational efficiency gains and paperless municipal administration (₹1.1 Cr saved)",
        "Reduced turnaround time for public grievance redressal and citizen service delivery (₹90 Lakhs value generated)",
        "Optimization of capital expenditure through continuous predictive maintenance (₹50 Lakhs saved)"
      ]
    }
  }
};

/**
 * Forecasts 5-year public value, socio-economic return, job creation, and environmental impact
 * @param {Object|string} projectData - Project scope, challenge specifications, or pilot KPIs
 * @returns {Promise<Object>} Impact forecast matching schema
 */
async function forecastImpact(projectData) {
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
      console.log("🤖 LIVE AI MODE [impact_forecaster]: GPT-4o-mini econometric impact modeling...");
      const client = new OpenAI({ apiKey });

      const systemPrompt = `You are a Senior Public Sector Econometrician and Chief Impact Assessment Specialist for urban governance and civic innovation.
You model long-term Social Return on Investment (SROI), quantifiable taxpayer value creation, job creation across technical and field tiers, environmental benefits (ESG), and societal impact scores.

CHAIN-OF-THOUGHT REASONING PROCESS:
1. Deconstruct the civic problem statement, operational deployment scale, and municipal budget.
2. Model a defensible 5-year cumulative ROI percentage (e.g. 280.0 to 450.0) reflecting cost avoidance, resource efficiency, and citizen productivity gains.
3. Compute a societal_impact_score (0-100 integer) reflecting public safety, health outcomes, transparency, and equity.
4. Estimate realistic jobs created (direct software roles + field calibration and maintenance workforce).
5. Quantify environmental_benefit_score (0-100 integer) accounting for carbon emissions reduction, fuel savings, waste diversion, or material preservation.
6. Detail the taxpayer_value_generated with total INR valuation, a clear summary sentence, annual benefit, and specific economic drivers.

OUTPUT RULES — STRICT JSON ENFORCEMENT:
- Return ONLY a valid, raw JSON object.
- NO markdown formatting (no \`\`\`json wrappers), no explanatory text outside the JSON.
- All numbers must be raw numbers (float or integer).
- Match this schema EXACTLY. Do not change key names.

REQUIRED JSON SCHEMA:
{
  "five_year_roi_percentage": 318.5,
  "societal_impact_score": 87,
  "estimated_jobs_created": 46,
  "environmental_benefit_score": 74,
  "taxpayer_value_generated": {
    "total_value_inr": 28400000,
    "formatted_summary": "string",
    "annual_net_benefit_inr": 5680000,
    "key_drivers": [
      "string"
    ]
  }
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Forecast the 5-year public sector and econometric impact for this initiative:\n\n${rawText}` }
        ]
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      console.log("✅ forecastImpact LIVE — 5yr ROI:", parsed.five_year_roi_percentage);
      return { mode: "live", ...parsed };

    } catch (err) {
      console.error("❌ OpenAI impact_forecaster failed, falling back to demo mode:", err.message);
    }
  } else {
    console.log("ℹ️  DEMO MODE [impact_forecaster]: Simulating AI econometric impact forecasting...");
    await sleep(1500);
  }

  // ── DEMO FALLBACK (High-Fidelity) ───────────────────────────
  const fallback = DEMO_IMPACTS[detectedDomain] || DEMO_IMPACTS.general;

  return {
    mode: "demo",
    five_year_roi_percentage: fallback.five_year_roi_percentage,
    societal_impact_score: fallback.societal_impact_score,
    estimated_jobs_created: fallback.estimated_jobs_created,
    environmental_benefit_score: fallback.environmental_benefit_score,
    taxpayer_value_generated: fallback.taxpayer_value_generated
  };
}

module.exports = { forecastImpact };
