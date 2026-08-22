import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }) {
  return (
    <section
      className={cn('rounded-2xl border border-[hsl(var(--card-border))] bg-[hsl(var(--card))] shadow-[var(--shadow-sm)]', className)}
      {...props}
    >
      {children}
    </section>
  );
}
