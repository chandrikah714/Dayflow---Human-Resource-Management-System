import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarClock, CalendarCheck, PiggyBank, TrendingUp } from 'lucide-react';
import { DashboardShell } from '@/components/DashboardShell';
import { Card } from '@/components/ui/Card';
import { getUser } from '@/lib/auth';
import { api } from '@/lib/api';

const PRIMARY = 'hsl(173 39% 31%)';
const ACCENT = 'hsl(15 63% 62%)';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="fade-up p-5">
      <div className="flex items-center justify-between">
        <p className="mono text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">{label}</p>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[hsl(var(--secondary))]">
          <Icon className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
        </div>
      </div>
      <p className="serif mt-3 text-4xl tracking-[-.02em]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{sub}</p>}
    </Card>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3.5 py-2.5 text-xs shadow-[var(--shadow-md)]">
      <p className="mono mb-1.5 uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          {entry.name}: <span className="font-semibold">{entry.value} day{entry.value === 1 ? '' : 's'}</span>
        </p>
      ))}
    </div>
  );
}

export default function Attendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    api.getAttendance().then(setData).finally(() => setLoading(false));
  }, []);

  const busiestMonth = useMemo(() => {
    if (!data?.monthlyTrend?.length) return null;
    return data.monthlyTrend.reduce((max, m) => ((m.paid + m.unpaid) > (max.paid + max.unpaid) ? m : max), data.monthlyTrend[0]);
  }, [data]);

  if (loading || !data) {
    return (
      <DashboardShell user={user}>
        <div className="h-24 w-2/3 animate-pulse rounded-xl bg-[hsl(var(--muted))]" />
        <div className="mt-6 h-[380px] animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell user={user}>
      <div className="fade-up">
        <p className="mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Attendance</p>
        <h1 className="serif mt-3 text-5xl leading-none tracking-[-.04em] sm:text-6xl">Your leave, at a glance.</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          A running total of what you've taken this year, and how it's spread across the months.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarClock} label="Annual allowance" value={data.totalAnnual} sub="days per year" />
        <StatCard icon={CalendarCheck} label="Taken so far" value={data.taken} sub={`${data.paidTaken} paid · ${data.unpaidTaken} unpaid`} />
        <StatCard icon={PiggyBank} label="Remaining" value={data.remaining} sub="days left this year" />
        <StatCard
          icon={TrendingUp}
          label="Busiest month"
          value={busiestMonth ? busiestMonth.month : '—'}
          sub={busiestMonth ? `${busiestMonth.paid + busiestMonth.unpaid} day${busiestMonth.paid + busiestMonth.unpaid === 1 ? '' : 's'} taken` : 'No leave yet'}
        />
      </div>

      <Card className="fade-up delay-1 mt-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">Monthly trend</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-.02em]">Paid vs. unpaid leave</h2>
          </div>
          <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PRIMARY }} /> Paid</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: ACCENT }} /> Unpaid</span>
          </div>
        </div>
        <div className="mt-6 h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyTrend} barCategoryGap={18}>
              <CartesianGrid vertical={false} stroke="hsl(42 19% 87%)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'hsl(184 11% 46%)', fontSize: 11 }} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'hsl(184 11% 46%)', fontSize: 11 }} width={28} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(184 24% 17% / 0.04)' }} />
              <Bar dataKey="paid" name="Paid" stackId="leave" fill={PRIMARY} radius={[0, 0, 0, 0]} />
              <Bar dataKey="unpaid" name="Unpaid" stackId="leave" fill={ACCENT} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </DashboardShell>
  );
}
