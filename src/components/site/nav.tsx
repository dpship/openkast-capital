import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, ChevronDown, Wallet, UserRound } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { AuthDialog } from "@/components/site/auth-dialog";
import { AccountDialog } from "@/components/site/account-dialog";

export function SiteNav() {
  const { theme, toggle } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [signoutOpen, setSignoutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [connected, setConnected] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md border border-primary/40 bg-primary/10">
              <div className="h-2 w-2 rotate-45 bg-primary" />
            </div>
            <span className="font-mono text-[15px] font-medium tracking-tight text-foreground">openkast</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <NavLink to="/agents">agents</NavLink>
            <NavLink to="/markets">markets</NavLink>
            <NavLink to="/deposit">deposit</NavLink>
            <NavLink to="/portfolio">portfolio</NavLink>
            <NavLink to="/docs">docs</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground md:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            mainnet-beta
            <span className="text-border-strong">·</span>
            <span>live on solana</span>
          </div>
          <button onClick={toggle} className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground" aria-label="Toggle theme">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {connected ? (
            <>
              <button
                onClick={() => setAccountOpen(true)}
                aria-label="Account"
                className="hidden h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:text-foreground md:grid"
              >
                <UserRound className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSignoutOpen(true)}
                className="hidden items-center gap-2 rounded-md bg-primary px-3.5 py-1.5 font-mono text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
              >
                FTD7…efNZ
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="hidden items-center gap-2 rounded-md bg-primary px-3.5 py-1.5 font-mono text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90 md:inline-flex"
            >
              <Wallet className="h-3.5 w-3.5" />
              connect
            </button>
          )}
        </div>
      </div>
      <AuthDialog
        open={authOpen}
        onOpenChange={(v) => {
          setAuthOpen(v);
          if (!v) setConnected(true);
        }}
        mode="signin"
      />
      <AuthDialog
        open={signoutOpen}
        onOpenChange={(v) => {
          setSignoutOpen(v);
          if (!v) setConnected(false);
        }}
        mode="signout"
      />
      <AccountDialog open={accountOpen} onOpenChange={setAccountOpen} />
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="font-mono text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      activeProps={{ className: "font-mono text-[13px] text-foreground" }}
    >
      {children}
    </Link>
  );
}
