import { LineChart, Settings } from "lucide-react";
import { IndicatorPanel, PriceLabel } from "@/components/dashboard/ui";

export function ChartPanel() {
  return (
    <section className="panel mb-4 overflow-hidden">
      <div className="flex flex-col gap-3 border-b glass-line px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md border border-slate-500/20 bg-slate-300/10">
            <span className="text-lg">E</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-black text-white">Ethereum (ETH)</h2>
              <span className="text-lg font-bold text-slate-300">$2,665.82</span>
              <span className="text-xs font-black text-emerald-300">+3.24%</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">AI confidence: bullish structure above trendline</div>
          </div>
        </div>

        <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
          {["1H", "4H", "1D", "1W"].map((item) => (
            <button
              className={`h-9 min-w-10 rounded-md px-3 text-xs font-black transition ${
                item === "1D" ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
          <button className="flex h-9 items-center gap-2 rounded-md px-3 text-xs font-black text-slate-400 hover:bg-white/[0.04] hover:text-white" type="button">
            <LineChart className="h-4 w-4" />
            Indicators
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-md text-slate-400 hover:bg-white/[0.04] hover:text-white" type="button" aria-label="Chart settings">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_116px]">
        <div className="chart-grid chart-mask relative min-h-[420px] overflow-hidden px-3 py-4 sm:px-5">
          <svg className="h-[360px] w-full" viewBox="0 0 840 360" preserveAspectRatio="none" aria-label="Ethereum price chart">
            <defs>
              <linearGradient id="supportArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,229,168,0.28)" />
                <stop offset="100%" stopColor="rgba(0,229,168,0.02)" />
              </linearGradient>
              <linearGradient id="volume" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,229,168,0.42)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0.18)" />
              </linearGradient>
            </defs>
            <path d="M50 238 L158 205 L264 218 L374 198 L487 176 L610 153 L762 132 L804 136 L804 292 L50 292 Z" fill="url(#supportArea)" />
            <line x1="50" y1="301" x2="792" y2="122" stroke="rgba(226,232,240,0.62)" strokeWidth="3" />
            <line x1="42" y1="108" x2="812" y2="108" stroke="rgba(244,63,94,0.72)" strokeWidth="1.5" />
            <line x1="42" y1="144" x2="812" y2="144" stroke="rgba(244,63,94,0.48)" strokeWidth="1.5" />
            <line x1="42" y1="214" x2="812" y2="214" stroke="rgba(34,211,238,0.48)" strokeWidth="1.5" />
            <line x1="42" y1="253" x2="812" y2="253" stroke="rgba(34,211,238,0.34)" strokeWidth="1.5" />
            {candles.map(([x, high, low, close, color], index) => {
              const open = Number(close) + (index % 2 === 0 ? 12 : -12);
              const y = Math.min(open, Number(close));
              const height = Math.max(Math.abs(open - Number(close)), 8);

              return (
                <g key={`${x}-${index}`}>
                  <line x1={x} x2={x} y1={low} y2={high} stroke={color as string} strokeWidth="2" />
                  <rect x={Number(x) - 5} y={y} width="10" height={height} rx="2" fill={color as string} />
                </g>
              );
            })}
            {Array.from({ length: 42 }).map((_, index) => (
              <rect
                fill={index % 3 === 0 ? "rgba(244,63,94,0.44)" : "url(#volume)"}
                height={16 + ((index * 13) % 48)}
                key={index}
                rx="2"
                width="7"
                x={48 + index * 18}
                y={326 - ((index * 13) % 48)}
              />
            ))}
          </svg>

          <div className="pointer-events-none absolute bottom-20 right-16 hidden rounded-md border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-right text-[11px] font-black uppercase text-emerald-200 shadow-glow md:block">
            Price Above Trendline
            <br />
            Bullish Structure
          </div>

          <div className="mt-2 flex justify-between px-4 text-xs font-semibold text-slate-500">
            <span>May</span>
            <span>6</span>
            <span>11</span>
            <span>16</span>
            <span>21</span>
            <span>26</span>
            <span>Jun</span>
            <span>6</span>
            <span>11</span>
          </div>
        </div>

        <div className="hidden border-l glass-line p-3 text-xs font-bold text-slate-500 xl:block">
          <PriceLabel value="2,880.00" tone="rose" />
          <PriceLabel value="2,740.00" tone="rose" />
          <PriceLabel value="2,665.82" tone="green" />
          <PriceLabel value="2,520.00" tone="cyan" />
          <PriceLabel value="2,350.00" tone="cyan" />
          <div className="mt-12 space-y-9 text-right">
            <div>2,800.00</div>
            <div>2,740.00</div>
            <div>2,680.00</div>
            <div>2,620.00</div>
            <div>2,560.00</div>
            <div>2,500.00</div>
            <div>2,000.00</div>
          </div>
        </div>
      </div>

      <div className="grid border-t glass-line md:grid-cols-2">
        <IndicatorPanel title="RSI (14)" value="63.7" tone="text-violet-300">
          <svg className="h-20 w-full" viewBox="0 0 360 90" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 70 C28 26 52 18 82 42 S132 72 160 50 214 22 250 36 310 66 360 30" fill="none" stroke="#8b5cf6" strokeWidth="3" />
            <path d="M0 70 C28 26 52 18 82 42 S132 72 160 50 214 22 250 36 310 66 360 30 L360 90 L0 90 Z" fill="rgba(139,92,246,0.16)" />
            <line x1="0" x2="360" y1="25" y2="25" stroke="rgba(148,163,184,0.22)" />
            <line x1="0" x2="360" y1="64" y2="64" stroke="rgba(148,163,184,0.22)" />
          </svg>
        </IndicatorPanel>
        <IndicatorPanel title="MACD (12, 26, close)" value="18.35 22.47 14.52" tone="text-emerald-300">
          <svg className="h-20 w-full" viewBox="0 0 360 90" preserveAspectRatio="none" aria-hidden="true">
            {Array.from({ length: 30 }).map((_, index) => {
              const value = Math.sin(index / 2.8) * 24;
              const positive = value > 0;

              return (
                <rect
                  fill={positive ? "rgba(0,229,168,0.72)" : "rgba(244,63,94,0.72)"}
                  height={Math.abs(value) + 5}
                  key={index}
                  rx="2"
                  width="7"
                  x={index * 12 + 8}
                  y={positive ? 45 - Math.abs(value) : 45}
                />
              );
            })}
            <path d="M0 50 C45 18 84 72 126 46 S190 38 228 56 306 24 360 36" fill="none" stroke="#22d3ee" strokeWidth="3" />
            <path d="M0 58 C45 38 92 54 132 38 S196 70 240 48 306 42 360 60" fill="none" stroke="#f59e0b" strokeWidth="3" />
          </svg>
        </IndicatorPanel>
      </div>
    </section>
  );
}

const candles: Array<[number, number, number, number, string]> = [
  [62, 254, 230, 246, "#00e5a8"],
  [82, 230, 210, 220, "#00e5a8"],
  [104, 213, 196, 204, "#00e5a8"],
  [128, 194, 218, 206, "#f43f5e"],
  [150, 213, 176, 188, "#00e5a8"],
  [174, 176, 201, 188, "#f43f5e"],
  [198, 196, 183, 190, "#00e5a8"],
  [222, 187, 214, 204, "#f43f5e"],
  [246, 210, 195, 202, "#00e5a8"],
  [270, 196, 220, 208, "#f43f5e"],
  [294, 218, 199, 207, "#00e5a8"],
  [318, 200, 184, 190, "#00e5a8"],
  [342, 184, 203, 194, "#f43f5e"],
  [366, 203, 186, 192, "#00e5a8"],
  [390, 187, 173, 180, "#00e5a8"],
  [414, 173, 196, 186, "#f43f5e"],
  [438, 195, 169, 181, "#00e5a8"],
  [462, 170, 153, 160, "#00e5a8"],
  [486, 154, 176, 166, "#f43f5e"],
  [510, 174, 160, 168, "#00e5a8"],
  [534, 161, 176, 169, "#f43f5e"],
  [558, 175, 163, 170, "#00e5a8"],
  [582, 165, 178, 172, "#f43f5e"],
  [606, 176, 157, 166, "#00e5a8"],
  [630, 156, 142, 149, "#00e5a8"],
  [654, 142, 168, 158, "#f43f5e"],
  [678, 166, 136, 149, "#00e5a8"],
  [702, 137, 158, 148, "#f43f5e"],
  [726, 156, 145, 151, "#00e5a8"],
  [750, 146, 163, 155, "#f43f5e"],
  [774, 162, 149, 156, "#00e5a8"],
];
