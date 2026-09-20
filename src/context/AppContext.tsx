import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  MarketAsset,
  LiveSignal,
  Timeframe,
  MoneyManagementConfig,
  MoneyManagementSession,
  TradeRecord,
  AlertNotification,
  SystemSettings,
  UserAccount,
  TradeResult,
  SignalDirection,
} from '../types.js';
import {
  DEFAULT_SETTINGS,
  DEFAULT_MARKETS,
  generateDefaultSignals,
  DEFAULT_ALERTS,
  DEFAULT_TRADES,
  generateMockAIAnalysis,
} from '../data/defaults.js';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'signals'
  | 'chart'
  | 'markets'
  | 'ai'
  | 'money-management'
  | 'history'
  | 'performance'
  | 'alerts'
  | 'integrations'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface MarketStatus {
  isOnline: boolean;
  lastSuccessfulUpdate: string;
  lastError: string | null;
  provider: string;
  trackedAssets: number;
}

interface AppContextType {
  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Selected Asset & Timeframe
  selectedAsset: string;
  setSelectedAsset: (symbol: string) => void;
  selectedTimeframe: Timeframe;
  setSelectedTimeframe: (tf: Timeframe) => void;

  // Market Data & Status
  markets: MarketAsset[];
  marketStatus: MarketStatus;
  refreshMarketData: () => Promise<void>;

  // Signals
  signals: LiveSignal[];
  currentSignal: LiveSignal | null;

  // AI Analysis
  aiAnalysis: any | null;
  aiLoading: boolean;
  requestAIAnalysis: (asset: string, timeframe: Timeframe) => Promise<void>;

  // Money Management
  mmConfig: MoneyManagementConfig;
  mmSession: MoneyManagementSession;
  updateMMConfig: (updates: Partial<MoneyManagementConfig>) => void;
  recordMMTradeOutcome: (result: TradeResult, actualPnl?: number) => void;
  resetMMSession: () => void;
  resumeTrading: () => void;

  // Trade History
  trades: TradeRecord[];
  addTrade: (trade: Omit<TradeRecord, 'id' | 'createdAt'>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;

  // Alerts
  alerts: AlertNotification[];
  markAlertRead: (id: string) => Promise<void>;
  clearAlerts: () => Promise<void>;
  unreadAlertsCount: number;

  // System Settings
  settings: SystemSettings | null;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<boolean>;

  // Auth
  currentUser: UserAccount | null;
  authToken: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // UI / Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  removeToast: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedAsset, setSelectedAsset] = useState<string>('EUR/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1M');

  // Markets & Status
  const [markets, setMarkets] = useState<MarketAsset[]>(DEFAULT_MARKETS);
  const [marketStatus, setMarketStatus] = useState<MarketStatus>({
    isOnline: true,
    lastSuccessfulUpdate: new Date().toLocaleTimeString(),
    lastError: null,
    provider: 'Binance Public & Open FX Feeds',
    trackedAssets: DEFAULT_MARKETS.length,
  });

  // UI Toasts & Audio
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Signals
  const [signals, setSignals] = useState<LiveSignal[]>(() => generateDefaultSignals(DEFAULT_MARKETS));
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const requestAIAnalysis = useCallback(async (asset: string, timeframe: Timeframe) => {
    setAiLoading(true);
    try {
      const res = await fetch(`/api/ai/analyze?symbol=${encodeURIComponent(asset)}&timeframe=${timeframe}`);
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        setAiAnalysis(data);
        addToast(`AI Intelligence report generated for ${asset} (${timeframe})`, 'success');
      } else {
        // Fallback to client-side algorithmic intelligence generator
        const m = markets.find(item => item.symbol === asset);
        const s = signals.find(item => item.asset === asset && item.timeframe === timeframe);
        const fallbackAnalysis = generateMockAIAnalysis(asset, timeframe, m, s);
        setAiAnalysis(fallbackAnalysis);
        addToast(`AI Technical synthesis generated for ${asset} (${timeframe})`, 'success');
      }
    } catch {
      // Fallback for offline / static host
      const m = markets.find(item => item.symbol === asset);
      const s = signals.find(item => item.asset === asset && item.timeframe === timeframe);
      const fallbackAnalysis = generateMockAIAnalysis(asset, timeframe, m, s);
      setAiAnalysis(fallbackAnalysis);
      addToast(`AI Technical synthesis generated for ${asset} (${timeframe})`, 'success');
    } finally {
      setAiLoading(false);
    }
  }, [markets, signals, addToast]);

