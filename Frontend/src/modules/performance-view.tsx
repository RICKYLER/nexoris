"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CheckCircle2,
  Clock3,
  Gauge,
  LineChart,
  PieChart,
  RefreshCcw,
  Shield,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { ModuleStack, PanelTitle, ProgressRow, toneBadge } from "@/components/dashboard/ui";

type AiStatus = "fallback" | "ready" | "thinking";
type Tone = "amber" | "cyan" | "green" | "rose" | "violet";
type ChartRange = "1W" | "1M";

type PerformancePoint = {
  date: string;
  period: string;
  equity: number;
  pnl: number;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  drawdown: number;
  bestTrade: string;
  note: string;
};

type ChartPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type ChartCoordinate = {
  x: number;
  y: number;
};

type ChartBounds = {
  min: number;
  max: number;
  ticks: number[];
};

const performanceSnapshot = {
  trader: "TraderX Wave",
  period: "Last 30 days",
  grossProfit: 105.41,
  grossLoss: -82.82,
  netProfit: 22.59,
  trades: 34,
  wins: 22,
  losses: 12,
  winRate: 64.7,
  avgRrr: 2.35,
  profitFactor: 1.82,
  recoveryFactor: 1.31,
  sharpeRatio: 1.14,
  maxDrawdown: 17.2,
  maxDepositLoad: 22.48,
  tradesPerWeek: 36,
  averageHoldTime: "46m",
  bestStrategy: "Breakout retest",
};

const defaultAiRead =
  "TraderX is profitable, but the edge is still selective. WR is strong at 64.7%, and 2.35R average reward means the wins are paying enough to cover losses.\n\nThe best strategy is breakout retest. Keep it as the main playbook, reduce news impulse trades, and tighten risk after two consecutive losses.";

const metricCards = [
  { label: "Net Profit", value: "+$22.59", delta: "+12.4%", sub: "Gross +$105.41 / Loss -$82.82", tone: "green" as Tone, icon: PieChart },
  { label: "Win Rate", value: "64.7%", delta: "22 / 34", sub: "Winning trades", tone: "cyan" as Tone, icon: Trophy },
  { label: "Average RRR", value: "2.35R", delta: "Best", sub: "Breakout retest", tone: "violet" as Tone, icon: Target },
  { label: "Risk Quality", value: "1.14 SR", delta: "PF 1.82", sub: "RF 1.31 / DD 17.2%", tone: "amber" as Tone, icon: Gauge },
];

