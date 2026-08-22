import { DayflowBrand } from '@/components/DayflowBrand';

export function AuthLayout({ eyebrow, title, detail, children }) {
  return (
    <div className="grain grid min-h-[100dvh] bg-[hsl(var(--background))] lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[hsl(var(--sidebar))] p-12 text-[hsl(var(--sidebar-foreground))] lg:flex">
        <DayflowBrand />
        <div className="fade-up max-w-md">
          <p className="mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--accent))]">{eyebrow}</p>
          <h1 className="serif mt-5 text-6xl leading-[0.95] tracking-[-.03em]">{title}</h1>
          <p className="mt-6 text-sm leading-6 text-[hsl(var(--sidebar-foreground)/.62)]">{detail}</p>
        </div>
        <p className="mono text-[10px] text-[hsl(var(--sidebar-foreground)/.35)]">Dayflow HRMS &copy; {new Date().getFullYear()}</p>
      </div>
      <div className="page-enter flex flex-col justify-center px-6 py-14 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <DayflowBrand />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
