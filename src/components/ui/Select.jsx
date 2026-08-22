import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Select({ className, children, ...props }) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-11 w-full appearance-none rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 pr-10 text-sm outline-none transition-colors focus:border-[hsl(var(--ring))] focus:ring-2 focus:ring-[hsl(var(--ring)/.18)]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
    </div>
  );
}