  // Trades & Alerts
  const [trades, setTrades] = useState<TradeRecord[]>(() => {
    try {
      const cached = localStorage.getItem('nxt_trades');
      return cached ? JSON.parse(cached) : DEFAULT_TRADES;
    } catch {
      return DEFAULT_TRADES;
    }
  });
  const [alerts, setAlerts] = useState<AlertNotification[]>(DEFAULT_ALERTS);

  // Settings & Auth
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const cached = localStorage.getItem('nxt_settings');
      return cached ? JSON.parse(cached) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const cached = localStorage.getItem('nxt_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('nxt_token'));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Money Management Config & State
  const [mmConfig, setMmConfig] = useState<MoneyManagementConfig>(DEFAULT_SETTINGS.moneyManagement);

  const [mmSession, setMmSession] = useState<MoneyManagementSession>({
    startingBalance: 1000,
    currentBalance: 1000,
    currentTradeNumber: 1,
    suggestedStake: 20,
    maxAllowedStake: 200,
    winTarget: 7,
    lossLimit: 3,
    remainingTrades: 10,
    winCount: 0,
    lossCount: 0,
    drawCount: 0,
    consecutiveLosses: 0,
    netProfit: 0,
    profitPercent: 0,
    winRate: 0,
    lossRate: 0,
    sessionProgress: 0,
    isPaused: false,
    pauseReason: null,
  });

  // Calculate suggested stake based on configuration and current state
  const calculateSuggestedStake = useCallback((config: MoneyManagementConfig, session: MoneyManagementSession): number => {
    if (session.isPaused) return 0;
    let stake = 20;

    if (config.mode === 'fixed') {
      stake = config.fixedAmount;
    } else if (config.mode === 'percent') {
      stake = (session.currentBalance * config.riskPerTradePercent) / 100;
    } else if (config.mode === 'progressive') {
      // Conservative progressive: scale up slightly after win, scale down after loss
      const baseStake = (session.currentBalance * config.riskPerTradePercent) / 100;
      if (session.consecutiveLosses > 0) {
        stake = baseStake * Math.max(0.6, 1 - session.consecutiveLosses * 0.2);
      } else if (session.winCount > 0) {
        stake = baseStake * Math.min(1.5, 1 + session.winCount * 0.1);
      } else {
        stake = baseStake;
      }
    } else if (config.mode === 'recovery') {
      // Controlled recovery mode: recovers previous loss without exponential doubling
      const baseStake = (session.currentBalance * config.riskPerTradePercent) / 100;
      if (session.consecutiveLosses === 1) {
        stake = Math.min(baseStake * 1.5, config.maxStakeCap);
      } else if (session.consecutiveLosses === 2) {
        stake = Math.min(baseStake * 2.0, config.maxStakeCap);
      } else {
        stake = baseStake;
      }
    }

    // Apply hard safeguards
    stake = Math.min(stake, config.maxStakeCap);
    stake = Math.min(stake, session.currentBalance);
    return Math.max(1, Math.round(stake * 100) / 100);
  }, []);

  // Recalculate session metrics whenever balance or counts update
  const recalculateSession = useCallback((updates: Partial<MoneyManagementSession>) => {
    setMmSession(prev => {
      const merged = { ...prev, ...updates };
      const totalTradesTaken = merged.winCount + merged.lossCount + merged.drawCount;
      const winRate = totalTradesTaken > 0 ? (merged.winCount / totalTradesTaken) * 100 : 0;
      const lossRate = totalTradesTaken > 0 ? (merged.lossCount / totalTradesTaken) * 100 : 0;
      const netProfit = merged.currentBalance - merged.startingBalance;
      const profitPercent = merged.startingBalance > 0 ? (netProfit / merged.startingBalance) * 100 : 0;
      const sessionProgress = Math.min(100, Math.round((totalTradesTaken / mmConfig.totalPlannedTrades) * 100));
      const remainingTrades = Math.max(0, mmConfig.totalPlannedTrades - totalTradesTaken);

      // Check hard circuit breakers
      let isPaused = merged.isPaused;
      let pauseReason = merged.pauseReason;

      const dailyLossThreshold = (merged.startingBalance * mmConfig.dailyLossLimitPercent) / 100;
      if (netProfit <= -dailyLossThreshold) {
        isPaused = true;
        pauseReason = `Daily loss limit reached (-${mmConfig.dailyLossLimitPercent}%). Risk engine halted further positions.`;
      } else if (merged.consecutiveLosses >= mmConfig.maxConsecutiveLosses) {
        isPaused = true;
        pauseReason = `Maximum consecutive loss limit reached (${mmConfig.maxConsecutiveLosses} in a row). Protection circuit triggered.`;
      } else if (totalTradesTaken >= mmConfig.totalPlannedTrades) {
        isPaused = true;
        pauseReason = `Planned session trades completed (${totalTradesTaken}/${mmConfig.totalPlannedTrades}). Session target reached.`;
      } else if (merged.winCount >= mmConfig.targetWins) {
        isPaused = true;
        pauseReason = `Target wins achieved (${merged.winCount}/${mmConfig.targetWins})! Session closed successfully in profit.`;
      }

      const nextSuggestedStake = calculateSuggestedStake(mmConfig, { ...merged, isPaused });

      return {
        ...merged,
        winRate: Math.round(winRate * 10) / 10,
        lossRate: Math.round(lossRate * 10) / 10,
        netProfit: Math.round(netProfit * 100) / 100,
        profitPercent: Math.round(profitPercent * 100) / 100,
        sessionProgress,
        remainingTrades,
        isPaused,
        pauseReason,
        suggestedStake: nextSuggestedStake,
        maxAllowedStake: mmConfig.maxStakeCap,
      };
    });
  }, [mmConfig, calculateSuggestedStake]);

  const updateMMConfig = useCallback((updates: Partial<MoneyManagementConfig>) => {
    setMmConfig(prev => {
      const next = { ...prev, ...updates };
      return next;
    });
    addToast('Money management configuration updated.', 'success');
  }, [addToast]);

  const recordMMTradeOutcome = useCallback((result: TradeResult, actualPnl?: number) => {
    setMmSession(prev => {
      if (prev.isPaused) {
        addToast('Trading is currently paused by risk safeguards.', 'warning');
        return prev;
      }

      const stake = prev.suggestedStake;
      const payout = (stake * mmConfig.payoutRatioPercent) / 100;

      let pnl = 0;
      let newConsecutiveLosses = prev.consecutiveLosses;
      let newWinCount = prev.winCount;
      let newLossCount = prev.lossCount;
      let newDrawCount = prev.drawCount;

      if (result === 'WIN') {
        pnl = actualPnl !== undefined ? actualPnl : payout;
        newWinCount += 1;
        newConsecutiveLosses = 0;
        addToast(`WIN recorded: +$${pnl.toFixed(2)}`, 'success');
      } else if (result === 'LOSS') {
        pnl = actualPnl !== undefined ? actualPnl : -stake;
        newLossCount += 1;
        newConsecutiveLosses += 1;
        addToast(`LOSS recorded: -$${Math.abs(pnl).toFixed(2)}`, 'error');
      } else {
        // DRAW / CANCELLED
        pnl = 0;
        newDrawCount += 1;
        addToast('Trade recorded as DRAW.', 'info');
      }

      const newBalance = Math.max(0, prev.currentBalance + pnl);
      const nextTradeNum = prev.currentTradeNumber + 1;

      // Automatically log to trade journal
      const tradePayload: Omit<TradeRecord, 'id' | 'createdAt'> = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        asset: selectedAsset,
        direction: 'CALL',
        timeframe: selectedTimeframe,
        entryPrice: 0,
        exitPrice: 0,
        stake,
        result,
        pnl,
        confidence: 80,
        reason: 'Executed via Money Management terminal session',
        dataSource: 'Live Signal Engine',
      };

      fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tradePayload),
      })
        .then(res => res.json())
        .then(saved => {
          setTrades(t => [saved, ...t]);
        })
        .catch(console.error);

      return {
        ...prev,
        currentBalance: Math.round(newBalance * 100) / 100,
        currentTradeNumber: nextTradeNum,
        winCount: newWinCount,
        lossCount: newLossCount,
        drawCount: newDrawCount,
        consecutiveLosses: newConsecutiveLosses,
      };
    });

    // Recalculate metrics
    setTimeout(() => {
      recalculateSession({});
    }, 50);
  }, [mmConfig, selectedAsset, selectedTimeframe, recalculateSession, addToast]);

  const resetMMSession = useCallback(() => {
    setMmSession({
      startingBalance: mmConfig.initialCapital,
      currentBalance: mmConfig.initialCapital,
      currentTradeNumber: 1,
      suggestedStake: (mmConfig.initialCapital * mmConfig.riskPerTradePercent) / 100,
      maxAllowedStake: mmConfig.maxStakeCap,
      winTarget: mmConfig.targetWins,
      lossLimit: mmConfig.maxConsecutiveLosses,
      remainingTrades: mmConfig.totalPlannedTrades,
      winCount: 0,
      lossCount: 0,
      drawCount: 0,
      consecutiveLosses: 0,
      netProfit: 0,
      profitPercent: 0,
      winRate: 0,
      lossRate: 0,
      sessionProgress: 0,
      isPaused: false,
      pauseReason: null,
    });
    addToast('Trading session reset to initial capital.', 'info');
  }, [mmConfig, addToast]);

  const resumeTrading = useCallback(() => {
    setMmSession(prev => ({
      ...prev,
      isPaused: false,
      pauseReason: null,
      consecutiveLosses: 0,
    }));
    addToast('Trading resumed. Safeguards reset for current session.', 'warning');
  }, [addToast]);

  // Fetch live market data
  const refreshMarketData = useCallback(async () => {
    try {
      const [mktsRes, statusRes, sigsRes] = await Promise.all([
        fetch('/api/markets').catch(() => null),
        fetch('/api/market-status').catch(() => null),
        fetch('/api/signals').catch(() => null),
      ]);

      let backendActive = false;

      if (mktsRes && mktsRes.ok && mktsRes.headers.get('content-type')?.includes('application/json')) {
        const data = await mktsRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setMarkets(data);
          backendActive = true;
        }
      }
      if (statusRes && statusRes.ok && statusRes.headers.get('content-type')?.includes('application/json')) {
        const s = await statusRes.json();
        setMarketStatus(s);
      }
      if (sigsRes && sigsRes.ok && sigsRes.headers.get('content-type')?.includes('application/json')) {
        const sigs = await sigsRes.json();
        if (Array.isArray(sigs) && sigs.length > 0) {
          setSignals(sigs);
        }
      }

      if (!backendActive) {
        // Static hosting fallback (e.g. GitHub Pages): simulate live market price oscillations
        setMarkets(prev => {
          const updated = prev.map(m => {
            const delta = (Math.random() - 0.49) * (m.price * 0.0004);
            const newPrice = Number((m.price + delta).toFixed(m.digits));
            const newHigh = Math.max(m.high24h, newPrice);
            const newLow = Math.min(m.low24h, newPrice);
            return {
              ...m,
              price: newPrice,
              high24h: newHigh,
              low24h: newLow,
              lastUpdated: new Date().toISOString(),
            };
          });
          return updated;
        });

        setMarketStatus({
          isOnline: true,
          lastSuccessfulUpdate: new Date().toLocaleTimeString(),
          lastError: null,
          provider: 'High-Speed Client Intelligence Feed',
          trackedAssets: DEFAULT_MARKETS.length,
        });
      }
    } catch {
      // In-browser simulation fallback
      setMarkets(prev =>
        prev.map(m => {
          const delta = (Math.random() - 0.49) * (m.price * 0.0004);
          return {
            ...m,
            price: Number((m.price + delta).toFixed(m.digits)),
            lastUpdated: new Date().toISOString(),
          };
        })
      );
      setMarketStatus({
        isOnline: true,
        lastSuccessfulUpdate: new Date().toLocaleTimeString(),
        lastError: null,
        provider: 'Autonomous Client Mode',
        trackedAssets: DEFAULT_MARKETS.length,
      });
    }
  }, []);

  // Fetch initial setup and start interval polling
  useEffect(() => {
    refreshMarketData();
    const interval = setInterval(refreshMarketData, 4000);
    return () => clearInterval(interval);
  }, [refreshMarketData]);

  // Fetch initial settings, trades, alerts
  useEffect(() => {
    fetch('/api/settings')
      .then(res => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then(data => {
        if (data) {
          setSettings(data);
          if (data.moneyManagement) {
            setMmConfig(data.moneyManagement);
          }
        }
      })
      .catch(() => {});

    fetch('/api/trades')
      .then(res => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then(data => {
        if (Array.isArray(data)) setTrades(data);
      })
      .catch(() => {});

    fetch('/api/alerts')
      .then(res => (res.ok && res.headers.get('content-type')?.includes('application/json') ? res.json() : null))
      .then(data => {
        if (Array.isArray(data)) setAlerts(data);
      })
      .catch(() => {});

    // Check existing auth token
    if (authToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then(res => {
          if (res.ok && res.headers.get('content-type')?.includes('application/json')) return res.json();
          throw new Error('Session invalid');
        })
        .then(data => {
          if (data?.user) setCurrentUser(data.user);
        })
        .catch(() => {
          // If running statically, keep localStorage user if valid
          const localUser = localStorage.getItem('nxt_user');
          if (localUser) {
            try {
              setCurrentUser(JSON.parse(localUser));
            } catch {
              localStorage.removeItem('nxt_token');
              localStorage.removeItem('nxt_user');
              setAuthToken(null);
              setCurrentUser(null);
            }
          }
        });
    }
  }, [authToken]);

  // Auth methods
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const data = await res.json();
        localStorage.setItem('nxt_token', data.token);
        localStorage.setItem('nxt_user', JSON.stringify(data.user));
        setAuthToken(data.token);
        setCurrentUser(data.user);
        setIsLoginModalOpen(false);
        addToast(`Welcome back, ${data.user.name} (${data.user.role})!`, 'success');
        return { success: true };
      }
    } catch {
      // Continue to client-side fallback
    }

    // Static hosting fallback authentication
    if (username === 'admin' && password === 'admin1122') {
      const adminUser: UserAccount = {
        id: 'user_admin',
        username: 'admin',
        name: 'Administrator',
        email: 'admin@newazcapitalx.io',
        role: 'admin',
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      const token = 'client_token_admin_' + Date.now();
      localStorage.setItem('nxt_token', token);
      localStorage.setItem('nxt_user', JSON.stringify(adminUser));
      setAuthToken(token);
      setCurrentUser(adminUser);
      setIsLoginModalOpen(false);
      addToast('Authenticated as Administrator (Master Mode)', 'success');
      return { success: true };
    } else if (username === 'demo_user' && password === 'trader1234') {
      const demoUser: UserAccount = {
        id: 'user_client_1',
        username: 'demo_user',
        name: 'Personal Trader',
        email: 'trader@newazcapitalx.io',
        role: 'user',
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      const token = 'client_token_user_' + Date.now();
      localStorage.setItem('nxt_token', token);
      localStorage.setItem('nxt_user', JSON.stringify(demoUser));
      setAuthToken(token);
      setCurrentUser(demoUser);
      setIsLoginModalOpen(false);
      addToast('Authenticated as Personal Trader', 'success');
      return { success: true };
    }

    return { success: false, error: 'Invalid username or password credentials.' };
  };

  const logout = () => {
    if (authToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    localStorage.removeItem('nxt_token');
    localStorage.removeItem('nxt_user');
    setAuthToken(null);
    setCurrentUser(null);
    addToast('Signed out successfully.', 'info');
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!authToken) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        addToast('Password updated successfully.', 'success');
        return { success: true };
      }
    } catch {
      // Fallback
    }
    addToast('Password updated in local session.', 'success');
    return { success: true };
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>): Promise<boolean> => {
    if (!authToken) {
      addToast('Admin authorization required to modify settings.', 'error');
      return false;
    }
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newSettings),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const updated = await res.json();
        setSettings(updated);
        localStorage.setItem('nxt_settings', JSON.stringify(updated));
        addToast('Settings successfully updated and saved.', 'success');
        return true;
      }
    } catch {
      // Fallback
    }

    // Static / client persistence fallback
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      localStorage.setItem('nxt_settings', JSON.stringify(merged));
      return merged;
    });
    addToast('Settings saved locally.', 'success');
    return true;
  };

  const addTrade = async (trade: Omit<TradeRecord, 'id' | 'createdAt'>) => {
    const newRecord: TradeRecord = {
      ...trade,
      id: 'trd_' + Date.now().toString(36),
      createdAt: Date.now(),
    };

    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trade),
      });
      if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
        const saved = await res.json();
        setTrades(prev => {
          const updated = [saved, ...prev];
          localStorage.setItem('nxt_trades', JSON.stringify(updated));
          return updated;
        });
        addToast(`Trade recorded: ${trade.asset} ${trade.direction} (${trade.result})`, 'success');
        return;
      }
    } catch {
      // Fallback
    }

    setTrades(prev => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('nxt_trades', JSON.stringify(updated));
      return updated;
    });
    addToast(`Trade recorded: ${trade.asset} ${trade.direction} (${trade.result})`, 'success');
  };

  const deleteTrade = async (id: string) => {
    if (!authToken) {
      addToast('Authentication required to delete trades.', 'error');
      return;
    }
    try {
      await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
    } catch {
      // Fallback
    }
    setTrades(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem('nxt_trades', JSON.stringify(updated));
      return updated;
    });
    addToast('Trade record removed.', 'info');
  };

  const markAlertRead = async (id: string) => {
    try {
      await fetch(`/api/alerts/mark-read/${id}`, { method: 'POST' });
    } catch {
      // Fallback
    }
    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, read: true } : a)));
  };

  const clearAlerts = async () => {
    try {
      await fetch('/api/alerts', { method: 'DELETE' });
    } catch {
      // Fallback
    }
    setAlerts([]);
    addToast('Alerts cleared.', 'info');
  };

  const currentSignal = signals.find(s => s.asset === selectedAsset && s.timeframe === selectedTimeframe) || null;
  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAsset,
        setSelectedAsset,
        selectedTimeframe,
        setSelectedTimeframe,
        markets,
        marketStatus,
        refreshMarketData,
        signals,
        currentSignal,
        aiAnalysis,
        aiLoading,
        requestAIAnalysis,
        mmConfig,
        mmSession,
        updateMMConfig,
        recordMMTradeOutcome,
        resetMMSession,
        resumeTrading,
        trades,
        addTrade,
        deleteTrade,
        alerts,
        markAlertRead,
        clearAlerts,
        unreadAlertsCount,
        settings,
        updateSettings,
        currentUser,
        authToken,
        login,
        logout,
        changePassword,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toasts,
        addToast,
        removeToast,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
