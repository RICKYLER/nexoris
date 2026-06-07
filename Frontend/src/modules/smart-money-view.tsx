import { PieChart, Users } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { ModuleKpiGrid, ModuleStack, PanelTitle, TwoColumn } from "@/components/dashboard/ui";
import { SmartMoneyTable } from "@/components/dashboard/panels";

export function SmartMoneyView() {
  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["smart-money"]} />
      <TwoColumn>
        <WalletLeaderboard />
        <HoldingsRotation />
      </TwoColumn>
      <SmartMoneyTable />
    </ModuleStack>
  );
}

function WalletLeaderboard() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Wallet Leaderboard" action="Top 100" icon={Users} />
      <div className="space-y-3">
        {[
          { wallet: "0x7F39...a7F1", win: "72%", pnl: "+$14.2M", focus: "ETH, LINK" },
          { wallet: "0x1A2b...9cF3", win: "69%", pnl: "+$9.8M", focus: "ARB, OP" },
          { wallet: "0x93E1...0b41", win: "66%", pnl: "+$7.1M", focus: "SOL, JUP" },
          { wallet: "0x56Ba...D22c", win: "63%", pnl: "+$5.4M", focus: "BTC, ETH" },
        ].map((wallet, index) => (
          <div className="mini-panel grid gap-3 p-4 sm:grid-cols-[44px_1fr_auto]" key={wallet.wallet}>
            <div className="grid h-10 w-10 place-items-center rounded-md bg-violet-400/10 text-sm font-black text-violet-300">{index + 1}</div>
            <div>
              <div className="font-mono text-sm font-black text-slate-100">{wallet.wallet}</div>
              <div className="mt-1 text-xs text-slate-500">Focus: {wallet.focus}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-emerald-300">{wallet.pnl}</div>
              <div className="text-xs text-slate-500">Win {wallet.win}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HoldingsRotation() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Holdings Rotation" action="24h" icon={PieChart} />
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: "ETH", value: 44, tone: "bg-emerald-400" },
          { label: "SOL", value: 24, tone: "bg-cyan-400" },
          { label: "ARB", value: 18, tone: "bg-violet-400" },
          { label: "LINK", value: 14, tone: "bg-amber-400" },
        ].map((item) => (
          <div className="mini-panel p-4" key={item.label}>
            <div className="mb-2 flex justify-between text-sm font-black text-slate-100">
              <span>{item.label}</span>
              <span>{item.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div className={`h-2 rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md border border-emerald-300/15 bg-emerald-300/10 p-4 text-sm leading-6 text-slate-300">
        Smart wallets rotated from BTC into ETH, ARB, and SOL after exchange outflow accelerated.
      </div>
    </section>
  );
}
