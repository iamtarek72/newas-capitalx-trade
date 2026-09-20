import {
  SystemSettings,
  MarketAsset,
  LiveSignal,
  AlertNotification,
  TradeRecord,
  Timeframe,
  Candle,
  TechnicalAnalysis
} from '../types.js';

export const DEFAULT_SETTINGS: SystemSettings = {
  general: {
    websiteName: 'NEWAZ CAPITALX',
    tagline: 'AI Market Intelligence • Signal Analytics • Smart Money Management',
    contactEmail: 'support@newazcapitalx.io',
    supportTelegram: 'https://t.me/newazcapitalx_official',
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
      action: 'SYSTEM_BOOT',
      user: 'SYSTEM',
      details: 'Terminal initialized in client high-availability mode.',
    },
  ],
};

export const DEFAULT_MARKETS: MarketAsset[] = [
  // Forex
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', price: 1.0842, change24h: 0.28, high24h: 1.0875, low24h: 1.0812, volume: '$4.2B', enabled: true, digits: 4, source: 'Forex Real-time Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex', price: 1.2915, change24h: -0.14, high24h: 1.2960, low24h: 1.2885, volume: '$2.8B', enabled: true, digits: 4, source: 'Forex Real-time Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex', price: 154.68, change24h: 0.45, high24h: 155.10, low24h: 154.20, volume: '$3.5B', enabled: true, digits: 2, source: 'Forex Real-time Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex', price: 0.8845, change24h: -0.08, high24h: 0.8870, low24h: 0.8820, volume: '$1.4B', enabled: true, digits: 4, source: 'Forex Real-time Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'forex', price: 0.6582, change24h: 0.32, high24h: 0.6610, low24h: 0.6550, volume: '$1.9B', enabled: true, digits: 4, source: 'Forex Real-time Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'forex', price: 1.3820, change24h: -0.18, high24h: 1.3860, low24h: 1.3790, volume: '$1.6B', enabled: true, digits: 4, source: 'Forex Real-time Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'forex', price: 0.5980, change24h: 0.15, high24h: 0.6010, low24h: 0.5950, volume: '$950M', enabled: true, digits: 4, source: 'Forex Real-time Feed', lastUpdated: new Date().toISOString() },

  // Crypto
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto', price: 68420.00, change24h: 2.45, high24h: 69200.00, low24h: 66800.00, volume: '$32.4B', enabled: true, digits: 2, source: 'Binance Public Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'crypto', price: 3510.50, change24h: 1.82, high24h: 3580.00, low24h: 3440.00, volume: '$18.2B', enabled: true, digits: 2, source: 'Binance Public Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'crypto', price: 178.40, change24h: 4.15, high24h: 182.50, low24h: 169.80, volume: '$5.6B', enabled: true, digits: 2, source: 'Binance Public Feed', lastUpdated: new Date().toISOString() },

  // Indices
  { symbol: 'NASDAQ', name: 'Nasdaq 100 Index', category: 'indices', price: 18450.25, change24h: 0.72, high24h: 18510.00, low24h: 18320.00, volume: '$14.2B', enabled: true, digits: 2, source: 'Global Markets Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'S&P 500', name: 'S&P 500 Index', category: 'indices', price: 5460.80, change24h: 0.48, high24h: 5480.00, low24h: 5430.00, volume: '$19.8B', enabled: true, digits: 2, source: 'Global Markets Feed', lastUpdated: new Date().toISOString() },
  { symbol: 'DOW JONES', name: 'Dow Jones Industrial Average', category: 'indices', price: 39820.50, change24h: 0.31, high24h: 39950.00, low24h: 39680.00, volume: '$11.5B', enabled: true, digits: 2, source: 'Global Markets Feed', lastUpdated: new Date().toISOString() },
];

