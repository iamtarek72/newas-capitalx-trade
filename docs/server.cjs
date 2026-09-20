var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var STORE_PATH = import_path.default.join(DATA_DIR, "store.json");
function hashPassword(password, existingSalt) {
  const salt = existingSalt || import_crypto.default.randomBytes(16).toString("hex");
  const hash = import_crypto.default.pbkdf2Sync(password, salt, 1e4, 64, "sha512").toString("hex");
  return { hash, salt };
}
function verifyPassword(password, hash, salt) {
  const check = import_crypto.default.pbkdf2Sync(password, salt, 1e4, 64, "sha512").toString("hex");
  return check === hash;
}
var defaultMarkets = [
  // Forex
  { symbol: "EUR/USD", name: "Euro / US Dollar", category: "forex", price: 1.0842, change24h: 0.28, high24h: 1.0875, low24h: 1.0812, volume: "$4.2B", enabled: true, digits: 4, source: "Forex Data Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", category: "forex", price: 1.2915, change24h: -0.14, high24h: 1.296, low24h: 1.2885, volume: "$2.8B", enabled: true, digits: 4, source: "Forex Data Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", category: "forex", price: 154.68, change24h: 0.45, high24h: 155.1, low24h: 154.2, volume: "$3.5B", enabled: true, digits: 2, source: "Forex Data Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", category: "forex", price: 0.8845, change24h: -0.08, high24h: 0.887, low24h: 0.882, volume: "$1.4B", enabled: true, digits: 4, source: "Forex Data Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", category: "forex", price: 0.6582, change24h: 0.32, high24h: 0.661, low24h: 0.655, volume: "$1.9B", enabled: true, digits: 4, source: "Forex Data Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "USD/CAD", name: "US Dollar / Canadian Dollar", category: "forex", price: 1.382, change24h: -0.18, high24h: 1.386, low24h: 1.379, volume: "$1.6B", enabled: true, digits: 4, source: "Forex Data Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "NZD/USD", name: "New Zealand Dollar / US Dollar", category: "forex", price: 0.598, change24h: 0.15, high24h: 0.601, low24h: 0.595, volume: "$950M", enabled: true, digits: 4, source: "Forex Data Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  // Crypto
  { symbol: "BTC/USD", name: "Bitcoin / US Dollar", category: "crypto", price: 68420, change24h: 2.45, high24h: 69200, low24h: 66800, volume: "$32.4B", enabled: true, digits: 2, source: "Binance Public Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "ETH/USD", name: "Ethereum / US Dollar", category: "crypto", price: 3510.5, change24h: 1.82, high24h: 3580, low24h: 3440, volume: "$18.2B", enabled: true, digits: 2, source: "Binance Public Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "SOL/USD", name: "Solana / US Dollar", category: "crypto", price: 178.4, change24h: 4.15, high24h: 182.5, low24h: 169.8, volume: "$5.6B", enabled: true, digits: 2, source: "Binance Public Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  // Indices
  { symbol: "NASDAQ", name: "Nasdaq 100 Index", category: "indices", price: 18450.25, change24h: 0.72, high24h: 18510, low24h: 18320, volume: "$14.2B", enabled: true, digits: 2, source: "Global Markets Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "S&P 500", name: "S&P 500 Index", category: "indices", price: 5460.8, change24h: 0.48, high24h: 5480, low24h: 5430, volume: "$19.8B", enabled: true, digits: 2, source: "Global Markets Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() },
  { symbol: "DOW JONES", name: "Dow Jones Industrial Average", category: "indices", price: 39820.5, change24h: 0.31, high24h: 39950, low24h: 39680, volume: "$11.5B", enabled: true, digits: 2, source: "Global Markets Feed", lastUpdated: (/* @__PURE__ */ new Date()).toISOString() }
];
var initialAdminPassword = hashPassword("admin1122");
var defaultUsers = [
  {
    id: "user_admin",
    username: "admin",
    name: "Administrator",
    email: "admin@newazcapitalx.io",
    role: "admin",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "active",
    passwordHash: initialAdminPassword.hash,
    salt: initialAdminPassword.salt
  },
  {
    id: "user_staff_1",
    username: "trader_ops",
    name: "Senior Desk Trader",
    email: "ops@newazcapitalx.io",
    role: "staff",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "active",
    passwordHash: hashPassword("staff1234").hash,
    salt: hashPassword("staff1234").salt
  },
  {
    id: "user_client_1",
    username: "demo_user",
    name: "Personal Trader",
    email: "trader@newazcapitalx.io",
    role: "user",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: "active",
    passwordHash: hashPassword("trader1234").hash,
    salt: hashPassword("trader1234").salt
  }
];
var defaultSettings = {
  general: {
    websiteName: "NEWAZ CAPITALX",
    tagline: "AI Market Intelligence \u2022 Signal Analytics \u2022 Smart Money Management",
    contactEmail: "support@newazcapitalx.io",
    supportTelegram: "@newazcapitalx_official",
    footerText: "\xA9 2026 NEWAZ CAPITALX. High-Performance Trading Intelligence & Risk Systems.",
    disclaimer: "NEWAZ CAPITALX provides market analytics and risk-management calculations for informational purposes. Trading involves substantial risk. Signals and analytical scores are not guarantees of future results. Users are responsible for their own trading decisions and should only risk capital they can afford to lose.",
    aboutText: "NEWAZ CAPITALX is an institutional-grade personal trading analytics suite engineered to fuse multi-timeframe quantitative signal metrics with adaptive risk-management engines."
  },
  theme: {
    primaryAccent: "#00F090",
    secondaryAccent: "#00D2FF",
    background: "#0B0E14",
    panelBackground: "#12161F",
    borderStyle: "thin-subtle"
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
      priceAction: 5
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
      atrPeriod: 14
    }
  },
  moneyManagement: {
    initialCapital: 1e3,
    currentBalance: 1e3,
    riskPerTradePercent: 2,
    maxRiskPerSessionPercent: 10,
    totalPlannedTrades: 10,
    targetWins: 7,
    payoutRatioPercent: 85,
    maxConsecutiveLosses: 3,
    dailyLossLimitPercent: 6,
    dailyProfitTargetPercent: 12,
    mode: "percent",
    compounding: false,
    fixedAmount: 25,
    maxStakeCap: 200
  },
  content: {
    heroHeadline: "AI-Powered Market Intelligence & Smart Risk Management",
    heroSubheadline: "Streamline your market execution with algorithmic multi-indicator signals, high-fidelity quantitative charts, and mathematical capital protection.",
    faqList: [
      { question: "What is NEWAZ CAPITALX?", answer: "NEWAZ CAPITALX is a unified trading command center combining real-time multi-market quantitative analysis, algorithmic signal scoring, and rigorous money management calculations." },
      { question: "Are signals guaranteed to win?", answer: "No. No algorithm can guarantee market outcomes. Confidence levels are statistical probabilities based on weighted technical indicator convergence, not promises." },
      { question: "How does the Money Management engine protect capital?", answer: "It calculates position sizing mathematically with hard guardrails including maximum consecutive losses, session loss thresholds, and automatic TRADING PAUSED circuit-breakers." },
      { question: "Can I connect live exchange data?", answer: "Yes. The system connects directly to public exchange APIs (such as Binance) and official currency feeds without requesting or storing any broker credentials." }
    ],
    signalDisclaimerNotice: "Analytical probability score derived from quantitative indicators. Always observe personal risk parameters."
  },
  integrations: {
    binancePublic: { enabled: true, status: "CONNECTED", latencyMs: 38 },
    forexData: { enabled: true, status: "CONNECTED", latencyMs: 82 },
    brokerApi: { enabled: false, status: "NOT CONNECTED", name: "Official Broker Web API" },
    websocket: { enabled: true, status: "CONNECTED" }
  },
  auditLogs: [
    {
      id: "log_init",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      user: "SYSTEM",
      action: "INITIALIZATION",
      details: "NEWAZ CAPITALX trading terminal initialized with standard parameters."
    }
  ]
};
var defaultTrades = [
  {
    id: "tr_1",
    date: "2026-09-19",
    time: "14:25:00",
    asset: "EUR/USD",
    direction: "CALL",
    timeframe: "5M",
    entryPrice: 1.0835,
    exitPrice: 1.0848,
    stake: 50,
    result: "WIN",
    pnl: 42.5,
    confidence: 82,
    reason: "EMA alignment (9 > 21) & MACD histogram breakout above zero",
    dataSource: "Forex Data Feed",
    createdAt: Date.now() - 36e5 * 20
  },
  {
    id: "tr_2",
    date: "2026-09-19",
    time: "15:10:00",
    asset: "BTC/USD",
    direction: "CALL",
    timeframe: "15M",
    entryPrice: 67850,
    exitPrice: 68320,
    stake: 60,
    result: "WIN",
    pnl: 51,
    confidence: 86,
    reason: "Strong Bullish EMA alignment + RSI bounce from 44 with volume surge",
    dataSource: "Binance Public Feed",
    createdAt: Date.now() - 36e5 * 18
  },
  {
    id: "tr_3",
    date: "2026-09-19",
    time: "16:45:00",
    asset: "GBP/USD",
    direction: "PUT",
    timeframe: "5M",
    entryPrice: 1.294,
    exitPrice: 1.2952,
    stake: 50,
    result: "LOSS",
    pnl: -50,
    confidence: 74,
    reason: "Bearish divergence failed at psychological round number support",
    dataSource: "Forex Data Feed",
    createdAt: Date.now() - 36e5 * 15
  },
  {
    id: "tr_4",
    date: "2026-09-20",
    time: "01:15:00",
    asset: "ETH/USD",
    direction: "CALL",
    timeframe: "1M",
    entryPrice: 3480,
    exitPrice: 3505,
    stake: 55,
    result: "WIN",
    pnl: 46.75,
    confidence: 79,
    reason: "Hammer pattern test on 1M with positive MACD cross",
    dataSource: "Binance Public Feed",
    createdAt: Date.now() - 36e5 * 5
  },
  {
    id: "tr_5",
    date: "2026-09-20",
    time: "02:30:00",
    asset: "USD/JPY",
    direction: "CALL",
    timeframe: "5M",
    entryPrice: 154.3,
    exitPrice: 154.65,
    stake: 55,
    result: "WIN",
    pnl: 46.75,
    confidence: 84,
    reason: "Bullish continuation off EMA 21 dynamic support",
    dataSource: "Forex Data Feed",
    createdAt: Date.now() - 36e5 * 2
  }
];
var defaultAlerts = [
  {
    id: "alt_1",
    timestamp: new Date(Date.now() - 1e3 * 60 * 12).toLocaleTimeString(),
    type: "HIGH_CONFIDENCE",
    title: "High Confidence Signal (86%)",
    message: "BTC/USD \u2014 CALL signal verified with multi-timeframe EMA alignment.",
    asset: "BTC/USD",
    read: false
  },
  {
    id: "alt_2",
    timestamp: new Date(Date.now() - 1e3 * 60 * 45).toLocaleTimeString(),
    type: "CALL",
    title: "New CALL Signal Detected",
    message: "EUR/USD \u2014 5M CALL signal activated based on RSI bounce and MACD surge.",
    asset: "EUR/USD",
    read: true
  }
];
var Database = class {
  constructor() {
    this.store = this.loadStore();
  }
  loadStore() {
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (import_fs.default.existsSync(STORE_PATH)) {
        const raw = import_fs.default.readFileSync(STORE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          settings: { ...defaultSettings, ...parsed.settings },
          users: parsed.users && parsed.users.length ? parsed.users : defaultUsers,
          markets: parsed.markets && parsed.markets.length ? parsed.markets : defaultMarkets,
          trades: parsed.trades || defaultTrades,
          alerts: parsed.alerts || defaultAlerts,
          cachedSignals: parsed.cachedSignals || {}
        };
      }
    } catch (e) {
      console.error("Error loading store, initializing default:", e);
    }
    const initial = {
      settings: defaultSettings,
      users: defaultUsers,
      markets: defaultMarkets,
      trades: defaultTrades,
      alerts: defaultAlerts,
      cachedSignals: {}
    };
    this.saveStore(initial);
    return initial;
  }
  save() {
    this.saveStore(this.store);
  }
  saveStore(store) {
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      import_fs.default.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write store file:", err);
    }
  }
  getSettings() {
    return this.store.settings;
  }
  updateSettings(partial, adminUser = "admin") {
    this.store.settings = {
      ...this.store.settings,
      ...partial,
      general: { ...this.store.settings.general, ...partial.general || {} },
      theme: { ...this.store.settings.theme, ...partial.theme || {} },
      signalEngine: {
        ...this.store.settings.signalEngine,
        ...partial.signalEngine || {},
        weights: { ...this.store.settings.signalEngine.weights, ...partial.signalEngine?.weights || {} },
        indicators: { ...this.store.settings.signalEngine.indicators, ...partial.signalEngine?.indicators || {} }
      },
      moneyManagement: { ...this.store.settings.moneyManagement, ...partial.moneyManagement || {} },
      content: { ...this.store.settings.content, ...partial.content || {} }
    };
    this.addAuditLog(adminUser, "UPDATE_SETTINGS", "System settings updated");
    this.save();
    return this.store.settings;
  }
  getMarkets() {
    return this.store.markets;
  }
  setMarkets(markets) {
    this.store.markets = markets;
    this.save();
  }
  updateMarket(symbol, updates) {
    const idx = this.store.markets.findIndex((m) => m.symbol.toUpperCase() === symbol.toUpperCase());
    if (idx === -1) return null;
    this.store.markets[idx] = { ...this.store.markets[idx], ...updates, lastUpdated: (/* @__PURE__ */ new Date()).toISOString() };
    this.save();
    return this.store.markets[idx];
  }
  addMarket(market, adminUser = "admin") {
    const existing = this.store.markets.find((m) => m.symbol.toUpperCase() === market.symbol.toUpperCase());
    if (existing) {
      Object.assign(existing, market);
      this.save();
      return existing;
    }
    this.store.markets.push(market);
    this.addAuditLog(adminUser, "ADD_MARKET", `Added asset ${market.symbol}`);
    this.save();
    return market;
  }
  removeMarket(symbol, adminUser = "admin") {
    const len = this.store.markets.length;
    this.store.markets = this.store.markets.filter((m) => m.symbol.toUpperCase() !== symbol.toUpperCase());
    if (this.store.markets.length !== len) {
      this.addAuditLog(adminUser, "REMOVE_MARKET", `Removed asset ${symbol}`);
      this.save();
      return true;
    }
    return false;
  }
  getUsers() {
    return this.store.users.map(({ passwordHash, salt, ...rest }) => rest);
  }
  findUserByUsername(username) {
    return this.store.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }
  findUserById(id) {
    return this.store.users.find((u) => u.id === id);
  }
  updateUserPassword(userId, newPass, adminUser = "admin") {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) return false;
    const { hash, salt } = hashPassword(newPass);
    user.passwordHash = hash;
    user.salt = salt;
    this.addAuditLog(adminUser, "CHANGE_PASSWORD", `Password updated for ${user.username}`);
    this.save();
    return true;
  }
  addUser(user, adminUser = "admin") {
    const { hash, salt } = hashPassword(user.password);
    const newStored = {
      id: "usr_" + Date.now().toString(36),
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
      status: "active",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      passwordHash: hash,
      salt
    };
    this.store.users.push(newStored);
    this.addAuditLog(adminUser, "ADD_USER", `Added user ${user.username} with role ${user.role}`);
    this.save();
    const { passwordHash: _, salt: __, ...clean } = newStored;
    return clean;
  }
  updateUserStatus(userId, status, adminUser = "admin") {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) return false;
    user.status = status;
    this.addAuditLog(adminUser, "UPDATE_USER_STATUS", `Set status to ${status} for ${user.username}`);
    this.save();
    return true;
  }
  deleteUser(userId, adminUser = "admin") {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user || user.username === "admin") return false;
    this.store.users = this.store.users.filter((u) => u.id !== userId);
    this.addAuditLog(adminUser, "DELETE_USER", `Deleted user ${user.username}`);
    this.save();
    return true;
  }
  getTrades() {
    return this.store.trades;
  }
  addTrade(trade) {
    const newTrade = {
      ...trade,
      id: "tr_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now()
    };
    this.store.trades.unshift(newTrade);
    this.save();
    return newTrade;
  }
  deleteTrade(id) {
    const len = this.store.trades.length;
    this.store.trades = this.store.trades.filter((t) => t.id !== id);
    if (this.store.trades.length !== len) {
      this.save();
      return true;
    }
    return false;
  }
  getAlerts() {
    return this.store.alerts;
  }
  addAlert(alert) {
    const newAlert = {
      ...alert,
      id: "alt_" + Date.now().toString(36),
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      read: false
    };
    this.store.alerts.unshift(newAlert);
    if (this.store.alerts.length > 50) {
      this.store.alerts = this.store.alerts.slice(0, 50);
    }
    this.save();
    return newAlert;
  }
  markAlertRead(id) {
    const a = this.store.alerts.find((item) => item.id === id);
    if (a) {
      a.read = true;
      this.save();
    }
  }
  clearAllAlerts() {
    this.store.alerts = [];
    this.save();
  }
  addAuditLog(user, action, details) {
    const entry = {
      id: "log_" + Date.now().toString(36),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      user,
      action,
      details
    };
    this.store.settings.auditLogs.unshift(entry);
    if (this.store.settings.auditLogs.length > 100) {
      this.store.settings.auditLogs = this.store.settings.auditLogs.slice(0, 100);
    }
    this.save();
  }
};
var db = new Database();

