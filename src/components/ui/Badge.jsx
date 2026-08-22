import { cn } from '@/lib/utils';

const tones = {
  pending: 'bg-[hsl(38_70%_92%)] text-[hsl(32_55%_36%)]',
  approved: 'bg-[hsl(var(--success)/.13)] text-[hsl(var(--success))]',
  rejected: 'bg-[hsl(var(--destructive)/.12)] text-[hsl(var(--destructive))]',
  neutral: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]',
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'mono inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[.1em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
