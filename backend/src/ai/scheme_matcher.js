// backend/src/ai/scheme_matcher.js
// Advanced AI Module: Government Scheme Matchmaking Engine
// Matches public procurement challenges & civic innovations with Indian Central & State Government funding schemes

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
const DEMO_SCHEMES = {
  infrastructure: {
    matched_schemes: [
      {
        scheme_name: "Smart Cities Mission (AI & Urban Mobility Tech Grant)",
        ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
        funding_percentage: 50,
        eligibility: "DPIIT-recognized Startups & Urban Local Bodies (ULBs) partnering for tech deployment in 100 designated Smart Cities",
        application_link: "https://smartcities.gov.in/challenge-grant",
        deadline: "2026-11-30"
      },
      {
        scheme_name: "PM Gati Shakti National Master Plan (Multimodal Connectivity & Spatial GIS Tech Support)",
        ministry: "Ministry of Commerce and Industry",
        funding_percentage: 35,
        eligibility: "Innovators providing geospatial mapping, AI logistics optimization, or road asset telemetry for infrastructure ministries",
        application_link: "https://pmgatishakti.gov.in/innovate",
        deadline: "2026-12-15"
      },
      {
        scheme_name: "Atmanirbhar Bharat Innovation Challenge (Civil & Transport Infrastructure)",
        ministry: "NITI Aayog / AIM (Atal Innovation Mission)",
        funding_percentage: 70,
        eligibility: "Early-stage indigenous tech startups with indigenous IP replacing imported civic hardware/software",
        application_link: "https://aim.gov.in/atmanirbhar-challenge",
        deadline: "2026-10-31"
      },
      {
        scheme_name: "Digital India Bhashini & DeepTech Grant for Urban Infrastructure",
        ministry: "Ministry of Electronics and Information Technology (MeitY)",
        funding_percentage: 60,
        eligibility: "Indian technology vendors leveraging computer vision and edge AI for public utility governance",
        application_link: "https://meity.gov.in/digital-india-grant",
        deadline: "2026-11-15"
      }
    ],
    total_available_funding_inr: 25000000, // ₹2.5 Crore
    recommended_scheme: "Smart Cities Mission (AI & Urban Mobility Tech Grant)",
    justification: "The proposed AI road inspection and pothole detection engine directly aligns with MoHUA Smart Cities Mission Urban Mobility & Smart Governance sub-allocations, offering up to 50% matching grant capital (up to ₹1.25 Crore per ULB pilot) with accelerated procurement clearance.",
    state_specific_schemes: [
      "Maharashtra Innovation Society (MSINS) Hackathon Pilot Grant (Up to ₹15 Lakhs per ULB trial)",
      "Karnataka Beyond Bengaluru Startup Seed Fund (Infrastructure Tech Tier-2/3 ULB incentive)",
      "Tamil Nadu Startup and Innovation Mission (TANSIM) Public Procurement Pilot Exemption Scheme"
    ]
  },

  healthcare: {
    matched_schemes: [
      {
        scheme_name: "Digital India HealthTech CoE Grand Challenge",
        ministry: "Ministry of Electronics and Information Technology (MeitY) & MoHFW",
        funding_percentage: 75,
        eligibility: "DPIIT startups building ABDM-compliant clinical decision support or tele-diagnostic solutions",
        application_link: "https://digitalindia.gov.in/healthtech",
        deadline: "2026-11-20"
      },
      {
        scheme_name: "Ayushman Bharat Digital Mission (ABDM) Innovation Sandbox Grant",
        ministry: "National Health Authority (NHA)",
        funding_percentage: 60,
        eligibility: "Entities achieving ABDM M1/M2/M3 milestone integrations for PHC tele-medicine",
        application_link: "https://abdm.gov.in/sandbox-grant",
        deadline: "2026-12-01"
      },
      {
        scheme_name: "Atmanirbhar Bharat Medical Device & Telehealth Challenge",
        ministry: "Department of Pharmaceuticals / NITI Aayog",
        funding_percentage: 50,
        eligibility: "Indigenous clinical device & AI diagnostic developers with Indian patents",
        application_link: "https://aim.gov.in/medical-innovation",
        deadline: "2026-10-25"
      },
      {
        scheme_name: "AMRUT 2.0 Health & Public Sanitation Technology Fund",
        ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
        funding_percentage: 40,
        eligibility: "ULBs and health tech partners implementing diagnostic automation in municipal clinics",
        application_link: "https://amrut.gov.in/health-fund",
        deadline: "2026-11-10"
      }
    ],
    total_available_funding_inr: 30000000, // ₹3.0 Crore
    recommended_scheme: "Digital India HealthTech CoE Grand Challenge",
    justification: "Provides up to 75% grant funding with direct access to NHA ABDM sandbox resources and fast-tracked empaneled procurement across primary healthcare centers.",
    state_specific_schemes: [
      "Telangana AI Mission (TAIM) HealthTech Acceleration Grant",
      "Kerala Startup Mission (KSUM) Rural Health Innovation Seed Capital",
      "Gujarat State Health Society Public Health Tech Empanelment Scheme"
    ]
  },

  general: {
    matched_schemes: [
      {
        scheme_name: "Smart Cities Mission (Governance Tech Grant)",
        ministry: "Ministry of Housing and Urban Affairs (MoHUA)",
        funding_percentage: 50,
        eligibility: "DPIIT Startups developing civic technology and automated municipal administration tools",
        application_link: "https://smartcities.gov.in/grant",
        deadline: "2026-11-30"
      },
      {
        scheme_name: "Digital India Bhashini & DeepTech Startup Grant",
        ministry: "Ministry of Electronics and Information Technology (MeitY)",
        funding_percentage: 60,
        eligibility: "Indian technology start-ups building AI/ML solutions for government workflow automation",
        application_link: "https://meity.gov.in/deeptech-grant",
        deadline: "2026-11-15"
      },
      {
        scheme_name: "AMRUT 2.0 Tech Innovation Challenge",
        ministry: "Ministry of Housing and Urban Affairs",
        funding_percentage: 40,
        eligibility: "Municipal vendors introducing digital efficiency tools for civic services",
        application_link: "https://amrut.gov.in/tech-challenge",
        deadline: "2026-12-10"
      },
      {
        scheme_name: "Atmanirbhar Bharat Innovation Initiative",
        ministry: "NITI Aayog / AIM",
        funding_percentage: 70,
        eligibility: "Indigenous tech ventures creating import-substitution governance software",
        application_link: "https://aim.gov.in/atmanirbhar",
        deadline: "2026-10-31"
      },
      {
        scheme_name: "PM Gati Shakti Civic Infrastructure Digitalization Fund",
        ministry: "Ministry of Commerce and Industry",
        funding_percentage: 45,
        eligibility: "Data driven civic optimization platforms and planning tools",
        application_link: "https://pmgatishakti.gov.in/digital-fund",
        deadline: "2026-12-05"
      }
    ],
    total_available_funding_inr: 20000000, // ₹2.0 Crore
    recommended_scheme: "Digital India Bhashini & DeepTech Startup Grant",
    justification: "Provides matching capital support up to 60% with MeitY cloud credit allocation and GeM portal fast-track onboarding.",
    state_specific_schemes: [
      "Startup Odisha Procurement Preference Scheme (Exemption from EMD and Turnover criteria)",
      "Rajasthan iStart Challenge Grant for GovTech",
      "Uttar Pradesh IT & Startup Policy Public Procurement Incentive"
    ]
  }
};

