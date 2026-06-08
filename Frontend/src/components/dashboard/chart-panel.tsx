"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Settings, Wifi } from "lucide-react";

const tradingViewConfig = {
  autosize: true,
  symbol: "BINANCE:ETHUSDT",
  interval: "15",
  timezone: "Etc/UTC",
  theme: "dark",
  style: "1",
  locale: "en",
  enable_publishing: false,
  allow_symbol_change: true,
  calendar: false,
  details: false,
  hide_side_toolbar: false,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  save_image: true,
  backgroundColor: "#070d1a",
  gridColor: "rgba(137, 159, 190, 0.12)",
  studies: ["STD;Volume"],
  support_host: "https://www.tradingview.com",
};

export function ChartPanel() {
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [widgetKey, setWidgetKey] = useState(0);
  const [activeRange, setActiveRange] = useState("15m");

  const config = useMemo(
    () => ({
      ...tradingViewConfig,
      interval: activeRange.replace("m", ""),
    }),
    [activeRange],
  );

  useEffect(() => {
    const container = widgetRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = "";

    const widgetSlot = document.createElement("div");
    widgetSlot.className = "tradingview-widget-container__widget";
    widgetSlot.style.height = "100%";
    widgetSlot.style.width = "100%";

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify(config);

    container.appendChild(widgetSlot);
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [config, widgetKey]);

  return (
    <section className="panel mb-4 overflow-hidden">
      <div className="flex flex-col gap-3 border-b glass-line px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <EthereumIcon />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-black text-white">Ethereum / Tether (ETHUSDT)</h2>
              <span className="rounded bg-emerald-400/10 px-2 py-1 text-xs font-black text-emerald-300">BINANCE</span>
              <span className="flex items-center gap-1 rounded bg-emerald-400/10 px-2 py-1 text-[10px] font-black uppercase text-emerald-300">
                <Wifi className="h-3 w-3" />
                TradingView Live
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Embedded TradingView Advanced Chart widget with exchange market data.</div>
          </div>
        </div>

        <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
          {["1m", "5m", "15m", "1H", "4H", "1D"].map((item) => (
            <button
              className={`h-9 min-w-10 rounded-md px-3 text-xs font-black transition ${
                item === activeRange ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
              }`}
              key={item}
              onClick={() => setActiveRange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
          <button
            className="grid h-9 w-9 place-items-center rounded-md text-slate-400 hover:bg-white/[0.04] hover:text-white"
            onClick={() => setWidgetKey((current) => current + 1)}
            type="button"
            aria-label="Reload TradingView chart"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative h-[640px] min-h-[640px] overflow-hidden bg-[#070d1a]">
        <div
          ref={widgetRef}
          className="tradingview-widget-container h-full w-full"
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </section>
  );
}

function EthereumIcon() {
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#627eea] shadow-[0_0_18px_rgba(98,126,234,0.35)]" aria-hidden="true">
      <svg className="h-7 w-7" viewBox="0 0 64 64" role="img">
        <path d="M32 4 15 32 32 24 49 32 32 4Z" fill="#ffffff" fillOpacity="0.94" />
        <path d="M32 4v20l17 8L32 4Z" fill="#dbe4ff" fillOpacity="0.78" />
        <path d="M15 36 32 46 49 36 32 60 15 36Z" fill="#ffffff" fillOpacity="0.95" />
        <path d="M32 46v14l17-24-17 10Z" fill="#dbe4ff" fillOpacity="0.78" />
        <path d="M15 32 32 24 49 32 32 42 15 32Z" fill="#b9c7ff" />
        <path d="M32 24v18l17-10-17-8Z" fill="#8fa4ff" />
      </svg>
    </div>
  );
}