const performanceHistory: PerformancePoint[] = [
  { date: "May 13", period: "W1 D1", equity: 2.1, pnl: 2.1, trades: 1, wins: 1, losses: 0, winRate: 100, drawdown: 0.8, bestTrade: "ETH +1.1R", note: "Started clean with a breakout retest win." },
  { date: "May 14", period: "W1 D2", equity: 3.4, pnl: 1.3, trades: 2, wins: 1, losses: 1, winRate: 50, drawdown: 1.4, bestTrade: "SOL +0.9R", note: "Small continuation win, one failed scalp." },
  { date: "May 15", period: "W1 D3", equity: 4.7, pnl: 1.3, trades: 3, wins: 2, losses: 1, winRate: 67, drawdown: 1.2, bestTrade: "ETH +1.4R", note: "ETH retest setup stayed effective." },
  { date: "May 16", period: "W1 D4", equity: 4.2, pnl: -0.5, trades: 2, wins: 1, losses: 1, winRate: 50, drawdown: 2.1, bestTrade: "ARB +0.7R", note: "Avoided major loss but range entries were noisy." },
  { date: "May 17", period: "W1 D5", equity: 6.1, pnl: 1.9, trades: 2, wins: 2, losses: 0, winRate: 100, drawdown: 0.9, bestTrade: "SOL +1.6R", note: "Momentum trades improved after waiting for volume." },
  { date: "May 20", period: "W2 D1", equity: 7.4, pnl: 1.3, trades: 3, wins: 2, losses: 1, winRate: 67, drawdown: 2.6, bestTrade: "ETH +1.2R", note: "Positive day, but one BTC scalp lowered quality." },
  { date: "May 21", period: "W2 D2", equity: 6.8, pnl: -0.6, trades: 2, wins: 0, losses: 2, winRate: 0, drawdown: 4.8, bestTrade: "None", note: "Loss cluster. Size should be reduced after this point." },
  { date: "May 22", period: "W2 D3", equity: 9.0, pnl: 2.2, trades: 2, wins: 2, losses: 0, winRate: 100, drawdown: 1.1, bestTrade: "ETH +2.0R", note: "Recovered with the highest quality breakout retest." },
  { date: "May 23", period: "W2 D4", equity: 10.1, pnl: 1.1, trades: 2, wins: 1, losses: 1, winRate: 50, drawdown: 2.2, bestTrade: "ARB +1.3R", note: "ARB worked only with smart money confirmation." },
  { date: "May 24", period: "W2 D5", equity: 9.7, pnl: -0.4, trades: 2, wins: 1, losses: 1, winRate: 50, drawdown: 3.1, bestTrade: "SOL +0.8R", note: "Do not chase late continuation after the first target." },
  { date: "May 27", period: "W3 D1", equity: 12.2, pnl: 2.5, trades: 3, wins: 2, losses: 1, winRate: 67, drawdown: 1.8, bestTrade: "ETH +2.4R", note: "Best setup remained ETH breakout retest." },
  { date: "May 28", period: "W3 D2", equity: 13.6, pnl: 1.4, trades: 2, wins: 2, losses: 0, winRate: 100, drawdown: 1.0, bestTrade: "SOL +1.5R", note: "Good execution, clean stops, no revenge trades." },
  { date: "May 29", period: "W3 D3", equity: 14.7, pnl: 1.1, trades: 3, wins: 2, losses: 1, winRate: 67, drawdown: 2.4, bestTrade: "ETH +1.7R", note: "Still profitable but trade frequency increased." },
  { date: "May 30", period: "W3 D4", equity: 16.1, pnl: 1.4, trades: 2, wins: 2, losses: 0, winRate: 100, drawdown: 0.7, bestTrade: "ARB +1.8R", note: "Strong day with low drawdown." },
  { date: "May 31", period: "W3 D5", equity: 15.4, pnl: -0.7, trades: 2, wins: 0, losses: 2, winRate: 0, drawdown: 3.6, bestTrade: "None", note: "Both losses came from lower quality range entries." },
  { date: "Jun 3", period: "W4 D1", equity: 17.0, pnl: 1.6, trades: 2, wins: 1, losses: 1, winRate: 50, drawdown: 2.0, bestTrade: "ETH +2.1R", note: "One strong win covered a small invalidation." },
  { date: "Jun 4", period: "W4 D2", equity: 18.3, pnl: 1.3, trades: 2, wins: 2, losses: 0, winRate: 100, drawdown: 1.3, bestTrade: "SOL +1.6R", note: "Momentum aligned with the plan." },
  { date: "Jun 5", period: "W4 D3", equity: 19.8, pnl: 1.5, trades: 3, wins: 2, losses: 1, winRate: 67, drawdown: 2.1, bestTrade: "ETH +1.9R", note: "Good growth, but stop discipline still matters." },
  { date: "Jun 6", period: "W4 D4", equity: 19.2, pnl: -0.6, trades: 2, wins: 1, losses: 1, winRate: 50, drawdown: 3.0, bestTrade: "LINK +0.8R", note: "Small pullback after pushing too close to resistance." },
  { date: "Jun 7", period: "W4 D5", equity: 21.0, pnl: 1.8, trades: 2, wins: 2, losses: 0, winRate: 100, drawdown: 1.2, bestTrade: "SOL +2.0R", note: "Clean continuation after volume confirmation." },
  { date: "Jun 8", period: "W4 D6", equity: 21.9, pnl: 0.9, trades: 2, wins: 1, losses: 1, winRate: 50, drawdown: 1.7, bestTrade: "ARB +1.1R", note: "Positive but less efficient than prior sessions." },
  { date: "Jun 9", period: "W4 D7", equity: 23.4, pnl: 1.5, trades: 3, wins: 2, losses: 1, winRate: 67, drawdown: 1.9, bestTrade: "ETH +3.2R", note: "Best trade of the period. Retest setup is the edge." },
  { date: "Jun 10", period: "W4 D8", equity: 22.2, pnl: -1.2, trades: 2, wins: 0, losses: 2, winRate: 0, drawdown: 5.2, bestTrade: "None", note: "Giveback day. Reduce size after loss clusters." },
  { date: "Jun 11", period: "W4 D9", equity: 22.59, pnl: 0.39, trades: 1, wins: 1, losses: 0, winRate: 100, drawdown: 1.6, bestTrade: "ETH +0.6R", note: "Closed period positive after controlled recovery." },
];

const strategyRows = [
  { name: "Breakout retest", trades: 14, wr: 71, rrr: 2.6, pf: 2.14, pnl: 42.8, grade: "Effective", tone: "green" },
  { name: "Trend pullback", trades: 9, wr: 67, rrr: 2.1, pf: 1.76, pnl: 18.4, grade: "Good", tone: "cyan" },
  { name: "Range scalp", trades: 7, wr: 57, rrr: 1.45, pf: 1.08, pnl: -4.6, grade: "Weak", tone: "amber" },
  { name: "News impulse", trades: 4, wr: 50, rrr: 1.2, pf: 0.82, pnl: -11.0, grade: "Avoid", tone: "rose" },
];