export function generateDefaultSignals(markets: MarketAsset[] = DEFAULT_MARKETS): LiveSignal[] {
  const timeframes: Timeframe[] = ['1M', '5M', '15M', '30M', '1H'];
  const signals: LiveSignal[] = [];

  markets.forEach(m => {
    timeframes.forEach(tf => {
      const isBull = m.change24h > 0.2;
      const isBear = m.change24h < -0.2;
      const dir = isBull ? 'CALL' : isBear ? 'PUT' : 'WAIT';
      const confidence = isBull ? 78 : isBear ? 74 : 62;

      const p = m.price;
      const spread = p * 0.004;

      const indicators: TechnicalAnalysis = {
        ema9: p * (isBull ? 1.001 : 0.999),
        ema21: p * (isBull ? 0.999 : 1.001),
        ema50: p * (isBull ? 0.997 : 1.003),
        rsi14: isBull ? 61.4 : isBear ? 38.2 : 50.1,
        macd: {
          macd: isBull ? spread * 0.4 : -spread * 0.4,
          signal: isBull ? spread * 0.2 : -spread * 0.2,
          hist: isBull ? spread * 0.2 : -spread * 0.2,
        },
        bollinger: {
          upper: p + spread * 1.5,
          middle: p,
          lower: p - spread * 1.5,
        },
        atr14: spread * 0.8,
        support: p - spread * 1.2,
        resistance: p + spread * 1.2,
        trend: isBull ? 'Bullish' : isBear ? 'Bearish' : 'Neutral',
        trendStrength: isBull || isBear ? 72 : 45,
        momentum: isBull ? 'Strong Bullish' : isBear ? 'Strong Bearish' : 'Neutral',
        volatility: m.category === 'crypto' ? 'High' : 'Medium',
      };

      signals.push({
        id: `sig_${m.symbol}_${tf}`,
        asset: m.symbol,
        timeframe: tf,
        direction: dir,
        confidence,
        timestamp: new Date().toLocaleTimeString(),
        expirationSeconds: tf === '1M' ? 60 : tf === '5M' ? 300 : 900,
        marketCondition: isBull || isBear ? 'Trending' : 'Ranging',
        reasons: isBull
          ? ['EMA 9/21 bullish alignment', 'RSI above 55 momentum boundary', 'MACD positive expansion']
          : isBear
          ? ['EMA 9 crossed below EMA 21', 'RSI descending with seller pressure', 'MACD histogram in bearish territory']
          : ['Price trapped within consolidation boundary', 'EMA 9 and 21 converging flatly', 'Awaiting directional breakout'],
        indicators,
        scores: {
          call: isBull ? 68 : 22,
          put: isBear ? 66 : 24,
          wait: !isBull && !isBear ? 54 : 10,
        },
        dataSource: m.source,
      });
    });
  });

  return signals;
}

export const DEFAULT_ALERTS: AlertNotification[] = [
  {
    id: 'alt_1',
    timestamp: new Date().toLocaleTimeString(),
    type: 'HIGH_CONFIDENCE',
    title: 'High Confidence Signal',
    asset: 'EUR/USD',
    message: 'High-confidence convergence signal detected for EUR/USD (CALL 78% on 1M).',
    read: false,
  },
  {
    id: 'alt_2',
    timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
    type: 'RISK_LIMIT',
    title: 'Risk Safeguard Armed',
    asset: 'SYSTEM',
    message: 'Dynamic Money Management safeguards active: Circuit breaker limit armed at 3 consecutive losses.',
    read: false,
  },
  {
    id: 'alt_3',
    timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
    type: 'CALL',
    title: 'Market Volatility Surge',
    asset: 'BTC/USD',
    message: 'Bitcoin / US Dollar volatility expansion detected (+2.45% intraday range).',
    read: true,
  },
];

