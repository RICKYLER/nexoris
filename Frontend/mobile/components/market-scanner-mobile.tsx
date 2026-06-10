import { CoinBadge, ScorePill } from "@/components/dashboard/ui";

type MobileScannerRow = {
  coin: string;
  sector: string;
  score: number;
  smart: string;
  whale: string;
  exchange: string;
  ta: string;
  momentum: string;
  signal: string;
};

export function MobileScannerCards({ rows }: { rows: MobileScannerRow[] }) {
  return (
    <div className="space-y-3 sm:hidden">
      {rows.map((row) => (
        <article className="mini-panel p-3" key={row.coin}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <CoinBadge coin={row.coin} />
            <span className={`rounded px-2 py-1 text-[11px] font-black ${getSignalTone(row.signal)}`}>
              {row.signal}
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-slate-800 bg-white/[0.025] px-3 py-2">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-600">AI Score</span>
            <ScorePill score={row.score} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <ScannerMobileMetric label="Sector" value={row.sector} />
            <ScannerMobileMetric label="Smart Money" value={row.smart} tone="text-emerald-300" />
            <ScannerMobileMetric label="Whale" value={row.whale} />
            <ScannerMobileMetric label="Exchange" value={row.exchange} tone={row.exchange.startsWith("-") ? "text-emerald-300" : "text-rose-300"} />
            <ScannerMobileMetric label="TA" value={row.ta} />
            <ScannerMobileMetric label="Momentum" value={row.momentum} />
          </div>
        </article>
      ))}
    </div>
  );
}

function ScannerMobileMetric({ label, value, tone = "text-slate-100" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-white/[0.025] px-3 py-2">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-600">{label}</div>
      <div className={`mt-1 break-words text-xs font-black leading-5 ${tone}`}>{value}</div>
    </div>
  );
}

function getSignalTone(signal: string) {
  if (signal === "Bullish") {
    return "bg-emerald-400/10 text-emerald-300";
  }

  if (signal === "Watch") {
    return "bg-amber-400/10 text-amber-300";
  }

  return "bg-slate-400/10 text-slate-300";
}