/**
 * Match a public challenge or procurement project with central/state Indian Government schemes
 * @param {Object|String} challengeData 
 * @returns {Promise<Object>} Government Schemes JSON Schema
 */
async function matchGovernmentSchemes(challengeData) {
  const challengeStr = typeof challengeData === "object" ? JSON.stringify(challengeData) : String(challengeData || "");
  const domain = detectDomain(challengeStr);

  if (process.env.OPENAI_API_KEY && OpenAI) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are a Senior Indian Government Grants & Public Finance Specialist.
Analyze the given challenge/project data and match it with active Indian Central and State Government funding schemes.

Challenge Data:
${challengeStr}

MANDATORY INCLUSIONS IN MATCHED SCHEMES:
Ensure you evaluate relevance to flagship programs such as Smart Cities Mission, AMRUT 2.0, Digital India, Atmanirbhar Bharat, and PM Gati Shakti.

STRICT JSON OUTPUT FORMAT (DO NOT INCLUDE ANY TEXT OUTSIDE JSON):
{
  "matched_schemes": [
    {
      "scheme_name": "Scheme Name",
      "ministry": "Relevant Ministry",
      "funding_percentage": 50,
      "eligibility": "Eligibility description",
      "application_link": "https://...",
      "deadline": "YYYY-MM-DD"
    }
  ],
  "total_available_funding_inr": 25000000,
  "recommended_scheme": "Recommended Scheme Name",
  "justification": "Detailed justification on why this scheme is the optimal match",
  "state_specific_schemes": ["Scheme 1", "Scheme 2"]
}`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      if (parsed && Array.isArray(parsed.matched_schemes) && parsed.recommended_scheme) {
        return parsed;
      }
    } catch (e) {
      console.warn("OpenAI Scheme Matcher failed or missing key, falling back to Demo Mode:", e.message);
    }
  }

  // Demo Fallback Mode
  await sleep(1500);
  return DEMO_SCHEMES[domain] || DEMO_SCHEMES.general;
}

module.exports = { matchGovernmentSchemes };
