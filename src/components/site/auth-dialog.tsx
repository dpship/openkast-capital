import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowRight, Mail, Loader2, Check } from "lucide-react";

type Provider = {
  id: string;
  name: string;
  hint: string;
  kind: "wallet" | "social" | "email";
  logo: React.ReactNode;
  accent?: string;
};

const WalletLogo = ({ bg, children }: { bg: string; children: React.ReactNode }) => (
  <div className="grid h-8 w-8 place-items-center rounded-md text-white" style={{ background: bg }}>
    {children}
  </div>
);

const providers: Provider[] = [
  {
    id: "phantom",
    name: "Phantom",
    hint: "detected",
    kind: "wallet",
    logo: (
      <WalletLogo bg="linear-gradient(135deg,#534BB1,#AB9FF2)">
        <svg viewBox="0 0 128 128" className="h-5 w-5 fill-white"><path d="M110 64.5c0 25.7-20.8 46.5-46.5 46.5S17 90.2 17 64.5 37.8 18 63.5 18 110 38.8 110 64.5Zm-63.7 6.8c3 0 5.4-3.5 5.4-7.8s-2.4-7.8-5.4-7.8-5.4 3.5-5.4 7.8 2.4 7.8 5.4 7.8Zm22.9 0c3 0 5.4-3.5 5.4-7.8s-2.4-7.8-5.4-7.8-5.4 3.5-5.4 7.8 2.4 7.8 5.4 7.8Z"/></svg>
      </WalletLogo>
    ),
  },
  {
    id: "solflare",
    name: "Solflare",
    hint: "solana wallet",
    kind: "wallet",
    logo: (
      <WalletLogo bg="linear-gradient(135deg,#FFB800,#FC5B00)">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M12 2 3 12l9 10 9-10-9-10Zm0 5 5 5-5 5-5-5 5-5Z"/></svg>
      </WalletLogo>
    ),
  },
  {
    id: "backpack",
    name: "Backpack",
    hint: "solana wallet",
    kind: "wallet",
    logo: (
      <WalletLogo bg="#E33E3F">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M6 8V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1Zm2 0h8V6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2Z"/></svg>
      </WalletLogo>
    ),
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    hint: "300+ wallets",
    kind: "wallet",
    logo: (
      <WalletLogo bg="#3B99FC">
        <svg viewBox="0 0 40 40" className="h-4 w-4 fill-white"><path d="M8 15c6.6-6.6 17.4-6.6 24 0l.8.8c.3.3.3.9 0 1.2l-2.7 2.7c-.2.2-.4.2-.6 0l-1.1-1.1a11.3 11.3 0 0 0-16 0l-1.2 1.2c-.2.2-.4.2-.6 0L7.9 17c-.3-.3-.3-.9 0-1.2L8 15Z"/></svg>
      </WalletLogo>
    ),
  },
];

const socials: Provider[] = [
  {
    id: "google",
    name: "Google",
    hint: "",
    kind: "social",
    logo: (
      <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background">
        <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.7 14a6.6 6.6 0 0 1 0-4.2V7H2a11 11 0 0 0 0 10l3.7-3Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3-3A11 11 0 0 0 2 7l3.7 2.9C6.6 7.3 9.1 5.4 12 5.4Z"/></svg>
      </div>
    ),
  },
  {
    id: "apple",
    name: "Apple",
    hint: "",
    kind: "social",
    logo: (
      <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-foreground"><path d="M16.4 12.6c0-2.7 2.2-4 2.3-4a5 5 0 0 0-4-2.1c-1.7-.2-3.3 1-4.2 1s-2.2-1-3.6-1a5.2 5.2 0 0 0-4.4 2.7c-1.9 3.3-.5 8.2 1.4 10.9.9 1.3 2 2.8 3.4 2.7 1.4-.1 1.9-.9 3.6-.9s2.1.9 3.6.9c1.5 0 2.4-1.3 3.3-2.6a11 11 0 0 0 1.5-3.1 4.6 4.6 0 0 1-2.9-4.2ZM13.7 4.6a4.6 4.6 0 0 0 1.1-3.3 4.7 4.7 0 0 0-3 1.6 4.3 4.3 0 0 0-1.1 3.2 3.9 3.9 0 0 0 3-1.5Z"/></svg>
      </div>
    ),
  },
  {
    id: "x",
    name: "X",
    hint: "",
    kind: "social",
    logo: (
      <div className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-foreground"><path d="M18.244 2H21l-6.52 7.454L22.5 22h-6.844l-4.79-6.26L5.2 22H2.442l6.98-7.98L1.5 2h6.98l4.33 5.72L18.244 2Zm-1.2 18.4h1.5L7.02 3.5H5.44l11.6 16.9Z"/></svg>
      </div>
    ),
  },
];

