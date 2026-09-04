
const PROCUREX_DATA = {
  government:{
    name:"Department of Urban Development",
    state:"Karnataka", district:"Bengaluru Urban", city:"Bengaluru",
    sector:["Urban Mobility","Digital Governance"], technologies:["AI/ML","IoT","Computer Vision"]
  },
  startups:[
    {id:"s1",name:"UrbanAI Technologies",sector:["Urban Mobility"],tech:["AI/ML","Computer Vision"],location:["Karnataka"],experience:8,deployments:12,government:true,match:92},
    {id:"s2",name:"CivicLabs",sector:["Digital Governance"],tech:["Data Analytics","Cloud"],location:["Karnataka"],experience:3,deployments:6,government:true,match:84},
    {id:"s3",name:"MobilityX Labs",sector:["Urban Mobility"],tech:["IoT","AI/ML"],location:["Maharashtra","Karnataka"],experience:6,deployments:9,government:false,match:88},
    {id:"s4",name:"AquaSense",sector:["Water"],tech:["IoT","Analytics"],location:["Tamil Nadu"],experience:5,deployments:7,government:false,match:71}
  ],
  challenges:[
    {id:"PX-GOV-2026-00124",title:"AI-Based Urban Traffic Management",department:"Department of Urban Development",location:"Bengaluru Urban",sector:"Urban Mobility",tech:["AI/ML","IoT","Computer Vision"],priority:"High",budget:"₹25–40 Lakhs",responseDays:14,status:"Active",match:92},
    {id:"PX-GOV-2026-00125",title:"Smart Waste Collection System",department:"Bengaluru Municipal Corporation",location:"Bengaluru",sector:"Environment",tech:["IoT","Analytics"],priority:"Medium",budget:"₹18–30 Lakhs",responseDays:10,status:"Active",match:78},
    {id:"PX-GOV-2026-00126",title:"AI Water Leak Detection",department:"Bengaluru Water Supply Board",location:"Bengaluru",sector:"Water",tech:["AI/ML","IoT"],priority:"High",budget:"₹20–35 Lakhs",responseDays:12,status:"Active",match:69}
  ],
  proposals:[
    {startup:"UrbanAI Technologies",cost:"₹28L",timeline:"5 mo",experience:"8 yrs",pilot:"Strong",status:"Shortlisted",score:91},
    {startup:"MobilityX Labs",cost:"₹32L",timeline:"6 mo",experience:"6 yrs",pilot:"Strong",status:"Shortlisted",score:88},
    {startup:"CivicLabs",cost:"₹24L",timeline:"8 mo",experience:"3 yrs",pilot:"Moderate",status:"Review",score:76}
  ],
  pilot:{name:"Smart Traffic Management Pilot",startup:"UrbanAI Technologies",location:"Bengaluru Urban",day:142,total:180,waitReduction:18,accuracy:94.2,users:12450,savings:"₹8.2L",progress:78}
};
function countChallenges(){return PROCUREX_DATA.challenges.length}
function countStartups(){return PROCUREX_DATA.startups.length}
