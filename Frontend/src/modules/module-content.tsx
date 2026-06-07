import { AiSignalsView } from "@/modules/ai-signals-view";
import { AlertsView } from "@/modules/alerts-view";
import { ApiAccessView } from "@/modules/api-access-view";
import { ChartAnalysisView } from "@/modules/chart-analysis-view";
import { DashboardView } from "@/modules/dashboard-view";
import { MarketScannerView } from "@/modules/market-scanner-view";
import { NewsSentimentView } from "@/modules/news-sentiment-view";
import { OnChainView } from "@/modules/on-chain-view";
import { PortfolioView } from "@/modules/portfolio-view";
import { ReportsView } from "@/modules/reports-view";
import { SmartMoneyView } from "@/modules/smart-money-view";
import type { ModuleId } from "@/types/dashboard";

export function ModuleContent({ activeModule }: { activeModule: ModuleId }) {
  switch (activeModule) {
    case "market-scanner":
      return <MarketScannerView />;
    case "on-chain":
      return <OnChainView />;
    case "smart-money":
      return <SmartMoneyView />;
    case "ai-signals":
      return <AiSignalsView />;
    case "chart-analysis":
      return <ChartAnalysisView />;
    case "news-sentiment":
      return <NewsSentimentView />;
    case "portfolio":
      return <PortfolioView />;
    case "alerts":
      return <AlertsView />;
    case "reports":
      return <ReportsView />;
    case "api-access":
      return <ApiAccessView />;
    default:
      return <DashboardView />;
  }
}
