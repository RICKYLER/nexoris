import { Flame, Globe2, Newspaper } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { InsightCard, ModuleKpiGrid, ModuleStack, PanelTitle, ProgressRow, TwoColumn } from "@/components/dashboard/ui";

export function NewsSentimentView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["news-sentiment"]} />
      <TwoColumn>
        <NarrativeHeat />
        <SentimentRadar />
      </TwoColumn>
      <NewsFeed />
    </ModuleStack>
  );
}

function NarrativeHeat() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Narrative Heat" action="Trending" icon={Flame} />
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { title: "Layer 2 Rotation", value: "91", body: "ARB and OP social velocity up strongly.", tone: "violet" as const },
          { title: "ETH ETF Flow", value: "84", body: "Institutional flow narrative remains active.", tone: "green" as const },
          { title: "Oracle Demand", value: "76", body: "LINK mentions rising after integrations.", tone: "cyan" as const },
          { title: "Meme Liquidity", value: "58", body: "Momentum cooling after crowded entries.", tone: "amber" as const },
        ].map((item) => (
          <InsightCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

function SentimentRadar() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Sentiment Channels" action="+14%" icon={Globe2} />
      <div className="space-y-4">
        {[
          { label: "Twitter/X", value: 84, tone: "bg-cyan-400" },
          { label: "Reddit", value: 62, tone: "bg-violet-400" },
          { label: "Telegram", value: 73, tone: "bg-emerald-400" },
          { label: "News", value: 68, tone: "bg-amber-400" },
        ].map((item) => (
          <ProgressRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

function NewsFeed() {
  return (
    <section className="panel overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="News & Social Feed" action="Live" icon={Newspaper} />
      </div>
      <div className="divide-y divide-slate-700/40">
        {[
          ["ETH ETF flows strengthen for third straight session", "Positive", "4m ago"],
          ["Layer 2 volume spikes as ARB smart wallets accumulate", "Bullish", "11m ago"],
          ["SOL ecosystem funding round boosts social mentions", "Positive", "18m ago"],
          ["Security researchers flag exploit attempt on small-cap bridge", "Risk", "27m ago"],
        ].map(([title, tag, time]) => (
          <article className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between" key={title}>
            <div>
              <h3 className="text-sm font-black text-slate-100">{title}</h3>
              <div className="mt-1 text-xs text-slate-500">{time}</div>
            </div>
            <span className={`w-fit rounded px-2 py-1 text-xs font-black ${tag === "Risk" ? "bg-rose-400/10 text-rose-300" : "bg-emerald-400/10 text-emerald-300"}`}>{tag}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
