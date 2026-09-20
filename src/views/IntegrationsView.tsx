import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Plug,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Lock,
  Send,
  Zap,
  Radio,
} from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const { addToast, currentSignal } = useApp();
  const [webhookUrl, setWebhookUrl] = useState('https://your-bot-or-broker-webhook.com/api/signal');
  const [copied, setCopied] = useState(false);

  const samplePayload = JSON.stringify(
    {
      source: 'NEWAZ_CAPITALX_ENGINE',
      asset: currentSignal?.asset || 'EUR/USD',
      timeframe: currentSignal?.timeframe || '1M',
      action: currentSignal?.direction || 'CALL',
      confidence: currentSignal?.confidence || 82,
      timestamp: new Date().toISOString(),
      auth_token: 'nxt_live_bridge_sec_hash',
    },
    null,
    2
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(samplePayload);
    setCopied(true);
    addToast('Webhook JSON payload copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestWebhook = () => {
    addToast(`Test webhook payload simulated to ${webhookUrl}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white font-mono">BROKER & DATA INTEGRATIONS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official public market data streams and non-custodial webhook signal bridges.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Shield className="w-3.5 h-3.5" />
          <span>ZERO-CUSTODY COMPLIANT</span>
        </div>
      </div>

      {/* Critical Security Warning Card */}
      <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <Lock className="w-4 h-4 text-amber-400" />
          <span>CRITICAL SECURITY PROTOCOL: BROKER CREDENTIALS</span>
        </div>
        <p className="text-xs text-amber-200/80 leading-relaxed">
          NEWAZ CAPITALX is an analytical intelligence platform. We <strong>NEVER</strong> ask for, store, or transmit your Quotex, Exness, or Binance account login passwords. Automated order triggering is performed exclusively via client-side webhooks or official broker APIs with trade-only tokens.
        </p>
      </div>

      {/* Active Data Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Binance Global</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 font-mono">
              ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time public WebSocket and REST ticker for BTC, ETH, SOL, and crypto derivatives.
          </p>
          <div className="text-[11px] font-mono text-slate-500">Latency: ~24ms • No API key needed</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Open Forex Feed</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 font-mono">
              ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Institutional interbank currency rates for EUR/USD, GBP/USD, USD/JPY, and Gold (XAU).
          </p>
          <div className="text-[11px] font-mono text-slate-500">Update rate: 1s ticks • Public feed</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Gemini AI Pipeline</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 font-mono">
              READY
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Server-side reasoning model evaluating technical confluence and macroeconomic catalysts.
          </p>
          <div className="text-[11px] font-mono text-slate-500">Model: Gemini 3.8 Flash</div>
        </div>
      </div>

      {/* Webhook Dispatcher & Bridge Section */}
      <div className="p-6 rounded-2xl bg-[#121620] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Signal Webhook Bridge (Quotex / Exness Assistant)
            </h3>
            <p className="text-xs text-slate-400">
              Forward instant CALL/PUT alerts to your Telegram bot, MT4 bridge, or execution listener.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181d29] hover:bg-[#202737] border border-slate-700 text-xs font-semibold text-slate-300"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{copied ? 'Copied!' : 'Copy Schema'}</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Webhook Endpoint URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                className="flex-1 bg-[#0b0e14] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleTestWebhook}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Webhook</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Standard Output JSON Payload</label>
            <pre className="p-3 rounded-xl bg-[#0b0e14] border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
              {samplePayload}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
