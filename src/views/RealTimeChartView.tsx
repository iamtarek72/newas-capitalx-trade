import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext.js';
import {
  Candle,
  Timeframe,
  TechnicalAnalysis,
  SignalDirection,
} from '../types.js';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  Layers,
  Activity,
  Maximize2,
  Calendar,
} from 'lucide-react';

export const RealTimeChartView: React.FC = () => {
  const { selectedAsset, selectedTimeframe, setSelectedTimeframe, currentSignal, markets } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [candles, setCandles] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(true);

  // Overlays & Panes toggles
  const [showEMA9, setShowEMA9] = useState(true);
  const [showEMA21, setShowEMA21] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);
  const [showSupportResistance, setShowSupportResistance] = useState(true);
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Crosshair state
  const [hoverData, setHoverData] = useState<{
    x: number;
    y: number;
    price: number;
    time: string;
    candle?: Candle;
  } | null>(null);

  const currentMarket = markets.find(m => m.symbol === selectedAsset);

  // Fetch candles
  const fetchCandles = useCallback(async () => {
    try {
      const res = await fetch(`/api/candles?symbol=${encodeURIComponent(selectedAsset)}&timeframe=${selectedTimeframe}`);
      if (res.ok) {
        const data = await res.json();
        if (data.candles && data.candles.length > 0) {
          setCandles(data.candles);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedAsset, selectedTimeframe]);

  useEffect(() => {
    setLoading(true);
    fetchCandles();
    const interval = setInterval(fetchCandles, 3000);
    return () => clearInterval(interval);
  }, [fetchCandles]);

  // Render HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Layout partitioning:
    // Sub-pane heights:
    let rsiHeight = showRSI ? 80 : 0;
    let macdHeight = showMACD ? 80 : 0;
    const paddingBottom = 25;
    const paddingRight = 65; // Price axis
    const mainChartHeight = height - rsiHeight - macdHeight - paddingBottom;

    // Clear canvas
    ctx.fillStyle = '#0b0e14';
    ctx.fillRect(0, 0, width, height);

    // Visible candles slice according to zoom
    const maxVisible = Math.max(15, Math.floor(45 / zoomLevel));
    const visibleCandles = candles.slice(-maxVisible);
    const n = visibleCandles.length;
    if (n === 0) return;

    // Price scaling
    let minPrice = Math.min(...visibleCandles.map(c => c.low));
    let maxPrice = Math.max(...visibleCandles.map(c => c.high));
    const pricePadding = (maxPrice - minPrice) * 0.1 || 0.001;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;

    const chartWidth = width - paddingRight;
    const candleSlot = chartWidth / n;
    const candleWidth = Math.max(2, candleSlot * 0.65);

    const priceToY = (p: number) => {
      return mainChartHeight - ((p - minPrice) / priceRange) * mainChartHeight;
    };

    // 1. Draw Background Grid
    ctx.strokeStyle = '#181d29';
    ctx.lineWidth = 1;
    const gridRows = 5;
    for (let i = 0; i <= gridRows; i++) {
      const y = (mainChartHeight / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price label on right axis
      const p = maxPrice - (i / gridRows) * priceRange;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(p.toFixed(currentMarket?.digits || 4), chartWidth + 6, y + 3);
    }

    // 2. Bollinger Bands Overlay
    if (showBollinger && visibleCandles.length >= 20) {
      const upperCoords: { x: number; y: number }[] = [];
      const lowerCoords: { x: number; y: number }[] = [];

      for (let i = 0; i < n; i++) {
        const fullIdx = candles.length - n + i;
        if (fullIdx < 19) continue;
        const slice = candles.slice(fullIdx - 19, fullIdx + 1);
        const mean = slice.reduce((a, b) => a + b.close, 0) / 20;
        const variance = slice.reduce((a, b) => a + Math.pow(b.close - mean, 2), 0) / 20;
        const sd = Math.sqrt(variance);
        const x = i * candleSlot + candleSlot / 2;
        upperCoords.push({ x, y: priceToY(mean + sd * 2) });
        lowerCoords.push({ x, y: priceToY(mean - sd * 2) });
      }

      if (upperCoords.length > 1) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
        ctx.beginPath();
        ctx.moveTo(upperCoords[0].x, upperCoords[0].y);
        for (const pt of upperCoords) ctx.lineTo(pt.x, pt.y);
        for (let i = lowerCoords.length - 1; i >= 0; i--) ctx.lineTo(lowerCoords[i].x, lowerCoords[i].y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // 3. Support & Resistance lines
    if (showSupportResistance && currentSignal?.indicators) {
      const supp = currentSignal.indicators.support;
      const res = currentSignal.indicators.resistance;

      // Resistance line
      const resY = priceToY(res);
      if (resY > 0 && resY < mainChartHeight) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, resY);
        ctx.lineTo(chartWidth, resY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`RES ${res.toFixed(currentMarket?.digits || 4)}`, chartWidth + 6, resY + 3);
      }

      // Support line
      const suppY = priceToY(supp);
      if (suppY > 0 && suppY < mainChartHeight) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(0, suppY);
        ctx.lineTo(chartWidth, suppY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#10b981';
        ctx.fillText(`SUP ${supp.toFixed(currentMarket?.digits || 4)}`, chartWidth + 6, suppY + 3);
      }
    }

    // 4. Draw EMAs
    const drawEMA = (period: number, color: string) => {
      const k = 2 / (period + 1);
      let ema = candles.slice(0, Math.min(period, candles.length)).reduce((a, b) => a + b.close, 0) / Math.min(period, candles.length);
      const allEMAs: number[] = [];

      for (let i = 0; i < candles.length; i++) {
        ema = candles[i].close * k + ema * (1 - k);
        allEMAs.push(ema);
      }

      const visibleEMAs = allEMAs.slice(-n);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      for (let i = 0; i < n; i++) {
        const x = i * candleSlot + candleSlot / 2;
        const y = priceToY(visibleEMAs[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    if (showEMA9) drawEMA(9, '#00f090'); // Electric green
    if (showEMA21) drawEMA(21, '#00d2ff'); // Cyan
    if (showEMA50) drawEMA(50, '#a855f7'); // Purple

    // 5. Draw Candlesticks & Volume
    const maxVolume = Math.max(...visibleCandles.map(c => c.volume || 1), 10);

    for (let i = 0; i < n; i++) {
      const c = visibleCandles[i];
      const isUp = c.close >= c.open;
      const color = isUp ? '#10b981' : '#ef4444';
      const x = i * candleSlot + candleSlot / 2;

      // Volume bar at bottom of main chart
      const volHeight = Math.min(40, (c.volume / maxVolume) * 40);
      ctx.fillStyle = isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(x - candleWidth / 2, mainChartHeight - volHeight, candleWidth, volHeight);

      // Candlestick Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, priceToY(c.high));
      ctx.lineTo(x, priceToY(c.low));
      ctx.stroke();

      // Candlestick Body
      const openY = priceToY(c.open);
      const closeY = priceToY(c.close);
      const top = Math.min(openY, closeY);
      const bodyH = Math.max(2, Math.abs(openY - closeY));

      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyH);

      // Time labels for every few candles
      if (i % Math.max(1, Math.floor(n / 6)) === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '9px JetBrains Mono';
        ctx.textAlign = 'center';
        const dateStr = new Date(c.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        ctx.fillText(dateStr, x, mainChartHeight + 14);
      }
    }

    // 6. Signal Markers on the latest candle
    if (currentSignal && currentSignal.direction !== 'WAIT' && n > 0) {
      const lastX = (n - 1) * candleSlot + candleSlot / 2;
      const lastCandle = visibleCandles[n - 1];

      if (currentSignal.direction === 'CALL') {
        const markerY = priceToY(lastCandle.low) + 16;
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(lastX, markerY - 8);
        ctx.lineTo(lastX - 6, markerY + 4);
        ctx.lineTo(lastX + 6, markerY + 4);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`CALL ${currentSignal.confidence}%`, lastX, markerY + 14);
      } else if (currentSignal.direction === 'PUT') {
        const markerY = priceToY(lastCandle.high) - 16;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(lastX, markerY + 8);
        ctx.lineTo(lastX - 6, markerY - 4);
        ctx.lineTo(lastX + 6, markerY - 4);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 9px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`PUT ${currentSignal.confidence}%`, lastX, markerY - 6);
      }
    }

    // 7. RSI Sub-pane
    let currentYOffset = mainChartHeight + paddingBottom;
    if (showRSI) {
      ctx.strokeStyle = '#1e2533';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, currentYOffset);
      ctx.lineTo(chartWidth, currentYOffset);
      ctx.stroke();

      // RSI Label & thresholds
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (14)', 8, currentYOffset + 14);

      const rsiTop = currentYOffset + 18;
      const rsiBot = currentYOffset + rsiHeight - 8;
      const rsiY70 = rsiTop + (rsiBot - rsiTop) * 0.3;
      const rsiY30 = rsiTop + (rsiBot - rsiTop) * 0.7;

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.strokeRect(0, rsiY70, chartWidth, 0.5);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.strokeRect(0, rsiY30, chartWidth, 0.5);

      ctx.fillStyle = '#ef4444';
      ctx.fillText('70', chartWidth + 6, rsiY70 + 3);
      ctx.fillStyle = '#10b981';
      ctx.fillText('30', chartWidth + 6, rsiY30 + 3);

      // Draw RSI line
      const rsiVal = currentSignal?.indicators?.rsi14 || 54;
      ctx.strokeStyle = '#00d2ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = i * candleSlot + candleSlot / 2;
        // Simulated smooth wave curve towards current RSI
        const val = 50 + (rsiVal - 50) * (i / n);
        const y = rsiBot - ((val / 100) * (rsiBot - rsiTop));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      currentYOffset += rsiHeight;
    }

    // 8. Crosshair overlay
    if (hoverData && hoverData.x < chartWidth && hoverData.y < mainChartHeight) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.setLineDash([2, 2]);
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hoverData.x, 0);
      ctx.lineTo(hoverData.x, height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, hoverData.y);
      ctx.lineTo(chartWidth, hoverData.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Floating price tag on right axis
      ctx.fillStyle = '#00f090';
      ctx.fillRect(chartWidth + 2, hoverData.y - 9, paddingRight - 4, 18);
      ctx.fillStyle = '#0b0e14';
      ctx.font = 'bold 10px JetBrains Mono';
      ctx.fillText(hoverData.price.toFixed(currentMarket?.digits || 4), chartWidth + 6, hoverData.y + 3);
    }
  }, [
    candles,
    zoomLevel,
    showEMA9,
    showEMA21,
    showEMA50,
    showBollinger,
    showSupportResistance,
    showRSI,
    showMACD,
    hoverData,
    currentSignal,
    currentMarket,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxVisible = Math.max(15, Math.floor(45 / zoomLevel));
    const visibleCandles = candles.slice(-maxVisible);
    const n = visibleCandles.length;
    const chartWidth = rect.width - 65;
    const candleSlot = chartWidth / n;

    const candleIdx = Math.min(n - 1, Math.max(0, Math.floor(x / candleSlot)));
    const targetCandle = visibleCandles[candleIdx];

    let minPrice = Math.min(...visibleCandles.map(c => c.low));
    let maxPrice = Math.max(...visibleCandles.map(c => c.high));
    const pricePadding = (maxPrice - minPrice) * 0.1 || 0.001;
    minPrice -= pricePadding;
    maxPrice += pricePadding;
    const priceRange = maxPrice - minPrice;
    const rsiH = showRSI ? 80 : 0;
    const macdH = showMACD ? 80 : 0;
    const mainH = rect.height - rsiH - macdH - 25;

    const calcPrice = maxPrice - (y / mainH) * priceRange;

    setHoverData({
      x,
      y,
      price: calcPrice,
      time: new Date(targetCandle.time * 1000).toLocaleTimeString(),
      candle: targetCandle,
    });
  };

  const handleMouseLeave = () => {
    setHoverData(null);
  };

  return (
    <div className="space-y-4">
      {/* Chart Top Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#121620] border border-slate-800">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold font-mono text-white">{selectedAsset}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300 font-mono">
                {selectedTimeframe}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Live Feed: <span className="text-white font-bold">{currentMarket?.price.toFixed(currentMarket.digits)}</span> •{' '}
              <span className={currentMarket && currentMarket.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {currentMarket && currentMarket.change24h >= 0 ? '+' : ''}{currentMarket?.change24h}%
              </span>
            </p>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-[#0b0e14] border border-slate-800 rounded-lg p-1">
            {(['1M', '5M', '15M', '30M', '1H'] as Timeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-mono font-bold rounded transition-colors ${
                  selectedTimeframe === tf
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Indicator Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowEMA9(!showEMA9)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              showEMA9
                ? 'bg-[#00f090]/10 border-[#00f090]/40 text-[#00f090] font-bold'
                : 'bg-[#141924] border-slate-800 text-slate-500'
            }`}
          >
            EMA 9
          </button>
          <button
            onClick={() => setShowEMA21(!showEMA21)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              showEMA21
                ? 'bg-[#00d2ff]/10 border-[#00d2ff]/40 text-[#00d2ff] font-bold'
                : 'bg-[#141924] border-slate-800 text-slate-500'
            }`}
          >
            EMA 21
          </button>
          <button
            onClick={() => setShowEMA50(!showEMA50)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              showEMA50
                ? 'bg-[#a855f7]/10 border-[#a855f7]/40 text-[#a855f7] font-bold'
                : 'bg-[#141924] border-slate-800 text-slate-500'
            }`}
          >
            EMA 50
          </button>
          <button
            onClick={() => setShowBollinger(!showBollinger)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              showBollinger
                ? 'bg-sky-500/10 border-sky-500/40 text-sky-400 font-bold'
                : 'bg-[#141924] border-slate-800 text-slate-500'
            }`}
          >
            BB (20,2)
          </button>
          <button
            onClick={() => setShowSupportResistance(!showSupportResistance)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              showSupportResistance
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                : 'bg-[#141924] border-slate-800 text-slate-500'
            }`}
          >
            S/R Levels
          </button>
          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
              showRSI
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 font-bold'
                : 'bg-[#141924] border-slate-800 text-slate-500'
            }`}
          >
            RSI
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#141924] border border-slate-800 rounded-lg p-1 ml-2">
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.25))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Candlestick Canvas Container */}
      <div className="relative w-full h-[520px] rounded-2xl bg-[#0b0e14] border border-slate-800 overflow-hidden shadow-2xl">
        {/* Floating Watermark */}
        <div className="absolute top-4 left-4 pointer-events-none z-10 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-extrabold text-white">{selectedAsset}</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-semibold">{currentMarket?.source || 'Exchange Feed'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
          </div>

          {/* OHLC Bar when hovering */}
          {hoverData?.candle && (
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
              <span>O: <strong className="text-white">{hoverData.candle.open}</strong></span>
              <span>H: <strong className="text-white">{hoverData.candle.high}</strong></span>
              <span>L: <strong className="text-white">{hoverData.candle.low}</strong></span>
              <span>C: <strong className="text-white">{hoverData.candle.close}</strong></span>
              <span>Vol: <strong className="text-cyan-400">{hoverData.candle.volume}</strong></span>
            </div>
          )}
        </div>

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full cursor-crosshair block"
        />

        {loading && (
          <div className="absolute inset-0 bg-[#0b0e14]/80 flex items-center justify-center text-xs text-slate-400">
            <Activity className="w-5 h-5 text-emerald-400 animate-spin mr-2" />
            Loading real-time candlestick matrix...
          </div>
        )}
      </div>

      {/* Real-time Indicator Legend */}
      <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-[#121620] border border-slate-800 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f090]" />
            <span>EMA 9: {(currentSignal?.indicators?.ema9 || 0).toFixed(currentMarket?.digits || 4)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00d2ff]" />
            <span>EMA 21: {(currentSignal?.indicators?.ema21 || 0).toFixed(currentMarket?.digits || 4)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
            <span>EMA 50: {(currentSignal?.indicators?.ema50 || 0).toFixed(currentMarket?.digits || 4)}</span>
          </span>
        </div>

        <div>
          <span>Data Provider: <strong className="text-slate-200">{currentMarket?.source || 'Public Feed'}</strong></span>
        </div>
      </div>
    </div>
  );
};
