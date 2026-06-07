import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Brain,
  ClipboardList,
  Code2,
  Database,
  Download,
  Flame,
  Gauge,
  Globe2,
  KeyRound,
  LayoutDashboard,
  LineChart,
  Newspaper,
  PieChart,
  Radar,
  Shield,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  Webhook,
  Zap,
} from "lucide-react";
import type { Alert, Kpi, ModuleId, NavItem, StatCard } from "@/types/dashboard";

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "market-scanner", label: "Market Scanner", icon: Radar },
  { id: "on-chain", label: "On-Chain Intelligence", icon: Activity, expandable: true },
  { id: "smart-money", label: "Smart Money", icon: Users, badge: "NEW" },
  { id: "ai-signals", label: "AI Trade Signals", icon: Sparkles },
  { id: "chart-analysis", label: "Chart Analysis", icon: BarChart3 },
  { id: "news-sentiment", label: "News & Sentiment", icon: Newspaper },
  { id: "portfolio", label: "Portfolio", icon: Wallet, expandable: true },
  { id: "alerts", label: "Alerts", icon: Bell, expandable: true },
  { id: "reports", label: "Reports", icon: LineChart },
  { id: "api-access", label: "API Access", icon: KeyRound },
];

export const moduleMeta: Record<ModuleId, { kicker: string; title: string; subtitle: string }> = {
  dashboard: {
    kicker: "Agents watching wallets, charts, and sentiment",
    title: "Welcome back, TraderX",
    subtitle: "AI agents are analyzing 1,248 coins, 24/7, to find your next edge.",
  },
  "market-scanner": {
    kicker: "Live opportunity scanner",
    title: "Market Scanner",
    subtitle: "Rank coins by whale activity, exchange flow, momentum, and AI conviction.",
  },
  "on-chain": {
    kicker: "Wallets, flows, and exchange pressure",
    title: "On-Chain Intelligence",
    subtitle: "Monitor whale transfers, accumulation zones, and exchange netflow in one command center.",
  },
  "smart-money": {
    kicker: "Curated high-performing wallets",
    title: "Smart Money",
    subtitle: "Track top wallets, fund rotation, position changes, and high-conviction entries.",
  },
  "ai-signals": {
    kicker: "AI generated trade setup engine",
    title: "AI Trade Signals",
    subtitle: "Review high-confidence signals with entries, invalidation, risk, and agent reasoning.",
  },
  "chart-analysis": {
    kicker: "Technical analysis workspace",
    title: "Chart Analysis",
    subtitle: "Inspect price structure, RSI, MACD, moving averages, support, and resistance.",
  },
  "news-sentiment": {
    kicker: "Market narrative intelligence",
    title: "News & Sentiment",
    subtitle: "Watch social spikes, breaking news, narrative heat, and token sentiment shifts.",
  },
  portfolio: {
    kicker: "Position and risk control",
    title: "Portfolio",
    subtitle: "Review holdings, allocation, exposure, PnL, and AI risk notes for your account.",
  },
  alerts: {
    kicker: "Rules and notification center",
    title: "Alerts",
    subtitle: "Create, monitor, and route alerts for whales, breakouts, sentiment, and portfolio events.",
  },
  reports: {
    kicker: "Research and performance outputs",
    title: "Reports",
    subtitle: "Generate market summaries, trade reviews, wallet reports, and scheduled exports.",
  },
  "api-access": {
    kicker: "Developer access and integrations",
    title: "API Access",
    subtitle: "Manage API keys, usage, endpoints, webhooks, and platform integration health.",
  },
};

export const statCards: StatCard[] = [
  { label: "AI Opportunity Score", value: "78", sub: "Strong Opportunities", tone: "violet", chart: "line" },
  { label: "Smart Money Flow (24h)", value: "+$186.7M", sub: "Net Inflow", tone: "green", chart: "bars" },
  { label: "Exchange Net Flow (24h)", value: "-67,892 ETH", sub: "Net Outflow", tone: "green", chart: "bars" },
  { label: "Whale Transactions (24h)", value: "1,247", sub: "> $100K", tone: "cyan", chart: "line" },
  { label: "AI Signals (24h)", value: "32", sub: "High Confidence", tone: "violet", chart: "ring" },
];

