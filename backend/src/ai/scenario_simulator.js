// backend/src/ai/scenario_simulator.js
// Advanced AI Module: What-If Scenario Simulator
// Simulates project budget, timeline, and scope variations for Indian public sector projects

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

/**
 * Generate fallback demo analysis dynamically based on changeType and domain
 */
function getDemoScenario(projectData, changeType, changeValue) {
  const projectStr = typeof projectData === "object" ? JSON.stringify(projectData) : String(projectData || "");
  const domain = detectDomain(projectStr);
  const val = parseFloat(changeValue) || 20;

  switch (changeType) {
    case "budget_cut":
      return {
        original_projection: `Baseline project allocation of ₹45,00,000 across 12 months targeting 100% Ward Coverage with 25 Patrol Vehicles.`,
        modified_projection: `Revised project scope post ${val}% budget reduction (new cap ₹${(4500000 * (1 - val/100)).toLocaleString('en-IN')}) reducing patrol fleet retrofits and cloud retention period.`,
        impact_analysis: {
          budget_impact_inr: -Math.round(4500000 * (val / 100)),
          timeline_impact_months: 2.5,
          risk_score_change: 15.4,
          kpi_impact: [
            { kpi_name: "Patrol Fleet Camera Units", original_value: "25 Vehicles", new_value: `${Math.round(25 * (1 - val/100))} Vehicles`, percentage_change: -val },
            { kpi_name: "Road Network Audit Coverage", original_value: "100% Ward Coverage", new_value: `${Math.round(100 - val*0.8)}% Priority Ward Coverage`, percentage_change: -Math.round(val * 0.8) },
            { kpi_name: "Defect Detection Accuracy SLA", original_value: "92% Precision", new_value: "88% Precision", percentage_change: -4.3 }
          ]
        },
        recommendation: "Compensate for hardware budget reduction by switching to smartphone-mounted edge deployment for lower-tier ward vehicles while retaining 4K cameras on high-density arterial routes.",
        feasibility_assessment: val > 30 ? "Low" : "Medium"
      };

    case "budget_increase":
      return {
        original_projection: `Baseline project allocation of ₹45,00,000 across 12 months with 25 Patrol Vehicles.`,
        modified_projection: `Expanded scope with +${val}% budget increase (new cap ₹${(4500000 * (1 + val/100)).toLocaleString('en-IN')}) accelerating ML pipeline and expanding spatial coverage.`,
        impact_analysis: {
          budget_impact_inr: Math.round(4500000 * (val / 100)),
          timeline_impact_months: -1.5,
          risk_score_change: -12.0,
          kpi_impact: [
            { kpi_name: "Patrol Fleet Camera Units", original_value: "25 Vehicles", new_value: `${Math.round(25 * (1 + val/100))} Vehicles`, percentage_change: val },
            { kpi_name: "Work Order Resolution SLA", original_value: "48 Hours", new_value: "24 Hours", percentage_change: -50.0 },
            { kpi_name: "Road Defect Detection Accuracy", original_value: "92% Precision", new_value: "96.5% Precision", percentage_change: 4.89 }
          ]
        },
        recommendation: "Utilize incremental funding to integrate live thermal paving quality inspection and deploy automated citizen SMS verification workflows.",
        feasibility_assessment: "High"
      };

    case "timeline_delay":
      return {
        original_projection: `Standard 6-month Phase-1 rollout target across central municipal zones.`,
        modified_projection: `Extended deployment timeline delayed by ${val} weeks due to monsoon road conditions and procurement approval lag.`,
        impact_analysis: {
          budget_impact_inr: Math.round(val * 45000), // Standing overhead costs
          timeline_impact_months: Math.round((val / 4.33) * 10) / 10,
          risk_score_change: 22.1,
          kpi_impact: [
            { kpi_name: "Phase 1 Ward Rollout", original_value: "6 Months", new_value: `${6 + Math.round(val/4)} Months`, percentage_change: Math.round((val/24)*100) },
            { kpi_name: "Contractor Liquidated Damages Risk", original_value: "Low (0%)", new_value: "High (5% GFR Clause trigger)", percentage_change: 100.0 },
            { kpi_name: "Public Grievance Escalation Index", original_value: "2.4 / 10", new_value: "6.8 / 10", percentage_change: 183.3 }
          ]
        },
        recommendation: "Invoke GFR Clause 17.2 for time extension due to monsoon force majeure, and fast-track cloud pre-configuration in sandbox environment before hardware mounting.",
        feasibility_assessment: val > 12 ? "Low" : "Medium"
      };

    case "scope_reduction":
    default:
      return {
        original_projection: `Full-suite deployment featuring AI Pothole Detection, GIS Mapping, Automated PWD Tender Generation, and Public Grievance Portal.`,
        modified_projection: `De-scoped phased execution scaling back Public Portal and focus solely on Core PWD Work-Order Automation.`,
        impact_analysis: {
          budget_impact_inr: -Math.round(4500000 * 0.25),
          timeline_impact_months: -2.0,
          risk_score_change: -8.5,
          kpi_impact: [
            { kpi_name: "Module Scope", original_value: "4 Core Modules", new_value: "2 Core Modules", percentage_change: -50.0 },
            { kpi_name: "PWD Work Order Automation", original_value: "100%", new_value: "100%", percentage_change: 0.0 },
            { kpi_name: "Citizen Engagement Index", original_value: "High", new_value: "Low", percentage_change: -70.0 }
          ]
        },
        recommendation: "Ensure core PWD API integration remains intact during de-scoping so citizen grievance portal can be seamlessly added in Phase 2 without architectural refactoring.",
        feasibility_assessment: "High"
      };
  }
}

