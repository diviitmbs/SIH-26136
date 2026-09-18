import React, { useState, useEffect, useRef } from 'react';
import { PilotData, CivicChatMessage, CivicFieldUpdate, AuthUser } from '../types';
import { storage } from '../utils/storage';
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  Activity, 
  Radio, 
  FileText, 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Clock, 
  Check, 
  AlertCircle,
  MessageSquare,
  Flame,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Layers,
  Bot
} from 'lucide-react';
import { ProcureXLogo } from './ProcureXLogo';

interface CivicCollaborationHubProps {
  pilotData: PilotData;
  currentUser?: AuthUser | null;
  className?: string;
  defaultTab?: 'chat' | 'updates';
}

export const CivicCollaborationHub: React.FC<CivicCollaborationHubProps> = ({
  pilotData,
  currentUser,
  className = '',
  defaultTab = 'chat'
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'updates'>(defaultTab);
  const [messages, setMessages] = useState<CivicChatMessage[]>(() => storage.getChatMessages(pilotData.contractId));
  const [updates, setUpdates] = useState<CivicFieldUpdate[]>(() => storage.getFieldUpdates(pilotData.contractId));

  // Determine active sending role (default based on currentUser, or toggleable)
  const isGovUser = currentUser?.role === 'government';
  const [senderRole, setSenderRole] = useState<'government' | 'startup'>(isGovUser ? 'government' : 'startup');

  // Input states
  const [newMessageText, setNewMessageText] = useState('');
  const [selectedTag, setSelectedTag] = useState<CivicChatMessage['tag']>('Field Update');
  const [showNewUpdateModal, setShowNewUpdateModal] = useState(false);

  // New update form
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateCategory, setUpdateCategory] = useState<CivicFieldUpdate['category']>('Hardware');
  const [updateStatus, setUpdateStatus] = useState<CivicFieldUpdate['status']>('Operational');
  const [updateDescription, setUpdateDescription] = useState('');

  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages update
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessageText.trim()) return;

    const newMsg: CivicChatMessage = {
      id: `msg_${Date.now()}`,
      contractId: pilotData.contractId,
      senderRole: senderRole,
      senderName: senderRole === 'government' 
        ? (currentUser?.name || 'Dr. Ramesh Sharma, IAS')
        : (pilotData.startupName ? `${pilotData.startupName} Lead` : 'UrbanAI Engineering'),
      senderTitle: senderRole === 'government'
        ? (currentUser?.department || 'Department of Urban Development')
        : `${pilotData.startupName} Technical Lead`,
      timestamp: 'Just now',
      text: newMessageText.trim(),
      tag: selectedTag
    };

    const updated = storage.addChatMessage(newMsg);
    setMessages(updated.filter(m => m.contractId === pilotData.contractId));
    setNewMessageText('');
  };

  const handleQuickPreset = (text: string, tag: CivicChatMessage['tag']) => {
    setNewMessageText(text);
    setSelectedTag(tag);
  };

  const handleCreateFieldUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateDescription.trim()) return;

    const newUp: CivicFieldUpdate = {
      id: `fup_${Date.now()}`,
      contractId: pilotData.contractId,
      startupName: pilotData.startupName,
      title: updateTitle.trim(),
      description: updateDescription.trim(),
      timestamp: 'Just now',
      status: updateStatus,
      category: updateCategory,
      author: `${pilotData.startupName} Field Ops`
    };

    const updated = storage.addFieldUpdate(newUp);
    setUpdates(updated.filter(u => u.contractId === pilotData.contractId));

    // Also auto-post a chat notification into the bilateral channel
    const autoChatMsg: CivicChatMessage = {
      id: `msg_auto_${Date.now()}`,
      contractId: pilotData.contractId,
      senderRole: 'startup',
      senderName: `${pilotData.startupName} Ops`,
      senderTitle: 'Field Telemetry Dispatcher',
      timestamp: 'Just now',
      text: `📢 [New Field Update Logged]: ${updateTitle.trim()} - Status: ${updateStatus}. Ready for municipal oversight.`,
      tag: 'Field Update'
    };
    const updatedMsgs = storage.addChatMessage(autoChatMsg);
    setMessages(updatedMsgs.filter(m => m.contractId === pilotData.contractId));

    // Reset form
    setUpdateTitle('');
    setUpdateDescription('');
    setShowNewUpdateModal(false);
  };

  return (
    <div className={`bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 rounded-3xl overflow-hidden shadow-xl ${className}`}>
      {/* BILATERAL CIVIC LINK BANNER */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-900 text-white p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-white/20 text-white flex items-center gap-1.5 backdrop-blur-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                CIVIC INNOVATION LINK ACTIVE
              </span>
              <span className="text-xs font-mono text-emerald-200">
                CONTRACT ID: {pilotData.contractId}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Government ↔ Startup Bilateral Collaboration Hub</span>
            </h2>
            <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
              Prototype public-private collaboration channel. Field telemetry updates from <strong className="text-white underline decoration-emerald-400">{pilotData.startupName}</strong> stream in real-time to the <strong className="text-white underline decoration-emerald-400">{pilotData.department}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="space-y-0.5 text-right sm:text-left">
              <div className="text-[10px] font-mono uppercase text-emerald-200 font-bold">
                Bilateral Security SLA
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Prototype procurement workflow</span>
              </div>
            </div>

            <div className="h-6 w-px bg-white/20 hidden sm:block" />

            <div className="text-[11px] font-mono text-emerald-100">
              Corridor: <strong>{pilotData.corridor}</strong>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Perspective Selector */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-white text-indigo-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Bilateral Live Chat</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'chat' ? 'bg-indigo-100 text-indigo-900' : 'bg-white/20 text-white'
              }`}>
                {messages.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('updates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'updates'
                  ? 'bg-white text-indigo-950 shadow-md font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Startup Field Updates</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                activeTab === 'updates' ? 'bg-indigo-100 text-indigo-900' : 'bg-white/20 text-white'
              }`}>
                {updates.length}
              </span>
            </button>
          </div>

          {/* Perspective Toggle (Chat As) */}
          <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[11px] text-emerald-200 font-mono">Chatting as:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSenderRole('government')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                  senderRole === 'government'
                    ? 'bg-indigo-500 text-white shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>🏛️ Municipal Officer</span>
              </button>

              <button
                type="button"
                onClick={() => setSenderRole('startup')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 ${
                  senderRole === 'startup'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>🚀 Startup Founder</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TAB CONTENT 1: BILATERAL CHAT */}
      {activeTab === 'chat' && (
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Quick Dispatch Presets */}
          <div className="p-3 bg-neutral-50 dark:bg-[#0e1230] rounded-2xl border border-neutral-200/80 dark:border-indigo-950/60 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              Quick Dispatch:
            </span>

            {senderRole === 'government' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Site entry permit granted for all 8 camera gantry poles on Outer Ring Road.", "Clearance")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#151a44] border border-neutral-200 dark:border-indigo-900 text-neutral-800 dark:text-neutral-200 hover:border-indigo-500 transition"
                >
                  ✅ Issue Site Entry Permit
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Technical committee scheduled inspection for Friday at 11:00 AM at Silk Board junction.", "Notice")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#151a44] border border-neutral-200 dark:border-indigo-900 text-neutral-800 dark:text-neutral-200 hover:border-indigo-500 transition"
                >
                  🔍 Schedule Joint Inspection
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Milestone 1 audit verified. Treasury fund tranche of ₹4,20,000 cleared for disbursement.", "Milestone")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#151a44] border border-neutral-200 dark:border-indigo-900 text-neutral-800 dark:text-neutral-200 hover:border-indigo-500 transition"
                >
                  💳 Release Milestone Tranche
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("All 8 edge cameras successfully mounted and streaming telemetry at 99.4% SLA.", "Telemetry")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#151a44] border border-neutral-200 dark:border-indigo-900 text-neutral-800 dark:text-neutral-200 hover:border-emerald-500 transition"
                >
                  📡 Push Telemetry SLA Ping
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Milestone 1 verification dossier ready with cryptographic proof and baseline traffic logs.", "Milestone")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#151a44] border border-neutral-200 dark:border-indigo-900 text-neutral-800 dark:text-neutral-200 hover:border-emerald-500 transition"
                >
                  📄 Submit Milestone Audit Pack
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset("Requesting BESCOM power line hookup authorization for junction 4 battery backup unit.", "Query")}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-[#151a44] border border-neutral-200 dark:border-indigo-900 text-neutral-800 dark:text-neutral-200 hover:border-emerald-500 transition"
                >
                  ⚡ Request Power Clearance
                </button>
              </>
            )}
          </div>

          {/* Chat Messages Log */}
          <div 
            ref={chatScrollRef}
            className="h-80 overflow-y-auto space-y-3.5 pr-2 rounded-2xl bg-neutral-50/50 dark:bg-[#070918]/60 p-4 border border-neutral-200/60 dark:border-indigo-950/40"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 p-6 space-y-2">
                <MessageSquare className="w-8 h-8 text-neutral-300 dark:text-neutral-700" />
                <p className="text-xs">No bilateral messages recorded yet. Begin by dispatching a communication below.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isGov = msg.senderRole === 'government';
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col ${isGov ? 'items-start' : 'items-end'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 space-y-1.5 shadow-xs border ${
                      isGov 
                        ? 'bg-white dark:bg-[#12163a] border-indigo-200/80 dark:border-indigo-900/60 text-neutral-900 dark:text-white' 
                        : 'bg-emerald-50/90 dark:bg-[#0e2a22] border-emerald-200 dark:border-emerald-900/80 text-neutral-900 dark:text-white'
                    }`}>
                      <div className="flex items-center justify-between gap-3 text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold">
                          {isGov ? (
                            <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              {msg.senderName}
                            </span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              {msg.senderName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {msg.tag && (
                            <span className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                              msg.tag === 'Milestone'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                : msg.tag === 'Clearance'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : msg.tag === 'Telemetry'
                                ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            }`}>
                              {msg.tag}
                            </span>
                          )}
                          <span className="text-neutral-400 dark:text-neutral-500 font-mono text-[10px]">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-neutral-400 font-mono">
                        {msg.senderTitle}
                      </div>

                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Composer Form */}
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-neutral-500 font-mono text-[11px]">Message Tag:</span>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value as CivicChatMessage['tag'])}
                  className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 dark:border-indigo-950 bg-white dark:bg-[#101432] text-neutral-800 dark:text-white"
                >
                  <option value="Field Update">Field Update</option>
                  <option value="Clearance">Government Clearance</option>
                  <option value="Milestone">Milestone Progress</option>
                  <option value="Telemetry">Telemetry Report</option>
                  <option value="Notice">Official Notice</option>
                  <option value="Query">Technical Query</option>
                </select>
              </div>

              <span className="text-[10px] text-neutral-400 font-mono">
                Prototype secure-channel placeholder · Backend controls required
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder={senderRole === 'government' 
                  ? "Dispatch municipal directive, permit clearance, or inspection note..." 
                  : "Post live field update, telemetry report, or milestone query to officer..."}
                className="flex-1 px-4 py-3 text-xs rounded-xl border border-neutral-300 dark:border-indigo-950 bg-white dark:bg-[#101432] text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />

              <button
                type="submit"
                disabled={!newMessageText.trim()}
                className={`px-5 py-3 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm disabled:opacity-40 btn-exotic ${
                  senderRole === 'government' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Dispatch</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT 2: STARTUP FIELD UPDATES */}
      {activeTab === 'updates' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-[#0e1230] border border-neutral-200 dark:border-indigo-950/60">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                Live Field Deployment & Telemetry Feed
              </h3>
              <p className="text-xs text-neutral-500">
                Direct updates submitted by <strong className="text-neutral-900 dark:text-white">{pilotData.startupName}</strong> engineering teams during active testbed operations.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNewUpdateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs btn-exotic whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Log Startup Field Update</span>
            </button>
          </div>

          {/* Updates List */}
          <div className="space-y-4">
            {updates.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 space-y-2">
                <Radio className="w-8 h-8 mx-auto text-neutral-300 dark:text-neutral-700" />
                <p className="text-xs">No field updates posted yet.</p>
              </div>
            ) : (
              updates.map((up) => (
                <div 
                  key={up.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950/80 shadow-xs space-y-3 transition hover:border-indigo-400/40"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {up.category}
                      </span>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                        {up.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1 ${
                        up.status === 'Operational'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : up.status === 'Verified'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {up.status}
                      </span>
                      <span className="text-neutral-400 font-mono text-[11px]">
                        {up.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {up.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 dark:border-indigo-950/60 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <div>
                      Logged by: <strong className="text-neutral-700 dark:text-neutral-300">{up.author}</strong> ({up.startupName})
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Prototype oversight status</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: POST NEW STARTUP FIELD UPDATE */}
      {showNewUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#0b0e24] border border-neutral-200 dark:border-indigo-950 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-indigo-950/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Radio className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Submit Startup Field Update
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Direct notification to Municipal Commissioner & Audit Officers
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewUpdateModal(false)}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFieldUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Update Headline *
                </label>
                <input
                  type="text"
                  required
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. Edge AI Camera #6 Calibrated at Bellandur junction"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-white dark:bg-[#1C2127] text-[#111416] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={updateCategory}
                    onChange={(e) => setUpdateCategory(e.target.value as CivicFieldUpdate['category'])}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-white dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  >
                    <option value="Hardware">Hardware Node</option>
                    <option value="Software">Software & Inference</option>
                    <option value="Site Inspection">Site Inspection</option>
                    <option value="Data Stream">Data Stream & Telemetry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Operational Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as CivicFieldUpdate['status'])}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-white dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  >
                    <option value="Operational">Operational</option>
                    <option value="Verified">Verified by SLA</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Requires Review">Requires Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Technical Details & Evidence *
                </label>
                <textarea
                  rows={3}
                  required
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                  placeholder="Provide exact metrics, junction location, telemetry packet frequency, or electrical safety certifications..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-white dark:bg-[#1C2127] text-[#111416] dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewUpdateModal(false)}
                  className="px-4 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#141838] rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-xs btn-exotic"
                >
                  Broadcast Update to Govt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
