import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  MarketAsset,
  SystemSettings,
  UserAccount,
  TradeRecord,
  AlertNotification,
  LiveSignal
} from '../src/types.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

export interface StoredUser extends UserAccount {
  passwordHash: string;
  salt: string;
}

export interface AppStore {
  settings: SystemSettings;
  users: StoredUser[];
  markets: MarketAsset[];
  trades: TradeRecord[];
  alerts: AlertNotification[];
  cachedSignals: Record<string, LiveSignal>;
}

// Utility to hash password
export function hashPassword(password: string, existingSalt?: string): { hash: string; salt: string } {
  const salt = existingSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return check === hash;
}

const defaultMarkets: MarketAsset[] = [
  // Forex
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', price: 1.0842, change24h: 0.28, high24h: 1.0875, low24h: 1.0812, volume: '$4.2B', enabled: true, digits: 4, source: 'Forex Data Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex', price: 1.2915, change24h: -0.14, high24h: 1.2960, low24h: 1.2885, volume: '$2.8B', enabled: true, digits: 4, source: 'Forex Data Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex', price: 154.68, change24h: 0.45, high24h: 155.10, low24h: 154.20, volume: '$3.5B', enabled: true, digits: 2, source: 'Forex Data Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex', price: 0.8845, change24h: -0.08, high24h: 0.8870, low24h: 0.8820, volume: '$1.4B', enabled: true, digits: 4, source: 'Forex Data Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'forex', price: 0.6582, change24h: 0.32, high24h: 0.6610, low24h: 0.6550, volume: '$1.9B', enabled: true, digits: 4, source: 'Forex Data Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'forex', price: 1.3820, change24h: -0.18, high24h: 1.3860, low24h: 1.3790, volume: '$1.6B', enabled: true, digits: 4, source: 'Forex Data Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'forex', price: 0.5980, change24h: 0.15, high24h: 0.6010, low24h: 0.5950, volume: '$950M', enabled: true, digits: 4, source: 'Forex Data Feed', lastUpdated: new Date().toISOString() },

  // Crypto
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto', price: 68420.00, change24h: 2.45, high24h: 69200.00, low24h: 66800.00, volume: '$32.4B', enabled: true, digits: 2, source: 'Binance Public Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'crypto', price: 3510.50, change24h: 1.82, high24h: 3580.00, low24h: 3440.00, volume: '$18.2B', enabled: true, digits: 2, source: 'Binance Public Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'crypto', price: 178.40, change24h: 4.15, high24h: 182.50, low24h: 169.80, volume: '$5.6B', enabled: true, digits: 2, source: 'Binance Public Feed', lastUpdated: new Date().toISOString() },

  // Indices
  { symbol: 'NASDAQ', name: 'Nasdaq 100 Index', category: 'indices', price: 18450.25, change24h: 0.72, high24h: 18510.00, low24h: 18320.00, volume: '$14.2B', enabled: true, digits: 2, source: 'Global Markets Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'S&P 500', name: 'S&P 500 Index', category: 'indices', price: 5460.80, change24h: 0.48, high24h: 5480.00, low24h: 5430.00, volume: '$19.8B', enabled: true, digits: 2, source: 'Global Markets Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'DOW JONES', name: 'Dow Jones Industrial Average', category: 'indices', price: 39820.50, change24h: 0.31, high24h: 39950.00, low24h: 39680.00, volume: '$11.5B', enabled: true, digits: 2, source: 'Global Markets Feed', lastUpdated: new Date().toISOString() },
];

const initialAdminPassword = hashPassword('admin1122');

