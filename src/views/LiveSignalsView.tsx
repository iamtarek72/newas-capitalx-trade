import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Sparkles,
  BarChart2,
  ShieldAlert,
} from 'lucide-react';
import { Timeframe, SignalDirection } from '../types.js';

export const LiveSignalsView: React.FC = () => {
  const {
    signals,
    setSelectedAsset,
    setSelectedTimeframe,
    selectedTimeframe,
    setActiveTab,
    recordMMTradeOutcome,
    marketStatus,
  } = useApp();

  const [dirFilter, setDirFilter] = useState<'ALL' | 'CALL' | 'PUT' | 'WAIT'>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(60);
  const [search, setSearch] = useState('');

  const filtered = signals.filter(sig => {
    const matchesDir = dirFilter === 'ALL' || sig.direction === dirFilter;
    const matchesConf = sig.confidence >= minConfidence;
    const matchesSearch = sig.asset.toLowerCase().includes(search.toLowerCase());
    return matchesDir && matchesConf && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121620] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
            <h2 className="text-xl font-extrabold text-white font-mono">LIVE SIGNAL ENGINE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time algorithmic multi-indicator convergence scanner inspired by institutional desk workflows.
          </p>
        </div>

        {/* Timeframe Bar */}
        <div className="flex items-center gap-1.5 bg-[#0b0e14] border border-slate-800 p-1 rounded-xl">
          {(['1M', '5M', '15M'] as Timeframe[]).map(tf => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0e121a] border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-400 uppercase mr-2">Signal Filter:</span>
          {(['ALL', 'CALL', 'PUT', 'WAIT'] as const).map(dir => (
            <button
              key={dir}
              onClick={() => setDirFilter(dir)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dirFilter === dir
                  ? dir === 'CALL'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                    : dir === 'PUT'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white bg-[#141924]'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Min Conf:</span>
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              value={minConfidence}
              onChange={e => setMinConfidence(Number(e.target.value))}
              className="w-24 accent-emerald-400 cursor-pointer"
            />
            <span className="text-emerald-400 font-bold">{minConfidence}%</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search pair..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-[#121620] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(sig => {
          const isCall = sig.direction === 'CALL';
          const isPut = sig.direction === 'PUT';

          return (
            <div
              key={sig.id}
              className={`p-5 rounded-2xl bg-[#121620] border transition-all hover:border-slate-700 shadow-xl ${
                isCall
                  ? 'border-emerald-500/30'
                  : isPut
                  ? 'border-rose-500/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div>
                  <h3 className="text-base font-extrabold font-mono text-white">{sig.asset}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Timeframe: {sig.timeframe} • {sig.timestamp}
                  </span>
                </div>

                {/* Direction Badge */}
                {isCall ? (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs font-mono">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>CALL</span>
                  </div>
                ) : isPut ? (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold text-xs font-mono">
                    <ArrowDownRight className="w-4 h-4" />
                    <span>PUT</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold text-xs font-mono">
                    <Minus className="w-4 h-4" />
                    <span>WAIT</span>
                  </div>
                )}
              </div>

              {/* Confidence & Regime Row */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0b0e14] border border-slate-800/80 mb-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Confidence</span>
                  <span
                    className={`text-xl font-extrabold ${
                      sig.confidence >= 80 ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {sig.confidence}%
                  </span>
                  <span className="text-[9px] text-slate-500 block">Analytical Score</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase block">Market Regime</span>
                  <span className="text-xs font-bold text-white block mt-1">{sig.marketCondition}</span>
                  <span className="text-[9px] text-slate-500">Exp: {sig.expirationSeconds}s</span>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-1.5 mb-5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Confirmation Factors
                </span>
                {sig.reasons.slice(0, 3).map((r, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300 leading-tight">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    setSelectedAsset(sig.asset);
                    setSelectedTimeframe(sig.timeframe);
                    setActiveTab('dashboard');
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#181d29] hover:bg-[#202737] border border-slate-700 text-slate-200 font-bold text-xs transition-colors text-center"
                >
                  Inspect Terminal
                </button>

                <button
                  onClick={() => {
                    setSelectedAsset(sig.asset);
                    setSelectedTimeframe(sig.timeframe);
                    setActiveTab('chart');
                  }}
                  className="p-2 rounded-lg bg-[#181d29] hover:bg-[#202737] border border-slate-700 text-cyan-400 transition-colors"
                  title="View Chart"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>

                {sig.direction !== 'WAIT' && (
                  <button
                    onClick={() => {
                      recordMMTradeOutcome('WIN');
                    }}
                    className="py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                    title="Quick MM Log"
                  >
                    Log Trade
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#121620] border border-slate-800 text-slate-400">
          <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h4 className="font-bold text-white text-base">No Signals Matched Configured Thresholds</h4>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting the minimum confidence slider or clearing search filters.
          </p>
        </div>
      )}
    </div>
  );
};
