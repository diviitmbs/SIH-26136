import React, { useState } from 'react';
import { Proposal, Challenge, AuthUser, PilotData } from '../types';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Printer, 
  Download, 
  Shield, 
  Building2, 
  Rocket, 
  Calendar, 
  ArrowRight,
  FileCheck,
  QrCode
} from 'lucide-react';
import { ProcureXLogo } from './ProcureXLogo';
import { storage } from '../utils/storage';

interface PilotSanctionModalProps {
  proposal: Proposal | null;
  challenge?: Challenge | null;
  currentUser: AuthUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSanctionComplete: (awardedProposal: Proposal, updatedPilotData: PilotData) => void;
  onNavigateToPilot: () => void;
}

export const PilotSanctionModal: React.FC<PilotSanctionModalProps> = ({
  proposal,
  challenge,
  currentUser,
  isOpen,
  onClose,
  onSanctionComplete,
  onNavigateToPilot
}) => {
  const [sanctionNumber, setSanctionNumber] = useState(() => 
    `SANCTION/2026/GOV-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [sanctionedAmount, setSanctionedAmount] = useState(proposal?.pilotCost || '₹12,80,000');
  const [corridor, setCorridor] = useState(
    proposal?.pilotLocations || 'Outer Ring Road Bellandur-Marathahalli Innovation Corridor'
  );
  const [durationDays, setDurationDays] = useState(90);
  const [isExecuted, setIsExecuted] = useState(false);
  const [awardedProposalData, setAwardedProposalData] = useState<Proposal | null>(null);

  if (!isOpen || !proposal) return null;

  const deptName = currentUser?.department || challenge?.department || 'Department of Urban Development';
  const officerName = currentUser?.name || 'Er. Rajesh Kulkarni';
  const designation = currentUser?.designation || 'Executive Director (Civic Innovation Systems)';
  const officerId = currentUser?.officerId || 'BLR-ENG-2026';

  const handleExecuteSanction = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update proposal status
    const updatedProposal: Proposal = {
      ...proposal,
      status: 'Awarded',
      sanctionOrderNumber: sanctionNumber,
      awardedAt: new Date().toISOString().split('T')[0],
      awardedByOfficer: `${officerName} (${officerId})`,
      pilotCost: sanctionedAmount
    };

    // 2. Update storage proposal
    storage.updateProposal(updatedProposal);

    // 3. Update challenge status to Pilot Prototype
    if (challenge) {
      storage.updateChallengeStatus(challenge.id, 'Pilot Prototype');
    }

    // 4. Update Pilot Data for live telemetry
    const currentPilotData = storage.getPilotData();
    const newPilotData: PilotData = {
      ...currentPilotData,
      contractId: sanctionNumber,
      startupName: proposal.startupName,
      department: deptName,
      corridor: corridor,
      totalDays: durationDays,
      daysElapsed: 1,
      actualDelayReduction: 4.2,
      targetDelayReduction: 15.0,
      sensorUptime: 99.8,
      milestones: [
        {
          id: 'm1',
          title: 'Gantry Sensors & Edge Gateway Deployment',
          criteria: '10 sensor nodes mounted with uninterrupted power & RS-232 telemetry interface.',
          payoutAmount: '₹4,50,000',
          dueDate: 'Month 1',
          status: 'Upcoming'
        },
        {
          id: 'm2',
          title: 'Dynamic Signal Split Telemetry Verification',
          criteria: '≥98.5% uptime continuously streaming queue density to Command Center.',
          payoutAmount: '₹5,00,000',
          dueDate: 'Month 2',
          status: 'Upcoming'
        },
        {
          id: 'm3',
          title: 'Empirical Delay Reduction Verification & Final Audit',
          criteria: 'Independent validation of transit delay reduction and final handover dossier.',
          payoutAmount: '₹3,30,000',
          dueDate: 'Month 3',
          status: 'Upcoming'
        }
      ]
    };

    storage.setPilotData(newPilotData);
    setAwardedProposalData(updatedProposal);
    setIsExecuted(true);

    onSanctionComplete(updatedProposal, newPilotData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-neutral-900 dark:bg-[#050713] text-white border-b border-neutral-800 dark:border-indigo-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ProcureXLogo size="sm" inverted={true} showSubtitle={false} />
            <div className="border-l border-neutral-700 pl-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                GOVERNMENT OF INDIA · PUBLIC PROCUREMENT SANCTION
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                {isExecuted ? 'Pilot Sanction Order Issued & Executed' : 'Issue Formal Pilot Sanction Order'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {!isExecuted ? (
            /* STEP 1: FORMAL SANCTION EXECUTION FORM */
            <form onSubmit={handleExecuteSanction} className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-800 dark:text-neutral-200">
                  <span className="font-bold block text-emerald-800 dark:text-emerald-300">
                    Prototype Pilot Decision Simulation
                  </span>
                  This prototype action simulates a government pilot decision and generates local demo records. It does not create a legally valid work order, approve funding, or constitute government sanction.
                </div>
              </div>

              {/* Startup & Challenge Summary Card */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200/70 dark:border-indigo-950/70 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                    Awardee Startup Entity
                  </span>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                    {proposal.startupName}
                  </div>
                  <span className="text-neutral-500 font-mono text-[11px]">
                    DPIIT: {proposal.dpiitNumber || 'DPIIT-IN-2023-88219'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                    Procuring Authority
                  </span>
                  <div className="font-bold text-neutral-900 dark:text-white text-sm mt-0.5">
                    {deptName}
                  </div>
                  <span className="text-neutral-500 text-[11px]">
                    Officer: {officerName} · {designation}
                  </span>
                </div>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-mono">
                    Sanction Reference Number
                  </label>
                  <input
                    type="text"
                    required
                    value={sanctionNumber}
                    onChange={(e) => setSanctionNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-indigo-950 bg-white dark:bg-[#121638] text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-mono">
                    Sanctioned Pilot Amount
                  </label>
                  <input
                    type="text"
                    required
                    value={sanctionedAmount}
                    onChange={(e) => setSanctionedAmount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-indigo-950 bg-white dark:bg-[#121638] text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-mono">
                    Designated Pilot Corridor / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={corridor}
                    onChange={(e) => setCorridor(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-indigo-950 bg-white dark:bg-[#121638] text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-mono">
                    Pilot Period (Days)
                  </label>
                  <input
                    type="number"
                    required
                    min={30}
                    max={180}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 dark:border-indigo-950 bg-white dark:bg-[#121638] text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-mono">
                    Sanctioning Officer PIN / Sign-off
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${officerId} (Prototype identity field)`}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-indigo-950/60 bg-neutral-100 dark:bg-[#0e1230] text-xs font-mono text-neutral-500"
                  />
                </div>
              </div>

              {/* Statutory Affirmation */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-indigo-950 bg-neutral-50 dark:bg-[#0e1230] space-y-2 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required 
                    defaultChecked 
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-neutral-700 dark:text-neutral-300">
                    I understand this is a prototype simulation. Any real award must be completed through the department's authorised procurement and financial process.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-neutral-300 dark:border-indigo-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-xl hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center gap-2 btn-exotic"
                >
                  <Award className="w-4 h-4" />
                  <span>Execute Sanction & Launch Pilot</span>
                </button>
              </div>
            </form>
          ) : (
            /* STEP 2: OFFICIAL SANCTION ORDER CERTIFICATE */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-[#080b20] border-2 border-emerald-500 text-neutral-900 dark:text-neutral-100 space-y-6 relative overflow-hidden shadow-xl">
                {/* Official Crest Header */}
                <div className="text-center space-y-2 border-b border-neutral-200 dark:border-indigo-950/80 pb-6">
                  <div className="flex justify-center">
                    <ProcureXLogo size="lg" />
                  </div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    {deptName} · Civic Innovation Wing
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">
                    Official Pilot Sanction Order & Work Allocation
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
                    REF: {sanctionNumber}
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f1335] border border-neutral-200/80 dark:border-indigo-950">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                      Awarded Startup
                    </span>
                    <strong className="text-sm text-neutral-900 dark:text-white block mt-0.5">
                      {proposal.startupName}
                    </strong>
                    <span className="text-neutral-500 font-mono text-[11px]">
                      DPIIT: {proposal.dpiitNumber || 'DPIIT-IN-2023-88219'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f1335] border border-neutral-200/80 dark:border-indigo-950">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                      Sanctioned Financial Envelope
                    </span>
                    <strong className="text-base text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">
                      {sanctionedAmount}
                    </strong>
                    <span className="text-neutral-500 text-[11px]">
                      Tranche-based performance disbursement
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#0f1335] border border-neutral-200/80 dark:border-indigo-950 sm:col-span-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                      Authorized Testbed Corridor
                    </span>
                    <strong className="text-xs text-neutral-900 dark:text-white block mt-0.5">
                      {corridor}
                    </strong>
                    <span className="text-neutral-500 text-[11px]">
                      Duration: {durationDays} Days · Telemetry heartbeat tracking active
                    </span>
                  </div>
                </div>

                {/* Officer Signature & QR Block */}
                <div className="pt-4 border-t border-neutral-200 dark:border-indigo-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono block">
                      Sanctioning Authority Signature
                    </span>
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {officerName}
                    </div>
                    <div className="text-neutral-500 text-[11px]">
                      {designation} · ID: {officerId}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-[#0f1335] border border-neutral-200 dark:border-indigo-950 font-mono text-[10px]">
                    <QrCode className="w-8 h-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div>
                      <div className="font-bold text-neutral-800 dark:text-neutral-200">
                        CRYPTOGRAPHIC QR VERIFICATION
                      </div>
                      <div className="text-neutral-400">
                        HASH: {proposal.id.slice(0, 12)}...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 border border-[#E2DFD7] dark:border-[#2E3844] text-[#111416] dark:text-[#F4F2EC] text-xs font-mono font-bold rounded-lg hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Sanction Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToPilot();
                  }}
                  className="px-6 py-2.5 bg-[#087C78] hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase rounded-lg shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open Active Pilot Telemetry Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
