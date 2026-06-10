import { Gauge, Radar } from "lucide-react";
import { moduleKpis, scannerRows } from "@/data/dashboard-data";
import { CoinBadge, ModuleKpiGrid, ModuleStack, PanelTitle, ProgressRow, ScorePill, TwoColumn } from "@/components/dashboard/ui";
import { MobileScannerCards } from "../../mobile/components/market-scanner-mobile";

export function MarketScannerView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["market-scanner"]} />
      <section className="panel p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">AI Opportunity Scanner</h2>
            <p className="mt-1 text-xs text-slate-500">Weighted score: 40% on-chain, 40% technicals, 20% momentum.</p>
          </div>
          <div className="hide-scrollbar flex gap-2 overflow-x-auto">
            {["All", "Bullish", "L1", "L2", "DeFi", "Watch"].map((filter) => (
              <button
                className={`h-9 rounded-md px-3 text-xs font-black transition ${filter === "All" ? "bg-violet-600 text-white" : "mini-panel text-slate-400 hover:text-white"}`}
                key={filter}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        <ScannerTable />
      </section>
      <TwoColumn>
        <ScoreBreakdown />
        <ScanQueue />
      </TwoColumn>
    </ModuleStack>
  );
}

function ScannerTable() {
  return (
    <>
      <MobileScannerCards rows={scannerRows} />

      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Coin", "Sector", "Score", "Smart Money", "Whale", "Exchange Flow", "TA", "Momentum", "Signal"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scannerRows.map((row) => (
              <tr className="text-slate-300 transition hover:bg-white/[0.025]" key={row.coin}>
                <td className="border-b glass-line px-4 py-3"><CoinBadge coin={row.coin} /></td>
                <td className="border-b glass-line px-4 py-3 text-slate-400">{row.sector}</td>
                <td className="border-b glass-line px-4 py-3"><ScorePill score={row.score} /></td>
                <td className="border-b glass-line px-4 py-3 font-bold text-emerald-300">{row.smart}</td>
                <td className="border-b glass-line px-4 py-3">{row.whale}</td>
                <td className={`border-b glass-line px-4 py-3 font-bold ${row.exchange.startsWith("-") ? "text-emerald-300" : "text-rose-300"}`}>{row.exchange}</td>
                <td className="border-b glass-line px-4 py-3">{row.ta}</td>
                <td className="border-b glass-line px-4 py-3">{row.momentum}</td>
                <td className="border-b glass-line px-4 py-3">
                  <span className={`rounded px-2 py-1 text-xs font-black ${row.signal === "Bullish" ? "bg-emerald-400/10 text-emerald-300" : row.signal === "Watch" ? "bg-amber-400/10 text-amber-300" : "bg-slate-400/10 text-slate-300"}`}>
                    {row.signal}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ScoreBreakdown() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Score Breakdown" icon={Gauge} />
      <div className="space-y-4">
        {[
          { label: "On-Chain Strength", value: 84, tone: "bg-emerald-400" },
          { label: "Technical Structure", value: 79, tone: "bg-cyan-400" },
          { label: "Momentum", value: 72, tone: "bg-violet-400" },
          { label: "Risk Control", value: 64, tone: "bg-amber-400" },
        ].map((item) => (
          <ProgressRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

function ScanQueue() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Live Scan Queue" action="Running" icon={Radar} />
      <div className="space-y-3">
        {[
          ["Whale transfer classifier", "Scanning 1.2M wallets", "94%"],
          ["Technical signal engine", "Calculating RSI and MACD", "78%"],
          ["Sentiment processor", "Reading social feeds", "52%"],
          ["Decision agent", "Merging ranked signals", "31%"],
        ].map(([title, body, value]) => (
          <div className="mini-panel p-4" key={title}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-slate-100">{title}</div>
                <div className="mt-1 text-xs text-slate-500">{body}</div>
              </div>
              <span className="text-sm font-black text-violet-300">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
