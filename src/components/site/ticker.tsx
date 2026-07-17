import { TICKER_ITEMS } from "@/lib/mock";
import { ChevronRight } from "lucide-react";

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden border-y border-border bg-background">
      <div className="flex whitespace-nowrap animate-marquee">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-3 px-8 py-3 font-mono text-[12px] text-muted-foreground">
            <ChevronRight className="h-3 w-3 text-primary" />
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
