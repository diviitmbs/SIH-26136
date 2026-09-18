// backend/src/ai/sentiment_analyzer.js
// Advanced AI Module: Public Sentiment & Citizen Grievance Urgency Analyzer
// Ingests public problem statements & civic issues to analyze social sentiment, news coverage, and priority index

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
const DEMO_SENTIMENT = {
  infrastructure: {
    overall_sentiment_score: -0.74, // High negative sentiment due to dangerous road conditions
    urgency_index: 8.8, // Out of 10
    citizen_impact_level: "Critical",
    social_media_indicators: {
      twitter_mentions_estimate: 42500,
      sentiment_breakdown: {
        positive_percentage: 8.5,
        negative_percentage: 78.2,
        neutral_percentage: 13.3
      },
      trending_hashtags: [
        "#FixOurRoads",
        "#PotholeFreeMumbai",
        "#MonsoonRoadHazards",
        "#PWDAccountability",
        "#SmartCityRoads"
      ]
    },
    news_coverage_estimate: 140, // Estimated regional news articles / TV segments
    stakeholder_concerns: [
      "Commuter safety hazards during heavy monsoon downpours causing severe traffic bottlenecks",
      "Frequent vehicular damage and suspension repair expenses incurred by daily vehicle owners",
      "Delayed emergency ambulance response times attributed to damaged arterial road stretches",
      "Allegations of sub-standard bitumen quality and contractor negligence during road re-surfacing",
      "Public frustration over lack of real-time status updates on municipal ward grievance portals"
    ],
    recommended_priority_level: "Immediate"
  },

  healthcare: {
    overall_sentiment_score: -0.58,
    urgency_index: 9.1,
    citizen_impact_level: "Critical",
    social_media_indicators: {
      twitter_mentions_estimate: 31200,
      sentiment_breakdown: {
        positive_percentage: 14.0,
        negative_percentage: 69.5,
        neutral_percentage: 16.5
      },
      trending_hashtags: [
        "#PHCHealthReform",
        "#AyushmanBharat",
        "#RuralHealthcareNow",
        "#TelemedicineIndia"
      ]
    },
    news_coverage_estimate: 95,
    stakeholder_concerns: [
      "Long waiting hours and diagnostic delays at rural primary health centers",
      "Shortage of specialized medical practitioners in tier-3 and rural districts",
      "High out-of-pocket medical expenses for diagnostic laboratory tests",
      "Desire for automated digital prescription and tele-consultation access"
    ],
    recommended_priority_level: "Immediate"
  },

  waste_management: {
    overall_sentiment_score: -0.62,
    urgency_index: 7.9,
    citizen_impact_level: "High",
    social_media_indicators: {
      twitter_mentions_estimate: 18400,
      sentiment_breakdown: {
        positive_percentage: 12.0,
        negative_percentage: 71.0,
        neutral_percentage: 17.0
      },
      trending_hashtags: [
        "#CleanCityDrive",
        "#SwachhBharat2026",
        "#GarbageFreeWards",
        "#ZeroWasteULB"
      ]
    },
    news_coverage_estimate: 65,
    stakeholder_concerns: [
      "Irregular garbage collection schedules causing open dumping in residential wards",
      "Lack of source segregation compliance and foul odor near community dumpsters",
      "Sanitation worker safety concerns and delayed safety gear issuance"
    ],
    recommended_priority_level: "High"
  },

  general: {
    overall_sentiment_score: -0.45,
    urgency_index: 6.5,
    citizen_impact_level: "High",
    social_media_indicators: {
      twitter_mentions_estimate: 12500,
      sentiment_breakdown: {
        positive_percentage: 20.0,
        negative_percentage: 55.0,
        neutral_percentage: 25.0
      },
      trending_hashtags: [
        "#GovTechReform",
        "#PublicProcurementIndia",
        "#CivicInnovation",
        "#DigitalGovernance"
      ]
    },
    news_coverage_estimate: 42,
    stakeholder_concerns: [
      "Desire for transparent project tracking and public budget disclosure",
      "Demand for faster grievance resolution by municipal local bodies",
      "Need for modern AI technology in public administration"
    ],
    recommended_priority_level: "High"
  }
};

/**
 * Analyze public sentiment, social media indicators, and citizen impact urgency for a given problem statement
 * @param {Object|String} problemStatement 
 * @returns {Promise<Object>} Sentiment Analysis JSON Schema
 */
async function analyzePublicSentiment(problemStatement) {
  const statementStr = typeof problemStatement === "object" ? JSON.stringify(problemStatement) : String(problemStatement || "");
  const domain = detectDomain(statementStr);

  if (process.env.OPENAI_API_KEY && OpenAI) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are a Senior Public Sentiment & Civic Analytics Officer in India.
Analyze the following civic problem statement and compute a structured public sentiment and urgency evaluation.

Problem Statement:
${statementStr}

STRICT JSON OUTPUT FORMAT (DO NOT INCLUDE ANY TEXT OUTSIDE JSON):
{
  "overall_sentiment_score": -0.74,
  "urgency_index": 8.8,
  "citizen_impact_level": "Critical",
  "social_media_indicators": {
    "twitter_mentions_estimate": 42500,
    "sentiment_breakdown": {
      "positive_percentage": 8.5,
      "negative_percentage": 78.2,
      "neutral_percentage": 13.3
    },
    "trending_hashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3"]
  },
  "news_coverage_estimate": 140,
  "stakeholder_concerns": ["Concern 1", "Concern 2", "Concern 3"],
  "recommended_priority_level": "Immediate"
}

Note:
- citizen_impact_level MUST BE EXACTLY ONE OF: "Critical", "High", "Medium", "Low".
- recommended_priority_level MUST BE EXACTLY ONE OF: "Immediate", "High", "Medium", "Low".
- overall_sentiment_score should range between -1.0 (extremely negative) and +1.0 (extremely positive).
- urgency_index should range between 1.0 and 10.0.`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      if (parsed && parsed.social_media_indicators && parsed.recommended_priority_level) {
        return parsed;
      }
    } catch (e) {
      console.warn("OpenAI Sentiment Analyzer failed or missing key, falling back to Demo Mode:", e.message);
    }
  }

  // Demo Fallback Mode
  await sleep(1500);
  return DEMO_SENTIMENT[domain] || DEMO_SENTIMENT.general;
}

module.exports = { analyzePublicSentiment };