const recentTrades = [
  { pair: "ETHUSDT", strategy: "Breakout retest", side: "Long", result: "+3.2R", pnl: "+$18.40", hold: "52m", quality: "A" },
  { pair: "SOLUSDT", strategy: "Trend pullback", side: "Long", result: "+2.1R", pnl: "+$9.80", hold: "38m", quality: "B+" },
  { pair: "BTCUSDT", strategy: "Range scalp", side: "Short", result: "-1.0R", pnl: "-$7.10", hold: "14m", quality: "C" },
  { pair: "ARBUSDT", strategy: "Breakout retest", side: "Long", result: "+1.8R", pnl: "+$6.30", hold: "44m", quality: "B" },
];

const monthlyReturns = [
  ["2024", "-", "-", "+4.70%", "-0.60%", "-2.68%", "+7.22%", "+2.14%", "-", "+5.86%", "-1.24%", "+3.18%", "+6.44%"],
  ["2025", "-4.32%", "+2.10%", "+8.43%", "-1.72%", "+12.36%", "-3.28%", "+5.41%", "+9.12%", "-2.90%", "+6.70%", "-1.88%", "+4.25%"],
  ["2026", "+3.80%", "+6.14%", "-2.40%", "+9.31%", "+4.22%", "+2.76%", "-", "-", "-", "-", "-", "-"],
];

export function PerformanceView() {
  const [aiRead, setAiRead] = useState(defaultAiRead);
  const [aiStatus, setAiStatus] = useState<AiStatus>("ready");

  const refreshAiRead = async () => {
    if (aiStatus === "thinking") {
      return;
    }

    setAiStatus("thinking");

    try {
      const response = await fetch("/api/performance-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: performanceSnapshot,
          strategies: strategyRows,
          recentTrades,
        }),
      });

      if (!response.ok) {
        throw new Error("Performance AI request failed");
      }

      const data = await response.json();
      const interpretation = typeof data?.interpretation === "string" && data.interpretation.trim()
        ? data.interpretation.trim()
        : defaultAiRead;

      setAiRead(interpretation);
      setAiStatus(data?.provider === "ollama" ? "ready" : "fallback");
    } catch {
      setAiRead(defaultAiRead);
      setAiStatus("fallback");
    }
  };

  return (
    <ModuleStack>
      <MetricGrid />

      <section className="grid items-start gap-3 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-3">
          <PerformanceChart />
          <StrategyTable />
          <MonthlyMatrix />
        </div>
        <div className="min-w-0 space-y-3">
          <PerformanceAside aiRead={aiRead} aiStatus={aiStatus} onRefresh={refreshAiRead} />
          <RecentTrades />
        </div>
      </section>
    </ModuleStack>
  );
}

function MetricGrid() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </section>
  );
}

