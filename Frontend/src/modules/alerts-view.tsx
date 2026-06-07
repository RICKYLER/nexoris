import { Bell, Send } from "lucide-react";
import { AlertsPanel } from "@/components/dashboard/panels";
import { moduleKpis } from "@/data/dashboard-data";
import { ModuleKpiGrid, ModuleStack, PanelTitle, ProgressRow, TwoColumn } from "@/components/dashboard/ui";

export function AlertsView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis.alerts} />
      <TwoColumn>
        <AlertRules />
        <DeliveryChannels />
      </TwoColumn>
      <AlertsPanel />
    </ModuleStack>
  );
}

function AlertRules() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Alert Rules" action="26 active" icon={Bell} />
      <div className="space-y-3">
        {[
          ["Whale buy above $5M", "ETH, SOL, ARB", "High"],
          ["Exchange outflow spike", "All majors", "High"],
          ["RSI breakout reset", "Watchlist", "Medium"],
          ["Sentiment spike", "LINK, OP", "Medium"],
        ].map(([rule, scope, priority]) => (
          <div className="mini-panel flex items-center justify-between gap-3 p-4" key={rule}>
            <div>
              <div className="text-sm font-black text-slate-100">{rule}</div>
              <div className="mt-1 text-xs text-slate-500">{scope}</div>
            </div>
            <span className={`rounded px-2 py-1 text-xs font-black ${priority === "High" ? "bg-rose-400/10 text-rose-300" : "bg-violet-400/10 text-violet-300"}`}>{priority}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DeliveryChannels() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Delivery Channels" action="Healthy" icon={Send} />
      <div className="space-y-4">
        {[
          { label: "In-app", value: 100, tone: "bg-emerald-400" },
          { label: "Email", value: 98, tone: "bg-cyan-400" },
          { label: "Telegram", value: 96, tone: "bg-violet-400" },
          { label: "Webhook", value: 91, tone: "bg-amber-400" },
        ].map((item) => (
          <ProgressRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
