import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  History,
  Download,
  Filter,
  Trash2,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { TradeRecord, TradeResult, SignalDirection } from '../types.js';

export const TradeHistoryView: React.FC = () => {
  const { trades, addTrade, deleteTrade, markets, selectedAsset, selectedTimeframe } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'WIN' | 'LOSS' | 'DRAW'>('ALL');

  // Manual trade entry state
  const [isAdding, setIsAdding] = useState(false);
  const [newAsset, setNewAsset] = useState(selectedAsset);
  const [newDirection, setNewDirection] = useState<SignalDirection>('CALL');
  const [newStake, setNewStake] = useState(10);
  const [newResult, setNewResult] = useState<TradeResult>('WIN');
  const [newNotes, setNewNotes] = useState('');

  const filteredTrades = trades.filter(t => (filter === 'ALL' ? true : t.result === filter));

  const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const winCount = trades.filter(t => t.result === 'WIN').length;
  const winRate = trades.length > 0 ? Math.round((winCount / trades.length) * 100) : 0;

  const exportCSV = () => {
    if (trades.length === 0) return;
    const headers = ['ID', 'Date', 'Time', 'Asset', 'Direction', 'Stake', 'Result', 'PnL', 'Notes'];
    const rows = trades.map(t => [
      t.id,
      t.date,
      t.time,
      t.asset,
      t.direction,
      t.stake,
      t.result,
      t.pnl,
      `"${t.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `newaz_capitalx_journal_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pnl = newResult === 'WIN' ? newStake * 0.85 : newResult === 'LOSS' ? -newStake : 0;

    await addTrade({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      asset: newAsset,
      direction: newDirection,
      timeframe: selectedTimeframe,
      entryPrice: 0,
      exitPrice: 0,
      stake: newStake,
      result: newResult,
      pnl,
      confidence: 80,
      reason: 'Manual Journal Entry',
      dataSource: 'Manual',
      notes: newNotes,
    });

    setIsAdding(false);
    setNewNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="p-5 rounded-2xl bg-[#121620] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white font-mono">TRADE JOURNAL & EXECUTION LOGS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trail of simulated and executed sessions with CSV export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manual Entry</span>
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181d29] hover:bg-[#202737] border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Manual Entry Form */}
      {isAdding && (
        <form
          onSubmit={handleManualSubmit}
          className="p-5 rounded-2xl bg-[#0f121a] border border-slate-700/80 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase text-white">Record Manual Trade</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Asset</label>
              <select
                value={newAsset}
                onChange={e => setNewAsset(e.target.value)}
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
              <label className="text-[11px] text-slate-400 block mb-1">Direction</label>
              <select
                value={newDirection}
                onChange={e => setNewDirection(e.target.value as SignalDirection)}
                className="w-full bg-[#181d29] border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="CALL">CALL (Bullish)</option>
                <option value="PUT">PUT (Bearish)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Stake ($)</label>
              <input
                type="number"
                min="1"
                value={newStake}
                onChange={e => setNewStake(Number(e.target.value))}
                className="w-full bg-[#181d29] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Result</label>
              <select
                value={newResult}
                onChange={e => setNewResult(e.target.value as TradeResult)}
                className="w-full bg-[#181d29] border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value="WIN">WIN</option>
                <option value="LOSS">LOSS</option>
                <option value="DRAW">DRAW / TIE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Notes / Journal Observations</label>
            <input
              type="text"
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="e.g. Trend continuation after 15M EMA bounce"
              className="w-full bg-[#181d29] border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Save Trade Record
          </button>
        </form>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Logged</span>
          <span className="text-xl font-mono font-black text-white">{trades.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Win Rate</span>
          <span className="text-xl font-mono font-black text-emerald-400">{winRate}%</span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Cumulative PnL</span>
          <span
            className={`text-xl font-mono font-black ${
              totalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {totalPnL >= 0 ? `+$${totalPnL.toFixed(2)}` : `-$${Math.abs(totalPnL).toFixed(2)}`}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Stake</span>
          <span className="text-xl font-mono font-black text-slate-200">
            $
            {trades.length > 0
              ? (trades.reduce((a, b) => a + b.stake, 0) / trades.length).toFixed(1)
              : '0.00'}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['ALL', 'WIN', 'LOSS', 'DRAW'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white bg-[#121620]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trades Table */}
      <div className="rounded-2xl bg-[#121620] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0e121a] text-slate-400 text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Stake</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">PnL</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTrades.map(trade => (
                <tr key={trade.id} className="hover:bg-[#161b26] transition-colors">
                  <td className="py-3 px-4 text-slate-400">{trade.time}</td>
                  <td className="py-3 px-4 font-bold text-white">{trade.asset}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        trade.direction === 'CALL' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {trade.direction === 'CALL' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {trade.direction}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">${trade.stake.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trade.result === 'WIN'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : trade.result === 'LOSS'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {trade.result}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-4 font-bold ${
                      trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {trade.pnl >= 0 ? `+$${trade.pnl.toFixed(2)}` : `-$${Math.abs(trade.pnl).toFixed(2)}`}
                  </td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate font-sans text-xs">
                    {trade.notes || trade.reason || '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteTrade(trade.id)}
                      className="p-1 hover:text-rose-400 text-slate-600 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredTrades.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 text-xs font-sans">
                    No trades logged matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
