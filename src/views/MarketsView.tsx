import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Globe2,
  TrendingUp,
  TrendingDown,
  Search,
  CheckCircle2,
  Sliders,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { AssetCategory } from '../types.js';

export const MarketsView: React.FC = () => {
  const { markets, selectedAsset, setSelectedAsset, setActiveTab } = useApp();
  const [selectedCat, setSelectedCat] = useState<AssetCategory | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = markets.filter(m => {
    const matchesCat = selectedCat === 'all' || m.category === selectedCat;
    const matchesSearch = m.symbol.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white font-mono">GLOBAL MARKET DIRECTORY</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed pricing across Forex, Cryptocurrencies, and Global Indices.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0b0e14] border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          {(['all', 'forex', 'crypto', 'indices'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                selectedCat === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Counter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search by pair or asset name (e.g. BTC, EUR, Gold)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#121620] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          Showing {filtered.length} of {markets.length} Assets
        </span>
      </div>

      {/* Markets Table Card */}
      <div className="rounded-2xl bg-[#121620] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-mono">
            <thead>
              <tr className="bg-[#0f131c] border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Market Category</th>
                <th className="py-3 px-4">Current Price</th>
                <th className="py-3 px-4">24h Change</th>
                <th className="py-3 px-4">24h Range</th>
                <th className="py-3 px-4">Data Source</th>
                <th className="py-3 px-4 text-right">Terminal Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-200">
              {filtered.map(m => {
                const isSelected = selectedAsset === m.symbol;
                return (
                  <tr
                    key={m.symbol}
                    className={`transition-colors ${
                      isSelected ? 'bg-emerald-500/5' : 'hover:bg-[#141924]'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#1a2130] border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                          {m.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{m.symbol}</span>
                          <span className="text-[10px] text-slate-500">{m.name}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-800 text-slate-300">
                        {m.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-white font-bold text-sm">
                      {m.price > 100
                        ? m.price.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        : m.price.toFixed(m.digits)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          m.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {m.change24h >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        <span>{m.change24h >= 0 ? '+' : ''}{m.change24h}%</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      <span>L: {m.low24h.toFixed(m.digits)}</span> • <span>H: {m.high24h.toFixed(m.digits)}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      <span className="text-emerald-400/80">{m.source}</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedAsset(m.symbol);
                          setActiveTab('dashboard');
                        }}
                        className="py-1 px-3 bg-[#1a2233] hover:bg-emerald-500 hover:text-slate-950 border border-slate-700 hover:border-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
                      >
                        Analyze
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
