import Image from "next/image";
import { ArrowUpRight, Bot, ChevronDown } from "lucide-react";
import sidebarLogo from "@/public/logosiderbar.png";
import { navItems } from "@/data/dashboard-data";
import { Metric } from "@/components/dashboard/ui";
import type { ModuleId } from "@/types/dashboard";

export function Sidebar({
  activeModule,
  onModuleChange,
}: {
  activeModule: ModuleId;
  onModuleChange: (moduleId: ModuleId) => void;
}) {
  return (
    <aside className="glass-line border-b bg-[#050914]/95 px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-md border border-violet-400/30 bg-[#050914]">
          <Image
            alt="Nexoris logo"
            className="h-10 w-10 object-contain"
            height={40}
            priority
            src={sidebarLogo}
            width={40}
          />
        </div>
        <div>
          <div className="text-2xl font-black tracking-[0.16em] text-slate-100">NEXORIS</div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">AI-Powered Crypto Intelligence</div>
        </div>
      </div>

      <nav className="hide-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeModule;

          return (
            <button
              key={item.id}
              className={`group flex min-w-max items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition lg:w-full ${
                isActive
                  ? "bg-violet-600 text-white shadow-[0_0_22px_rgba(139,92,246,0.34)]"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
              }`}
              onClick={() => onModuleChange(item.id)}
              type="button"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge ? (
                <span className="rounded bg-fuchsia-500 px-1.5 py-0.5 text-[9px] font-black text-white">{item.badge}</span>
              ) : null}
              {item.expandable ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 hidden space-y-4 lg:block">
        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Bot className="h-4 w-4 text-violet-300" />
              Nexoris AI Copilot
            </div>
            <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-black text-amber-300">BETA</span>
          </div>
          <p className="text-xs leading-5 text-slate-400">
            Ask anything about the market, on-chain activity, or specific coins.
          </p>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-violet-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500" type="button">
            Ask Nexoris AI
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        <div className="panel p-4">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Market Overview</h3>
            <button className="flex items-center gap-1 text-xs font-semibold text-slate-400" type="button">
              24h
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-4 text-sm">
            <Metric label="Market Cap" value="$2.48T" delta="+2.35%" />
            <Metric label="24h Volume" value="$98.42B" delta="+14.12%" />
            <Metric label="BTC Dominance" value="52.3%" delta="-0.45%" negative />
            <div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Fear & Greed Index</span>
                <span className="text-emerald-300">Greed</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full score-ring" />
                <div className="text-2xl font-black">64</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
