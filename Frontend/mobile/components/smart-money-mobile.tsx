type MobileSmartMoneyRow = {
  wallet: string;
  tags: string;
  action: string;
  asset: string;
  amount: string;
  value: string;
  time: string;
};

export function MobileSmartMoneyCards({ rows }: { rows: MobileSmartMoneyRow[] }) {
  return (
    <div className="space-y-3 p-3 sm:hidden">
      {rows.map((row) => (
        <article className="mini-panel p-3" key={`${row.wallet}-${row.time}`}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-mono text-xs font-black text-slate-400">{row.wallet}</div>
              <div className="mt-1 text-[11px] font-bold text-violet-300">{row.tags}</div>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-slate-500">{row.time}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <SmartMoneyMobileMetric label="Action" value={row.action} tone={getActionTone(row.action)} />
            <SmartMoneyMobileMetric label="Asset" value={row.asset} />
            <SmartMoneyMobileMetric label="Amount" value={row.amount} />
            <SmartMoneyMobileMetric label="Value" value={row.value} tone="text-emerald-300" />
          </div>
        </article>
      ))}
    </div>
  );
}

function SmartMoneyMobileMetric({ label, value, tone = "text-slate-100" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-white/[0.025] px-3 py-2">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-600">{label}</div>
      <div className={`mt-1 font-black ${tone}`}>{value}</div>
    </div>
  );
}

function getActionTone(action: string) {
  if (action === "Moved Out") {
    return "text-cyan-300";
  }

  if (action === "Bought") {
    return "text-emerald-300";
  }

  return "text-rose-300";
}
