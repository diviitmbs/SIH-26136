# PROCUREX — SIH26136 Frontend Prototype

A light-first, breathable GovTech prototype for startup-friendly public procurement.

## Run
Open `index.html` in a browser, or use a simple local server such as VS Code Live Server.

## Theme
All screens share:
`localStorage["procurexTheme"]` = `light` or `dark`

## Demo data
`js/data.js` contains the mock Government, Startup, Challenge, Proposal and Pilot records.
The dashboard counters are derived from this data instead of being hard-coded platform claims.

## Main flows
Government:
Home → Government Registration → Government Home → Create Challenge → Challenge Registered → Discover Startups → Proposal Comparison → AI Recommendation → Pilot → Final Decision

Startup:
Home → Startup Registration → Startup Home → Discover Challenges → Proposal → Pilot

Public:
Home → Public Innovation Hub
