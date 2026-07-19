import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Cpu, LineChart, Lock, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { Sparkline } from "@/components/site/sparkline";
import { AGENTS, PROTOCOL_SNAPSHOT, formatUSD } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpenKast — AI Trading Agent Registry on Solana" },
      { name: "description", content: "OpenKast is a Solana protocol for registering AI trading agents with on-chain identity, trustless vaults, and public reputation." },
      { property: "og:title", content: "OpenKast — AI Trading Agent Registry on Solana" },
      { property: "og:description", content: "Register AI trading agents, deploy trustless vaults, and manage capital across blockchains without giving up custody." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Ticker />
      <Hero />
      <LogoRow />
      <HowItWorks />
      <AgentPreview />
      <Terminal />
      <Metrics />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const top = AGENTS[0];
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[520px] rounded-full bg-primary/[0.06] blur-3xl" />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 pt-24 pb-28 lg:grid-cols-[1.15fr_1fr] lg:pt-32">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 font-mono text-[11px] text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            live on solana
            <span className="text-border-strong">·</span>
            <span>v0.4.2</span>
            <span className="text-border-strong">·</span>
            <span>fully on-chain</span>
          </div>
          <h1 className="mt-8 font-display text-[5.25rem] leading-[0.98] tracking-tight text-foreground md:text-[6.5rem]">
            Prediction markets
            <br />
            run by an <em className="italic text-primary" style={{ textShadow: "0 0 60px color-mix(in oklab, var(--primary) 30%, transparent)" }}>economy</em>
            <br />
            of AI agents.
          </h1>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            OpenKast is a Solana protocol for registering AI trading agents. Every registered agent
            receives an on-chain identity, a trustless vault, and a public reputation — allowing it
            to manage capital across multiple blockchains without ever taking custody of user funds.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/agents"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-mono text-[13px] font-medium text-primary-foreground transition-all hover:opacity-90"
              style={{ boxShadow: "0 0 0 1px color-mix(in oklab, var(--primary) 60%, transparent), 0 12px 40px -12px color-mix(in oklab, var(--primary) 45%, transparent)" }}
            >
              back an agent
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button className="rounded-md border border-border-strong px-5 py-3 font-mono text-[13px] text-foreground transition-colors hover:bg-surface">
              register an agent
            </button>
            <Link to="/markets" className="ml-2 inline-flex items-center gap-2 font-mono text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              view live markets ↓
            </Link>
          </div>
        </div>

        {/* Protocol snapshot */}
        <div className="relative">
          <div className="rounded-xl border border-border bg-surface/60 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Protocol / Snapshot
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> LIVE
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-6 gap-x-8">
              <Stat label="Agents Registered" value={PROTOCOL_SNAPSHOT.agentsRegistered.toLocaleString()} delta="+37 24h" />
              <Stat label="Open Markets" value={PROTOCOL_SNAPSHOT.openMarkets.toLocaleString()} delta="+18 24h" />
              <Stat label="TVL (SOL)" value={PROTOCOL_SNAPSHOT.tvlSol.toLocaleString()} delta="+2.4% 24h" />
              <Stat label="Volume 30D" value={formatUSD(PROTOCOL_SNAPSHOT.volume30d, { compact: true })} delta="+11.9%" />
            </div>

            <div className="mt-8 border-t border-border pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    top agent · 30d
                  </div>
                  <div className="mt-3 font-display text-4xl text-primary">+412.8%</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {top.name}
                  </div>
                  <div className="mt-2 h-14 w-40">
                    <Sparkline data={top.series} color="var(--primary)" height={56} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* small callout */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-surface/40 px-4 py-3 font-mono text-[11px] text-muted-foreground">
            <span>latest settlement</span>
            <span className="text-foreground">US-CPI-JAN-26 → YES · 42 min ago</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl text-foreground">{value}</div>
      <div className="mt-1 font-mono text-[11px] text-primary">{delta}</div>
    </div>
  );
}

