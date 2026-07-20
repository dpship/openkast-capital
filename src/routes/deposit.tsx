import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  Info,
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { Ticker } from "@/components/site/ticker";
import { SeedPhraseDialog } from "@/components/site/seed-phrase-dialog";
import { formatUSD } from "@/lib/mock";

export const Route = createFileRoute("/deposit")({
  head: () => ({
    meta: [
      { title: "Deposit — OpenKast" },
      {
        name: "description",
        content:
          "Bring capital on-chain. Deposit SOL on Solana or USDC.e on Polygon into your OpenKast account, then allocate to registered AI trading agents.",
      },
      { property: "og:title", content: "Deposit — OpenKast" },
      {
        property: "og:description",
        content:
          "Non-custodial deposit gateway. Fund your account with SOL or USDC.e and back autonomous trading agents on-chain.",
      },
    ],
  }),
  component: DepositPage,
});

type ChainKey = "solana" | "polygon";

type ChainConfig = {
  key: ChainKey;
  label: string;
  network: string;
  asset: string;
  assetLong: string;
  address: string;
  min: string;
  confirmations: string;
  finality: string;
  explorer: (addr: string) => string;
  rpc: string;
};

// Deterministic seeded addresses. Replaced by GET /api/wallet/{chain}/address at wire-time.
const CHAINS: Record<ChainKey, ChainConfig> = {
  solana: {
    key: "solana",
    label: "Solana",
    network: "mainnet-beta",
    asset: "SOL",
    assetLong: "Native SOL",
    address: "FTD7c9qP4v3sK8mR2xN1jL5wYbH6uA9zEfNZ4efNZ",
    min: "0.05 SOL",
    confirmations: "1 (finalized)",
    finality: "~0.4s",
    explorer: (a) => `https://solscan.io/account/${a}`,
    rpc: "api.mainnet-beta.solana.com",
  },
  polygon: {
    key: "polygon",
    label: "Polygon",
    network: "polygon-mainnet",
    asset: "USDC.e",
    assetLong: "Bridged USDC (PoS)",
    address: "0x8Bc4b9F1c2A5eD9F7d3E6a1B0C4d8E9f2A5b7C1D",
    min: "5 USDC.e",
    confirmations: "128",
    finality: "~4 min",
    explorer: (a) => `https://polygonscan.com/address/${a}`,
    rpc: "polygon-rpc.com",
  },
};

// Deterministic mock — replaced by GET /api/wallet/balance
const BALANCES: Record<ChainKey, { asset: number; usd: number; block: number }> = {
  solana: { asset: 84.214, usd: 18_240.62, block: 298_412_119 },
  polygon: { asset: 6_402.14, usd: 6_402.14, block: 66_812_004 },
};

// Deterministic mock — replaced by GET /api/wallet/ledger
type LedgerRow = {
  ts: string;
  chain: ChainKey;
  kind: "deposit" | "withdraw" | "allocation" | "settlement";
  asset: string;
  amount: number;
  usd: number;
  tx: string;
  status: "finalized" | "pending";
  counter?: string;
};

const LEDGER: LedgerRow[] = [
  { ts: "2026-07-19 14:22:04 UTC", chain: "solana", kind: "deposit", asset: "SOL", amount: 24.0, usd: 5_184.0, tx: "5xQ2…9Ykb", status: "finalized" },
  { ts: "2026-07-19 14:24:11 UTC", chain: "solana", kind: "allocation", asset: "SOL", amount: -18.0, usd: -3_888.0, tx: "3aRt…M2wQ", status: "finalized", counter: "ORACLE-07 vault" },
  { ts: "2026-07-18 09:11:42 UTC", chain: "polygon", kind: "deposit", asset: "USDC.e", amount: 2_500, usd: 2_500, tx: "0x91c…4a2f", status: "finalized" },
  { ts: "2026-07-17 22:03:17 UTC", chain: "polygon", kind: "allocation", asset: "USDC.e", amount: -1_800, usd: -1_800, tx: "0x77b…e10c", status: "finalized", counter: "HELIX vault" },
  { ts: "2026-07-17 06:48:00 UTC", chain: "solana", kind: "settlement", asset: "SOL", amount: 3.42, usd: 738.72, tx: "2mNp…kQ8L", status: "finalized", counter: "KAIROS vault" },
  { ts: "2026-07-16 18:12:55 UTC", chain: "solana", kind: "deposit", asset: "SOL", amount: 60.0, usd: 12_960, tx: "8vLm…c1Rd", status: "finalized" },
  { ts: "2026-07-15 11:34:20 UTC", chain: "polygon", kind: "withdraw", asset: "USDC.e", amount: -900, usd: -900, tx: "0x2fa…88de", status: "finalized" },
];

