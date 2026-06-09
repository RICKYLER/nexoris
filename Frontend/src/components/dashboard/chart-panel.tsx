"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BrainCircuit, Gauge, LineChart, Maximize2, Minus, Search, Shield, TrendingDown, TrendingUp, X } from "lucide-react";

type TradingTab = "positions" | "orders" | "order-history" | "balance-history" | "trading-journal";
type BiasTone = "bullish" | "bearish" | "neutral";
type AnalysisStatus = "loading" | "ready" | "error";

type PositionRow = {
  id: string;
  pair: string;
  side: "Long" | "Short";
  size: string;
  entry: string;
  mark: string;
  pnl: string;
  margin: string;
};

type OrderRow = {
  id: string;
  pair: string;
  type: string;
  side: "Buy" | "Sell";
  price: string;
  amount: string;
  status: string;
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
  playbook: AiPlaybookItem[];
};

const defaultTradingViewSymbol = "BINANCE:ETHUSDT";

const tradingViewConfig = {
  autosize: true,
  symbol: defaultTradingViewSymbol,
  interval: "15",
  timezone: "Etc/UTC",
  theme: "dark",
  style: "1",
  locale: "en",
  enable_publishing: false,
  allow_symbol_change: false,
  calendar: false,
  details: false,
  hide_side_toolbar: false,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  save_image: true,
  backgroundColor: "#070d1a",
  gridColor: "rgba(137, 159, 190, 0.12)",
  studies: ["STD;Volume"],
  support_host: "https://www.tradingview.com",
};

const tradingViewScriptSrc = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

export function ChartPanel() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [activeSymbol, setActiveSymbol] = useState(defaultTradingViewSymbol);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TradingTab>("positions");
  const [positions, setPositions] = useState<PositionRow[]>(initialPositions);
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const fallbackAnalysis = useMemo(() => getChartAiAnalysis(activeSymbol), [activeSymbol]);
  const [analysis, setAnalysis] = useState<ChartAiAnalysis>(fallbackAnalysis);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("loading");
  const widgetConfig = useMemo(
    () => ({
      ...tradingViewConfig,
      symbol: activeSymbol,
    }),
    [activeSymbol],
  );

  useEffect(() => {
    const controller = new AbortController();

    setAnalysis(fallbackAnalysis);
    setAnalysisStatus("loading");

    fetch("/api/chart-analysis", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symbol: activeSymbol, interval: "15m" }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Chart analysis request failed");
        }

        return response.json() as Promise<ChartAiAnalysis>;
      })
      .then((nextAnalysis) => {
        setAnalysis(nextAnalysis);
        setAnalysisStatus("ready");
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setAnalysisStatus("error");
      });

    return () => {
      controller.abort();
    };
  }, [activeSymbol, fallbackAnalysis]);

  useEffect(() => {
    const container = widgetRef.current;

    if (!container) {
      return;
    }

    container.replaceChildren();

    const widgetSlot = document.createElement("div");
    widgetSlot.className = "tradingview-widget-container__widget";
    widgetSlot.id = "tradingview-ethusdt";
    widgetSlot.style.height = "100%";
    widgetSlot.style.width = "100%";

    const attribution = document.createElement("div");
    attribution.className = "tradingview-widget-copyright";
    attribution.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span>Track all markets on TradingView</span></a>';
    attribution.style.display = "none";

    const script = document.createElement("script");
    script.async = true;
    script.src = tradingViewScriptSrc;
    script.type = "text/javascript";
    script.textContent = JSON.stringify(widgetConfig);

    container.appendChild(widgetSlot);
    container.appendChild(attribution);
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [widgetConfig]);

  return (
    <section className="panel mb-4 overflow-hidden">
      <div className="relative h-[560px] min-h-[560px] overflow-hidden bg-[#070d1a]">
        <div
          ref={widgetRef}
          className="tradingview-widget-container h-full w-full"
          style={{ height: "100%", width: "100%" }}
        />
      </div>

      <AiChartIntelligence analysis={analysis} analysisStatus={analysisStatus} onSymbolChange={setActiveSymbol} />

      <TradingTerminal
        activeTab={activeTab}
        onCloseOrder={(id) => setOrders((current) => current.filter((order) => order.id !== id))}
        onClosePosition={(id) => setPositions((current) => current.filter((position) => position.id !== id))}
        onTabChange={setActiveTab}
        onToggle={() => setTerminalOpen((current) => !current)}
        open={terminalOpen}
        orders={orders}
        positions={positions}
      />
    </section>
  );
}

