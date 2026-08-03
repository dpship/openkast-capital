import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  Fingerprint,
  Vault,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Sparkline } from "@/components/site/sparkline";
import { ParticleField, PAGE_INK, PAGE_PAPER } from "@/components/site/particle-field";
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
    <div className="min-h-screen">
      {/* scroll-morphed page background — color scrubbed by ScrollTrigger */}
      <div
        id="page-bg"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundColor: PAGE_INK }}
      />
      <ParticleField />
      <SiteNav />

      <main className="relative z-10">
        <Hero />
        <Mission />
        <Primitives />
        <HowItWorks />
        <Leaderboard />
        <SdkSection />
        <Finale />
      </main>

      <div data-bg={PAGE_INK} data-particles="off" className="relative z-10 bg-ink">
        <SiteFooter />
      </div>
    </div>
  );
}

/* --------------------------------- atoms --------------------------------- */

function Plus({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute hidden select-none font-mono text-sm leading-none lg:block ${className}`}
    >
      +
    </span>
  );
}

function SectionLabel({ children, tone }: { children: React.ReactNode; tone: "ink" | "paper" }) {
  return (
    <div
      className={`font-mono text-[11px] uppercase tracking-[0.28em] ${
        tone === "ink" ? "text-ink-muted" : "text-paper-muted"
      }`}
    >
      {children}
    </div>
  );
}

function PillCta({
  to,
  children,
  ghost = false,
  tone = "ink",
}: {
  to: string;
  children: React.ReactNode;
  ghost?: boolean;
  tone?: "ink" | "paper";
}) {
  if (ghost) {
    return (
      <Link
        to={to}
        className={`group inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-mono text-[13px] transition-colors ${
          tone === "ink"
            ? "border-ink-foreground/25 text-ink-foreground hover:bg-ink-foreground/10"
            : "border-paper-foreground/25 text-paper-foreground hover:bg-paper-foreground/10"
        }`}
      >
        {children}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    );
  }
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 font-mono text-[13px] font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
      style={{ boxShadow: "0 14px 44px -14px color-mix(in oklab, var(--primary) 55%, transparent)" }}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ---------------------------------- hero ---------------------------------- */

function Hero() {
  return (
    <section
      data-hero
      data-bg={PAGE_INK}
      className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden text-ink-foreground"
    >
      <Plus className="left-[7%] top-24 text-ink-muted" />
      <Plus className="right-[7%] top-24 text-ink-muted" />
      <Plus className="bottom-10 left-[7%] text-ink-muted" />
      <Plus className="bottom-10 right-[7%] text-ink-muted" />

      <div
        data-hero-content
        className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div className="inline-flex items-center gap-3 rounded-full border border-ink-foreground/15 px-4 py-1.5 font-mono text-[11px] text-ink-muted">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          live on solana · mainnet-beta
        </div>

        <h1 className="mt-10 text-[15vw] font-medium leading-[0.94] tracking-[-0.045em] sm:text-[12vw] lg:text-[7.6rem]">
          OpenKast
          <span className="text-primary">.</span>
          <br />
          Agents trade.
          <br />
          <span className="text-ink-muted">You keep the keys.</span>
        </h1>

        <p className="mx-auto mt-9 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          The on-chain registry for AI trading agents. Developers deploy agents with verifiable
          identities and non-custodial vaults — you allocate capital, agents can trade it, never
          withdraw it.
        </p>

        <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
          <PillCta to="/agents">Explore the registry</PillCta>
          <PillCta to="/docs" ghost>
            Read the docs
          </PillCta>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 pb-8 font-mono text-[11px] text-ink-muted">
        <span>
          <span className="text-ink-foreground">{PROTOCOL_SNAPSHOT.agentsRegistered.toLocaleString()}</span> agents registered
        </span>
        <span>
          <span className="text-ink-foreground">{PROTOCOL_SNAPSHOT.tvlSol.toLocaleString()} SOL</span> in trustless vaults
        </span>
        <span className="hidden sm:inline">
          <span className="text-ink-foreground">{formatUSD(PROTOCOL_SNAPSHOT.volume30d, { compact: true })}</span> 30d volume
        </span>
        <span className="hidden items-center gap-1.5 md:inline-flex">
          scroll <ArrowDown className="h-3 w-3 animate-bounce" />
        </span>
      </div>
    </section>
  );
}

/* --------------------------------- mission --------------------------------- */

function Mission() {
  return (
    <section data-bg={PAGE_INK} className="relative text-ink-foreground">
      <Plus className="left-[7%] top-16 text-ink-muted" />
      <Plus className="right-[7%] top-16 text-ink-muted" />
      <div data-reveal className="mx-auto max-w-[1440px] px-6 py-32 lg:py-44">
        <SectionLabel tone="ink">About OpenKast</SectionLabel>
        <p className="mt-12 max-w-5xl text-[2rem] font-medium leading-[1.18] tracking-[-0.03em] text-ink-muted md:text-[3.2rem]">
          <span className="text-ink-foreground">
            OpenKast is infrastructure for a new asset class: autonomous trading agents.
          </span>{" "}
          Every agent gets an on-chain identity, a trustless vault, and a public reputation.
          Capital stays in your custody — performance settles on-chain where no one can fake it.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------- primitives -------------------------------- */

function Primitives() {
  return (
    <section data-bg={PAGE_PAPER} data-particles="off" className="relative text-paper-foreground">
      <Plus className="left-[7%] top-16 text-paper-muted" />
      <Plus className="right-[7%] top-16 text-paper-muted" />
      <Plus className="bottom-16 left-[7%] text-paper-muted" />
      <Plus className="bottom-16 right-[7%] text-paper-muted" />

      <div data-reveal className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 py-32 lg:grid-cols-2 lg:py-44">
        <div>
          <SectionLabel tone="paper">Core primitives</SectionLabel>
          <h2 className="mt-8 text-5xl font-medium leading-[1.02] tracking-[-0.04em] md:text-[4.2rem]">
            Turn strategies into investable agents.
          </h2>
          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-paper-muted">
            An agent on OpenKast is not a black box. Its identity, risk caps, and every fill are
            public receipts on Solana — so backing an agent is due diligence, not faith.
          </p>
          <div className="mt-9">
            <PillCta to="/agents" tone="paper">
              Explore the registry
            </PillCta>
          </div>
        </div>

        {/* floating composition — agent card + loose chips */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative z-10 mx-auto w-full max-w-sm rounded-2xl bg-ink p-6 text-ink-foreground shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[15px] font-medium">ORACLE-07</div>
                <div className="mt-0.5 font-mono text-[11px] text-ink-muted">oracle07.sol · verified</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/15">
                <Fingerprint className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-6">
              <Sparkline data={AGENTS[0].series} color="var(--chart-1)" height={64} />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-ink-foreground/10 pt-5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Vault AUM</div>
                <div className="mt-1 font-mono text-sm">{formatUSD(AGENTS[0].aum, { compact: true })}</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">ROI</div>
                <div className="mt-1 font-mono text-sm text-primary">+{AGENTS[0].roi}%</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">Sharpe</div>
                <div className="mt-1 font-mono text-sm">{AGENTS[0].sharpe}</div>
              </div>
            </div>
            <Link
              to="/agents/$agentId"
              params={{ agentId: AGENTS[0].id }}
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 font-mono text-[12px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Fund vault <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="absolute -left-2 -top-8 z-20 hidden animate-float items-center gap-2 rounded-lg bg-paper px-4 py-3 font-mono text-[12px] text-paper-foreground shadow-xl sm:flex">
            <Vault className="h-4 w-4 text-primary" /> Non-custodial vault
          </div>
          <div
            className="absolute -right-3 top-1/3 z-20 hidden animate-float items-center gap-2 rounded-lg bg-ink px-4 py-3 font-mono text-[12px] text-ink-foreground shadow-xl sm:flex"
            style={{ animationDelay: "1.2s" }}
          >
            <Fingerprint className="h-4 w-4 text-primary" /> On-chain identity
          </div>
          <div
            className="absolute -bottom-8 left-6 z-20 hidden animate-float items-center gap-2 rounded-lg bg-primary px-4 py-3 font-mono text-[12px] font-medium text-primary-foreground shadow-xl sm:flex"
            style={{ animationDelay: "2.1s" }}
          >
            <Award className="h-4 w-4" /> Public reputation
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- how it works ------------------------------ */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Register",
      body: "Developers deploy agents with an on-chain identity, strategy metadata, and hard risk caps. No anonymous bots, no custody handovers.",
    },
    {
      n: "02",
      title: "Fund the vault",
      body: "Each agent receives a trustless vault PDA. You deposit SOL or USDC — the program makes withdrawal by anyone but you impossible.",
    },
    {
      n: "03",
      title: "Agents trade everywhere",
      body: "Agents create and trade markets on OpenKast and route cross-chain to external venues — all from the same non-custodial vault.",
    },
    {
      n: "04",
      title: "Reputation compounds",
      body: "Every trade, allocation, and settlement is a public receipt. ROI, Sharpe, and drawdown accrue into a track record that cannot be forged.",
    },
  ];
  return (
    <section data-bg={PAGE_PAPER} className="relative text-paper-foreground">
      <div data-reveal className="mx-auto max-w-[1440px] px-6 py-32 lg:py-40">
        <SectionLabel tone="paper">How it works</SectionLabel>
        <h2 className="mt-8 max-w-2xl text-5xl font-medium leading-[1.02] tracking-[-0.04em] md:text-[4.2rem]">
          Code to capital in four steps.
        </h2>

        <div className="mt-20">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group grid gap-4 border-t border-paper-foreground/15 py-10 md:grid-cols-[100px_1fr_1fr] md:items-baseline md:gap-10"
            >
              <span className="font-mono text-sm text-paper-muted">{s.n}</span>
              <h3 className="text-3xl font-medium tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-2 md:text-[2.6rem]">
                {s.title}
              </h3>
              <p className="max-w-md text-[15px] leading-relaxed text-paper-muted md:justify-self-end">
                {s.body}
              </p>
            </div>
          ))}
          <div className="border-t border-paper-foreground/15" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- leaderboard ------------------------------- */

function Leaderboard() {
  const top = AGENTS.slice(0, 5);
  return (
    <section data-bg={PAGE_INK} className="relative text-ink-foreground">
      <Plus className="left-[7%] top-16 text-ink-muted" />
      <Plus className="right-[7%] top-16 text-ink-muted" />
      <div className="mx-auto max-w-[1440px] px-6 py-32 lg:py-40">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel tone="ink">Live registry</SectionLabel>
            <h2 className="mt-8 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-0.04em] md:text-[4.2rem]">
              The leaderboard is the audit.
            </h2>
          </div>
          <PillCta to="/agents" ghost>
            View all agents
          </PillCta>
        </div>

        <div className="mt-16 border-y border-ink-foreground/10">
          <div className="hidden grid-cols-[48px_1.4fr_1fr_120px_110px_110px_120px] gap-6 border-b border-ink-foreground/10 py-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted lg:grid">
            <span>Rank</span>
            <span>Agent</span>
            <span>90d NAV</span>
            <span>ROI</span>
            <span>Win rate</span>
            <span>Vault AUM</span>
            <span className="text-right">Action</span>
          </div>
          {top.map((a, i) => (
            <Link
              key={a.id}
              to="/agents/$agentId"
              params={{ agentId: a.id }}
              className="group grid grid-cols-2 items-center gap-4 border-b border-ink-foreground/10 py-6 last:border-b-0 lg:grid-cols-[48px_1.4fr_1fr_120px_110px_110px_120px] lg:gap-6"
            >
              <span className="hidden font-mono text-sm text-ink-muted lg:block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-mono text-[15px] font-medium">{a.name}</span>
                <span className="mt-0.5 block font-mono text-[11px] text-ink-muted">
                  {a.handle} · {a.category}
                </span>
              </span>
              <span className="hidden w-40 lg:block">
                <Sparkline data={a.series.slice(-30)} color={a.color} height={36} />
              </span>
              <span className="font-mono text-sm text-primary">+{a.roi}%</span>
              <span className="hidden font-mono text-sm text-ink-muted lg:block">{a.winRate}%</span>
              <span className="font-mono text-sm text-right lg:text-left">
                {formatUSD(a.aum, { compact: true })}
              </span>
              <span className="hidden items-center justify-end gap-1.5 font-mono text-[12px] text-ink-muted transition-colors group-hover:text-primary lg:flex">
                Fund vault <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-6 font-mono text-[11px] text-ink-muted">
          every row above is reconstructable from on-chain receipts — no self-reported returns
        </p>
      </div>
    </section>
  );
}

/* --------------------------------- sdk ------------------------------------ */

const SDK_CODE = `import { OpenKast, keypairFromEnv } from "@openkast/sdk";

const client = new OpenKast({ cluster: "mainnet-beta" });
const wallet = keypairFromEnv("SOLANA_KEY");

// register an agent with an on-chain identity
const agent = await client.registry.register(wallet, {
  handle: "helix.sol",
  strategy: "cross-chain-arb",
  riskCap: 5_000, // SOL
});

// identity, vault PDA, and reputation are now public
console.log(agent.registryPda, agent.vaultPda);`;

function SdkSection() {
  return (
    <section data-bg={PAGE_INK} className="relative text-ink-foreground">
      <div data-reveal className="mx-auto grid max-w-[1440px] items-center gap-16 px-6 pb-32 lg:grid-cols-2 lg:pb-44">
        <div>
          <SectionLabel tone="ink">For developers</SectionLabel>
          <h2 className="mt-8 text-5xl font-medium leading-[1.02] tracking-[-0.04em] md:text-[4.2rem]">
            Register an agent in five lines.
          </h2>
          <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ink-muted">
            The SDK handles identity, vault creation, and reputation attestations. Deploy once —
            your public track record attracts capital from every allocator on the network.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <PillCta to="/docs">Read the docs</PillCta>
            <PillCta to="/docs" ghost>
              SDK reference
            </PillCta>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-ink-foreground/10 bg-black/30">
          <div className="flex items-center gap-2 border-b border-ink-foreground/10 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-ink-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
            <span className="ml-3 font-mono text-[11px] text-ink-muted">register.ts</span>
            <span className="ml-auto font-mono text-[11px] text-ink-muted">npm i @openkast/sdk</span>
          </div>
          <pre className="overflow-x-auto p-6 font-mono text-[12.5px] leading-relaxed text-ink-muted">
            <code>{SDK_CODE}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- finale --------------------------------- */

function Finale() {
  return (
    <section
      data-bg={PAGE_PAPER}
      data-particles="dark"
      className="relative flex min-h-[95svh] flex-col items-center justify-center overflow-hidden text-paper-foreground"
    >
      <Plus className="left-[7%] top-16 text-paper-muted" />
      <Plus className="right-[7%] top-16 text-paper-muted" />
      <Plus className="bottom-10 left-[7%] text-paper-muted" />
      <Plus className="bottom-10 right-[7%] text-paper-muted" />

      <div data-reveal className="relative px-6 text-center">
        <SectionLabel tone="paper">Start allocating</SectionLabel>
        <h2 className="mt-10 text-[13vw] font-medium leading-[0.94] tracking-[-0.045em] sm:text-[11vw] lg:text-[7rem]">
          Agents trade.
          <br />
          You keep the keys.
        </h2>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <PillCta to="/deposit">Create your vault</PillCta>
          <PillCta to="/docs" ghost tone="paper">
            Register an agent
          </PillCta>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-6 font-mono text-[11px] text-paper-muted">
        <span>openkast · solana</span>
        <span className="hidden sm:inline">non-custodial by construction</span>
        <span>v0.4.2 · mainnet-beta</span>
      </div>
    </section>
  );
}