export const moduleKpis: Record<Exclude<ModuleId, "dashboard">, Kpi[]> = {
  "market-scanner": [
    { label: "Assets Scanned", value: "1,248", sub: "Across 18 sectors", tone: "cyan", icon: Radar },
    { label: "Bullish Setups", value: "87", sub: "+19 since last scan", tone: "green", icon: TrendingUp },
    { label: "AI Confidence", value: "82%", sub: "Scanner average", tone: "violet", icon: Sparkles },
    { label: "Refresh Cycle", value: "5m", sub: "Next scan in 01:42", tone: "amber", icon: Timer },
  ],
  "on-chain": [
    { label: "Net Exchange Flow", value: "-$421M", sub: "Risk-off supply leaving", tone: "green", icon: ArrowDownRight },
    { label: "Whale Transfers", value: "1,247", sub: "Above $100K", tone: "cyan", icon: Activity },
    { label: "Accumulation Events", value: "38", sub: "ETH, SOL, ARB leading", tone: "violet", icon: Wallet },
    { label: "Risk Flags", value: "6", sub: "Large deposits detected", tone: "rose", icon: AlertTriangle },
  ],
  "smart-money": [
    { label: "Tracked Wallets", value: "100", sub: "Curated top performers", tone: "cyan", icon: Users },
    { label: "Net Buys", value: "$186.7M", sub: "24h smart money flow", tone: "green", icon: TrendingUp },
    { label: "Fresh Entries", value: "14", sub: "New positions opened", tone: "violet", icon: Sparkles },
    { label: "Exit Signals", value: "5", sub: "Profit-taking clusters", tone: "amber", icon: TrendingDown },
  ],
  "ai-signals": [
    { label: "Live Signals", value: "32", sub: "High confidence", tone: "violet", icon: Sparkles },
    { label: "Bullish Bias", value: "68%", sub: "Across active signals", tone: "green", icon: TrendingUp },
    { label: "Avg R:R", value: "2.8x", sub: "Risk reward profile", tone: "cyan", icon: Gauge },
    { label: "Invalidations", value: "4", sub: "Stops triggered today", tone: "rose", icon: Shield },
  ],
  "chart-analysis": [
    { label: "Charts Watched", value: "84", sub: "Auto technical scan", tone: "cyan", icon: BarChart3 },
    { label: "Breakouts", value: "12", sub: "Volume confirmed", tone: "green", icon: TrendingUp },
    { label: "RSI Overheated", value: "9", sub: "Watch pullback risk", tone: "amber", icon: Gauge },
    { label: "Bearish Crosses", value: "3", sub: "MACD warning", tone: "rose", icon: TrendingDown },
  ],
  "news-sentiment": [
    { label: "Sentiment Score", value: "74", sub: "Positive market tone", tone: "green", icon: Flame },
    { label: "News Items", value: "312", sub: "Scanned this hour", tone: "cyan", icon: Newspaper },
    { label: "Social Spikes", value: "18", sub: "Narrative acceleration", tone: "violet", icon: Globe2 },
    { label: "Risk Headlines", value: "5", sub: "Regulatory and exploit watch", tone: "rose", icon: AlertTriangle },
  ],
  portfolio: [
    { label: "Portfolio Value", value: "$84,291", sub: "+6.8% this week", tone: "green", icon: Wallet },
    { label: "Open Positions", value: "12", sub: "8 spot, 4 watch-only", tone: "cyan", icon: ClipboardList },
    { label: "Risk Score", value: "42", sub: "Moderate exposure", tone: "amber", icon: Shield },
    { label: "AI Suggestions", value: "7", sub: "Rebalance and hedge notes", tone: "violet", icon: Brain },
  ],
  alerts: [
    { label: "Active Rules", value: "26", sub: "Whales, TA, sentiment", tone: "cyan", icon: Bell },
    { label: "Triggered Today", value: "42", sub: "12 high priority", tone: "violet", icon: Zap },
    { label: "Delivery Health", value: "99%", sub: "Email, Telegram, in-app", tone: "green", icon: BadgeCheck },
    { label: "Muted Rules", value: "4", sub: "Paused by user", tone: "amber", icon: Shield },
  ],
  reports: [
    { label: "Generated Reports", value: "18", sub: "This week", tone: "cyan", icon: ClipboardList },
    { label: "Win Review", value: "64%", sub: "Signal follow-through", tone: "green", icon: Gauge },
    { label: "Scheduled Exports", value: "6", sub: "Daily and weekly", tone: "violet", icon: Download },
    { label: "Research Notes", value: "41", sub: "AI summaries saved", tone: "amber", icon: Newspaper },
  ],
  "api-access": [
    { label: "API Requests", value: "82.4K", sub: "This month", tone: "cyan", icon: Code2 },
    { label: "Success Rate", value: "99.8%", sub: "Healthy responses", tone: "green", icon: BadgeCheck },
    { label: "Active Keys", value: "3", sub: "1 production, 2 test", tone: "violet", icon: KeyRound },
    { label: "Webhook Events", value: "1.9K", sub: "Delivered today", tone: "amber", icon: Webhook },
  ],
};

