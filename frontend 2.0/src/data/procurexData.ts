import { Challenge, Startup, Proposal, PilotData } from '../types';

export const mockChallenges: Challenge[] = [
  {
    id: 'PX-KA-2026-00124',
    title: 'Adaptive Urban Traffic Signal Optimization using Computer Vision',
    department: 'Department of Urban Development & Bengaluru Traffic Police',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    city: 'Bengaluru',
    jurisdiction: 'Outer Ring Road (Marathahalli to Kadubeesanahalli Corridor)',
    sector: 'Urban Mobility & Traffic Optimization',
    technologies: ['Computer Vision', 'Edge AI', 'IoT Telemetry'],
    priority: 'Critical',
    estimatedBudget: '₹28–40 Lakhs',
    pilotDuration: '6 Months',
    responseWindowDays: 14,
    deadlineDate: '2026-10-15',
    status: 'Pilot Prototype',
    matchScore: 96,
    problemDescription:
      'Peak-hour bottleneck along the 14km arterial tech corridor causing average junction wait times of 18.4 minutes. Fixed-cycle timers fail to adapt to asymmetric lane surges and transit bus priorities.',
    currentSituation:
      'Pre-programmed 120-second signal cycles operated manually during congestion, resulting in spillover queue lengths exceeding 600m.',
    desiredOutcome:
      'Deploy real-time optical vehicle classification and queue density estimation to adjust green splits dynamically, reducing corridor delay by at least 15%.',
    successCriteria:
      '≥15% reduction in mean intersection dwell time across 8 test nodes; ≥90% vehicle queue classification accuracy during rain/night conditions.',
    imageUrl:
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 6,
    publicSafeSummary:
      'Dynamic signal split control via on-gantry neural accelerators reducing rush hour transit congestion across 8 key junctions.',
    activePilotStartup: 'UrbanAI Technologies',
    activePilotDay: 142,
    activePilotTotalDays: 180,
  },
  {
    id: 'PX-MH-2026-00301',
    title: 'Subterranean Pipeline Acoustic Leak Localization & Pressure Balancing',
    department: 'Pune Municipal Corporation (Water Supply Division)',
    state: 'Maharashtra',
    district: 'Pune',
    city: 'Pune',
    jurisdiction: 'Kothrud & Swargate Distribution Sectors',
    sector: 'Water Resources, Leak Detection & Sewage',
    technologies: ['Acoustic Sensors', 'IoT Telemetry', 'Signal Processing'],
    priority: 'High',
    estimatedBudget: '₹32–45 Lakhs',
    pilotDuration: '5 Months',
    responseWindowDays: 18,
    deadlineDate: '2026-10-22',
    status: 'Active',
    matchScore: 91,
    problemDescription:
      'Non-revenue water losses estimated at 24% due to hidden hairline fractures in aging ductile iron trunk mains, causing localized pressure collapses and street subsidence.',
    currentSituation:
      'Post-rupture excavation upon citizen complaint; manual stethoscope sounding rods with delayed response times averaging 72 hours.',
    desiredOutcome:
      'Non-invasive clamp-on acoustic hydrophones pin-pointing leak coordinates within ±2 meters before surface cratering occurs.',
    successCriteria:
      'Continuous leak detection with <3% false positive rate over 22km pipe grid; real-time pressure surge warning under 60 seconds.',
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 4,
    publicSafeSummary:
      'Clamp-on acoustic hydrophone telemetry mapping underground micro-ruptures before road subsidence occurs.',
  },
  {
    id: 'PX-KA-2026-00418',
    title: 'Decentralized Rooftop PV Feeder Voltage Stabilization & Storage Dispatch',
    department: 'Bangalore Electricity Supply Company (BESCOM)',
    state: 'Karnataka',
    district: 'Tumakuru',
    city: 'Tumakuru',
    jurisdiction: 'Tumakuru Smart Industrial Substation Grid 11kV',
    sector: 'Clean Energy, Solar Microgrids & Storage',
    technologies: ['Smart Microgrids', 'Edge AI', 'IoT Telemetry'],
    priority: 'High',
    estimatedBudget: '₹35–50 Lakhs',
    pilotDuration: '6 Months',
    responseWindowDays: 12,
    deadlineDate: '2026-10-08',
    status: 'Under Review',
    matchScore: 89,
    problemDescription:
      'Voltage swings exceeding ±8% on 11kV rural-urban feeders triggered by sudden cloud intermittency across 4.2 MW rooftop solar installations.',
    currentSituation:
      'Substation tap changers cycle up to 80 times daily causing equipment wear and unexpected feeder tripping during mid-day generation spikes.',
    desiredOutcome:
      'Sub-second smart inverter battery dispatch algorithm dampening voltage sags and peaks at the feeder head without utility tap changes.',
    successCriteria:
      'Maintains feeder bus voltage within statutory ±3% bandwidth across 100% of cloud fluctuation events.',
    imageUrl:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 5,
    publicSafeSummary:
      'Sub-second inverter telemetry stabilizing 11kV feeder voltage amid rapid solar cloud transients.',
  },
  {
    id: 'PX-KA-2026-00522',
    title: 'Edge-AI Automated Radiographic Screening for District Health Centers',
    department: 'Department of Health & Family Welfare',
    state: 'Karnataka',
    district: 'Dharwad',
    city: 'Dharwad',
    jurisdiction: 'Dharwad District Hospital & 4 Taluka PHCs',
    sector: 'Healthcare, Diagnostics & Telemedicine',
    technologies: ['Edge AI', 'Cloud DICOM', 'Computer Vision'],
    priority: 'Critical',
    estimatedBudget: '₹22–35 Lakhs',
    pilotDuration: '4 Months',
    responseWindowDays: 16,
    deadlineDate: '2026-10-18',
    status: 'Active',
    matchScore: 94,
    problemDescription:
      'Rural primary health clinics experience 48-hour turnarounds for chest X-ray triage due to a shortage of on-site radiologists, delaying emergency trauma and pneumonia treatment.',
    currentSituation:
      'Films shipped by courier or queued on remote teleradiology portals with substantial latency during evening and weekend shifts.',
    desiredOutcome:
      'Deploy on-premises edge inference box processing DICOM studies in under 90 seconds to alert primary care medical officers to acute abnormalities.',
    successCriteria:
      'Sensitivity ≥95% and specificity ≥90% validated against senior radiologist ground truth over 1,000 consecutive emergency cases.',
    imageUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 3,
    publicSafeSummary:
      'On-premise edge DICOM inference generating rapid emergency radiology flags within 90 seconds.',
  },
  {
    id: 'PX-DL-2026-00612',
    title: 'Hyperlocal Air Particulate & Dust Dispersion Telemetry for Construction Corridors',
    department: 'Delhi Pollution Control Committee (DPCC)',
    state: 'Delhi NCR',
    district: 'South Delhi',
    city: 'New Delhi',
    jurisdiction: 'Ring Road Construction & Metro Expansion Corridor',
    sector: 'Air Quality, Environmental & Emission Monitoring',
    technologies: ['IoT Telemetry', 'Acoustic Sensors', 'Edge AI'],
    priority: 'High',
    estimatedBudget: '₹30–42 Lakhs',
    pilotDuration: '5 Months',
    responseWindowDays: 20,
    deadlineDate: '2026-10-25',
    status: 'Active',
    matchScore: 93,
    problemDescription:
      'Fugitive dust from high-density civil infrastructure projects leads to unmonitored PM2.5/PM10 spikes exceeding 350 µg/m³ across dense residential corridors.',
    currentSituation:
      'Coarse regulatory monitoring stations placed 4km apart lack granular source-attribution to trigger automated anti-smog misting.',
    desiredOutcome:
      'Solar-powered dense sensor grid with laser optical particle counters automatically triggering mist cannons when PM10 thresholds are breached.',
    successCriteria:
      'Continuous sensor uptime >98%; autonomous mist cannon triggering with <45 second reaction time.',
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 5,
    publicSafeSummary:
      'Solar-powered dense particulate monitors with automated anti-smog mist cannon actuation.',
  },
  {
    id: 'PX-TS-2026-00780',
    title: 'Autonomous Drone GIS Survey for Municipal Tax Geo-referencing',
    department: 'Greater Hyderabad Municipal Corporation (GHMC)',
    state: 'Telangana',
    district: 'Hyderabad',
    city: 'Hyderabad',
    jurisdiction: 'Serilingampally & Madhapur Municipal Zones',
    sector: 'Digital Land Governance, Municipal Tax & Records',
    technologies: ['Computer Vision', 'Geospatial Routing', 'Edge AI'],
    priority: 'Medium',
    estimatedBudget: '₹25–38 Lakhs',
    pilotDuration: '4 Months',
    responseWindowDays: 15,
    deadlineDate: '2026-10-20',
    status: 'Active',
    matchScore: 88,
    problemDescription:
      'Discrepancies in property footprint declarations resulting in municipal assessment leakages and outdated spatial zoning registers.',
    currentSituation:
      'Door-to-door physical tape measurements vulnerable to omission and slow survey turnaround times of 18+ months.',
    desiredOutcome:
      'Centimeter-grade RTK drone photogrammetry and automatic building footprint polygon extraction compared with property tax IDs.',
    successCriteria:
      'Sub-5cm ground sampling distance with automated identification of unassessed built-up area variance ≥10 sq meters.',
    imageUrl:
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 3,
    publicSafeSummary:
      'High-precision RTK aerial spatial photogrammetry matching built footprints against municipal registers.',
  },
  {
    id: 'PX-GJ-2026-00845',
    title: 'AI Optical Segregation & Robotic Sorting in Solid Municipal Waste Streams',
    department: 'Ahmedabad Municipal Corporation (Solid Waste Management)',
    state: 'Gujarat',
    district: 'Ahmedabad',
    city: 'Ahmedabad',
    jurisdiction: 'Pirana Resource Recovery & Material Processing Plant',
    sector: 'Waste Management, Circular Economy & Robotics',
    technologies: ['Computer Vision', 'Edge AI', 'IoT Telemetry'],
    priority: 'High',
    estimatedBudget: '₹30–45 Lakhs',
    pilotDuration: '6 Months',
    responseWindowDays: 19,
    deadlineDate: '2026-10-30',
    status: 'Active',
    matchScore: 92,
    problemDescription:
      'Municipal dry waste incoming at 450 tonnes/day requires manual conveyor belt sorting with high occupational hazard and low recovery of high-grade polymers.',
    currentSituation:
      'Manual segregation yields only 32% recyclable recovery, with substantial contamination sending recyclable PET and HDPE to landfill heaps.',
    desiredOutcome:
      'Deploy delta robotic sorting arm guided by hyperspectral near-infrared vision, classifying and picking 80 items per minute with >95% polymer accuracy.',
    successCriteria:
      '≥85% recovery rate of target recyclable polymers; automated reject ejection with <5% cross-contamination.',
    imageUrl:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 4,
    publicSafeSummary:
      'Near-infrared optical identification and robotic picker arms recovering high-grade polymers from municipal conveyer lines.',
  },
  {
    id: 'PX-PB-2026-00912',
    title: 'Multispectral Micro-Irrigation & Soil Nitrate Telemetry for Water Conservation',
    department: 'Department of Agriculture & Farmers Welfare, Punjab',
    state: 'Punjab',
    district: 'Ludhiana',
    city: 'Ludhiana',
    jurisdiction: 'Samrala Block Agri-Telemetry Cluster (500 Hectares)',
    sector: 'Smart Agriculture, Irrigation & Soil Telemetry',
    technologies: ['IoT Telemetry', 'Geospatial Routing', 'Signal Processing'],
    priority: 'Critical',
    estimatedBudget: '₹26–36 Lakhs',
    pilotDuration: '5 Months',
    responseWindowDays: 14,
    deadlineDate: '2026-10-16',
    status: 'Active',
    matchScore: 95,
    problemDescription:
      'Over-extraction of groundwater in the Indo-Gangetic aquifer with water tables dropping 75cm annually, exacerbated by flood-irrigation and unmeasured fertilizer runoff.',
    currentSituation:
      'Tube-well electric pumps run on fixed timers without real-time root-zone moisture or transpiration feedback, wasting up to 40% applied water.',
    desiredOutcome:
      'Solar subsurface capacitance probes combined with weekly drone multispectral NDVI mapping, automatically throttling solar pump solenoids.',
    successCriteria:
      '≥25% water volume reduction per acre-cycle while maintaining crop yield parity against control plots.',
    imageUrl:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80',
    heroImage:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85',
    proposalsCount: 3,
    publicSafeSummary:
      'Subsurface capacitance sensor grids and multispectral aerial health scans governing precision tube-well dispatch.',
  }
];

