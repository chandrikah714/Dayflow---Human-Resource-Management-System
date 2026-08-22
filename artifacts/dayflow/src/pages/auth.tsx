import { type FormEvent, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useLogin, useRegister } from '@workspace/api-client-react';
import { DayflowMark, WordmarkNote } from '@/components/brand';
import { saveToken } from '@/lib/auth';

function AuthAside({ mode }: { mode: 'login' | 'register' }) {
  return (
    <section className="relative hidden min-h-[100dvh] overflow-hidden bg-[hsl(var(--sidebar))] p-10 text-[hsl(var(--sidebar-foreground))] lg:flex lg:w-[43%] lg:flex-col lg:justify-between">
      <div className="absolute -right-28 top-28 h-[350px] w-[350px] rounded-full border border-[hsl(var(--accent)/.25)]" />
      <div className="absolute -right-3 top-56 h-[210px] w-[210px] rounded-full border border-[hsl(var(--accent)/.18)]" />
      <div className="absolute bottom-[-130px] left-[-100px] h-[400px] w-[400px] rounded-full bg-[hsl(var(--accent)/.10)] blur-3xl" />
      <DayflowMark />
      <div className="relative max-w-[390px] pb-10">
        <div className="mb-7 flex items-center gap-3 text-[hsl(var(--accent))]">
          <div className="h-px w-8 bg-[hsl(var(--accent))]" />
          <span className="label-caps">The people layer</span>
        </div>
        <h1 className="font-display text-[clamp(3.5rem,5vw,5.8rem)] leading-[.9] tracking-[-.06em]">Work,<br /><em className="text-[hsl(var(--accent))]">in flow.</em></h1>
        <p className="mt-8 max-w-[320px] text-sm leading-6 text-[hsl(var(--sidebar-foreground)/.68)]">A quiet corner for the details that make work feel personal. Simple, secure, and always up to date.</p>
      </div>
      <div className="relative flex items-end justify-between border-t border-[hsl(var(--sidebar-border))] pt-5 text-xs text-[hsl(var(--sidebar-foreground)/.52)]">
        <span>{mode === 'login' ? 'Welcome back to your workspace.' : 'A better start for your first day.'}</span>
        <span className="font-mono-ui text-[10px]">EST. 2024</span>
      </div>
    </section>
  );
}

function Field({ label, icon: Icon, type = 'text', value, onChange, placeholder, autoComplete, testId }: { label: string; icon: typeof Mail; type?: string; value: string; onChange: (value: string) => void; placeholder: string; autoComplete?: string; testId: string }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-[hsl(var(--foreground)/.76)]">{label}</span>
      <span className="relative flex items-center">
        <Icon className="pointer-events-none absolute left-3.5 h-[17px] w-[17px] text-[hsl(var(--muted-foreground))]" />
        <input type={isPassword && visible ? 'text' : type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} required data-testid={testId} className="h-12 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--card))] pl-11 pr-11 text-sm outline-none transition-[border,box-shadow] placeholder:text-[hsl(var(--muted-foreground)/.65)] focus:border-[hsl(var(--accent))] focus:ring-4 focus:ring-[hsl(var(--accent)/.12)]" />
        {isPassword && <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 rounded-md p-1 text-[hsl(var(--muted-foreground))]" data-testid="button-toggle-password" aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
      </span>
    </label>
  );
}

