import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Clock, FilePlus2, Inbox } from 'lucide-react';
import { DashboardShell } from '@/components/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getUser } from '@/lib/auth';
import { api } from '@/lib/api';

const STATUS_TONE = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };
const STATUS_LABEL = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' };

function formatDate(date) {
  if (!date) return '—';
  const value = new Date(date);
  return Number.isNaN(value.valueOf()) ? '—' : value.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(date) {
  if (!date) return '—';
  const value = new Date(date);
  return Number.isNaN(value.valueOf()) ? '—' : value.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function LeaveStatus() {
  const user = getUser();
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getLeaveRequests().then(setRequests).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="fade-up">
          <p className="mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Leave status</p>
          <h1 className="serif mt-3 text-5xl leading-none tracking-[-.04em] sm:text-6xl">Where things stand.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            Every request you've sent, newest first, with its current decision.
          </p>
        </div>
        <Link href="/leave-request">
          <Button className="fade-up delay-1">
            <FilePlus2 className="h-4 w-4" /> New request
          </Button>
        </Link>
      </div>

      <Card className="fade-up delay-2 mt-8 overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-[hsl(var(--muted))]" />
            ))}
          </div>
        ) : requests?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border))] text-left">
                  <th className="mono px-6 py-4 text-[10px] font-medium uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Requested</th>
                  <th className="mono px-6 py-4 text-[10px] font-medium uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Type</th>
                  <th className="mono px-6 py-4 text-[10px] font-medium uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Dates</th>
                  <th className="mono px-6 py-4 text-[10px] font-medium uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Days</th>
                  <th className="mono px-6 py-4 text-[10px] font-medium uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Reason</th>
                  <th className="mono px-6 py-4 text-[10px] font-medium uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-[hsl(var(--border))] last:border-0">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                        <Clock className="h-3 w-3" /> {formatDateTime(req.requestedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top font-medium">{req.type === 'PAID' ? 'Paid' : 'Unpaid'}</td>
                    <td className="px-6 py-4 align-top text-[hsl(var(--muted-foreground))]">
                      {formatDate(req.startDate)}{req.startDate !== req.endDate ? ` – ${formatDate(req.endDate)}` : ''}
                    </td>
                    <td className="px-6 py-4 align-top">{req.days}</td>
                    <td className="max-w-[220px] px-6 py-4 align-top text-[hsl(var(--muted-foreground))]">
                      <span className="line-clamp-2">{req.reason}</span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <Badge tone={STATUS_TONE[req.status]}>{STATUS_LABEL[req.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[hsl(var(--secondary))]">
              <Inbox className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
            </div>
            <p className="text-sm font-medium">No requests yet</p>
            <p className="max-w-xs text-sm text-[hsl(var(--muted-foreground))]">When you request time off, it'll show up here with its status.</p>
          </div>
        )}
      </Card>
    </DashboardShell>
  );
}