export const DEFAULT_CHALLENGE_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
];

export const mockStartups: Startup[] = [
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
    solutionSummary:
      'Gantry-mounted neural camera nodes evaluating queue density in real time, communicating over NTCIP controllers to adjust signal green splits without roadside cloud latency.',
    totalDeployments: 14,
    governmentDeployments: 6,
    typicalPilotMonths: '4–6 Months',
    teamSize: 18,
    pilotReadiness: 'Production Ready (TRL 8)',
    website: 'https://urbanai.example.in',
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
    solutionSummary:
      'High-frequency hydrophones listening to transient vibration signatures along water mains to isolate leaks within ±2 meters.',
    totalDeployments: 9,
    governmentDeployments: 4,
    typicalPilotMonths: '3–5 Months',
    teamSize: 12,
    pilotReadiness: 'Field Validated (TRL 7)',
    website: 'https://aquasense.example.in',
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
    solutionSummary:
      'Sub-second inverter firmware adjusting real and reactive power compensation to dampen high-solar feeder transients.',
    totalDeployments: 7,
    governmentDeployments: 2,
    typicalPilotMonths: '5–6 Months',
    teamSize: 9,
    pilotReadiness: 'Pilot Validated (TRL 7)',
    website: 'https://heliogrid.example.in',
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
    solutionSummary:
      'Offline appliance performing multi-pathology thoracic screening in under 60 seconds with strict zero-patient PII retention.',
    totalDeployments: 22,
    governmentDeployments: 8,
    typicalPilotMonths: '3–4 Months',
    teamSize: 24,
    pilotReadiness: 'Production Ready (TRL 8)',
    website: 'https://medscanedge.example.in',
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
    solutionSummary:
      'Autonomous flight grid capture with automated polygon divergence comparison against municipal cadastral databases.',
    totalDeployments: 16,
    governmentDeployments: 7,
    typicalPilotMonths: '4 Months',
    teamSize: 15,
    pilotReadiness: 'Production Ready (TRL 8)',
    website: 'https://aerogeo.example.in',
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
    solutionSummary:
      'Calibrated laser optical particle sensors triggering smart localized water misting before fugitive dust plumes escape job sites.',
    totalDeployments: 11,
    governmentDeployments: 5,
    typicalPilotMonths: '4–5 Months',
    teamSize: 14,
    pilotReadiness: 'Field Validated (TRL 7)',
    website: 'https://aurasense.example.in',
  }
];

