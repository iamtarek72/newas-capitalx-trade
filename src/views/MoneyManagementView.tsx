import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Play,
  Pause,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
} from 'lucide-react';

export const MoneyManagementView: React.FC = () => {
  const {
    mmConfig,
    mmSession,
    updateMMConfig,
    recordMMTradeOutcome,
    resetMMSession,
    resumeTrading,
    addToast,
  } = useApp();

  // Temporary config form inputs
  const [initialCapital, setInitialCapital] = useState(mmConfig.initialCapital);
  const [payoutRate, setPayoutRate] = useState(mmConfig.payoutRatioPercent);
  const [targetWins, setTargetWins] = useState(mmConfig.targetWins);
  const [maxLosses, setMaxLosses] = useState(mmConfig.maxConsecutiveLosses);
  const [mode, setMode] = useState<'fixed' | 'percent' | 'progressive' | 'recovery'>(mmConfig.mode);
  const [riskPercent, setRiskPercent] = useState(mmConfig.riskPerTradePercent);

  // Apply configuration
  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateMMConfig({
      initialCapital,
      payoutRatioPercent: payoutRate,
      targetWins,
      maxConsecutiveLosses: maxLosses,
      mode,
      riskPerTradePercent: riskPercent,
    });
    addToast('Money Management parameters updated successfully!', 'success');
  };

  // Generate 6-step prospective stake projection table (Planalto style)
  const generateLadder = () => {
    const ladder = [];
    let testBalance = mmSession.currentBalance;
    let baseStake = mmSession.suggestedStake || (mmSession.currentBalance * mmConfig.riskPerTradePercent) / 100;

    for (let i = 1; i <= 6; i++) {
      let stepStake = baseStake;
      if (mmConfig.mode === 'recovery') {
        stepStake = i === 1 ? baseStake : Math.min(baseStake * 1.5, mmSession.maxAllowedStake);
      } else if (mmConfig.mode === 'progressive') {
        stepStake = baseStake * (1 + 0.3 * (i - 1));
      }
      stepStake = Math.min(stepStake, mmSession.maxAllowedStake);

      const winProfit = stepStake * (mmConfig.payoutRatioPercent / 100);
      const balIfWin = testBalance + winProfit;
      const balIfLoss = testBalance - stepStake;

      ladder.push({
        step: i,
        stake: stepStake,
        winProfit,
        lossAmount: stepStake,
        balIfWin,
        balIfLoss,
      });
    }
    return ladder;
  };

  const ladder = generateLadder();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white font-mono">
              CAPITAL PRESERVATION & RISK ENGINE
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Inspired by Planalto MM • Dynamic position sizing, anti-blowout safeguards, and disciplined profit targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mmSession.isPaused ? (
            <button
              onClick={resumeTrading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/10"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume Session</span>
            </button>
          ) : (
            <button
              onClick={resetMMSession}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181d29] hover:bg-[#202737] border border-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety Circuit Trigger Banner (if tripped) */}
      {mmSession.isPaused && (
        <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-4 animate-in fade-in duration-300">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-bold text-rose-200">
              DISCIPLINARY RISK BREAKER ENGAGED
            </h3>
            <p className="text-xs text-rose-300/80 leading-relaxed font-sans">
              {mmSession.pauseReason || 'Trading session paused to preserve account equity.'} Take a 15-minute mental break before resetting or resuming.
            </p>
          </div>
          <button
            onClick={resumeTrading}
            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-lg shrink-0 transition-colors"
          >
            Override & Resume
          </button>
        </div>
      )}

      {/* Session HUD Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Balance Card */}
        <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Equity Balance
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            ${mmSession.currentBalance.toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span
              className={`flex items-center font-bold ${
                mmSession.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {mmSession.netProfit >= 0 ? '+' : ''}${mmSession.netProfit.toFixed(2)} (
              {mmSession.profitPercent.toFixed(1)}%)
            </span>
          </div>
        </div>

        {/* Suggested Stake Card */}
        <div className="p-5 rounded-2xl bg-[#121620] border border-emerald-500/30 space-y-2 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block flex items-center justify-between">
            <span>Next Stake</span>
            <Zap className="w-3.5 h-3.5" />
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            ${mmSession.suggestedStake.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">
            Max Cap: ${mmSession.maxAllowedStake.toFixed(0)}
          </span>
        </div>

        {/* Win / Loss Record */}
        <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Session Record
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white flex items-center gap-2">
            <span className="text-emerald-400">{mmSession.winCount}W</span>
            <span className="text-slate-600">/</span>
            <span className="text-rose-400">{mmSession.lossCount}L</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Win Rate: {mmSession.winRate}%</span>
            <span>Target: {mmSession.winTarget}W</span>
          </div>
        </div>

        {/* Streak & Breaker Meter */}
        <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Consecutive Losses
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white flex items-center gap-2">
            <span
              className={
                mmSession.consecutiveLosses >= mmConfig.maxConsecutiveLosses
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }
            >
              {mmSession.consecutiveLosses}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              / max {mmConfig.maxConsecutiveLosses}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all ${
                mmSession.consecutiveLosses >= mmConfig.maxConsecutiveLosses
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (mmSession.consecutiveLosses / mmConfig.maxConsecutiveLosses) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Execution Desk & Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Planalto Live Ladder & Action Trigger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Trade Outcome Dispatcher */}
          <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Log Live Position Outcome (Trade #{mmSession.currentTradeNumber})
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                Stake: ${mmSession.suggestedStake.toFixed(2)} @ {mmConfig.payoutRatioPercent}% Payout
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => recordMMTradeOutcome('WIN')}
                disabled={mmSession.isPaused}
                className="py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-30"
              >
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                  <span>WIN (+${(mmSession.suggestedStake * (mmConfig.payoutRatioPercent / 100)).toFixed(2)})</span>
                </div>
              </button>

              <button
                onClick={() => recordMMTradeOutcome('LOSS')}
                disabled={mmSession.isPaused}
                className="py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm flex flex-col items-center justify-center gap-1 transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-30"
              >
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="w-4 h-4 stroke-[3]" />
                  <span>LOSS (-${mmSession.suggestedStake.toFixed(2)})</span>
                </div>
              </button>

              <button
                onClick={() => recordMMTradeOutcome('DRAW')}
                disabled={mmSession.isPaused}
                className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex flex-col items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-30"
              >
                <span>TIE / DRAW ($0.00)</span>
              </button>
            </div>
          </div>

          {/* Prospective Stake Projection Table */}
          <div className="rounded-2xl bg-[#121620] border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 bg-[#0e121a] border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Prospective Sequence Projection Table
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Mode: {mmConfig.mode.toUpperCase()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#121620] text-slate-400 border-b border-slate-800/80 text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Step</th>
                    <th className="py-2.5 px-4">Calculated Stake</th>
                    <th className="py-2.5 px-4 text-emerald-400">Profit If Win</th>
                    <th className="py-2.5 px-4 text-rose-400">Loss Amount</th>
                    <th className="py-2.5 px-4">Balance After Win</th>
                    <th className="py-2.5 px-4">Balance After Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ladder.map(row => (
                    <tr
                      key={row.step}
                      className={
                        row.step === 1 ? 'bg-emerald-500/5 font-bold' : 'hover:bg-[#161b26]'
                      }
                    >
                      <td className="py-2.5 px-4 text-slate-400">#{row.step}</td>
                      <td className="py-2.5 px-4 text-white">${row.stake.toFixed(2)}</td>
                      <td className="py-2.5 px-4 text-emerald-400">+${row.winProfit.toFixed(2)}</td>
                      <td className="py-2.5 px-4 text-rose-400">-${row.lossAmount.toFixed(2)}</td>
                      <td className="py-2.5 px-4 text-slate-300">${row.balIfWin.toFixed(2)}</td>
                      <td className="py-2.5 px-4 text-slate-400">${row.balIfLoss.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Session Configuration Panel */}
        <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Risk Calibration Settings
            </h3>
          </div>

          <form onSubmit={handleApplyConfig} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Initial Account Balance ($)
              </label>
              <input
                type="number"
                min="10"
                value={initialCapital}
                onChange={e => setInitialCapital(Number(e.target.value))}
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Risk Model Strategy
              </label>
              <select
                value={mode}
                onChange={e => setMode(e.target.value as any)}
                className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="percent">Percentage Sizing (Recommended)</option>
                <option value="fixed">Fixed Stake ($)</option>
                <option value="progressive">Progressive Growth</option>
                <option value="recovery">Soros Recovery Mode</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Risk Per Trade (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  value={riskPercent}
                  onChange={e => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Payout Rate (%)
                </label>
                <input
                  type="number"
                  min="50"
                  max="98"
                  value={payoutRate}
                  onChange={e => setPayoutRate(Number(e.target.value))}
                  className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Session Win Target
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={targetWins}
                  onChange={e => setTargetWins(Number(e.target.value))}
                  className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Max Consec. Losses
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxLosses}
                  onChange={e => setMaxLosses(Number(e.target.value))}
                  className="w-full bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md mt-2"
            >
              Apply Risk Engine Parameters
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
