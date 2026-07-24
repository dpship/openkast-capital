import { Send } from "lucide-react";

export function BuildWithUs() {
  return (
    <a
      href="https://t.me/openkast_dev"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary px-4 py-2.5 font-mono text-[13px] font-medium text-primary-foreground shadow-[0_10px_40px_-10px_color-mix(in_oklab,var(--primary)_60%,transparent)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-10px_color-mix(in_oklab,var(--primary)_70%,transparent)]"
      aria-label="Build with us on Telegram"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-foreground" />
      </span>
      build with us
      <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
