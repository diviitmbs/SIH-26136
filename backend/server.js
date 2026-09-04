// backend/server.js
require("dotenv/config");
const express = require("express");
const path = require("path");
const { structureChallenge } = require("./src/ai/structurer.js");
const { matchStartups } = require("./src/ai/matcher.js");
const { analyzeDocument } = require("./src/ai/analyzer.js");
const { evaluateStartups } = require("./src/ai/evaluator.js");
const { analyzePilot } = require("./src/ai/pilot.js");
const { summarizeEvidence } = require("./src/ai/evidence.js");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/health", (req, res) => {
  res.json({ message: "SIH-26136 Backend is running!" });
});

app.post("/api/ai/structure-challenge", async (req, res) => {
  try {
    const { problem } = req.body;
    if (!problem) return res.status(400).json({ error: "Please provide a 'problem' in the request body." });
    console.log("📥 Received problem:", problem);
    const result = await structureChallenge(problem);
    console.log("✅ AI generated structured challenge.");
    res.json(result);
  } catch (error) {
    console.error("❌ Error in AI route:", error);
    res.status(500).json({ error: "Internal server error while structuring challenge." });
  }
});

app.post("/api/ai/match-startups", async (req, res) => {
  try {
    const { challenge } = req.body;
    if (!challenge) return res.status(400).json({ error: "Please provide a 'challenge' object." });
    console.log("📥 Matching startups for:", challenge.title || "(untitled challenge)");
    const result = await matchStartups(challenge);
    console.log("✅ Startup matching done.");
    res.json(result);
  } catch (error) {
    console.error("❌ Error in match route:", error);
    res.status(500).json({ error: "Internal server error while matching startups." });
  }
});

app.post("/api/ai/analyze-document", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Please provide 'text' in the request body." });
    console.log("📥 Analyzing document (" + text.length + " chars)");
    const result = await analyzeDocument(text);
    console.log("✅ Document analysis done.");
    res.json(result);
  } catch (error) {
    console.error("❌ Error in analyze route:", error);
    res.status(500).json({ error: "Internal server error while analyzing document." });
  }
});

app.post("/api/ai/evaluate-startups", async (req, res) => {
  try {
    const { challenge, candidates } = req.body;
    if (!Array.isArray(candidates) || !candidates.length) {
      return res.status(400).json({ error: "Please provide a 'candidates' array." });
    }
    console.log("📥 Evaluating " + candidates.length + " candidates");
    const result = await evaluateStartups(challenge, candidates);
    console.log("✅ Evaluation done.");
    res.json(result);
  } catch (error) {
    console.error("❌ Error in evaluate route:", error);
    res.status(500).json({ error: "Internal server error while evaluating startups." });
  }
});

app.post("/api/ai/analyze-pilot", async (req, res) => {
  try {
    const { kpis } = req.body;
    if (!Array.isArray(kpis) || !kpis.length) {
      return res.status(400).json({ error: "Please provide a 'kpis' array." });
    }
    console.log("📥 Analyzing pilot with " + kpis.length + " KPIs");
    const result = await analyzePilot(kpis);
    console.log("✅ Pilot analysis done.");
    res.json(result);
  } catch (error) {
    console.error("❌ Error in pilot route:", error);
    res.status(500).json({ error: "Internal server error while analyzing pilot." });
  }
});

app.post("/api/ai/summarize-evidence", async (req, res) => {
  try {
    const { items, excerpt } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Please provide an 'items' array." });
    }
    console.log("📥 Assessing evidence package (" + items.length + " items)");
    const result = await summarizeEvidence(items, excerpt || "");
    console.log("✅ Evidence assessment done.");
    res.json(result);
  } catch (error) {
    console.error("❌ Error in evidence route:", error);
    res.status(500).json({ error: "Internal server error while summarizing evidence." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});