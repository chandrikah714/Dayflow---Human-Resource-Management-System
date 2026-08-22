import { type ReactNode, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, UserRound, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { clearToken } from '@/lib/auth';
import { DayflowMark } from '@/components/brand';

function initials(name?: string) {
  return (name || 'You').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

export function AppShell({ children, name, role }: { children: ReactNode; name?: string; role?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [, setLocation] = useLocation();

  const signOut = () => {
    clearToken();
    setLocation('/login');
  };

  return (
    <div className="min-h-[100dvh] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-[hsl(var(--sidebar))] px-5 py-6 text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-14 flex items-center justify-between">
          <DayflowMark />
          <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-1 text-[hsl(var(--sidebar-foreground)/.7)] md:hidden" data-testid="button-close-menu" aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-3 px-3 label-caps text-[hsl(var(--sidebar-foreground)/.42)]">Workspace</div>
        <nav className="space-y-1" aria-label="Main navigation">
          <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl bg-[hsl(var(--sidebar-accent))] px-3 py-3 text-sm font-semibold" data-testid="link-profile">
            <UserRound className="h-[17px] w-[17px] text-[hsl(var(--accent))]" />
            <span>My profile</span>
          </Link>
        </nav>
        <div className="mt-auto border-t border-[hsl(var(--sidebar-border))] pt-5">
          <div className="mb-5 rounded-xl border border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-accent)/.45)] p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[hsl(83_51%_58%)]" />
              <span className="label-caps text-[hsl(var(--sidebar-foreground)/.55)]">Secure workspace</span>
            </div>
            <p className="text-xs leading-5 text-[hsl(var(--sidebar-foreground)/.65)]">Your personal details stay yours. Update only what you need.</p>
          </div>
          <button type="button" onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[hsl(var(--sidebar-foreground)/.72)] transition-colors hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]" data-testid="button-sign-out">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      {mobileOpen && <button type="button" aria-label="Close navigation overlay" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-[hsl(var(--foreground)/.28)] md:hidden" data-testid="button-menu-overlay" />}
      <div className="min-h-[100dvh] md:pl-[248px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/.88)] px-5 backdrop-blur-md sm:px-8 lg:px-12">
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-xl p-2 text-[hsl(var(--foreground))] md:hidden" data-testid="button-open-menu" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden text-sm text-[hsl(var(--muted-foreground))] md:block">Monday, <span className="font-semibold text-[hsl(var(--foreground))]">your day, your flow.</span></div>
          <div className="ml-auto flex items-center gap-4">
            <button type="button" className="relative rounded-xl p-2 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]" data-testid="button-notifications" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
            </button>
            <div className="h-6 w-px bg-[hsl(var(--border))]" />
            <Link href="/profile" className="flex items-center gap-2.5" data-user-role={role} data-testid="link-header-profile">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--accent)/.28)] text-xs font-extrabold text-[hsl(var(--foreground))]">{initials(name)}</span>
              <span className="hidden text-sm font-semibold sm:block">{name || 'Your profile'}</span>
              <ChevronDown className="hidden h-4 w-4 text-[hsl(var(--muted-foreground))] sm:block" />
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}