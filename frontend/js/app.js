/**
 * PROCUREX - Application Core & API Integration Layer
 * Connects directly to local FastAPI backend at http://127.0.0.1:8000
 * with graceful offline fallback to local mock data.
 */

const API_BASE = "http://127.0.0.1:8000";

/**
 * Global Toast Notification
 */
function toast(message) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    Object.assign(t.style, {
      position: "fixed",
      right: "24px",
      bottom: "24px",
      zIndex: "9999",
      background: "var(--surface-dark, #0b0f19)",
      color: "#ffffff",
      border: "1px solid var(--border-subtle, rgba(255,255,255,0.12))",
      padding: "12px 18px",
      borderRadius: "var(--radius-btn, 10px)",
      boxShadow: "var(--shadow-elevated, 0 20px 48px rgba(0,0,0,0.3))",
      fontSize: "13.5px",
      fontWeight: "600",
      letterSpacing: "-0.01em",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      transition: "opacity 0.25s ease, transform 0.25s ease",
      opacity: "0",
      transform: "translateY(8px)"
    });
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.style.opacity = "1";
  t.style.transform = "translateY(0)";
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => {
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
  }, 2600);
}

/**
 * Route navigation helper
 */
function go(path) {
  if (path) window.location.href = path;
}

/**
 * Basic HTML escaping utility
 */
function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Status badge helper
 */
function getStatusBadge(status) {
  const s = String(status || "Open").toLowerCase();
  if (s.includes("pilot ready") || s.includes("ready") || s.includes("success") || s.includes("procured")) {
    return `<span class="badge success">Pilot Ready</span>`;
  }
  if (s.includes("review") || s.includes("evaluat") || s.includes("shortlist")) {
    return `<span class="badge warn">Reviewing</span>`;
  }
  return `<span class="badge info">Open</span>`;
}

/**
 * Fetch challenges from FastAPI backend or fallback to mock data
 * Endpoint: GET http://127.0.0.1:8000/challenges
 */
async function loadChallenges() {
  let challenges = [];
  let backendSuccess = false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

    const res = await fetch(`${API_BASE}/challenges`, {
      method: "GET",
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        challenges = data;
        backendSuccess = true;
        console.log(`[PROCUREX] Successfully loaded ${data.length} challenges from FastAPI backend.`);
      }
    } else {
      console.warn(`[PROCUREX] Backend responded with status: ${res.status}`);
    }
  } catch (err) {
    console.warn(`[PROCUREX] Local FastAPI backend unreachable at ${API_BASE}/challenges. Initiating graceful fallback:`, err.message);
  }

  // Graceful Fallback: If backend is unreachable or empty, use localStorage + PROCUREX_DATA
  if (!backendSuccess || challenges.length === 0) {
    challenges = [];

    // 1. Check for newly published challenge in localStorage
    const savedRaw = localStorage.getItem("procurexLastChallenge");
    if (savedRaw) {
      try {
        const saved = JSON.parse(savedRaw);
        if (saved && saved.title) {
          challenges.push({
            id: saved.id || "PX-GOV-LIVE-001",
            title: saved.title,
            department: saved.department || "Department of Urban Development",
            location: [saved.city, saved.state].filter(Boolean).join(", ") || saved.location || "Bengaluru Urban",
            sector: saved.domain || saved.sector || "Urban Mobility",
            budget: saved.budget || "₹25–40 Lakhs",
            priority: saved.priority || "High",
            status: saved.status || "Open",
            deadline: saved.deadline || "30 Days Remaining",
            match: saved.match || 96,
            tech: saved.tech || ["AI/ML", "Computer Vision", "IoT"]
          });
        }
      } catch (e) {
        console.warn("[PROCUREX] Could not parse localStorage challenge:", e);
      }
    }

    // 2. Append mock dataset from js/data.js
    if (typeof PROCUREX_DATA !== "undefined" && Array.isArray(PROCUREX_DATA.challenges)) {
      PROCUREX_DATA.challenges.forEach((demo, idx) => {
        if (!challenges.some(c => c.title === demo.title)) {
          challenges.push({
            ...demo,
            status: demo.status || (idx === 0 ? "Open" : (idx === 1 ? "Reviewing" : "Pilot Ready")),
            deadline: demo.deadline || (idx === 0 ? "14 Days Remaining · Oct 15" : (idx === 1 ? "9 Days Remaining · Oct 10" : "21 Days Remaining · Oct 22")),
            match: demo.match || (idx === 0 ? 94 : (idx === 1 ? 78 : 88)),
            tech: demo.tech || ["AI/ML", "Edge IoT", "Analytics"]
          });
        }
      });
    }
  }

  // Update KPI counters across pages
  document.querySelectorAll("#challengeCount").forEach(el => {
    el.textContent = challenges.length;
  });

  // Render Government Dashboard List if present
  const govContainer = document.getElementById("govChallenges");
  if (govContainer) {
    renderGovChallengeList(challenges, govContainer);
  }

  // Render Startup Dashboard Recommendations if present
  const startupContainer = document.getElementById("startupChallenges");
  if (startupContainer) {
    renderStartupChallengeList(challenges, startupContainer);
  }

  return challenges;
}