export const mockProposals: Proposal[] = [
  {
    id: 'PROP-2026-001',
    challengeId: 'PX-KA-2026-00124',
    challengeTitle: 'Adaptive Urban Traffic Signal Optimization using Computer Vision',
    startupId: 's1',
    startupName: 'UrbanAI Technologies',
    proposedBudget: '₹28,50,000',
    pilotCost: '₹12,80,000',
    timelineMonths: '5 Months',
    technicalFitScore: 96,
    pilotFeasibilityScore: 94,
    experienceScore: 92,
    commercialScore: 88,
    overallScore: 92.5,
    rank: 1,
    status: 'Shortlisted',
    solutionArchitecture:
      'Dual 4K HDR optical sensor heads with on-edge neural inference accelerators (16 TOPS). Video streams are analyzed locally and discarded immediately to preserve citizen privacy. Only aggregate numerical vehicle counts are streamed via encrypted cellular modem.',
    pilotDeliverables:
      '8 optical sensor nodes across Marathahalli corridor. Real-time green split controller interfacing. Bi-weekly delay audit logs.',
    governmentDependencies: [
      'Access to existing traffic controller signal cabinets for RS-232 / Ethernet NTCIP communication',
      'Permission for 2-hour gantry installation window at night',
    ],
    keyRisks: [
      'Monsoon optical splash (mitigated by hydrophobic nano-coating)',
      'Unplanned grid outages (mitigated by 4-hr battery reserve)',
    ],
    evidencePointers: [
      'DPIIT Recognition Certificate (DPIIT-KA-2022-8419)',
      'Whitefield ITPL Corridor 90-Day Delay Audit Report',
      'ISO 27001 Data Privacy & Zero-PII Video Architecture Affidavit',
    ],
    submittedAt: '2026-08-28',
  },
  {
    id: 'PROP-2026-002',
    challengeId: 'PX-KA-2026-00124',
    challengeTitle: 'Adaptive Urban Traffic Signal Optimization using Computer Vision',
    startupId: 's5',
    startupName: 'AeroGeo Systems',
    proposedBudget: '₹34,20,000',
    pilotCost: '₹14,50,000',
    timelineMonths: '6 Months',
    technicalFitScore: 88,
    pilotFeasibilityScore: 86,
    experienceScore: 90,
    commercialScore: 82,
    overallScore: 86.5,
    rank: 2,
    status: 'Under Review',
    solutionArchitecture:
      'Hybrid aerial tethered drone and ground radar sensors sending queue depth metrics to a cloud computing cluster for signal timing generation.',
    pilotDeliverables:
      '2 tethered sensor drones, 6 ground radars, and cloud management dashboard with traffic heatmaps.',
    governmentDependencies: [
      'Tethered drone airspace clearance along arterial corridor',
      'High-bandwidth municipal fiber connection',
    ],
    keyRisks: [
      'Airspace restrictions during VIP transit routes',
      'Cloud latency variance during network throttling',
    ],
    evidencePointers: [
      'DPIIT Recognition Certificate (DPIIT-TS-2022-7718)',
      'Hyderabad Smart Corridor Benchmark Testimonial',
    ],
    submittedAt: '2026-08-30',
  },
  {
    id: 'PROP-2026-003',
    challengeId: 'PX-KA-2026-00124',
    challengeTitle: 'Adaptive Urban Traffic Signal Optimization using Computer Vision',
    startupId: 's6',
    startupName: 'AuraSense CleanTech',
    proposedBudget: '₹38,00,000',
    pilotCost: '₹16,00,000',
    timelineMonths: '6 Months',
    technicalFitScore: 82,
    pilotFeasibilityScore: 80,
    experienceScore: 78,
    commercialScore: 75,
    overallScore: 78.8,
    rank: 3,
    status: 'Under Review',
    solutionArchitecture:
      'Optical road cameras integrated with environmental particulate sensors, adjusting signal cycles based on both queue lengths and tailpipe emissions accumulation.',
    pilotDeliverables:
      '8 integrated camera-emission pods, roadside controller relays, and weekly environmental corridor reports.',
    governmentDependencies: [
      'Gantry attachment permits',
      'Signal controller protocol documentation',
    ],
    keyRisks: [
      'Optical calibration drift from heavy diesel exhaust accumulation',
      'Complex multi-variable optimization tradeoffs between delay and emissions',
    ],
    evidencePointers: [
      'DPIIT Recognition Certificate (DPIIT-DL-2023-9021)',
      'DPCC Corridor Pilot Reference',
    ],
    submittedAt: '2026-09-02',
  }
];