export const DEFAULT_TRADES: TradeRecord[] = [
  {
    id: 'trd_101',
    date: new Date().toISOString().split('T')[0],
    time: '09:42:15',
    asset: 'EUR/USD',
    direction: 'CALL',
    timeframe: '1M',
    entryPrice: 1.0841,
    exitPrice: 1.0845,
    stake: 20,
    result: 'WIN',
    pnl: 17.00,
    confidence: 78,
    reason: 'EMA Bullish Convergence',
    dataSource: 'Live Feed',
    createdAt: Date.now() - 600000,
  },
  {
    id: 'trd_102',
    date: new Date().toISOString().split('T')[0],
    time: '09:35:00',
    asset: 'GBP/USD',
    direction: 'PUT',
    timeframe: '5M',
    entryPrice: 1.2918,
    exitPrice: 1.2912,
    stake: 20,
    result: 'WIN',
    pnl: 17.00,
    confidence: 74,
    reason: 'MACD Bearish Histogram Divergence',
    dataSource: 'Live Feed',
    createdAt: Date.now() - 1200000,
  },
  {
    id: 'trd_103',
    date: new Date().toISOString().split('T')[0],
    time: '09:12:40',
    asset: 'BTC/USD',
    direction: 'CALL',
    timeframe: '1M',
    entryPrice: 68350.00,
    exitPrice: 68320.00,
    stake: 20,
    result: 'LOSS',
    pnl: -20.00,
    confidence: 71,
    reason: 'Temporary volatility sweep',
    dataSource: 'Binance Public Feed',
    createdAt: Date.now() - 2400000,
  },
];

export function generateMockCandles(symbol: string, timeframe: Timeframe, basePrice: number = 1.084, count: number = 60): Candle[] {
  const candles: Candle[] = [];
  const now = Date.now();
  const tfSeconds = timeframe === '1M' ? 60 : timeframe === '5M' ? 300 : timeframe === '15M' ? 900 : timeframe === '30M' ? 1800 : 3600;

  const volatility = symbol.includes('BTC') ? 120 : symbol.includes('ETH') ? 8 : symbol.includes('JPY') ? 0.15 : 0.0004;

  let currentClose = basePrice;

  for (let i = count - 1; i >= 0; i--) {
    const time = Math.floor((now - i * tfSeconds * 1000) / 1000);
    const noise = (Math.random() - 0.49) * volatility * 2;
    const open = currentClose;
    const close = open + noise;
    const high = Math.max(open, close) + Math.random() * volatility * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * 0.8;
    const volume = Math.floor(Math.random() * 450 + 120);

    candles.push({
      time,
      open: Number(open.toFixed(basePrice < 2 ? 5 : 2)),
      high: Number(high.toFixed(basePrice < 2 ? 5 : 2)),
      low: Number(low.toFixed(basePrice < 2 ? 5 : 2)),
      close: Number(close.toFixed(basePrice < 2 ? 5 : 2)),
      volume,
    });

    currentClose = close;
  }

  return candles;
}

export function generateMockAIAnalysis(symbol: string, timeframe: Timeframe, market?: MarketAsset, signal?: LiveSignal | null) {
  const price = market?.price || 1.0842;
  const change = market?.change24h || 0.25;
  const isBullish = change > 0;
  const direction = signal?.direction || (isBullish ? 'CALL' : 'PUT');
  const confidence = signal?.confidence || (isBullish ? 76 : 72);

  return {
    symbol,
    timeframe,
    timestamp: new Date().toLocaleTimeString(),
    direction,
    confidence,
    summary: `Algorithmic analysis for ${symbol} across the ${timeframe} timeframe reflects a ${isBullish ? 'bullish continuation' : 'bearish pressure'} structure. Price is currently interacting with the key moving average cluster with institutional momentum aligned toward ${direction}.`,
    technicalDrivers: [
      `EMA 9/21 Ribbon: ${isBullish ? 'Golden configuration with positive separation' : 'Death cross pressure with descending slope'}`,
      `Relative Strength Index (RSI 14): Currently hovering at ${isBullish ? '58.4 (constructive bull regime)' : '42.1 (seller dominant)'}`,
      `Volatility Framework: ATR indicates normal liquidity distribution with low tail-risk probability`,
      `Order Book Liquidity: Resting bids concentrated near ${(price * 0.998).toFixed(market?.digits || 4)} support zone`,
    ],
    riskAssessment: {
      regime: isBullish ? 'Favorable Trend Following' : 'Counter-Trend Pullback',
      recommendedMaxRiskPercent: 2,
      warning: 'Ensure compliance with the session maximum consecutive loss cap before executing entry.',
    },
    institutionalTargets: {
      entryLevel: price,
      invalidationLevel: Number((isBullish ? price * 0.996 : price * 1.004).toFixed(market?.digits || 4)),
      takeProfitLevel: Number((isBullish ? price * 1.005 : price * 0.995).toFixed(market?.digits || 4)),
    },
  };
}