function MetricCard({
  label,
  value,
  delta,
  sub,
  tone,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  sub: string;
  tone: Tone;
  icon: LucideIcon;
}) {
  const Icon = icon;
  const accent = {
    amber: "bg-amber-400",
    cyan: "bg-cyan-400",
    green: "bg-emerald-400",
    rose: "bg-rose-400",
    violet: "bg-violet-400",
  }[tone];
  const valueTone = {
    amber: "text-amber-300",
    cyan: "text-cyan-300",
    green: "text-emerald-300",
    rose: "text-rose-300",
    violet: "text-violet-300",
  }[tone];

  return (
    <article className="panel relative min-h-[104px] overflow-hidden p-3">
      <div className={`absolute inset-x-0 bottom-0 h-1 ${accent}`} />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</div>
        <div className={`grid h-8 w-8 place-items-center rounded-md border ${toneBadge[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className={`text-2xl font-black ${valueTone}`}>{value}</span>
        <span className={`rounded px-2 py-1 text-xs font-black ${toneBadge[tone]}`}>{delta}</span>
      </div>
      <div className="mt-2 text-xs text-slate-500">{sub}</div>
    </article>
  );
}

function PerformanceChart() {
  const [selectedIndex, setSelectedIndex] = useState(performanceHistory.length - 1);
  const [activeRange, setActiveRange] = useState<ChartRange>("1M");
  const chartWidth = 760;
  const chartHeight = 280;
  const chartPadding = { top: 30, right: 30, bottom: 72, left: 44 };
  const rangeStartIndex = activeRange === "1W" ? Math.max(0, performanceHistory.length - 7) : 0;
  const visibleHistory = performanceHistory.slice(rangeStartIndex);
  const selectedVisibleIndex = clamp(selectedIndex - rangeStartIndex, 0, visibleHistory.length - 1);
  const selectedPoint = visibleHistory[selectedVisibleIndex];
  const equityBounds = getEquityBounds(visibleHistory);
  const chartPoints = buildEquityCoordinates(visibleHistory, equityBounds, chartWidth, chartHeight, chartPadding);
  const equityPath = buildLinePath(chartPoints);
  const plotBottom = chartHeight - chartPadding.bottom;
  const fillPath = `${equityPath} L${chartWidth - chartPadding.right} ${plotBottom} L${chartPadding.left} ${plotBottom} Z`;
  const pnlBars = buildPnlBars(visibleHistory, chartWidth, chartHeight, chartPadding);
  const drawdownPath = buildDrawdownAreaPath(visibleHistory, chartWidth, chartHeight, chartPadding);
  const xAxisLabels = buildXAxisLabels(visibleHistory);
  const bestTradeIndex = getBestTradeIndex(visibleHistory);
  const worstDayIndex = getWorstDayIndex(visibleHistory);
  const lossClusterIndexes = getLossClusterIndexes(visibleHistory);
  const selectedCoords = chartPoints[selectedVisibleIndex] ?? chartPoints[chartPoints.length - 1];
  const selectedSummary = getSelectedDaySummary(selectedPoint, {
    isBestTrade: selectedVisibleIndex === bestTradeIndex,
    isWorstDay: selectedVisibleIndex === worstDayIndex,
    isLossCluster: lossClusterIndexes.includes(selectedVisibleIndex),
  });
  const rangeOptions = [
    { label: "1W", value: "1W" as ChartRange, disabled: false },
    { label: "1M", value: "1M" as ChartRange, disabled: false },
    { label: "3M", disabled: true },
    { label: "6M", disabled: true },
    { label: "1Y", disabled: true },
  ];
  const selectPrevious = () => setSelectedIndex((current) => Math.max(rangeStartIndex, current - 1));
  const selectNext = () => setSelectedIndex((current) => Math.min(performanceHistory.length - 1, current + 1));
  const selectRange = (range: ChartRange) => {
    setActiveRange(range);
    setSelectedIndex((current) => (range === "1W" ? performanceHistory.length - 1 : current));
  };

  return (
    <section className="panel min-w-0 overflow-hidden">
      <div className="flex flex-col gap-3 border-b glass-line px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <PanelTitle title="Performance Analytics" action="Equity curve" icon={LineChart} />
          <div className="flex flex-wrap items-end gap-3">
            <span className="text-2xl font-black text-slate-100">+$22.59</span>
            <span className="pb-1 text-sm font-black text-emerald-300">+12.4%</span>
            <span className="pb-1 text-sm text-slate-500">{performanceSnapshot.period}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-slate-800 bg-[#070d1a] p-1">
            <button
              className="px-3 py-2 text-[11px] font-black text-slate-500 transition hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={selectedIndex <= rangeStartIndex}
              onClick={selectPrevious}
              type="button"
            >
              Prev
            </button>
            <button
              className="px-3 py-2 text-[11px] font-black text-slate-500 transition hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={selectedIndex === performanceHistory.length - 1}
              onClick={selectNext}
              type="button"
            >
              Next
            </button>
          </div>
          <div className="flex w-fit overflow-hidden rounded-md border border-slate-800 bg-[#070d1a] p-1">
            {rangeOptions.map((range) => (
              <button
                aria-pressed={!range.disabled && activeRange === range.value}
                className={`px-3 py-2 text-[11px] font-black transition disabled:cursor-not-allowed disabled:opacity-35 ${
                  !range.disabled && activeRange === range.value
                    ? "rounded bg-violet-600 text-white"
                    : "text-slate-500 hover:text-slate-200"
                }`}
                disabled={range.disabled}
                key={range.label}
                onClick={() => {
                  if (range.value) {
                    selectRange(range.value);
                  }
                }}
                type="button"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="chart-grid relative h-[260px] overflow-hidden rounded-md border border-slate-800 bg-[#070d1a] 2xl:h-[280px]">
          <svg className="h-full w-full" viewBox="0 0 760 280" preserveAspectRatio="none" aria-label="Clickable performance equity curve" role="img">
            <defs>
              <linearGradient id="performanceChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,229,168,0.24)" />
                <stop offset="100%" stopColor="rgba(0,229,168,0.02)" />
              </linearGradient>
              <linearGradient id="performanceDrawdownFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(244,63,94,0.18)" />
                <stop offset="100%" stopColor="rgba(244,63,94,0.02)" />
              </linearGradient>
            </defs>
            {equityBounds.ticks.map((tick) => {
              const tickY = getEquityY(tick, equityBounds, chartHeight, chartPadding);

              return (
                <line
                  key={tick}
                  x1={chartPadding.left}
                  x2={chartWidth - chartPadding.right}
                  y1={tickY}
                  y2={tickY}
                  stroke="rgba(137,159,190,0.12)"
                  strokeDasharray="4 8"
                />
              );
            })}
            <path d={drawdownPath} fill="url(#performanceDrawdownFill)" />
            <path d={fillPath} fill="url(#performanceChartFill)" />
            {pnlBars.map((bar, index) => (
              <rect
                aria-label={`${visibleHistory[index].date}: daily P&L ${formatSignedMoney(visibleHistory[index].pnl)}`}
                fill={visibleHistory[index].pnl >= 0 ? "rgba(0,229,168,0.58)" : "rgba(244,63,94,0.62)"}
                height={bar.height}
                key={`${visibleHistory[index].date}-pnl`}
                rx="3"
                width={bar.width}
                x={bar.x}
                y={bar.y}
              />
            ))}
            <line x1={chartPadding.left} x2={chartWidth - chartPadding.right} y1="242" y2="242" stroke="rgba(137,159,190,0.16)" />
            <path d={equityPath} fill="none" stroke="#00e5a8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            {lossClusterIndexes.map((index) => {
              const point = chartPoints[index];

              return (
                <g key={`${visibleHistory[index].date}-loss-cluster`}>
                  <line x1={point.x} x2={point.x} y1={chartPadding.top} y2={plotBottom} stroke="rgba(244,63,94,0.22)" strokeDasharray="5 8" />
                  <circle cx={point.x} cy={point.y} fill="rgba(244,63,94,0.12)" r="11" stroke="rgba(244,63,94,0.4)" strokeDasharray="3 4" />
                </g>
              );
            })}
            {bestTradeIndex >= 0 ? (
              <circle
                cx={chartPoints[bestTradeIndex].x}
                cy={chartPoints[bestTradeIndex].y}
                fill="rgba(139,92,246,0.14)"
                r="13"
                stroke="rgba(196,181,253,0.55)"
                strokeWidth="1.5"
              />
            ) : null}
            {worstDayIndex >= 0 ? (
              <circle
                cx={chartPoints[worstDayIndex].x}
                cy={chartPoints[worstDayIndex].y}
                fill="rgba(244,63,94,0.12)"
                r="13"
                stroke="rgba(251,113,133,0.55)"
                strokeWidth="1.5"
              />
            ) : null}
            <line x1={selectedCoords.x} x2={selectedCoords.x} y1={chartPadding.top} y2="258" stroke="rgba(137,159,190,0.28)" strokeDasharray="5 7" />
            {chartPoints.map((point, index) => {
              const isSelected = selectedVisibleIndex === index;
              const isLossCluster = lossClusterIndexes.includes(index);

              return (
                <circle
                  aria-label={`${visibleHistory[index].date}: equity ${formatMoney(visibleHistory[index].equity)}, P&L ${formatSignedMoney(visibleHistory[index].pnl)}, drawdown ${visibleHistory[index].drawdown}%`}
                  className="cursor-pointer transition"
                  cx={point.x}
                  cy={point.y}
                  fill={isSelected ? "#00e5a8" : "#050712"}
                  key={visibleHistory[index].date}
                  onClick={() => setSelectedIndex(rangeStartIndex + index)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedIndex(rangeStartIndex + index);
                    }
                  }}
                  r={isSelected ? 7 : 4}
                  role="button"
                  stroke={isSelected ? "#ccfff3" : isLossCluster ? "#fb7185" : "#00e5a8"}
                  strokeWidth={isSelected ? 3 : 2}
                  tabIndex={0}
                />
              );
            })}
          </svg>

          <div className="pointer-events-none absolute left-3 top-0 h-full w-9 text-[10px] font-black text-slate-600">
            {equityBounds.ticks.map((tick) => (
              <span
                className="absolute -translate-y-1/2"
                key={tick}
                style={{
                  top: `${(getEquityY(tick, equityBounds, chartHeight, chartPadding) / chartHeight) * 100}%`,
                }}
              >
                {formatAxisMoney(tick)}
              </span>
            ))}
          </div>

          <div className="pointer-events-none absolute right-3 top-3 flex flex-wrap justify-end gap-2 text-[10px] font-black uppercase tracking-wide text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-5 rounded bg-emerald-400" />Equity</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-1.5 rounded-sm bg-emerald-400/70" />Daily P&L</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-rose-400/25" />Drawdown</span>
          </div>

          <div className="absolute bottom-3 left-11 right-7 flex justify-between text-[10px] font-bold text-slate-600">
            {xAxisLabels.map((label) => (
              <span key={`${label.index}-${label.date}`}>{label.date}</span>
            ))}
          </div>
        </div>

        <SelectedDaySummary point={selectedPoint} summary={selectedSummary} />
      </div>
    </section>
  );
}

function SelectedDaySummary({
  point,
  summary,
}: {
  point: PerformancePoint;
  summary: ReturnType<typeof getSelectedDaySummary>;
}) {
  return (
    <div className="mt-3 border-t glass-line pt-3">
      <div className="grid gap-3 lg:grid-cols-[230px_minmax(0,1fr)]">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wide text-slate-500">{point.period}</div>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-black text-slate-100">{point.date}</div>
              <div className="mt-1 text-xs font-black text-slate-500">{summary.title}</div>
            </div>
            <div className={`text-right text-lg font-black ${summary.pnlTone}`}>{formatSignedMoney(point.pnl)}</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {summary.tags.map((tag) => (
              <span className={`rounded px-2 py-1 text-[10px] font-black uppercase ${tag.tone}`} key={tag.label}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-4">
            <ChartPreviewValue label="Equity" value={formatSignedMoney(point.equity)} tone="text-emerald-300" />
            <ChartPreviewValue label="Trades" value={String(point.trades)} tone="text-slate-100" />
            <ChartPreviewValue label="WR" value={`${point.winRate}%`} tone="text-cyan-300" />
            <ChartPreviewValue label="DD" value={`${point.drawdown}%`} tone="text-rose-300" />
          </div>
          <div className="min-w-0 text-xs leading-5 text-slate-400">
            <div className="mb-1 font-black uppercase tracking-wide text-slate-600">Read</div>
            <p>{point.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartPreviewValue({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-600">{label}</div>
      <div className={`mt-1 truncate font-black ${tone}`}>{value}</div>
    </div>
  );
}

function PerformanceAside({
  aiRead,
  aiStatus,
  onRefresh,
}: {
  aiRead: string;
  aiStatus: AiStatus;
  onRefresh: () => void;
}) {
  return (
    <aside className="space-y-3">
      <TotalPerformanceCard />
      <RiskControlCard />
      <AiCoachCard aiRead={aiRead} aiStatus={aiStatus} onRefresh={onRefresh} />
    </aside>
  );
}

function TotalPerformanceCard() {
  return (
    <section className="panel p-3">
      <PanelTitle title="Total Performance" action="34 trades" icon={PieChart} />
      <div className="grid grid-cols-2 gap-2">
        <PerformanceMiniStat label="Wins" value={String(performanceSnapshot.wins)} tone="text-emerald-300" />
        <PerformanceMiniStat label="Losses" value={String(performanceSnapshot.losses)} tone="text-rose-300" />
        <PerformanceMiniStat label="WR" value={`${performanceSnapshot.winRate}%`} tone="text-cyan-300" />
        <PerformanceMiniStat label="Avg RRR" value={`${performanceSnapshot.avgRrr}R`} tone="text-violet-300" />
      </div>
    </section>
  );
}

function PerformanceMiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="mini-panel p-3">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-black ${tone}`}>{value}</div>
    </div>
  );
}

