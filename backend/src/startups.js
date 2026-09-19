// backend/src/startups.js
// Supabase / PostgreSQL Startups Provider
// Queries "Startup" and "CapabilityPassport" and normalizes to frontend Startup format

const { Pool } = require('pg');

let pool = null;
function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      max: 10
    });
  }
  return pool;
}

const CORE_MOCK_STARTUPS = [
  {
    id: 's1',
    name: 'UrbanAI Technologies',
    legalEntity: 'UrbanAI Technologies Private Limited',
    registrationNumber: 'DPIIT-KA-2022-8419',
    dpiitNumber: 'DPIIT-KA-2022-8419',
    incorporationYear: 2022,
    city: 'Bengaluru',
    state: 'Karnataka',
    founderName: 'Ananya Deshmukh (Co-Founder & CTO)',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    tagline: 'Edge AI computer vision engines for adaptive municipal traffic signals',
    sectors: ['Urban Mobility & Traffic Optimization', 'Public Safety, Disaster Warning & Drone GIS'],
    technologies: ['Computer Vision', 'Edge AI', 'IoT Telemetry'],
    matchScore: 96,
    solutionName: 'AdaptiveFlow Junction Engine (v3.2)',
    solutionSummary: 'Gantry-mounted neural camera nodes evaluating queue density in real time, communicating over NTCIP controllers to adjust signal green splits without roadside cloud latency.',
    totalDeployments: 14,
    governmentDeployments: 6,
    typicalPilotMonths: '4–6 Months',
    teamSize: 18,
    pilotReadiness: 'Production Ready (TRL 8)',
    trlLevel: 'TRL-8 (Production Ready)',
    website: 'https://urbanai.example.in'
  },
  {
    id: 's2',
    name: 'AquaSense Systems',
    legalEntity: 'AquaSense Telemetry Private Limited',
    registrationNumber: 'DPIIT-MH-2021-3920',
    dpiitNumber: 'DPIIT-MH-2021-3920',
    incorporationYear: 2021,
    city: 'Pune',
    state: 'Maharashtra',
    founderName: 'Siddharth Rao (Chief Executive & Co-Founder)',
    logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    tagline: 'Non-invasive acoustic wave hydrophones for underground water pipe diagnostics',
    sectors: ['Water Resources, Leak Detection & Sewage'],
    technologies: ['Acoustic Sensors', 'IoT Telemetry', 'Signal Processing'],
    matchScore: 92,
    solutionName: 'PipePulse Acoustic Sentinel',
    solutionSummary: 'High-frequency hydrophones listening to transient vibration signatures along water mains to isolate leaks within ±2 meters.',
    totalDeployments: 9,
    governmentDeployments: 4,
    typicalPilotMonths: '3–5 Months',
    teamSize: 12,
    pilotReadiness: 'Field Validated (TRL 7)',
    trlLevel: 'TRL-7 (Field Validated)',
    website: 'https://aquasense.example.in'
  },
  {
    id: 's3',
    name: 'HelioGrid Power',
    legalEntity: 'HelioGrid Solutions LLP',
    registrationNumber: 'DPIIT-KA-2023-1102',
    dpiitNumber: 'DPIIT-KA-2023-1102',
    incorporationYear: 2023,
    city: 'Tumakuru',
    state: 'Karnataka',
    founderName: 'Dr. Vivek Swaminathan (Grid Systems Lead)',
    logoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    tagline: 'Smart microgrid battery buffering and feeder voltage stabilization',
    sectors: ['Clean Energy, Solar Microgrids & Storage'],
    technologies: ['Smart Microgrids', 'Edge AI', 'IoT Telemetry'],
    matchScore: 89,
    solutionName: 'VoltStabilize Micro-BESS Controller',
    solutionSummary: 'Sub-second inverter firmware adjusting real and reactive power compensation to dampen high-solar feeder transients.',
    totalDeployments: 7,
    governmentDeployments: 2,
    typicalPilotMonths: '5–6 Months',
    teamSize: 9,
    pilotReadiness: 'Pilot Validated (TRL 7)',
    trlLevel: 'TRL-7 (Pilot Validated)',
    website: 'https://heliogrid.example.in'
  },
  {
    id: 's4',
    name: 'MedScan Edge',
    legalEntity: 'MedScan Diagnostics Technologies Pvt Ltd',
    registrationNumber: 'DPIIT-KA-2020-5512',
    dpiitNumber: 'DPIIT-KA-2020-5512',
    incorporationYear: 2020,
    city: 'Dharwad',
    state: 'Karnataka',
    founderName: 'Dr. Radhika Iyer (Clinical AI Director)',
    logoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    tagline: 'Zero-cloud latency edge DICOM chest radiograph AI for primary healthcare',
    sectors: ['Healthcare, Diagnostics & Telemedicine'],
    technologies: ['Edge AI', 'Cloud DICOM', 'Computer Vision'],
    matchScore: 94,
    solutionName: 'ThoraxEdge Medical AI',
    solutionSummary: 'Offline appliance performing multi-pathology thoracic screening in under 60 seconds with strict zero-patient PII retention.',
    totalDeployments: 22,
    governmentDeployments: 8,
    typicalPilotMonths: '3–4 Months',
    teamSize: 24,
    pilotReadiness: 'Production Ready (TRL 8)',
    trlLevel: 'TRL-8 (Production Ready)',
    website: 'https://medscanedge.example.in'
  },
  {
    id: 's5',
    name: 'AeroGeo Systems',
    legalEntity: 'AeroGeo Spatio-temporal Ltd',
    registrationNumber: 'DPIIT-TS-2022-7718',
    dpiitNumber: 'DPIIT-TS-2022-7718',
    incorporationYear: 2022,
    city: 'Hyderabad',
    state: 'Telangana',
    founderName: 'Kavita Menon (Geomatics Co-Founder)',
    logoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=160&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
    tagline: 'RTK photogrammetry drones and automated parcel feature extraction',
    sectors: ['Digital Land Governance, Municipal Tax & Records', 'Public Safety, Disaster Warning & Drone GIS'],
    technologies: ['Computer Vision', 'Geospatial Routing', 'Edge AI'],
    matchScore: 88,
    solutionName: 'GeoCadastre Drone Survey',
    solutionSummary: 'Autonomous flight grid capture with automated polygon divergence comparison against municipal cadastral databases.',
    totalDeployments: 16,
    governmentDeployments: 7,
    typicalPilotMonths: '4 Months',
    teamSize: 15,
    pilotReadiness: 'Production Ready (TRL 8)',
    trlLevel: 'TRL-8 (Production Ready)',
    website: 'https://aerogeo.example.in'
  },
  {
    id: 's6',
    name: 'AuraSense CleanTech',
    legalEntity: 'AuraSense Technologies India Pvt Ltd',
    registrationNumber: 'DPIIT-DL-2023-9021',
    dpiitNumber: 'DPIIT-DL-2023-9021',
    incorporationYear: 2023,
    city: 'New Delhi',
    state: 'Delhi NCR',
    founderName: 'Manish Verma (Atmospheric Systems Lead)',
    logoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=800&q=80',
    tagline: 'Solar particulate nodes with automated mist cannon suppression triggers',
    sectors: ['Air Quality, Environmental & Emission Monitoring'],
    technologies: ['IoT Telemetry', 'Acoustic Sensors', 'Edge AI'],
    matchScore: 91,
    solutionName: 'DustGuard Automated Sentinel',
    solutionSummary: 'Calibrated laser optical particle sensors triggering smart localized water misting before fugitive dust plumes escape job sites.',
    totalDeployments: 11,
    governmentDeployments: 5,
    typicalPilotMonths: '4–5 Months',
    teamSize: 14,
    pilotReadiness: 'Field Validated (TRL 7)',
    trlLevel: 'TRL-7 (Field Validated)',
    website: 'https://aurasense.example.in'
  }
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function cleanStartupName(rawName) {
  if (!rawName) return "Innovator Tech";
  let name = rawName.trim();
  name = name.replace(/^["'\\]+|["'\\]+$/g, '');
  name = name.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\+/g, '');
  if (/^https?:\/\//i.test(name)) {
    try {
      const parsed = new URL(name);
      name = parsed.hostname.replace(/^www\./i, '').split('.')[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      name = name.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/.*$/, '');
    }
  }
  return name.trim() || rawName;
}

const CITY_TO_STATE = {
  'Bengaluru': 'Karnataka',
  'Bangalore': 'Karnataka',
  'Mumbai': 'Maharashtra',
  'Pune': 'Maharashtra',
  'New Delhi': 'Delhi NCR',
  'Delhi': 'Delhi NCR',
  'Gurugram': 'Haryana',
  'Gurgaon': 'Haryana',
  'Noida': 'Uttar Pradesh',
  'Hyderabad': 'Telangana',
  'Chennai': 'Tamil Nadu',
  'Kolkata': 'West Bengal',
  'Ahmedabad': 'Gujarat',
  'Jaipur': 'Rajasthan',
  'Kochi': 'Kerala',
  'Indore': 'Madhya Pradesh',
  'Chandigarh': 'Punjab'
};

function mapRowToStartup(row) {
  const name = cleanStartupName(row.name);
  const city = row.city || 'Bengaluru';
  const state = CITY_TO_STATE[city] || 'India';
  const year = row.foundedYear || 2021;
  const shortId = (row.id || '').slice(0, 4).toUpperCase();
  const dpiitNo = row.dpiitRecognized
    ? `DPIIT-${state.slice(0, 2).toUpperCase()}-${year}-${shortId}`
    : undefined;
  const regNo = dpiitNo || `U72900${state.slice(0, 2).toUpperCase()}${year}PTC${Math.abs(hashString(row.id || name)) % 900000 + 100000}`;

  const tech = (Array.isArray(row.techStack) && row.techStack.length > 0)
    ? row.techStack
    : (Array.isArray(row.coreCapabilities) && row.coreCapabilities.length > 0)
      ? row.coreCapabilities
      : ['Cloud Infrastructure', 'Edge AI', 'IoT Telemetry'];

  const sectors = row.industry ? [row.industry] : ['Civic Infrastructure'];
  const summary = row.summary || `${name} provides scalable ${row.industry || 'technology'} systems engineered for public sector governance.`;
  const matchScore = row.efficiencyScore ? Math.min(99, Math.max(65, row.efficiencyScore)) : 88;
  const projectCount = typeof row.projectCount === 'number' ? row.projectCount : 8;

  return {
    id: String(row.id),
    name: name,
    legalEntity: `${name} Technologies Pvt Ltd`,
    registrationNumber: regNo,
    dpiitNumber: dpiitNo,
    incorporationYear: year,
    city: city,
    state: state,
    tagline: summary.length > 110 ? summary.slice(0, 107) + '...' : summary,
    sectors: sectors,
    technologies: tech,
    matchScore: matchScore,
    solutionName: `${name} Civic Solution Platform`,
    solutionSummary: summary,
    totalDeployments: Math.max(projectCount * 2, 4),
    governmentDeployments: projectCount,
    typicalPilotMonths: '3–6 Months',
    teamSize: 12 + (projectCount % 20),
    pilotReadiness: row.dpiitRecognized ? 'Production Ready (TRL 8)' : 'Field Validated (TRL 7)',
    trlLevel: row.dpiitRecognized ? 'TRL-8 (System Validated)' : 'TRL-7 (Field Prototype Verified)',
    website: `https://${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.example.in`,
    founderName: `${name} Founding Team`
  };
}

async function getStartupsList(limit) {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.warn('⚠️ DATABASE_URL missing in getStartupsList, using fallback.');
      return CORE_MOCK_STARTUPS;
    }

    const p = getPool();
    let query = `
      SELECT 
        s.id, 
        s.name, 
        s.city, 
        s.industry, 
        s."foundedYear", 
        s."dpiitRecognized",
        cp.summary, 
        cp."techStack", 
        cp."coreCapabilities", 
        cp.certifications,
        cp."previousProjects",
        cp."projectCount",
        cp."efficiencyScore"
      FROM "Startup" s
      LEFT JOIN "CapabilityPassport" cp ON cp."startupId" = s.id
      WHERE s.name IS NOT NULL AND s.name != ''
      ORDER BY s.name ASC
    `;
    const params = [];
    if (limit && Number.isInteger(limit) && limit > 0) {
      query += ` LIMIT $1`;
      params.push(limit);
    }
    const res = await p.query(query, params);
    const dbStartups = res.rows.map(mapRowToStartup);

    // Merge core mock startups so legacy proposals (s1..s6) and demo items remain fully resolved
    const coreNames = new Set(CORE_MOCK_STARTUPS.map(m => m.name.toLowerCase()));
    const nonDuplicateDB = dbStartups.filter(s => !coreNames.has(s.name.toLowerCase()));

    return [...CORE_MOCK_STARTUPS, ...nonDuplicateDB];
  } catch (err) {
    console.error('⚠️ DB read failed in getStartupsList, falling back to mock startups:', err.message);
    return CORE_MOCK_STARTUPS;
  }
}

module.exports = {
  getStartupsList,
  CORE_MOCK_STARTUPS
};
