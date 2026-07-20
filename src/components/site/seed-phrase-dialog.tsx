import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
} from "lucide-react";

const SEED_PHRASE =
  "vault harbor lens quantum ember drift orbit velvet chorus signal timber pivot";

type Step = "warn" | "reveal";

export function SeedPhraseDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [step, setStep] = useState<Step>("warn");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(60);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setStep("warn");
      setVisible(false);
      setRemaining(60);
      setLoading(false);
      setCopied(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [open]);

  const reveal = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("reveal");
      setRemaining(60);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(timerRef.current!);
            setVisible(false);
            setStep("warn");
            return 60;
          }
          return r - 1;
        });
      }, 1000);
    }, 700);
  };

  const copy = () => {
    navigator.clipboard?.writeText(SEED_PHRASE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] gap-0 overflow-hidden border-border bg-card p-0">
        {step === "warn" && (
          <div className="p-6">
            <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              <div className="grid h-6 w-6 place-items-center rounded-md border border-primary/40 bg-primary/10">
                <div className="h-1.5 w-1.5 rotate-45 bg-primary" />
              </div>
              openkast · key export
            </div>
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-md border border-amber-500/40 bg-amber-500/10">
              <ShieldAlert className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="font-display text-2xl leading-tight tracking-tight">
              Reveal recovery phrase
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              Anyone with this 12-word phrase controls every key derived from your OpenKast account —
              across Solana and Polygon. OpenKast will never ask for it.
            </p>
            <ul className="mt-4 space-y-2 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
              <li>• write it down offline — do not screenshot or paste into chat.</li>
              <li>• store it somewhere only you can access.</li>
              <li>• the phrase will auto-hide after 60 seconds.</li>
            </ul>
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-md border border-border py-2 font-mono text-[12px] hover:bg-muted"
              >
                cancel
              </button>
              <button
                onClick={reveal}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-amber-500 py-2 font-mono text-[12px] text-black transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "i understand, reveal"}
              </button>
            </div>
          </div>
        )}

        {step === "reveal" && (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => {
                  if (timerRef.current) clearInterval(timerRef.current);
                  setVisible(false);
                  setStep("warn");
                }}
                className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> back
              </button>
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-500">
                auto-hide {remaining}s
              </span>
            </div>

            <h3 className="font-display text-xl leading-tight tracking-tight">
              Your recovery phrase
            </h3>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              {visible ? "click any word to hide again." : "click the grid to reveal."}
            </p>

            <button
              onClick={() => setVisible((v) => !v)}
              className="relative mt-4 grid w-full grid-cols-3 gap-1.5 rounded-md border border-border bg-background p-3 text-left"
            >
              {SEED_PHRASE.split(" ").map((w, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded border border-border bg-muted/40 px-2 py-2 font-mono text-[12px] ${
                    visible ? "" : "blur-sm select-none"
                  }`}
                >
                  <span className="w-4 text-muted-foreground">{i + 1}.</span>
                  <span>{w}</span>
                </div>
              ))}
              {!visible && (
                <div className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 font-mono text-[11px]">
                    <Eye className="h-3.5 w-3.5" /> click to reveal
                  </span>
                </div>
              )}
            </button>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setVisible((v) => !v)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border py-2 font-mono text-[12px] hover:bg-muted"
              >
                {visible ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> hide
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" /> reveal
                  </>
                )}
              </button>
              <button
                onClick={copy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-foreground py-2 font-mono text-[12px] text-background hover:opacity-90"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> copy phrase
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 border-t border-border pt-3 font-mono text-[10.5px] uppercase tracking-widest text-muted-foreground">
              non-custodial · derived offline · bip-39
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
