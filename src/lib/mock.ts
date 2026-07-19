export type Agent = {
  id: string;
  name: string;
  handle: string;
  category: "Macro" | "Crypto" | "Geopolitics" | "Tech" | "AI" | "Sports";
  tagline: string;
  aum: number; // in USD
  roi: number; // all-time %
  winRate: number; // %
  sharpe: number;
  drawdown: number; // %
  trades: number;
  reputation: number; // 0-100
  color: string; // chart color css var
  series: number[]; // sparkline values
  verified: boolean;
};

const seedSeries = (start: number, drift: number, vol: number, n = 60, seed = 1) => {
  const arr: number[] = [];
  let v = start;
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < n; i++) {
    v = Math.max(1, v + drift + (rand() - 0.5) * vol);
    arr.push(Number(v.toFixed(2)));
  }
  return arr;
};

export const AGENTS: Agent[] = [
  {
    id: "oracle-07",
    name: "ORACLE-07",
    handle: "oracle07.sol",
    category: "Macro",
    tagline: "Cross-chain macro trading across rates, FX, and commodities. Non-custodial vault.",
    aum: 4_240_000,
    roi: 94.2,
    winRate: 92,
    sharpe: 2.84,
    drawdown: 6.1,
    trades: 1248,
    reputation: 97,
    color: "var(--chart-1)",
    series: seedSeries(100, 0.7, 4, 60, 11),
    verified: true,
  },
  {
    id: "helix",
    name: "HELIX",
    handle: "helix.sol",
    category: "Crypto",
    tagline: "Crypto-native flow, MEV, and cross-chain liquidity signals. Trustless vault.",
    aum: 3_120_000,
    roi: 87.6,
    winRate: 89,
    sharpe: 2.41,
    drawdown: 8.4,
    trades: 986,
    reputation: 93,
    color: "var(--chart-2)",
    series: seedSeries(100, 0.6, 5, 60, 22),
    verified: true,
  },
  {
    id: "kairos",
    name: "KAIROS",
    handle: "kairos.sol",
    category: "Geopolitics",
    tagline: "Geopolitical event-driven strategies with cross-chain execution. Public reputation.",
    aum: 2_080_000,
    roi: 73.4,
    winRate: 81,
    sharpe: 1.92,
    drawdown: 11.2,
    trades: 754,
    reputation: 88,
    color: "var(--chart-3)",
    series: seedSeries(100, 0.4, 5.5, 60, 33),
    verified: true,
  },
  {
    id: "mirage-v3",
    name: "MIRAGE_v3",
    handle: "mirage.sol",
    category: "Tech",
    tagline: "Tech event arbitrage across equities and tokenized assets. Non-custodial.",
    aum: 1_650_000,
    roi: 69.8,
    winRate: 78,
    sharpe: 1.71,
    drawdown: 9.7,
    trades: 612,
    reputation: 84,
    color: "var(--chart-4)",
    series: seedSeries(100, 0.35, 4.5, 60, 44),
    verified: true,
  },
  {
    id: "aether",
    name: "AETHER-AI",
    handle: "aether.sol",
    category: "AI",
    tagline: "AI-frontier research signals traded across chains. Verified track record.",
    aum: 1_240_000,
    roi: 66.1,
    winRate: 76,
    sharpe: 1.63,
    drawdown: 10.5,
    trades: 512,
    reputation: 82,
    color: "var(--chart-2)",
    series: seedSeries(100, 0.3, 5, 60, 55),
    verified: true,
  },
  {
    id: "trendhunter",
    name: "TRENDHUNTER",
    handle: "trend.sol",
    category: "Sports",
    tagline: "Sports and alternative data strategies with cross-market execution.",
    aum: 890_000,
    roi: 58.7,
    winRate: 71,
    sharpe: 1.44,
    drawdown: 13.1,
    trades: 412,
    reputation: 76,
    color: "var(--chart-5)",
    series: seedSeries(100, 0.25, 5.5, 60, 66),
    verified: false,
  },
];

export const PROTOCOL_SNAPSHOT = {
  agentsRegistered: 1842,
  agentsDelta: 37,
  openMarkets: 1204,
  marketsDelta: 18,
  tvlSol: 41208,
  tvlDelta: 2.4,
  volume30d: 18_400_000,
  volumeDelta: 11.9,
  totalValueDeployed: 24_250_750,
  totalPayouts: 3_420_000,
  avgRoi: 68.7,
  winRate: 72.1,
};

export const TICKER_ITEMS: string[] = [
  "new agent registered: helix.sol",
  "ORACLE-07 vault crossed $4.24M AUM",
  "kairos.sol reputation +3 (cross-chain streak)",
  "HELIX executed cross-chain arb: SOL → ETH",
  "vault deposit: 8.4 SOL → ORACLE-07",
  "MIRAGE_v3 non-custodial vault rebalanced",
  "AETHER-AI opened BTC perp signal on Hyperliquid",
  "top agent · 30d · ORACLE-07 +412.8%",
];

export type Market = {
  id: string;
  title: string;
  category: Agent["category"];
  expiry: string;
  probability: number; // 0-1 YES
  liquidity: number;
  participants: number;
  createdBy: string; // agent id
  volume24h: number;
};

export const MARKETS: Market[] = [
  { id: "US-CPI-JAN-26", title: "US CPI YoY > 3.2% for January 2026", category: "Macro", expiry: "Feb 12, 2026", probability: 0.42, liquidity: 148_200, participants: 312, createdBy: "oracle-07", volume24h: 82_400 },
  { id: "SOL-200-Q1", title: "SOL closes above $260 by Mar 31, 2026", category: "Crypto", expiry: "Mar 31, 2026", probability: 0.61, liquidity: 92_800, participants: 214, createdBy: "helix", volume24h: 54_100 },
  { id: "EU-RATE-MAR", title: "ECB cuts rates by 25bps in March 2026", category: "Macro", expiry: "Mar 14, 2026", probability: 0.78, liquidity: 210_400, participants: 421, createdBy: "oracle-07", volume24h: 121_900 },
  { id: "OAI-GPT6", title: "OpenAI announces GPT-6 before Q3 2026", category: "AI", expiry: "Sep 30, 2026", probability: 0.34, liquidity: 71_200, participants: 187, createdBy: "aether", volume24h: 39_800 },
  { id: "TW-STRAIT", title: "No naval incident in Taiwan Strait through Q2", category: "Geopolitics", expiry: "Jun 30, 2026", probability: 0.83, liquidity: 118_600, participants: 267, createdBy: "kairos", volume24h: 44_500 },
  { id: "AAPL-VISION", title: "Apple ships next-gen Vision device by WWDC", category: "Tech", expiry: "Jun 09, 2026", probability: 0.55, liquidity: 84_300, participants: 198, createdBy: "mirage-v3", volume24h: 27_600 },
];

export function formatUSD(n: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
export function formatSOL(n: number) {
  return `${n.toLocaleString("en-US")} SOL`;
}
