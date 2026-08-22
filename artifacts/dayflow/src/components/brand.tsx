import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export function DayflowMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group inline-flex items-center gap-3" data-testid="link-brand-home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[11px] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))] shadow-sm transition-transform duration-300 group-hover:-rotate-6">
        <span className="h-4 w-4 rounded-full border-[3px] border-[hsl(var(--foreground))] border-r-transparent" />
        <span className="absolute bottom-[9px] right-[8px] h-1.5 w-1.5 rounded-full bg-[hsl(var(--foreground))]" />
      </span>
      {!compact && <span className="text-[17px] font-extrabold tracking-[-0.04em]">dayflow</span>}
    </Link>
  );
}

export function WordmarkNote() {
  return (
    <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
      <span className="font-mono-ui text-[10px] tracking-[.14em]">DF / 01</span>
      <ArrowUpRight className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
      <span>your people, in sync</span>
    </div>
  );
}