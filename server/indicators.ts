import { Candle, TechnicalAnalysis, SignalScores, SignalDirection } from '../src/types.js';

export function calculateEMA(candles: Candle[], period: number): number {
  if (candles.length === 0) return 0;
  if (candles.length < period) {
    const sum = candles.reduce((acc, c) => acc + c.close, 0);
    return sum / candles.length;
  }
  const k = 2 / (period + 1);
  // Initial SMA
  let ema = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0) / period;
  for (let i = period; i < candles.length; i++) {
    ema = candles[i].close * k + ema * (1 - k);
  }
  return ema;
}

export function calculateRSI(candles: Candle[], period: number = 14): number {
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

export function calculateMACD(
  candles: Candle[],
  fastPeriod = 12,
  slowPeriod = 26,
  signalPeriod = 9
): { macd: number; signal: number; hist: number } {
  if (candles.length < slowPeriod) {
    return { macd: 0, signal: 0, hist: 0 };
  }

  // Calculate MACD series for each point past slowPeriod
  const macdSeries: number[] = [];
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
  // Signal line of MACD series
  const kSig = 2 / (signalPeriod + 1);
  let signal = macdSeries.length >= signalPeriod
    ? macdSeries.slice(0, signalPeriod).reduce((a, b) => a + b, 0) / signalPeriod
    : latestMacd;

  for (let i = signalPeriod; i < macdSeries.length; i++) {
    signal = macdSeries[i] * kSig + signal * (1 - kSig);
  }

  const hist = latestMacd - signal;
  return { macd: latestMacd, signal, hist };
}

export function calculateBollingerBands(
  candles: Candle[],
  period = 20,
  stdDevMultiplier = 2
): { upper: number; middle: number; lower: number } {
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
    lower: middle - stdDev * stdDevMultiplier,
  };
}

export function calculateATR(candles: Candle[], period = 14): number {
  if (candles.length < 2) return 0;
  const trs: number[] = [];
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

export function calculateSupportResistance(candles: Candle[]): { support: number; resistance: number } {
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
  // If current is extreme, give buffer
  return {
    support: Math.min(minLow, current * 0.998),
    resistance: Math.max(maxHigh, current * 1.002),
  };
}

export function detectCandlePattern(candles: Candle[]): string | undefined {
  if (candles.length < 2) return undefined;
  const curr = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const body = Math.abs(curr.close - curr.open);
  const range = curr.high - curr.low;
  const isBull = curr.close > curr.open;
  const prevIsBull = prev.close > prev.open;

  // Bullish Engulfing
  if (!prevIsBull && isBull && curr.open <= prev.close && curr.close >= prev.open) {
    return 'Bullish Engulfing';
  }
  // Bearish Engulfing
  if (prevIsBull && !isBull && curr.open >= prev.close && curr.close <= prev.open) {
    return 'Bearish Engulfing';
  }
  // Hammer (small upper wick, long lower wick > 2x body)
  const lowerWick = Math.min(curr.open, curr.close) - curr.low;
  const upperWick = curr.high - Math.max(curr.open, curr.close);
  if (lowerWick > 2 * body && upperWick < body * 0.5) {
    return 'Hammer (Bullish Reversal)';
  }
  // Shooting Star
  if (upperWick > 2 * body && lowerWick < body * 0.5) {
    return 'Shooting Star (Bearish Reversal)';
  }
  // Doji
  if (range > 0 && body / range < 0.1) {
    return 'Doji (Market Indecision)';
  }

  return undefined;
}

export function performFullTechnicalAnalysis(
  candles: Candle[],
  configIndicators?: any
): TechnicalAnalysis {
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

  // Determine trend
  let trend: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
  let trendStrength = 50;
  if (ema9 > ema21 && ema21 > ema50 && lastPrice > ema9) {
    trend = 'Bullish';
    trendStrength = 85;
  } else if (ema9 > ema21) {
    trend = 'Bullish';
    trendStrength = 65;
  } else if (ema9 < ema21 && ema21 < ema50 && lastPrice < ema9) {
    trend = 'Bearish';
    trendStrength = 85;
  } else if (ema9 < ema21) {
    trend = 'Bearish';
    trendStrength = 65;
  }

  // Momentum
  let momentum: 'Strong Bullish' | 'Moderately Bullish' | 'Neutral' | 'Moderately Bearish' | 'Strong Bearish' = 'Neutral';
  if (macd.hist > 0 && rsi14 > 60) momentum = 'Strong Bullish';
  else if (macd.hist > 0 || rsi14 > 52) momentum = 'Moderately Bullish';
  else if (macd.hist < 0 && rsi14 < 40) momentum = 'Strong Bearish';
  else if (macd.hist < 0 || rsi14 < 48) momentum = 'Moderately Bearish';

  // Volatility based on ATR relative to price
  const atrPct = lastPrice > 0 ? (atr14 / lastPrice) * 100 : 0;
  const volatility: 'Low' | 'Medium' | 'High' = atrPct > 0.4 ? 'High' : atrPct > 0.15 ? 'Medium' : 'Low';

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
    pattern,
  };
}

