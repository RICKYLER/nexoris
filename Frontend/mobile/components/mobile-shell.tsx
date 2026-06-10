"use client";

import { useState } from "react";
import { ChevronDown, CircleDollarSign, Menu, Settings, UserCircle, Wifi, X, Zap } from "lucide-react";
import { moduleMeta, navItems } from "@/data/dashboard-data";
import type { ModuleId } from "@/types/dashboard";

const primaryMobileModuleIds: ModuleId[] = [
  "dashboard",
  "market-scanner",
  "chart-analysis",
  "ai-signals",
  "portfolio",
];

const accountStrip = [
  { label: "Balance", value: "$88.8K" },
  { label: "Equity", value: "$89.1K" },
  { label: "Funds", value: "$78.1K" },
  { label: "P&L", value: "+$297", tone: "text-emerald-300" },
];

export function MobileTopBar({ activeModule }: { activeModule: ModuleId }) {
  const activeItem = navItems.find((item) => item.id === activeModule) ?? navItems[0];
  const meta = moduleMeta[activeModule];
  const Icon = activeItem.icon;

  return (
    <header className="mobile-topbar lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <button
          aria-label="Open profile"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
          type="button"
        >
          <UserCircle className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">NEXORIS</div>
          <div className="mt-0.5 flex min-w-0 items-center justify-center gap-1 text-sm font-black text-slate-100">
            <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            <span className="truncate">{meta.title}</span>
          </div>
        </div>
        <button
          aria-label="Open settings"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-slate-700 bg-white/[0.03] text-slate-300"
          type="button"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="mobile-control-row mt-3">
        <button className="mobile-control-button" type="button">
          <Zap className="h-3.5 w-3.5 text-cyan-300" />
          Leverage
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        </button>
        <button className="mobile-control-button" type="button">
          <CircleDollarSign className="h-3.5 w-3.5 text-emerald-300" />
          USD.c
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        </button>
        <button className="mobile-live-button" type="button">
          <Wifi className="h-3.5 w-3.5" />
          Live
        </button>
      </div>

      <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {accountStrip.map((item) => (
          <div className="mobile-account-chip" key={item.label}>
            <span>{item.label}</span>
            <strong className={item.tone ?? "text-slate-100"}>{item.value}</strong>
          </div>
        ))}
      </div>
    </header>
  );
}

export function MobileBottomNav({
  activeModule,
  onModuleChange,
}: {
  activeModule: ModuleId;
  onModuleChange: (moduleId: ModuleId) => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryItems = primaryMobileModuleIds
    .map((id) => navItems.find((item) => item.id === id))
    .filter((item): item is (typeof navItems)[number] => Boolean(item));
  const overflowItems = navItems.filter((item) => !primaryMobileModuleIds.includes(item.id));
  const overflowIsActive = overflowItems.some((item) => item.id === activeModule);

  const selectModule = (moduleId: ModuleId) => {
    onModuleChange(moduleId);
    setMoreOpen(false);
  };

  return (
    <>
      <nav className="mobile-bottom-nav lg:hidden" aria-label="Mobile module navigation">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeModule;

          return (
            <button
              aria-current={isActive ? "page" : undefined}
              className={`mobile-nav-item ${isActive ? "is-active" : ""}`}
              key={item.id}
              onClick={() => selectModule(item.id)}
              type="button"
            >
              <Icon className="h-5 w-5" />
              <span>{shortMobileLabel(item.label)}</span>
            </button>
          );
        })}

        <button
          aria-expanded={moreOpen}
          className={`mobile-nav-item ${moreOpen || overflowIsActive ? "is-active" : ""}`}
          onClick={() => setMoreOpen((current) => !current)}
          type="button"
        >
          {moreOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span>More</span>
        </button>
      </nav>

      {moreOpen ? (
        <div className="mobile-more-layer lg:hidden">
          <button
            aria-label="Close module menu"
            className="mobile-more-backdrop"
            onClick={() => setMoreOpen(false)}
            type="button"
          />
          <section className="mobile-more-sheet">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-slate-100">More Modules</div>
                <div className="mt-1 text-xs text-slate-500">Jump to the rest of Nexoris.</div>
              </div>
              <button
                aria-label="Close module menu"
                className="grid h-9 w-9 place-items-center rounded-md border border-slate-700 text-slate-300"
                onClick={() => setMoreOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {overflowItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeModule;

                return (
                  <button
                    className={`mobile-more-item ${isActive ? "is-active" : ""}`}
                    key={item.id}
                    onClick={() => selectModule(item.id)}
                    type="button"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function shortMobileLabel(label: string) {
  return label
    .replace("Market Scanner", "Scanner")
    .replace("Chart Analysis", "Chart")
    .replace("AI Trade Signals", "Signals");
}
