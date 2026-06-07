import { PieChart, Shield, Wallet } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { CoinBadge, InsightCard, ModuleKpiGrid, ModuleStack, PanelTitle, TwoColumn } from "@/components/dashboard/ui";

export function PortfolioView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis.portfolio} />
      <TwoColumn>
        <PortfolioAllocation />
        <RiskNotes />
      </TwoColumn>
      <PortfolioTable />
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
        <PanelTitle title="Positions" action="Synced" icon={Wallet} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Asset", "Amount", "Avg Entry", "Current", "PnL", "AI Note"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["ETH", "18.4", "$2,410", "$2,665", "+$4,692", "Hold trendline"],
              ["SOL", "310", "$142", "$171", "+$8,990", "Trim near $190"],
              ["ARB", "8,200", "$1.91", "$2.18", "+$2,214", "Smart money support"],
              ["LINK", "1,120", "$15.20", "$17.80", "+$2,912", "Watch sentiment"],
            ].map(([asset, amount, entry, current, pnl, note]) => (
              <tr className="text-slate-300" key={asset}>
                <td className="border-b glass-line px-4 py-3"><CoinBadge coin={asset} /></td>
                <td className="border-b glass-line px-4 py-3">{amount}</td>
                <td className="border-b glass-line px-4 py-3">{entry}</td>
                <td className="border-b glass-line px-4 py-3">{current}</td>
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
