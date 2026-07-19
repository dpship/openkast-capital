import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { Sparkline } from "@/components/site/sparkline";
import { AGENTS, formatUSD } from "@/lib/mock";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Capital Provider — OpenKast" },
      { name: "description", content: "Track your non-custodial backing across registered AI trading agents on OpenKast." },
      { property: "og:title", content: "Capital Provider — OpenKast" },
      { property: "og:description", content: "Your vault deposits and returns across every AI trading agent on the OpenKast protocol." },
    ],
  }),
  component: PortfolioPage,
});

const HOLDINGS = [
  { id: "oracle-07", allocated: 4200, entry: 108.4, current: 158.2 },
  { id: "helix", allocated: 2800, entry: 94.1, current: 122.7 },
  { id: "kairos", allocated: 1600, entry: 88.2, current: 101.4 },
  { id: "aether", allocated: 900, entry: 71.5, current: 78.9 },
];

function PortfolioPage() {
  const totalAllocated = HOLDINGS.reduce((s, h) => s + h.allocated, 0);
  const totalValue = HOLDINGS.reduce((s, h) => s + h.allocated * (h.current / h.entry), 0);
  const totalPnl = totalValue - totalAllocated;
  const pnlPct = (totalPnl / totalAllocated) * 100;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Ticker />
      <div className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Wallet FTD7…efNZ · 4 vault deposits
        </div>
        <h1 className="mt-3 font-display text-6xl tracking-tight">Capital Provider.</h1>

        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
          <Cell label="Total Deposited" value={formatUSD(totalAllocated)} />
          <Cell label="Vault Value" value={formatUSD(totalValue)} />
          <Cell label="Unrealized P&L" value={`${totalPnl > 0 ? "+" : ""}${formatUSD(Math.abs(totalPnl))}`} accent={totalPnl > 0 ? "pos" : "neg"} />
          <Cell label="Return" value={`${pnlPct > 0 ? "+" : ""}${pnlPct.toFixed(2)}%`} accent={pnlPct > 0 ? "pos" : "neg"} />
        </div>

        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.4fr_120px] items-center gap-4 border-b border-border bg-surface/40 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <div>Agent</div>
            <div className="text-right">Vault Deposit</div>
            <div className="text-right">Entry NAV</div>
            <div className="text-right">Current NAV</div>
            <div className="text-right">P&L</div>
            <div>Performance</div>
            <div className="text-right">Manage</div>
          </div>
          {HOLDINGS.map((h) => {
            const a = AGENTS.find((x) => x.id === h.id)!;
            const value = h.allocated * (h.current / h.entry);
            const pnl = value - h.allocated;
            const pct = (pnl / h.allocated) * 100;
            const pos = pnl >= 0;
            return (
              <div key={h.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.4fr_120px] items-center gap-4 border-b border-border px-6 py-5 last:border-0 hover:bg-surface/40">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{a.handle} · {a.category}</div>
                </div>
                <div className="text-right font-mono text-sm">{formatUSD(h.allocated)}</div>
                <div className="text-right font-mono text-sm">{h.entry.toFixed(2)}</div>
                <div className="text-right font-mono text-sm">{h.current.toFixed(2)}</div>
                <div className={"text-right font-mono text-sm " + (pos ? "text-primary" : "text-destructive")}>
                  <div className="flex items-center justify-end gap-1">
                    {pos ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {pos ? "+" : ""}{formatUSD(Math.abs(pnl), { compact: true })} · {pct.toFixed(1)}%
                  </div>
                </div>
                <div className="h-10"><Sparkline data={a.series} color={pos ? "var(--primary)" : "var(--destructive)"} /></div>
                <div className="text-right">
                  <button className="rounded-md border border-border-strong px-3 py-1.5 font-mono text-[12px] hover:bg-surface">manage backing</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: "pos" | "neg" }) {
  return (
    <div className="bg-background p-6">
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={"mt-2 font-display text-3xl " + (accent === "pos" ? "text-primary" : accent === "neg" ? "text-destructive" : "")}>{value}</div>
    </div>
  );
}
