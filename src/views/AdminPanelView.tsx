import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Settings,
  Shield,
  Save,
  Globe,
  Sliders,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { SystemSettings } from '../types.js';

export const AdminPanelView: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentUser,
    setIsLoginModalOpen,
    changePassword,
    addToast,
  } = useApp();

  const [formData, setFormData] = useState<SystemSettings | null>(settings);
  const [saving, setSaving] = useState(false);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; success: boolean } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  // If not admin, show lock barrier
  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-12 text-center rounded-2xl bg-[#121620] border border-slate-800 space-y-4 max-w-lg mx-auto my-12">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Administrator Access Required</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The Frontend Content & System Control Panel is restricted to authorized administrators. Sign in with the master admin account to configure website text, risk engines, and social integrations.
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/10"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Loading system configuration...
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const success = await updateSettings(formData);
    setSaving(false);
    if (success) {
      addToast('System settings saved and broadcast to live terminal!', 'success');
    }
  };

  const handleAdminPassChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    const res = await changePassword(currentPass, newPass);
    if (res.success) {
      setPassMsg({ text: 'Admin password updated securely on server!', success: true });
      setCurrentPass('');
      setNewPass('');
    } else {
      setPassMsg({ text: res.error || 'Failed to update password', success: false });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white font-mono">NEWAZ CAPITALX MASTER CONTROL PANEL</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Edit landing content, branding, algorithmic thresholds, and security parameters in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Branding & Copywriting */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Website Content & Branding
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.general.websiteName}
                onChange={e =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, websiteName: e.target.value },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.general.tagline}
                onChange={e =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, tagline: e.target.value },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Title</label>
              <input
                type="text"
                value={formData.content.heroHeadline}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, heroHeadline: e.target.value },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Hero Subtitle</label>
              <input
                type="text"
                value={formData.content.heroSubheadline}
                onChange={e =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, heroSubheadline: e.target.value },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Telegram VIP Community Link</label>
              <input
                type="text"
                value={formData.general.supportTelegram}
                onChange={e =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, supportTelegram: e.target.value },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Email</label>
              <input
                type="text"
                value={formData.general.contactEmail}
                onChange={e =>
                  setFormData({
                    ...formData,
                    general: { ...formData.general, contactEmail: e.target.value },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Announcement Banner / Disclaimer</label>
            <input
              type="text"
              value={formData.general.disclaimer}
              onChange={e =>
                setFormData({
                  ...formData,
                  general: { ...formData.general, disclaimer: e.target.value },
                })
              }
              className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 2. Algorithm & Risk Engine Defaults */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Signal Engine & Risk Circuit Defaults
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Min Signal Confidence Threshold (%)
              </label>
              <input
                type="number"
                min="50"
                max="90"
                value={formData.signalEngine.confidenceThreshold}
                onChange={e =>
                  setFormData({
                    ...formData,
                    signalEngine: {
                      ...formData.signalEngine,
                      confidenceThreshold: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Capital Balance ($)
              </label>
              <input
                type="number"
                value={formData.moneyManagement.initialCapital}
                onChange={e =>
                  setFormData({
                    ...formData,
                    moneyManagement: {
                      ...formData.moneyManagement,
                      initialCapital: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Default Payout Rate (%)
              </label>
              <input
                type="number"
                value={formData.moneyManagement.payoutRatioPercent}
                onChange={e =>
                  setFormData({
                    ...formData,
                    moneyManagement: {
                      ...formData.moneyManagement,
                      payoutRatioPercent: Number(e.target.value),
                    },
                  })
                }
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Security & Admin Password Change */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Administrator Security Credentials
            </h3>
          </div>

          {passMsg && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold ${
                passMsg.success
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {passMsg.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPass}
                onChange={e => setCurrentPass(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">New Master Password</label>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="Enter new master password (min 6 chars)"
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdminPassChange}
            className="px-4 py-2 bg-[#181d29] hover:bg-[#202737] border border-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
          >
            Update Admin Password
          </button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xl shadow-emerald-500/10"
          >
            {saving ? 'Updating Settings...' : 'Save All Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