/**
 * Render challenges into Government Home (#govChallenges)
 */
function renderGovChallengeList(challenges, container) {
  if (!challenges.length) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align:center; padding: 48px 24px;">
        <div style="font-size:36px; margin-bottom:12px;">📋</div>
        <h3 style="font-size:20px;">No active challenges found</h3>
        <p style="max-width:440px; margin: 0 auto 20px; color:var(--muted);">
          Create your first municipal innovation challenge to initiate startup discovery and AI matchmaking.
        </p>
        <button class="btn primary" onclick="typeof openCreateModal === 'function' ? openCreateModal() : go('screen3.html')">
          ＋ Create New Challenge
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = challenges.map(challenge => {
    const statusBadge = getStatusBadge(challenge.status);
    const priorityTag = challenge.priority
      ? `<span class="chip ${challenge.priority === 'High' ? 'orange' : ''}">${escapeHTML(challenge.priority)} Priority</span>`
      : '';
    const matchBadge = challenge.match !== undefined
      ? `<span class="chip blue">${challenge.match === "AI" ? "AI Matched" : challenge.match + "% Match"}</span>`
      : "";

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
        <div>
          <!-- Top Row -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:12px;">
            <span class="chip" style="margin:0; font-size:11.5px; font-weight:600; max-width:65%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHTML(challenge.department)}">
              🏛️ ${escapeHTML(challenge.department || "Urban Development")}
            </span>
            ${statusBadge}
          </div>

          <!-- Title -->
          <h3 style="margin: 0 0 10px; font-size:17px; line-height:1.35; font-weight:700;">
            ${escapeHTML(challenge.title || "Untitled Challenge")}
          </h3>

          <!-- Details -->
          <div style="display:flex; flex-direction:column; gap:4px; font-size:12.5px; color:var(--muted); margin-bottom:14px;">
            <div>📍 <b>Location:</b> ${escapeHTML(challenge.location || "Bengaluru Urban")}</div>
            <div>💰 <b>Budget:</b> ${escapeHTML(challenge.budget || "₹25–40 Lakhs")}</div>
          </div>

          <!-- Tags -->
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:18px;">
            <span class="chip">${escapeHTML(challenge.sector || "Public Innovation")}</span>
            ${priorityTag}
            ${matchBadge}
          </div>
        </div>

        <!-- Action Footer -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:14px; margin-top:8px;">
          <button
            class="btn"
            style="padding: 7px 14px; font-size:12.5px;"
            onclick="go('screen9.html')"
            title="View proposals submitted for this challenge"
          >
            View Submissions →
          </button>
          <button
            class="btn ghost"
            style="padding: 7px 10px; font-size:12px;"
            onclick="go('screen5.html')"
            title="Find matching startups"
          >
            Startups ⌕
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Render challenges into Startup Home (#startupChallenges)
 */
function renderStartupChallengeList(challenges, container) {
  if (!challenges.length) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align:center; padding: 48px 24px;">
        <span class="badge info">No challenges yet</span>
        <h3 style="margin-top:12px">No public challenges available</h3>
        <p style="color:var(--muted);">New municipal challenges will appear here as soon as they are posted.</p>
        <button class="btn primary" style="margin-top:14px" onclick="go('screen7.html')">
          Discover Challenges
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = challenges.map(c => {
    const matchScore = Number(c.match) || 94;
    const matchBadge = matchScore >= 90
      ? `<span class="badge info" style="font-weight:800; font-size:12px; padding:5px 11px;">⚡ ${matchScore}% Match</span>`
      : (matchScore >= 80
        ? `<span class="badge warn" style="font-weight:800; font-size:12px; padding:5px 11px;">⚡ ${matchScore}% Match</span>`
        : `<span class="badge" style="background:var(--surface-2); font-weight:800; font-size:12px; padding:5px 11px;">⚡ ${matchScore}% Match</span>`);

    const sectorClass = (c.sector || "").includes("Mobility")
      ? "chip blue"
      : ((c.sector || "").includes("Environment") ? "chip green" : "chip");

    return `
      <div class="card" style="display:flex; flex-direction:column; justify-content:space-between; position:relative;">
        <div>
          <!-- Header row -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <span class="${sectorClass}" style="margin:0; font-size:11.5px; font-weight:700;">
              ${escapeHTML(c.sector || "Public Innovation")}
            </span>
            ${matchBadge}
          </div>

          <!-- Title -->
          <h3 style="font-size:17.5px; margin:0 0 8px; line-height:1.35; font-weight:700;">
            ${escapeHTML(c.title || "Public Challenge")}
          </h3>

          <!-- Authority -->
          <p style="margin:0 0 14px; font-size:12.5px; color:var(--muted);">
            🏛️ ${escapeHTML(c.department || "Municipal Authority")} · ${escapeHTML(c.location || "India")}
          </p>

          <!-- Budget & Deadline -->
          <div style="background:var(--surface-2); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:6px; font-size:12.5px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--muted);">Est. Budget:</span>
              <strong style="color:var(--text);">${escapeHTML(c.budget || "₹25–40 Lakhs")}</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:var(--muted);">Response Deadline:</span>
              <span style="color:var(--orange); font-weight:600;">${escapeHTML(c.deadline || "14 Days Remaining")}</span>
            </div>
          </div>

          <!-- Tech chips -->
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:16px;">
            ${(c.tech || ["AI/ML", "IoT"]).map(t => `<span class="chip" style="font-size:11px; padding:3px 8px;">${escapeHTML(t)}</span>`).join("")}
          </div>
        </div>

        <!-- Action Footer -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:14px; margin-top:8px;">
          <button
            class="btn primary"
            style="padding:8px 14px; font-size:12.5px;"
            onclick="go('screen8.html')"
            title="Submit technical proposal for this challenge"
          >
            Submit Proposal →
          </button>
          <button
            class="btn ghost"
            style="padding:8px 10px; font-size:12px;"
            onclick="go('screen7_detail.html')"
            title="View full challenge specifications"
          >
            Details
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Submit challenge via POST to FastAPI backend or fallback to local storage
 * Endpoint: POST http://127.0.0.1:8000/challenges
 */
async function submitChallenge(formData) {
  let success = false;
  let responseData = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

    const res = await fetch(`${API_BASE}/challenges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      responseData = await res.json().catch(() => ({}));
      success = true;
      toast("Challenge published to FastAPI backend!");
      console.log("[PROCUREX] Challenge created successfully on backend:", responseData);
    } else {
      console.warn(`[PROCUREX] Backend POST returned status ${res.status}`);
      toast(`Server returned HTTP ${res.status}. Saving locally.`);
    }
  } catch (err) {
    console.warn(`[PROCUREX] Backend unreachable at ${API_BASE}/challenges. Saving locally for offline demo:`, err.message);
    toast("Saved locally (offline demo mode)");
  }

  // Always save locally in localStorage so offline demo workflows are 100% resilient
  try {
    localStorage.setItem("procurexLastChallenge", JSON.stringify(formData));
  } catch (e) {
    console.error("[PROCUREX] Failed to write challenge to localStorage:", e);
  }

  // Re-render challenge lists dynamically
  await loadChallenges();

  return responseData || formData;
}

/**
 * Bind interactive elements
 */
function bindLinks() {
  document.querySelectorAll("[data-go]").forEach(el => {
    el.addEventListener("click", () => go(el.dataset.go));
  });

  document.querySelectorAll("[data-toast]").forEach(el => {
    el.addEventListener("click", () => toast(el.dataset.toast));
  });

  // Automatically trigger loadChallenges if container exists
  if (document.getElementById("govChallenges") || document.getElementById("startupChallenges")) {
    loadChallenges();
  }
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", bindLinks);
