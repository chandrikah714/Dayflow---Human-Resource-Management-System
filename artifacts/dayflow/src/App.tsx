import { useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setAuthTokenGetter } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { LoginPage, RegisterPage } from '@/pages/auth';
import { ProfilePage } from '@/pages/profile';
import { getToken } from '@/lib/auth';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
setAuthTokenGetter(() => getToken());

function Home() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(getToken() ? '/profile' : '/login');
  }, [setLocation]);
  return <div className="min-h-[100dvh] bg-[hsl(var(--background))]" aria-label="Loading Dayflow" />;
}

function ProtectedProfile() {
  const [, setLocation] = useLocation();
  const token = getToken();
  useEffect(() => {
    if (!token) setLocation('/login');
  }, [setLocation, token]);
  if (!token) return <div className="min-h-[100dvh] bg-[hsl(var(--background))]" />;
  return <ProfilePage />;
}

function GuestPage({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  const token = getToken();
  useEffect(() => {
    if (token) setLocation('/profile');
  }, [setLocation, token]);
  if (token) return <div className="min-h-[100dvh] bg-[hsl(var(--background))]" />;
  return children;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
          <Route path="/login">
            <GuestPage><LoginPage /></GuestPage>
          </Route>
          <Route path="/register">
            <GuestPage><RegisterPage /></GuestPage>
          </Route>
          <Route path="/profile" component={ProtectedProfile} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