export function AuthDialog({
  open,
  onOpenChange,
  mode = "signin",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode?: "signin" | "signout";
}) {
  const [pending, setPending] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const trigger = (id: string) => {
    setPending(id);
    setTimeout(() => setPending(null), 1200);
  };

  if (mode === "signout") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[400px] gap-0 border-border bg-card p-0">
          <div className="p-6">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="font-serif text-2xl font-normal tracking-tight">Disconnect wallet</DialogTitle>
              <DialogDescription className="font-mono text-xs text-muted-foreground">
                FTD7c9…4efNZ · phantom · mainnet-beta
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-md border border-border py-2 font-mono text-[13px] text-foreground transition-colors hover:bg-muted"
              >
                cancel
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-md bg-foreground py-2 font-mono text-[13px] text-background transition-opacity hover:opacity-90"
              >
                disconnect
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] gap-0 overflow-hidden border-border bg-card p-0">
        {/* Header */}
        <div className="border-b border-border bg-gradient-to-b from-muted/40 to-transparent px-6 pt-7 pb-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md border border-primary/40 bg-primary/10">
              <div className="h-2 w-2 rotate-45 bg-primary" />
            </div>
            <span className="font-mono text-[13px] text-muted-foreground">openkast · connect</span>
          </div>
          <DialogHeader className="space-y-1.5 text-left">
            <DialogTitle className="font-serif text-[26px] font-normal leading-tight tracking-tight">
              Connect to OpenKast
            </DialogTitle>
            <DialogDescription className="text-[13px] text-muted-foreground">
              Sign in to back AI trading agents, deposit into trustless vaults, and track non-custodial returns.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Wallets */}
        <div className="px-6 pt-5">
          <SectionLabel>Solana wallets</SectionLabel>
          <div className="mt-3 space-y-1.5">
            {providers.map((p) => (
              <ProviderRow key={p.id} p={p} pending={pending === p.id} onClick={() => trigger(p.id)} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 px-6">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Socials */}
        <div className="px-6">
          <div className="grid grid-cols-3 gap-1.5">
            {socials.map((s) => (
              <button
                key={s.id}
                onClick={() => trigger(s.id)}
                className="group flex flex-col items-center gap-2 rounded-md border border-border bg-background py-3 transition-colors hover:border-border-strong hover:bg-muted/50"
              >
                {pending === s.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  s.logo
                )}
                <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="px-6 pt-5">
          <SectionLabel>Magic link</SectionLabel>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setEmailSent(true);
              setTimeout(() => setEmailSent(false), 2500);
            }}
            className="mt-3 flex gap-1.5"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fund.xyz"
                className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 font-mono text-[13px] outline-none placeholder:text-muted-foreground focus:border-primary/60"
              />
            </div>
            <button
              type="submit"
              className="flex h-10 items-center gap-1.5 rounded-md bg-foreground px-3.5 font-mono text-[12px] text-background transition-opacity hover:opacity-90"
            >
              {emailSent ? (
                <>
                  <Check className="h-3.5 w-3.5" /> sent
                </>
              ) : (
                <>
                  send <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 border-t border-border bg-muted/30 px-6 py-3.5">
          <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
            by connecting, you agree to the <span className="text-foreground underline-offset-2 hover:underline">terms</span> and{" "}
            <span className="text-foreground underline-offset-2 hover:underline">risk disclosure</span>. openkast agents
            manage capital non-custodially. your keys never leave your wallet.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ProviderRow({ p, pending, onClick }: { p: Provider; pending: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-left transition-all hover:border-border-strong hover:bg-muted/40"
    >
      {pending ? (
        <div className="grid h-8 w-8 place-items-center rounded-md border border-border">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      ) : (
        p.logo
      )}
      <div className="flex-1">
        <div className="font-mono text-[13px] font-medium text-foreground">{p.name.toLowerCase()}</div>
        {p.hint && <div className="font-mono text-[10px] text-muted-foreground">{p.hint}</div>}
      </div>
      {p.hint === "detected" && (
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
          installed
        </span>
      )}
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