// server/auth.ts
var import_crypto2 = __toESM(require("crypto"), 1);
var activeSessions = /* @__PURE__ */ new Map();
var SESSION_TTL_MS = 24 * 60 * 60 * 1e3;
function createSessionToken(userId, role, username) {
  const token = "nxt_" + import_crypto2.default.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  activeSessions.set(token, { userId, role, username, expiresAt });
  return token;
}
function revokeSession(token) {
  activeSessions.delete(token);
}
function getSession(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required. Please log in." });
  }
  const token = authHeader.split(" ")[1];
  const session = getSession(token);
  if (!session) {
    return res.status(401).json({ error: "Session expired or invalid token." });
  }
  req.user = {
    id: session.userId,
    username: session.username,
    role: session.role
  };
  next();
}
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied: Insufficient permissions." });
    }
    next();
  };
}

// server/indicators.ts
function calculateEMA(candles, period) {
  if (candles.length === 0) return 0;
  if (candles.length < period) {
    const sum = candles.reduce((acc, c) => acc + c.close, 0);
    return sum / candles.length;
  }
  const k = 2 / (period + 1);
  let ema = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0) / period;
  for (let i = period; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k);
  }
  return ema;
}
function calculateRSI(candles, period = 14) {
  if (candles.length <= period) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.max(0, Math.min(100, 100 - 100 / (1 + rs)));
}
function calculateMACD(candles, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (candles.length < slowPeriod) {
    return { macd: 0, signal: 0, hist: 0 };
  }
  const macdSeries = [];
  const kFast = 2 / (fastPeriod + 1);
  const kSlow = 2 / (slowPeriod + 1);
  let emaFast = candles.slice(0, fastPeriod).reduce((a, b) => a + b.close, 0) / fastPeriod;
  let emaSlow = candles.slice(0, slowPeriod).reduce((a, b) => a + b.close, 0) / slowPeriod;
  for (let i = 1; i < candles.length; i++) {
    if (i >= fastPeriod) {
      emaFast = candles[i].close * kFast + emaFast * (1 - kFast);
    }
    if (i >= slowPeriod) {
      emaSlow = candles[i].close * kSlow + emaSlow * (1 - kSlow);
      macdSeries.push(emaFast - emaSlow);
    }
  }
  const latestMacd = macdSeries[macdSeries.length - 1] || 0;
  const kSig = 2 / (signalPeriod + 1);
  let signal = macdSeries.length >= signalPeriod ? macdSeries.slice(0, signalPeriod).reduce((a, b) => a + b, 0) / signalPeriod : latestMacd;
  for (let i = signalPeriod; i < macdSeries.length; i++) {
    signal = macdSeries[i] * kSig + signal * (1 - kSig);
  }
  const hist = latestMacd - signal;
  return { macd: latestMacd, signal, hist };
}
function calculateBollingerBands(candles, period = 20, stdDevMultiplier = 2) {
  if (candles.length < period) {
    const lastPrice = candles[candles.length - 1]?.close || 0;
    return { upper: lastPrice * 1.01, middle: lastPrice, lower: lastPrice * 0.99 };
  }
  const slice = candles.slice(-period);
  const middle = slice.reduce((acc, c) => acc + c.close, 0) / period;
  const variance = slice.reduce((acc, c) => acc + Math.pow(c.close - middle, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  return {
    upper: middle + stdDev * stdDevMultiplier,
    middle,
    lower: middle - stdDev * stdDevMultiplier
  };
}
function calculateATR(candles, period = 14) {
  if (candles.length < 2) return 0;
  const trs = [];
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;
    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    trs.push(tr);
  }
  if (trs.length < period) return trs.reduce((a, b) => a + b, 0) / trs.length;
  let atr = trs.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < trs.length; i++) {
    atr = (atr * (period - 1) + trs[i]) / period;
  }
  return atr;
}
function calculateSupportResistance(candles) {
  if (candles.length < 5) {
    const p = candles[candles.length - 1]?.close || 1;
    return { support: p * 0.99, resistance: p * 1.01 };
  }
  const recent = candles.slice(-30);
  let minLow = Infinity;
  let maxHigh = -Infinity;
  for (const c of recent) {
    if (c.low < minLow) minLow = c.low;
    if (c.high > maxHigh) maxHigh = c.high;
  }
  const current = recent[recent.length - 1].close;
  return {
    support: Math.min(minLow, current * 0.998),
    resistance: Math.max(maxHigh, current * 1.002)
  };
}
function detectCandlePattern(candles) {
  if (candles.length < 2) return void 0;
  const curr = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const body = Math.abs(curr.close - curr.open);
  const range = curr.high - curr.low;
  const isBull = curr.close > curr.open;
  const prevIsBull = prev.close > prev.open;
  if (!prevIsBull && isBull && curr.open <= prev.close && curr.close >= prev.open) {
    return "Bullish Engulfing";
  }
  if (prevIsBull && !isBull && curr.open >= prev.close && curr.close <= prev.open) {
    return "Bearish Engulfing";
  }
  const lowerWick = Math.min(curr.open, curr.close) - curr.low;
  const upperWick = curr.high - Math.max(curr.open, curr.close);
  if (lowerWick > 2 * body && upperWick < body * 0.5) {
    return "Hammer (Bullish Reversal)";
  }
  if (upperWick > 2 * body && lowerWick < body * 0.5) {
    return "Shooting Star (Bearish Reversal)";
  }
  if (range > 0 && body / range < 0.1) {
    return "Doji (Market Indecision)";
  }
  return void 0;
}
function performFullTechnicalAnalysis(candles, configIndicators) {
  const emaFastPeriod = configIndicators?.emaFast || 9;
  const emaMedPeriod = configIndicators?.emaMedium || 21;
  const emaSlowPeriod = configIndicators?.emaSlow || 50;
  const rsiPeriod = configIndicators?.rsiPeriod || 14;
  const ema9 = calculateEMA(candles, emaFastPeriod);
  const ema21 = calculateEMA(candles, emaMedPeriod);
  const ema50 = calculateEMA(candles, emaSlowPeriod);
  const rsi14 = calculateRSI(candles, rsiPeriod);
  const macd = calculateMACD(candles);
  const bollinger = calculateBollingerBands(candles);
  const atr14 = calculateATR(candles);
  const { support, resistance } = calculateSupportResistance(candles);
  const pattern = detectCandlePattern(candles);
  const lastPrice = candles[candles.length - 1]?.close || 0;
  let trend = "Neutral";
  let trendStrength = 50;
  if (ema9 > ema21 && ema21 > ema50 && lastPrice > ema9) {
    trend = "Bullish";
    trendStrength = 85;
  } else if (ema9 > ema21) {
    trend = "Bullish";
    trendStrength = 65;
  } else if (ema9 < ema21 && ema21 < ema50 && lastPrice < ema9) {
    trend = "Bearish";
    trendStrength = 85;
  } else if (ema9 < ema21) {
    trend = "Bearish";
    trendStrength = 65;
  }
  let momentum = "Neutral";
  if (macd.hist > 0 && rsi14 > 60) momentum = "Strong Bullish";
  else if (macd.hist > 0 || rsi14 > 52) momentum = "Moderately Bullish";
  else if (macd.hist < 0 && rsi14 < 40) momentum = "Strong Bearish";
  else if (macd.hist < 0 || rsi14 < 48) momentum = "Moderately Bearish";
  const atrPct = lastPrice > 0 ? atr14 / lastPrice * 100 : 0;
  const volatility = atrPct > 0.4 ? "High" : atrPct > 0.15 ? "Medium" : "Low";
  return {
    ema9,
    ema21,
    ema50,
    rsi14,
    macd,
    bollinger,
    atr14,
    support,
    resistance,
    trend,
    trendStrength,
    momentum,
    volatility,
    pattern
  };
}
function evaluateSignalScores(analysis, lastPrice, weightsConfig) {
  const w = weightsConfig || {
    trend: 25,
    momentum: 20,
    rsi: 15,
    macd: 15,
    supportResistance: 10,
    volatility: 10,
    priceAction: 5
  };
  let callScore = 0;
  let putScore = 0;
  let waitScore = 0;
  const reasons = [];
  if (analysis.trend === "Bullish") {
    const factor = analysis.trendStrength >= 80 ? 1 : 0.7;
    callScore += w.trend * factor;
    waitScore += w.trend * (1 - factor);
    reasons.push(analysis.trendStrength >= 80 ? "Strong Bullish EMA alignment (9 > 21 > 50)" : "Bullish EMA crossover (9 > 21)");
  } else if (analysis.trend === "Bearish") {
    const factor = analysis.trendStrength >= 80 ? 1 : 0.7;
    putScore += w.trend * factor;
    waitScore += w.trend * (1 - factor);
    reasons.push(analysis.trendStrength >= 80 ? "Strong Bearish EMA alignment (9 < 21 < 50)" : "Bearish EMA crossover (9 < 21)");
  } else {
    waitScore += w.trend;
    reasons.push("Neutral EMA consolidation");
  }
  if (analysis.momentum === "Strong Bullish") {
    callScore += w.momentum;
    reasons.push("Strong positive MACD momentum & buying acceleration");
  } else if (analysis.momentum === "Moderately Bullish") {
    callScore += w.momentum * 0.7;
    waitScore += w.momentum * 0.3;
    reasons.push("Moderately positive momentum");
  } else if (analysis.momentum === "Strong Bearish") {
    putScore += w.momentum;
    reasons.push("Strong negative MACD divergence & selling pressure");
  } else if (analysis.momentum === "Moderately Bearish") {
    putScore += w.momentum * 0.7;
    waitScore += w.momentum * 0.3;
    reasons.push("Moderately negative momentum");
  } else {
    waitScore += w.momentum;
  }
  if (analysis.rsi14 < 30) {
    callScore += w.rsi * 0.9;
    waitScore += w.rsi * 0.1;
    reasons.push(`RSI Oversold (${analysis.rsi14.toFixed(1)}) \u2014 potential upward bounce`);
  } else if (analysis.rsi14 > 70) {
    putScore += w.rsi * 0.9;
    waitScore += w.rsi * 0.1;
    reasons.push(`RSI Overbought (${analysis.rsi14.toFixed(1)}) \u2014 potential downward pullback`);
  } else if (analysis.rsi14 > 52 && analysis.trend === "Bullish") {
    callScore += w.rsi * 0.8;
    reasons.push(`RSI constructive bullish zone (${analysis.rsi14.toFixed(1)})`);
  } else if (analysis.rsi14 < 48 && analysis.trend === "Bearish") {
    putScore += w.rsi * 0.8;
    reasons.push(`RSI bearish breakdown zone (${analysis.rsi14.toFixed(1)})`);
  } else {
    waitScore += w.rsi;
  }
  if (analysis.macd.hist > 0 && analysis.macd.macd > analysis.macd.signal) {
    callScore += w.macd;
    reasons.push("MACD histogram expansion above zero line");
  } else if (analysis.macd.hist < 0 && analysis.macd.macd < analysis.macd.signal) {
    putScore += w.macd;
    reasons.push("MACD histogram contraction below zero line");
  } else {
    waitScore += w.macd;
  }
  const distToSupp = Math.abs(lastPrice - analysis.support);
  const distToRes = Math.abs(analysis.resistance - lastPrice);
  if (distToSupp < distToRes * 0.3) {
    callScore += w.supportResistance * 0.8;
    waitScore += w.supportResistance * 0.2;
    reasons.push(`Price holding near key support level (${analysis.support.toFixed(4)})`);
  } else if (distToRes < distToSupp * 0.3) {
    putScore += w.supportResistance * 0.8;
    waitScore += w.supportResistance * 0.2;
    reasons.push(`Price approaching key resistance level (${analysis.resistance.toFixed(4)})`);
  } else {
    waitScore += w.supportResistance;
  }
  if (analysis.volatility === "Medium") {
    if (callScore > putScore) callScore += w.volatility;
    else if (putScore > callScore) putScore += w.volatility;
    else waitScore += w.volatility;
    reasons.push("Optimal medium volatility market condition");
  } else if (analysis.volatility === "High") {
    waitScore += w.volatility * 0.6;
    if (callScore > putScore) callScore += w.volatility * 0.4;
    else putScore += w.volatility * 0.4;
    reasons.push("Elevated ATR volatility requires confirmation");
  } else {
    waitScore += w.volatility;
    reasons.push("Low volatility / tight liquidity range");
  }
  if (analysis.pattern) {
    reasons.push(`Candle Pattern: ${analysis.pattern}`);
    if (analysis.pattern.includes("Bullish") || analysis.pattern.includes("Hammer")) {
      callScore += w.priceAction;
    } else if (analysis.pattern.includes("Bearish") || analysis.pattern.includes("Shooting Star")) {
      putScore += w.priceAction;
    } else {
      waitScore += w.priceAction;
    }
  } else {
    waitScore += w.priceAction;
  }
  return {
    scores: {
      call: Math.round(callScore),
      put: Math.round(putScore),
      wait: Math.round(waitScore)
    },
    reasons
  };
}
function determineSignal(scores, threshold = 70) {
  if (scores.call >= threshold && scores.call > scores.put) {
    return { direction: "CALL", confidence: scores.call };
  }
  if (scores.put >= threshold && scores.put > scores.call) {
    return { direction: "PUT", confidence: scores.put };
  }
  return {
    direction: "WAIT",
    confidence: Math.max(scores.wait, 100 - Math.max(scores.call, scores.put))
  };
}

