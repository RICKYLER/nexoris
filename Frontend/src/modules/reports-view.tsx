import { ArrowUpRight, ClipboardList, Download, Newspaper, Timer, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { ModuleKpiGrid, ModuleStack, PanelTitle, TwoColumn, toneBadge } from "@/components/dashboard/ui";
import type { Tone } from "@/types/dashboard";

export function ReportsView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis.reports} />
      <section className="grid gap-3 xl:grid-cols-3">
        {[
          { title: "Daily Market Brief", icon: Newspaper, body: "AI summary of market regime, winners, risks, and top opportunities.", tone: "cyan" as Tone },
          { title: "Smart Money Report", icon: Users, body: "Wallet rotation, top buys, top exits, and new accumulation clusters.", tone: "violet" as Tone },
          { title: "Trade Review", icon: ClipboardList, body: "Signal performance, invalidations, follow-through, and lessons learned.", tone: "green" as Tone },
        ].map((report) => (
          <ReportCard key={report.title} {...report} />
        ))}
      </section>
      <TwoColumn>
        <ReportTimeline />
        <ScheduledExports />
      </TwoColumn>
    </ModuleStack>
  );
}

function ReportCard({
  title,
  icon,
  body,
  tone,
}: {
  title: string;
  icon: LucideIcon;
  body: string;
  tone: Tone;
}) {
  const Icon = icon;

  return (
    <article className="panel p-4">
      <div className={`mb-4 grid h-11 w-11 place-items-center rounded-md border ${toneBadge[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-black text-slate-100">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
      <button className="mt-4 flex items-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-black text-white" type="button">
        Generate
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </article>
  );
}

function ReportTimeline() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Recent Reports" action="Updated" icon={ClipboardList} />
      <div className="space-y-3">
        {[
          ["Daily Market Brief", "Generated 12m ago"],
          ["ETH On-Chain Review", "Generated 1h ago"],
          ["Smart Money Rotation", "Generated 4h ago"],
          ["Signal Performance", "Generated yesterday"],
        ].map(([title, time]) => (
          <div className="mini-panel flex items-center justify-between p-4" key={title}>
            <div>
              <div className="text-sm font-black text-slate-100">{title}</div>
              <div className="mt-1 text-xs text-slate-500">{time}</div>
            </div>
            <Download className="h-4 w-4 text-violet-300" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ScheduledExports() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Scheduled Exports" action="6 active" icon={Timer} />
      <div className="space-y-3">
        {[
          ["Daily AI Brief", "07:00 AM", "Email"],
          ["Weekly Wallet Report", "Monday", "PDF"],
          ["API Usage Digest", "Friday", "CSV"],
          ["Signal Review", "Sunday", "Email"],
        ].map(([name, schedule, format]) => (
          <div className="mini-panel grid gap-2 p-4 sm:grid-cols-[1fr_auto_auto]" key={name}>
            <span className="font-black text-slate-100">{name}</span>
            <span className="text-slate-400">{schedule}</span>
            <span className="text-violet-300">{format}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
