import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext.js';
import {
  LayoutDashboard,
  Radio,
  LineChart,
  Globe2,
  BrainCircuit,
  Calculator,
  History,
  BarChart3,
  BellRing,
  Plug,
  Settings,
  ShieldCheck,
  AlertOctagon,
  Play,
} from 'lucide-react';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    unreadAlertsCount,
    currentUser,
    mmSession,
    resumeTrading,
    recordMMTradeOutcome,
    addToast,
  } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'signals', label: 'Live Signals', icon: <Radio className="w-4 h-4 text-emerald-400" />, badge: 'LIVE' },
    { id: 'chart', label: 'Real-Time Chart', icon: <LineChart className="w-4 h-4" /> },
    { id: 'markets', label: 'Markets', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Analysis', icon: <BrainCircuit className="w-4 h-4 text-cyan-400" /> },
    { id: 'money-management', label: 'Money Management', icon: <Calculator className="w-4 h-4 text-emerald-400" /> },
    { id: 'history', label: 'Trade History', icon: <History className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <BarChart3 className="w-4 h-4" /> },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: <BellRing className="w-4 h-4" />,
      badge: unreadAlertsCount > 0 ? String(unreadAlertsCount) : undefined,
    },
    { id: 'integrations', label: 'Integrations', icon: <Plug className="w-4 h-4" /> },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: <Settings className="w-4 h-4 text-amber-400" />,
      badge: currentUser?.role === 'admin' ? 'ROOT' : undefined,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0b0e14] border-r border-slate-800/80 shrink-0 h-[calc(100vh-5.5rem)] sticky top-22">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Terminal Console
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-[#141924]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider font-mono ${
                    item.badge === 'LIVE'
                      ? 'bg-emerald-500/20 text-emerald-400 animate-pulse'
                      : item.badge === 'ROOT'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Risk Safeguard & Emergency Stop HUD Box */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0e111a]">
        <div className="p-3 rounded-lg bg-[#141924] border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-300">Risk Circuit</span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                mmSession.isPaused
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              {mmSession.isPaused ? 'HALTED' : 'ACTIVE'}
            </span>
          </div>

          <div className="space-y-1 mb-3 text-[11px] font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Stake:</span>
              <span className="text-white font-bold">${mmSession.suggestedStake.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Balance:</span>
              <span className="text-white font-bold">${mmSession.currentBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Loss Streak:</span>
              <span className={mmSession.consecutiveLosses > 1 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                {mmSession.consecutiveLosses} / 3 max
              </span>
            </div>
          </div>

          {mmSession.isPaused ? (
            <button
              onClick={resumeTrading}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Engine</span>
            </button>
          ) : (
            <button
              onClick={() => {
                resumeTrading();
                addToast('Emergency circuit breaker tripped manually.', 'warning');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#1b2231] hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 text-slate-400 font-bold text-[11px] rounded transition-colors"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
              <span>Pause Trading</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
