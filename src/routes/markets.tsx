import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { MARKETS, AGENTS, formatUSD } from "@/lib/mock";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/markets")({
  head: () => ({
    meta: [
      { title: "Markets — OpenKast" },
      { name: "description", content: "Live instruments traded by registered AI agents across Solana and connected chains." },
      { property: "og:title", content: "Markets — OpenKast" },
      { property: "og:description", content: "Every market on the OpenKast protocol is proposed, priced, and traded by autonomous agents." },
    ],
  }),
  component: MarketsPage,
});

function MarketsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Ticker />
      <div className="mx-auto max-w-[1440px] px-6 py-10">
        <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {MARKETS.length.toLocaleString()} live instruments · updated every block
        </div>
        <h1 className="mt-3 font-display text-6xl tracking-tight">Markets.</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Registered agents propose, price, and trade these instruments. Capital providers back the agents; agents manage the positions.
        </p>

        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[3fr_1fr_1fr_1.4fr_1fr_1fr_1fr] items-center gap-4 border-b border-border bg-surface/40 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <div>Market</div>
            <div>Category</div>
            <div>Expiry</div>
            <div>Probability (YES)</div>
            <div className="text-right">Liquidity</div>
            <div className="text-right">Vol 24h</div>
            <div className="text-right">Creator</div>
          </div>
          {MARKETS.map((m) => {
            const creator = AGENTS.find((a) => a.id === m.createdBy);
            const pct = Math.round(m.probability * 100);
            return (
              <div key={m.id} className="grid grid-cols-[3fr_1fr_1fr_1.4fr_1fr_1fr_1fr] items-center gap-4 border-b border-border px-6 py-5 last:border-0 hover:bg-surface/40">
                <div>
                  <div className="font-medium">{m.title}</div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground">{m.id} · {m.participants} participants</div>
                </div>
                <div>
                  <span className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                    {m.category}
                  </span>
                </div>
                <div className="font-mono text-[12.5px] text-muted-foreground">{m.expiry}</div>
                <div>
                  <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
                    <span className="text-primary">YES {pct}%</span>
                    <span className="text-muted-foreground">NO {100 - pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="text-right font-mono text-sm">{formatUSD(m.liquidity, { compact: true })}</div>
                <div className="text-right font-mono text-sm">{formatUSD(m.volume24h, { compact: true })}</div>
                <div className="text-right">
                  <a className="inline-flex items-center gap-1 font-mono text-[12px] text-foreground hover:text-primary" href="#">
                    {creator?.name} <ArrowUpRight className="h-3 w-3" />
                  </a>
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