function RiskControlCard() {
  return (
    <section className="panel p-3">
      <PanelTitle title="Risk Control" action="Stable" icon={Shield} />
      <div className="space-y-3">
        <ProgressRow label="Profit factor" value={Math.round((performanceSnapshot.profitFactor / 3) * 100)} tone="bg-violet-400" />
        <ProgressRow label="Recovery factor" value={Math.round((performanceSnapshot.recoveryFactor / 3) * 100)} tone="bg-emerald-400" />
        <ProgressRow label="Max drawdown" value={performanceSnapshot.maxDrawdown} tone="bg-rose-400" />
      </div>
    </section>
  );
}

function AiCoachCard({
  aiRead,
  aiStatus,
  onRefresh,
}: {
  aiRead: string;
  aiStatus: AiStatus;
  onRefresh: () => void;
}) {
  const statusLabel = aiStatus === "thinking" ? "Reading" : aiStatus === "fallback" ? "Fallback" : "Ollama";

  return (
    <section className="panel p-3">
      <div className="mb-4 flex items-center justify-between gap-3">
        <PanelTitle title="AI Coach" action={statusLabel} icon={Bot} />
        <button
          className="grid h-8 w-8 place-items-center rounded-md border border-violet-300/20 bg-violet-300/10 text-violet-200 transition hover:border-violet-300/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={aiStatus === "thinking"}
          onClick={onRefresh}
          type="button"
          title="Refresh AI read"
        >
          <RefreshCcw className="h-4 w-4" />
        </button>
      </div>
      <div className="mini-panel p-3">
        <div className="mb-2 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          <span className="text-xs font-black uppercase text-slate-300">Effective strategy</span>
        </div>
        <p className="whitespace-pre-line text-xs leading-5 text-slate-400">{aiRead}</p>
      </div>
    </section>
  );
}

