import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LogOut, UserRound, CalendarClock, FilePlus2, ListChecks, CircleHelp, Menu, X } from 'lucide-react';
import { clearSession } from '@/lib/auth';
import { DayflowBrand } from '@/components/DayflowBrand';

function initials(name = '') {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

const NAV_ITEMS = [
  { href: '/profile', label: 'My profile', icon: UserRound },
  { href: '/attendance', label: 'Attendance', icon: CalendarClock },
  { href: '/leave-request', label: 'Request leave', icon: FilePlus2 },
  { href: '/leave-status', label: 'Leave status', icon: ListChecks },
];

export function DashboardShell({ user, children }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const logout = () => {
    clearSession();
    setLocation('/login');
  };

  return (
    <div className="grain min-h-[100dvh] bg-[hsl(var(--background))]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[255px] flex-col bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))] transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <DayflowBrand />
          <button className="rounded-md p-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-16">
          <p className="mono px-3 text-[10px] uppercase tracking-[.17em] text-[hsl(var(--sidebar-foreground)/.4)]">Workspace</p>
          <div className="mt-3 space-y-1.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[hsl(var(--sidebar-foreground)/.09)]'
                      : 'text-[hsl(var(--sidebar-foreground)/.68)] hover:bg-[hsl(var(--sidebar-foreground)/.06)]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-[hsl(var(--accent))]' : ''}`} />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto space-y-5">
          <div className="rounded-2xl border border-[hsl(var(--sidebar-foreground)/.12)] p-4">
            <p className="mono text-[10px] uppercase tracking-[.13em] text-[hsl(var(--sidebar-foreground)/.4)]">Need a hand?</p>
            <p className="mt-2 text-xs leading-5 text-[hsl(var(--sidebar-foreground)/.62)]">Your people team is one message away.</p>
            <button
              className="mt-3 flex items-center gap-2 text-xs font-semibold text-[hsl(var(--accent))]"
              onClick={() => (window.location.href = 'mailto:people@dayflow.work')}
            >
              Contact support <CircleHelp className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-3 border-t border-[hsl(var(--sidebar-foreground)/.12)] pt-5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[hsl(var(--accent))] text-xs font-bold text-[hsl(var(--foreground))]">
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.name}</p>
              <p className="mono truncate text-[10px] text-[hsl(var(--sidebar-foreground)/.43)]">{user?.employeeId}</p>
            </div>
            <button
              className="rounded-md p-1.5 text-[hsl(var(--sidebar-foreground)/.52)] transition-colors hover:text-[hsl(var(--accent))]"
              onClick={logout}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <button className="fixed inset-0 z-20 bg-[hsl(var(--foreground)/.25)] lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu overlay" />
      )}

      <div className="lg:pl-[255px]">
        <header className="flex h-[76px] items-center justify-between border-b border-[hsl(var(--border))] px-5 sm:px-10">
          <button className="rounded-lg border border-[hsl(var(--border))] p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </button>
          <span className="mono ml-auto text-[10px] uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">
            Employee workspace <span className="mx-2 text-[hsl(var(--accent))]">/</span> {user?.role}
          </span>
        </header>
        <main className="page-enter mx-auto max-w-[1120px] px-5 py-9 sm:px-10 sm:py-12">{children}</main>
      </div>
    </div>
  );
}
