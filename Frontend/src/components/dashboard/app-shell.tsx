"use client";

import { useState } from "react";
import { Header } from "@/components/dashboard/layout/header";
import { RightRail } from "@/components/dashboard/layout/right-rail";
import { Sidebar } from "@/components/dashboard/layout/sidebar";
import { ModuleContent } from "@/modules/module-content";
import type { ModuleId } from "@/types/dashboard";

export function NexorisDashboardApp() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");

  return (
    <main className="dashboard-shell">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

      <section className="min-w-0 px-4 py-4 sm:px-6 lg:px-7">
        <Header activeModule={activeModule} />
        <ModuleContent activeModule={activeModule} />
      </section>

      <RightRail activeModule={activeModule} />
    </main>
  );
}
