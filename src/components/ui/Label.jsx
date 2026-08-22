import { cn } from '@/lib/utils';

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('text-xs font-semibold text-[hsl(var(--foreground))]', className)} {...props}>
      {children}
    </label>
  );
}
