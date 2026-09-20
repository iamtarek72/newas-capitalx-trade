import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Shield,
  Activity,
  BrainCircuit,
  Calculator,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Zap,
  Globe2,
} from 'lucide-react';

export const LandingPageView: React.FC = () => {
  const { settings, setActiveTab, setSelectedAsset, markets, currentSignal } = useApp();

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#121622] via-[#0c0f17] to-[#090b10] border border-slate-800 p-8 sm:p-14 shadow-2xl">
        {/* Glow ambient spots */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Next-Gen Trading Terminal</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-sans leading-tight">
            {settings?.content?.heroHeadline || 'Precision Trading Terminal & Capital Risk Engine'}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {settings?.content?.heroSubheadline ||
              'Real-time multi-indicator market signals, Gemini-driven contextual intelligence, and automated risk-protective money management.'}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95"
            >
              <span>Launch Live Terminal</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={() => setActiveTab('money-management')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#141924] hover:bg-[#1a2130] border border-slate-700 text-slate-200 font-bold text-sm transition-all hover:scale-105 active:scale-95"
            >
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Explore Money Management</span>
            </button>

            {settings?.general?.supportTelegram && (
              <a
                href={settings.general.supportTelegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 font-bold text-sm transition-all"
              >
                <span>Join VIP Channel</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Live Signal Preview Card (Planalto Style) */}
        <div className="relative z-10 max-w-2xl mx-auto mt-12 p-6 rounded-2xl bg-[#0d1017]/90 border border-slate-700/70 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono font-bold text-white">LIVE SIGNAL DEMONSTRATION</span>
            </div>
            <span className="font-mono text-slate-400">EUR/USD • 1M</span>
          </div>

          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                Quantitative Verdict
              </span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-extrabold text-sm font-mono flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  CALL / BULLISH
                </span>
                <span className="text-xs text-slate-400 font-mono">Confidence: 84%</span>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-1">
                Smart Stake Recommendation
              </span>
              <span className="text-xl font-mono font-black text-white">$10.00 (1.0% Risk)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Factors: EMA Alignment • RSI Bounce • S/R Support Confirmation</span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-emerald-400 hover:underline font-bold"
            >
              Open Live Desk →
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of NEWAZ CAPITALX */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            ENGINEERED FOR DISCIPLINED CAPITAL GROWTH
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Combining real-time multi-indicator signals, dynamic stake sizing, and institutional capital preservation circuits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1 */}
          <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Algorithmic Signals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan EMA 9/21/50 crosses, RSI oversold/overbought boundaries, and Bollinger volatility in real time across 1M, 5M, and 15M frames.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Gemini AI Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep contextual market sentiment analysis, macroeconomic catalysts detection, and risk anomaly warnings powered by Gemini 3.8 Flash.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Smart Money Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Planalto-inspired risk management calculating prospective stake ladders, drawdown limits, and automatic stop-loss emergency breakers.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Real-Time Canvas Charts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              TradingView-grade lightweight canvas candlestick charting with interactive crosshairs, price-axis tags, and indicator panes.
            </p>
          </div>
        </div>
      </div>

      {/* Security & Zero-Custody Guarantee */}
      <div className="p-8 rounded-3xl bg-[#0f121a] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-white font-mono">
              ZERO-CUSTODY TRADING DISCIPLINE
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              NEWAZ CAPITALX never requests or saves Quotex, Exness, or Binance account passwords. All signals are purely analytical probabilities without speculative win guarantees.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('dashboard')}
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shrink-0 transition-colors shadow-lg"
        >
          Access Terminal
        </button>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div>
          © {new Date().getFullYear()} {settings?.general?.websiteName || 'NEWAZ CAPITALX'}. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          {settings?.general?.supportTelegram && (
            <a href={settings.general.supportTelegram} target="_blank" rel="noreferrer" className="hover:text-emerald-400">
              Telegram VIP
            </a>
          )}
          {settings?.general?.contactEmail && (
            <a href={`mailto:${settings.general.contactEmail}`} className="hover:text-emerald-400">
              {settings.general.contactEmail}
            </a>
          )}
          <button onClick={() => setActiveTab('admin')} className="hover:text-slate-300">
            Admin Access
          </button>
        </div>
      </footer>
    </div>
  );
};
