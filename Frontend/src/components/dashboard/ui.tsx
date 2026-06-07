import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Kpi, StatCard, Tone } from "@/types/dashboard";

export const toneText: Record<Tone, string> = {
  green: "text-emerald-300",
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  rose: "text-rose-300",
  amber: "text-amber-300",
  slate: "text-slate-300",
};

export const toneBadge: Record<Tone, string> = {
  green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  violet: "border-violet-300/20 bg-violet-300/10 text-violet-200",
  rose: "border-rose-300/20 bg-rose-300/10 text-rose-200",
  amber: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  slate: "border-slate-300/20 bg-slate-300/10 text-slate-200",
};

export function ModuleStack({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function TwoColumn({ children }: { children: ReactNode }) {
  return <section className="grid gap-4 xl:grid-cols-2">{children}</section>;
}

export function ModuleKpiGrid({ items }: { items: Kpi[] }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <article className="panel p-4" key={item.label}>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-400">{item.label}</div>
              <div className={`grid h-9 w-9 place-items-center rounded-md border ${toneBadge[item.tone]}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className={`text-2xl font-black ${toneText[item.tone]}`}>{item.value}</div>
            <div className="mt-1 text-xs text-slate-500">{item.sub}</div>
          </article>
        );
      })}
    </section>
  );
}

export function PanelTitle({
  title,
  action,
  icon,
}: {
  title: string;
  action?: string;
  icon: LucideIcon;
}) {
  const Icon = icon;

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-violet-300" />
        <h2 className="text-sm font-black uppercase tracking-wide text-slate-200">{title}</h2>
      </div>
      {action ? <span className="text-xs font-black text-violet-300">{action}</span> : null}
    </div>
  );
}

export function InsightCard({
  title,
  value,
  body,
  tone,
}: {
  title: string;
  value: string;
  body: string;
  tone: Tone;
}) {
  return (
    <article className="mini-panel p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-black text-slate-100">{title}</h3>
        <span className={`rounded px-2 py-1 text-xs font-black ${toneBadge[tone]}`}>{value}</span>
      </div>
      <p className="text-xs leading-5 text-slate-400">{body}</p>
    </article>
  );
}

export function Metric({
  label,
  value,
  delta,
  negative = false,
}: {
  label: string;
  value: string;
  delta: string;
  negative?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 text-xs text-slate-500">{label}</div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-lg font-black text-slate-100">{value}</span>
        <span className={`text-xs font-black ${negative ? "text-rose-300" : "text-emerald-300"}`}>{delta}</span>
      </div>
    </div>
  );
}

export function ProgressRow({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-300">{label}</span>
        <span className="font-black text-slate-100">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div className={`h-2 rounded-full ${tone}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function ScorePill({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-black text-emerald-300">{score}</span>
      <div className="h-1.5 w-16 rounded-full bg-slate-800">
        <div className="h-1.5 rounded-full bg-emerald-400" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

export function CoinBadge({ coin }: { coin: string }) {
  const gradients: Record<string, string> = {
    ETH: "from-slate-300 to-slate-500",
    BTC: "from-amber-300 to-orange-500",
    SOL: "from-emerald-300 to-violet-500",
    ARB: "from-cyan-300 to-blue-500",
    LINK: "from-blue-300 to-cyan-500",
    OP: "from-rose-300 to-red-500",
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br ${gradients[coin] ?? "from-violet-300 to-cyan-500"} text-[10px] font-black text-white`}>
        {coin.slice(0, 2)}
      </span>
      <span className="font-black text-slate-100">{coin}</span>
    </div>
  );
}

export function InfoLine({ label, value, tone = "text-slate-100" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={`font-black ${tone}`}>{value}</span>
    </div>
  );
}

export function PriceLabel({ value, tone }: { value: string; tone: "rose" | "green" | "cyan" }) {
  const colors = {
    rose: "bg-rose-500 text-white",
    green: "bg-emerald-500 text-[#03120d]",
    cyan: "bg-cyan-500 text-[#031016]",
  };

  return <div className={`mb-5 rounded px-2 py-1 text-right text-[11px] font-black ${colors[tone]}`}>{value}</div>;
}

export function IndicatorPanel({
  title,
  value,
  tone,
  children,
}: {
  title: string;
  value: string;
  tone: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 p-4 first:border-b glass-line md:first:border-b-0 md:first:border-r">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-black text-slate-300">
        <span>{title}</span>
        <span className={tone}>{value}</span>
      </div>
      {children}
    </div>
  );
}

export function StatVisual({ chart, tone }: { chart: StatCard["chart"]; tone: StatCard["tone"] }) {
  if (chart === "ring") {
    return <div className="donut-ring h-16 w-16 shrink-0 rounded-full" />;
  }

  if (chart === "bars") {
    const bars = [25, 42, 30, 56, 38, 72, 48, 64, 34, 78, 52, 88, 58, 74, 92, 44, 68, 84];

    return (
      <div className="flex h-14 w-24 items-end gap-1">
        {bars.map((height, index) => (
          <span
            className={`w-1 rounded-sm ${tone === "green" ? "bg-emerald-400" : "bg-violet-400"}`}
            key={`${height}-${index}`}
            style={{ height: `${height}%`, opacity: 0.36 + index / 30 }}
          />
        ))}
      </div>
    );
  }

  return (
    <svg className="h-14 w-28 shrink-0" viewBox="0 0 112 56" aria-hidden="true">
      <path d="M4 42 C18 30 26 48 38 33 S59 25 70 28 88 16 108 10" fill="none" stroke={tone === "cyan" ? "#22d3ee" : "#8b5cf6"} strokeWidth="3" className="spark-line" />
      <path d="M4 42 C18 30 26 48 38 33 S59 25 70 28 88 16 108 10 L108 56 L4 56 Z" fill={tone === "cyan" ? "rgba(34,211,238,0.13)" : "rgba(139,92,246,0.14)"} />
    </svg>
  );
}
