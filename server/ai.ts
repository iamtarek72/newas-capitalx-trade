import { GoogleGenAI } from '@google/genai';
import { AIAnalysisResponse, SignalDirection } from '../src/types.js';
import { marketDataService } from './marketData.js';
import { performFullTechnicalAnalysis } from './indicators.js';
import { db } from './db.js';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: key });
  }
  return genAIClient;
}

export async function generateAIAnalysis(
  symbol: string,
  timeframe: string = '1M'
): Promise<AIAnalysisResponse> {
  const market = db.getMarkets().find(m => m.symbol.toUpperCase() === symbol.toUpperCase());
  const currentPrice = market?.price || 1.0842;
  const high24h = market?.high24h || currentPrice * 1.01;
  const low24h = market?.low24h || currentPrice * 0.99;
  const change24h = market?.change24h || 0;

  const candles = marketDataService.getCandles(symbol, (timeframe as any) || '1M');
  const tech = performFullTechnicalAnalysis(candles);

  const keySignals: string[] = [
    `EMA Alignment: Fast EMA (${tech.ema9.toFixed(4)}) vs Slow EMA (${tech.ema50.toFixed(4)})`,
    `RSI (14): ${tech.rsi14.toFixed(1)} (${tech.rsi14 > 70 ? 'Overbought' : tech.rsi14 < 30 ? 'Oversold' : 'Neutral Range'})`,
    `MACD Histogram: ${tech.macd.hist > 0 ? 'Positive expansion' : 'Negative contraction'} (${tech.macd.hist.toFixed(5)})`,
    `Bollinger Bands: Price is within ${tech.bollinger.lower.toFixed(4)} and ${tech.bollinger.upper.toFixed(4)}`,
    `ATR (14): ${tech.atr14.toFixed(4)} (${tech.volatility} volatility regime)`,
  ];

  if (tech.pattern) {
    keySignals.push(`Pattern: ${tech.pattern}`);
  }

  // Base AI Response structure
  const response: AIAnalysisResponse = {
    asset: symbol,
    timeframe,
    marketDataSummary: {
      currentPrice,
      high24h,
      low24h,
      change24h,
      spreadOrAtr: Number(tech.atr14.toFixed(5)),
    },
    technicalCalculations: {
      trend: tech.trend,
      momentum: tech.momentum,
      rsi: Number(tech.rsi14.toFixed(1)),
      macdStatus: tech.macd.hist > 0 ? 'Bullish (Above 0)' : 'Bearish (Below 0)',
      volatility: tech.volatility,
      supportLevel: Number(tech.support.toFixed(market?.digits || 4)),
      resistanceLevel: Number(tech.resistance.toFixed(market?.digits || 4)),
      keySignals,
    },
    aiInterpretation: {
      sentiment: tech.trend === 'Bullish' ? 'Moderately Bullish' : tech.trend === 'Bearish' ? 'Moderately Bearish' : 'Neutral / Range-bound',
      aiSignal: (tech.trend === 'Bullish' && tech.rsi14 < 68 ? 'CALL' : tech.trend === 'Bearish' && tech.rsi14 > 32 ? 'PUT' : 'WAIT') as SignalDirection,
      confidence: tech.trendStrength,
      rationale: `Technical indicators reflect a ${tech.trend.toLowerCase()} structure with ${tech.momentum.toLowerCase()} momentum. Key support sits at ${tech.support.toFixed(market?.digits || 4)} while overhead resistance stands near ${tech.resistance.toFixed(market?.digits || 4)}.`,
      riskFactors: [
        'Sudden macroeconomic data releases or volatility spikes',
        'Potential false breakouts near key support and resistance boundaries',
        'Liquidity gaps during lower-volume trading sessions',
      ],
      disclaimer: 'NEWAZ CAPITALX AI provides algorithmic observations for educational and analytics purposes. Markets are unpredictable and past patterns carry no guarantee of future direction.',
    },
    modelUsed: 'Rule-Based Quantitative Matrix',
    timestamp: new Date().toLocaleTimeString(),
  };

  // Attempt live Gemini 3.8 Flash query if GEMINI_API_KEY is configured
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
Detected Pattern: ${tech.pattern || 'None'}

Return ONLY a valid JSON object matching this structure (no markdown formatting, no backticks):
{
  "sentiment": "Bullish" | "Bearish" | "Neutral",
  "aiSignal": "CALL" | "PUT" | "WAIT",
  "confidence": number between 50 and 92,
  "rationale": "Clear, concise 2-3 sentence institutional synthesis of momentum, key levels, and price action",
  "riskFactors": ["Risk factor 1", "Risk factor 2", "Risk factor 3"]
}`;

      const res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
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
          response.modelUsed = 'Gemini 3.8 Flash Neural Engine';
        }
      }
    } catch (e: any) {
      console.warn('[AI Analysis] Gemini API call skipped or errored, using quantitative engine fallback:', e.message);
    }
  }

  return response;
}
