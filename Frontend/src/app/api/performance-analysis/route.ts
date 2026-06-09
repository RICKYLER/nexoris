import { NextResponse } from "next/server";

type PerformancePayload = {
  summary?: Record<string, unknown>;
  strategies?: unknown[];
  symbols?: unknown[];
  recentTrades?: unknown[];
};

export async function POST(request: Request) {
  try {
    const payload = await request.json() as PerformancePayload;
    const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";

    try {
      const interpretation = await askOllama(payload);

      return NextResponse.json({
        interpretation,
        provider: "ollama",
        model,
      });
    } catch {
      return NextResponse.json({
        interpretation: buildFallbackInterpretation(payload),
        provider: "local-fallback",
        model,
      });
    }
  } catch {
    return NextResponse.json({ error: "Unable to read performance payload" }, { status: 400 });
  }
}

async function askOllama(payload: PerformancePayload) {
  if (process.env.AI_PROVIDER !== "ollama") {
    throw new Error("Ollama provider is not enabled");
  }

  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/chat`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(process.env.OLLAMA_API_KEY ? { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are Nexoris Performance Coach, an AI trading performance analyst. Interpret one trader's metrics. Focus on WR, RRR, profit factor, recovery factor, Sharpe ratio, drawdown, symbols, and strategy effectiveness. Return 2 short paragraphs plus 2 action bullets. Use plain text only. No markdown headings, tables, or financial advice disclaimer.",
          },
          {
            role: "user",
            content: JSON.stringify(payload).slice(0, 6000),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    const content = typeof data?.message?.content === "string" ? data.message.content.trim() : "";

    if (!content) {
      throw new Error("Ollama returned an empty response");
    }

    return content;
  } finally {
    clearTimeout(timeout);
  }
}

function buildFallbackInterpretation(payload: PerformancePayload) {
  const summary = payload.summary ?? {};
  const winRate = readNumber(summary.winRate, 64.7);
  const avgRrr = readNumber(summary.avgRrr, 2.35);
  const profitFactor = readNumber(summary.profitFactor, 1.82);
  const recoveryFactor = readNumber(summary.recoveryFactor, 1.31);
  const sharpeRatio = readNumber(summary.sharpeRatio, 1.14);
  const bestStrategy = typeof summary.bestStrategy === "string" ? summary.bestStrategy : "breakout retest";

  return `This trader has a usable edge: WR is ${winRate}%, average RRR is ${avgRrr}R, and profit factor is ${profitFactor}. That means wins are frequent enough and large enough to offset losses, but the edge still needs risk discipline to become consistent.\n\nThe effective strategy is ${bestStrategy}. Recovery factor at ${recoveryFactor} and Sharpe at ${sharpeRatio} suggest the account is recovering, but drawdown control is still the main improvement area.\n\n- Keep scaling the best setup and reduce weak range/news trades.\n- Track every loss cluster and lower size after two consecutive invalidations.`;
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