export const alerts: Alert[] = [
  {
    icon: Wallet,
    title: "Whale Accumulation",
    body: "Whale 0x7F...3A2B accumulated 12,540 ETH ($33.2M)",
    time: "2m ago",
    tone: "text-emerald-300 bg-emerald-400/10",
  },
  {
    icon: TrendingUp,
    title: "Exchange Outflow",
    body: "67,892 ETH moved out of exchanges (Bullish)",
    time: "5m ago",
    tone: "text-cyan-300 bg-cyan-400/10",
  },
  {
    icon: Users,
    title: "Smart Money Buy",
    body: "Smart Money wallet 0x1A2...9cF3 bought $2.8M in ARB",
    time: "8m ago",
    tone: "text-emerald-300 bg-emerald-400/10",
  },
  {
    icon: Sparkles,
    title: "Breakout Alert",
    body: "SOL broke above $170 resistance with volume breakout",
    time: "15m ago",
    tone: "text-violet-300 bg-violet-400/10",
  },
  {
    icon: Flame,
    title: "Social Sentiment Spike",
    body: "Positive sentiment spike detected for LINK across social feeds",
    time: "17m ago",
    tone: "text-amber-300 bg-amber-400/10",
  },
];

export const opportunities = [
  { coin: "ETH", name: "Ethereum", score: 87, trend: "M26 48 L46 42 L66 44 L86 34 L106 28 L126 16", tone: "from-slate-300 to-slate-500" },
  { coin: "ARB", name: "Arbitrum", score: 82, trend: "M26 50 L46 47 L66 38 L86 34 L106 22 L126 18", tone: "from-cyan-300 to-blue-500" },
  { coin: "SOL", name: "Solana", score: 80, trend: "M26 52 L46 45 L66 47 L86 38 L106 30 L126 20", tone: "from-emerald-300 to-violet-500" },
  { coin: "LINK", name: "Chainlink", score: 76, trend: "M26 49 L46 44 L66 39 L86 41 L106 28 L126 23", tone: "from-blue-300 to-cyan-500" },
  { coin: "OP", name: "Optimism", score: 72, trend: "M26 56 L46 49 L66 44 L86 38 L106 36 L126 24", tone: "from-rose-300 to-red-500" },
];

export const scannerRows = [
  { coin: "ETH", sector: "L1", score: 87, smart: "+$33.2M", whale: "Heavy Buy", exchange: "-18.4K ETH", ta: "Breakout", momentum: "Rising", signal: "Bullish" },
  { coin: "ARB", sector: "L2", score: 82, smart: "+$2.8M", whale: "Accumulating", exchange: "-$9.1M", ta: "Trend Up", momentum: "Rising", signal: "Bullish" },
  { coin: "SOL", sector: "L1", score: 80, smart: "+$7.4M", whale: "Buy Cluster", exchange: "-$14.7M", ta: "Resistance Break", momentum: "Fast", signal: "Bullish" },
  { coin: "LINK", sector: "Oracle", score: 76, smart: "+$4.2M", whale: "Steady Buy", exchange: "-$3.5M", ta: "MA Cross", momentum: "Rising", signal: "Bullish" },
  { coin: "OP", sector: "L2", score: 72, smart: "+$1.6M", whale: "Mixed", exchange: "-$1.1M", ta: "Retest", momentum: "Stable", signal: "Watch" },
  { coin: "BTC", sector: "Store", score: 69, smart: "-$6.8M", whale: "Neutral", exchange: "+$11.2M", ta: "Range", momentum: "Cooling", signal: "Neutral" },
];

export const smartMoneyRows = [
  { wallet: "0x7F39...a7F1", tags: "Smart Money", action: "Accumulated", asset: "ETH", amount: "12,540", value: "$33.2M", time: "2m ago" },
  { wallet: "0x1A2b...9cF3", tags: "Smart Money", action: "Bought", asset: "ARB", amount: "1,250,000", value: "$2.8M", time: "8m ago" },
  { wallet: "0x93E1...0b41", tags: "Whale", action: "Accumulated", asset: "SOL", amount: "42,800", value: "$7.4M", time: "11m ago" },
  { wallet: "0x56Ba...D22c", tags: "Fund", action: "Moved Out", asset: "ETH", amount: "8,720", value: "$23.1M", time: "18m ago" },
];

export const signalCards = [
  { coin: "ETH", side: "Long", entry: "$2,640 - $2,680", target: "$2,880", stop: "$2,520", confidence: 87, reason: "Exchange outflow and trendline continuation confirmed." },
  { coin: "SOL", side: "Long", entry: "$168 - $172", target: "$190", stop: "$160", confidence: 80, reason: "Breakout above resistance with rising social momentum." },
  { coin: "ARB", side: "Long", entry: "$2.14 - $2.21", target: "$2.48", stop: "$2.02", confidence: 82, reason: "Smart money entry cluster detected across tracked wallets." },
];
