import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  TrendingUp,
  Award,
  BarChart3,
  PieChart,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from 'lucide-react';

export const PerformanceView: React.FC = () => {
  const { trades, mmSession, mmConfig } = useApp();

  const winningTrades = trades.filter(t => t.result === 'WIN');
  const losingTrades = trades.filter(t => t.result === 'LOSS');

  const grossProfit = winningTrades.reduce((acc, t) => acc + t.pnl, 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : grossProfit > 0 ? '∞' : '1.00';

  const avgWin = winningTrades.length > 0 ? (grossProfit / winningTrades.length).toFixed(2) : '0.00';
  const avgLoss = losingTrades.length > 0 ? (grossLoss / losingTrades.length).toFixed(2) : '0.00';

  // Running balance array for equity curve
  let runBal = mmSession.startingBalance;
  const equityPoints = trades.slice().reverse().map(t => {
    runBal += t.pnl;
    return {
      ...t,
      balanceAfter: runBal,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white font-mono">
              QUANTITATIVE PERFORMANCE METRICS
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Statistical distribution, win expectancy, profit factor, and equity drawdown analysis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            PF: {profitFactor}
          </div>
        </div>
      </div>

      {/* 4 Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Profit Factor</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{profitFactor}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Gross gains vs gross losses</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Avg Win / Loss</span>
          <div className="text-lg font-bold font-mono text-white">
            <span className="text-emerald-400">${avgWin}</span> / <span className="text-rose-400">${avgLoss}</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">Risk-reward payoff</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Consecutive Losses</span>
          <span className="text-2xl font-bold font-mono text-slate-200">
            {mmSession.consecutiveLosses} / {mmConfig.maxConsecutiveLosses}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Safety circuit threshold</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Session Win Rate</span>
          <span className="text-2xl font-bold font-mono text-cyan-400">{mmSession.winRate}%</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{trades.length} total logged trades</span>
        </div>
      </div>

      {/* Cumulative Balance PnL Curve (SVG Bar Visualizer) */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Account Equity Curve ($)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Current: ${mmSession.currentBalance.toFixed(2)}
          </span>
        </div>

        <div className="h-52 w-full flex items-end gap-1 sm:gap-2 pt-4 px-2 bg-[#0b0e14] rounded-xl border border-slate-800/60 overflow-hidden">
          {equityPoints.map((t, i) => {
            const isWin = t.result === 'WIN';
            const maxVal = Math.max(mmSession.startingBalance * 1.5, ...equityPoints.map(e => e.balanceAfter));
            const heightPercent = Math.min(100, Math.max(15, (t.balanceAfter / maxVal) * 100));
            return (
              <div
                key={t.id}
                className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#181d29] border border-slate-700 text-[10px] text-white font-mono px-2 py-1 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                  #{i + 1} ${t.balanceAfter.toFixed(2)} ({t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)})
                </div>

                <div
                  className={`w-full rounded-t transition-all ${
                    isWin ? 'bg-emerald-500 group-hover:bg-emerald-400' : 'bg-rose-500/70 group-hover:bg-rose-500'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
            );
          })}

          {equityPoints.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 font-sans">
              No executed trades logged yet to plot equity trajectory.
            </div>
          )}
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
          <span>Session Start (${mmSession.startingBalance})</span>
          <span>Latest Execution (${mmSession.currentBalance.toFixed(2)})</span>
        </div>
      </div>

      {/* Direction & Asset Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CALL vs PUT Analytics */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
            Directional Distribution (CALL vs PUT)
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> CALL
                </span>
                <span className="text-slate-300 font-bold">
                  {trades.filter(t => t.direction === 'CALL').length} trades
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all"
                  style={{
                    width: `${
                      trades.length > 0
                        ? (trades.filter(t => t.direction === 'CALL').length / trades.length) * 100
                        : 50
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5" /> PUT
                </span>
                <span className="text-slate-300 font-bold">
                  {trades.filter(t => t.direction === 'PUT').length} trades
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all"
                  style={{
                    width: `${
                      trades.length > 0
                        ? (trades.filter(t => t.direction === 'PUT').length / trades.length) * 100
                        : 50
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Risk & Discipline Review */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">
            Discipline & Risk Guard Evaluation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Maintaining a stake below 2% of total equity guarantees surviving multi-consecutive loss regimes. The NEWAZ CAPITALX risk circuit will automatically engage if your session drawdown exceeds the configured loss barrier.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>Zero-Blowout Protection Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
