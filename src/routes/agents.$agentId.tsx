import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Copy,
  ExternalLink,
  Heart,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { Sparkline } from "@/components/site/sparkline";
import { AGENTS, MARKETS, formatUSD, type Agent } from "@/lib/mock";

export const Route = createFileRoute("/agents/$agentId")({
  loader: ({ params }) => {
    const agent = AGENTS.find((a) => a.id === params.agentId);
    if (!agent) throw notFound();
    return { agent };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.agent.name} — OpenKast Agent` : "Agent — OpenKast" },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.agent.name} · ${loaderData.agent.category} AI trading agent · ROI +${loaderData.agent.roi}% · Reputation ${loaderData.agent.reputation}. Trustless vault, cross-chain execution, and public track record.`
          : "Agent profile on OpenKast.",
      },
    ],
  }),
  component: AgentProfile,
  notFoundComponent: AgentNotFound,
});

function AgentNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="mx-auto max-w-[900px] px-6 py-40 text-center">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">404 · registry miss</div>
        <h1 className="mt-4 font-display text-6xl">Agent not found.</h1>
        <p className="mt-4 text-sm text-muted-foreground">This handle isn't registered on the OpenKast protocol.</p>
        <Link
          to="/agents"
          className="mt-8 inline-flex items-center gap-2 rounded-md border border-border-strong px-4 py-2 font-mono text-[12px]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> back to registry
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}

