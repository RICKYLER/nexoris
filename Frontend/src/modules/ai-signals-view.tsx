import { Brain, Sparkles } from "lucide-react";
import { moduleKpis, signalCards } from "@/data/dashboard-data";
import { CoinBadge, InfoLine, ModuleKpiGrid, ModuleStack, PanelTitle, ProgressRow, TwoColumn } from "@/components/dashboard/ui";

export function AiSignalsView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["ai-signals"]} />
      <section className="grid gap-3 xl:grid-cols-3">
        {signalCards.map((signal) => (
          <SignalCard key={signal.coin} {...signal} />
        ))}
      </section>
      <TwoColumn>
        <AgentDecisionMatrix />
        <TradeSetupTable />
      </TwoColumn>
    </ModuleStack>
  );
}

function SignalCard({
  coin,
  side,
  entry,
  target,
  stop,
  confidence,
  reason,
}: {
  coin: string;
  side: string;
  entry: string;
  target: string;
  stop: string;
  confidence: number;
  reason: string;
}) {
  return (
    <article className="panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <CoinBadge coin={coin} />
        <span className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-black text-emerald-300">{side}</span>
      </div>
      <div className="grid gap-3 text-sm">
        <InfoLine label="Entry" value={entry} />
        <InfoLine label="Target" value={target} tone="text-emerald-300" />
        <InfoLine label="Stop" value={stop} tone="text-rose-300" />
      </div>
      <div className="my-4">
        <ProgressRow label="Confidence" value={confidence} tone="bg-violet-400" />
      </div>
      <p className="text-xs leading-5 text-slate-400">{reason}</p>
    </article>
  );
}

function AgentDecisionMatrix() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Agent Decision Matrix" action="Consensus" icon={Brain} />
      <div className="space-y-3">
        {[
          { label: "Whale Agent", value: 86, tone: "bg-violet-400" },
          { label: "TA Agent", value: 78, tone: "bg-cyan-400" },
          { label: "Sentiment Agent", value: 74, tone: "bg-emerald-400" },
          { label: "Risk Agent", value: 62, tone: "bg-amber-400" },
          { label: "Decision Agent", value: 82, tone: "bg-violet-400" },
        ].map((item) => (
          <ProgressRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

function TradeSetupTable() {
  return (
    <section className="panel overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="Signal Queue" action="Auto-ranked" icon={Sparkles} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {["Coin", "Setup", "Confidence", "Risk", "Status"].map((head) => (
                <th className="border-b glass-line px-4 py-3 font-black" key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["ETH", "Trendline continuation", "87", "Medium", "Active"],
              ["SOL", "Resistance breakout", "80", "Medium", "Active"],
              ["ARB", "Smart money entry", "82", "Low", "Active"],
              ["LINK", "Sentiment spike", "76", "Medium", "Watching"],
            ].map(([coin, setup, confidence, risk, status]) => (
              <tr className="text-slate-300" key={coin}>
                <td className="border-b glass-line px-4 py-3"><CoinBadge coin={coin} /></td>
                <td className="border-b glass-line px-4 py-3">{setup}</td>
                <td className="border-b glass-line px-4 py-3 font-black text-emerald-300">{confidence}</td>
                <td className="border-b glass-line px-4 py-3">{risk}</td>
                <td className="border-b glass-line px-4 py-3 text-violet-300">{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