export function evaluateSignalScores(
  analysis: TechnicalAnalysis,
  lastPrice: number,
  weightsConfig?: {
    trend: number;
    momentum: number;
    rsi: number;
    macd: number;
    supportResistance: number;
    volatility: number;
    priceAction: number;
  }
): { scores: SignalScores; reasons: string[] } {
  const w = weightsConfig || {
    trend: 25,
    momentum: 20,
    rsi: 15,
    macd: 15,
    supportResistance: 10,
    volatility: 10,
    priceAction: 5,
  };

  let callScore = 0;
  let putScore = 0;
  let waitScore = 0;
  const reasons: string[] = [];

  // 1. Trend (default 25%)
  if (analysis.trend === 'Bullish') {
    const factor = analysis.trendStrength >= 80 ? 1.0 : 0.7;
    callScore += w.trend * factor;
    waitScore += w.trend * (1 - factor);
    reasons.push(analysis.trendStrength >= 80 ? 'Strong Bullish EMA alignment (9 > 21 > 50)' : 'Bullish EMA crossover (9 > 21)');
  } else if (analysis.trend === 'Bearish') {
    const factor = analysis.trendStrength >= 80 ? 1.0 : 0.7;
    putScore += w.trend * factor;
    waitScore += w.trend * (1 - factor);
    reasons.push(analysis.trendStrength >= 80 ? 'Strong Bearish EMA alignment (9 < 21 < 50)' : 'Bearish EMA crossover (9 < 21)');
  } else {
    waitScore += w.trend;
    reasons.push('Neutral EMA consolidation');
  }

  // 2. Momentum (default 20%)
  if (analysis.momentum === 'Strong Bullish') {
    callScore += w.momentum;
    reasons.push('Strong positive MACD momentum & buying acceleration');
  } else if (analysis.momentum === 'Moderately Bullish') {
    callScore += w.momentum * 0.7;
    waitScore += w.momentum * 0.3;
    reasons.push('Moderately positive momentum');
  } else if (analysis.momentum === 'Strong Bearish') {
    putScore += w.momentum;
    reasons.push('Strong negative MACD divergence & selling pressure');
  } else if (analysis.momentum === 'Moderately Bearish') {
    putScore += w.momentum * 0.7;
    waitScore += w.momentum * 0.3;
    reasons.push('Moderately negative momentum');
  } else {
    waitScore += w.momentum;
  }

  // 3. RSI (default 15%)
  if (analysis.rsi14 < 30) {
    callScore += w.rsi * 0.9;
    waitScore += w.rsi * 0.1;
    reasons.push(`RSI Oversold (${analysis.rsi14.toFixed(1)}) — potential upward bounce`);
  } else if (analysis.rsi14 > 70) {
    putScore += w.rsi * 0.9;
    waitScore += w.rsi * 0.1;
    reasons.push(`RSI Overbought (${analysis.rsi14.toFixed(1)}) — potential downward pullback`);
  } else if (analysis.rsi14 > 52 && analysis.trend === 'Bullish') {
    callScore += w.rsi * 0.8;
    reasons.push(`RSI constructive bullish zone (${analysis.rsi14.toFixed(1)})`);
  } else if (analysis.rsi14 < 48 && analysis.trend === 'Bearish') {
    putScore += w.rsi * 0.8;
    reasons.push(`RSI bearish breakdown zone (${analysis.rsi14.toFixed(1)})`);
  } else {
    waitScore += w.rsi;
  }

  // 4. MACD (default 15%)
  if (analysis.macd.hist > 0 && analysis.macd.macd > analysis.macd.signal) {
    callScore += w.macd;
    reasons.push('MACD histogram expansion above zero line');
  } else if (analysis.macd.hist < 0 && analysis.macd.macd < analysis.macd.signal) {
    putScore += w.macd;
    reasons.push('MACD histogram contraction below zero line');
  } else {
    waitScore += w.macd;
  }

  // 5. Support & Resistance (default 10%)
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

  // 6. Volatility (default 10%)
  if (analysis.volatility === 'Medium') {
    // Favorable trading condition
    if (callScore > putScore) callScore += w.volatility;
    else if (putScore > callScore) putScore += w.volatility;
    else waitScore += w.volatility;
    reasons.push('Optimal medium volatility market condition');
  } else if (analysis.volatility === 'High') {
    waitScore += w.volatility * 0.6;
    if (callScore > putScore) callScore += w.volatility * 0.4;
    else putScore += w.volatility * 0.4;
    reasons.push('Elevated ATR volatility requires confirmation');
  } else {
    waitScore += w.volatility;
    reasons.push('Low volatility / tight liquidity range');
  }

  // 7. Price Action / Candle Pattern (default 5%)
  if (analysis.pattern) {
    reasons.push(`Candle Pattern: ${analysis.pattern}`);
    if (analysis.pattern.includes('Bullish') || analysis.pattern.includes('Hammer')) {
      callScore += w.priceAction;
    } else if (analysis.pattern.includes('Bearish') || analysis.pattern.includes('Shooting Star')) {
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
      wait: Math.round(waitScore),
    },
    reasons,
  };
}

export function determineSignal(
  scores: SignalScores,
  threshold: number = 70
): { direction: SignalDirection; confidence: number } {
  if (scores.call >= threshold && scores.call > scores.put) {
    return { direction: 'CALL', confidence: scores.call };
  }
  if (scores.put >= threshold && scores.put > scores.call) {
    return { direction: 'PUT', confidence: scores.put };
  }
  return {
    direction: 'WAIT',
    confidence: Math.max(scores.wait, 100 - Math.max(scores.call, scores.put)),
  };
}
