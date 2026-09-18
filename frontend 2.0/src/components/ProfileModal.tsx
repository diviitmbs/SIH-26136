import React, { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { storage } from '../utils/storage';
import { CIVIC_SERVICE_DOMAINS } from '../data/procurexData';
import { X, Save, Building2, Rocket, ShieldCheck, CheckCircle2, User, Mail, MapPin, Phone } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onUpdateUser: (updatedUser: AuthUser) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser
}) => {
  if (!isOpen || !currentUser) return null;

  const isGov = currentUser.role === 'government';

  // Local form state
  const [name, setName] = useState(currentUser.name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [contactNumber, setContactNumber] = useState(currentUser.contactNumber || '');
  const [state, setState] = useState(currentUser.state || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [domain, setDomain] = useState(currentUser.domain || CIVIC_SERVICE_DOMAINS[0]);

  // Gov specific
  const [department, setDepartment] = useState(currentUser.department || '');
  const [officerId, setOfficerId] = useState(currentUser.officerId || '');
  const [designation, setDesignation] = useState(currentUser.designation || '');
  const [orgDetails, setOrgDetails] = useState(currentUser.orgDetails || '');

  // Startup specific
  const [startupName, setStartupName] = useState(currentUser.startupName || '');
  const [dpiitNumber, setDpiitNumber] = useState(currentUser.dpiitNumber || '');
  const [registrationNumber, setRegistrationNumber] = useState(currentUser.registrationNumber || '');
  const [capabilities, setCapabilities] = useState(currentUser.capabilities || '');
  const [trackRecord, setTrackRecord] = useState(currentUser.trackRecord || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setName(currentUser.name || '');
    setEmail(currentUser.email || '');
    setContactNumber(currentUser.contactNumber || '');
    setState(currentUser.state || '');
    setCity(currentUser.city || '');
    setDomain(currentUser.domain || CIVIC_SERVICE_DOMAINS[0]);

    if (isGov) {
      setDepartment(currentUser.department || '');
      setOfficerId(currentUser.officerId || '');
      setDesignation(currentUser.designation || '');
      setOrgDetails(currentUser.orgDetails || '');
    } else {
      setStartupName(currentUser.startupName || '');
      setDpiitNumber(currentUser.dpiitNumber || '');
      setRegistrationNumber(currentUser.registrationNumber || '');
      setCapabilities(currentUser.capabilities || '');
      setTrackRecord(currentUser.trackRecord || '');
    }
  }, [currentUser, isGov]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: AuthUser = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      state: state.trim(),
      city: city.trim(),
      domain: domain,
      ...(isGov ? {
        department: department.trim(),
        officerId: officerId.trim(),
        designation: designation.trim(),
        orgDetails: orgDetails.trim(),
        responsiblePerson: name.trim()
      } : {
        startupName: startupName.trim(),
        dpiitNumber: dpiitNumber.trim(),
        registrationNumber: registrationNumber.trim(),
        capabilities: capabilities.trim(),
        trackRecord: trackRecord.trim(),
        responsiblePerson: name.trim()
      })
    };

    storage.setUser(updated);
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#16191D] border border-[#E2DFD7] dark:border-[#232B34] rounded-xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DFD7] dark:border-[#232B34]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#087C78] dark:bg-[#0AA39F]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#087C78] dark:text-[#0AA39F]">
                {isGov ? 'GOVERNMENT PROFILE' : 'STARTUP PROFILE'}
              </span>
            </div>
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#111416] dark:text-white font-sans">
              Workspace Profile & Settings
            </h2>
            <p className="text-xs text-[#596166] dark:text-[#949DA3]">
              "Ask Once. Reuse Everywhere." — Updates save immediately across all your forms and documents.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#E2DFD7] dark:border-[#232B34] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#596166] hover:text-[#111416] dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess && (
          <div className="my-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile saved successfully. All future forms will reflect these updates.</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5 pt-4">
          {isGov ? (
            /* Government Fields */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Department / Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Responsible Official Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    State / Territory
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Sector / Focus Area
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  >
                    {CIVIC_SERVICE_DOMAINS.map(dom => (
                      <option key={dom} value={dom}>{dom}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            /* Startup Fields */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Startup / Company Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Founder / Authorized Contact Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    DPIIT Recognition Number
                  </label>
                  <input
                    type="text"
                    value={dpiitNumber}
                    onChange={(e) => setDpiitNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    State / Hub
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#596166] dark:text-[#949DA3]">
                    Core Technologies & Capabilities
                  </label>
                  <input
                    type="text"
                    value={capabilities}
                    onChange={(e) => setCapabilities(e.target.value)}
                    placeholder="e.g. Edge Computer Vision, Acoustic Hydrophones, IoT Sensor Nodes"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#E2DFD7] dark:border-[#2E3844] bg-[#F4F2EC]/50 dark:bg-[#1C2127] text-[#111416] dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2DFD7] dark:border-[#232B34]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase rounded-lg border border-[#E2DFD7] dark:border-[#232B34] hover:bg-[#ECEAE4] dark:hover:bg-[#1E2630] text-[#596166] dark:text-[#949DA3]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-[#111416] dark:bg-[#087C78] hover:bg-[#23465A] dark:hover:bg-[#0AA39F] text-white flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
