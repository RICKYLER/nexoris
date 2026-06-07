import { ChartPanel } from "@/components/dashboard/chart-panel";
import { AgentNetwork, SmartMoneyTable, StatsGrid } from "@/components/dashboard/panels";

export function DashboardView() {
  return (
    <>
      <StatsGrid />
      <ChartPanel />
      <AgentNetwork />
      <SmartMoneyTable />
    </>
  );
}