export function LoginPage() {
  const [, setLocation] = useLocation();
  const login = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    login.mutate({ data: { email, password } }, {
      onSuccess: (response) => { saveToken(response.token); setLocation('/profile'); },
      onError: (error) => setMessage((error as { data?: { error?: string } }).data?.error ?? 'We could not sign you in. Check your email and password, then try again.'),
    });
  };

  return <div className="flex min-h-[100dvh] bg-[hsl(var(--background))]"><AuthAside mode="login" /><main className="flex w-full flex-col px-6 py-7 sm:px-12 lg:w-[57%] lg:px-[8vw]"><div className="lg:hidden"><DayflowMark /></div><div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12 page-enter"><div className="mb-10"><WordmarkNote /><h2 className="mt-7 font-display text-5xl leading-none tracking-[-.055em]">Good to see you<span className="text-[hsl(var(--accent))]">.</span></h2><p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Sign in to keep your people details current.</p></div><form onSubmit={submit} className="space-y-5"><Field label="Work email" icon={Mail} value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" testId="input-login-email" /><Field label="Password" icon={LockKeyhole} type="password" value={password} onChange={setPassword} placeholder="Your secure password" autoComplete="current-password" testId="input-login-password" />{message && <div className="rounded-xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-xs leading-5 text-[hsl(var(--destructive))]" role="alert" data-testid="status-login-error">{message}</div>}<button type="submit" disabled={login.isPending} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-sm font-bold text-[hsl(var(--primary-foreground))] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65" data-testid="button-login-submit">{login.isPending ? 'Signing you in…' : 'Sign in'}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></form><div className="mt-8 flex items-center justify-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">New to Dayflow?<Link href="/register" className="font-bold text-[hsl(var(--foreground))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4" data-testid="link-register">Create your account</Link></div><div className="mt-auto flex items-center justify-center gap-2 pt-12 text-[11px] text-[hsl(var(--muted-foreground))]"><ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />Your information is protected</div></div></main></div>;
}

export function RegisterPage() {
  const [, setLocation] = useLocation();
  const register = useRegister();
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'EMPLOYEE' | 'HR'>('EMPLOYEE');
  const [message, setMessage] = useState('');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    register.mutate({ data: { employeeId, name, email, password, role } }, {
      onSuccess: (response) => { saveToken(response.token); setLocation('/profile'); },
      onError: (error) => setMessage((error as { data?: { error?: string } }).data?.error ?? 'We could not create that account. Check your details and try again.'),
    });
  };

  return <div className="flex min-h-[100dvh] bg-[hsl(var(--background))]"><AuthAside mode="register" /><main className="flex w-full flex-col px-6 py-7 sm:px-12 lg:w-[57%] lg:px-[8vw]"><div className="lg:hidden"><DayflowMark /></div><div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12 page-enter"><div className="mb-8"><WordmarkNote /><h2 className="mt-7 font-display text-5xl leading-none tracking-[-.055em]">Start with <em className="text-[hsl(var(--accent))]">you.</em></h2><p className="mt-4 text-sm leading-6 text-[hsl(var(--muted-foreground))]">Create your employee account in a minute.</p></div><form onSubmit={submit} className="space-y-4"><Field label="Full name" icon={UserRound} value={name} onChange={setName} placeholder="Your name" autoComplete="name" testId="input-register-name" /><div className="grid gap-4 sm:grid-cols-2"><Field label="Employee ID" icon={UserRound} value={employeeId} onChange={setEmployeeId} placeholder="DF-1048" autoComplete="off" testId="input-register-employee-id" /><Field label="Work email" icon={Mail} value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" testId="input-register-email" /></div><label className="block"><span className="mb-2 block text-xs font-bold text-[hsl(var(--foreground)/.76)]">Account role</span><select value={role} onChange={(event) => setRole(event.target.value as 'EMPLOYEE' | 'HR')} data-testid="select-register-role" className="h-12 w-full rounded-xl border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-4 text-sm outline-none transition-[border,box-shadow] focus:border-[hsl(var(--accent))] focus:ring-4 focus:ring-[hsl(var(--accent)/.12)]"><option value="EMPLOYEE">Employee</option><option value="HR">HR</option></select></label><Field label="Password" icon={LockKeyhole} type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" autoComplete="new-password" testId="input-register-password" />{message && <div className="rounded-xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-xs leading-5 text-[hsl(var(--destructive))]" role="alert" data-testid="status-register-error">{message}</div>}<button type="submit" disabled={register.isPending} className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-sm font-bold text-[hsl(var(--primary-foreground))] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65" data-testid="button-register-submit">{register.isPending ? 'Creating your account…' : 'Create account'}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></form><p className="mt-7 text-center text-[11px] leading-5 text-[hsl(var(--muted-foreground))]">By creating an account, you agree to keep your profile information accurate.</p><div className="mt-5 flex items-center justify-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">Already have an account?<Link href="/login" className="font-bold text-[hsl(var(--foreground))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4" data-testid="link-login">Sign in</Link></div></div></main></div>;
}