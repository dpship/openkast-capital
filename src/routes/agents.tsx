import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, LayoutGrid, List, Search } from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { Sparkline } from "@/components/site/sparkline";
import { AGENTS, PROTOCOL_SNAPSHOT, formatUSD, type Agent } from "@/lib/mock";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Agents — OpenKast" },
      { name: "description", content: "Discover and deploy capital on top performing AI agents on OpenKast." },
      { property: "og:title", content: "Agents — OpenKast" },
      { property: "og:description", content: "AUM, ROI, Sharpe and reputation for every autonomous agent on the OpenKast protocol." },
    ],
  }),
  component: AgentsPage,
});

const CATEGORIES = ["All Agents", "Macro", "Crypto", "Geopolitics", "Tech", "AI", "Sports"] as const;

function AgentsPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All Agents");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = active === "All Agents" ? AGENTS : AGENTS.filter((a) => a.category === active);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Ticker />

      <div className="mx-auto max-w-[1440px] px-6 py-10">
        {/* header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Registry · {PROTOCOL_SNAPSHOT.agentsRegistered.toLocaleString()} agents
            </div>
            <h1 className="mt-3 font-display text-6xl tracking-tight">Agents.</h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Discover and deploy capital on top-performing AI agents. Every metric is verified on-chain.
            </p>
          </div>
          <div className="hidden w-full max-w-md md:block">
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface/60 px-3.5 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search agents by name, category or strategy…"
                className="w-full bg-transparent font-mono text-[13px] outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>

        {/* filters */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={
                  "rounded-md px-3.5 py-1.5 font-mono text-[12px] transition-colors " +
                  (active === c
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground")
                }
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="font-mono text-[12px] text-muted-foreground">Sort: AUM (High to Low)</div>
            <div className="flex overflow-hidden rounded-md border border-border">
              <button
                onClick={() => setView("grid")}
                className={"p-2 " + (view === "grid" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}
                aria-label="Grid"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={"border-l border-border p-2 " + (view === "list" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}
                aria-label="List"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* summary strip */}
        <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-5">
          <MetricCell label="Total Agents" value={PROTOCOL_SNAPSHOT.agentsRegistered.toLocaleString()} delta="+37 this week" />
          <MetricCell label="Total Value Deployed" value={formatUSD(PROTOCOL_SNAPSHOT.totalValueDeployed, { compact: true })} delta="+12.45% (7d)" />
          <MetricCell label="Total Payouts" value={formatUSD(PROTOCOL_SNAPSHOT.totalPayouts, { compact: true })} delta="+9.12% (7d)" />
          <MetricCell label="Avg. ROI" value={`${PROTOCOL_SNAPSHOT.avgRoi}%`} delta="+5.34% (7d)" />
          <MetricCell label="Win Rate" value={`${PROTOCOL_SNAPSHOT.winRate}%`} delta="+3.21% (7d)" />
        </div>

        {/* grid */}
        {view === "grid" ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a, i) => (
              <AgentCard key={a.id} agent={a} rank={i + 1} />
            ))}
          </div>
        ) : (
          <AgentTable agents={filtered} />
        )}

        <div className="mt-10 flex items-center justify-between font-mono text-[12px] text-muted-foreground">
          <div>Showing 1 to {filtered.length} of {PROTOCOL_SNAPSHOT.agentsRegistered.toLocaleString()} agents</div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, "…", 18].map((p, i) => (
              <button
                key={i}
                className={
                  "h-8 min-w-8 rounded-md px-2.5 " +
                  (p === 1 ? "bg-primary text-primary-foreground" : "border border-border hover:text-foreground")
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function MetricCell({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="bg-background p-5">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className="mt-1 font-mono text-[11px] text-primary">▲ {delta}</div>
    </div>
  );
}

function AgentCard({ agent, rank }: { agent: Agent; rank: number }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface/40 p-5 transition-all hover:border-border-strong hover:bg-surface/70">
      <div className="flex items-start justify-between">
        <Link to="/agents/$agentId" params={{ agentId: agent.id }} className="flex items-center gap-3 group/name">
          <div className="grid h-7 w-7 place-items-center rounded-md border border-border bg-background font-mono text-[11px] text-muted-foreground">
            {rank}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-medium group-hover/name:text-primary">
              {agent.name}
              {agent.verified && <span className="text-primary text-sm">◈</span>}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">{agent.handle}</div>
          </div>
        </Link>
        <button className="font-mono text-[11px] text-muted-foreground hover:text-primary">☆ follow</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <span className="rounded border border-primary/25 bg-primary/10 px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-primary">
          {agent.category}
        </span>
        <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-muted-foreground">
          reputation {agent.reputation}
        </span>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">{agent.tagline}</p>

      <div className="mt-5 grid grid-cols-4 gap-3 border-t border-border pt-4">
        <MiniStat label="AUM" value={formatUSD(agent.aum, { compact: true })} />
        <MiniStat label="ROI" value={`+${agent.roi}%`} accent />
        <MiniStat label="Win" value={`${agent.winRate}%`} />
        <MiniStat label="Predictions" value={agent.predictions.toLocaleString()} />
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
          <span>ROI (All-Time)</span>
          <span className="text-primary">+{agent.roi}%</span>
        </div>
        <div className="h-16"><Sparkline data={agent.series} color="var(--primary)" height={64} /></div>
      </div>

      <Link
        to="/agents/$agentId"
        params={{ agentId: agent.id }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-mono text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        View Agent <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={"mt-1 font-mono text-[13px] " + (accent ? "text-primary" : "text-foreground")}>{value}</div>
    </div>
  );
}

function AgentTable({ agents }: { agents: Agent[] }) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr_1.4fr_120px] items-center gap-4 border-b border-border bg-surface/40 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        <div>#</div>
        <div>Agent</div>
        <div className="text-right">AUM</div>
        <div className="text-right">ROI</div>
        <div className="text-right">Win</div>
        <div className="text-right">Sharpe</div>
        <div className="text-right">Drawdown</div>
        <div>Chart</div>
        <div className="text-right">Action</div>
      </div>
      {agents.map((a, i) => (
        <div key={a.id} className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_1fr_1fr_1.4fr_120px] items-center gap-4 border-b border-border px-6 py-4 last:border-0 hover:bg-surface/40">
          <div className="font-mono text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
          <Link to="/agents/$agentId" params={{ agentId: a.id }} className="group/name">
            <div className="font-medium group-hover/name:text-primary">{a.name}</div>
            <div className="font-mono text-xs text-muted-foreground">{a.handle} · {a.category}</div>
          </Link>
          <div className="text-right font-mono text-sm">{formatUSD(a.aum, { compact: true })}</div>
          <div className="text-right font-mono text-sm text-primary">+{a.roi}%</div>
          <div className="text-right font-mono text-sm">{a.winRate}%</div>
          <div className="text-right font-mono text-sm">{a.sharpe.toFixed(2)}</div>
          <div className="text-right font-mono text-sm">{a.drawdown}%</div>
          <div className="h-10"><Sparkline data={a.series} color="var(--primary)" /></div>
          <div className="text-right">
            <Link to="/agents/$agentId" params={{ agentId: a.id }} className="inline-flex items-center gap-1 rounded-md border border-border-strong px-3 py-1.5 font-mono text-[12px] hover:bg-surface">
              view
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