const defaultUsers: StoredUser[] = [
  {
    id: 'user_admin',
    username: 'admin',
    name: 'Administrator',
    email: 'admin@newazcapitalx.io',
    role: 'admin',
    createdAt: new Date().toISOString(),
    status: 'active',
    passwordHash: initialAdminPassword.hash,
    salt: initialAdminPassword.salt,
  },
  {
    id: 'user_staff_1',
    username: 'trader_ops',
    name: 'Senior Desk Trader',
    email: 'ops@newazcapitalx.io',
    role: 'staff',
    createdAt: new Date().toISOString(),
    status: 'active',
    passwordHash: hashPassword('staff1234').hash,
    salt: hashPassword('staff1234').salt,
  },
  {
    id: 'user_client_1',
    username: 'demo_user',
    name: 'Personal Trader',
    email: 'trader@newazcapitalx.io',
    role: 'user',
    createdAt: new Date().toISOString(),
    status: 'active',
    passwordHash: hashPassword('trader1234').hash,
    salt: hashPassword('trader1234').salt,
  },
];

const defaultSettings: SystemSettings = {
  general: {
    websiteName: 'NEWAZ CAPITALX',
    tagline: 'AI Market Intelligence • Signal Analytics • Smart Money Management',
    contactEmail: 'support@newazcapitalx.io',
    supportTelegram: '@newazcapitalx_official',
    footerText: '© 2026 NEWAZ CAPITALX. High-Performance Trading Intelligence & Risk Systems.',
    disclaimer: 'NEWAZ CAPITALX provides market analytics and risk-management calculations for informational purposes. Trading involves substantial risk. Signals and analytical scores are not guarantees of future results. Users are responsible for their own trading decisions and should only risk capital they can afford to lose.',
    aboutText: 'NEWAZ CAPITALX is an institutional-grade personal trading analytics suite engineered to fuse multi-timeframe quantitative signal metrics with adaptive risk-management engines.',
  },
  theme: {
    primaryAccent: '#00F090',
    secondaryAccent: '#00D2FF',
    background: '#0B0E14',
    panelBackground: '#12161F',
    borderStyle: 'thin-subtle',
  },
  signalEngine: {
    confidenceThreshold: 70,
    signalCooldownSeconds: 60,
    weights: {
      trend: 25,
      momentum: 20,
      rsi: 15,
      macd: 15,
      supportResistance: 10,
      volatility: 10,
      priceAction: 5,
    },
    indicators: {
      emaFast: 9,
      emaMedium: 21,
      emaSlow: 50,
      rsiPeriod: 14,
      rsiOverbought: 70,
      rsiOversold: 30,
      macdFast: 12,
      macdSlow: 26,
      macdSignal: 9,
      bollingerPeriod: 20,
      bollingerStdDev: 2,
      atrPeriod: 14,
    },
  },
  moneyManagement: {
    initialCapital: 1000,
    currentBalance: 1000,
    riskPerTradePercent: 2,
    maxRiskPerSessionPercent: 10,
    totalPlannedTrades: 10,
    targetWins: 7,
    payoutRatioPercent: 85,
    maxConsecutiveLosses: 3,
    dailyLossLimitPercent: 6,
    dailyProfitTargetPercent: 12,
    mode: 'percent',
    compounding: false,
    fixedAmount: 25,
    maxStakeCap: 200,
  },
  content: {
    heroHeadline: 'AI-Powered Market Intelligence & Smart Risk Management',
    heroSubheadline: 'Streamline your market execution with algorithmic multi-indicator signals, high-fidelity quantitative charts, and mathematical capital protection.',
    faqList: [
      { question: 'What is NEWAZ CAPITALX?', answer: 'NEWAZ CAPITALX is a unified trading command center combining real-time multi-market quantitative analysis, algorithmic signal scoring, and rigorous money management calculations.' },
      { question: 'Are signals guaranteed to win?', answer: 'No. No algorithm can guarantee market outcomes. Confidence levels are statistical probabilities based on weighted technical indicator convergence, not promises.' },
      { question: 'How does the Money Management engine protect capital?', answer: 'It calculates position sizing mathematically with hard guardrails including maximum consecutive losses, session loss thresholds, and automatic TRADING PAUSED circuit-breakers.' },
      { question: 'Can I connect live exchange data?', answer: 'Yes. The system connects directly to public exchange APIs (such as Binance) and official currency feeds without requesting or storing any broker credentials.' },
    ],
    signalDisclaimerNotice: 'Analytical probability score derived from quantitative indicators. Always observe personal risk parameters.',
  },
  integrations: {
    binancePublic: { enabled: true, status: 'CONNECTED', latencyMs: 38 },
    forexData: { enabled: true, status: 'CONNECTED', latencyMs: 82 },
    brokerApi: { enabled: false, status: 'NOT CONNECTED', name: 'Official Broker Web API' },
    websocket: { enabled: true, status: 'CONNECTED' },
  },
  auditLogs: [
    {
      id: 'log_init',
      timestamp: new Date().toISOString(),
      user: 'SYSTEM',
      action: 'INITIALIZATION',
      details: 'NEWAZ CAPITALX trading terminal initialized with standard parameters.',
    },
  ],
};

