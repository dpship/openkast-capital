export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-md border border-primary/40 bg-primary/10">
                <div className="h-2 w-2 rotate-45 bg-primary" />
              </div>
              <span className="font-mono text-[15px] tracking-tight">openkast</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A Solana protocol for registering AI trading agents. Every agent receives an on-chain identity, a trustless vault, and a public reputation — managing capital across chains without ever taking custody of user funds.
            </p>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              v0.4.2 · mainnet-beta · non-custodial
            </div>
            <div className="mt-4 flex items-center gap-2">
              <SocialLink href="https://x.com/openkast" label="X">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18.244 2H21l-6.52 7.454L22.5 22h-6.844l-4.79-6.26L5.2 22H2.442l6.98-7.98L1.5 2h6.98l4.33 5.72L18.244 2Zm-1.2 18.4h1.5L7.02 3.5H5.44l11.6 16.9Z"/></svg>
              </SocialLink>
              <SocialLink href="https://t.me/openkast" label="Telegram">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M21.4 4.6 2.6 11.6c-.9.3-.9 1.5 0 1.9l4.7 1.6 1.6 4.7c.3.9 1.6.9 1.9 0l7-18.8c.3-.9-.7-1.7-1.4-1zM17.9 7.1l-6.9 6.3 5.4 5.4 1.5-11.7z"/></svg>
              </SocialLink>
              <SocialLink href="https://discord.gg/openkast" label="Discord">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M20.3 4.7A17.5 17.5 0 0 0 15.6 3c-.2.4-.5.9-.6 1.3a16.3 16.3 0 0 0-4.8 0c-.2-.4-.4-.9-.6-1.3a17.5 17.5 0 0 0-4.7 1.7C1.4 10.6.8 16.2 1.1 21.8c2 1.5 3.9 2.4 5.8 3 .5-.7 1-1.4 1.4-2.2-.7-.3-1.4-.6-2.1-1 .2-.1.3-.3.5-.4 4 1.9 8.4 1.9 12.4 0 .2.1.3.3.5.4-.7.4-1.4.8-2.1 1 .4.8.9 1.5 1.4 2.2 1.9-.6 3.9-1.5 5.8-3 .3-6.5-1.1-12.1-4.6-17.1ZM8.5 17.6c-1.4 0-2.5-1.3-2.5-2.8s1.1-2.8 2.5-2.8 2.5 1.3 2.5 2.8-1.1 2.8-2.5 2.8Zm7 0c-1.4 0-2.5-1.3-2.5-2.8s1.1-2.8 2.5-2.8 2.5 1.3 2.5 2.8-1.1 2.8-2.5 2.8Z"/></svg>
              </SocialLink>
            </div>
          </div>
          <FooterCol title="protocol" items={["agents", "markets", "vaults", "oracles", "registry"]} />
          <FooterCol title="developers" items={["documentation", "sdk", "smart contracts", "audit", "changelog"]} />
          <FooterCol title="company" items={["about", "research", "brand", "press", "contact"]} />
          <FooterCol title="connect" items={["community", "support", "status", "feedback"]} />
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div className="font-mono">© 2026 OpenKast Labs · Solana Foundation</div>
          <div className="font-mono">not a solicitation · not financial advice · use at own risk</div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
    >
      {children}
    </a>
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
