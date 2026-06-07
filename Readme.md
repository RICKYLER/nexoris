Software Requirements Specification (SRS)

Nexoris MVP v1.0

1. Project Overview

Product Name

Nexoris

Tagline

AI-Powered Crypto Intelligence

Product Vision

Nexoris helps crypto traders discover high-probability trading opportunities by combining on-chain intelligence, whale tracking, and technical analysis into a single AI-powered platform.

---

2. MVP Goal

Provide users with a ranked list of cryptocurrencies based on:

- Smart Money Activity
- Whale Accumulation
- Exchange Flows
- Technical Analysis Signals

The platform should generate actionable insights within seconds.

---

3. Target Users

Primary Users

- Retail Crypto Traders
- Swing Traders
- Day Traders

Secondary Users

- Analysts
- Crypto Researchers
- Trading Communities

---

4. User Stories

Trader

As a trader,
I want to see the best trading opportunities today,
so I can make faster trading decisions.

Trader

As a trader,
I want to receive alerts when whales accumulate a coin,
so I can react before major market movements.

Trader

As a trader,
I want AI-generated explanations,
so I understand why a coin is being recommended.

---

5. MVP Features

Feature 1: AI Opportunity Scanner

Description

Scan supported assets and generate rankings.

Inputs

- On-chain data
- Technical indicators
- Volume
- Market momentum

Outputs

Opportunity Score (0-100)

Example:

ETH
Score: 87

Reasons:

- Whale accumulation detected
- Exchange outflow increasing
- RSI bullish
- Breakout confirmed

---

Feature 2: Whale Activity Dashboard

Description

Display whale activity for supported assets.

Data

- Large transactions
- Accumulation events
- Exchange transfers

UI

Cards showing:

- Coin
- Whale activity
- Timestamp
- Signal type

---

Feature 3: Smart Money Tracker

Description

Track curated high-performing wallets.

MVP Scope

Track:

- Top 100 wallets
- Wallet activity
- Holdings changes

Display

- Wallet Name
- Last Action
- Asset
- Amount

---

Feature 4: Technical Analysis Engine

Description

Automatically calculate technical signals.

Indicators

- RSI
- MACD
- Volume
- Moving Averages

Output

Bullish
Neutral
Bearish

Signal Score

---

Feature 5: Coin Intelligence Page

Description

Dedicated page for each asset.

Sections

Price Chart

Technical Signals

Whale Activity

AI Analysis

Opportunity Score

---

Feature 6: AI Market Summary

Description

Generate explanations using AI.

Example

"ETH received a score of 87 due to significant whale accumulation, decreasing exchange balances, and a bullish RSI trend."

---

Feature 7: Alert System

Trigger Conditions

Whale Buy

Whale Sell

Breakout Detected

Smart Money Entry

Channels

Email

Telegram

In-App Notification

---

6. AI Agent Architecture

Agent 1

Whale Agent

Responsibilities:

- Monitor whale wallets
- Detect accumulation

---

Agent 2

TA Agent

Responsibilities:

- Analyze indicators
- Generate technical score

---

Agent 3

Decision Agent

Responsibilities:

- Merge all signals
- Calculate final score

Formula:

Final Score =
40% On-Chain
+
40% Technical
+
20% Momentum

---

7. Dashboard Layout

Top Section

Market Overview

- BTC
- ETH
- Total Market Cap
- Fear & Greed

---

Middle Section

Top Opportunities

Example:

1. ETH — Score 87
2. SOL — Score 82
3. ARB — Score 79

---

Bottom Section

Recent Whale Activity

Recent Alerts

AI Market Summary

---

8. Technical Architecture

Frontend

- Next.js
- TypeScript
- TailwindCSS

---

Backend

- NestJS

---

AI Layer

- OpenAI API
- LangGraph

---

Database

- PostgreSQL
- Redis

---

Data Sources

Phase 1

- Arkham Intelligence API
- CoinGecko API
- TradingView Technical Data

---

9. Non-Functional Requirements

Performance

Dashboard Load:
< 3 seconds

Opportunity Refresh:
Every 5 minutes

Alert Delivery:
< 60 seconds

---

Security

- JWT Authentication
- OAuth Login
- HTTPS Encryption

---

Availability

99% Uptime

---

10. Revenue Model

Free Plan

- Top 5 opportunities
- Delayed alerts

---

Pro Plan ($19/month)

- Unlimited opportunities
- Real-time alerts
- AI explanations
- Whale tracking

---

Pro+ ($49/month)

- Advanced analytics
- Smart money tracking
- Portfolio intelligence

---

11. MVP Success Metrics

Within 90 Days:

- 1,000 Registered Users
- 100 Paying Users
- 10,000 Daily Opportunity Scans
- 70% User Retention

---

MVP Scope Summary

Build only:

✓ Opportunity Scanner

✓ Whale Tracking

✓ Technical Analysis

✓ AI Explanations

✓ Alerts

Do NOT build yet:

✗ Portfolio Management

✗ Auto Trading

✗ Copy Trading

✗ Mobile App

✗ Institutional Features

Focus on becoming the fastest way to discover high-conviction crypto opportunities. 

Nexoris – AI-Powered Crypto Intelligence

Opening One-Liner

"While most traders watch the chart, Nexoris watches the wallets moving the market."

---

The Problem

Crypto traders are drowning in data.

To make a single trading decision, traders jump between multiple platforms:

- On-chain analytics
- Trading charts
- Whale trackers
- News feeds
- Social media

Important signals are fragmented across different tools, making it difficult to identify high-conviction opportunities before the market reacts.

As a result, most retail traders are always one step behind smart money.

---

The Solution

Nexoris is an AI-powered crypto intelligence platform that combines:

- On-chain analytics
- Whale activity tracking
- Technical analysis
- Market sentiment
- Autonomous AI agents

Our AI agents continuously monitor the market and transform thousands of signals into clear, actionable trading insights.

Instead of spending hours researching, users receive:

- Top opportunities ranked by confidence
- Smart money activity alerts
- Bullish and bearish signals
- Risk assessments
- AI-generated trade setups

Think of it as a Bloomberg Terminal for crypto traders, powered by AI.

---

Revenue Model

Pro Subscription

$29–99/month

Access to:

- Advanced AI analysis
- Unlimited market scans
- Smart money tracking
- Real-time alerts

Institutional Plan

Custom pricing

Access to:

- API integrations
- Team workspaces
- Advanced analytics
- White-label intelligence

Future Revenue Streams

- Strategy marketplace
- Premium AI agents
- Enterprise intelligence feeds

---

Why Now?

AI agents are becoming mainstream.

On-chain data is growing exponentially.

Crypto markets operate 24/7.

Traders need intelligent systems that can process information faster than humans.

Nexoris sits at the intersection of AI, crypto intelligence, and autonomous decision support.

---

Closing One-Liner

"Nexoris doesn't predict the future—it helps traders see what the market is doing before everyone else does." 
