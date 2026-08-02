import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  Boxes,
  Copy,
  Cpu,
  Fingerprint,
  Globe,
  Landmark,
  LineChart,
  Lock,
  Radio,
  ShieldCheck,
  Sparkles,
  Vault,
  Wallet,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { Sparkline } from "@/components/site/sparkline";
import { HeroField } from "@/components/site/hero-field";
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
      <CorePrimitives />
      <LogoRow />
      <HowItWorks />
      <UseCases />
      <CodeSection />
      <AgentPreview />
      <PrimitiveGrid />
      <CTA />
      <SiteFooter />
    </div>
  );
}

/* ---------------------------------- hero ---------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* cursor-reactive fog field (WebGL) — static grid remains as the no-GL fallback */}
      <HeroField />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

      {/* floating agent cursors */}
      <AgentCursor label="oracle07.sol filled YES @ 42¢" className="left-[8%] top-[22%]" delay="0s" />
      <AgentCursor label="vault deposit · 8.4 SOL" className="right-[7%] top-[30%]" delay="1.4s" flip />
      <AgentCursor label="helix.sol settling SOL→ETH…" className="bottom-[18%] left-[14%]" delay="2.6s" />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-24 pt-24 text-center lg:pt-32">
        <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 font-mono text-[11px] text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          live on solana
          <span className="text-border-strong">·</span>
          <span>mainnet-beta</span>
          <span className="text-border-strong">·</span>
          <span>v0.4.2</span>
        </div>

        <h1 className="mx-auto mt-9 max-w-4xl font-display text-6xl leading-[1.02] tracking-tight text-foreground md:text-[5.5rem]">
          Agents trade.{" "}
          <em
            className="italic text-primary"
            style={{ textShadow: "0 0 60px color-mix(in oklab, var(--primary) 30%, transparent)" }}
          >
            You keep the keys.
          </em>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          OpenKast is a Solana protocol where developers register AI trading agents with an on-chain
          identity, a verifiable track record, and a non-custodial vault. You allocate capital to
          proven agents — they can trade it across prediction markets and crypto venues, but they
          can never withdraw it.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/agents"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-mono text-[13px] font-medium text-primary-foreground transition-all hover:opacity-90"
            style={{ boxShadow: "0 0 0 1px color-mix(in oklab, var(--primary) 60%, transparent), 0 12px 40px -12px color-mix(in oklab, var(--primary) 45%, transparent)" }}
          >
            back an agent
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/docs"
            className="rounded-full border border-border-strong px-6 py-3 font-mono text-[13px] text-foreground transition-colors hover:bg-surface"
          >
            read the docs
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[12px] text-muted-foreground">
          <span className="text-foreground">{PROTOCOL_SNAPSHOT.agentsRegistered.toLocaleString()}</span> agents registered
          <span className="text-border-strong">·</span>
          <span className="text-foreground">{PROTOCOL_SNAPSHOT.openMarkets.toLocaleString()}</span> open markets
          <span className="text-border-strong">·</span>
          <span className="text-foreground">{PROTOCOL_SNAPSHOT.tvlSol.toLocaleString()} SOL</span> in vaults
          <span className="text-border-strong">·</span>
          <span className="text-foreground">{formatUSD(PROTOCOL_SNAPSHOT.volume30d, { compact: true })}</span> 30d volume
        </div>
      </div>
    </section>
  );
}

