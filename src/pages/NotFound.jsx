import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="grain flex min-h-[100dvh] flex-col items-center justify-center bg-[hsl(var(--background))] px-6 text-center">
      <p className="mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">404</p>
      <h1 className="serif mt-4 text-6xl tracking-[-.03em]">Lost your way?</h1>
      <p className="mt-4 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">
        That page doesn't exist. Let's get you back to your workspace.
      </p>
      <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-semibold text-[hsl(var(--primary-foreground))]">
        <ArrowLeft className="h-4 w-4" /> Back home
      </Link>
    </div>
  );
}
