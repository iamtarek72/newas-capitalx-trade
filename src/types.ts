export type AssetCategory = 'forex' | 'crypto' | 'indices' | 'stocks';

export type Timeframe = '1M' | '5M' | '15M' | '30M' | '1H';

export type SignalDirection = 'CALL' | 'PUT' | 'WAIT';

export type MarketCondition = 'Trending' | 'Ranging' | 'Volatile' | 'Low Liquidity';

export type TradeResult = 'WIN' | 'LOSS' | 'DRAW' | 'CANCELLED';

export type UserRole = 'admin' | 'staff' | 'user';

export interface MarketAsset {
  symbol: string;
  name: string;
  category: AssetCategory;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  enabled: boolean;
  digits: number;
  source: string;
  lastUpdated: string;
}

export interface Candle {
  time: number; // Unix timestamp in seconds or ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalAnalysis {
  ema9: number;
  ema21: number;
  ema50: number;
  rsi14: number;
  macd: {
    macd: number;
    signal: number;
    hist: number;
  };
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
  atr14: number;
  support: number;
  resistance: number;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  trendStrength: number; // 0-100
  momentum: 'Strong Bullish' | 'Moderately Bullish' | 'Neutral' | 'Moderately Bearish' | 'Strong Bearish';
  volatility: 'Low' | 'Medium' | 'High';
  pattern?: string;
}

export interface SignalScores {
  call: number;
  put: number;
  wait: number;
}

export interface LiveSignal {
  id: string;
  asset: string;
  timeframe: Timeframe;
  direction: SignalDirection;
  confidence: number; // e.g. 78%
  timestamp: string;
  expirationSeconds: number;
  marketCondition: MarketCondition;
  reasons: string[];
  indicators: TechnicalAnalysis;
  scores: SignalScores;
  dataSource: string;
}

export interface MoneyManagementConfig {
  initialCapital: number;
  currentBalance: number;
  riskPerTradePercent: number;
  maxRiskPerSessionPercent: number;
  totalPlannedTrades: number;
  targetWins: number;
  payoutRatioPercent: number;
  maxConsecutiveLosses: number;
  dailyLossLimitPercent: number;
  dailyProfitTargetPercent: number;
  mode: 'fixed' | 'percent' | 'progressive' | 'recovery';
  compounding: boolean;
  fixedAmount: number;
  maxStakeCap: number;
}

export interface MoneyManagementSession {
  startingBalance: number;
  currentBalance: number;
  currentTradeNumber: number;
  suggestedStake: number;
  maxAllowedStake: number;
  winTarget: number;
  lossLimit: number;
  remainingTrades: number;
  winCount: number;
  lossCount: number;
  drawCount: number;
  consecutiveLosses: number;
  netProfit: number;
  profitPercent: number;
  winRate: number;
  lossRate: number;
  sessionProgress: number; // 0-100%
  isPaused: boolean;
  pauseReason: string | null;
}

export interface TradeRecord {
  id: string;
  date: string;
  time: string;
  asset: string;
  direction: SignalDirection;
  timeframe: Timeframe;
  entryPrice: number;
  exitPrice: number;
  stake: number;
  result: TradeResult;
  pnl: number;
  confidence: number;
  reason: string;
  dataSource: string;
  notes?: string;
  createdAt: number;
}

export interface PerformanceStats {
  winRate: number;
  lossRate: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  drawTrades: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  bestSession: number;
  worstSession: number;
  dailyPL: number;
  weeklyPL: number;
  monthlyPL: number;
  netTotal: number;
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  type: 'CALL' | 'PUT' | 'WAIT_TO_ACTIVE' | 'HIGH_CONFIDENCE' | 'RISK_LIMIT' | 'SESSION_COMPLETE' | 'DATA_OFFLINE';
  title: string;
  message: string;
  asset?: string;
  read: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email: string;
  createdAt: string;
  status: 'active' | 'disabled';
}

export interface SystemSettings {
  general: {
    websiteName: string;
    tagline: string;
    contactEmail: string;
    supportTelegram: string;
    footerText: string;
    disclaimer: string;
    aboutText: string;
  };
  theme: {
    primaryAccent: string; // e.g. #00f090
    secondaryAccent: string; // e.g. #00d2ff
    background: string;
    panelBackground: string;
    borderStyle: string;
  };
  signalEngine: {
    confidenceThreshold: number; // default 70
    signalCooldownSeconds: number;
    weights: {
      trend: number;
      momentum: number;
      rsi: number;
      macd: number;
      supportResistance: number;
      volatility: number;
      priceAction: number;
    };
    indicators: {
      emaFast: number;
      emaMedium: number;
      emaSlow: number;
      rsiPeriod: number;
      rsiOverbought: number;
      rsiOversold: number;
      macdFast: number;
      macdSlow: number;
      macdSignal: number;
      bollingerPeriod: number;
      bollingerStdDev: number;
      atrPeriod: number;
    };
  };
  moneyManagement: MoneyManagementConfig;
  content: {
    heroHeadline: string;
    heroSubheadline: string;
    faqList: Array<{ question: string; answer: string }>;
    signalDisclaimerNotice: string;
  };
  integrations: {
    binancePublic: { enabled: boolean; status: 'CONNECTED' | 'NOT CONNECTED'; latencyMs: number };
    forexData: { enabled: boolean; status: 'CONNECTED' | 'NOT CONNECTED'; latencyMs: number };
    brokerApi: { enabled: boolean; status: 'CONNECTED' | 'NOT CONNECTED'; name: string };
    websocket: { enabled: boolean; status: 'CONNECTED' | 'NOT CONNECTED' };
  };
  auditLogs: Array<{
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
  }>;
}

export interface AIAnalysisResponse {
  asset: string;
  timeframe: string;
  marketDataSummary: {
    currentPrice: number;
    high24h: number;
    low24h: number;
    change24h: number;
    spreadOrAtr: number;
  };
  technicalCalculations: {
    trend: string;
    momentum: string;
    rsi: number;
    macdStatus: string;
    volatility: string;
    supportLevel: number;
    resistanceLevel: number;
    keySignals: string[];
  };
  aiInterpretation: {
    sentiment: string;
    aiSignal: SignalDirection;
    confidence: number;
    rationale: string;
    riskFactors: string[];
    disclaimer: string;
  };
  modelUsed: string;
  timestamp: string;
}
