import { Code2, Copy, Database, KeyRound, Webhook } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { ModuleKpiGrid, ModuleStack, PanelTitle, ProgressRow, TwoColumn } from "@/components/dashboard/ui";

export function ApiAccessView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["api-access"]} />
      <TwoColumn>
        <ApiKeysPanel />
        <ApiUsagePanel />
      </TwoColumn>
      <TwoColumn>
        <EndpointsPanel />
        <WebhookPanel />
      </TwoColumn>
    </ModuleStack>
  );
}

function ApiKeysPanel() {
  return (
    <section className="panel p-4">
      <PanelTitle title="API Keys" action="Production" icon={KeyRound} />
      <div className="space-y-3">
        {[
          ["Production key", "nx_live_************************2f9a", "Active"],
          ["Backend testing", "nx_test_************************91bb", "Active"],
          ["Analytics sandbox", "nx_test_************************1c44", "Limited"],
        ].map(([name, key, status]) => (
          <div className="mini-panel flex items-center justify-between gap-3 p-4" key={name}>
            <div className="min-w-0">
              <div className="text-sm font-black text-slate-100">{name}</div>
              <div className="mt-1 truncate font-mono text-xs text-slate-500">{key}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded px-2 py-1 text-xs font-black ${status === "Limited" ? "bg-amber-400/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300"}`}>{status}</span>
              <Copy className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ApiUsagePanel() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Usage This Month" action="82.4K calls" icon={Database} />
      <div className="space-y-4">
        {[
          { label: "Opportunity scanner", value: 84, tone: "bg-violet-400" },
          { label: "Wallet intelligence", value: 68, tone: "bg-emerald-400" },
          { label: "Signals endpoint", value: 52, tone: "bg-cyan-400" },
          { label: "Reports export", value: 26, tone: "bg-amber-400" },
        ].map((item) => (
          <ProgressRow key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}

function EndpointsPanel() {
  return (
    <section className="panel overflow-hidden">
      <div className="px-4 pt-4">
        <PanelTitle title="Endpoints" action="v1" icon={Code2} />
      </div>
      <div className="divide-y divide-slate-700/40">
        {[
          ["GET", "/v1/opportunities", "Ranked opportunity scanner"],
          ["GET", "/v1/wallets/smart-money", "Tracked wallet activity"],
          ["GET", "/v1/signals", "AI trade signal feed"],
          ["POST", "/v1/alerts/rules", "Create alert rule"],
        ].map(([method, path, detail]) => (
          <div className="grid gap-2 px-4 py-3 text-sm sm:grid-cols-[70px_1fr]" key={path}>
            <span className={`font-black ${method === "POST" ? "text-violet-300" : "text-emerald-300"}`}>{method}</span>
            <div>
              <div className="font-mono text-slate-100">{path}</div>
              <div className="mt-1 text-xs text-slate-500">{detail}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WebhookPanel() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Webhook Events" action="Live" icon={Webhook} />
      <div className="space-y-3">
        {[
          ["signal.created", "Delivered", "2m ago"],
          ["whale.accumulated", "Delivered", "5m ago"],
          ["alert.triggered", "Retrying", "9m ago"],
          ["report.completed", "Delivered", "28m ago"],
        ].map(([event, status, time]) => (
          <div className="mini-panel flex items-center justify-between gap-3 p-4" key={event}>
            <div>
              <div className="font-mono text-sm font-black text-slate-100">{event}</div>
              <div className="mt-1 text-xs text-slate-500">{time}</div>
            </div>
            <span className={`rounded px-2 py-1 text-xs font-black ${status === "Retrying" ? "bg-amber-400/10 text-amber-300" : "bg-emerald-400/10 text-emerald-300"}`}>{status}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