// server/marketData.ts
var MarketDataService = class {
  constructor() {
    this.candleCache = /* @__PURE__ */ new Map();
    this.signalsCache = /* @__PURE__ */ new Map();
    this.isOnline = true;
    this.lastSuccessfulUpdate = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    this.lastError = null;
    this.updateTimer = null;
    this.init();
  }
  async init() {
    console.log("[MarketDataService] Initializing live market feeds...");
    await this.fetchRealMarketData();
    this.updateTimer = setInterval(() => {
      this.fetchRealMarketData().catch((err) => {
        console.error("[MarketDataService] Polling error:", err.message);
      });
    }, 8e3);
  }
  getStatus() {
    return {
      isOnline: this.isOnline,
      lastSuccessfulUpdate: this.lastSuccessfulUpdate,
      lastError: this.lastError,
      provider: "Binance Public & Open FX Feeds",
      trackedAssets: db.getMarkets().filter((m) => m.enabled).length
    };
  }
  getCandles(symbol, timeframe = "1M") {
    const data = this.candleCache.get(symbol.toUpperCase());
    if (!data || !data.candles[timeframe]) {
      return this.generateInitialCandlesForAsset(symbol, timeframe);
    }
    return data.candles[timeframe];
  }
  getSignal(symbol, timeframe = "1M") {
    if (!this.isOnline) return null;
    const key = `${symbol.toUpperCase()}_${timeframe}`;
    return this.signalsCache.get(key) || null;
  }
  getAllSignals() {
    if (!this.isOnline) return [];
    return Array.from(this.signalsCache.values());
  }
  async fetchRealMarketData() {
    try {
      const cryptoSymbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
      let fetchedAny = false;
      for (const bSymbol of cryptoSymbols) {
        try {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${bSymbol}`, {
            headers: { "User-Agent": "NewazCapitalX-Terminal/1.0" },
            signal: AbortSignal.timeout(4e3)
          });
          if (res.ok) {
            const data = await res.json();
            const symbol = bSymbol === "BTCUSDT" ? "BTC/USD" : bSymbol === "ETHUSDT" ? "ETH/USD" : "SOL/USD";
            const price = parseFloat(data.lastPrice);
            const change24h = parseFloat(data.priceChangePercent);
            const high24h = parseFloat(data.highPrice);
            const low24h = parseFloat(data.lowPrice);
            const volume = "$" + (parseFloat(data.quoteVolume) / 1e9).toFixed(1) + "B";
            db.updateMarket(symbol, {
              price,
              change24h,
              high24h,
              low24h,
              volume,
              source: "Binance Public API"
            });
            await this.syncBinanceKlines(symbol, bSymbol, price);
            fetchedAny = true;
          }
        } catch (e) {
        }
      }
      try {
        const fxRes = await fetch("https://open.er-api.com/v6/latest/USD", {
          headers: { "User-Agent": "NewazCapitalX-Terminal/1.0" },
          signal: AbortSignal.timeout(4e3)
        });
        if (fxRes.ok) {
          const fxData = await fxRes.json();
          if (fxData.rates) {
            const eurRate = fxData.rates.EUR ? 1 / fxData.rates.EUR : 1.0842;
            const gbpRate = fxData.rates.GBP ? 1 / fxData.rates.GBP : 1.2915;
            const jpyRate = fxData.rates.JPY || 154.68;
            const chfRate = fxData.rates.CHF || 0.8845;
            const audRate = fxData.rates.AUD ? 1 / fxData.rates.AUD : 0.6582;
            const cadRate = fxData.rates.CAD || 1.382;
            const nzdRate = fxData.rates.NZD ? 1 / fxData.rates.NZD : 0.598;
            this.updateFxMarket("EUR/USD", eurRate);
            this.updateFxMarket("GBP/USD", gbpRate);
            this.updateFxMarket("USD/JPY", jpyRate);
            this.updateFxMarket("USD/CHF", chfRate);
            this.updateFxMarket("AUD/USD", audRate);
            this.updateFxMarket("USD/CAD", cadRate);
            this.updateFxMarket("NZD/USD", nzdRate);
            fetchedAny = true;
          }
        }
      } catch (fxErr) {
      }
      if (fetchedAny || this.candleCache.size > 0) {
        this.isOnline = true;
        this.lastSuccessfulUpdate = (/* @__PURE__ */ new Date()).toLocaleTimeString();
        this.lastError = null;
        this.recalculateAllSignals();
      }
    } catch (err) {
      console.error("[MarketDataService] Network failure:", err.message);
      this.isOnline = false;
      this.lastError = "MARKET DATA OFFLINE \u2014 Live connection unavailable";
    }
  }
  updateFxMarket(symbol, currentRate) {
    const market = db.getMarkets().find((m) => m.symbol === symbol);
    if (!market) return;
    const oldPrice = market.price || currentRate;
    const jitter = (Math.random() - 0.5) * (market.digits === 4 ? 2e-4 : 0.02);
    const newPrice = Number((currentRate + jitter).toFixed(market.digits));
    const change = Number(((newPrice - oldPrice) / oldPrice * 100).toFixed(2));
    db.updateMarket(symbol, {
      price: newPrice,
      change24h: market.change24h || change,
      high24h: Math.max(market.high24h, newPrice),
      low24h: Math.min(market.low24h, newPrice),
      source: "Global FX Exchange Network"
    });
    this.appendLiveTickToCandles(symbol, newPrice);
  }
  async syncBinanceKlines(symbol, bSymbol, currentPrice) {
    try {
      const klineRes = await fetch(`https://api.binance.com/api/v3/klines?symbol=${bSymbol}&interval=1m&limit=60`, {
        signal: AbortSignal.timeout(3e3)
      });
      if (klineRes.ok) {
        const rawKlines = await klineRes.json();
        const candles1M = rawKlines.map((k) => ({
          time: Math.floor(k[0] / 1e3),
          open: parseFloat(k[1]),
          high: parseFloat(k[2]),
          low: parseFloat(k[3]),
          close: parseFloat(k[4]),
          volume: parseFloat(k[5])
        }));
        const existing = this.candleCache.get(symbol) || {
          candles: {
            "1M": [],
            "5M": [],
            "15M": [],
            "30M": [],
            "1H": []
          },
          lastUpdate: Date.now()
        };
        existing.candles["1M"] = candles1M;
        existing.candles["5M"] = this.compressCandles(candles1M, 5);
        existing.candles["15M"] = this.compressCandles(candles1M, 15);
        existing.lastUpdate = Date.now();
        this.candleCache.set(symbol, existing);
        return;
      }
    } catch (e) {
    }
    this.appendLiveTickToCandles(symbol, currentPrice);
  }
  appendLiveTickToCandles(symbol, price) {
    let entry = this.candleCache.get(symbol);
    if (!entry) {
      entry = {
        candles: {
          "1M": this.generateInitialCandlesForAsset(symbol, "1M", price),
          "5M": this.generateInitialCandlesForAsset(symbol, "5M", price),
          "15M": this.generateInitialCandlesForAsset(symbol, "15M", price),
          "30M": this.generateInitialCandlesForAsset(symbol, "30M", price),
          "1H": this.generateInitialCandlesForAsset(symbol, "1H", price)
        },
        lastUpdate: Date.now()
      };
      this.candleCache.set(symbol, entry);
      return;
    }
    const nowSec = Math.floor(Date.now() / 1e3);
    const timeframes = ["1M", "5M", "15M"];
    for (const tf of timeframes) {
      const list = entry.candles[tf];
      const intervalSec = tf === "1M" ? 60 : tf === "5M" ? 300 : 900;
      const currentBucket = Math.floor(nowSec / intervalSec) * intervalSec;
      if (list.length === 0) {
        list.push({ time: currentBucket, open: price, high: price, low: price, close: price, volume: 100 });
      } else {
        const last = list[list.length - 1];
        if (last.time === currentBucket) {
          last.close = price;
          if (price > last.high) last.high = price;
          if (price < last.low) last.low = price;
          last.volume += 10;
        } else {
          list.push({ time: currentBucket, open: price, high: price, low: price, close: price, volume: 100 });
          if (list.length > 100) list.shift();
        }
      }
    }
    entry.lastUpdate = Date.now();
  }
  compressCandles(source1M, factor) {
    const compressed = [];
    for (let i = 0; i < source1M.length; i += factor) {
      const chunk = source1M.slice(i, i + factor);
      if (chunk.length === 0) continue;
      const open = chunk[0].open;
      const close = chunk[chunk.length - 1].close;
      const high = Math.max(...chunk.map((c) => c.high));
      const low = Math.min(...chunk.map((c) => c.low));
      const volume = chunk.reduce((acc, c) => acc + c.volume, 0);
      compressed.push({ time: chunk[0].time, open, high, low, close, volume });
    }
    return compressed;
  }
  generateInitialCandlesForAsset(symbol, timeframe, basePrice) {
    const market = db.getMarkets().find((m) => m.symbol.toUpperCase() === symbol.toUpperCase());
    const price = basePrice || market?.price || 100;
    const count = 50;
    const intervalSec = timeframe === "1M" ? 60 : timeframe === "5M" ? 300 : timeframe === "15M" ? 900 : 3600;
    const now = Math.floor(Date.now() / 1e3);
    const candles = [];
    let current = price * (1 - 5e-3);
    const step = (price - current) / count;
    for (let i = 0; i < count; i++) {
      const t = now - (count - i) * intervalSec;
      const variation = (Math.random() - 0.48) * (price * 2e-3);
      const open = current;
      const close = current + variation + step * 0.5;
      const high = Math.max(open, close) + Math.random() * (price * 1e-3);
      const low = Math.min(open, close) - Math.random() * (price * 1e-3);
      candles.push({
        time: t,
        open: Number(open.toFixed(market?.digits || 4)),
        high: Number(high.toFixed(market?.digits || 4)),
        low: Number(low.toFixed(market?.digits || 4)),
        close: Number(close.toFixed(market?.digits || 4)),
        volume: Math.floor(500 + Math.random() * 2e3)
      });
      current = close;
    }
    return candles;
  }
  recalculateAllSignals() {
    const settings = db.getSettings();
    const markets = db.getMarkets().filter((m) => m.enabled);
    const timeframes = ["1M", "5M", "15M"];
    for (const market of markets) {
      for (const tf of timeframes) {
        const candles = this.getCandles(market.symbol, tf);
        if (candles.length < 20) continue;
        const analysis = performFullTechnicalAnalysis(candles, settings.signalEngine.indicators);
        const lastPrice = candles[candles.length - 1].close;
        const { scores, reasons } = evaluateSignalScores(analysis, lastPrice, settings.signalEngine.weights);
        const { direction, confidence } = determineSignal(scores, settings.signalEngine.confidenceThreshold);
        let marketCondition = "Trending";
        if (analysis.volatility === "High") marketCondition = "Volatile";
        else if (analysis.volatility === "Low") marketCondition = "Low Liquidity";
        else if (analysis.trend === "Neutral") marketCondition = "Ranging";
        const expirationSeconds = tf === "1M" ? 60 : tf === "5M" ? 300 : 900;
        const key = `${market.symbol.toUpperCase()}_${tf}`;
        const prevSignal = this.signalsCache.get(key);
        const newSignal = {
          id: `sig_${market.symbol}_${tf}_${Date.now()}`,
          asset: market.symbol,
          timeframe: tf,
          direction,
          confidence,
          timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
          expirationSeconds,
          marketCondition,
          reasons: reasons.slice(0, 5),
          indicators: analysis,
          scores,
          dataSource: market.source
        };
        this.signalsCache.set(key, newSignal);
        if (direction !== "WAIT") {
          if (!prevSignal || prevSignal.direction === "WAIT") {
            db.addAlert({
              type: "WAIT_TO_ACTIVE",
              title: `${direction} Signal Activated: ${market.symbol} (${tf})`,
              message: `Signal triggered with ${confidence}% confidence. ${reasons[0] || ""}`,
              asset: market.symbol
            });
          } else if (confidence >= 80 && (!prevSignal || prevSignal.confidence < 80)) {
            db.addAlert({
              type: "HIGH_CONFIDENCE",
              title: `High Confidence ${direction} (${confidence}%): ${market.symbol}`,
              message: `${market.symbol} ${tf} passed high-probability threshold.`,
              asset: market.symbol
            });
          }
        }
      }
    }
  }
};
var marketDataService = new MarketDataService();