const defaultTrades: TradeRecord[] = [
  {
    id: 'tr_1',
    date: '2026-09-19',
    time: '14:25:00',
    asset: 'EUR/USD',
    direction: 'CALL',
    timeframe: '5M',
    entryPrice: 1.0835,
    exitPrice: 1.0848,
    stake: 50,
    result: 'WIN',
    pnl: 42.50,
    confidence: 82,
    reason: 'EMA alignment (9 > 21) & MACD histogram breakout above zero',
    dataSource: 'Forex Data Feed',
    createdAt: Date.now() - 3600000 * 20,
  },
  {
    id: 'tr_2',
    date: '2026-09-19',
    time: '15:10:00',
    asset: 'BTC/USD',
    direction: 'CALL',
    timeframe: '15M',
    entryPrice: 67850,
    exitPrice: 68320,
    stake: 60,
    result: 'WIN',
    pnl: 51.00,
    confidence: 86,
    reason: 'Strong Bullish EMA alignment + RSI bounce from 44 with volume surge',
    dataSource: 'Binance Public Feed',
    createdAt: Date.now() - 3600000 * 18,
  },
  {
    id: 'tr_3',
    date: '2026-09-19',
    time: '16:45:00',
    asset: 'GBP/USD',
    direction: 'PUT',
    timeframe: '5M',
    entryPrice: 1.2940,
    exitPrice: 1.2952,
    stake: 50,
    result: 'LOSS',
    pnl: -50.00,
    confidence: 74,
    reason: 'Bearish divergence failed at psychological round number support',
    dataSource: 'Forex Data Feed',
    createdAt: Date.now() - 3600000 * 15,
  },
  {
    id: 'tr_4',
    date: '2026-09-20',
    time: '01:15:00',
    asset: 'ETH/USD',
    direction: 'CALL',
    timeframe: '1M',
    entryPrice: 3480,
    exitPrice: 3505,
    stake: 55,
    result: 'WIN',
    pnl: 46.75,
    confidence: 79,
    reason: 'Hammer pattern test on 1M with positive MACD cross',
    dataSource: 'Binance Public Feed',
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'tr_5',
    date: '2026-09-20',
    time: '02:30:00',
    asset: 'USD/JPY',
    direction: 'CALL',
    timeframe: '5M',
    entryPrice: 154.30,
    exitPrice: 154.65,
    stake: 55,
    result: 'WIN',
    pnl: 46.75,
    confidence: 84,
    reason: 'Bullish continuation off EMA 21 dynamic support',
    dataSource: 'Forex Data Feed',
    createdAt: Date.now() - 3600000 * 2,
  },
];

const defaultAlerts: AlertNotification[] = [
  {
    id: 'alt_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
    type: 'HIGH_CONFIDENCE',
    title: 'High Confidence Signal (86%)',
    message: 'BTC/USD — CALL signal verified with multi-timeframe EMA alignment.',
    asset: 'BTC/USD',
    read: false,
  },
  {
    id: 'alt_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
    type: 'CALL',
    title: 'New CALL Signal Detected',
    message: 'EUR/USD — 5M CALL signal activated based on RSI bounce and MACD surge.',
    asset: 'EUR/USD',
    read: true,
  },
];