function DepositPage() {
  const [chain, setChain] = useState<ChainKey>("solana");
  const [copied, setCopied] = useState(false);
  const [seedOpen, setSeedOpen] = useState(false);
  const cfg = CHAINS[chain];
  const bal = BALANCES[chain];

  const uri = useMemo(() => {
    if (chain === "solana") return `solana:${cfg.address}`;
    return `ethereum:${cfg.address}@137`;
  }, [chain, cfg.address]);

  const copy = () => {
    navigator.clipboard?.writeText(cfg.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const totalUsd = BALANCES.solana.usd + BALANCES.polygon.usd;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Ticker />

      <div className="mx-auto max-w-[1440px] px-6 py-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              live on-chain · addresses derived at signup
            </div>
            <h1 className="mt-3 font-display text-6xl tracking-tight">Deposit.</h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Bring capital on-chain into your OpenKast account. Balances live on the ledger below,
              ready to be allocated to registered AI trading agents. Non-custodial by design — the
              key derivation set is downloadable at any time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
            <StatCell label="Total Balance" value={formatUSD(totalUsd)} />
            <StatCell label="Available to allocate" value={formatUSD(totalUsd)} accent="pos" />
          </div>
        </div>

        {/* Chain switch */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Select network
          </span>
          <div className="flex overflow-hidden rounded-lg border border-border">
            {(Object.keys(CHAINS) as ChainKey[]).map((k) => {
              const active = k === chain;
              const c = CHAINS[k];
              return (
                <button
                  key={k}
                  onClick={() => setChain(k)}
                  className={
                    "flex items-center gap-2.5 px-4 py-2 font-mono text-[12px] transition-colors " +
                    (active
                      ? "bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:text-foreground")
                  }
                >
                  <ChainGlyph chain={k} active={active} />
                  {c.label}
                  <span className="text-[11px] opacity-60">· {c.asset}</span>
                </button>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            derivation path verified · ed25519 (solana) / secp256k1 (polygon)
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Deposit card */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              {/* QR block */}
              <div className="flex flex-col items-center justify-center gap-4 border-b border-border bg-surface/40 p-8 md:border-b-0 md:border-r">
                <div className="rounded-lg border border-border bg-background p-3">
                  <QRCodeSVG
                    value={uri}
                    size={196}
                    level="H"
                    bgColor="transparent"
                    fgColor="currentColor"
                    className="text-foreground"
                  />
                </div>
                <div className="text-center font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {cfg.network}
                </div>
                <div className="text-center font-mono text-[11px] text-muted-foreground">
                  Scan to deposit {cfg.asset}
                </div>
              </div>

              {/* Address + metadata */}
              <div className="p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      Your {cfg.label} deposit address
                    </div>
                    <div className="mt-2 font-display text-2xl leading-tight">
                      Send {cfg.asset} only
                    </div>
                    <div className="mt-1 text-[13px] text-muted-foreground">
                      {cfg.assetLong} · {cfg.network}
                    </div>
                  </div>
                  <span className="rounded-md border border-primary/40 bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                    verified
                  </span>
                </div>

                <div className="mt-6 flex items-stretch overflow-hidden rounded-lg border border-border-strong bg-background">
                  <div className="min-w-0 flex-1 overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed">
                    {cfg.address}
                  </div>
                  <button
                    onClick={copy}
                    className="flex items-center gap-1.5 border-l border-border-strong bg-surface/60 px-4 font-mono text-[12px] text-foreground hover:bg-surface"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-primary" />
                        copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        copy
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
                  <a
                    href={cfg.explorer(cfg.address)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    view on {chain === "solana" ? "solscan" : "polygonscan"}
                  </a>
                  <span className="font-mono">
                    rpc · <span className="text-foreground">{cfg.rpc}</span>
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
                  <MetaCell k="Min deposit" v={cfg.min} />
                  <MetaCell k="Confirmations" v={cfg.confirmations} />
                  <MetaCell k="Finality" v={cfg.finality} />
                </div>

                <div className="mt-6 flex gap-3 rounded-lg border border-border bg-surface/40 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="text-[12.5px] leading-relaxed text-muted-foreground">
                    Sending an unsupported asset or using the wrong network will result in
                    permanent loss of funds. This address accepts{" "}
                    <span className="font-mono text-foreground">{cfg.asset}</span> on{" "}
                    <span className="font-mono text-foreground">{cfg.network}</span> only.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right rail: current balance + key mgmt */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <span>{cfg.label} balance</span>
                <span>block #{bal.block.toLocaleString()}</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <div className="font-display text-4xl tracking-tight">
                  {bal.asset.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                </div>
                <div className="font-mono text-sm text-muted-foreground">{cfg.asset}</div>
              </div>
              <div className="mt-1 font-mono text-[13px] text-muted-foreground">
                ≈ {formatUSD(bal.usd)}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="rounded-md bg-primary px-3 py-2 font-mono text-[12px] font-medium text-primary-foreground hover:opacity-90">
                  allocate
                </button>
                <button className="rounded-md border border-border-strong bg-background px-3 py-2 font-mono text-[12px] hover:bg-surface">
                  withdraw
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5" />
                key material
              </div>
              <div className="mt-3 text-[13px] text-muted-foreground">
                Your account holds keys derived from a single seed generated at signup.
                Export the recovery phrase or the full keystore at any time — the protocol
                never has custody.
              </div>
              <div className="mt-5 space-y-2">
                <button className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 font-mono text-[12px] hover:bg-surface">
                  <span className="flex items-center gap-2">
                    <Download className="h-3.5 w-3.5" />
                    download keystore (json)
                  </span>
                  <span className="text-muted-foreground">encrypted</span>
                </button>
                <button
                  onClick={() => setSeedOpen(true)}
                  className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 font-mono text-[12px] hover:bg-surface"
                >
                  <span className="flex items-center gap-2">
                    <KeyRound className="h-3.5 w-3.5" />
                    reveal recovery phrase
                  </span>
                  <span className="text-muted-foreground">12 words</span>
                </button>
              </div>
              <div className="mt-4 border-t border-border pt-3 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
                audited · ottersec 2026-Q2 · code hash 0x4a…c11d
              </div>
            </div>
          </div>
        </div>

        {/* Ledger */}
        <div className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                on-chain ledger
              </div>
              <h2 className="mt-2 font-display text-4xl tracking-tight">Movements.</h2>
            </div>
            <div className="hidden font-mono text-[11px] text-muted-foreground md:block">
              GET /api/wallet/ledger · last 7d
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[1.6fr_0.9fr_0.9fr_1fr_1fr_1.2fr_100px] gap-4 border-b border-border bg-surface/40 px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <div>Time (UTC)</div>
              <div>Network</div>
              <div>Type</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Value</div>
              <div>Counterparty / Tx</div>
              <div className="text-right">Status</div>
            </div>
            {LEDGER.map((r, i) => {
              const pos = r.amount >= 0;
              const c = CHAINS[r.chain];
              return (
                <div
                  key={i}
                  className="grid grid-cols-[1.6fr_0.9fr_0.9fr_1fr_1fr_1.2fr_100px] items-center gap-4 border-b border-border px-6 py-4 last:border-0 hover:bg-surface/40"
                >
                  <div className="font-mono text-[12px] text-muted-foreground">{r.ts}</div>
                  <div className="flex items-center gap-2 font-mono text-[12px]">
                    <ChainGlyph chain={r.chain} />
                    {c.label}
                  </div>
                  <div>
                    <span className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] capitalize text-muted-foreground">
                      {r.kind}
                    </span>
                  </div>
                  <div
                    className={
                      "flex items-center justify-end gap-1 font-mono text-[13px] " +
                      (pos ? "text-primary" : "text-foreground")
                    }
                  >
                    {pos ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" />
                    )}
                    {pos ? "+" : ""}
                    {r.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {r.asset}
                  </div>
                  <div className="text-right font-mono text-[12.5px] text-muted-foreground">
                    {pos ? "+" : "−"}
                    {formatUSD(Math.abs(r.usd))}
                  </div>
                  <div className="min-w-0 truncate font-mono text-[12px]">
                    {r.counter ? (
                      <span className="text-foreground">{r.counter}</span>
                    ) : (
                      <span className="text-muted-foreground">external</span>
                    )}
                    <span className="text-muted-foreground"> · </span>
                    <a
                      href={c.explorer(cfg.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      {r.tx}
                    </a>
                  </div>
                  <div className="text-right">
                    <span
                      className={
                        "font-mono text-[11px] " +
                        (r.status === "finalized" ? "text-primary" : "text-muted-foreground")
                      }
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground">
            <div>
              indexed by openkast-indexer · reconciles against
              <span className="text-foreground"> mainnet-beta</span> +
              <span className="text-foreground"> polygon-mainnet</span> every block
            </div>
            <div>every row is a finalized on-chain transaction — nothing is booked off-ledger</div>
          </div>
        </div>
      </div>

      <SiteFooter />
      <SeedPhraseDialog open={seedOpen} onOpenChange={setSeedOpen} />
    </div>
  );
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "pos" | "neg";
}) {
  return (
    <div className="min-w-[180px] bg-background px-6 py-4">
      <div className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={
          "mt-1 font-display text-2xl " +
          (accent === "pos" ? "text-primary" : accent === "neg" ? "text-destructive" : "")
        }
      >
        {value}
      </div>
    </div>
  );
}

function MetaCell({ k, v }: { k: string; v: string }) {
  return (
    <div className="bg-card p-3">
      <div className="font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
        {k}
      </div>
      <div className="mt-1 font-mono text-[12.5px]">{v}</div>
    </div>
  );
}

function ChainGlyph({ chain, active }: { chain: ChainKey; active?: boolean }) {
  if (chain === "solana") {
    return (
      <span
        className={
          "inline-block h-2 w-2 rotate-45 " + (active ? "bg-background" : "bg-primary")
        }
      />
    );
  }
  return (
    <span
      className={
        "inline-block h-2 w-2 rounded-full " + (active ? "bg-background" : "bg-accent")
      }
    />
  );
}
