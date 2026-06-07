import { BarChart3, LineChart } from "lucide-react";
import { ChartPanel } from "@/components/dashboard/chart-panel";
import { moduleKpis } from "@/data/dashboard-data";
import { ModuleKpiGrid, ModuleStack, PanelTitle, TwoColumn, toneText } from "@/components/dashboard/ui";
import type { Tone } from "@/types/dashboard";

export function ChartAnalysisView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["chart-analysis"]} />
      <SymbolStrip />
      <ChartPanel />
      <TwoColumn>
        <IndicatorHeatmap />
        <SupportResistance />
      </TwoColumn>
    </ModuleStack>
  );
}

function SymbolStrip() {
  return (
    <section className="hide-scrollbar flex gap-2 overflow-x-auto">
      {["ETH", "BTC", "SOL", "ARB", "LINK", "OP", "AVAX", "BNB"].map((coin) => (
        <button
          className={`mini-panel flex min-w-[128px] items-center justify-between px-3 py-2 text-sm font-black ${coin === "ETH" ? "border-violet-400/50 text-white" : "text-slate-400"}`}
          key={coin}
          type="button"
        >
          {coin}
          <span className={coin === "BTC" ? "text-rose-300" : "text-emerald-300"}>{coin === "BTC" ? "-0.4%" : "+3.2%"}</span>
        </button>
      ))}
    </section>
  );
}

function IndicatorHeatmap() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Indicator Heatmap" action="Multi-asset" icon={BarChart3} />
      <div className="grid grid-cols-5 gap-2 text-xs">
        {["ETH", "BTC", "SOL", "ARB", "LINK"].map((coin) => (
          <div className="text-center font-black text-slate-400" key={coin}>{coin}</div>
        ))}
        {Array.from({ length: 25 }).map((_, index) => {
          const tones = ["bg-emerald-400/80", "bg-cyan-400/70", "bg-violet-400/70", "bg-amber-400/70", "bg-rose-400/70"];

          return <div className={`h-12 rounded-md ${tones[index % tones.length]}`} key={index} />;
        })}
      </div>
    </section>
  );
}

function SupportResistance() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Support & Resistance" action="ETH" icon={LineChart} />
      <div className="space-y-3">
        {[
          { label: "Resistance 2", value: "$2,880", tone: "rose" as Tone },
          { label: "Resistance 1", value: "$2,740", tone: "rose" as Tone },
          { label: "Current Price", value: "$2,665", tone: "green" as Tone },
          { label: "Support 1", value: "$2,520", tone: "cyan" as Tone },
          { label: "Support 2", value: "$2,350", tone: "cyan" as Tone },
        ].map((level) => (
          <div className="mini-panel flex items-center justify-between p-3" key={level.label}>
            <span className="text-sm text-slate-400">{level.label}</span>
            <span className={`font-black ${toneText[level.tone]}`}>{level.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
