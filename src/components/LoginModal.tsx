import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { X, Lock, Shield, User, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, currentUser, logout, changePassword } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Change password tab for logged in user
  const [activeTab, setActiveTab] = useState<'login' | 'changePass'>('login');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await login(username, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Authentication failed');
    } else {
      setPassword('');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPassSuccess(null);
    setLoading(true);
    const res = await changePassword(currentPass, newPass);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Password update failed');
    } else {
      setPassSuccess('Password updated successfully! Please keep it secure.');
      setCurrentPass('');
      setNewPass('');
    }
  };

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#12161f] border border-slate-800 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f121a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-none">
                {currentUser ? 'User Account & Security' : 'Secure Authentication'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">NEWAZ CAPITALX Access Control</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* Profile & Change Password */
          <div className="p-6 space-y-5">
            <div className="bg-[#181d29] border border-slate-800/80 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{currentUser.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {currentUser.role}
              </span>
            </div>

            {/* Change Password Form */}
            <div className="border-t border-slate-800/80 pt-4">
              <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                Change Password
              </h5>

              {error && (
                <div className="mb-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {passSuccess && (
                <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {passSuccess}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={e => setCurrentPass(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">New Password (min. 6 chars)</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Enter new password"
                    className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>

            <button
              onClick={logout}
              className="w-full py-2.5 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-semibold text-xs rounded-lg transition-colors"
            >
              Sign Out of Terminal
            </button>
          </div>
        ) : (
          /* Login Form */
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-lg shadow-emerald-500/10 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Terminal'}
              </button>
            </form>

            {/* Quick access preset credentials box */}
            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <p className="text-xs font-semibold text-slate-400 mb-2">Quick Role Login (Click to fill):</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin', 'admin1122')}
                  className="p-2 rounded bg-[#181d29] hover:bg-[#202737] border border-slate-800 text-left transition-colors"
                >
                  <span className="font-bold text-emerald-400 block">Admin</span>
                  <span className="text-[10px] text-slate-400 font-mono">admin1122</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('trader_ops', 'staff1234')}
                  className="p-2 rounded bg-[#181d29] hover:bg-[#202737] border border-slate-800 text-left transition-colors"
                >
                  <span className="font-bold text-sky-400 block">Staff</span>
                  <span className="text-[10px] text-slate-400 font-mono">staff1234</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('demo_user', 'trader1234')}
                  className="p-2 rounded bg-[#181d29] hover:bg-[#202737] border border-slate-800 text-left transition-colors"
                >
                  <span className="font-bold text-purple-400 block">Trader</span>
                  <span className="text-[10px] text-slate-400 font-mono">trader1234</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Security Protocol: Server-side PBKDF2 hash verification. Admin can update credentials anytime inside settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
