import { ArrowDownRight, Download } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { InsightCard, Metric, ModuleKpiGrid, ModuleStack, PanelTitle, TwoColumn } from "@/components/dashboard/ui";
import { WhaleActivityList } from "@/components/dashboard/panels";

export function OnChainView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["on-chain"]} />
      <TwoColumn>
        <ExchangeFlowPanel />
        <WhaleActivityList />
      </TwoColumn>
      <section className="panel overflow-hidden">
        <div className="border-b glass-line px-4 pt-4">
          <PanelTitle title="Address Intelligence" action="Export CSV" icon={Download} />
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-3">
          {[
            { title: "Exchange Deposit Risk", value: "Low", body: "Large ETH deposits remain below weekly baseline.", tone: "green" as const },
            { title: "Accumulation Zone", value: "$2,610 - $2,690", body: "Whales continue buying every shallow pullback.", tone: "violet" as const },
            { title: "Dormant Wallet Moves", value: "3 alerts", body: "Old BTC wallets moved coins, but exchange routing not detected.", tone: "amber" as const },
          ].map((item) => (
            <InsightCard key={item.title} {...item} />
          ))}
        </div>
      </section>
    </ModuleStack>
  );
}

function ExchangeFlowPanel() {
  const bars = [42, 64, 31, 78, 52, 86, 34, 58, 91, 46, 74, 66, 88, 49, 81, 60, 92, 56];

  return (
    <section className="panel p-4">
      <PanelTitle title="Exchange Net Flow" action="-67,892 ETH" icon={ArrowDownRight} />
      <div className="mb-4 flex h-52 items-end gap-2 rounded-md border border-emerald-300/10 bg-emerald-300/[0.03] p-4">
        {bars.map((height, index) => (
          <span
            className={`flex-1 rounded-t ${index % 5 === 0 ? "bg-rose-400/70" : "bg-emerald-400/70"}`}
            key={`${height}-${index}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="ETH Outflow" value="67,892" delta="+22.6%" />
        <Metric label="BTC Deposits" value="1,420" delta="-8.3%" />
        <Metric label="Stablecoin Inflow" value="$94M" delta="+4.1%" />
      </div>
    </section>
  );
}
