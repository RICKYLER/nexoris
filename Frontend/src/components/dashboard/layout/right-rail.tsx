import { Bell, Bot, ClipboardList, Download, Sparkles } from "lucide-react";
import { navItems } from "@/data/dashboard-data";
import { AlertsPanel, MarketRegime, OpportunitiesPanel } from "@/components/dashboard/panels";
import { PanelTitle, toneBadge } from "@/components/dashboard/ui";
import type { ModuleId, Tone } from "@/types/dashboard";

export function RightRail({ activeModule }: { activeModule: ModuleId }) {
  const activeItem = navItems.find((item) => item.id === activeModule) ?? navItems[0];

  return (
    <aside className="right-rail glass-line border-t px-4 pb-5 pt-4 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto xl:border-l xl:border-t-0 xl:pb-4">
      <MarketRegime />
      {activeModule === "dashboard" ? (
        <>
          <AlertsPanel />
          <OpportunitiesPanel />
        </>
      ) : (
        <>
          <ModuleRailCard moduleName={activeItem.label} />
          <OpportunitiesPanel />
        </>
      )}
    </aside>
  );
}

function ModuleRailCard({ moduleName }: { moduleName: string }) {
  const actions = [
    { label: "Run AI analysis", icon: Sparkles, tone: "violet" as Tone },
    { label: "Save current view", icon: ClipboardList, tone: "cyan" as Tone },
    { label: "Create alert rule", icon: Bell, tone: "amber" as Tone },
    { label: "Export module data", icon: Download, tone: "green" as Tone },
  ];

  return (
    <section className="panel mb-4 p-4">
      <PanelTitle title={`${moduleName} Actions`} action="AI ready" icon={Bot} />
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button className="mini-panel flex w-full items-center gap-3 p-3 text-left text-sm font-black text-slate-200 transition hover:border-violet-400/50" key={action.label} type="button">
              <span className={`grid h-8 w-8 place-items-center rounded-md border ${toneBadge[action.tone]}`}>
                <Icon className="h-4 w-4" />
              </span>
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
