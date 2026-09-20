import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  ShieldCheck,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  ExternalLink,
  DollarSign,
  Activity,
} from 'lucide-react';
import { Timeframe, SignalDirection } from '../types.js';

export const DashboardView: React.FC = () => {
  const {
    selectedAsset,
    setSelectedAsset,
    selectedTimeframe,
    setSelectedTimeframe,
    currentSignal,
    signals,
    marketStatus,
    markets,
    mmSession,
    recordMMTradeOutcome,
    setActiveTab,
    trades,
  } = useApp();

  // Expiration countdown
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    const defaultSec = selectedTimeframe === '1M' ? 60 : selectedTimeframe === '5M' ? 300 : 900;
    setTimeLeft(defaultSec);
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 1 ? prev - 1 : defaultSec));
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedTimeframe, selectedAsset]);

  // Aggregate signals count
  const callCount = signals.filter(s => s.direction === 'CALL').length;
  const putCount = signals.filter(s => s.direction === 'PUT').length;
  const waitCount = signals.filter(s => s.direction === 'WAIT').length;

  const currentMarket = markets.find(m => m.symbol === selectedAsset);
  const activeSignal = currentSignal || {
    id: 'placeholder',
    asset: selectedAsset,
    timeframe: selectedTimeframe,
    direction: 'WAIT' as SignalDirection,
    confidence: 64,
    timestamp: new Date().toLocaleTimeString(),
    expirationSeconds: 60,
    marketCondition: 'Ranging' as const,
    reasons: ['Awaiting indicator convergence', 'Price consolidating near EMA 21', 'RSI in neutral boundary'],
    indicators: {
      ema9: currentMarket?.price || 1.084,
      ema21: currentMarket?.price || 1.084,
      ema50: currentMarket?.price || 1.084,
      rsi14: 50,
      macd: { macd: 0, signal: 0, hist: 0 },
      bollinger: { upper: 1.09, middle: 1.084, lower: 1.078 },
      atr14: 0.0012,
      support: 1.081,
      resistance: 1.088,
      trend: 'Neutral' as const,
      trendStrength: 50,
      momentum: 'Neutral' as const,
      volatility: 'Low' as const,
    },
    scores: { call: 35, put: 30, wait: 35 },
    dataSource: currentMarket?.source || 'Exchange Live Feed',
  };

  const getDirectionBadge = (dir: SignalDirection) => {
    if (dir === 'CALL') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          <span>CALL / BULLISH</span>
        </div>
      );
    }
    if (dir === 'PUT') {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold text-xs uppercase tracking-wider">
          <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
          <span>PUT / BEARISH</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-wider">
        <Minus className="w-4 h-4 stroke-[2.5]" />
        <span>WAIT / NEUTRAL</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Offline Alert Banner if live feed down */}
      {!marketStatus.isOnline && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-3 text-rose-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">MARKET DATA OFFLINE — Live connection unavailable</h4>
              <p className="text-xs text-rose-400/80">
                New signals are temporarily disabled until fresh real-time data resumes. Last successful update: {marketStatus.lastSuccessfulUpdate}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-500/20 text-rose-300">
            SAFEGUARD ACTIVE
          </span>
        </div>
      )}

      {/* Top 8 Institutional Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* 1. Market Status */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${marketStatus.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-mono font-bold text-white">{marketStatus.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          <span className="text-[10px] text-slate-500 truncate block mt-1 font-mono">Binance/FX</span>
        </div>

        {/* 2. Active Signals */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Active Signals</span>
          <div className="text-lg font-mono font-extrabold text-white">{signals.length}</div>
          <span className="text-[10px] text-slate-400">Scanned assets</span>
        </div>

        {/* 3. CALL Signals */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">CALL</span>
          <div className="text-lg font-mono font-extrabold text-emerald-400">{callCount}</div>
          <span className="text-[10px] text-slate-500">Bullish bias</span>
        </div>

        {/* 4. PUT Signals */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">PUT</span>
          <div className="text-lg font-mono font-extrabold text-rose-400">{putCount}</div>
          <span className="text-[10px] text-slate-500">Bearish bias</span>
        </div>

        {/* 5. WAIT Signals */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">WAIT</span>
          <div className="text-lg font-mono font-extrabold text-amber-400">{waitCount}</div>
          <span className="text-[10px] text-slate-500">Insufficient conf.</span>
        </div>

        {/* 6. Win/Loss Stats */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Win Rate</span>
          <div className="text-lg font-mono font-extrabold text-white">{mmSession.winRate}%</div>
          <span className="text-[10px] text-slate-400">{mmSession.winCount}W / {mmSession.lossCount}L</span>
        </div>

        {/* 7. Current Session */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Session</span>
          <div className="text-lg font-mono font-extrabold text-white">
            {mmSession.currentTradeNumber - 1}/{mmSession.winTarget + mmSession.lossLimit}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {mmSession.netProfit >= 0 ? '+' : ''}${mmSession.netProfit.toFixed(1)}
          </span>
        </div>

        {/* 8. Risk Level */}
        <div className="p-3.5 rounded-xl bg-[#121620] border border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Risk Safeguard</span>
          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2% CAP</span>
          </div>
          <span className="text-[10px] text-slate-500">{mmSession.isPaused ? 'HALTED' : 'NORMAL'}</span>
        </div>
      </div>

      {/* Main Trading Command Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Planalto-Inspired Live Signal Card */}
        <div className="lg:col-span-7 bg-[#121620] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-20 ${
              activeSignal.direction === 'CALL'
                ? 'bg-emerald-500'
                : activeSignal.direction === 'PUT'
                ? 'bg-rose-500'
                : 'bg-amber-500'
            }`}
          />

          {/* Header Controls: Asset Selector & Timeframe */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-white font-mono">{selectedAsset}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                  {currentMarket?.category || 'FOREX'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Current Price:{' '}
                <span className="text-white font-mono font-bold">
                  {currentMarket ? currentMarket.price.toFixed(currentMarket.digits) : '1.0842'}
                </span>{' '}
                <span className={currentMarket && currentMarket.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  ({currentMarket && currentMarket.change24h >= 0 ? '+' : ''}{currentMarket?.change24h || 0}%)
                </span>
              </p>
            </div>

            {/* Timeframe selector pills */}
            <div className="flex items-center bg-[#0b0e14] border border-slate-800 rounded-lg p-1">
              {(['1M', '5M', '15M'] as Timeframe[]).map(tf => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Core Signal Banner (Planalto Inspiration) */}
          <div className="my-6 p-5 rounded-xl bg-[#0e121a] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Algorithmic Signal Direction
              </span>
              <div>{getDirectionBadge(activeSignal.direction)}</div>
              <p className="text-xs text-slate-400 font-mono">
                Signal Time: <span className="text-white">{activeSignal.timestamp}</span> • Timeframe:{' '}
                <span className="text-emerald-400">{selectedTimeframe}</span>
              </p>
            </div>

            {/* Confidence Score Circular Gauge */}
            <div className="flex items-center gap-4 bg-[#141924] px-5 py-3 rounded-xl border border-slate-700/60">
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Confidence</span>
                <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
                  {activeSignal.confidence}%
                </span>
                <span className="text-[9px] text-slate-500 block uppercase">Analytical Score</span>
              </div>
            </div>
          </div>

          {/* Expiration Progress Bar & Condition */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Signal Expiration: <span className="text-white font-bold">{timeLeft}s remaining</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#141924] text-slate-300 font-mono">
                Regime: {activeSignal.marketCondition}
              </span>
            </div>
            {/* Animated progress line */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-1000 ease-linear"
                style={{
                  width: `${(timeLeft / (selectedTimeframe === '1M' ? 60 : selectedTimeframe === '5M' ? 300 : 900)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Technical Reasons Checklist */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Technical Confirmation Factors
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Source: {activeSignal.dataSource}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeSignal.reasons.map((reason, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-[#0e121a] border border-slate-800/80 text-xs text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weighted Scores breakdown */}
          <div className="p-4 rounded-xl bg-[#0b0e14] border border-slate-800/80 mb-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Weighted Factor Scoring
            </span>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="text-emerald-400 font-bold">CALL Score</span>
                  <span>{activeSignal.scores.call}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${activeSignal.scores.call}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span className="text-rose-400 font-bold">PUT Score</span>
                  <span>{activeSignal.scores.put}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-400" style={{ width: `${activeSignal.scores.put}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Execution Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                recordMMTradeOutcome('WIN');
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
            >
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>Log Win (+${((mmSession.suggestedStake * 85) / 100).toFixed(2)})</span>
            </button>

            <button
              onClick={() => {
                recordMMTradeOutcome('LOSS');
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              <span>Log Loss (-${mmSession.suggestedStake.toFixed(2)})</span>
            </button>

            <button
              onClick={() => setActiveTab('chart')}
              className="p-3 rounded-xl bg-[#1b2231] hover:bg-[#232b3e] border border-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Open full interactive chart"
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Chart View</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className="p-3 rounded-xl bg-[#1b2231] hover:bg-[#232b3e] border border-slate-700 text-cyan-400 text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="AI Analysis"
            >
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI Analysis</span>
            </button>
          </div>

          {/* Mandatory Informational Disclaimer Notice */}
          <p className="mt-4 text-[10px] text-slate-500 text-center leading-relaxed">
            IMPORTANT: Analytical confidence represents quantitative indicator convergence, not a guarantee of trade outcome. Capital preservation protocols must be maintained.
          </p>
        </div>

        {/* Right 5 Columns: Planalto Money Management Live HUD & Quick Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Planalto MM Inspired Session Card */}
          <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Money Management HUD</h4>
              </div>
              <button
                onClick={() => setActiveTab('money-management')}
                className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Full Console</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Session Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-[#0b0e14] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Balance</span>
                <span className="text-lg font-mono font-extrabold text-white">
                  ${mmSession.currentBalance.toFixed(2)}
                </span>
                <span className={`text-[10px] font-mono block ${mmSession.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {mmSession.netProfit >= 0 ? '+' : ''}{mmSession.profitPercent.toFixed(1)}% P/L
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#0b0e14] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Next Suggested Stake</span>
                <span className="text-lg font-mono font-extrabold text-emerald-400">
                  ${mmSession.suggestedStake.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Cap: ${mmSession.maxAllowedStake} max
                </span>
              </div>
            </div>

            {/* Progress to Target */}
            <div className="p-3 rounded-lg bg-[#0b0e14] border border-slate-800/80 mb-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Session Target Wins:</span>
                <span className="font-bold text-white">{mmSession.winCount} / {mmSession.winTarget} Wins</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all"
                  style={{ width: `${Math.min(100, (mmSession.winCount / mmSession.winTarget) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                <span>Consecutive Loss Limit:</span>
                <span className={mmSession.consecutiveLosses >= 2 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                  {mmSession.consecutiveLosses} / {mmSession.lossLimit} Max
                </span>
              </div>
            </div>

            {/* Circuit Breaker Status */}
            {mmSession.isPaused && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs mb-4">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  TRADING PAUSED — Safeguard Tripped
                </div>
                <p className="text-[11px] text-rose-400/90">{mmSession.pauseReason}</p>
              </div>
            )}
          </div>

          {/* Recent Trades Log Widget */}
          <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recent Executions</h4>
              </div>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs text-slate-400 hover:text-white font-semibold"
              >
                View Journal
              </button>
            </div>

            <div className="space-y-2">
              {trades.slice(0, 4).map(tr => (
                <div
                  key={tr.id}
                  className="p-2.5 rounded-lg bg-[#0b0e14] border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{tr.asset}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          tr.direction === 'CALL' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}
                      >
                        {tr.direction}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{tr.time} • Stake: ${tr.stake}</span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        tr.result === 'WIN' ? 'text-emerald-400' : tr.result === 'LOSS' ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {tr.result === 'WIN' ? `+$${tr.pnl.toFixed(2)}` : tr.result === 'LOSS' ? `-$${Math.abs(tr.pnl).toFixed(2)}` : '$0.00'}
                    </span>
                    <span className="text-[10px] text-slate-500 block uppercase">{tr.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
