import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, CalendarRange, Check, LoaderCircle, Wallet, WalletCards } from 'lucide-react';
import { DashboardShell } from '@/components/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { getUser } from '@/lib/auth';
import { api } from '@/lib/api';

const TYPES = [
  { value: 'PAID', label: 'Paid leave', icon: Wallet },
  { value: 'UNPAID', label: 'Unpaid leave', icon: WalletCards },
];

export default function LeaveRequest() {
  const user = getUser();
  const [form, setForm] = useState({ type: 'PAID', startDate: '', endDate: '', reason: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.startDate || !form.endDate) {
      setError('Choose a start and end date.');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date should be on or after the start date.');
      return;
    }
    if (!form.reason.trim()) {
      setError('Add a short reason for the request.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.createLeaveRequest(form);
      setSubmitted(created);
      setForm({ type: 'PAID', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      setError(err.message || "We couldn't send that request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardShell user={user}>
      <div className="fade-up">
        <p className="mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Request leave</p>
        <h1 className="serif mt-3 text-5xl leading-none tracking-[-.04em] sm:text-6xl">Plan your time off.</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          Send a request to your admin. You'll see it move from pending to approved on the Leave status page.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card className="fade-up delay-1 p-6 sm:p-8">
          {error && (
            <div className="mb-5 rounded-xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-sm leading-5 text-[hsl(var(--destructive))]">
              {error}
            </div>
          )}
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label>Leave type</Label>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                {TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setForm((f) => ({ ...f, type: value }))}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-colors ${
                      form.type === value
                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]'
                        : 'border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {form.type === value && <Check className="ml-auto h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="startDate">Start date</Label>
                <Input id="startDate" type="date" className="mt-1.5" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="endDate">End date</Label>
                <Input id="endDate" type="date" className="mt-1.5" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                className="mt-1.5 min-h-[110px]"
                placeholder="Let your admin know what this time off is for."
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              />
            </div>

            <div className="flex justify-end border-t border-[hsl(var(--border))] pt-5">
              <Button type="submit" disabled={submitting} className="px-6">
                {submitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    Submit request <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        <div className="fade-up delay-2 space-y-5">
          {submitted ? (
            <Card className="p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--success)/.13)]">
                <Check className="h-4 w-4 text-[hsl(var(--success))]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-[-.01em]">Request sent</h3>
              <p className="mt-1.5 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                Your {submitted.days}-day {submitted.type === 'PAID' ? 'paid' : 'unpaid'} leave request is now pending admin approval.
              </p>
              <Link href="/leave-status" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--primary))]">
                View leave status <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))]">
                <CalendarRange className="h-4 w-4 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-[-.01em]">Before you submit</h3>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                <li>· Paid leave draws from your annual allowance.</li>
                <li>· Unpaid leave doesn't affect your paid balance.</li>
                <li>· Your admin is notified as soon as you submit.</li>
              </ul>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
