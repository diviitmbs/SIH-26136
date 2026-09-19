import React, { useState } from 'react';
import { AppView, AuthUser, Startup } from '../types';
import { storage } from '../utils/storage';
import { CIVIC_SERVICE_DOMAINS } from '../data/procurexData';
import { ArrowLeft, ArrowRight, Rocket, ShieldCheck, Info, CheckCircle2, Building2 } from 'lucide-react';

interface StartupSignupViewProps {
  startups?: Startup[];
  onNavigate: (view: AppView) => void;
  onLogin: (user: AuthUser) => void;
}

export const StartupSignupView: React.FC<StartupSignupViewProps> = ({ startups = [], onNavigate, onLogin }) => {
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [startupName, setStartupName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [designation, setDesignation] = useState('Founder / Technical Lead');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dpiitNumber, setDpiitNumber] = useState('');
  const [incorporationYear, setIncorporationYear] = useState('2022');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState(CIVIC_SERVICE_DOMAINS[0]);
  const [capabilities, setCapabilities] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-fill company details when user picks a registered startup from catalog
  const handleStartupNameChange = (val: string) => {
    setStartupName(val);
    const matched = startups.find(s => 
      s.name.toLowerCase() === val.trim().toLowerCase() ||
      s.id === val.trim()
    );

    if (matched) {
      setSelectedStartupId(matched.id);
      if (matched.dpiitNumber || matched.registrationNumber) {
        setDpiitNumber(matched.dpiitNumber || matched.registrationNumber);
      }
      if (matched.state) setState(matched.state);
      if (matched.city) setCity(matched.city);
      if (matched.incorporationYear) setIncorporationYear(String(matched.incorporationYear));
      if (matched.sectors && matched.sectors.length > 0 && CIVIC_SERVICE_DOMAINS.includes(matched.sectors[0])) {
        setPrimaryDomain(matched.sectors[0]);
      }
      if (matched.technologies && matched.technologies.length > 0) {
        setCapabilities(matched.technologies.join(', '));
      } else if (matched.solutionSummary) {
        setCapabilities(matched.solutionSummary);
      }
    } else {
      setSelectedStartupId('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startupName.trim()) {
      setError('Please enter your Startup or Company legal name.');
      return;
    }
    if (!founderName.trim()) {
      setError('Please enter your personal name (Founder or Team Member).');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid company contact email.');
      return;
    }
    if (!state.trim()) {
      setError('Please specify your registered State / Location.');
      return;
    }
    if (!password) {
      setError('Please create a secure workspace password.');
      return;
    }

    setIsSubmitting(true);

    const matched = startups.find(s => 
      s.id === selectedStartupId ||
      s.name.toLowerCase() === startupName.trim().toLowerCase()
    );

    const resolvedStartupId = matched?.id || selectedStartupId || `startup-custom-${Date.now()}`;
    const generatedDpiit = dpiitNumber.trim() || matched?.dpiitNumber || `DPIIT-${state.trim().slice(0, 2).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStartupUser: AuthUser = {
      id: `user-${Date.now()}`,
      role: 'startup',
      name: founderName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      designation: designation.trim() || 'Founder / Technical Lead',
      // Organization identity:
      startupId: resolvedStartupId,
      organizationId: resolvedStartupId,
      startupName: matched?.name || startupName.trim(),
      dpiitNumber: generatedDpiit,
      registrationNumber: matched?.registrationNumber || `U72900${state.trim().slice(0, 2).toUpperCase()}${incorporationYear}PTC${Math.floor(100000 + Math.random() * 900000)}`,
      state: state.trim(),
      city: city.trim(),
      incorporationYear: parseInt(incorporationYear, 10) || 2022,
      domain: primaryDomain,
      capabilities: capabilities.trim() || matched?.technologies?.join(', ') || 'Edge AI, Computer Vision, IoT Telemetry, Sensor Systems'
    };

    // Store in multi-account directory and set active session
    storage.saveAccount(newStartupUser);
    storage.setUser(newStartupUser);

    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(newStartupUser);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-12 selection:bg-[#087C78] selection:text-white arch-grid-bg transition-colors">
      {/* Top Bar / Navigation */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E2DFD7] dark:border-[#232B34]">
        <button
          type="button"
          onClick={() => onNavigate('startup_login')}
          className="text-xs font-mono font-medium text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO SIGN IN</span>
        </button>

        <div className="text-[10px] font-mono tracking-widest uppercase text-[#596166] dark:text-[#949DA3]">
          STARTUP REGISTRATION
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl w-full mx-auto my-8">
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-8 sm:p-12 rounded-xl shadow-xs space-y-8">
          
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-[#E2DFD7] dark:border-[#232B34]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#087C78] dark:text-[#0AA39F] flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                <span>STARTUP PORTAL</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#ECEAE4] dark:bg-[#1E2630] px-2.5 py-0.5 rounded text-[#596166] dark:text-[#949DA3]">
                DPIIT VERIFIED PROCUREMENT
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
              Register your Startup Workspace
            </h1>

            <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
              Create an institutional startup profile to compete for government innovation tenders, pilot challenges, and milestone grant allocations. Registered profiles bypass traditional turnover barriers under GFR 149(v).
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-300 font-mono">
                {error}
              </div>
            )}

            {/* Row 1: Startup Name & Founder */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Startup / Company Legal Entity *
                  </label>
                  {selectedStartupId && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DATABASE LINKED</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  list="registered-startups-datalist"
                  value={startupName}
                  onChange={(e) => handleStartupNameChange(e.target.value)}
                  placeholder="e.g. AquaSense Systems, BYJU'S, or your company name"
                  className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                />
                <datalist id="registered-startups-datalist">
                  {startups.slice(0, 100).map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.city}, {s.state})
                    </option>
                  ))}
                </datalist>
                <p className="text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
                  {startups.length > 0
                    ? `Search across ${startups.length} live DPIIT startups from Supabase or type an unlisted venture.`
                    : 'Enter your registered corporate entity.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Your Name (Person / Team Member) *
                  </label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    placeholder="e.g. Dr. Rajeshwari Rao"
                    className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Your Title / Role in Organization
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Founder & CEO, CTO, Bid Manager"
                    className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Official Contact Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@urbanai.in"
                  className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                />
              </div>
            </div>

            {/* Row 3: DPIIT Number & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  DPIIT Recognition Number (Optional)
                </label>
                <input
                  type="text"
                  value={dpiitNumber}
                  onChange={(e) => setDpiitNumber(e.target.value)}
                  placeholder="e.g. DPIIT-KA-2022-8419 (auto-generated if empty)"
                  className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Year of Incorporation
                </label>
                <select
                  value={incorporationYear}
                  onChange={(e) => setIncorporationYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="2019">2019</option>
                </select>
              </div>
            </div>

            {/* Row 4: State & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Registered State / UT *
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka"
                  className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                  Headquarters City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bengaluru"
                  className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
                />
              </div>
            </div>

            {/* Row 5: Domain & Capabilities */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Primary Sector Focus
              </label>
              <select
                value={primaryDomain}
                onChange={(e) => setPrimaryDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
              >
                {CIVIC_SERVICE_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Technical Capabilities & Core Stack
              </label>
              <textarea
                rows={3}
                value={capabilities}
                onChange={(e) => setCapabilities(e.target.value)}
                placeholder="e.g. Edge AI, On-Camera Inference, RS-232 Controller Integration, Acoustic Leak Diagnostics..."
                className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                Create Workspace Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#F4F2EC]/50 dark:bg-[#1C2127] border border-[#E2DFD7] dark:border-[#2E3844] rounded text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#087C78] hover:bg-[#076865] text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-lg flex items-center justify-center gap-2 transition duration-200 shadow-xs"
            >
              <span>{isSubmitting ? 'CREATING WORKSPACE...' : 'COMPLETE STARTUP REGISTRATION'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Switching */}
          <div className="pt-6 border-t border-[#E2DFD7] dark:border-[#232B34] flex items-center justify-between text-xs">
            <span className="text-[#596166] dark:text-[#949DA3]">
              Already registered?
            </span>
            <button
              type="button"
              onClick={() => onNavigate('startup_login')}
              className="text-[#087C78] dark:text-[#0AA39F] font-semibold hover:underline flex items-center gap-1 font-mono uppercase tracking-wider text-[11px]"
            >
              <span>SIGN IN TO STARTUP WORKSPACE</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-3xl w-full mx-auto text-center text-[10px] font-mono text-[#596166] dark:text-[#949DA3]">
        NATIONAL PUBLIC INNOVATION PLATFORM • STARTUP ONBOARDING PROTOCOL
      </div>
    </div>
  );
};
