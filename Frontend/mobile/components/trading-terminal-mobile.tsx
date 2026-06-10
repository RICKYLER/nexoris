import { X } from "lucide-react";

type MobilePosition = {
  id: string;
  pair: string;
  side: "Long" | "Short";
  size: string;
  entry: string;
  mark: string;
  pnl: string;
  margin: string;
};

type MobileOrder = {
  id: string;
  pair: string;
  type: string;
  side: "Buy" | "Sell";
  price: string;
  amount: string;
  status: string;
};

export function MobilePositionCards({
  positions,
  onClosePosition,
}: {
  positions: MobilePosition[];
  onClosePosition: (id: string) => void;
}) {
  return (
    <div className="space-y-3 p-3 sm:hidden">
      {positions.map((position) => (
        <article className="mini-panel p-3" key={position.id}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-black text-slate-100">{position.pair}</div>
              <div className={`mt-1 text-xs font-black ${position.side === "Long" ? "text-emerald-300" : "text-rose-300"}`}>{position.side}</div>
            </div>
            <div className={`text-right text-sm font-black ${position.pnl.startsWith("+") ? "text-emerald-300" : "text-rose-300"}`}>{position.pnl}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <MobileTerminalMetric label="Size" value={position.size} />
            <MobileTerminalMetric label="Entry" value={position.entry} />
            <MobileTerminalMetric label="Mark" value={position.mark} />
            <MobileTerminalMetric label="Margin" value={position.margin} />
          </div>
          <button className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-rose-300/25 bg-rose-300/10 px-2.5 py-2 text-xs font-black text-rose-200" onClick={() => onClosePosition(position.id)} type="button">
            <X className="h-3.5 w-3.5" />
            Close Position
          </button>
        </article>
      ))}
    </div>
  );
}

export function MobileOrderCards({
  orders,
  onCloseOrder,
}: {
  orders: MobileOrder[];
  onCloseOrder: (id: string) => void;
}) {
  return (
    <div className="space-y-3 p-3 sm:hidden">
      {orders.map((order) => (
        <article className="mini-panel p-3" key={order.id}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-black text-slate-100">{order.pair}</div>
              <div className="mt-1 text-xs font-bold text-slate-500">{order.type}</div>
            </div>
            <div className={`text-right text-sm font-black ${order.side === "Buy" ? "text-emerald-300" : "text-rose-300"}`}>{order.side}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <MobileTerminalMetric label="Price" value={order.price} />
            <MobileTerminalMetric label="Amount" value={order.amount} />
            <MobileTerminalMetric label="Status" value={order.status} tone="text-violet-300" />
          </div>
          <button className="mt-3 w-full rounded-md border border-slate-600 bg-white/[0.03] px-2.5 py-2 text-xs font-black text-slate-200" onClick={() => onCloseOrder(order.id)} type="button">
            Cancel Order
          </button>
        </article>
      ))}
    </div>
  );
}

export function MobileTerminalCards({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="space-y-3 p-3 sm:hidden">
      {rows.map((row) => (
        <article className="mini-panel p-3" key={row.join("-")}>
          <div className="space-y-2">
            {row.map((cell, index) => (
              <MobileTerminalMetric
                key={`${cell}-${index}`}
                label={headers[index] ?? `Field ${index + 1}`}
                value={cell}
                tone={index === 0 ? "text-slate-400" : "text-slate-100"}
              />
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function MobileTerminalMetric({ label, value, tone = "text-slate-100" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-md border border-slate-800 bg-white/[0.025] px-3 py-2">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-600">{label}</div>
      <div className={`mt-1 break-words text-xs font-black leading-5 ${tone}`}>{value}</div>
    </div>
  );
}
