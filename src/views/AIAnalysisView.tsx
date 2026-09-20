import React from 'react';
import { useApp } from '../context/AppContext.js';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Shield,
} from 'lucide-react';
import { AIAnalysisResponse } from '../types.js';

export const AIAnalysisView: React.FC = () => {
  const {
    selectedAsset,
    selectedTimeframe,
    aiAnalysis,
    aiLoading,
    requestAIAnalysis,
    markets,
  } = useApp();

  const currentMarket = markets.find(m => m.symbol === selectedAsset);
  const analysis = aiAnalysis as AIAnalysisResponse | null;

  return (
    <div className="space-y-6">
      {/* AI Header Card */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-white font-mono">
              AI MARKET INTELLIGENCE ENGINE
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Powered by Gemini 3.8 Flash • Multi-factor technical convergence, sentiment modeling, and volatility risk checks.
          </p>
        </div>

        <button
          onClick={() => requestAIAnalysis(selectedAsset, selectedTimeframe)}
          disabled={aiLoading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/10 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${aiLoading ? 'animate-spin' : ''}`} />
          <span>{aiLoading ? 'Synthesizing Market Intelligence...' : 'Run Deep AI Scan'}</span>
        </button>
      </div>

      {analysis ? (
        <div className="space-y-6">
          {/* Main AI Verdict Banner */}
          <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 mb-6">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Analyzed Asset & Horizon
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-white font-mono">{analysis.asset}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-slate-300">
                    {analysis.timeframe}
                  </span>
                </div>
              </div>

              {/* Bias / Sentiment Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Consensus Bias</span>
                  <span
                    className={`text-lg font-mono font-black ${
                      analysis.aiInterpretation.sentiment.includes('Bullish')
                        ? 'text-emerald-400'
                        : analysis.aiInterpretation.sentiment.includes('Bearish')
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {analysis.aiInterpretation.sentiment} ({analysis.aiInterpretation.confidence}%)
                  </span>
                </div>
              </div>
            </div>

            {/* AI Recommendation Summary Box */}
            <div className="p-5 rounded-xl bg-[#0b0e14] border border-slate-800 mb-6">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span>Synthesis & Strategic Recommendation</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                {analysis.aiInterpretation.rationale}
              </p>
            </div>

            {/* Technical Confluences & Catalysts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Confluences */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Identified Confluences
                </span>
                <div className="space-y-2">
                  {analysis.technicalCalculations.keySignals?.map((c: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-[#0e121a] border border-slate-800 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Active Risk Warnings
                </span>
                <div className="space-y-2">
                  {analysis.aiInterpretation.riskFactors?.map((r: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-lg bg-[#201014] border border-rose-500/30 text-xs text-rose-300"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro-metrics bar */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0b0e14] border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Timestamp</span>
                <span className="text-white font-bold">{analysis.timestamp}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Analysis Engine</span>
                <span className="text-cyan-400 font-bold">{analysis.modelUsed || 'Gemini 3.8 Flash'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Execution Rule</span>
                <span className="text-emerald-400 font-bold">Never exceed 2% risk</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Initial State */
        <div className="p-16 text-center rounded-2xl bg-[#121620] border border-slate-800 space-y-4">
          <BrainCircuit className="w-12 h-12 text-cyan-400 mx-auto opacity-70" />
          <h3 className="text-base font-bold text-white">AI Intelligence Ready</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Select an asset in the top bar and click the scan button above to evaluate multi-indicator momentum, market sentiment, and volatility anomalies.
          </p>
          <button
            onClick={() => requestAIAnalysis(selectedAsset, selectedTimeframe)}
            disabled={aiLoading}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all"
          >
            Start Scan for {selectedAsset}
          </button>
        </div>
      )}

      {/* Mandatory Regulatory Compliance Notice */}
      <div className="p-4 rounded-xl bg-[#0c0f17] border border-slate-800 text-[11px] text-slate-500 leading-relaxed text-center">
        NEWAZ CAPITALX AI is a technical decision-support assistant. No artificial intelligence can forecast macroeconomic shocks or guarantee trading outcomes. Traders assume full responsibility for capital allocation.
      </div>
    </div>
  );
};
