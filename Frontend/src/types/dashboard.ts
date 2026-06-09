import type { LucideIcon } from "lucide-react";

export type ModuleId =
  | "dashboard"
  | "market-scanner"
  | "on-chain"
  | "smart-money"
  | "ai-signals"
  | "ai-copilot"
  | "chart-analysis"
  | "news-sentiment"
  | "portfolio"
  | "performance"
  | "alerts"
  | "reports"
  | "api-access";

export type Tone = "green" | "cyan" | "violet" | "rose" | "amber" | "slate";

export type NavItem = {
  id: ModuleId;
  label: string;
  icon: LucideIcon;
  badge?: string;
  expandable?: boolean;
};

export type StatCard = {
  label: string;
  value: string;
  sub: string;
  tone: "green" | "cyan" | "violet" | "rose";
  chart: "bars" | "line" | "ring";
};

export type Kpi = {
  label: string;
  value: string;
  sub: string;
  tone: Tone;
  icon: LucideIcon;
};

export type Alert = {
  icon: LucideIcon;
  title: string;
  body: string;
  time: string;
  tone: string;
};
