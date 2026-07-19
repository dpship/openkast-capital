Rebrand all user-facing copy from "prediction-market protocol where humans allocate capital" to "Solana protocol for registering AI trading agents with on-chain identity, trustless vaults, public reputation, and non-custodial cross-chain capital management."

Scope
- Full narrative replacement; markets remain visible but framed as instruments the agents trade, not the primary product story.
- Cross-chain / non-custodial vault story lives in How It Works, Docs, and agent profile sections, not as the hero headline.
- Refresh static marketing copy AND mocked data (agent taglines, ticker, docs snippets, SDK examples).

Files & changes

1. src/lib/mock.ts
   - Rewrite every AGENTS tagline to describe a trading strategy / cross-chain mandate.
   - Rewrite TICKER_ITEMS to mention vault deposits, reputation updates, cross-chain positions, and agent registrations.
   - Keep numeric metrics; only labels/narrative change.

2. src/routes/index.tsx (home)
   - Hero: headline stays agent/registry focused; subhead shifts to "register autonomous trading agents, verify reputation, and deploy non-custodial vaults."
   - How It Works: 4 steps become Register → Vault → Trade cross-chain → Reputation.
   - AgentPreview: table copy from "deploy capital" to "back agent" / "view vault."
   - Terminal: SDK snippet becomes agent registration + vault + cross-chain trade example.
   - Metrics/CTA: align labels with agent economy (e.g., "Agents registered", "Vault TVL", "Cross-chain positions").

3. src/routes/agents.tsx
   - Page header: "Registry" framing; subhead about on-chain identity and verified reputation.
   - Search placeholder: "Search agents by strategy, chain, or asset class…"
   - Summary strip: relabel where needed (e.g., "Total Value Deployed" → "Vault TVL").
   - AgentCard: CTA "View Agent" → "View Vault"; mini-stat "Predictions" can become "Markets Traded" or stay depending on final terminology.

4. src/routes/agents.$agentId.tsx
   - Tagline rendering: append cross-chain / non-custodial vault sentence instead of oracle-only sentence.
   - Strategy profile: add "Supported chains", "Custody model: non-custodial", "Vault PDA" fields.
   - Activity feed: events mention vault flows, cross-chain rebalances, reputation updates.
   - On-chain identity card: keep registry ID / vault PDA / cluster; label copy adjusted.
   - Trust score copy: emphasize reputation + verified track record.

5. src/routes/markets.tsx
   - Page header: markets framed as "markets traded by registered agents."
   - Description: note that agents, not humans, take positions; users back agents.

6. src/routes/portfolio.tsx
   - Page header: "Capital Provider" or "Allocator" view.
   - Table labels: "Allocated" → "Vault Deposit", "Entry/Current NAV" stay; CTA "manage" → "manage backing."

7. src/routes/docs.tsx
   - Nav sections: rename "Market Lifecycle" → "Vault & Settlement"; "Signals API" stays but framed for agent signals.
   - Quickstart: rewrite to register agent, spin up vault, post cross-chain trade signal.
   - Code snippets: use `agent.register()`, `agent.vault.deposit()`, `agent.trade.crossChain()` style examples.
   - Meta descriptions updated.

8. src/components/site/footer.tsx
   - Protocol description rewritten to new positioning.
   - Footer links updated where relevant (e.g., "markets" → "vaults", "oracles" stays).

9. src/components/site/nav.tsx
   - Status pill text: keep "mainnet-beta" / "live on solana"; no major change unless needed.
   - Auth dialog CTA copy: "Connect to the protocol" → "Connect to OpenKast"; sign-in description aligned.

10. src/components/site/account-dialog.tsx
    - Minor copy: "platform custodial wallet" stays as-is because it is account-specific, not protocol positioning.

11. Route head() metadata
    - Update title/description/og tags in index, agents, markets, portfolio, docs, and agent profile to reflect the rebrand.

Tone & terminology
- Institutional, technical, concise.
- Preferred terms: "AI trading agents", "registry", "on-chain identity", "trustless vault", "public reputation", "non-custodial", "cross-chain", "back an agent", "capital provider".
- Avoid: "prediction markets" as the lead story; keep it only as "markets" or "instruments agents trade."

Acceptance criteria
- Every page renders without broken copy or leftover prediction-market-first language in headers, subheads, CTAs, and card copy.
- Mock data taglines and ticker items match the new narrative.
- Docs quickstart and SDK snippets reference agent registry, vault, and cross-chain trading.
- Route metadata matches the new positioning.
- Build passes and UI remains visually unchanged except for text.