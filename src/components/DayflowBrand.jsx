import { Link } from 'wouter';

export function DayflowBrand({ compact = false }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[11px] bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]">
        <span className="absolute -right-2 -top-3 h-7 w-7 rounded-full border border-[hsl(var(--foreground)/.22)]" />
        <span className="serif text-[22px] leading-none">d</span>
      </span>
      {!compact && <span className="text-[17px] font-semibold tracking-[-.03em]">dayflow</span>}
    </Link>
  );
}
