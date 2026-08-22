import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, Camera, Mail, MapPin, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { getGetProfileQueryKey, useGetProfile, useUpdateProfile } from '@workspace/api-client-react';
import { AppShell } from '@/components/app-shell';
import { getToken, clearToken } from '@/lib/auth';

function initials(name?: string) {
  return (name || 'You').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function ProfileSkeleton() {
  return <div className="mx-auto max-w-[1040px] animate-pulse space-y-8"><div className="h-8 w-56 rounded-lg bg-[hsl(var(--muted))]" /><div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]"><div className="h-[360px] rounded-2xl bg-[hsl(var(--muted))]" /><div className="h-[360px] rounded-2xl bg-[hsl(var(--muted))]" /></div></div>;
}

function ReadOnlyDetail({ icon: Icon, label, value, testId }: { icon: typeof Mail; label: string; value: string; testId: string }) {
  return <div className="flex gap-3.5"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"><Icon className="h-4 w-4" /></span><div className="min-w-0"><div className="label-caps mb-1 text-[hsl(var(--muted-foreground))]">{label}</div><div className="truncate text-sm font-semibold" data-testid={testId}>{value || 'Not added yet'}</div></div></div>;
}

export function ProfilePage() {
  const [, setLocation] = useLocation();
  const token = getToken();
  const queryClient = useQueryClient();
  const profileQuery = useGetProfile({ query: { queryKey: getGetProfileQueryKey(), enabled: Boolean(token) } });
  const updateProfile = useUpdateProfile();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [picture, setPicture] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [notice, setNotice] = useState('');

  const profile = profileQuery.data;
  useEffect(() => {
    if (profile && !initialized) {
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setPicture(profile.profilePicture || null);
      setInitialized(true);
    }
  }, [profile, initialized]);

  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return '—';
    const date = new Date(profile.createdAt);
    return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
  }, [profile?.createdAt]);

  const handlePicture = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      setNotice('Please choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPicture(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    setNotice('');
    updateProfile.mutate({ data: { phone: phone.trim() || null, address: address.trim() || null, profilePicture: picture || null } }, {
      onSuccess: (updated) => {
        queryClient.setQueryData(getGetProfileQueryKey(), updated);
        setEditing(false);
        setNotice('Your profile is up to date.');
      },
      onError: () => setNotice('We could not save your changes. Please try again.'),
    });
  };

  const cancel = () => {
    setPhone(profile?.phone || '');
    setAddress(profile?.address || '');
    setPicture(profile?.profilePicture || null);
    setEditing(false);
    setNotice('');
  };

  if (profileQuery.isLoading) return <AppShell><div className="px-5 py-12 sm:px-8 lg:px-12"><ProfileSkeleton /></div></AppShell>;
  if (profileQuery.isError || !profile) return <AppShell><div className="mx-auto max-w-[620px] px-5 py-20 text-center sm:px-8"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--accent)/.2)]"><ShieldCheck className="h-6 w-6" /></div><h1 className="font-display text-4xl tracking-[-.04em]">Your profile is taking a moment.</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">We could not load your details right now. Your account is safe — please try again.</p><div className="mt-7 flex justify-center gap-3"><button type="button" onClick={() => profileQuery.refetch()} className="rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-[hsl(var(--primary-foreground))]" data-testid="button-profile-retry">Try again</button><button type="button" onClick={() => { clearToken(); setLocation('/login'); }} className="rounded-xl border border-[hsl(var(--border))] px-5 py-3 text-sm font-bold" data-testid="button-profile-error-signout">Sign out</button></div></div></AppShell>;

  return <AppShell name={profile.name} role={profile.role}><div className="app-grid min-h-[calc(100dvh-76px)] px-5 py-9 sm:px-8 sm:py-12 lg:px-12"><div className="page-enter mx-auto max-w-[1040px]"><div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2 text-[hsl(var(--accent))]"><span className="h-px w-6 bg-[hsl(var(--accent))]" /><span className="label-caps">Personal space</span></div><h1 className="font-display text-5xl leading-none tracking-[-.055em] sm:text-6xl" data-testid="text-profile-heading">Your profile<span className="text-[hsl(var(--accent))]">.</span></h1><p className="mt-4 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">Keep the details your team needs, and nothing more.</p></div><div className="font-mono-ui text-[10px] tracking-[.12em] text-[hsl(var(--muted-foreground))]" data-testid="text-profile-id">EMP / {profile.employeeId}</div></div><div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]"><section className="relative overflow-hidden rounded-2xl bg-[hsl(var(--sidebar))] p-7 text-[hsl(var(--sidebar-foreground))] shadow-lg sm:p-8"><div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[hsl(var(--accent)/.26)]" /><div className="absolute bottom-[-70px] right-8 h-40 w-40 rounded-full bg-[hsl(var(--accent)/.12)] blur-2xl" /><div className="relative"><div className="mb-10 flex items-start justify-between"><span className="label-caps text-[hsl(var(--sidebar-foreground)/.55)]">Employee record</span><span className="rounded-full bg-[hsl(83_51%_58%/.16)] px-3 py-1 text-[10px] font-bold text-[hsl(83_51%_70%)]">Active</span></div><div className="mb-8 flex items-center gap-4"><span className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl bg-[hsl(var(--accent))] text-2xl font-extrabold text-[hsl(var(--foreground))]" data-testid="img-profile-avatar">{profile.profilePicture ? <img src={profile.profilePicture} alt={`${profile.name} profile`} className="h-full w-full object-cover" /> : initials(profile.name)}</span><div><h2 className="text-xl font-extrabold tracking-[-.03em]" data-testid="text-profile-name">{profile.name}</h2><p className="mt-1 text-sm text-[hsl(var(--sidebar-foreground)/.6)]" data-testid="text-profile-role">{profile.role === 'HR' ? 'People & culture' : 'Employee'}</p></div></div><div className="space-y-5 border-t border-[hsl(var(--sidebar-border))] pt-6"><ReadOnlyDetail icon={Mail} label="Work email" value={profile.email} testId="text-profile-email" /><ReadOnlyDetail icon={UserRound} label="Employee ID" value={profile.employeeId} testId="text-profile-employee-id" /><ReadOnlyDetail icon={Check} label="Member since" value={memberSince} testId="text-profile-member-since" /></div></div></section><section className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/.92)] p-6 shadow-sm sm:p-8"><div className="mb-7 flex items-start justify-between gap-4"><div><div className="label-caps mb-2 text-[hsl(var(--muted-foreground))]">Contact details</div><h2 className="font-display text-3xl tracking-[-.04em]">The essentials</h2></div>{!editing && <button type="button" onClick={() => { setNotice(''); setEditing(true); }} className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--muted))]" data-testid="button-edit-profile">Edit details <ChevronRight className="h-3.5 w-3.5 text-[hsl(var(--accent))]" /></button>}</div>{editing ? <form onSubmit={save} className="space-y-5 page-enter"><label className="block"><span className="mb-2 block text-xs font-bold">Phone number</span><span className="relative flex items-center"><Phone className="pointer-events-none absolute left-3.5 h-4 w-4 text-[hsl(var(--muted-foreground))]" /><input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+1 555 000 0000" type="tel" className="h-11 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] pl-10 pr-3 text-sm outline-none transition-[border,box-shadow] focus:border-[hsl(var(--accent))] focus:ring-4 focus:ring-[hsl(var(--accent)/.12)]" data-testid="input-profile-phone" /></span></label><label className="block"><span className="mb-2 block text-xs font-bold">Home address</span><span className="relative flex items-start"><MapPin className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[hsl(var(--muted-foreground))]" /><textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Where should we send something thoughtful?" rows={3} className="w-full resize-none rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--background))] py-3 pl-10 pr-3 text-sm outline-none transition-[border,box-shadow] focus:border-[hsl(var(--accent))] focus:ring-4 focus:ring-[hsl(var(--accent)/.12)]" data-testid="input-profile-address" /></span></label><div><span className="mb-2 block text-xs font-bold">Profile picture</span><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-[hsl(var(--accent)/.28)] text-lg font-extrabold">{picture ? <img src={picture} alt="Profile preview" className="h-full w-full object-cover" /> : initials(profile.name)}</span><label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[hsl(var(--border))] px-3 py-2 text-xs font-bold transition-colors hover:bg-[hsl(var(--muted))]" data-testid="label-upload-picture"><Camera className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />Choose image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePicture} className="sr-only" data-testid="input-profile-picture" /></label><span className="text-[11px] text-[hsl(var(--muted-foreground))]">JPG, PNG or WebP · 2 MB max</span></div></div>{notice && <div className={`rounded-xl px-3 py-2.5 text-xs ${notice.includes('up to date') ? 'bg-[hsl(83_51%_58%/.16)] text-[hsl(157_27%_17%)]' : 'bg-[hsl(var(--destructive)/.08)] text-[hsl(var(--destructive))]'}`} role="status" data-testid="status-profile-save">{notice}</div>}<div className="flex gap-3 pt-1"><button type="submit" disabled={updateProfile.isPending} className="rounded-xl bg-[hsl(var(--primary))] px-5 py-3 text-xs font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-0.5 disabled:opacity-60" data-testid="button-save-profile">{updateProfile.isPending ? 'Saving…' : 'Save changes'}</button><button type="button" onClick={cancel} className="rounded-xl border border-[hsl(var(--border))] px-5 py-3 text-xs font-bold" data-testid="button-cancel-profile">Cancel</button></div></form> : <div className="space-y-1">{[{ icon: Phone, label: 'Phone number', value: profile.phone, id: 'text-profile-phone' }, { icon: MapPin, label: 'Home address', value: profile.address, id: 'text-profile-address' }].map(({ icon: Icon, label, value, id }) => <div key={label} className="flex items-center gap-4 border-t border-[hsl(var(--border))] py-5 first:border-t-0 first:pt-0"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"><Icon className="h-[17px] w-[17px]" /></span><div><div className="label-caps mb-1 text-[hsl(var(--muted-foreground))]">{label}</div><div className={`text-sm ${value ? 'font-semibold' : 'italic text-[hsl(var(--muted-foreground))]'}`} data-testid={id}>{value || 'Not added yet'}</div></div></div>)}{notice && <div className="mt-4 rounded-xl bg-[hsl(83_51%_58%/.16)] px-3 py-2.5 text-xs text-[hsl(157_27%_17%)]" role="status" data-testid="status-profile-save">{notice}</div>}<div className="mt-5 flex items-start gap-2 border-t border-[hsl(var(--border))] pt-5 text-[11px] leading-5 text-[hsl(var(--muted-foreground))]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--accent))]" />Only you can edit these personal details.</div></div>}</section></div><div className="mt-6 flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]"><span>Need help? <Link href="/profile" className="font-bold text-[hsl(var(--foreground))] underline decoration-[hsl(var(--accent))] underline-offset-2" data-testid="link-help-profile">Ask your People team</Link></span><span className="font-mono-ui">DAYFLOW / PRIVATE BY DEFAULT</span></div></div></div></AppShell>;
}