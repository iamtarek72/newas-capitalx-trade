import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  BellRing,
  AlertTriangle,
  Info,
  CheckCircle2,
  Trash2,
  PlusCircle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { AlertNotification } from '../types.js';

export const AlertsView: React.FC = () => {
  const { alerts, clearAlerts, markAlertRead, markets, addToast } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'SIGNALS' | 'RISK' | 'SYSTEM'>('ALL');

  // Custom alert form
  const [isCreating, setIsCreating] = useState(false);
  const [alertAsset, setAlertAsset] = useState('EUR/USD');
  const [targetPrice, setTargetPrice] = useState('1.0900');
  const [alertNote, setAlertNote] = useState('Key Resistance Hit');

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    if (filter === 'SIGNALS') return a.type === 'CALL' || a.type === 'PUT' || a.type === 'HIGH_CONFIDENCE';
    if (filter === 'RISK') return a.type === 'RISK_LIMIT' || a.type === 'SESSION_COMPLETE';
    if (filter === 'SYSTEM') return a.type === 'DATA_OFFLINE' || a.type === 'WAIT_TO_ACTIVE';
    return true;
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(`Custom price alert registered for ${alertAsset} at ${targetPrice}`, 'success');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white font-mono">INTELLIGENT ALERT CENTER</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time market condition flags, volatility spikes, and risk circuit warnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Price Alert</span>
          </button>

          <button
            onClick={clearAlerts}
            disabled={alerts.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181d29] hover:bg-rose-500/10 hover:text-rose-400 border border-slate-700 text-slate-400 font-semibold text-xs transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Create Alert Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateAlert}
          className="p-5 rounded-2xl bg-[#0f121a] border border-slate-700/80 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase text-white">Setup Custom Alert</span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Asset</label>
              <select
                value={alertAsset}
                onChange={e => setAlertAsset(e.target.value)}
                className="w-full bg-[#181d29] border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                {markets.map(m => (
                  <option key={m.symbol} value={m.symbol}>
                    {m.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Price</label>
              <input
                type="text"
                value={targetPrice}
                onChange={e => setTargetPrice(e.target.value)}
                className="w-full bg-[#181d29] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Alert Tag</label>
              <input
                type="text"
                value={alertNote}
                onChange={e => setAlertNote(e.target.value)}
                className="w-full bg-[#181d29] border border-slate-700 rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Activate Price Monitor
          </button>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {(['ALL', 'SIGNALS', 'RISK', 'SYSTEM'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white bg-[#121620]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map(alt => {
          let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;
          let borderClass = 'border-slate-800 bg-[#121620]';

          if (alt.type === 'RISK_LIMIT' || alt.type === 'DATA_OFFLINE') {
            icon = <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />;
            borderClass = 'border-rose-500/30 bg-[#1c1216]';
          } else if (alt.type === 'CALL' || alt.type === 'HIGH_CONFIDENCE') {
            icon = <ArrowUpRight className="w-5 h-5 text-emerald-400 shrink-0" />;
            borderClass = 'border-emerald-500/30 bg-[#0f1915]';
          } else if (alt.type === 'PUT') {
            icon = <ArrowDownRight className="w-5 h-5 text-rose-400 shrink-0" />;
            borderClass = 'border-rose-500/30 bg-[#1c1216]';
          }

          return (
            <div
              key={alt.id}
              onClick={() => markAlertRead(alt.id)}
              className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all cursor-pointer hover:border-slate-700 ${borderClass} ${
                !alt.read ? 'ring-1 ring-emerald-500/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {icon}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-xs">{alt.title}</h4>
                    {!alt.read && (
                      <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded font-mono">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alt.message}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {alt.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="p-12 text-center rounded-2xl bg-[#121620] border border-slate-800 text-slate-500 text-xs">
            No alerts logged for this category.
          </div>
        )}
      </div>
    </div>
  );
};