function StrategyTable() {
  return (
    <section className="panel min-w-0 overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="Effective Strategy Map" action="AI ranked" icon={Target} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Strategy", "Trades", "WR", "RRR", "PF", "P&L", "Grade"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {strategyRows.map((row) => (
              <tr className="text-slate-300" key={row.name}>
                <td className="border-b glass-line px-4 py-3 font-black text-slate-100">{row.name}</td>
                <td className="border-b glass-line px-4 py-3">{row.trades}</td>
                <td className="border-b glass-line px-4 py-3 font-black text-emerald-300">{row.wr}%</td>
                <td className="border-b glass-line px-4 py-3 font-black text-cyan-300">{row.rrr}R</td>
                <td className="border-b glass-line px-4 py-3">{row.pf}</td>
                <td className={`border-b glass-line px-4 py-3 font-black ${row.pnl >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                  {row.pnl >= 0 ? "+" : ""}${row.pnl.toFixed(1)}
                </td>
                <td className="border-b glass-line px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs font-black ${getGradeTone(row.tone)}`}>{row.grade}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RecentTrades() {
  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <PanelTitle title="Recent Trades" action={`${performanceSnapshot.trades} total`} icon={Clock3} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Pair", "Result", "P&L", "Quality"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTrades.map((trade) => (
              <tr className="text-slate-300" key={`${trade.pair}-${trade.pnl}`}>
                <td className="border-b glass-line px-4 py-3">
                  <div className="font-black text-slate-100">{trade.pair}</div>
                  <div className="mt-1 text-xs text-slate-500">{trade.strategy}</div>
                </td>
                <td className={`border-b glass-line px-4 py-3 font-black ${trade.result.startsWith("+") ? "text-emerald-300" : "text-rose-300"}`}>{trade.result}</td>
                <td className={`border-b glass-line px-4 py-3 font-black ${trade.pnl.startsWith("+") ? "text-emerald-300" : "text-rose-300"}`}>{trade.pnl}</td>
                <td className="border-b glass-line px-4 py-3">
                  <span className="rounded bg-violet-400/10 px-2 py-1 text-xs font-black text-violet-300">{trade.quality}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MonthlyMatrix() {
  const months = ["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <section className="panel overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="Monthly Return Matrix" action="Calendar view" icon={Zap} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {months.map((month) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={month}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthlyReturns.map((row) => (
              <tr className="text-slate-300" key={row[0]}>
                {row.map((value, index) => (
                  <td className={`border-b glass-line px-4 py-3 font-black ${index === 0 ? "text-slate-100" : getReturnTone(value)}`} key={`${row[0]}-${index}`}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getEquityBounds(points: PerformancePoint[]): ChartBounds {
  const equityValues = points.map((point) => point.equity);
  const rawMin = Math.min(0, ...equityValues);
  const rawMax = Math.max(...equityValues);
  const step = getNiceStep((rawMax - rawMin || 1) / 5);
  const min = Math.floor(rawMin / step) * step;
  const max = Math.ceil(rawMax / step) * step;
  const ticks: number[] = [];

  for (let tick = max; tick >= min; tick -= step) {
    ticks.push(Number(tick.toFixed(6)));
  }

  return { min, max, ticks };
}

function getNiceStep(value: number) {
  const exponent = Math.floor(Math.log10(value));
  const magnitude = 10 ** exponent;
  const normalized = value / magnitude;

  if (normalized <= 1) {
    return magnitude;
  }

  if (normalized <= 2) {
    return 2 * magnitude;
  }

  if (normalized <= 5) {
    return 5 * magnitude;
  }

  return 10 * magnitude;
}

function buildLinePath(points: ChartCoordinate[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

function buildEquityCoordinates(
  points: PerformancePoint[],
  bounds: ChartBounds,
  width: number,
  height: number,
  padding: ChartPadding,
) {
  const xStep = points.length > 1 ? (width - padding.left - padding.right) / (points.length - 1) : 0;

  return points.map((point, index) => ({
    x: padding.left + index * xStep,
    y: getEquityY(point.equity, bounds, height, padding),
  }));
}

function getEquityY(value: number, bounds: ChartBounds, height: number, padding: ChartPadding) {
  const yRange = bounds.max - bounds.min || 1;
  const plotHeight = height - padding.top - padding.bottom;

  return padding.top + ((bounds.max - value) / yRange) * plotHeight;
}

function buildPnlBars(points: PerformancePoint[], width: number, height: number, padding: ChartPadding) {
  const xStep = points.length > 1 ? (width - padding.left - padding.right) / (points.length - 1) : 0;
  const maxAbsPnl = Math.max(1, ...points.map((point) => Math.abs(point.pnl)));
  const baseline = height - 38;
  const maxBarHeight = 34;
  const barWidth = clamp(xStep * 0.42, 6, 18);

  return points.map((point, index) => {
    const barHeight = Math.max(2, (Math.abs(point.pnl) / maxAbsPnl) * maxBarHeight);
    const y = point.pnl >= 0 ? baseline - barHeight : baseline;

    return {
      height: barHeight,
      width: barWidth,
      x: padding.left + index * xStep - barWidth / 2,
      y,
    };
  });
}

function buildDrawdownAreaPath(points: PerformancePoint[], width: number, height: number, padding: ChartPadding) {
  const xStep = points.length > 1 ? (width - padding.left - padding.right) / (points.length - 1) : 0;
  const baseline = height - padding.bottom;
  const maxDrawdown = Math.max(1, ...points.map((point) => point.drawdown));
  const drawdownHeight = 54;
  const coordinates = points.map((point, index) => ({
    x: padding.left + index * xStep,
    y: baseline - (point.drawdown / maxDrawdown) * drawdownHeight,
  }));

  return [
    `M${padding.left} ${baseline}`,
    ...coordinates.map((point) => `L${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
    `L${width - padding.right} ${baseline}`,
    "Z",
  ].join(" ");
}

function buildXAxisLabels(points: PerformancePoint[]) {
  const lastIndex = points.length - 1;
  const indexes = [0, Math.round(lastIndex / 3), Math.round((lastIndex * 2) / 3), lastIndex];

  return [...new Set(indexes)]
    .filter((index) => points[index])
    .map((index) => ({
      date: points[index].date,
      index,
    }));
}

function getBestTradeIndex(points: PerformancePoint[]) {
  return points.reduce((bestIndex, point, index) => {
    const bestValue = parseBestTradeR(points[bestIndex].bestTrade);
    const currentValue = parseBestTradeR(point.bestTrade);

    return currentValue > bestValue ? index : bestIndex;
  }, 0);
}

function getWorstDayIndex(points: PerformancePoint[]) {
  return points.reduce((worstIndex, point, index) => {
    const worstPoint = points[worstIndex];

    if (point.pnl < worstPoint.pnl) {
      return index;
    }

    if (point.pnl === worstPoint.pnl && point.drawdown > worstPoint.drawdown) {
      return index;
    }

    return worstIndex;
  }, 0);
}

function getLossClusterIndexes(points: PerformancePoint[]) {
  return points
    .map((point, index) => ({ point, index }))
    .filter(({ point }) => point.pnl < 0 && point.losses >= 2)
    .map(({ index }) => index);
}

function parseBestTradeR(value: string) {
  const match = value.match(/([+-]?\d+(?:\.\d+)?)R/);

  return match ? Number(match[1]) : Number.NEGATIVE_INFINITY;
}

function getSelectedDaySummary(
  point: PerformancePoint,
  markers: {
    isBestTrade: boolean;
    isWorstDay: boolean;
    isLossCluster: boolean;
  },
) {
  const tags: Array<{ label: string; tone: string }> = [];

  if (markers.isBestTrade) {
    tags.push({ label: "Best trade", tone: "bg-violet-400/10 text-violet-300" });
  }

  if (markers.isWorstDay) {
    tags.push({ label: "Giveback day", tone: "bg-rose-400/10 text-rose-300" });
  }

  if (markers.isLossCluster) {
    tags.push({ label: "Loss cluster", tone: "bg-rose-400/10 text-rose-300" });
  }

  if (!markers.isBestTrade && !markers.isWorstDay && !markers.isLossCluster) {
    tags.push(
      point.pnl >= 0
        ? { label: "Controlled gain", tone: "bg-emerald-400/10 text-emerald-300" }
        : { label: "Minor pullback", tone: "bg-amber-400/10 text-amber-300" },
    );
  }

  return {
    pnlTone: point.pnl >= 0 ? "text-emerald-300" : "text-rose-300",
    tags,
    title: point.pnl >= 0 ? "Winning session" : "Risk session",
  };
}

function formatAxisMoney(value: number) {
  if (value === 0) {
    return "$0";
  }

  return `+$${value}`;
}

function formatMoney(value: number) {
  return `$${Math.abs(value).toFixed(2)}`;
}

function formatSignedMoney(value: number) {
  return `${value >= 0 ? "+" : "-"}${formatMoney(value)}`;
}

function getReturnTone(value: string) {
  if (value.startsWith("+")) {
    return "text-emerald-300";
  }

  if (value.startsWith("-")) {
    return "text-rose-300";
  }

  return "text-slate-600";
}

function getGradeTone(tone: string) {
  if (tone === "green") {
    return "bg-emerald-400/10 text-emerald-300";
  }

  if (tone === "cyan") {
    return "bg-cyan-400/10 text-cyan-300";
  }

  if (tone === "amber") {
    return "bg-amber-400/10 text-amber-300";
  }

  return "bg-rose-400/10 text-rose-300";
}
