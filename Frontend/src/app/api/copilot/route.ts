import { NextResponse } from "next/server";

type CopilotHistoryMessage = {
  role: "assistant" | "user";
  body: string;
};

type OllamaChatMessage = {
  role: "assistant" | "system" | "user";
  content: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = String(body.message ?? "").trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";

    try {
      const reply = await askOllama(message, history);

      return NextResponse.json({
        reply,
        provider: "ollama",
        model,
      });
    } catch {
      return NextResponse.json({
        reply: buildFallbackReply(message),
        provider: "local-fallback",
        model,
      });
    }
  } catch {
    return NextResponse.json({ error: "Unable to read Copilot request" }, { status: 400 });
  }
}

async function askOllama(message: string, history: CopilotHistoryMessage[]) {
  if (process.env.AI_PROVIDER !== "ollama") {
    throw new Error("Ollama provider is not enabled");
  }

  const baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL ?? "llama3.1:8b";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

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
        messages: buildMessages(message, history),
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

function buildMessages(message: string, history: CopilotHistoryMessage[]): OllamaChatMessage[] {
  const recentHistory = history
    .filter((item): item is CopilotHistoryMessage => item?.role === "assistant" || item?.role === "user")
    .map((item) => ({
      role: item.role,
      content: item.body.slice(0, 1200),
    }));

  const messages: OllamaChatMessage[] = [
    {
      role: "system",
      content:
        "You are Nexoris AI Copilot, a concise crypto intelligence assistant. Use available dashboard context. Answer in 2-4 short paragraphs or bullets. Include risk or invalidation when giving market setups. Do not invent live prices unless provided. Use plain text only: no markdown headings, bold, tables, or code blocks. No financial advice disclaimer.",
    },
    {
      role: "system",
      content:
        "Dashboard context: top opportunities ETH score 87, ARB score 82, SOL score 80, LINK score 76. Active alerts: whale accumulation on ETH, exchange outflow on ETH, smart money buy on ARB, SOL breakout, and LINK social sentiment spike. A separate chart-analysis route can provide live TA. Keep answers practical and concise.",
    },
    ...recentHistory,
    {
      role: "user",
      content: message.slice(0, 2400),
    },
  ];

  return messages;
}

function buildFallbackReply(prompt: string) {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("btc")) {
    return "BTC needs a chart-confirmed read from support and resistance before forcing a bias. Watch the nearest higher low for invalidation and avoid chasing the middle of the range.";
  }

  if (normalized.includes("eth")) {
    return "ETH still has the cleaner dashboard context because whale accumulation and exchange outflow are both supportive. The risk is a failed breakout, so confirmation near resistance matters.";
  }

  if (normalized.includes("whale")) {
    return "Whale signals are strongest when accumulation appears with exchange outflow and volume confirmation. ETH is the main dashboard alert right now, while ARB has smart money activity.";
  }

  if (normalized.includes("alert")) {
    return "The highest priority alerts are ETH whale accumulation, ETH exchange outflow, ARB smart money buy, SOL breakout, and LINK sentiment spike. Treat sentiment-only alerts as lower confidence until price confirms.";
  }

  return "I would frame this as a market context check: confirm the coin, timeframe, nearby support, resistance, whale flow, and momentum. A good setup needs a trigger, invalidation, and a reason to wait if price is in the middle.";
}