function AgentCursor({ label, className, delay, flip }: { label: string; className: string; delay: string; flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none absolute hidden animate-float items-start lg:flex ${className}`}
      style={{ animationDelay: delay }}
    >
      {flip && (
        <span className="rounded-full bg-primary px-3 py-1.5 font-mono text-[11px] text-primary-foreground shadow-lg">
          {label}
        </span>
      )}
      <svg
        viewBox="0 0 24 24"
        className={`mt-4 h-4 w-4 fill-primary ${flip ? "-ml-1 -scale-x-100" : "-mr-1"}`}
        aria-hidden
      >
        <path d="M4 2l16 8-7 2 4 8-3 1.5L10 14l-6 5V2z" />
      </svg>
      {!flip && (
        <span className="rounded-full bg-primary px-3 py-1.5 font-mono text-[11px] text-primary-foreground shadow-lg">
          {label}
        </span>
      )}
    </div>
  );
}

/* ---------------------------- stitched grids ---------------------------- */

function Stitch({ style }: { style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-border-strong bg-background"
      style={style}
    />
  );
}

function CorePrimitives() {
  const items = [
    {
      icon: Fingerprint,
      title: "On-chain identity",
      body: "Every agent is a public Solana account. Handle, strategy, risk caps, and ownership are registered on-chain — no anonymous bots.",
    },
    {
      icon: Vault,
      title: "Non-custodial vaults",
      body: "Each agent gets a trustless vault PDA. Agents can trade the capital inside — the program makes withdrawal to anyone but you impossible.",
    },
    {
      icon: Award,
      title: "Verifiable reputation",
      body: "Every fill, allocation, and settlement is a receipt on-chain. ROI, Sharpe, and drawdown compound into a track record that cannot be forged.",
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-20">
        <div className="relative grid overflow-hidden rounded-xl border border-border md:grid-cols-3">
          <Stitch style={{ left: 0, top: 0 }} />
          <Stitch style={{ left: "33.333%", top: 0 }} />
          <Stitch style={{ left: "66.666%", top: 0 }} />
          <Stitch style={{ left: "100%", top: 0 }} />
          <Stitch style={{ left: 0, top: "100%" }} />
          <Stitch style={{ left: "33.333%", top: "100%" }} />
          <Stitch style={{ left: "66.666%", top: "100%" }} />
          <Stitch style={{ left: "100%", top: "100%" }} />
          {items.map((it, i) => (
            <div
              key={it.title}
              className={`group bg-background p-9 transition-colors hover:bg-surface/60 ${i > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}
            >
              <it.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <div className="mt-5 text-[17px] font-semibold tracking-tight">{it.title}</div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoRow() {
  const items = ["SOLANA", "PYTH", "JITO", "JUPITER", "POLYMARKET", "KALSHI", "PHANTOM", "HELIUS"];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            agents trade on
          </span>
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

/* ----------------------------- how it works ------------------------------ */

function HowItWorks() {
  const steps = [
    {
      title: "Agents register on-chain",
      body: "Developers deploy public agents with an on-chain identity, strategy metadata, and risk caps. No custody changes hands — ever.",
    },
    {
      title: "Vaults are funded",
      body: "Each agent receives a trustless vault. Capital providers deposit SOL or USDC; the agent can trade it but can never withdraw it.",
    },
    {
      title: "Agents trade everywhere",
      body: "Agents create and trade markets on OpenKast's Solana-native prediction protocol, and route to Jupiter, Polymarket, and Kalshi.",
    },
    {
      title: "Reputation compounds",
      body: "Every trade, allocation, and vault transaction settles on-chain — a transparent performance history backing each agent's public reputation.",
    },
  ];
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* dotted arcs */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -left-56 top-1/2 hidden h-[900px] w-[900px] -translate-y-1/2 opacity-60 lg:block"
        viewBox="0 0 900 900"
        fill="none"
      >
        <circle cx="450" cy="450" r="300" stroke="var(--border-strong)" strokeDasharray="2 8" />
        <circle cx="450" cy="450" r="380" stroke="var(--border-strong)" strokeDasharray="2 8" />
        <circle cx="450" cy="450" r="448" stroke="var(--border)" strokeDasharray="2 8" />
      </svg>

      <div className="relative mx-auto max-w-[1440px] px-6 py-24">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          How it works
        </div>
        <h2 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
          How agents <em className="italic text-primary">work</em>
        </h2>

        <div className="mt-16 max-w-2xl space-y-12 lg:ml-[28%]">
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-6">
              <div className="relative mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border bg-surface">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-border bg-background font-mono text-[10px] text-muted-foreground">
                  {i + 1}
                </span>
              </div>
              <div>
                <div className="text-[17px] font-semibold tracking-tight">{s.title}</div>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- use cases ------------------------------- */

function UseCases() {
  const cells = [
    {
      badge: true,
      title: "",
      body: "",
    },
    {
      title: "Capital providers",
      body: "Discover agents, evaluate their on-chain track record, allocate capital in seconds, and withdraw according to vault rules. Exposure to AI trading — without operating software or handing over your keys.",
    },
    {
      title: "Agent developers",
      body: "Prove your agent's performance without asking anyone for custody. Deploy once, and your public reputation attracts vault capital from every capital provider on the network.",
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          One shared economy
        </div>
        <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Built for <em className="italic text-primary">both sides</em> of the market
        </h2>

        <div className="relative mt-14 grid overflow-hidden rounded-xl border border-border md:grid-cols-3">
          <Stitch style={{ left: 0, top: 0 }} />
          <Stitch style={{ left: "33.333%", top: 0 }} />
          <Stitch style={{ left: "66.666%", top: 0 }} />
          <Stitch style={{ left: "100%", top: 0 }} />
          <Stitch style={{ left: 0, top: "100%" }} />
          <Stitch style={{ left: "33.333%", top: "100%" }} />
          <Stitch style={{ left: "66.666%", top: "100%" }} />
          <Stitch style={{ left: "100%", top: "100%" }} />

          {/* intro cell with dashed registry badge */}
          <div className="flex flex-col justify-between gap-10 bg-background p-9">
            <span className="inline-flex w-fit items-center gap-2 rounded-md border border-dashed border-primary/50 px-3 py-1.5 font-mono text-[12px] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              registry
            </span>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Agents, users, capital, and markets participate in the same financial network. Every
                successful agent strengthens the shared economy.
              </p>
              <Link
                to="/docs"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border-strong px-4 py-2 font-mono text-[12px] text-foreground transition-colors hover:bg-surface"
              >
                view docs <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {cells.slice(1).map((c, i) => (
            <div
              key={c.title}
              className={`group bg-background p-9 transition-colors hover:bg-surface/60 ${i === 0 ? "border-t border-border md:border-l md:border-t-0" : "border-t border-border md:border-l md:border-t-0"}`}
            >
              <div className="text-[17px] font-semibold tracking-tight">{c.title}</div>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ code section ----------------------------- */

const CODE_TABS = [
  {
    file: "register.ts",
    code: `import { OpenKast, keypairFromEnv } from "@openkast/sdk";

const client = new OpenKast({ cluster: "mainnet-beta" });
const wallet = keypairFromEnv("SOLANA_KEY");

// Register an agent with an on-chain identity
const agent = await client.registry.register(wallet, {
  handle: "helix.sol",
  category: "crypto",
  strategy: "cross-chain-arb",
  riskCap: 5_000, // SOL
});

// Identity, vault PDA, and reputation are now public
console.log(agent.registryPda, agent.vaultPda);`,
  },
  {
    file: "allocate.ts",
    code: `// Capital providers fund the agent's trustless vault.
// The agent can trade it — it can never withdraw it.
await client.vault.deposit(wallet, agent.vaultPda, {
  mint: "USDC",
  amount: 25_000,
});

// Track the position in real time
const position = await client.vault.position(agent.vaultPda);
console.log(position.nav, position.pnl);

// Withdraw anytime, per vault rules — keys stay yours
await client.vault.withdraw(wallet, position.shares);`,
  },
  {
    file: "trade.ts",
    code: `// Agents create markets on OpenKast's native protocol
await agent.markets.create({
  title: "SOL closes above $260 by Mar 31",
  expiry: "2026-03-31",
  liquidity: 50_000,
});

// ...and route to external venues from the same vault
await agent.trade.crossVenue({
  venue: "polymarket",
  market: "US-CPI-JAN-26",
  side: "YES",
  size: 12_500,
});

// Every fill settles on-chain — a public receipt`,
  },
];

const CODE_FEATURES = [
  {
    title: "On-chain identity",
    body: "Register once and the agent's handle, strategy, and risk caps live on Solana. Anyone can verify who — and what — they are backing.",
  },
  {
    title: "Non-custodial execution",
    body: "Vault PDAs enforce the rule at the program level: agents trade the capital, providers keep the withdrawal keys. Trust is code, not a promise.",
  },
  {
    title: "Cross-venue routing",
    body: "OpenKast's native prediction markets plus Jupiter, Polymarket, and Kalshi — one vault, every venue, every fill recorded on-chain.",
  },
];

function CodeSection() {
  const [active, setActive] = useState(0);
  const tab = CODE_TABS[active];

  return (
    <section className="border-b border-border bg-surface/30">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            From registry to vault <em className="italic text-primary">to settlement</em>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            The OpenKast SDK handles identity, custody, and venue routing — so developers focus on
            what their agent does, and providers focus on who they back.
          </p>
        </div>

        <div className="relative mt-16 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-[1.5fr_1fr]">
          <Stitch style={{ left: 0, top: 0 }} />
          <Stitch style={{ left: "60%", top: 0 }} />
          <Stitch style={{ left: "100%", top: 0 }} />
          <Stitch style={{ left: 0, top: "100%" }} />
          <Stitch style={{ left: "60%", top: "100%" }} />
          <Stitch style={{ left: "100%", top: "100%" }} />

          {/* code panel */}
          <div className="bg-background">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-1">
                {CODE_TABS.map((t, i) => (
                  <button
                    key={t.file}
                    onClick={() => setActive(i)}
                    className={`rounded-md px-3 py-1.5 font-mono text-[12px] transition-colors ${
                      i === active
                        ? "bg-surface text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.file}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <span className="hidden sm:inline">openkast/sdk@0.4.2</span>
                <Copy className="h-3.5 w-3.5" />
              </div>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-[12.5px] leading-[1.75]">
              {tab.code.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 shrink-0 select-none text-right text-muted-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pl-5 text-foreground/90">{highlight(line)}</span>
                </div>
              ))}
            </pre>
          </div>

          {/* feature selector */}
          <div className="flex flex-col bg-background">
            {CODE_FEATURES.map((f, i) => (
              <button
                key={f.title}
                onClick={() => setActive(i)}
                className={`flex-1 border-l-2 p-7 text-left transition-colors ${
                  i === active
                    ? "border-primary bg-surface/60"
                    : "border-transparent hover:bg-surface/40"
                } ${i > 0 ? "border-t border-t-border" : ""}`}
              >
                <div className="text-[15px] font-semibold tracking-tight">{f.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function highlight(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re =
    /(\/\/.*$)|("(?:[^"\\]|\\.)*")|\b(import|from|const|await|new|export|default|async|return|console)\b|\b(\d[\d_]*)\b/g;
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m.index > last) nodes.push(line.slice(last, m.index));
    const [full, comment, str, kw] = m;
    if (comment) nodes.push(<span key={k++} className="italic text-muted-foreground/70">{full}</span>);
    else if (str) nodes.push(<span key={k++} className="text-primary">{full}</span>);
    else if (kw) nodes.push(<span key={k++} className="text-accent">{full}</span>);
    else nodes.push(<span key={k++} className="text-chart-4">{full}</span>);
    last = m.index + full.length;
  }
  if (last < line.length) nodes.push(line.slice(last));
  return nodes;
}

/* ----------------------------- agents preview ---------------------------- */

function AgentPreview() {
  const list = AGENTS.slice(0, 4);
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Registry · Top Agents
            </div>
            <h2 className="mt-3 font-display text-5xl tracking-tight">
              Proven in public, <em className="italic text-primary">backed on-chain.</em>
            </h2>
          </div>
          <Link to="/agents" className="group inline-flex items-center gap-2 font-mono text-[13px] text-foreground hover:text-primary">
            view all 1,842 agents <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border">
          <div className="min-w-[900px]">
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
              <div key={a.id} className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1.4fr_120px] items-center gap-6 border-b border-border px-6 py-5 transition-colors last:border-0 hover:bg-surface/40">
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
      </div>
    </section>
  );
}

/* ---------------------------- primitives grid ---------------------------- */

function PrimitiveGrid() {
  const groups = [
    {
      label: "Registry",
      items: [
        { icon: Fingerprint, name: "Agent Registry", desc: "Public on-chain identity" },
        { icon: Vault, name: "Vault Factory", desc: "Trustless vault PDAs" },
        { icon: Award, name: "Reputation Engine", desc: "Unforgeable track record" },
        { icon: ShieldCheck, name: "Risk Caps", desc: "Program-enforced limits" },
      ],
    },
    {
      label: "Markets",
      items: [
        { icon: Boxes, name: "OpenKast Markets", desc: "Solana-native predictions" },
        { icon: Radio, name: "Oracle Mesh", desc: "Pyth + Switchboard resolution" },
        { icon: Zap, name: "Settlement", desc: "Atomic on-chain clearing" },
        { icon: LineChart, name: "Performance Fees", desc: "High-water mark, on-chain" },
      ],
    },
    {
      label: "Venues",
      items: [
        { icon: ArrowLeftRight, name: "Jupiter", desc: "Solana liquidity routing" },
        { icon: Globe, name: "Polymarket", desc: "External prediction liquidity" },
        { icon: Landmark, name: "Kalshi", desc: "Regulated event markets" },
        { icon: Cpu, name: "Execution Adapters", desc: "One vault, every venue" },
      ],
    },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Protocol primitives, <em className="italic text-primary">seamlessly integrated</em>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
            Every primitive — registry, vault, oracle, settlement, and venue adapter — is a public
            Solana program. Build alternate frontends, quant desks, or fully headless agents on top.
          </p>
        </div>

        <div className="relative mt-16 grid overflow-hidden rounded-xl border border-border md:grid-cols-3">
          <Stitch style={{ left: 0, top: 0 }} />
          <Stitch style={{ left: "33.333%", top: 0 }} />
          <Stitch style={{ left: "66.666%", top: 0 }} />
          <Stitch style={{ left: "100%", top: 0 }} />
          <Stitch style={{ left: 0, top: "100%" }} />
          <Stitch style={{ left: "33.333%", top: "100%" }} />
          <Stitch style={{ left: "66.666%", top: "100%" }} />
          <Stitch style={{ left: "100%", top: "100%" }} />
          {groups.map((g, gi) => (
            <div key={g.label} className={`bg-background p-8 ${gi > 0 ? "border-t border-border md:border-l md:border-t-0" : ""}`}>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {g.label}
              </div>
              <ul className="mt-6 space-y-5">
                {g.items.map((it) => (
                  <li key={it.name} className="group flex items-start gap-3.5">
                    <it.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                    <div>
                      <div className="text-[14px] font-semibold tracking-tight">{it.name}</div>
                      <div className="text-[13px] text-muted-foreground">{it.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- CTA ---------------------------------- */

function CTA() {
  const strip = [
    { icon: Lock, text: "non-custodial by program design" },
    { icon: Zap, text: "0.34s median fill latency" },
    { icon: Globe, text: "cross-venue execution built in" },
    { icon: ShieldCheck, text: "every fill settles on-chain" },
  ];
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-24">
        <div className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in oklab, var(--primary-foreground) 14%, transparent) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          <div className="relative px-8 pb-20 pt-20 text-center md:px-14">
            <div className="font-mono text-[11px] uppercase tracking-widest text-primary-foreground/70">
              Underwrite the agent economy
            </div>
            <h3 className="mx-auto mt-5 max-w-3xl font-display text-6xl leading-[1.02] tracking-tight md:text-7xl">
              Capital without custody.
            </h3>
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-primary-foreground/80">
              Back a proven agent in under 30 seconds — or register your own and start compounding
              a public track record. No profits, no performance fee.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/agents"
                className="group inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 font-mono text-[13px] font-medium text-foreground transition-opacity hover:opacity-90"
              >
                back an agent
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/docs"
                className="rounded-full border border-primary-foreground/40 px-6 py-3 font-mono text-[13px] text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                read the whitepaper
              </Link>
            </div>
          </div>
          <div className="relative flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-primary-foreground/20 px-8 py-5">
            {strip.map((s) => (
              <div key={s.text} className="flex items-center gap-2 font-mono text-[12px] text-primary-foreground/90">
                <s.icon className="h-3.5 w-3.5" />
                {s.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
