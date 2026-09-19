import React, { useState } from 'react';
import { AppView, AuthUser } from '../types';
import { storage } from '../utils/storage';
import { CIVIC_SERVICE_DOMAINS } from '../data/procurexData';
import { ArrowLeft, ArrowRight, Building2, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

interface GovSignupViewProps {
  onNavigate: (view: AppView) => void;
  onLogin: (user: AuthUser) => void;
}

export const GovSignupView: React.FC<GovSignupViewProps> = ({ onNavigate, onLogin }) => {
  // Real user-entered fields (starts completely empty, no prefilled fake identity)
  const [department, setDepartment] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [sector, setSector] = useState(CIVIC_SERVICE_DOMAINS[0]);
  const [officerId, setOfficerId] = useState('');
  const [orgDetails, setOrgDetails] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!department.trim()) {
      setError('Please enter your Government department or organization name.');
      return;
    }
    if (!responsiblePerson.trim()) {
      setError("Please enter the responsible officer's name.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid official government email address.');
      return;
    }
    if (!state.trim()) {
      setError('Please specify your State or administrative jurisdiction.');
      return;
    }
    if (!password) {
      setError('Please create a secure password for your workspace.');
      return;
    }

    setIsSubmitting(true);

    const generatedOfficerId = officerId.trim() || `GOV-${state.trim().slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newGovUser: AuthUser = {
      id: `gov-${Date.now()}`,
      role: 'government',
      name: responsiblePerson.trim(),
      responsiblePerson: responsiblePerson.trim(),
      email: email.trim(),
      department: department.trim(),
      officerId: generatedOfficerId,
      state: state.trim(),
      city: city.trim(),
      designation: designation.trim() || 'Nodal Authority',
      domain: sector,
      contactNumber: contactNumber.trim(),
      orgDetails: orgDetails.trim()
    };

    // Save profile persistently in account directory and active session
    storage.saveAccount(newGovUser);
    storage.setUser(newGovUser);

    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(newGovUser);
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F2EC] dark:bg-[#111416] text-[#111416] dark:text-[#F4F2EC] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-12 selection:bg-[#087C78] selection:text-white arch-grid-bg transition-colors">
      {/* Top Bar / Navigation */}
      <div className="max-w-3xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E2DFD7] dark:border-[#232B34]">
        <button
          type="button"
          onClick={() => onNavigate('gov_login')}
          className="text-xs font-mono font-medium text-[#596166] dark:text-[#949DA3] hover:text-[#111416] dark:hover:text-white flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO SIGN IN</span>
        </button>

        <div className="text-[10px] font-mono tracking-widest uppercase text-[#596166] dark:text-[#949DA3]">
          GOVERNMENT REGISTRATION
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl w-full mx-auto my-8">
        <div className="bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] p-8 sm:p-12 rounded-xl shadow-xs space-y-8">
          
          {/* Header */}
          <div className="space-y-3 pb-6 border-b border-[#E2DFD7] dark:border-[#232B34]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#087C78] dark:text-[#0AA39F]">
                GOVERNMENT PORTAL
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#ECEAE4] dark:bg-[#1E2630] px-2.5 py-0.5 rounded text-[#596166] dark:text-[#949DA3]">
                ASK ONCE. REUSE EVERYWHERE.
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111416] dark:text-white font-sans">
              Create your Government workspace
            </h1>

            <p className="text-xs text-[#596166] dark:text-[#949DA3] leading-relaxed">
              Register your municipal division, state department, or autonomous civic agency. Entered department details, locations, and nodal contacts are automatically reused across challenge creation and pilot authorizations, and can be edited anytime.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Department & Organization Information */}
            <div className="space-y-4">
              <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#087C78] dark:text-[#0AA39F] flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>1. Organization & Jurisdiction</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Government Department / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Department of Urban Development & Municipal Affairs"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    State / Union Territory *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka, Maharashtra, Delhi"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    City / District Headquarters
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Pune, Ahmedabad"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Sector / Primary Department Area *
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  >
                    {CIVIC_SERVICE_DOMAINS.map(dom => (
                      <option key={dom} value={dom}>{dom}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Department Mandate / Organization Details
                  </label>
                  <textarea
                    rows={2}
                    value={orgDetails}
                    onChange={(e) => setOrgDetails(e.target.value)}
                    placeholder="Brief description of your municipal scope, administrative authority, or current procurement priorities..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Nodal Officer / Responsible Person */}
            <div className="space-y-4 pt-4 border-t border-[#E2DFD7] dark:border-[#232B34]">
              <div className="text-[11px] font-mono uppercase font-bold tracking-wider text-[#087C78] dark:text-[#0AA39F] flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>2. Responsible Official Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Responsible Officer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    placeholder="e.g. Er. Rajesh Kulkarni"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Chief Engineer / Additional Commissioner"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Official Government Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. r.kulkarni@urban.karnataka.gov.in"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Official Contact Number
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +91 80 2203 4000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Official / Employee ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    placeholder="e.g. KAR-UDD-0824 (Auto-generated if empty)"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Workspace Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure access key"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/40 dark:bg-[#1C2127] text-sm text-[#111416] dark:text-white focus:outline-none focus:border-[#087C78] transition"
                  />
                </div>
              </div>
            </div>

            {/* Principle Callout */}
            <div className="p-3.5 rounded-lg bg-[#ECEAE4]/60 dark:bg-[#1E2630] border border-[#E2DFD7] dark:border-[#2E3844] flex items-start gap-2.5 text-xs text-[#596166] dark:text-[#949DA3]">
              <Info className="w-4 h-4 text-[#087C78] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#111416] dark:text-white block text-[11px] uppercase font-mono">Ask Once. Reuse Everywhere.</strong>
                Your department name, location, sector, and officer identity will automatically pre-populate future challenge creation drafts and pilot sanction forms, saving time on repetitive documentation.
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{isSubmitting ? 'CREATING WORKSPACE...' : 'COMPLETE REGISTRATION & OPEN GOVERNMENT WORKSPACE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Already have account */}
          <div className="pt-4 border-t border-[#E2DFD7] dark:border-[#232B34] text-center">
            <span className="text-xs text-[#596166] dark:text-[#949DA3]">
              Already registered as a Government Official?{' '}
            </span>
            <button
              type="button"
              onClick={() => onNavigate('gov_login')}
              className="text-xs font-mono font-bold uppercase text-[#087C78] hover:underline"
            >
              Sign In to Workspace
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-3xl w-full mx-auto pt-6 border-t border-[#E2DFD7] dark:border-[#232B34] flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#596166] dark:text-[#949DA3] gap-2">
        <span>PROCUREX GOVTECH REGISTRATION</span>
        <span>INSTITUTIONAL ENCRYPTION & DATA SOVEREIGNTY</span>
      </div>
    </div>
  );
};
