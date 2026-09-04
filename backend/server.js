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
const { generateDecisionBrief } = require("./src/ai/copilot.js");

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

app.get("/api/health", (req, res) => res.json({ message: "SIH-26136 Backend is running!" }));

app.post("/api/ai/structure-challenge", async (req, res) => {
  try {
    const { problem } = req.body;
    if (!problem) return res.status(400).json({ error: "Please provide a 'problem'." });
    console.log("📥 Received problem:", problem);
    res.json(await structureChallenge(problem));
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/ai/match-startups", async (req, res) => {
  try {
    const { challenge } = req.body;
    if (!challenge) return res.status(400).json({ error: "Please provide a 'challenge'." });
    console.log("📥 Matching startups...");
    res.json(await matchStartups(challenge));
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/ai/analyze-document", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Please provide 'text'." });
    console.log(" Analyzing document...");
    res.json(await analyzeDocument(text));
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/ai/evaluate-startups", async (req, res) => {
  try {
    const { challenge, candidates } = req.body;
    if (!Array.isArray(candidates) || !candidates.length) return res.status(400).json({ error: "Please provide 'candidates'." });
    console.log("📥 Evaluating startups...");
    res.json(await evaluateStartups(challenge, candidates));
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/ai/analyze-pilot", async (req, res) => {
  try {
    const { kpis } = req.body;
    if (!Array.isArray(kpis) || !kpis.length) return res.status(400).json({ error: "Please provide 'kpis'." });
    console.log(" Analyzing pilot...");
    res.json(await analyzePilot(kpis));
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/api/ai/summarize-evidence", async (req, res) => {
  try {
    const { items, excerpt } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: "Please provide 'items'." });
    console.log(" Summarizing evidence...");
    res.json(await summarizeEvidence(items, excerpt || ""));
  } catch (error) {
    console.error(" Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// NEW FEATURE 7 ROUTE
app.post("/api/ai/decision-brief", async (req, res) => {
  try {
    const { challengeTitle, kpis, evidenceStrength } = req.body;
    if (!challengeTitle || !kpis) return res.status(400).json({ error: "Please provide 'challengeTitle' and 'kpis'." });
    console.log("📥 Generating decision brief...");
    res.json(await generateDecisionBrief(challengeTitle, kpis, evidenceStrength || "medium"));
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
