import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { TrendingUp, TrendingDown, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { AssetCategory } from '../types.js';

export const RightWatchlist: React.FC = () => {
  const { markets, selectedAsset, setSelectedAsset } = useApp();
  const [filter, setFilter] = useState<AssetCategory | 'all'>('all');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const filteredMarkets = markets.filter(m => {
    const matchesCat = filter === 'all' || m.category === filter;
    const matchesSearch = m.symbol.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="hidden xl:flex fixed right-0 top-36 z-30 items-center gap-1 py-2 px-1 bg-[#141924] border-l border-y border-slate-700/80 rounded-l-lg text-slate-400 hover:text-white"
        title="Show Watchlist"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="hidden xl:flex flex-col w-72 bg-[#0b0e14] border-l border-slate-800/80 shrink-0 h-[calc(100vh-5.5rem)] sticky top-22">
      {/* Header */}
      <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
        <span className="text-xs font-bold text-white uppercase tracking-wider">Live Watchlist</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          title="Collapse Watchlist"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="p-2 border-b border-slate-800/60 flex items-center gap-1 text-[11px] font-semibold">
        {(['all', 'forex', 'crypto', 'indices'] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2 py-1 rounded capitalize transition-colors ${
              filter === cat
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-slate-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search asset..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#121620] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredMarkets.map(m => {
          const isSelected = selectedAsset === m.symbol;
          return (
            <div
              key={m.symbol}
              onClick={() => setSelectedAsset(m.symbol)}
              className={`p-3 cursor-pointer transition-colors flex items-center justify-between hover:bg-[#141924] ${
                isSelected ? 'bg-[#141d29] border-l-2 border-emerald-400' : ''
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold text-white">{m.symbol}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{m.category}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{m.name}</div>
              </div>

              <div className="text-right">
                <div className="font-mono text-xs font-semibold text-white">
                  {m.price > 100 ? m.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : m.price.toFixed(m.digits)}
                </div>
                <div
                  className={`text-[10px] font-mono font-medium flex items-center justify-end gap-0.5 ${
                    m.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {m.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  <span>{m.change24h >= 0 ? '+' : ''}{m.change24h}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
