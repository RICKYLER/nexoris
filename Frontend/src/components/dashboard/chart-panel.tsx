"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minus, Settings, Wifi, X } from "lucide-react";

type TradingTab = "positions" | "orders" | "order-history" | "balance-history" | "trading-journal";

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

const tradingViewConfig = {
  autosize: true,
  symbol: "BINANCE:ETHUSDT",
  interval: "15",
  timezone: "Etc/UTC",
  theme: "dark",
  style: "1",
  locale: "en",
  enable_publishing: false,
  allow_symbol_change: true,
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

export function ChartPanel() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [activeRange, setActiveRange] = useState("15m");
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<TradingTab>("positions");
  const [positions, setPositions] = useState<PositionRow[]>(initialPositions);
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);

  const config = useMemo(
    () => ({
      ...tradingViewConfig,
      interval: activeRange.replace("m", ""),
    }),
    [activeRange],
  );

  useEffect(() => {
    const container = widgetRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = "";

    const widgetSlot = document.createElement("div");
    widgetSlot.className = "tradingview-widget-container__widget";
    widgetSlot.style.height = "100%";
    widgetSlot.style.width = "100%";

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify(config);

    container.appendChild(widgetSlot);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [config, widgetKey]);

  return (
    <section className="panel mb-4 overflow-hidden">
      <div className="flex flex-col gap-3 border-b glass-line px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <EthereumIcon />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-black text-white">Ethereum / Tether (ETHUSDT)</h2>
              <span className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-black text-emerald-300">BINANCE</span>
              <span className="flex items-center gap-1 rounded bg-emerald-400/10 px-2 py-1 text-[10px] font-black uppercase text-emerald-300">
                <Wifi className="h-3 w-3" />
                TradingView Live
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Embedded TradingView Advanced Chart widget with exchange market data.</div>
          </div>
        </div>

        <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
          {["1m", "5m", "15m", "1H", "4H", "1D"].map((item) => (
            <button
              className={`h-9 min-w-10 rounded-md px-3 text-xs font-black transition ${
                item === activeRange ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
              key={item}
              onClick={() => setActiveRange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-slate-400 hover:bg-white/[0.04] hover:text-white"
            onClick={() => setWidgetKey((current) => current + 1)}
            type="button"
            aria-label="Reload TradingView chart"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative h-[560px] min-h-[560px] overflow-hidden bg-[#070d1a]">
        <div
          ref={widgetRef}
          className="tradingview-widget-container h-full w-full"
          style={{ height: "100%", width: "100%" }}
        />
      </div>

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

function EthereumIcon() {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#627eea] shadow-[0_0_18px_rgba(98,126,234,0.35)]" aria-hidden="true">
      <svg className="h-7 w-7" viewBox="0 0 64 64" role="img">
        <path d="M32 4 15 32 32 24 49 32 32 4Z" fill="#ffffff" fillOpacity="0.94" />
        <path d="M32 4v20l17 8L32 4Z" fill="#dbe4ff" fillOpacity="0.78" />
        <path d="M15 36 32 46 49 36 32 60 15 36Z" fill="#ffffff" fillOpacity="0.95" />
        <path d="M32 46v14l17-24-17 10Z" fill="#dbe4ff" fillOpacity="0.78" />
        <path d="M15 32 32 24 49 32 32 42 15 32Z" fill="#b9c7ff" />
        <path d="M32 24v18l17-10-17-8Z" fill="#8fa4ff" />
      </svg>
    </div>
  );
}

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
