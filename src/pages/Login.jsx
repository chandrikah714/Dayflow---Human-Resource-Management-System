import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from 'lucide-react';
import { AuthLayout } from '@/components/AuthLayout';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { saveSession } from '@/lib/auth';
import { api } from '@/lib/api';

export default function Login() {
  const [, setLocation] = useLocation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!values.email || !values.password) {
      setError('Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const result = await api.login(values);
      saveSession(result.token, result.user);
      setLocation('/profile');
    } catch (err) {
      setError(err.message || "We couldn't sign you in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title={
        <>
          Good to see
          <br />
          <i>you.</i>
        </>
      }
      detail="Sign in to pick up where you left off. Your workspace is waiting."
    >
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-xl border border-[hsl(var(--destructive)/.25)] bg-[hsl(var(--destructive)/.07)] px-4 py-3 text-sm leading-5 text-[hsl(var(--destructive))]">
            {error}
          </div>
        )}
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" className="mt-1" value={values.email} onChange={onChange('email')} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <span className="text-[11px] text-[hsl(var(--muted-foreground))]">At least 8 characters</span>
          </div>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              className="pr-11"
              value={values.password}
              onChange={onChange('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="mt-2 w-full h-12">
          {loading ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" /> Signing in
            </>
          ) : (
            <>
              Sign in <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
        <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-[hsl(var(--muted-foreground))]">
          <LockKeyhole className="h-3.5 w-3.5" /> Encrypted and private
        </div>
      </form>
      <p className="mt-9 text-center text-sm text-[hsl(var(--muted-foreground))]">
        New to Dayflow?{' '}
        <Link href="/register" className="font-semibold text-[hsl(var(--primary))] underline decoration-[hsl(var(--accent))] decoration-2 underline-offset-4">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