function AiChartIntelligence({
  analysis,
  analysisStatus,
  onSymbolChange,
}: {
  analysis: ChartAiAnalysis;
  analysisStatus: AnalysisStatus;
  onSymbolChange: (symbol: string) => void;
}) {
  return (
    <section className="border-t glass-line bg-[#080d18]">
      <ChartAiSymbolControl activeSymbol={analysis.symbol} analysisStatus={analysisStatus} onSymbolChange={onSymbolChange} />

      <div className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <div className="grid gap-3 md:grid-cols-3">
          <AiSignalCard
            icon={analysis.biasTone === "bullish" ? TrendingUp : TrendingDown}
            label="AI Bias"
            value={analysis.bias}
            meta={`${analysis.confidence}% confidence`}
            tone={analysis.biasTone === "bullish" ? "green" : analysis.biasTone === "bearish" ? "rose" : "amber"}
          />
          <AiSignalCard
            icon={LineChart}
            label="Trendline"
            value={analysis.trendline}
            meta={analysis.invalidation}
            tone="amber"
          />
          <AiSignalCard
            icon={Gauge}
            label="Momentum"
            value={analysis.momentum}
            meta={analysis.momentumMeta}
            tone="cyan"
          />
        </div>

        <div className="mini-panel overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b glass-line px-4 py-3">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-violet-300" />
              <span className="text-xs font-black uppercase tracking-wide text-slate-200">AI Technical Map</span>
            </div>
            <span className="rounded border border-rose-300/20 bg-rose-300/10 px-2 py-1 text-[11px] font-black text-rose-200">
              {analysis.pair} {analysis.timeframe}
            </span>
          </div>

          <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_180px]">
            <div className="space-y-3 text-xs">
              {analysis.levels.map((level) => (
                <div className="grid grid-cols-[88px_1fr_auto] items-center gap-3" key={level.label}>
                  <span className="font-black uppercase text-slate-500">{level.label}</span>
                  <div className="h-1.5 rounded-full bg-slate-800">
                    <div className={`h-1.5 rounded-full ${level.bar}`} style={{ width: level.width }} />
                  </div>
                  <span className={`font-black ${level.tone}`}>{level.value}</span>
                </div>
              ))}

              <div className="rounded-md border border-slate-800 bg-white/[0.025] p-3 leading-5 text-slate-400">
                {analysis.note}
              </div>
            </div>

            <div className="relative min-h-[150px] overflow-hidden rounded-md border border-slate-800 bg-[#070d1a]">
              <AiTechnicalMap analysis={analysis} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t glass-line px-4 pb-4 pt-0 md:grid-cols-3">
        {analysis.playbook.map((item) => (
          <div className="mini-panel flex items-start gap-3 p-3" key={item.label}>
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${item.iconTone}`}>
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-slate-400">{item.label}</div>
              <div className="mt-1 text-sm font-bold leading-5 text-slate-200">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ChartAiSymbolControl({
  activeSymbol,
  analysisStatus,
  onSymbolChange,
}: {
  activeSymbol: string;
  analysisStatus: AnalysisStatus;
  onSymbolChange: (symbol: string) => void;
}) {
  const [draftSymbol, setDraftSymbol] = useState(activeSymbol);

  useEffect(() => {
    setDraftSymbol(activeSymbol);
  }, [activeSymbol]);

  return (
    <form
      className="flex flex-col gap-3 border-b glass-line px-4 py-3 md:flex-row md:items-center md:justify-between"
      onSubmit={(event) => {
        event.preventDefault();
        onSymbolChange(normalizeTradingViewSymbol(draftSymbol));
      }}
    >
      <div>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-200">
          <BrainCircuit className="h-4 w-4 text-violet-300" />
          AI Chart Sync
        </div>
        <div className="mt-1 text-xs text-slate-500">
          {analysisStatus === "loading" ? "Fetching candles, calculating TA, and asking Ollama..." : null}
          {analysisStatus === "ready" ? "Live candles, TA levels, and AI explanation are synced." : null}
          {analysisStatus === "error" ? "Using local fallback. Check Binance/Ollama connection." : null}
        </div>
      </div>

      <div className="flex min-w-0 gap-2 md:min-w-[360px]">
        <label className="sr-only" htmlFor="ai-chart-symbol">TradingView symbol</label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="h-10 w-full rounded-md border border-slate-800 bg-[#070d1a] pl-9 pr-3 text-sm font-bold text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
            id="ai-chart-symbol"
            onChange={(event) => setDraftSymbol(event.target.value)}
            placeholder="BTCUSD, ETHUSDT, SOLUSDT"
            spellCheck={false}
            value={draftSymbol}
          />
        </div>
        <button className="h-10 rounded-md bg-violet-600 px-4 text-xs font-black text-white transition hover:bg-violet-500" type="submit">
          Analyze
        </button>
      </div>
    </form>
  );
}

function AiSignalCard({
  icon,
  label,
  value,
  meta,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  meta: string;
  tone: "green" | "rose" | "amber" | "cyan";
}) {
  const Icon = icon;
  const tones = {
    green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    rose: "border-rose-300/20 bg-rose-300/10 text-rose-200",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  };

  return (
    <article className="mini-panel p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
        <div className={`grid h-8 w-8 place-items-center rounded-md border ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-sm font-black text-slate-100">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{meta}</div>
    </article>
  );
}

function AiTechnicalMap({ analysis }: { analysis: ChartAiAnalysis }) {
  const resistance = analysis.levels.find((level) => level.label === "Res 1")?.value ?? analysis.levels[0]?.value ?? "R";
  const support = analysis.levels.find((level) => level.label === "Sup 1")?.value ?? analysis.levels.at(-1)?.value ?? "S";
  const isBullish = analysis.biasTone === "bullish";
  const trendPath = isBullish ? "M18 108 L156 64" : "M18 48 L156 92";
  const pricePath = isBullish
    ? "M18 104 C38 94 47 105 64 92 S93 88 110 76 S137 68 160 58"
    : "M18 58 C38 46 47 66 64 57 S93 91 110 76 S137 69 160 82";

  return (
    <svg className="h-full min-h-[150px] w-full" viewBox="0 0 180 150" aria-hidden="true">
      <defs>
        <linearGradient id="ai-map-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 34 H180" stroke="#fb7185" strokeDasharray="5 5" strokeWidth="1.5" opacity="0.75" />
      <path d="M0 88 H180" stroke="#22d3ee" strokeDasharray="5 5" strokeWidth="1.5" opacity="0.75" />
      <path d={trendPath} stroke={isBullish ? "#00e5a8" : "#fb7185"} strokeWidth="2.5" strokeLinecap="round" />
      <path d={pricePath} fill="none" stroke="#00e5a8" strokeWidth="3" strokeLinecap="round" />
      <path d={`${pricePath} L160 128 L18 128 Z`} fill="url(#ai-map-fill)" />
      <circle cx="156" cy={isBullish ? "64" : "92"} r="4" fill={isBullish ? "#00e5a8" : "#fb7185"} />
      <circle cx="110" cy="76" r="4" fill="#22d3ee" />
      <text x="10" y="28" fill="#fb7185" fontSize="10" fontWeight="800">R {resistance}</text>
      <text x="10" y="102" fill="#22d3ee" fontSize="10" fontWeight="800">S {support}</text>
    </svg>
  );
}

function TradingTerminal({
  activeTab,
  onCloseOrder,
  onClosePosition,
  onTabChange,
  onToggle,
  open,
  orders,
  positions,
}: {
  activeTab: TradingTab;
  onCloseOrder: (id: string) => void;
  onClosePosition: (id: string) => void;
  onTabChange: (tab: TradingTab) => void;
  onToggle: () => void;
  open: boolean;
  orders: OrderRow[];
  positions: PositionRow[];
}) {
  return (
    <section className="border-t glass-line bg-[#080d18]">
      <div className="flex items-center justify-between border-b glass-line px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-800 text-slate-300">
            <WalletIcon />
          </div>
          <div>
            <div className="text-sm font-black text-slate-100">Paper Trading</div>
            <div className="text-[11px] text-slate-500">Quick position and order management</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-white/[0.04] hover:text-white" onClick={onToggle} type="button" aria-label={open ? "Minimize trading panel" : "Open trading panel"}>
            {open ? <Minus className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div>
          <div className="grid gap-3 border-b glass-line px-4 py-4 sm:grid-cols-2 lg:grid-cols-7">
            {accountStats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xs font-black text-slate-400">{stat.label}</div>
                <div className={`mt-1 text-sm font-black ${stat.tone}`}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="hide-scrollbar flex gap-6 overflow-x-auto border-b glass-line px-4">
            {tradingTabs.map((tab) => (
              <button
                className={`relative h-12 min-w-max text-sm font-black transition ${
                  activeTab === tab.id ? "text-white" : "text-slate-400 hover:text-slate-100"
                }`}
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                {tab.label}
                {tab.count ? <span className="ml-1 text-slate-500">{tab.id === "positions" ? positions.length : tab.id === "orders" ? orders.length : tab.count}</span> : null}
                {activeTab === tab.id ? <span className="absolute inset-x-0 bottom-0 h-1 rounded-t bg-slate-200" /> : null}
              </button>
            ))}
          </div>

          <div className="min-h-[172px]">
            {activeTab === "positions" ? <PositionsTable positions={positions} onClosePosition={onClosePosition} /> : null}
            {activeTab === "orders" ? <OrdersTable orders={orders} onCloseOrder={onCloseOrder} /> : null}
            {activeTab === "order-history" ? <OrderHistoryTable /> : null}
            {activeTab === "balance-history" ? <BalanceHistoryTable /> : null}
            {activeTab === "trading-journal" ? <TradingJournalTable /> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function PositionsTable({
  positions,
  onClosePosition,
}: {
  positions: PositionRow[];
  onClosePosition: (id: string) => void;
}) {
  if (positions.length === 0) {
    return <EmptyState label="No open positions" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="text-xs uppercase text-slate-500">
          <tr>
            {["Pair", "Side", "Size", "Entry", "Mark", "Margin", "Unrealized PnL", "Action"].map((head) => (
              <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr className="text-slate-300" key={position.id}>
              <td className="border-b glass-line px-4 py-3 font-black text-slate-100">{position.pair}</td>
              <td className={`border-b glass-line px-4 py-3 font-black ${position.side === "Long" ? "text-emerald-300" : "text-rose-300"}`}>{position.side}</td>
              <td className="border-b glass-line px-4 py-3">{position.size}</td>
              <td className="border-b glass-line px-4 py-3">{position.entry}</td>
              <td className="border-b glass-line px-4 py-3">{position.mark}</td>
              <td className="border-b glass-line px-4 py-3">{position.margin}</td>
              <td className={`border-b glass-line px-4 py-3 font-black ${position.pnl.startsWith("+") ? "text-emerald-300" : "text-rose-300"}`}>{position.pnl}</td>
              <td className="border-b glass-line px-4 py-3">
                <button className="flex items-center gap-1 rounded-md border border-rose-300/25 bg-rose-300/10 px-2.5 py-1.5 text-xs font-black text-rose-200 hover:border-rose-300/50" onClick={() => onClosePosition(position.id)} type="button">
                  <X className="h-3.5 w-3.5" />
                  Close
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrdersTable({
  orders,
  onCloseOrder,
}: {
  orders: OrderRow[];
  onCloseOrder: (id: string) => void;
}) {
  if (orders.length === 0) {
    return <EmptyState label="No active orders" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="text-xs uppercase text-slate-500">
          <tr>
            {["Pair", "Type", "Side", "Price", "Amount", "Status", "Action"].map((head) => (
              <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr className="text-slate-300" key={order.id}>
              <td className="border-b glass-line px-4 py-3 font-black text-slate-100">{order.pair}</td>
              <td className="border-b glass-line px-4 py-3">{order.type}</td>
              <td className={`border-b glass-line px-4 py-3 font-black ${order.side === "Buy" ? "text-emerald-300" : "text-rose-300"}`}>{order.side}</td>
              <td className="border-b glass-line px-4 py-3">{order.price}</td>
              <td className="border-b glass-line px-4 py-3">{order.amount}</td>
              <td className="border-b glass-line px-4 py-3 text-violet-300">{order.status}</td>
              <td className="border-b glass-line px-4 py-3">
                <button className="rounded-md border border-slate-600 bg-white/[0.03] px-2.5 py-1.5 text-xs font-black text-slate-200 hover:border-rose-300/50 hover:text-rose-200" onClick={() => onCloseOrder(order.id)} type="button">
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderHistoryTable() {
  return (
    <SimpleTerminalTable
      headers={["Time", "Pair", "Type", "Side", "Price", "Amount", "Result"]}
      rows={[
        ["18:35:07", "ETHUSDT", "Market", "Buy", "$2,664", "2.1 ETH", "Filled"],
        ["17:42:18", "SOLUSDT", "Limit", "Buy", "$168.20", "90 SOL", "Filled"],
        ["15:04:32", "BTCUSDT", "Stop", "Sell", "$63,020", "0.08 BTC", "Cancelled"],
      ]}
    />
  );
}

function BalanceHistoryTable() {
  return (
    <SimpleTerminalTable
      headers={["Time", "Type", "Asset", "Amount", "Balance", "Status"]}
      rows={[
        ["18:35:07", "Realized PnL", "USD", "+297.82", "89,167.95", "Settled"],
        ["17:02:11", "Deposit", "USDC", "+5,000.00", "88,870.12", "Confirmed"],
        ["13:44:02", "Fee", "USD", "-4.12", "83,870.12", "Settled"],
      ]}
    />
  );
}

function TradingJournalTable() {
  return (
    <SimpleTerminalTable
      headers={["Time", "Text"]}
      rows={[
        ["2026-06-08 18:35:07", "ETHUSDT long opened after AI trendline retest confirmation."],
        ["2026-06-08 17:42:18", "SOL limit buy filled; plan is partial take profit near $190."],
        ["2026-06-08 15:04:32", "BTC short cancelled because smart money pressure turned neutral."],
      ]}
    />
  );
}

function SimpleTerminalTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs uppercase text-slate-500">
          <tr>
            {headers.map((head) => (
              <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="text-slate-300" key={row.join("-")}>
              {row.map((cell, index) => (
                <td className={`border-b glass-line px-4 py-3 ${index === 0 ? "text-slate-500" : ""}`} key={`${cell}-${index}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="grid min-h-[172px] place-items-center p-6 text-sm font-bold text-slate-500">
      {label}
    </div>
  );
}

function WalletIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H19v3H6.5A2.5 2.5 0 0 1 4 7.5Z" fill="currentColor" opacity="0.5" />
      <path d="M4 8h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" fill="currentColor" />
      <path d="M17 13.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" fill="#080d18" />
    </svg>
  );
}

function normalizeTradingViewSymbol(rawSymbol: string) {
  const cleanedSymbol = rawSymbol.trim().toUpperCase().replace(/\s+/g, "").replace(/\//g, "");

  if (!cleanedSymbol) {
    return defaultTradingViewSymbol;
  }

  if (cleanedSymbol.includes(":")) {
    return cleanedSymbol;
  }

  if (cleanedSymbol.endsWith("USD") && !cleanedSymbol.endsWith("USDT") && !cleanedSymbol.endsWith("USDC")) {
    return `CRYPTO:${cleanedSymbol}`;
  }

  return `BINANCE:${cleanedSymbol}`;
}

function getChartAiAnalysis(rawSymbol: string): ChartAiAnalysis {
  const symbol = normalizeTradingViewSymbol(rawSymbol);
  const pair = symbol.includes(":") ? symbol.split(":").slice(1).join(":") : symbol;
  const knownAnalysis = chartAiAnalyses[pair];

  if (knownAnalysis) {
    return {
      ...knownAnalysis,
      symbol,
    };
  }

  const base = getBaseAsset(pair);

  return {
    symbol,
    pair,
    timeframe: "15m",
    bias: `Neutral On ${base}`,
    biasTone: "neutral",
    confidence: 61,
    trendline: "Structure Not Confirmed",
    invalidation: "Waiting for clean breakout",
    momentum: "Mixed Momentum",
    momentumMeta: "Needs more volume confirmation",
    note: `${pair} is loaded on TradingView. AI needs live OHLCV and indicator data before marking automated support, resistance, and trend bias with high confidence.`,
    levels: fallbackAiLevels,
    playbook: [
      {
        label: "Confirmation Needed",
        value: "Wait for a strong candle close outside the recent range before treating the move as directional.",
        iconTone: "bg-amber-300/10 text-amber-200",
      },
      {
        label: "Breakout Plan",
        value: "Mark the latest swing high as resistance and the latest higher low as support.",
        iconTone: "bg-cyan-300/10 text-cyan-200",
      },
      {
        label: "Risk Control",
        value: "Avoid signal entries while volume remains below average.",
        iconTone: "bg-slate-300/10 text-slate-200",
      },
    ],
  };
}

function getBaseAsset(pair: string) {
  const quote = quoteAssets.find((asset) => pair.endsWith(asset) && pair.length > asset.length);

  return quote ? pair.slice(0, -quote.length) : pair;
}

const quoteAssets = ["USDT", "USDC", "FDUSD", "BUSD", "USD", "BTC", "ETH", "BNB", "EUR", "TRY"];

const fallbackAiLevels: AiLevel[] = [
  { label: "Res 2", value: "Auto", width: "82%", tone: "text-rose-300", bar: "bg-rose-400" },
  { label: "Res 1", value: "Auto", width: "70%", tone: "text-rose-300", bar: "bg-rose-400" },
  { label: "Price", value: "Live", width: "56%", tone: "text-emerald-300", bar: "bg-emerald-400" },
  { label: "Sup 1", value: "Auto", width: "44%", tone: "text-cyan-300", bar: "bg-cyan-400" },
  { label: "Sup 2", value: "Auto", width: "32%", tone: "text-cyan-300", bar: "bg-cyan-400" },
];

const chartAiAnalyses: Record<string, Omit<ChartAiAnalysis, "symbol">> = {
  ETHUSDT: {
    pair: "ETHUSDT",
    timeframe: "15m",
    bias: "Bearish Below $1,720",
    biasTone: "bearish",
    confidence: 78,
    trendline: "Lower-High Structure",
    invalidation: "Breakout invalidation: $1,720",
    momentum: "Recovery Losing Speed",
    momentumMeta: "Volume fade after bounce",
    note: "Sell pressure remains active while price trades below the descending trendline. A clean close above $1,720 shifts the read back to neutral.",
    levels: [
      { label: "Res 2", value: "$1,760", width: "88%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Res 1", value: "$1,720", width: "76%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Price", value: "$1,684", width: "62%", tone: "text-emerald-300", bar: "bg-emerald-400" },
      { label: "Sup 1", value: "$1,640", width: "48%", tone: "text-cyan-300", bar: "bg-cyan-400" },
      { label: "Sup 2", value: "$1,600", width: "35%", tone: "text-cyan-300", bar: "bg-cyan-400" },
    ],
    playbook: [
      {
        label: "Bearish Trigger",
        value: "Reject near $1,720 with weak volume, then watch for a move back into $1,640 support.",
        iconTone: "bg-rose-300/10 text-rose-200",
      },
      {
        label: "Bullish Invalidation",
        value: "A 15m close above $1,720 breaks the active lower-high trendline.",
        iconTone: "bg-emerald-300/10 text-emerald-200",
      },
      {
        label: "Risk Zone",
        value: "Avoid chasing between $1,680 and $1,720 until price confirms direction.",
        iconTone: "bg-amber-300/10 text-amber-200",
      },
    ],
  },
  BTCUSD: {
    pair: "BTCUSD",
    timeframe: "15m",
    bias: "Bullish Above $63,000",
    biasTone: "bullish",
    confidence: 74,
    trendline: "Higher-Low Recovery",
    invalidation: "Invalid below $62,000",
    momentum: "Bid Strength Returning",
    momentumMeta: "Higher lows after selloff",
    note: "BTC is recovering with higher lows while price holds above $63,000. A break over $64,200 confirms continuation; losing $62,000 turns the setup neutral.",
    levels: [
      { label: "Res 2", value: "$65,000", width: "88%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Res 1", value: "$64,200", width: "76%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Price", value: "$63,400", width: "64%", tone: "text-emerald-300", bar: "bg-emerald-400" },
      { label: "Sup 1", value: "$62,000", width: "48%", tone: "text-cyan-300", bar: "bg-cyan-400" },
      { label: "Sup 2", value: "$60,800", width: "36%", tone: "text-cyan-300", bar: "bg-cyan-400" },
    ],
    playbook: [
      {
        label: "Bullish Trigger",
        value: "A clean reclaim of $64,200 opens a continuation attempt into $65,000.",
        iconTone: "bg-emerald-300/10 text-emerald-200",
      },
      {
        label: "Bearish Invalidation",
        value: "A close below $62,000 breaks the higher-low recovery structure.",
        iconTone: "bg-rose-300/10 text-rose-200",
      },
      {
        label: "Risk Zone",
        value: "Do not chase the middle of the range between $63,000 and $64,200.",
        iconTone: "bg-amber-300/10 text-amber-200",
      },
    ],
  },
  BTCUSDT: {
    pair: "BTCUSDT",
    timeframe: "15m",
    bias: "Bullish Above $63,000",
    biasTone: "bullish",
    confidence: 74,
    trendline: "Higher-Low Recovery",
    invalidation: "Invalid below $62,000",
    momentum: "Bid Strength Returning",
    momentumMeta: "Higher lows after selloff",
    note: "BTC is recovering with higher lows while price holds above $63,000. A break over $64,200 confirms continuation; losing $62,000 turns the setup neutral.",
    levels: [
      { label: "Res 2", value: "$65,000", width: "88%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Res 1", value: "$64,200", width: "76%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Price", value: "$63,400", width: "64%", tone: "text-emerald-300", bar: "bg-emerald-400" },
      { label: "Sup 1", value: "$62,000", width: "48%", tone: "text-cyan-300", bar: "bg-cyan-400" },
      { label: "Sup 2", value: "$60,800", width: "36%", tone: "text-cyan-300", bar: "bg-cyan-400" },
    ],
    playbook: [
      {
        label: "Bullish Trigger",
        value: "A clean reclaim of $64,200 opens a continuation attempt into $65,000.",
        iconTone: "bg-emerald-300/10 text-emerald-200",
      },
      {
        label: "Bearish Invalidation",
        value: "A close below $62,000 breaks the higher-low recovery structure.",
        iconTone: "bg-rose-300/10 text-rose-200",
      },
      {
        label: "Risk Zone",
        value: "Do not chase the middle of the range between $63,000 and $64,200.",
        iconTone: "bg-amber-300/10 text-amber-200",
      },
    ],
  },
  SOLUSDT: {
    pair: "SOLUSDT",
    timeframe: "15m",
    bias: "Bullish Above $168",
    biasTone: "bullish",
    confidence: 72,
    trendline: "Ascending Support",
    invalidation: "Invalid below $160",
    momentum: "Momentum Expanding",
    momentumMeta: "Breakout volume improving",
    note: "SOL remains constructive while buyers defend the rising support line. A push through $178 improves odds of continuation toward $190.",
    levels: [
      { label: "Res 2", value: "$190", width: "88%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Res 1", value: "$178", width: "76%", tone: "text-rose-300", bar: "bg-rose-400" },
      { label: "Price", value: "$171", width: "62%", tone: "text-emerald-300", bar: "bg-emerald-400" },
      { label: "Sup 1", value: "$160", width: "48%", tone: "text-cyan-300", bar: "bg-cyan-400" },
      { label: "Sup 2", value: "$148", width: "34%", tone: "text-cyan-300", bar: "bg-cyan-400" },
    ],
    playbook: [
      {
        label: "Bullish Trigger",
        value: "Hold $168 and break $178 with volume for a continuation setup.",
        iconTone: "bg-emerald-300/10 text-emerald-200",
      },
      {
        label: "Bearish Invalidation",
        value: "A close below $160 breaks ascending support.",
        iconTone: "bg-rose-300/10 text-rose-200",
      },
      {
        label: "Risk Zone",
        value: "Avoid late longs directly under $178 resistance.",
        iconTone: "bg-amber-300/10 text-amber-200",
      },
    ],
  },
};

const initialPositions: PositionRow[] = [
  { id: "pos-eth", pair: "ETHUSDT", side: "Long", size: "2.10 ETH", entry: "$2,641.80", mark: "$2,669.36", pnl: "+$57.88", margin: "$1,027.84" },
  { id: "pos-sol", pair: "SOLUSDT", side: "Long", size: "90 SOL", entry: "$168.20", mark: "$171.04", pnl: "+$255.60", margin: "$842.00" },
];

const initialOrders: OrderRow[] = [
  { id: "ord-eth", pair: "ETHUSDT", type: "Stop Loss", side: "Sell", price: "$2,520.00", amount: "2.10 ETH", status: "Armed" },
  { id: "ord-sol", pair: "SOLUSDT", type: "Take Profit", side: "Sell", price: "$190.00", amount: "45 SOL", status: "Open" },
];

const accountStats = [
  { label: "Account Balance", value: "88,870.12", tone: "text-slate-100" },
  { label: "Equity", value: "89,167.95", tone: "text-slate-100" },
  { label: "Realized PnL", value: "-11,129.88", tone: "text-rose-300" },
  { label: "Unrealized PnL", value: "+297.82", tone: "text-emerald-300" },
  { label: "Account Margin", value: "1,027.84", tone: "text-slate-100" },
  { label: "Available Funds", value: "78,140.10", tone: "text-slate-100" },
  { label: "Margin Buffer", value: "87.63%", tone: "text-slate-100" },
];

const tradingTabs: Array<{ id: TradingTab; label: string; count?: number }> = [
  { id: "positions", label: "Positions", count: 1 },
  { id: "orders", label: "Orders", count: 1 },
  { id: "order-history", label: "Order history" },
  { id: "balance-history", label: "Balance history" },
  { id: "trading-journal", label: "Trading journal" },
];
