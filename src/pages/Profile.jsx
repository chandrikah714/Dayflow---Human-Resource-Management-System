import { useEffect, useState } from 'react';
import {
  AtSign, Building2, Calendar, Check, Edit3, FileText, Landmark, MapPin, Phone,
  RefreshCw, ShieldCheck, UserRound, Wallet,
} from 'lucide-react';
import { DashboardShell } from '@/components/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { getUser, saveSession, getToken } from '@/lib/auth';
import { api } from '@/lib/api';

function initials(name = '') {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function formatDate(date) {
  if (!date) return '—';
  const value = new Date(date);
  return Number.isNaN(value.valueOf()) ? '—' : value.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatCurrency(amount, currency = 'USD') {
  if (amount == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export default function Profile() {
  const [profile, setProfile] = useState(getUser());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    api
      .getProfile()
      .then((data) => {
        setProfile(data);
        saveSession(getToken(), data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading && !profile) {
    return (
      <DashboardShell user={getUser()}>
        <ProfileSkeleton />
      </DashboardShell>
    );
  }

  if (error && !profile) {
    return (
      <DashboardShell user={getUser()}>
        <div className="mx-auto max-w-lg rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[hsl(var(--accent)/.2)]">
            <RefreshCw className="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
          <h1 className="serif mt-5 text-4xl">A small pause.</h1>
          <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">We couldn't load your profile right now.</p>
          <Button onClick={load} className="mt-6">
            Try again
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return <ProfileContent profile={profile} onSaved={(next) => { setProfile(next); saveSession(getToken(), next); }} />;
}

function ProfileContent({ profile, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const isAdmin = profile.role === 'ADMIN';

  const [form, setForm] = useState({
    phone: profile.phone || '',
    address: profile.address || '',
    profilePicture: profile.profilePicture || '',
    designation: profile.designation || '',
    department: profile.department || '',
  });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      const next = await api.updateProfile(form);
      onSaved(next);
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      setSaveError(err.message || "Couldn't save those changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell user={profile}>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="fade-up">
          <p className="mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Your profile</p>
          <h1 className="serif mt-3 text-5xl leading-none tracking-[-.04em] sm:text-6xl">Hello, {profile.name.split(' ')[0]}.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-[hsl(var(--muted-foreground))]">
            This is your corner of Dayflow. Keep the details current so your team knows how to reach you.
          </p>
        </div>
        <div className="flex items-center gap-3 fade-up delay-1">
          <span className="mono text-[10px] text-[hsl(var(--muted-foreground))]">{saved ? 'Changes saved' : 'Last checked just now'}</span>
          {saved && <Check className="h-4 w-4 text-[hsl(var(--primary))] stroke-[2.5]" />}
          <Button variant={editing ? 'outline' : 'default'} onClick={() => { setEditing((v) => !v); setSaved(false); }}>
            {editing ? 'Cancel' : <><Edit3 className="h-4 w-4" /> Edit details</>}
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1.35fr]">
        {/* Identity card */}
        <Card className="fade-up delay-1 overflow-hidden !bg-[hsl(var(--sidebar))] p-6 text-[hsl(var(--sidebar-foreground))] sm:p-8">
          <div className="flex items-start justify-between">
            <div className="grid h-20 w-20 place-items-center rounded-[22px] bg-[hsl(var(--accent))] text-2xl font-semibold text-[hsl(var(--foreground))]">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={`${profile.name} profile`} className="h-full w-full rounded-[22px] object-cover" />
              ) : (
                initials(profile.name)
              )}
            </div>
            <span className="rounded-full border border-[hsl(var(--sidebar-foreground)/.17)] px-3 py-1.5 mono text-[10px] uppercase tracking-[.12em]">
              {profile.role}
            </span>
          </div>
          <h2 className="mt-14 text-2xl font-semibold tracking-[-.03em]">{profile.name}</h2>
          <p className="mt-1 text-sm text-[hsl(var(--sidebar-foreground)/.55)]">{profile.email}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[hsl(var(--sidebar-foreground)/.13)] pt-5">
            <div>
              <p className="mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--sidebar-foreground)/.4)]">Employee ID</p>
              <p className="mt-2 text-sm font-medium">{profile.employeeId}</p>
            </div>
            <div>
              <p className="mono text-[9px] uppercase tracking-[.14em] text-[hsl(var(--sidebar-foreground)/.4)]">Joined</p>
              <p className="mt-2 text-sm font-medium">{formatDate(profile.dateOfJoining)}</p>
            </div>
          </div>
        </Card>

        {/* Contact / editable card */}
        <Card className="fade-up delay-2 p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">Contact details</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-.02em]">How people reach you</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))]">
              <AtSign className="h-4 w-4 text-[hsl(var(--primary))]" />
            </div>
          </div>

          {editing ? (
            <form onSubmit={submit} className="mt-8 space-y-5">
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <Input id="phone" placeholder="+1 (555) 014-2088" className="pl-10" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" className="mt-1 min-h-[84px]" placeholder="Where can we send a thoughtful note?" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="profilePicture">Profile picture URL</Label>
                <div className="relative mt-1">
                  <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[hsl(var(--muted-foreground))]" />
                  <Input id="profilePicture" placeholder="https://..." className="pl-10" value={form.profilePicture} onChange={(e) => setForm((f) => ({ ...f, profilePicture: e.target.value }))} />
                </div>
              </div>

              {isAdmin && (
                <>
                  <div className="border-t border-[hsl(var(--border))] pt-5">
                    <p className="mono text-[10px] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Admin-only fields</p>
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" className="mt-1" value={form.designation} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" className="mt-1" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 border-t border-[hsl(var(--border))] pt-5">
                <Button type="submit" disabled={saving} className="px-5">
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
              {saveError && <p className="text-right text-xs text-[hsl(var(--destructive))]">{saveError}</p>}
            </form>
          ) : (
            <div className="mt-8 divide-y divide-[hsl(var(--border))]">
              {[
                { icon: Phone, label: 'Phone number', value: profile.phone || 'Not added yet' },
                { icon: MapPin, label: 'Address', value: profile.address || 'Not added yet' },
                { icon: UserRound, label: 'Profile picture', value: profile.profilePicture ? 'Picture linked' : 'Not added yet' },
              ].map(({ icon: Icon, label, value }) => (
                <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0" key={label}>
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{label}</p>
                    <p className="mt-0.5 text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Job details */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="fade-up delay-2 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">Job details</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-.02em]">Where you fit in</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))]">
              <Building2 className="h-4 w-4 text-[hsl(var(--primary))]" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5">
            <Field label="Designation" value={profile.designation} />
            <Field label="Department" value={profile.department} />
            <Field label="Employment type" value={profile.employmentType} />
            <Field label="Reporting manager" value={profile.reportingManager} />
            <Field label="Date of joining" value={formatDate(profile.dateOfJoining)} icon={Calendar} />
            <Field label="Employee ID" value={profile.employeeId} />
          </div>
        </Card>

        {/* Salary structure */}
        <Card className="fade-up delay-3 p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">Salary structure</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-.02em]">Your compensation</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))]">
              <Wallet className="h-4 w-4 text-[hsl(var(--primary))]" />
            </div>
          </div>
          {profile.salary ? (
            <div className="mt-6 space-y-3">
              {[
                ['Basic pay', profile.salary.basic],
                ['HRA', profile.salary.hra],
                ['Allowances', profile.salary.allowances],
                ['Deductions', -Math.abs(profile.salary.deductions)],
              ].map(([label, amount]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-[hsl(var(--muted-foreground))]">{label}</span>
                  <span className="font-medium">{formatCurrency(amount, profile.salary.currency)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-[hsl(var(--border))] pt-3 text-sm font-semibold">
                <span>Net pay / month</span>
                <span className="text-[hsl(var(--primary))]">{formatCurrency(profile.salary.netPay, profile.salary.currency)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-[hsl(var(--muted-foreground))]">Salary details aren't available yet.</p>
          )}
        </Card>
      </div>

      {/* Documents */}
      <Card className="fade-up delay-3 mt-5 p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="mono text-[10px] uppercase tracking-[.17em] text-[hsl(var(--primary))]">Documents</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-.02em]">On file</h2>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[hsl(var(--secondary))]">
            <FileText className="h-4 w-4 text-[hsl(var(--primary))]" />
          </div>
        </div>
        {profile.documents?.length ? (
          <div className="mt-6 divide-y divide-[hsl(var(--border))]">
            {profile.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-[11px] text-[hsl(var(--muted-foreground))]">{doc.type} · {formatDate(doc.uploadedAt)}</p>
                  </div>
                </div>
                <span className="mono text-[10px] uppercase tracking-[.1em] text-[hsl(var(--muted-foreground))]">On file</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-[hsl(var(--muted-foreground))]">No documents uploaded yet.</p>
        )}
      </Card>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-[hsl(var(--muted-foreground))]">
        <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
        {isAdmin ? 'As an admin, you can edit every field on this profile.' : 'Your name, email, role, and job details are managed by your People team.'}
      </div>
    </DashboardShell>
  );
}

function Field({ label, value, icon: Icon }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </p>
      <p className="mt-1 text-sm font-medium">{value || '—'}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-24 w-2/3 animate-pulse rounded-xl bg-[hsl(var(--muted))]" />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-[360px] animate-pulse rounded-2xl bg-[hsl(var(--sidebar)/.7)]" />
        <div className="h-[360px] animate-pulse rounded-2xl bg-[hsl(var(--muted))]" />
      </div>
    </div>
  );
}