class Database {
  private store: AppStore;

  constructor() {
    this.store = this.loadStore();
  }

  private loadStore(): AppStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          settings: { ...defaultSettings, ...parsed.settings },
          users: parsed.users && parsed.users.length ? parsed.users : defaultUsers,
          markets: parsed.markets && parsed.markets.length ? parsed.markets : defaultMarkets,
          trades: parsed.trades || defaultTrades,
          alerts: parsed.alerts || defaultAlerts,
          cachedSignals: parsed.cachedSignals || {},
        };
      }
    } catch (e) {
      console.error('Error loading store, initializing default:', e);
    }
    const initial: AppStore = {
      settings: defaultSettings,
      users: defaultUsers,
      markets: defaultMarkets,
      trades: defaultTrades,
      alerts: defaultAlerts,
      cachedSignals: {},
    };
    this.saveStore(initial);
    return initial;
  }

  public save(): void {
    this.saveStore(this.store);
  }

  private saveStore(store: AppStore): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write store file:', err);
    }
  }

  public getSettings(): SystemSettings {
    return this.store.settings;
  }

  public updateSettings(partial: Partial<SystemSettings>, adminUser = 'admin'): SystemSettings {
    this.store.settings = {
      ...this.store.settings,
      ...partial,
      general: { ...this.store.settings.general, ...(partial.general || {}) },
      theme: { ...this.store.settings.theme, ...(partial.theme || {}) },
      signalEngine: {
        ...this.store.settings.signalEngine,
        ...(partial.signalEngine || {}),
        weights: { ...this.store.settings.signalEngine.weights, ...(partial.signalEngine?.weights || {}) },
        indicators: { ...this.store.settings.signalEngine.indicators, ...(partial.signalEngine?.indicators || {}) },
      },
      moneyManagement: { ...this.store.settings.moneyManagement, ...(partial.moneyManagement || {}) },
      content: { ...this.store.settings.content, ...(partial.content || {}) },
    };
    this.addAuditLog(adminUser, 'UPDATE_SETTINGS', 'System settings updated');
    this.save();
    return this.store.settings;
  }

  public getMarkets(): MarketAsset[] {
    return this.store.markets;
  }

  public setMarkets(markets: MarketAsset[]): void {
    this.store.markets = markets;
    this.save();
  }

  public updateMarket(symbol: string, updates: Partial<MarketAsset>): MarketAsset | null {
    const idx = this.store.markets.findIndex(m => m.symbol.toUpperCase() === symbol.toUpperCase());
    if (idx === -1) return null;
    this.store.markets[idx] = { ...this.store.markets[idx], ...updates, lastUpdated: new Date().toISOString() };
    this.save();
    return this.store.markets[idx];
  }

  public addMarket(market: MarketAsset, adminUser = 'admin'): MarketAsset {
    const existing = this.store.markets.find(m => m.symbol.toUpperCase() === market.symbol.toUpperCase());
    if (existing) {
      Object.assign(existing, market);
      this.save();
      return existing;
    }
    this.store.markets.push(market);
    this.addAuditLog(adminUser, 'ADD_MARKET', `Added asset ${market.symbol}`);
    this.save();
    return market;
  }

  public removeMarket(symbol: string, adminUser = 'admin'): boolean {
    const len = this.store.markets.length;
    this.store.markets = this.store.markets.filter(m => m.symbol.toUpperCase() !== symbol.toUpperCase());
    if (this.store.markets.length !== len) {
      this.addAuditLog(adminUser, 'REMOVE_MARKET', `Removed asset ${symbol}`);
      this.save();
      return true;
    }
    return false;
  }

  public getUsers(): UserAccount[] {
    // Strip security sensitive hashes
    return this.store.users.map(({ passwordHash, salt, ...rest }) => rest);
  }

  public findUserByUsername(username: string): StoredUser | undefined {
    return this.store.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.store.users.find(u => u.id === id);
  }

  public updateUserPassword(userId: string, newPass: string, adminUser = 'admin'): boolean {
    const user = this.store.users.find(u => u.id === userId);
    if (!user) return false;
    const { hash, salt } = hashPassword(newPass);
    user.passwordHash = hash;
    user.salt = salt;
    this.addAuditLog(adminUser, 'CHANGE_PASSWORD', `Password updated for ${user.username}`);
    this.save();
    return true;
  }

  public addUser(user: { username: string; name: string; email: string; role: 'admin' | 'staff' | 'user'; password: string }, adminUser = 'admin'): UserAccount {
    const { hash, salt } = hashPassword(user.password);
    const newStored: StoredUser = {
      id: 'usr_' + Date.now().toString(36),
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt,
    };
    this.store.users.push(newStored);
    this.addAuditLog(adminUser, 'ADD_USER', `Added user ${user.username} with role ${user.role}`);
    this.save();
    const { passwordHash: _, salt: __, ...clean } = newStored;
    return clean;
  }

  public updateUserStatus(userId: string, status: 'active' | 'disabled', adminUser = 'admin'): boolean {
    const user = this.store.users.find(u => u.id === userId);
    if (!user) return false;
    user.status = status;
    this.addAuditLog(adminUser, 'UPDATE_USER_STATUS', `Set status to ${status} for ${user.username}`);
    this.save();
    return true;
  }

  public deleteUser(userId: string, adminUser = 'admin'): boolean {
    const user = this.store.users.find(u => u.id === userId);
    if (!user || user.username === 'admin') return false; // Protect root admin
    this.store.users = this.store.users.filter(u => u.id !== userId);
    this.addAuditLog(adminUser, 'DELETE_USER', `Deleted user ${user.username}`);
    this.save();
    return true;
  }

  public getTrades(): TradeRecord[] {
    return this.store.trades;
  }

  public addTrade(trade: Omit<TradeRecord, 'id' | 'createdAt'>): TradeRecord {
    const newTrade: TradeRecord = {
      ...trade,
      id: 'tr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now(),
    };
    this.store.trades.unshift(newTrade);
    this.save();
    return newTrade;
  }

  public deleteTrade(id: string): boolean {
    const len = this.store.trades.length;
    this.store.trades = this.store.trades.filter(t => t.id !== id);
    if (this.store.trades.length !== len) {
      this.save();
      return true;
    }
    return false;
  }

  public getAlerts(): AlertNotification[] {
    return this.store.alerts;
  }

  public addAlert(alert: Omit<AlertNotification, 'id' | 'timestamp' | 'read'>): AlertNotification {
    const newAlert: AlertNotification = {
      ...alert,
      id: 'alt_' + Date.now().toString(36),
      timestamp: new Date().toLocaleTimeString(),
      read: false,
    };
    this.store.alerts.unshift(newAlert);
    if (this.store.alerts.length > 50) {
      this.store.alerts = this.store.alerts.slice(0, 50);
    }
    this.save();
    return newAlert;
  }

  public markAlertRead(id: string): void {
    const a = this.store.alerts.find(item => item.id === id);
    if (a) {
      a.read = true;
      this.save();
    }
  }

  public clearAllAlerts(): void {
    this.store.alerts = [];
    this.save();
  }

  public addAuditLog(user: string, action: string, details: string): void {
    const entry = {
      id: 'log_' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      user,
      action,
      details,
    };
    this.store.settings.auditLogs.unshift(entry);
    if (this.store.settings.auditLogs.length > 100) {
      this.store.settings.auditLogs = this.store.settings.auditLogs.slice(0, 100);
    }
    this.save();
  }
}

export const db = new Database();
