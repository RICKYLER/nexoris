import { BookOpen, ClipboardList, History, PieChart, Shield, TrendingUp, Wallet } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { CoinBadge, InsightCard, ModuleKpiGrid, ModuleStack, PanelTitle, ProgressRow, TwoColumn } from "@/components/dashboard/ui";

export function PortfolioView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis.portfolio} />
      <TwoColumn>
        <PortfolioAllocation />
        <RiskNotes />
      </TwoColumn>
      <PortfolioTable />
      <TwoColumn>
        <ActiveOrders />
        <BalanceHistory />
      </TwoColumn>
      <OrderHistory />
      <TradingJournal />
    </ModuleStack>
  );
}

function PortfolioAllocation() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Allocation" action="$84,291" icon={PieChart} />
      <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
        <div className="donut-ring mx-auto h-40 w-40 rounded-full" />
        <div className="space-y-3">
          {[
            ["ETH", "42%", "text-emerald-300"],
            ["BTC", "24%", "text-cyan-300"],
            ["SOL", "18%", "text-violet-300"],
            ["ARB/LINK", "16%", "text-amber-300"],
          ].map(([coin, value, tone]) => (
            <div className="mini-panel flex items-center justify-between p-3" key={coin}>
              <span className="text-sm font-black text-slate-100">{coin}</span>
              <span className={`text-sm font-black ${tone}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RiskNotes() {
  return (
    <section className="panel p-4">
      <PanelTitle title="AI Risk Notes" action="Moderate" icon={Shield} />
      <div className="space-y-3">
        {[
          { title: "ETH concentration", value: "42%", body: "Portfolio is leaning toward ETH beta after recent buys.", tone: "amber" as const },
          { title: "SOL upside", value: "+18%", body: "Momentum and breakout signal support current allocation.", tone: "green" as const },
          { title: "Stable buffer", value: "9%", body: "Cash buffer is below preferred swing-trading range.", tone: "rose" as const },
        ].map((item) => (
          <InsightCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

function PortfolioTable() {
  return (
    <section className="panel overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="Open Positions" action="Synced" icon={Wallet} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Asset", "Side", "Size", "Avg Entry", "Mark", "Liq. Risk", "Unrealized PnL", "AI Note"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["ETH", "Long", "18.4 ETH", "$2,410", "$2,665", "Low", "+$4,692", "Hold trendline"],
              ["SOL", "Long", "310 SOL", "$142", "$171", "Medium", "+$8,990", "Trim near $190"],
              ["ARB", "Long", "8,200 ARB", "$1.91", "$2.18", "Low", "+$2,214", "Smart money support"],
              ["LINK", "Long", "1,120 LINK", "$15.20", "$17.80", "Medium", "+$2,912", "Watch sentiment"],
            ].map(([asset, side, size, entry, mark, risk, pnl, note]) => (
              <tr className="text-slate-300" key={asset}>
                <td className="border-b glass-line px-4 py-3"><CoinBadge coin={asset} /></td>
                <td className="border-b glass-line px-4 py-3 font-black text-emerald-300">{side}</td>
                <td className="border-b glass-line px-4 py-3">{size}</td>
                <td className="border-b glass-line px-4 py-3">{entry}</td>
                <td className="border-b glass-line px-4 py-3">{mark}</td>
                <td className={`border-b glass-line px-4 py-3 font-bold ${risk === "Low" ? "text-emerald-300" : "text-amber-300"}`}>{risk}</td>
                <td className="border-b glass-line px-4 py-3 font-black text-emerald-300">{pnl}</td>
                <td className="border-b glass-line px-4 py-3 text-slate-400">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ActiveOrders() {
  return (
    <section className="panel overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="Active Orders" action="5 open" icon={ClipboardList} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Pair", "Type", "Side", "Price", "Amount", "Filled", "Status"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["ETHUSDT", "Limit", "Buy", "$2,610", "4.2 ETH", "0%", "Open"],
              ["SOLUSDT", "Take Profit", "Sell", "$190", "120 SOL", "0%", "Open"],
              ["ARBUSDT", "Stop", "Sell", "$2.02", "3,500 ARB", "0%", "Armed"],
              ["LINKUSDT", "Limit", "Buy", "$16.90", "400 LINK", "35%", "Partial"],
            ].map(([pair, type, side, price, amount, filled, status]) => (
              <tr className="text-slate-300" key={`${pair}-${type}-${price}`}>
                <td className="border-b glass-line px-4 py-3 font-black text-slate-100">{pair}</td>
                <td className="border-b glass-line px-4 py-3">{type}</td>
                <td className={`border-b glass-line px-4 py-3 font-black ${side === "Buy" ? "text-emerald-300" : "text-rose-300"}`}>{side}</td>
                <td className="border-b glass-line px-4 py-3">{price}</td>
                <td className="border-b glass-line px-4 py-3">{amount}</td>
                <td className="border-b glass-line px-4 py-3">{filled}</td>
                <td className="border-b glass-line px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs font-black ${status === "Partial" ? "bg-amber-400/10 text-amber-300" : "bg-violet-400/10 text-violet-300"}`}>{status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BalanceHistory() {
  const points = [48, 54, 52, 61, 58, 66, 72, 70, 76, 82, 80, 88];

  return (
    <section className="panel p-4">
      <PanelTitle title="Balance History" action="+18.4% 30D" icon={TrendingUp} />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="mini-panel p-3">
          <div className="text-[10px] font-black uppercase text-slate-500">Equity</div>
          <div className="mt-1 text-lg font-black text-slate-100">$84,291</div>
        </div>
        <div className="mini-panel p-3">
          <div className="text-[10px] font-black uppercase text-slate-500">Available</div>
          <div className="mt-1 text-lg font-black text-emerald-300">$19,820</div>
        </div>
        <div className="mini-panel p-3">
          <div className="text-[10px] font-black uppercase text-slate-500">Margin Used</div>
          <div className="mt-1 text-lg font-black text-amber-300">21%</div>
        </div>
      </div>
      <svg className="h-44 w-full" viewBox="0 0 420 180" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="balanceFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,229,168,0.34)" />
            <stop offset="100%" stopColor="rgba(0,229,168,0.02)" />
          </linearGradient>
        </defs>
        <path
          d={`M0 ${170 - points[0]} ${points.map((point, index) => `L${index * 38} ${170 - point}`).join(" ")} L420 180 L0 180 Z`}
          fill="url(#balanceFill)"
        />
        <path
          d={`M0 ${170 - points[0]} ${points.map((point, index) => `L${index * 38} ${170 - point}`).join(" ")}`}
          fill="none"
          stroke="#00e5a8"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
      <div className="mt-4 space-y-3">
        <ProgressRow label="Spot allocation" value={64} tone="bg-emerald-400" />
        <ProgressRow label="Stable reserve" value={23} tone="bg-cyan-400" />
        <ProgressRow label="Open trade exposure" value={38} tone="bg-violet-400" />
      </div>
    </section>
  );
}

function OrderHistory() {
  return (
    <section className="panel overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="Order History" action="Last 24h" icon={History} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Time", "Pair", "Type", "Side", "Price", "Amount", "Fee", "Result"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["14:22", "ETHUSDT", "Market", "Buy", "$2,664", "2.1 ETH", "$4.12", "Filled"],
              ["13:48", "SOLUSDT", "Limit", "Buy", "$168.20", "90 SOL", "$2.84", "Filled"],
              ["12:31", "BTCUSDT", "Stop", "Sell", "$63,020", "0.08 BTC", "$3.98", "Cancelled"],
              ["11:05", "ARBUSDT", "Limit", "Buy", "$2.15", "4,700 ARB", "$1.91", "Filled"],
              ["09:44", "LINKUSDT", "Take Profit", "Sell", "$18.10", "240 LINK", "$1.08", "Filled"],
            ].map(([time, pair, type, side, price, amount, fee, result]) => (
              <tr className="text-slate-300" key={`${time}-${pair}-${type}`}>
                <td className="border-b glass-line px-4 py-3 text-slate-500">{time}</td>
                <td className="border-b glass-line px-4 py-3 font-black text-slate-100">{pair}</td>
                <td className="border-b glass-line px-4 py-3">{type}</td>
                <td className={`border-b glass-line px-4 py-3 font-black ${side === "Buy" ? "text-emerald-300" : "text-rose-300"}`}>{side}</td>
                <td className="border-b glass-line px-4 py-3">{price}</td>
                <td className="border-b glass-line px-4 py-3">{amount}</td>
                <td className="border-b glass-line px-4 py-3">{fee}</td>
                <td className="border-b glass-line px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs font-black ${result === "Cancelled" ? "bg-slate-400/10 text-slate-300" : "bg-emerald-400/10 text-emerald-300"}`}>{result}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TradingJournal() {
  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b glass-line px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <PanelTitle title="Trading Journal" action="AI assisted" icon={BookOpen} />
        <button className="w-fit rounded-md bg-violet-600 px-3 py-2 text-xs font-black text-white transition hover:bg-violet-500" type="button">
          New Journal Entry
        </button>
      </div>
      <div className="grid gap-3 p-4 xl:grid-cols-3">
        {[
          {
            title: "ETH breakout continuation",
            meta: "Long ETHUSDT | +4.8R | 14:22",
            body: "Entered after exchange outflow and trendline retest. Followed plan; next improvement is scaling out earlier at resistance.",
            tone: "green",
          },
          {
            title: "SOL partial take profit",
            meta: "Long SOLUSDT | +2.1R | 13:48",
            body: "Good entry near support. AI flagged social momentum spike; manually trimmed 38% before the first target.",
            tone: "cyan",
          },
          {
            title: "BTC stop order cancelled",
            meta: "BTCUSDT | No trade | 12:31",
            body: "Cancelled because price reclaimed VWAP and smart money pressure was neutral. Avoided low-quality short.",
            tone: "amber",
          },
        ].map((entry) => (
          <article className="mini-panel p-4" key={entry.title}>
            <div className="mb-2 flex items-start justify-between gap-3">
              <h3 className="text-sm font-black text-slate-100">{entry.title}</h3>
              <span className={`rounded px-2 py-1 text-[10px] font-black uppercase ${
                entry.tone === "green" ? "bg-emerald-400/10 text-emerald-300" : entry.tone === "cyan" ? "bg-cyan-400/10 text-cyan-300" : "bg-amber-400/10 text-amber-300"
              }`}>
                {entry.tone === "amber" ? "Review" : "Win"}
              </span>
            </div>
            <div className="mb-3 text-xs font-bold text-slate-500">{entry.meta}</div>
            <p className="text-xs leading-5 text-slate-400">{entry.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
