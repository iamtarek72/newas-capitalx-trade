import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Bell,
  Activity,
  Shield,
  User,
  ExternalLink,
  ChevronDown,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { Timeframe } from '../types.js';
import { PWAInstallButton } from './PWAInstallButton.js';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedAsset,
    setSelectedAsset,
    selectedTimeframe,
    setSelectedTimeframe,
    markets,
    marketStatus,
    alerts,
    unreadAlertsCount,
    markAlertRead,
    clearAlerts,
    currentUser,
    setIsLoginModalOpen,
    soundEnabled,
    setSoundEnabled,
  } = useApp();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);

  const timeframes: Timeframe[] = ['1M', '5M', '15M'];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0f17]/95 border-b border-slate-800/80 backdrop-blur-md">
      {/* Upper Status / Brand Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 h-14">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#141a24] border border-emerald-500/30 group-hover:border-emerald-500/60 transition-colors">
              <span className="font-bold text-emerald-400 font-mono text-sm tracking-tighter">NX</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-[#0c0f17] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-wider text-white">NEWAZ</span>
                <span className="font-extrabold text-base tracking-wider text-emerald-400">CAPITALX</span>
              </div>
              <p className="hidden md:block text-[10px] text-slate-400 tracking-wide uppercase font-medium">
                AI Intelligence • Signals • Risk Engine
              </p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#121620] border border-slate-800 text-xs">
            {marketStatus.isOnline ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 font-mono text-[11px] font-semibold">LIVE FEED ACTIVE</span>
                <span className="text-slate-500 text-[10px]">•</span>
                <span className="text-slate-400 text-[11px] font-mono">{marketStatus.lastSuccessfulUpdate}</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="text-rose-400 font-mono text-[11px] font-semibold">MARKET DATA OFFLINE</span>
                <span className="text-slate-400 text-[11px] font-mono">Last: {marketStatus.lastSuccessfulUpdate}</span>
              </>
            )}
          </div>
        </div>

        {/* Center: Live Quick Selector (Asset & Timeframe) */}
        {activeTab !== 'landing' && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Asset Selector */}
            <div className="relative">
              <button
                onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#141924] hover:bg-[#1a2130] border border-slate-700/80 rounded-lg text-xs font-semibold text-white transition-colors"
              >
                <span className="font-mono text-emerald-400 font-bold">{selectedAsset}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isAssetDropdownOpen && (
                <div
                  className="absolute left-0 mt-1 w-48 max-h-64 overflow-y-auto bg-[#141924] border border-slate-700 rounded-lg shadow-2xl z-50 py-1"
                  onMouseLeave={() => setIsAssetDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Market
                  </div>
                  {markets.map(m => (
                    <button
                      key={m.symbol}
                      onClick={() => {
                        setSelectedAsset(m.symbol);
                        setIsAssetDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:bg-[#1f2637] transition-colors ${
                        selectedAsset === m.symbol ? 'text-emerald-400 font-bold bg-[#1b2231]' : 'text-slate-200'
                      }`}
                    >
                      <span className="font-mono">{m.symbol}</span>
                      <span className={`text-[10px] font-mono ${m.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {m.change24h >= 0 ? '+' : ''}{m.change24h}%
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timeframe Selector */}
            <div className="hidden sm:flex items-center bg-[#141924] border border-slate-700/80 rounded-lg p-0.5">
              {timeframes.map(tf => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right: Actions, Alerts, Sound, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
            className="p-2 rounded-lg bg-[#141924] border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Alerts Bell */}
          <div className="relative">
            <button
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="relative p-2 rounded-lg bg-[#141924] border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center font-mono">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {isAlertsOpen && (
              <div
                className="absolute right-0 mt-2 w-80 bg-[#121620] border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                onMouseLeave={() => setIsAlertsOpen(false)}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#0f121a]">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Alerts</span>
                  {alerts.length > 0 && (
                    <button
                      onClick={clearAlerts}
                      className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {alerts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No active alerts recorded.</div>
                  ) : (
                    alerts.slice(0, 8).map(alt => (
                      <div
                        key={alt.id}
                        onClick={() => markAlertRead(alt.id)}
                        className={`p-3 text-xs cursor-pointer hover:bg-[#181d29] transition-colors ${
                          !alt.read ? 'bg-emerald-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-white">{alt.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{alt.timestamp}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{alt.message}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-slate-800 bg-[#0f121a] text-center">
                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      setIsAlertsOpen(false);
                    }}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Admin Button */}
          {currentUser ? (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold capitalize hidden sm:inline">{currentUser.role}</span>
              <span className="text-xs font-mono font-bold text-white">@{currentUser.username}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-emerald-500/20"
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </button>
          )}

          {/* PWA Install App Button */}
          <PWAInstallButton />

          {/* Landing / Terminal toggle button */}
          <button
            onClick={() => setActiveTab(activeTab === 'landing' ? 'dashboard' : 'landing')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141924] hover:bg-[#1c2333] border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeTab === 'landing' ? 'Terminal' : 'Home'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Market Ticker Marquee Strip */}
      <div className="h-8 bg-[#090b10] border-t border-slate-800/60 overflow-x-auto flex items-center gap-6 px-4 no-scrollbar">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>Markets:</span>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          {markets.map(m => (
            <div
              key={m.symbol}
              onClick={() => setSelectedAsset(m.symbol)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="text-xs font-mono font-medium text-slate-300">{m.symbol}</span>
              <span className="text-xs font-mono font-semibold text-white">
                {m.price > 100 ? m.price.toLocaleString(undefined, { minimumFractionDigits: 2 }) : m.price.toFixed(m.digits)}
              </span>
              <span
                className={`text-[11px] font-mono font-medium px-1 rounded ${
                  m.change24h >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                }`}
              >
                {m.change24h >= 0 ? '+' : ''}{m.change24h}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};
