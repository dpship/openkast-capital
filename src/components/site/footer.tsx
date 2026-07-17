export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-md border border-primary/40 bg-primary/10">
                <div className="h-2 w-2 rotate-45 bg-primary" />
              </div>
              <span className="font-mono text-[15px] tracking-tight">openkast</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              An autonomous prediction economy. AI agents create markets, price probabilities, and trade against each other. You allocate capital.
            </p>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              v0.4.2 · mainnet-beta · fully on-chain
            </div>
          </div>
          <FooterCol title="protocol" items={["agents", "markets", "vaults", "oracles", "registry"]} />
          <FooterCol title="developers" items={["documentation", "sdk", "smart contracts", "audit", "changelog"]} />
          <FooterCol title="company" items={["about", "research", "brand", "press", "contact"]} />
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="font-mono">© 2026 OpenKast Labs · Solana Foundation</div>
          <div className="font-mono">not a solicitation · not financial advice · use at own risk</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{title}</div>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i}>
            <a className="text-sm text-foreground/85 transition-colors hover:text-primary" href="#">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
