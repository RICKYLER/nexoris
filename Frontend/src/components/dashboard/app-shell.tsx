"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/layout/header";
import { RightRail } from "@/components/dashboard/layout/right-rail";
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { MobileBottomNav, MobileTopBar } from "../../../mobile/components/mobile-shell";
import { ModuleContent } from "@/modules/module-content";
import type { ModuleId } from "@/types/dashboard";

export function NexorisDashboardApp() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");

  return (
    <main className="dashboard-shell">
      <MobileTopBar activeModule={activeModule} />
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

      <section className="dashboard-content min-w-0 px-3 pb-28 pt-3 sm:px-6 lg:px-7 lg:py-4">
        <Header activeModule={activeModule} />
        <ModuleContent activeModule={activeModule} />
      </section>

      <RightRail activeModule={activeModule} />
      <MobileBottomNav activeModule={activeModule} onModuleChange={setActiveModule} />
    </main>
  );
}