/**
 * Simulate What-If Scenarios (budget cut, budget increase, timeline delay, scope reduction)
 * @param {Object|String} projectData 
 * @param {"budget_cut"|"budget_increase"|"timeline_delay"|"scope_reduction"} changeType 
 * @param {number|string} changeValue 
 * @returns {Promise<Object>} Scenario Simulation JSON Schema
 */
async function simulateScenario(projectData, changeType, changeValue) {
  const projectStr = typeof projectData === "object" ? JSON.stringify(projectData) : String(projectData || "");
  const normalizedChangeType = changeType || "budget_cut";
  const normalizedChangeValue = changeValue || 20;

  if (process.env.OPENAI_API_KEY && OpenAI) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are a Senior Project Management & Financial Risk Simulation Specialist for Indian Government Infrastructure & Tech Projects.
Analyze the following project data and simulate the impact of a specific change scenario:

Project Data: ${projectStr}
Change Type: ${normalizedChangeType} (Options: budget_cut, budget_increase, timeline_delay, scope_reduction)
Change Magnitude/Value: ${normalizedChangeValue}

STRICT JSON OUTPUT FORMAT (DO NOT INCLUDE ANY TEXT OUTSIDE JSON):
{
  "original_projection": "Detailed string describing baseline projection",
  "modified_projection": "Detailed string describing modified scenario projection",
  "impact_analysis": {
    "budget_impact_inr": -900000,
    "timeline_impact_months": 2.5,
    "risk_score_change": 15.4,
    "kpi_impact": [
      {
        "kpi_name": "KPI Name",
        "original_value": "Baseline Val",
        "new_value": "New Val",
        "percentage_change": -20.0
      }
    ]
  },
  "recommendation": "Actionable strategic recommendation for project director",
  "feasibility_assessment": "High"
}

Note: feasibility_assessment MUST BE EXACTLY ONE OF: "High", "Medium", or "Low".`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      if (parsed && parsed.impact_analysis && parsed.feasibility_assessment) {
        return parsed;
      }
    } catch (e) {
      console.warn("OpenAI Scenario Simulator failed or missing key, falling back to Demo Mode:", e.message);
    }
  }

  // Demo Fallback Mode
  await sleep(1500);
  return getDemoScenario(projectData, normalizedChangeType, normalizedChangeValue);
}

module.exports = { simulateScenario };