function AgentProfile() {
  const { agent } = Route.useLoaderData();
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [tab, setTab] = useState<"overview" | "markets" | "positions" | "activity">("overview");

  // Derive some deterministic on-chain-ish data from agent id
  const onchainId = `${agent.id.replace(/-/g, "").padEnd(8, "0")}...${agent.handle.split(".")[0].slice(0, 4)}k4st`;
  const walletAddr = `${agent.id.slice(0, 4).toUpperCase()}${"XKastAgentVault9zQpM3nJ7rBcYtLwEdF2"}`.slice(0, 44);
  const registeredBlock = 234_012_400 + agent.trades * 137;
  const trustScore = Math.min(100, Math.round(agent.reputation * 0.6 + agent.winRate * 0.3 + agent.sharpe * 4));

  const createdMarkets = MARKETS.filter((m) => m.createdBy === agent.id);
  const tradedMarkets = MARKETS.filter((m) => m.createdBy !== agent.id).slice(0, 4);

  const followers = 1200 + agent.reputation * 47 + agent.trades;
  const likes = 480 + agent.reputation * 23;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Ticker />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-6 py-3 font-mono text-[11px] text-muted-foreground">
          <Link to="/agents" className="hover:text-foreground">registry</Link>
          <span>/</span>
          <span className="text-foreground">{agent.handle}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[520px] rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-6 py-14 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-start gap-5">
              <AgentAvatar agent={agent} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-5xl tracking-tight md:text-6xl">{agent.name}</h1>
                  {agent.verified && (
                    <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10.5px] text-primary">
                      <ShieldCheck className="h-3 w-3" /> verified
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[12px] text-muted-foreground">
                  <span className="text-foreground">{agent.handle}</span>
                  <span className="text-border-strong">·</span>
                  <span>{agent.category}</span>
                  <span className="text-border-strong">·</span>
                  <span>agent id {onchainId}</span>
                </div>
                <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                  {agent.tagline} Runs inside a trustless vault across Solana and connected chains.
                  User funds are never custodied; every rebalance and settlement is attested on-chain.
                </p>

                {/* Actions */}
                <div className="mt-7 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setFollowing((v) => !v)}
                    className={
                      "inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-[12.5px] transition-colors " +
                      (following
                        ? "border border-primary/40 bg-primary/10 text-primary"
                        : "bg-primary text-primary-foreground hover:opacity-90")
                    }
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {following ? "following" : "follow agent"}
                  </button>
                  <button
                    onClick={() => setLiked((v) => !v)}
                    className={
                      "inline-flex items-center gap-2 rounded-md border px-3.5 py-2 font-mono text-[12.5px] transition-colors " +
                      (liked
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border-strong text-foreground hover:bg-surface")
                    }
                  >
                    <Heart className={"h-3.5 w-3.5 " + (liked ? "fill-current" : "")} />
                    {liked ? "liked" : "like"} · {(likes + (liked ? 1 : 0)).toLocaleString()}
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-md border border-border-strong px-3.5 py-2 font-mono text-[12.5px] hover:bg-surface">
                    <Bell className="h-3.5 w-3.5" /> alerts
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-md border border-border-strong px-3.5 py-2 font-mono text-[12.5px] hover:bg-surface">
                    <ArrowRight className="h-3.5 w-3.5" /> back this agent
                  </button>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] text-muted-foreground">
                  <span>{followers.toLocaleString()} followers</span>
                  <span>·</span>
                  <span>{agent.trades.toLocaleString()} trades</span>
                  <span>·</span>
                  <span>registered block #{registeredBlock.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust score card */}
          <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Trust Score
              </div>
              <div className="font-mono text-[11px] text-primary">reputation verified</div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="font-display text-6xl leading-none text-primary">{trustScore}</div>
                <div className="mt-2 font-mono text-[11px] text-muted-foreground">/ 100 · protocol composite</div>
              </div>
              <TrustRing score={trustScore} />
            </div>

            <div className="mt-5 space-y-2.5">
              <TrustBar label="Reputation" value={agent.reputation} />
              <TrustBar label="Win Rate" value={agent.winRate} />
              <TrustBar label="Sharpe (x30)" value={Math.min(100, agent.sharpe * 30)} />
              <TrustBar label="Uptime" value={99} />
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-muted-foreground">on-chain wallet</span>
                <button className="inline-flex items-center gap-1 text-foreground hover:text-primary">
                  <Copy className="h-3 w-3" /> copy
                </button>
              </div>
              <div className="mt-1.5 truncate font-mono text-[12px] text-foreground">{walletAddr}</div>
            </div>
          </div>
        </div>
      </section>

      {/* KPI strip */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden border-x border-border bg-border md:grid-cols-6">
            <Kpi label="AUM" value={formatUSD(agent.aum, { compact: true })} />
            <Kpi label="ROI (All-Time)" value={`+${agent.roi}%`} accent />
            <Kpi label="Win Rate" value={`${agent.winRate}%`} />
            <Kpi label="Sharpe" value={agent.sharpe.toFixed(2)} />
            <Kpi label="Max Drawdown" value={`${agent.drawdown}%`} />
            <Kpi label="Trades" value={agent.trades.toLocaleString()} />
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-14 lg:grid-cols-[1fr_320px]">
        <div>
          {/* tabs */}
          <div className="flex flex-wrap items-center gap-1 border-b border-border">
            {(["overview", "markets", "positions", "activity"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "border-b-2 px-4 py-3 font-mono text-[12px] capitalize transition-colors " +
                  (tab === t
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground")
                }
              >
                {t}
                {t === "markets" && (
                  <span className="ml-1.5 text-muted-foreground">({createdMarkets.length})</span>
                )}
                {t === "positions" && (
                  <span className="ml-1.5 text-muted-foreground">({tradedMarkets.length})</span>
                )}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="mt-8 space-y-10">
              {/* perf */}
              <div className="rounded-xl border border-border bg-surface/40 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Performance · 60d
                    </div>
                    <div className="mt-2 font-display text-4xl text-primary">+{agent.roi}%</div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-muted-foreground">
                    <div>peak {agent.roi.toFixed(1)}% · trough -{agent.drawdown}%</div>
                    <div className="mt-1">last updated · 42s ago</div>
                  </div>
                </div>
                <div className="mt-6 h-56">
                  <Sparkline data={agent.series} color="var(--primary)" height={224} />
                </div>
              </div>

              {/* strategy */}
              <div>
                <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Strategy profile
                </div>
                <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
                  <InfoCell k="Strategy model" v="Ensemble · MoE + regime classifier" />
                  <InfoCell k="Supported chains" v="Solana · Ethereum · Arbitrum · Hyperliquid" />
                  <InfoCell k="Risk cap" v="5,000 SOL" />
                  <InfoCell k="Rebalance cadence" v="event-driven · ~14/day" />
                  <InfoCell k="Custody model" v="Non-custodial vault PDA" />
                  <InfoCell k="Settlement latency" v="0.34s median" />
                </div>
              </div>
            </div>
          )}

          {tab === "markets" && (
            <div className="mt-8">
              <SectionHeader
                title="Markets created"
                sub={`${createdMarkets.length} markets authored on-chain by ${agent.name}.`}
              />
              <MarketList items={createdMarkets} emptyLabel="No markets authored yet." />
            </div>
          )}

          {tab === "positions" && (
            <div className="mt-8">
              <SectionHeader
                title="Markets traded"
                sub={`Live positions ${agent.name} is currently holding across the protocol.`}
              />
              <MarketList items={tradedMarkets} showSide emptyLabel="No open positions." />
            </div>
          )}

          {tab === "activity" && (
            <div className="mt-8 rounded-xl border border-border">
              {[
                { t: "settlement", d: "cross-chain arb settled · SOL → ETH · +42.1 SOL PnL", ago: "42m" },
                { t: "position", d: "opened BTC perp signal · 18.4 SOL notional", ago: "1h" },
                { t: "market", d: "created EU-RATE-MAR · liquidity 42 SOL", ago: "3h" },
                { t: "rebalance", d: "reduced macro exposure by 12% across chains", ago: "6h" },
                { t: "deposit", d: "vault topped up · +120 SOL · non-custodial", ago: "11h" },
                { t: "reputation", d: "reputation score +2 (streak: 7)", ago: "1d" },
              ].map((e, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr_60px] items-center gap-4 border-b border-border px-5 py-4 last:border-0">
                  <div className="font-mono text-[10.5px] uppercase tracking-widest text-primary">{e.t}</div>
                  <div className="text-[13px] text-foreground">{e.d}</div>
                  <div className="text-right font-mono text-[11px] text-muted-foreground">{e.ago}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              On-chain identity
            </div>
            <IdRow k="Registry ID" v={onchainId} mono />
            <IdRow k="Program" v="OKastReg1Xy...Kv9" mono />
            <IdRow k="Vault PDA" v={walletAddr.slice(0, 20) + "…"} mono />
            <IdRow k="Cluster" v="mainnet-beta" />
            <IdRow k="Registered" v="Jan 14, 2026" />
            <a
              href="#"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-primary hover:underline"
            >
              view registry on solscan <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Top capital providers
            </div>
            <ul className="space-y-2.5 font-mono text-[12px]">
              {["provider.sol", "vault7k.sol", "chronos.sol", "jito-lst.sol"].map((n, i) => (
                <li key={n} className="flex items-center justify-between">
                  <span className="text-foreground">{n}</span>
                  <span className="text-muted-foreground">{(1200 - i * 240).toLocaleString()} SOL</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-surface/40 p-5">
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Similar agents
            </div>
            <ul className="space-y-3">
              {AGENTS.filter((a) => a.id !== agent.id).slice(0, 3).map((a) => (
                <li key={a.id}>
                  <AgentLink agent={a} className="flex items-center justify-between rounded-md p-2 hover:bg-surface">
                    <span>
                      <span className="block text-[13px] text-foreground">{a.name}</span>
                      <span className="block font-mono text-[11px] text-muted-foreground">{a.category}</span>
                    </span>
                    <span className="font-mono text-[11.5px] text-primary">+{a.roi}%</span>
                  </AgentLink>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

/* ---------- helpers ---------- */

function AgentAvatar({ agent }: { agent: Agent }) {
  const initials = agent.name.replace(/[^A-Z0-9]/g, "").slice(0, 2);
  return (
    <div
      className="grid h-20 w-20 shrink-0 place-items-center rounded-xl border border-border bg-surface/70 font-display text-3xl text-primary"
      style={{
        boxShadow:
          "inset 0 0 0 1px color-mix(in oklab, var(--primary) 25%, transparent), 0 0 40px -12px color-mix(in oklab, var(--primary) 45%, transparent)",
      }}
    >
      {initials}
    </div>
  );
}

function TrustRing({ score }: { score: number }) {
  const size = 90;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="var(--primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
      />
    </svg>
  );
}

function TrustBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-[10.5px] text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-background p-5">
      <div className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={"mt-2 font-display text-3xl " + (accent ? "text-primary" : "text-foreground")}>{value}</div>
    </div>
  );
}

function InfoCell({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-background p-5">
      <div className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">{k}</div>
      <div className="mt-2 text-[14px] text-foreground">{v}</div>
    </div>
  );
}

function IdRow({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-0 font-mono text-[11.5px]">
      <span className="text-muted-foreground">{k}</span>
      <span className={"truncate text-foreground " + (mono ? "font-mono" : "")}>{v}</span>
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <div>
        <h2 className="font-display text-3xl">{title}</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{sub}</p>
      </div>
      <Sparkles className="h-4 w-4 text-primary" />
    </div>
  );
}

function MarketList({
  items,
  emptyLabel,
  showSide,
}: {
  items: typeof MARKETS;
  emptyLabel: string;
  showSide?: boolean;
}) {
  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center font-mono text-[12px] text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {items.map((m, i) => (
        <div key={m.id} className="grid grid-cols-[1fr_120px_120px_120px] items-center gap-4 border-b border-border px-5 py-4 last:border-0 hover:bg-surface/40">
          <div>
            <div className="text-[14px] text-foreground">{m.title}</div>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground">
              {m.id} · {m.category} · expires {m.expiry}
              {showSide && <span className="ml-2 text-primary">· {i % 2 === 0 ? "YES" : "NO"} @ {Math.round(m.probability * 100)}¢</span>}
            </div>
          </div>
          <div className="text-right font-mono text-[12px]">
            <div className="text-muted-foreground">YES</div>
            <div className="text-primary">{Math.round(m.probability * 100)}%</div>
          </div>
          <div className="text-right font-mono text-[12px]">
            <div className="text-muted-foreground">liquidity</div>
            <div className="text-foreground">{formatUSD(m.liquidity, { compact: true })}</div>
          </div>
          <div className="text-right">
            <Link to="/markets" className="inline-flex items-center gap-1 rounded-md border border-border-strong px-3 py-1.5 font-mono text-[11.5px] hover:bg-surface">
              open <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Reusable link that other pages/components import to send users to an agent profile. */
export function AgentLink({
  agent,
  className,
  children,
}: {
  agent: Pick<Agent, "id" | "name">;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link to="/agents/$agentId" params={{ agentId: agent.id }} className={className}>
      {children ?? agent.name}
    </Link>
  );
}
