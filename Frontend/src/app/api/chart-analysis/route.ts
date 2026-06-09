import { NextResponse } from "next/server";

type BiasTone = "bullish" | "bearish" | "neutral";
type StrategyCode = "EWT_FIB" | "CTI" | "TRENDLINE_RETEST" | "SR_BREAKOUT";

type Candle = {
  time: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type AiLevel = {
  label: string;
  value: string;
  width: string;
  tone: string;
  bar: string;
};

type AiPlaybookItem = {
  label: string;
  value: string;
  iconTone: string;
};

type AiFibLevel = {
  label: string;
  value: string;
  ratio: number;
  width: string;
  tone: string;
};

type AiTrendOverlay = {
  direction: "ascending" | "descending" | "sideways";
  start: string;
  end: string;
  slope: string;
  strength: number;
};

type AiStrategyRecommendation = {
  code: StrategyCode;
  name: string;
  confidence: number;
  reason: string;
  trigger: string;
  invalidation: string;
  iconTone: string;
};

type ChartAiAnalysis = {
  symbol: string;
  pair: string;
  timeframe: string;
  bias: string;
  biasTone: BiasTone;
  confidence: number;
  trendline: string;
  invalidation: string;
  momentum: string;
  momentumMeta: string;
  note: string;
  levels: AiLevel[];
  fibLevels: AiFibLevel[];
  trendOverlay: AiTrendOverlay;
  strategy: AiStrategyRecommendation;
  playbook: AiPlaybookItem[];
};

const binanceKlineIntervals = new Set(["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const symbol = normalizeTradingViewSymbol(String(body.symbol ?? "BINANCE:ETHUSDT"));
    const pair = getPair(symbol);
    const interval = binanceKlineIntervals.has(String(body.interval)) ? String(body.interval) : "15m";
    const binancePair = toBinancePair(pair);
    const candles = await fetchBinanceCandles(binancePair, interval);
    const analysis = buildTechnicalAnalysis({ symbol, pair, interval, candles });
    const ollamaNote = await explainWithOllama(analysis, candles);

    return NextResponse.json({
      ...analysis,
      note: ollamaNote ?? analysis.note,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze chart";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function normalizeTradingViewSymbol(rawSymbol: string) {
  const cleanedSymbol = rawSymbol.trim().toUpperCase().replace(/\s+/g, "").replace(/\//g, "");

  if (!cleanedSymbol) {
    return "BINANCE:ETHUSDT";
  }

  if (cleanedSymbol.includes(":")) {
    return cleanedSymbol;
  }

  if (cleanedSymbol.endsWith("USD") && !cleanedSymbol.endsWith("USDT") && !cleanedSymbol.endsWith("USDC")) {
    return `CRYPTO:${cleanedSymbol}`;
  }

  return `BINANCE:${cleanedSymbol}`;
}

function getPair(symbol: string) {
  return symbol.includes(":") ? symbol.split(":").slice(1).join(":") : symbol;
}

function toBinancePair(pair: string) {
  if (pair.endsWith("USD") && !pair.endsWith("USDT") && !pair.endsWith("USDC")) {
    return `${pair.slice(0, -3)}USDT`;
  }

  return pair;
}

async function fetchBinanceCandles(pair: string, interval: string) {
  const url = new URL("https://api.binance.com/api/v3/klines");
  url.searchParams.set("symbol", pair);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", "160");

  const response = await fetch(url, { next: { revalidate: 30 } });

  if (!response.ok) {
    throw new Error(`No Binance candle data for ${pair}`);
  }

  const rows = await response.json();

  if (!Array.isArray(rows) || rows.length < 60) {
    throw new Error(`Not enough candle data for ${pair}`);
  }

  return rows.map((row) => ({
    time: Number(row[0]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
  })) as Candle[];
}

function buildTechnicalAnalysis({
  symbol,
  pair,
  interval,
  candles,
}: {
  symbol: string;
  pair: string;
  interval: string;
  candles: Candle[];
}): ChartAiAnalysis {
  const closes = candles.map((candle) => candle.close);
  const last = candles[candles.length - 1];
  const previous = candles[candles.length - 11] ?? candles[0];
  const sma20 = average(closes.slice(-20));
  const sma50 = average(closes.slice(-50));
  const rsi = calculateRsi(closes, 14);
  const change10 = ((last.close - previous.close) / previous.close) * 100;
  const volume20 = average(candles.slice(-20).map((candle) => candle.volume));
  const volumeRatio = volume20 > 0 ? last.volume / volume20 : 1;
  const levels = buildLevels(candles);
  const resistance = levels.find((level) => level.label === "Res 1")?.value ?? "resistance";
  const support = levels.find((level) => level.label === "Sup 1")?.value ?? "support";
  const isBullish = last.close > sma20 && sma20 >= sma50 && rsi >= 52 && change10 >= 0;
  const isBearish = last.close < sma20 && sma20 <= sma50 && rsi <= 48 && change10 <= 0;
  const biasTone: BiasTone = isBullish ? "bullish" : isBearish ? "bearish" : "neutral";
  const confidence = Math.min(91, Math.max(58, Math.round(62 + Math.abs(change10) * 1.8 + Math.abs(rsi - 50) * 0.7 + volumeRatio * 5)));
  const base = getBaseAsset(pair);
  const trendline = getTrendlineLabel({ isBullish, isBearish, sma20, sma50 });
  const momentum = change10 > 1 ? "Momentum Expanding" : change10 < -1 ? "Sell Pressure Active" : "Momentum Consolidating";
  const momentumMeta = `RSI ${Math.round(rsi)} | Volume ${volumeRatio.toFixed(2)}x avg`;
  const bias = biasTone === "bullish"
    ? `Bullish Above ${support}`
    : biasTone === "bearish"
      ? `Bearish Below ${resistance}`
      : `Neutral On ${base}`;
  const invalidation = biasTone === "bullish"
    ? `Invalid below ${support}`
    : biasTone === "bearish"
      ? `Invalid above ${resistance}`
      : `Breakout needed above ${resistance}`;
  const fibLevels = buildFibLevels(candles, biasTone);
  const trendOverlay = buildTrendOverlay(candles, biasTone);
  const strategy = chooseStrategy({
    biasTone,
    change10,
    confidence,
    pair,
    resistance,
    rsi,
    support,
    trendOverlay,
    volumeRatio,
  });

  return {
    symbol,
    pair,
    timeframe: interval,
    bias,
    biasTone,
    confidence,
    trendline,
    invalidation,
    momentum,
    momentumMeta,
    note: buildFallbackNote({ pair, biasTone, resistance, support, rsi, change10 }),
    levels,
    fibLevels,
    trendOverlay,
    strategy,
    playbook: buildPlaybook({ biasTone, resistance, support, pair, strategy }),
  };
}

function buildLevels(candles: Candle[]) {
  const recent = candles.slice(-80);
  const last = candles[candles.length - 1];
  const highs = recent.map((candle) => candle.high).filter((price) => price > last.close).sort((a, b) => a - b);
  const lows = recent.map((candle) => candle.low).filter((price) => price < last.close).sort((a, b) => b - a);
  const res1 = highs[0] ?? last.close * 1.015;
  const res2 = highs.find((price) => price > res1 * 1.004) ?? last.close * 1.035;
  const sup1 = lows[0] ?? last.close * 0.985;
  const sup2 = lows.find((price) => price < sup1 * 0.996) ?? last.close * 0.965;
  const min = sup2;
  const max = res2;
  const width = (price: number) => `${Math.round(((price - min) / (max - min || 1)) * 68 + 22)}%`;

  return [
    { label: "Res 2", value: formatPrice(res2), width: width(res2), tone: "text-rose-300", bar: "bg-rose-400" },
    { label: "Res 1", value: formatPrice(res1), width: width(res1), tone: "text-rose-300", bar: "bg-rose-400" },
    { label: "Price", value: formatPrice(last.close), width: width(last.close), tone: "text-emerald-300", bar: "bg-emerald-400" },
    { label: "Sup 1", value: formatPrice(sup1), width: width(sup1), tone: "text-cyan-300", bar: "bg-cyan-400" },
    { label: "Sup 2", value: formatPrice(sup2), width: width(sup2), tone: "text-cyan-300", bar: "bg-cyan-400" },
  ];
}

function buildFibLevels(candles: Candle[], biasTone: BiasTone): AiFibLevel[] {
  const swing = getSwingRange(candles);
  const ratios = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  const isBullishSwing = biasTone === "bullish" || (biasTone === "neutral" && swing.lowIndex < swing.highIndex);
  const low = swing.low;
  const high = swing.high;
  const range = high - low || high * 0.01 || 1;
  const width = (price: number) => `${Math.round(((price - low) / range) * 76 + 12)}%`;

  return ratios.map((ratio) => {
    const price = isBullishSwing ? high - range * ratio : low + range * ratio;
    const isGoldenPocket = ratio === 0.5 || ratio === 0.618;

    return {
      label: `${Math.round(ratio * 1000) / 10}%`,
      value: formatPrice(price),
      ratio,
      width: width(price),
      tone: isGoldenPocket ? "text-violet-300" : ratio < 0.5 ? "text-cyan-300" : "text-amber-300",
    };
  });
}

function buildTrendOverlay(candles: Candle[], biasTone: BiasTone): AiTrendOverlay {
  const recent = candles.slice(-48);
  const start = recent[0];
  const end = recent[recent.length - 1];
  const slopeValue = ((end.close - start.close) / start.close) * 100;
  const direction = Math.abs(slopeValue) < 0.35
    ? "sideways"
    : slopeValue > 0
      ? "ascending"
      : "descending";
  const biasBonus = (biasTone === "bullish" && direction === "ascending") || (biasTone === "bearish" && direction === "descending") ? 10 : 0;
  const strength = Math.min(94, Math.max(44, Math.round(Math.abs(slopeValue) * 8 + biasBonus + 50)));

  return {
    direction,
    start: formatPrice(start.close),
    end: formatPrice(end.close),
    slope: `${slopeValue >= 0 ? "+" : ""}${slopeValue.toFixed(2)}%`,
    strength,
  };
}

function chooseStrategy({
  biasTone,
  change10,
  confidence,
  pair,
  resistance,
  rsi,
  support,
  trendOverlay,
  volumeRatio,
}: {
  biasTone: BiasTone;
  change10: number;
  confidence: number;
  pair: string;
  resistance: string;
  rsi: number;
  support: string;
  trendOverlay: AiTrendOverlay;
  volumeRatio: number;
}): AiStrategyRecommendation {
  const hasDirectionalTrend = trendOverlay.direction !== "sideways";
  const hasExpansion = Math.abs(change10) >= 1.2 && volumeRatio >= 1.03;
  const isBalanced = Math.abs(change10) < 0.75 && rsi >= 43 && rsi <= 57;

  if (hasDirectionalTrend && hasExpansion && confidence >= 70) {
    return {
      code: "EWT_FIB",
      name: "EWT + Fibonacci",
      confidence: Math.min(94, confidence + 3),
      reason: `${pair} has directional expansion, ${trendOverlay.direction} structure, and enough volume for wave-and-retracement planning.`,
      trigger: biasTone === "bearish" ? `Sell continuation below ${support}` : `Buy pullback reaction above ${support}`,
      invalidation: biasTone === "bearish" ? `Invalid above ${resistance}` : `Invalid below ${support}`,
      iconTone: "bg-violet-300/10 text-violet-200",
    };
  }

  if (isBalanced) {
    return {
      code: "CTI",
      name: "CTI Rotation",
      confidence: Math.max(60, Math.min(88, confidence - 2)),
      reason: `${pair} is balanced with RSI near ${Math.round(rsi)} and low 10-candle displacement, so rotation signals fit better than wave chasing.`,
      trigger: `Fade extremes only near ${support} or ${resistance}`,
      invalidation: `Stop using CTI after a strong close outside the range`,
      iconTone: "bg-cyan-300/10 text-cyan-200",
    };
  }

  if (hasDirectionalTrend) {
    return {
      code: "TRENDLINE_RETEST",
      name: "Trendline Retest",
      confidence: Math.max(62, Math.min(90, confidence)),
      reason: `${pair} is still respecting a ${trendOverlay.direction} slope, but expansion is not strong enough for a full EWT read.`,
      trigger: biasTone === "bearish" ? `Reject trendline near ${resistance}` : `Hold trendline above ${support}`,
      invalidation: biasTone === "bearish" ? `Clean close above ${resistance}` : `Clean close below ${support}`,
      iconTone: "bg-amber-300/10 text-amber-200",
    };
  }

  return {
    code: "SR_BREAKOUT",
    name: "Support/Resistance Breakout",
    confidence: Math.max(58, Math.min(84, confidence - 4)),
    reason: `${pair} is range-bound, so the cleanest edge is waiting for confirmed support or resistance failure.`,
    trigger: `Break and close beyond ${support} or ${resistance}`,
    invalidation: `Failed breakout back inside the range`,
    iconTone: "bg-slate-300/10 text-slate-200",
  };
}

function getSwingRange(candles: Candle[]) {
  const recent = candles.slice(-96);
  const offset = candles.length - recent.length;
  let high = recent[0].high;
  let low = recent[0].low;
  let highIndex = offset;
  let lowIndex = offset;

  recent.forEach((candle, index) => {
    if (candle.high > high) {
      high = candle.high;
      highIndex = offset + index;
    }

    if (candle.low < low) {
      low = candle.low;
      lowIndex = offset + index;
    }
  });

  return { high, highIndex, low, lowIndex };
}

function calculateRsi(closes: number[], period: number) {
  const changes = closes.slice(1).map((close, index) => close - closes[index]);
  const slice = changes.slice(-period);
  const gains = slice.map((change) => Math.max(change, 0));
  const losses = slice.map((change) => Math.abs(Math.min(change, 0)));
  const averageGain = average(gains);
  const averageLoss = average(losses);

  if (averageLoss === 0) {
    return 100;
  }

  const rs = averageGain / averageLoss;

  return 100 - 100 / (1 + rs);
}

function getTrendlineLabel({
  isBullish,
  isBearish,
  sma20,
  sma50,
}: {
  isBullish: boolean;
  isBearish: boolean;
  sma20: number;
  sma50: number;
}) {
  if (isBullish) {
    return "Higher-Low Recovery";
  }

  if (isBearish) {
    return "Lower-High Structure";
  }

  return sma20 > sma50 ? "Range With Bullish Tilt" : "Range With Bearish Tilt";
}

function buildFallbackNote({
  pair,
  biasTone,
  resistance,
  support,
  rsi,
  change10,
}: {
  pair: string;
  biasTone: BiasTone;
  resistance: string;
  support: string;
  rsi: number;
  change10: number;
}) {
  if (biasTone === "bullish") {
    return `${pair} is constructive while price holds above ${support}. Momentum is positive over the last 10 candles and RSI is near ${Math.round(rsi)}. A clean break through ${resistance} confirms continuation.`;
  }

  if (biasTone === "bearish") {
    return `${pair} remains under pressure below ${resistance}. Momentum is down ${Math.abs(change10).toFixed(2)}% over the last 10 candles. Reclaiming ${resistance} would weaken the bearish read.`;
  }

  return `${pair} is currently balanced between ${support} support and ${resistance} resistance. RSI near ${Math.round(rsi)} suggests waiting for a confirmed range break before assigning a directional bias.`;
}

function buildPlaybook({
  biasTone,
  resistance,
  support,
  pair,
  strategy,
}: {
  biasTone: BiasTone;
  resistance: string;
  support: string;
  pair: string;
  strategy: AiStrategyRecommendation;
}) {
  if (biasTone === "bullish") {
    return [
      { label: strategy.name, value: strategy.trigger, iconTone: strategy.iconTone },
      { label: "Bullish Trigger", value: `Hold ${support}, then break ${resistance} with volume for continuation.`, iconTone: "bg-emerald-300/10 text-emerald-200" },
      { label: "Bearish Invalidation", value: `A close below ${support} breaks the current recovery structure.`, iconTone: "bg-rose-300/10 text-rose-200" },
    ];
  }

  if (biasTone === "bearish") {
    return [
      { label: strategy.name, value: strategy.trigger, iconTone: strategy.iconTone },
      { label: "Bearish Trigger", value: `Reject near ${resistance}, then watch for continuation into ${support}.`, iconTone: "bg-rose-300/10 text-rose-200" },
      { label: "Bullish Invalidation", value: `A close above ${resistance} weakens the bearish structure.`, iconTone: "bg-emerald-300/10 text-emerald-200" },
    ];
  }

  return [
    { label: strategy.name, value: strategy.trigger, iconTone: strategy.iconTone },
    { label: "Confirmation Needed", value: `Wait for a candle close beyond ${resistance} or below ${support}.`, iconTone: "bg-amber-300/10 text-amber-200" },
    { label: "Upside Trigger", value: `A volume-backed reclaim of ${resistance} turns the setup bullish.`, iconTone: "bg-emerald-300/10 text-emerald-200" },
  ];
}

async function explainWithOllama(analysis: ChartAiAnalysis, candles: Candle[]) {
  if (process.env.AI_PROVIDER !== "ollama") {
    return null;
  }

  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const latest = candles[candles.length - 1];
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(process.env.OLLAMA_API_KEY ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: "system",
            content: "You are Nexoris, a concise crypto technical analyst. Return one professional paragraph only. No markdown. No financial advice disclaimer.",
          },
          {
            role: "user",
            content: JSON.stringify({
              symbol: analysis.pair,
              timeframe: analysis.timeframe,
              price: latest.close,
              bias: analysis.bias,
              trendline: analysis.trendline,
              invalidation: analysis.invalidation,
              momentum: analysis.momentumMeta,
              strategy: analysis.strategy.name,
              strategy_reason: analysis.strategy.reason,
              fib_levels: analysis.fibLevels.map((level) => ({ label: level.label, value: level.value })),
              levels: analysis.levels.map((level) => ({ label: level.label, value: level.value })),
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = typeof data?.message?.content === "string" ? data.message.content.trim() : "";

    return content || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getBaseAsset(pair: string) {
  const quoteAssets = ["USDT", "USDC", "FDUSD", "BUSD", "USD", "BTC", "ETH", "BNB", "EUR", "TRY"];
  const quote = quoteAssets.find((asset) => pair.endsWith(asset) && pair.length > asset.length);

  return quote ? pair.slice(0, -quote.length) : pair;
}

function formatPrice(price: number) {
  const decimals = price >= 1000 ? 0 : price >= 100 ? 2 : price >= 1 ? 3 : 6;

  return `$${price.toLocaleString("en-US", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: price >= 1000 ? 0 : Math.min(decimals, 2),
  })}`;
}