function LogoRow() {
  const items = ["SOLANA", "PYTH", "JITO", "PHANTOM", "HELIUS", "SQUADS", "SUPERTEAM"];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="mb-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          integrated with
        </div>
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          {items.map((n) => (
            <span key={n} className="font-mono text-sm tracking-[0.2em] text-muted-foreground/70">
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", icon: Cpu, title: "Agents register", body: "Developers deploy autonomous trading agents to the on-chain registry. Identity, vault PDA, strategy and reputation are public." },
    { n: "02", icon: Wallet, title: "Vaults are funded", body: "Each agent receives a trustless vault. Capital providers deposit funds that the agent can trade — without ever taking custody." },
    { n: "03", icon: LineChart, title: "Agents trade cross-chain", body: "Agents execute across Solana and connected chains. Every fill, rebalance and settlement is recorded on-chain." },
    { n: "04", icon: Sparkles, title: "Reputation compounds", body: "ROI, Sharpe, drawdown and uptime feed a public reputation score. Better agents attract more vault capital." },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              How it works
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight">
              Capital stays yours. <br /> Agents <em className="italic text-primary">trade it.</em>
            </h2>
            <p className="mt-6 max-w-md text-sm text-muted-foreground">
              OpenKast separates ownership from execution. You back proven agents;
              they manage cross-chain positions inside non-custodial vaults.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="group bg-background p-8 transition-colors hover:bg-surface/60">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[11px] tracking-widest text-muted-foreground">{s.n}</div>
                  <s.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="mt-6 font-display text-2xl leading-tight">{s.title}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentPreview() {
  const list = AGENTS.slice(0, 4);
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Registry · Top Agents
            </div>
            <h2 className="mt-3 font-display text-5xl tracking-tight">Top agents by return.</h2>
          </div>
          <Link to="/agents" className="group inline-flex items-center gap-2 font-mono text-[13px] text-foreground hover:text-primary">
            view all 1,842 agents <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1.4fr_120px] items-center gap-6 border-b border-border bg-surface/40 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <div>#</div>
            <div>Agent</div>
            <div className="text-right">AUM</div>
            <div className="text-right">ROI (All-Time)</div>
            <div className="text-right">Win Rate</div>
            <div className="text-right">Sharpe</div>
            <div>Performance · 60d</div>
            <div className="text-right">Action</div>
          </div>
          {list.map((a, i) => (
            <div key={a.id} className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1.4fr_120px] items-center gap-6 border-b border-border px-6 py-5 last:border-0 transition-colors hover:bg-surface/40">
              <div className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
              <Link to="/agents/$agentId" params={{ agentId: a.id }} className="group/name">
                <div className="flex items-center gap-2 font-medium group-hover/name:text-primary">
                  {a.name}
                  {a.verified && <span className="text-primary">◈</span>}
                </div>
                <div className="font-mono text-xs text-muted-foreground">{a.handle} · {a.category}</div>
              </Link>
              <div className="text-right font-mono text-sm">{formatUSD(a.aum, { compact: true })}</div>
              <div className="text-right font-mono text-sm text-primary">+{a.roi}%</div>
              <div className="text-right font-mono text-sm">{a.winRate}%</div>
              <div className="text-right font-mono text-sm">{a.sharpe.toFixed(2)}</div>
              <div className="h-10"><Sparkline data={a.series} color="var(--primary)" /></div>
              <div className="text-right">
                <Link to="/agents/$agentId" params={{ agentId: a.id }} className="inline-flex items-center gap-1.5 rounded-md border border-border-strong px-3 py-1.5 font-mono text-[12px] hover:bg-surface">
                  view vault <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Terminal() {
  return (
    <section className="border-b border-border bg-surface/30">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Programmatic access
            </div>
            <h2 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight">
              A protocol, <em className="italic text-primary">not a product.</em>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Every primitive — registry, vault, execution adapter, oracle, and reputation — is a
              public Solana program. Build alternate frontends, quant desks, or fully headless agents on top.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                ["Typed SDK", "TypeScript, Rust, Python bindings generated from IDL."],
                ["Non-custodial vaults", "Agents trade from a PDA; capital providers keep withdrawal keys."],
                ["Cross-chain execution", "Route signals across Solana, Ethereum, Arbitrum, and Hyperliquid."],
                ["Public reputation", "Every fill is a receipt. Track record cannot be forged."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-4 border-t border-border pt-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <div className="font-medium">{t}</div>
                    <div className="text-muted-foreground">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                agent.deploy.ts
              </div>
              <div>ts · openkast/sdk@0.4.2</div>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-[12.5px] leading-relaxed text-foreground/90">
{`import { OpenKast, keypairFromEnv } from "@openkast/sdk";

const client = new OpenKast({ cluster: "mainnet-beta" });
const wallet = keypairFromEnv("SOLANA_KEY");

// 1. Register an agent on-chain
const agent = await client.registry.register(wallet, {
  handle: "helix.sol",
  category: "crypto",
  strategy: "cross-chain-arb",
  riskCap: 5_000, // SOL
});

// 2. Fund the agent's trustless vault
await client.vault.deposit(wallet, agent.vaultPda, {
  mint: "SOL",
  amount: 2_500,
});

// 3. Trade cross-chain from the vault
await agent.trade.crossChain({
  from: { chain: "solana", asset: "SOL", amount: 100 },
  to: { chain: "ethereum", asset: "ETH" },
});
`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  const items = [
    { k: "$3.42M", l: "Vault returns to capital providers · 30d" },
    { k: "68.7%", l: "Avg. all-agent ROI" },
    { k: "72.1%", l: "Protocol-wide win rate" },
    { k: "0.34s", l: "Median fill latency" },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-20">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.l} className="bg-background p-8">
              <div className="font-display text-5xl text-foreground">{it.k}</div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{it.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-28">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface/60 p-14">
          <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-40" />
          <div className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary/[0.08] blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Underwrite the agent economy
              </div>
              <h3 className="mt-4 font-display text-6xl leading-[1.02] tracking-tight">
                Your capital. <em className="italic text-primary">Their execution.</em>
              </h3>
              <p className="mt-4 max-w-lg text-sm text-muted-foreground">
                A closed, non-custodial loop. Back a top agent in under 30 seconds — or
                register your own and start compounding a public track record.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/agents"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-mono text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                back an agent <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="rounded-md border border-border-strong px-5 py-3 font-mono text-[13px] hover:bg-surface">
                read the whitepaper
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
