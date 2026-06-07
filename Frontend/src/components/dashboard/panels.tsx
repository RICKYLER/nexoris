import { ArrowUpRight, Gauge, Radar, Shield, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { alerts, opportunities, smartMoneyRows, statCards } from "@/data/dashboard-data";
import { CoinBadge, PanelTitle, StatVisual, toneText } from "@/components/dashboard/ui";

export function StatsGrid() {
  return (
    <section className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map((stat) => (
        <article className="panel min-h-[132px] p-4" key={stat.label}>
          <div className="mb-2 text-xs font-bold text-slate-400">{stat.label}</div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className={`text-2xl font-black tracking-normal ${toneText[stat.tone]}`}>
                {stat.value}
                {stat.label === "AI Opportunity Score" ? <span className="ml-1 text-xs text-slate-500">/100</span> : null}
              </div>
              <div className="mt-1 text-xs text-slate-500">{stat.sub}</div>
            </div>
            <StatVisual chart={stat.chart} tone={stat.tone} />
          </div>
        </article>
      ))}
    </section>
  );
}

export function AgentNetwork() {
  const agentCards = [
    { name: "Whale Agent", detail: "Monitoring 1.2M wallets", icon: Radar, tone: "text-violet-300" },
    { name: "TA Agent", detail: "Analyzing charts", icon: TrendingUp, tone: "text-cyan-300" },
    { name: "Sentiment Agent", detail: "Scanning markets", icon: Sparkles, tone: "text-emerald-300" },
    { name: "Risk Agent", detail: "Managing risk", icon: Shield, tone: "text-violet-300" },
    { name: "Decision Agent", detail: "Generating signals", icon: Sparkles, tone: "text-amber-300" },
  ];

  return (
    <section className="panel mb-4 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">Nexoris AI Agent Network</h2>
          <span className="text-xs font-bold text-emerald-300">All systems active</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(0,229,168,0.9)]" />
          Live
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {agentCards.map((agent) => {
          const Icon = agent.icon;

          return (
            <article className="mini-panel p-4" key={agent.name}>
              <div className="mb-3 flex items-center gap-3">
                <div className={`grid h-9 w-9 place-items-center rounded-md bg-white/[0.04] ${agent.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-200">{agent.name}</h3>
                  <p className="mt-1 text-[11px] text-slate-500">{agent.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Active
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function SmartMoneyTable() {
  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b glass-line px-4 py-3">
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">Smart Money Movements</h2>
        <button className="text-xs font-bold text-violet-300" type="button">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Wallet", "Tags", "Action", "Asset", "Amount", "Value (USD)", "Time"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {smartMoneyRows.map((row) => (
              <tr className="text-slate-300 transition hover:bg-white/[0.025]" key={`${row.wallet}-${row.time}`}>
                <td className="border-b glass-line px-4 py-3 font-mono text-xs text-slate-400">{row.wallet}</td>
                <td className="border-b glass-line px-4 py-3">
                  <span className="rounded bg-violet-400/10 px-2 py-1 text-xs font-bold text-violet-300">{row.tags}</span>
                </td>
                <td className={`border-b glass-line px-4 py-3 font-bold ${row.action === "Moved Out" ? "text-cyan-300" : row.action === "Bought" ? "text-emerald-300" : "text-rose-300"}`}>{row.action}</td>
                <td className="border-b glass-line px-4 py-3 font-black text-slate-100">{row.asset}</td>
                <td className="border-b glass-line px-4 py-3">{row.amount}</td>
                <td className="border-b glass-line px-4 py-3 font-bold text-slate-100">{row.value}</td>
                <td className="border-b glass-line px-4 py-3 text-slate-500">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function MarketRegime() {
  return (
    <section className="panel mb-4 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-200">AI Market Regime</h2>
          <div className="mt-1 text-xl font-black text-emerald-300">Bullish</div>
          <div className="text-xs font-bold text-slate-500">Confidence: 72%</div>
        </div>
        <Gauge className="h-10 w-10 text-emerald-300" />
      </div>
      <svg className="h-16 w-full" viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 54 C28 48 42 36 66 42 S108 52 136 34 180 24 214 26 252 18 300 8" fill="none" stroke="#00e5a8" strokeWidth="4" />
        <path d="M0 54 C28 48 42 36 66 42 S108 52 136 34 180 24 214 26 252 18 300 8 L300 70 L0 70 Z" fill="rgba(0,229,168,0.15)" />
      </svg>
    </section>
  );
}

export function AlertsPanel() {
  return (
    <section className="panel mb-4 overflow-hidden">
      <div className="flex items-center justify-between border-b glass-line px-4 py-3">
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">Real-Time Alerts</h2>
        <button className="text-xs font-bold text-violet-300" type="button">View all</button>
      </div>
      <div>
        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <article className="flex gap-3 border-b glass-line px-4 py-4 last:border-b-0" key={`${alert.title}-${alert.time}`}>
              <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${alert.tone}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-black text-slate-100">{alert.title}</h3>
                  <span className="shrink-0 text-[11px] font-semibold text-slate-500">{alert.time}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-slate-400">{alert.body}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function OpportunitiesPanel() {
  return (
    <section className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b glass-line px-4 py-3">
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">Top AI Opportunities</h2>
        <button className="text-xs font-bold text-violet-300" type="button">View all</button>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-[1fr_58px_96px_68px] gap-2 pb-2 text-[10px] font-black uppercase text-slate-500">
          <span>Coin</span>
          <span>Score</span>
          <span>Trend</span>
          <span className="text-right">Action</span>
        </div>
        <div className="space-y-2">
          {opportunities.map((coin) => (
            <article className="grid grid-cols-[1fr_58px_96px_68px] items-center gap-2 rounded-md py-2" key={coin.coin}>
              <div className="flex min-w-0 items-center gap-3">
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br ${coin.tone} text-xs font-black text-white`}>
                  {coin.coin.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-black text-slate-100">{coin.coin}</div>
                  <div className="truncate text-xs text-slate-500">{coin.name}</div>
                </div>
              </div>
              <div className="text-lg font-black text-emerald-300">{coin.score}</div>
              <svg className="h-12 w-24" viewBox="0 0 140 64" aria-hidden="true">
                <path d={coin.trend} fill="none" stroke="#00e5a8" strokeWidth="4" strokeLinecap="round" />
                <path d={`${coin.trend} L126 64 L26 64 Z`} fill="rgba(0,229,168,0.12)" />
              </svg>
              <div className="text-right text-xs font-black text-emerald-300">Bullish</div>
            </article>
          ))}
        </div>
      </div>
      <div className="border-t glass-line p-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-500" type="button">
          View All Opportunities
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

export function WhaleActivityList() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Whale Transactions" action="Live" icon={Wallet} />
      <div className="space-y-3">
        {[
          { coin: "ETH", body: "12,540 ETH accumulated from Coinbase Prime", value: "$33.2M", tone: "text-emerald-300" },
          { coin: "SOL", body: "42,800 SOL moved to cold wallet cluster", value: "$7.4M", tone: "text-cyan-300" },
          { coin: "ARB", body: "Smart wallet opened new position", value: "$2.8M", tone: "text-violet-300" },
          { coin: "BTC", body: "Deposit to Binance hot wallet", value: "$11.2M", tone: "text-rose-300" },
        ].map((item) => (
          <div className="mini-panel flex items-center justify-between gap-3 p-4" key={`${item.coin}-${item.value}`}>
            <div className="flex min-w-0 items-center gap-3">
              <CoinBadge coin={item.coin} />
              <p className="min-w-0 text-sm text-slate-400">{item.body}</p>
            </div>
            <span className={`shrink-0 text-sm font-black ${item.tone}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