export const mockPilotData: PilotData = {
  contractId: 'PX-PILOT-BLR-2026-01',
  startupName: 'UrbanAI Technologies',
  department: 'Department of Urban Development & Bengaluru Traffic Police',
  corridor: 'Outer Ring Road (Marathahalli to Kadubeesanahalli Corridor, 14.2 km)',
  totalDays: 180,
  daysElapsed: 142,
  actualDelayReduction: 18.2,
  targetDelayReduction: 15.0,
  sensorUptime: 99.4,
  milestones: [
    {
      id: 'm1',
      title: 'Milestone 01: Hardware Gantry Audit & Calibration',
      criteria: '8 optical nodes installed, certified IP67 weatherproof, and calibrated under rain conditions.',
      payoutAmount: '₹3,20,000 (25%)',
      dueDate: '2026-05-15',
      status: 'Disbursed',
      verifiedAt: '2026-05-12 by IISc Civil Quality Cell',
    },
    {
      id: 'm2',
      title: 'Milestone 02: Controller Cabinet Signal Synchronization',
      criteria: 'Direct NTCIP 1202 protocol handshakes active across all 8 junction controllers without faults.',
      payoutAmount: '₹2,56,000 (20%)',
      dueDate: '2026-06-30',
      status: 'Disbursed',
      verifiedAt: '2026-06-28 by BTP Technical Cell',
    },
    {
      id: 'm3',
      title: 'Milestone 03: Floating-Car Delay Reduction Verification',
      criteria: 'Independent GPS probe run audit verifying ≥15% mean delay drop during peak morning hours.',
      payoutAmount: '₹3,84,000 (30%)',
      dueDate: '2026-08-31',
      status: 'Disbursed',
      verifiedAt: '2026-08-29 by DULT Transportation Auditors',
    },
    {
      id: 'm4',
      title: 'Milestone 04: Full 180-Day Scale Readiness Dossier',
      criteria: 'Completion of 180-day continuous run, maintenance log signoff, and city-wide 48-junction RFP spec.',
      payoutAmount: '₹3,20,000 (25%)',
      dueDate: '2026-10-31',
      status: 'Verification Pending',
    }
  ]
};

export const CIVIC_SERVICE_DOMAINS: string[] = [
  "Urban Mobility & Traffic Optimization",
  "Water Resources, Leak Detection & Sewage",
  "Clean Energy, Solar Microgrids & Storage",
  "Healthcare, Diagnostics & Telemedicine",
  "Smart Agriculture, Irrigation & Soil Telemetry",
  "Waste Management, Circular Economy & Robotics",
  "Public Safety, Disaster Warning & Drone GIS",
  "Air Quality, Environmental & Emission Monitoring",
  "Digital Land Governance, Municipal Tax & Records",
  "Heritage Conservation & Smart Civic Infrastructure"
];

export const PROCUREX_CHALLENGES = mockChallenges;
export const PROCUREX_STARTUPS = mockStartups;
export const PROCUREX_PROPOSALS = mockProposals;
export const INITIAL_PILOT_DATA = mockPilotData;

