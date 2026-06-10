import { Crown, RefreshCw, Search } from "lucide-react";
import { moduleMeta, navItems } from "@/data/dashboard-data";
import type { ModuleId } from "@/types/dashboard";

export function Header({ activeModule }: { activeModule: ModuleId }) {
  const activeItem = navItems.find((item) => item.id === activeModule) ?? navItems[0];
  const meta = moduleMeta[activeModule];
  const Icon = activeItem.icon;

  return (
    <header className="module-header mb-4 hidden flex-col gap-4 sm:mb-5 sm:flex xl:flex-row xl:items-start xl:justify-between">
      <div>
        <div className="mb-2 hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-slate-500 sm:flex">
          <Icon className="h-3.5 w-3.5 text-emerald-300" />
          {meta.kicker}
        </div>
        <h1 className="text-xl font-black tracking-normal text-white sm:text-3xl">
          {meta.title}
          {activeModule === "dashboard" ? <span className="text-amber-300"> Wave</span> : null}
        </h1>
        <p className="mt-2 hidden max-w-3xl text-sm text-slate-400 sm:block">{meta.subtitle}</p>
      </div>

      <div className="hidden gap-3 sm:grid sm:grid-cols-[minmax(220px,1fr)_auto_auto] xl:w-[620px]">
        <label className="mini-panel flex h-11 items-center gap-2 px-3">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            aria-label="Search coins"
            className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
            placeholder="Search coin, wallet, signal, or endpoint"
          />
        </label>
        <button className="mini-panel flex h-11 items-center justify-center gap-2 px-4 text-sm font-bold text-slate-200 transition hover:border-violet-400/50" type="button">
          <RefreshCw className="h-4 w-4 text-violet-300" />
          Sync
        </button>
        <button className="flex h-11 items-center justify-center gap-2 rounded-md border border-amber-300/25 bg-amber-300/10 px-4 text-sm font-black text-amber-200" type="button">
          <Crown className="h-4 w-4" />
          Pro Plan
        </button>
      </div>
    </header>
  );
}