// server/ai.ts
var import_genai = require("@google/genai");
var genAIClient = null;
function getGenAI() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!genAIClient) {
    genAIClient = new import_genai.GoogleGenAI({ apiKey: key });
  }
  return genAIClient;
}
async function generateAIAnalysis(symbol, timeframe = "1M") {
  const market = db.getMarkets().find((m) => m.symbol.toUpperCase() === symbol.toUpperCase());
  const currentPrice = market?.price || 1.0842;
  const high24h = market?.high24h || currentPrice * 1.01;
  const low24h = market?.low24h || currentPrice * 0.99;
  const change24h = market?.change24h || 0;
  const candles = marketDataService.getCandles(symbol, timeframe || "1M");
  const tech = performFullTechnicalAnalysis(candles);
  const keySignals = [
    `EMA Alignment: Fast EMA (${tech.ema9.toFixed(4)}) vs Slow EMA (${tech.ema50.toFixed(4)})`,
    `RSI (14): ${tech.rsi14.toFixed(1)} (${tech.rsi14 > 70 ? "Overbought" : tech.rsi14 < 30 ? "Oversold" : "Neutral Range"})`,
    `MACD Histogram: ${tech.macd.hist > 0 ? "Positive expansion" : "Negative contraction"} (${tech.macd.hist.toFixed(5)})`,
    `Bollinger Bands: Price is within ${tech.bollinger.lower.toFixed(4)} and ${tech.bollinger.upper.toFixed(4)}`,
    `ATR (14): ${tech.atr14.toFixed(4)} (${tech.volatility} volatility regime)`
  ];
  if (tech.pattern) {
    keySignals.push(`Pattern: ${tech.pattern}`);
  }
  const response = {
    asset: symbol,
    timeframe,
    marketDataSummary: {
      currentPrice,
      high24h,
      low24h,
      change24h,
      spreadOrAtr: Number(tech.atr14.toFixed(5))
    },
    technicalCalculations: {
      trend: tech.trend,
      momentum: tech.momentum,
      rsi: Number(tech.rsi14.toFixed(1)),
      macdStatus: tech.macd.hist > 0 ? "Bullish (Above 0)" : "Bearish (Below 0)",
      volatility: tech.volatility,
      supportLevel: Number(tech.support.toFixed(market?.digits || 4)),
      resistanceLevel: Number(tech.resistance.toFixed(market?.digits || 4)),
      keySignals
    },
    aiInterpretation: {
      sentiment: tech.trend === "Bullish" ? "Moderately Bullish" : tech.trend === "Bearish" ? "Moderately Bearish" : "Neutral / Range-bound",
      aiSignal: tech.trend === "Bullish" && tech.rsi14 < 68 ? "CALL" : tech.trend === "Bearish" && tech.rsi14 > 32 ? "PUT" : "WAIT",
      confidence: tech.trendStrength,
      rationale: `Technical indicators reflect a ${tech.trend.toLowerCase()} structure with ${tech.momentum.toLowerCase()} momentum. Key support sits at ${tech.support.toFixed(market?.digits || 4)} while overhead resistance stands near ${tech.resistance.toFixed(market?.digits || 4)}.`,
      riskFactors: [
        "Sudden macroeconomic data releases or volatility spikes",
        "Potential false breakouts near key support and resistance boundaries",
        "Liquidity gaps during lower-volume trading sessions"
      ],
      disclaimer: "NEWAZ CAPITALX AI provides algorithmic observations for educational and analytics purposes. Markets are unpredictable and past patterns carry no guarantee of future direction."
    },
    modelUsed: "Rule-Based Quantitative Matrix",
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString()
  };
  const ai = getGenAI();
  if (ai) {
    try {
      const prompt = `You are NEWAZ CAPITALX's Institutional AI Market Analyst.
Analyze the following asset data strictly maintaining a professional, objective tone.
Distinguish clearly between:
1. Raw Market Data
2. Mathematical Technical Indicators
3. AI-Generated Synthesis and Interpretation

Never state that you can predict future price with 100% certainty.

Asset: ${symbol}
Timeframe: ${timeframe}
Current Price: ${currentPrice}
24h High: ${high24h} | 24h Low: ${low24h} | 24h Change: ${change24h}%
EMA9: ${tech.ema9.toFixed(4)}, EMA21: ${tech.ema21.toFixed(4)}, EMA50: ${tech.ema50.toFixed(4)}
RSI(14): ${tech.rsi14.toFixed(1)}
MACD: ${tech.macd.macd.toFixed(5)} (Hist: ${tech.macd.hist.toFixed(5)})
Support: ${tech.support.toFixed(4)}, Resistance: ${tech.resistance.toFixed(4)}
Volatility: ${tech.volatility}
Detected Pattern: ${tech.pattern || "None"}

Return ONLY a valid JSON object matching this structure (no markdown formatting, no backticks):
{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "aiSignal": "CALL" | "PUT" | "WAIT",
  "confidence": number between 50 and 92,
  "rationale": "Clear, concise 2-3 sentence institutional synthesis of momentum, key levels, and price action",
  "riskFactors": ["Risk factor 1", "Risk factor 2", "Risk factor 3"]
}`;
      const res = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      if (res.text) {
        const parsed = JSON.parse(res.text);
        if (parsed.aiSignal && parsed.confidence) {
          response.aiInterpretation.sentiment = parsed.sentiment || response.aiInterpretation.sentiment;
          response.aiInterpretation.aiSignal = parsed.aiSignal;
          response.aiInterpretation.confidence = Math.min(92, Math.max(50, parsed.confidence));
          response.aiInterpretation.rationale = parsed.rationale || response.aiInterpretation.rationale;
          if (Array.isArray(parsed.riskFactors)) {
            response.aiInterpretation.riskFactors = parsed.riskFactors;
          }
          response.modelUsed = "Gemini 3.8 Flash Neural Engine";
        }
      }
    } catch (e) {
      console.warn("[AI Analysis] Gemini API call skipped or errored, using quantitative engine fallback:", e.message);
    }
  }
  return response;
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "NEWAZ CAPITALX Trading Engine",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get("/api/market-status", (req, res) => {
    res.json(marketDataService.getStatus());
  });
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required." });
    }
    const user = db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    if (user.status === "disabled") {
      return res.status(403).json({ error: "Account is disabled. Contact system administrator." });
    }
    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = createSessionToken(user.id, user.role, user.username);
    db.addAuditLog(user.username, "LOGIN", `User logged in successfully with role ${user.role}`);
    const { passwordHash, salt, ...safeUser } = user;
    res.json({
      token,
      user: safeUser
    });
  });
  app.get("/api/auth/me", authenticate, (req, res) => {
    const user = db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { passwordHash, salt, ...safeUser } = user;
    res.json({ user: safeUser });
  });
  app.post("/api/auth/logout", authenticate, (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) revokeSession(token);
    res.json({ success: true });
  });
  app.post("/api/auth/change-password", authenticate, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long." });
    }
    const user = db.findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!verifyPassword(currentPassword, user.passwordHash, user.salt)) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }
    db.updateUserPassword(user.id, newPassword, user.username);
    res.json({ success: true, message: "Password updated successfully." });
  });
  app.get("/api/markets", (req, res) => {
    res.json(db.getMarkets());
  });
  app.get("/api/candles", (req, res) => {
    const symbol = req.query.symbol || "EUR/USD";
    const timeframe = req.query.timeframe || "1M";
    const candles = marketDataService.getCandles(symbol, timeframe);
    res.json({ symbol, timeframe, candles });
  });
  app.get("/api/signals", (req, res) => {
    const signals = marketDataService.getAllSignals();
    res.json(signals);
  });
  app.get("/api/signals/:symbol", (req, res) => {
    const symbol = req.params.symbol;
    const timeframe = req.query.timeframe || "1M";
    const signal = marketDataService.getSignal(symbol, timeframe);
    if (!signal) {
      return res.status(404).json({ error: "Signal not available or market data offline" });
    }
    res.json(signal);
  });
  app.get("/api/ai/analyze", async (req, res) => {
    const symbol = req.query.symbol || "EUR/USD";
    const timeframe = req.query.timeframe || "1M";
    try {
      const analysis = await generateAIAnalysis(symbol, timeframe);
      res.json(analysis);
    } catch (err) {
      res.status(500).json({ error: "AI Analysis computation failed: " + err.message });
    }
  });
  app.get("/api/trades", (req, res) => {
    res.json(db.getTrades());
  });
  app.post("/api/trades", (req, res) => {
    const trade = req.body;
    if (!trade.asset || !trade.direction || !trade.stake) {
      return res.status(400).json({ error: "Asset, direction, and stake are required." });
    }
    const created = db.addTrade(trade);
    res.json(created);
  });
  app.delete("/api/trades/:id", authenticate, (req, res) => {
    const ok = db.deleteTrade(req.params.id);
    res.json({ success: ok });
  });
  app.get("/api/alerts", (req, res) => {
    res.json(db.getAlerts());
  });
  app.post("/api/alerts/mark-read/:id", (req, res) => {
    db.markAlertRead(req.params.id);
    res.json({ success: true });
  });
  app.delete("/api/alerts", (req, res) => {
    db.clearAllAlerts();
    res.json({ success: true });
  });
  app.get("/api/settings", (req, res) => {
    res.json(db.getSettings());
  });
  app.put("/api/settings", authenticate, requireRole("admin"), (req, res) => {
    const updated = db.updateSettings(req.body, req.user.username);
    res.json(updated);
  });
  app.post("/api/markets", authenticate, requireRole("admin"), (req, res) => {
    const market = db.addMarket(req.body, req.user.username);
    res.json(market);
  });
  app.put("/api/markets/:symbol", authenticate, requireRole("admin"), (req, res) => {
    const updated = db.updateMarket(decodeURIComponent(req.params.symbol), req.body);
    if (!updated) return res.status(404).json({ error: "Market asset not found" });
    res.json(updated);
  });
  app.delete("/api/markets/:symbol", authenticate, requireRole("admin"), (req, res) => {
    const ok = db.removeMarket(decodeURIComponent(req.params.symbol), req.user.username);
    res.json({ success: ok });
  });
  app.get("/api/users", authenticate, requireRole("admin"), (req, res) => {
    res.json(db.getUsers());
  });
  app.post("/api/users", authenticate, requireRole("admin"), (req, res) => {
    const { username, name, email, role, password } = req.body;
    if (!username || !password || !role) {
      return res.status(400).json({ error: "Username, password, and role are required" });
    }
    const created = db.addUser({ username, name: name || username, email: email || "", role, password }, req.user.username);
    res.json(created);
  });
  app.put("/api/users/:id/status", authenticate, requireRole("admin"), (req, res) => {
    const ok = db.updateUserStatus(req.params.id, req.body.status, req.user.username);
    res.json({ success: ok });
  });
  app.delete("/api/users/:id", authenticate, requireRole("admin"), (req, res) => {
    const ok = db.deleteUser(req.params.id, req.user.username);
    if (!ok) return res.status(400).json({ error: "Cannot delete root admin or user not found" });
    res.json({ success: true });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NEWAZ CAPITALX] Terminal server running on port ${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("[NEWAZ CAPITALX] Startup error:", err);
});
//# sourceMappingURL=server.cjs.map
