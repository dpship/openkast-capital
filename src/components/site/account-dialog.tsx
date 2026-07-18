import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  ShieldAlert,
  Wallet,
} from "lucide-react";

type View = "account" | "seed-warn" | "seed-reveal";

const MOCK = {
  displayName: "Anon Allocator",
  email: "anon@fund.xyz",
  publicKey: "FTD7c9qP4v3sK8mR2xN1jL5wYbH6uA9zEfNZ4efNZ",
  balanceUsd: 12480.54,
  providers: ["phantom", "google", "x"] as const,
  seedPhrase:
    "vault harbor lens quantum ember drift orbit velvet chorus signal timber pivot",
};

export function AccountDialog({
  open,
  onOpenChange,
  onSignOut,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSignOut?: () => void;
}) {
  const [view, setView] = useState<View>("account");
  const [displayName, setDisplayName] = useState(MOCK.displayName);
  const [email, setEmail] = useState(MOCK.email);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // seed reveal state
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedVisible, setSeedVisible] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      // reset when closed
      setView("account");
      setSeedVisible(false);
      setRemaining(60);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [open]);

  const truncatedKey = useMemo(() => {
    const k = MOCK.publicKey;
    return `${k.slice(0, 4)}…${k.slice(-4)}`;
  }, []);

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const goReveal = () => {
    setSeedLoading(true);
    setTimeout(() => {
      setSeedLoading(false);
      setView("seed-reveal");
      setRemaining(60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(timerRef.current!);
            setSeedVisible(false);
            setView("seed-warn");
            return 60;
          }
          return r - 1;
        });
      }, 1000);
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] gap-0 overflow-hidden border-border bg-card p-0">
        {view === "account" && (
          <div>
            {/* Header */}
            <div className="border-b border-border bg-gradient-to-b from-muted/40 to-transparent px-6 pt-6 pb-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-md border border-primary/40 bg-primary/10">
                  <div className="h-2 w-2 rotate-45 bg-primary" />
                </div>
                <span className="font-mono text-[12px] text-muted-foreground">openkast · account</span>
              </div>
              <h2 className="font-serif text-[24px] font-normal leading-tight tracking-tight">Account</h2>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                private settings · not visible to other allocators
              </p>
            </div>

            {/* Identity */}
            <Section label="identity">
              <form onSubmit={save} className="space-y-3">
                <Field label="display name">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary/60"
                  />
                </Field>
                <Field label="email">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 w-full rounded-md border border-border bg-background px-3 font-mono text-[13px] outline-none focus:border-primary/60"
                  />
                </Field>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 font-mono text-[12px] text-background transition-opacity hover:opacity-90"
                  >
                    {saved ? <><Check className="h-3.5 w-3.5" /> saved</> : "save"}
                  </button>
                </div>
              </form>
            </Section>

            {/* Wallet & Security */}
            <Section label="wallet & security">
              <div className="space-y-3">
                <Field label="custodial address · solana">
                  <div className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3">
                    <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="flex-1 font-mono text-[13px]">{truncatedKey}</span>
                    <button
                      type="button"
                      onClick={() => copy("addr", MOCK.publicKey)}
                      className="flex items-center gap-1 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      {copied === "addr" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied === "addr" ? "copied" : "copy"}
                    </button>
                  </div>
                </Field>

                <Field label="balance">
                  <div className="flex h-9 items-center justify-between rounded-md border border-border bg-background px-3">
                    <span className="font-mono text-[13px]">
                      ${MOCK.balanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">usd</span>
                  </div>
                </Field>

                <button
                  onClick={() => setView("seed-warn")}
                  className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-muted/40"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-7 w-7 place-items-center rounded-md border border-amber-500/40 bg-amber-500/10">
                      <KeyRound className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <div className="font-mono text-[12px] text-foreground">export recovery phrase</div>
                      <div className="font-mono text-[10px] text-muted-foreground">12-word seed · reveal & copy</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">export</span>
                </button>

                <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
                  this is your platform custodial wallet — separate from any external wallet like phantom you connected.
                </p>
              </div>
            </Section>

            {/* Logins */}
            <Section label="logins">
              <div className="flex flex-wrap gap-1.5">
                {MOCK.providers.map((p) => (
                  <span
                    key={p}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {p}
                  </span>
                ))}
              </div>
            </Section>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-3">
              <span className="font-mono text-[10px] text-muted-foreground">private · encrypted at rest</span>
              <span className="font-mono text-[10px] text-muted-foreground">v1.0 · mainnet-beta</span>
            </div>
          </div>
        )}

        {view === "seed-warn" && (
          <div className="p-6">
            <button
              onClick={() => setView("account")}
              className="mb-4 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> back to account
            </button>
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-md border border-amber-500/40 bg-amber-500/10">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-serif text-[22px] font-normal leading-tight tracking-tight">
              Reveal recovery phrase
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Anyone with this phrase controls your funds. Never share it. Openkast will never ask for it.
            </p>
            <ul className="mt-4 space-y-2 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
              <li>• write it down offline — do not screenshot or paste into chat.</li>
              <li>• store it somewhere only you can access.</li>
              <li>• the phrase will auto-hide after 60 seconds.</li>
            </ul>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setView("account")}
                className="flex-1 rounded-md border border-border py-2 font-mono text-[12px] hover:bg-muted"
              >
                cancel
              </button>
              <button
                onClick={goReveal}
                disabled={seedLoading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-amber-500 py-2 font-mono text-[12px] text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {seedLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "i understand, reveal"}
              </button>
            </div>
          </div>
        )}

        {view === "seed-reveal" && (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setSeedVisible(false);
                  setView("account");
                }}
                className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> back to account
              </button>
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-500">
                auto-hide {remaining}s
              </span>
            </div>
            <h3 className="font-serif text-[20px] font-normal leading-tight tracking-tight">
              Your recovery phrase
            </h3>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              {seedVisible ? "click any word to hide again." : "click the grid to reveal."}
            </p>

            <button
              onClick={() => setSeedVisible((v) => !v)}
              className="relative mt-4 grid w-full grid-cols-3 gap-1.5 rounded-md border border-border bg-background p-3 text-left"
            >
              {MOCK.seedPhrase.split(" ").map((w, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded border border-border bg-muted/40 px-2 py-2 font-mono text-[12px] ${
                    seedVisible ? "" : "blur-sm select-none"
                  }`}
                >
                  <span className="w-4 text-muted-foreground">{i + 1}.</span>
                  <span>{w}</span>
                </div>
              ))}
              {!seedVisible && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px]">
                    <Eye className="h-3.5 w-3.5" /> click to reveal
                  </span>
                </div>
              )}
            </button>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSeedVisible((v) => !v)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border py-2 font-mono text-[12px] hover:bg-muted"
              >
                {seedVisible ? <><EyeOff className="h-3.5 w-3.5" /> hide</> : <><Eye className="h-3.5 w-3.5" /> reveal</>}
              </button>
              <button
                onClick={() => copy("seed", MOCK.seedPhrase)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground py-2 font-mono text-[12px] text-background hover:opacity-90"
              >
                {copied === "seed" ? <><Check className="h-3.5 w-3.5" /> copied</> : <><Copy className="h-3.5 w-3.5" /> copy phrase</>}
              </button>
            </div>

            <p className="mt-4 font-mono text-[10px] leading-relaxed text-muted-foreground">
              this is your platform custodial wallet — separate from any external wallet like phantom you connected.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border px-6 py-5 last:border-b-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
