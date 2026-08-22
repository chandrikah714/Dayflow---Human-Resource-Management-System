import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, BriefcaseBusiness, Check, LoaderCircle, ShieldCheck } from 'lucide-react';
import { AuthLayout } from '@/components/AuthLayout';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { saveSession } from '@/lib/auth';
import { api } from '@/lib/api';

const ROLES = [
  { value: 'EMPLOYEE', label: 'Employee', icon: BriefcaseBusiness },
  { value: 'ADMIN', label: 'Admin', icon: ShieldCheck },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [values, setValues] = useState({ employeeId: '', name: '', email: '', password: '', role: 'EMPLOYEE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!values.name || !values.employeeId || !values.email || values.password.length < 8) {
      setError('Fill in every field — passwords need at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const result = await api.register(values);
      saveSession(result.token, result.user);
      setLocation('/profile');
    } catch (err) {
      setError(err.message || "We couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Start here"
      title={
        <>
          Make room for
          <br />
          <i>good work.</i>
        </>
      }
      detail="Create your Dayflow account. It only takes a minute, and your personal details stay yours."
    >
      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="rounded-xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-sm leading-5 text-[hsl(var(--destructive))]">
            {error}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Avery Morgan" className="mt-1" value={values.name} onChange={onChange('name')} />
          </div>
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" placeholder="DF-1048" className="mt-1" value={values.employeeId} onChange={onChange('employeeId')} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" className="mt-1" value={values.email} onChange={onChange('email')} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="8+ characters" className="mt-1" value={values.password} onChange={onChange('password')} />
        </div>
        <div>
          <Label>Your role</Label>
          <div className="grid grid-cols-2 gap-3 pt-1">
            {ROLES.map(({ value, label, icon: Icon }) => (
              <button
                type="button"
                key={value}
                onClick={() => setValues((v) => ({ ...v, role: value }))}
                className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-xs font-semibold transition-colors ${
                  values.role === value
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/.08)] text-[hsl(var(--primary))]'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {values.role === value && <Check className="ml-auto h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={loading} className="mt-2 w-full h-12">
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" /> Creating your space
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
