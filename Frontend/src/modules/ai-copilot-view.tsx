"use client";

import { useMemo, useState } from "react";
import { Activity, Bell, Bot, BrainCircuit, LineChart, Send, Shield, Sparkles, Wallet } from "lucide-react";
import { moduleKpis } from "@/data/dashboard-data";
import { CoinBadge, ModuleKpiGrid, ModuleStack, PanelTitle, ProgressRow, TwoColumn } from "@/components/dashboard/ui";

type CopilotMessage = {
  id: string;
  role: "assistant" | "user";
  body: string;
  meta?: string;
};

type CopilotStatus = "error" | "ready" | "thinking";

const starterMessages: CopilotMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    body: "I am watching chart structure, whale alerts, smart money flow, and market sentiment. Ask me for a coin read, risk check, or alert summary.",
    meta: "Nexoris Copilot",
  },
];

const promptChips = [
  "Analyze BTC 15m risk",
  "Why is ETH ranked high?",
  "Show whale accumulation",
  "Find bullish setups",
  "Summarize active alerts",
];

export function AiCopilotView() {
  const [messages, setMessages] = useState<CopilotMessage[]>(starterMessages);
  const [draft, setDraft] = useState("");
  const [copilotStatus, setCopilotStatus] = useState<CopilotStatus>("ready");
  const activeContext = useMemo(() => copilotContext.slice(0, 4), []);
  const statusBadge = getStatusBadge(copilotStatus);

  const submitPrompt = async (prompt: string) => {
    const cleanPrompt = prompt.trim();

    if (!cleanPrompt || copilotStatus === "thinking") {
      return;
    }

    const history = messages.slice(-8);
    const userMessage: CopilotMessage = { id: makeMessageId("user"), role: "user", body: cleanPrompt };

    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setCopilotStatus("thinking");

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanPrompt,
          history: history.map((item) => ({ role: item.role, body: item.body })),
        }),
      });

      if (!response.ok) {
        throw new Error("Copilot request failed");
      }

      const data = await response.json();
      const reply = typeof data?.reply === "string" && data.reply.trim() ? data.reply.trim() : buildCopilotReply(cleanPrompt);
      const isFallback = data?.provider === "local-fallback";

      setMessages((current) => [
        ...current,
        {
          id: makeMessageId("assistant"),
          role: "assistant",
          body: reply,
          meta: isFallback ? "Local fallback" : `${String(data?.model ?? "Ollama")} market reasoning`,
        },
      ]);
      setCopilotStatus(isFallback ? "error" : "ready");
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: makeMessageId("assistant"),
          role: "assistant",
          body: buildCopilotReply(cleanPrompt),
          meta: "Local fallback",
        },
      ]);
      setCopilotStatus("error");
    }
  };

  return (
    <ModuleStack>
      <ModuleKpiGrid items={moduleKpis["ai-copilot"]} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel overflow-hidden">
          <div className="border-b glass-line px-4 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md border border-violet-300/25 bg-violet-300/10 text-violet-200">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-slate-100">Nexoris AI Copilot</div>
                  <div className="mt-1 text-xs text-slate-500">Market assistant for charts, wallets, alerts, and risk.</div>
                </div>
              </div>
              <span className={`rounded border px-2 py-1 text-xs font-black ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>

            <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto">
              {promptChips.map((prompt) => (
                <button
                  className="min-w-max rounded-md border border-slate-800 bg-white/[0.025] px-3 py-2 text-xs font-black text-slate-300 transition hover:border-violet-400/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={copilotStatus === "thinking"}
                  key={prompt}
                  onClick={() => void submitPrompt(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[560px] min-h-[440px] space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          <form
            className="border-t glass-line p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submitPrompt(draft);
            }}
          >
            <label className="sr-only" htmlFor="nexoris-copilot-input">Ask Nexoris AI</label>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <textarea
                className="min-h-[72px] resize-none rounded-md border border-slate-800 bg-[#070d1a] px-3 py-3 text-sm leading-5 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-violet-400/60"
                id="nexoris-copilot-input"
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about BTC risk, ETH whale flow, SOL breakout, or active alerts..."
                value={draft}
              />
              <button
                className="flex h-[72px] items-center justify-center gap-2 rounded-md bg-violet-600 px-5 text-sm font-black text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={copilotStatus === "thinking"}
                type="submit"
              >
                {copilotStatus === "thinking" ? "Thinking" : "Ask"}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <section className="panel p-4">
            <PanelTitle title="Live Context" action="Synced" icon={BrainCircuit} />
            <div className="space-y-3">
              {activeContext.map((item) => {
                const Icon = item.icon;

                return (
                  <div className="mini-panel flex items-start gap-3 p-3" key={item.label}>
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${item.tone}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-100">{item.label}</div>
                      <div className="mt-1 text-xs leading-5 text-slate-500">{item.body}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel p-4">
            <PanelTitle title="Focus Assets" action="Top watched" icon={Sparkles} />
            <div className="space-y-4">
              {[
                { coin: "ETH", value: 87, tone: "bg-violet-400" },
                { coin: "SOL", value: 80, tone: "bg-emerald-400" },
                { coin: "ARB", value: 82, tone: "bg-cyan-400" },
              ].map((asset) => (
                <div key={asset.coin}>
                  <div className="mb-2 flex items-center justify-between">
                    <CoinBadge coin={asset.coin} />
                    <span className="text-sm font-black text-emerald-300">{asset.value}</span>
                  </div>
                  <ProgressRow label="AI conviction" value={asset.value} tone={asset.tone} />
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <TwoColumn>
        <CopilotWorkflow />
        <CopilotGuardrails />
      </TwoColumn>
    </ModuleStack>
  );
}

function MessageBubble({ message }: { message: CopilotMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article className={`max-w-[780px] rounded-md border px-4 py-3 ${
        isUser
          ? "border-violet-300/25 bg-violet-600/20 text-slate-100"
          : "border-slate-800 bg-white/[0.025] text-slate-300"
      }`}>
        {message.meta ? <div className="mb-2 text-xs font-black uppercase tracking-wide text-violet-300">{message.meta}</div> : null}
        <p className="whitespace-pre-line text-sm leading-6">{message.body}</p>
      </article>
    </div>
  );
}

function getStatusBadge(status: CopilotStatus) {
  if (status === "thinking") {
    return {
      label: "Thinking",
      className: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    };
  }

  if (status === "error") {
    return {
      label: "Fallback",
      className: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    };
  }

  return {
    label: "Ollama",
    className: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  };
}

function makeMessageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function CopilotWorkflow() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Copilot Workflow" action="MVP" icon={Activity} />
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["1", "Read market context", "Pull latest chart, alerts, scanner ranks, and wallet events."],
          ["2", "Reason with agents", "Blend TA, whale flow, sentiment, and risk guardrails."],
          ["3", "Return setup", "Produce bias, levels, invalidation, and next action."],
          ["4", "Keep audit trail", "Save useful answers into reports and alerts."],
        ].map(([step, title, body]) => (
          <div className="mini-panel p-4" key={step}>
            <div className="mb-3 grid h-8 w-8 place-items-center rounded-md bg-violet-400/10 text-sm font-black text-violet-200">{step}</div>
            <div className="text-sm font-black text-slate-100">{title}</div>
            <div className="mt-2 text-xs leading-5 text-slate-500">{body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CopilotGuardrails() {
  return (
    <section className="panel p-4">
      <PanelTitle title="Guardrails" action="Enabled" icon={Shield} />
      <div className="space-y-3">
        {[
          ["Risk first", "Every setup includes invalidation and position risk context."],
          ["No blind calls", "Copilot explains why a coin is bullish, bearish, or neutral."],
          ["Data-backed", "Answers should reference chart, whale, sentiment, or alert evidence."],
          ["Action clear", "Outputs stay short enough to act on during live markets."],
        ].map(([title, body]) => (
          <div className="mini-panel p-3" key={title}>
            <div className="text-sm font-black text-slate-100">{title}</div>
            <div className="mt-1 text-xs leading-5 text-slate-500">{body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildCopilotReply(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("btc")) {
    return "BTC is currently a range read until price clears resistance with volume. I would watch the prior high for confirmation, keep invalidation below the nearest higher low, and avoid chasing the middle of the range.";
  }

  if (normalized.includes("eth")) {
    return "ETH remains one of the cleaner opportunity reads because exchange outflow and whale accumulation are supportive. The trade still needs chart confirmation near resistance before treating it as continuation.";
  }

  if (normalized.includes("whale")) {
    return "Whale activity is constructive when accumulation pairs with exchange outflow. The strongest reads are ETH and SOL right now because whale behavior and momentum are aligned.";
  }

  if (normalized.includes("alert")) {
    return "High priority alerts are whale accumulation, exchange outflow spikes, and confirmed breakouts. I would route those to in-app and Telegram, while keeping sentiment-only alerts medium priority.";
  }

  return "I would frame this as a context check: confirm the coin, timeframe, nearby support and resistance, then compare whale flow against chart momentum before deciding bullish, bearish, or neutral.";
}

const copilotContext = [
  {
    label: "Chart Analysis",
    body: "15m technical reads include support, resistance, trendline, momentum, and invalidation.",
    icon: LineChart,
    tone: "bg-cyan-300/10 text-cyan-200",
  },
  {
    label: "Whale Activity",
    body: "Large wallet movements and exchange transfers are used to detect accumulation pressure.",
    icon: Wallet,
    tone: "bg-emerald-300/10 text-emerald-200",
  },
  {
    label: "Alert Rules",
    body: "Copilot can summarize triggered rules and turn signals into notification-ready notes.",
    icon: Bell,
    tone: "bg-violet-300/10 text-violet-200",
  },
  {
    label: "Risk Guard",
    body: "Every trade idea should include invalidation, confidence, and reason to wait.",
    icon: Shield,
    tone: "bg-amber-300/10 text-amber-200",
  },
];
