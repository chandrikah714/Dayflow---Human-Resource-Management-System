import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Attendance from '@/pages/Attendance';
import LeaveRequest from '@/pages/LeaveRequest';
import LeaveStatus from '@/pages/LeaveStatus';
import NotFound from '@/pages/NotFound';
import { getToken } from '@/lib/auth';

function ProtectedRoute({ children }) {
  return getToken() ? children : <Redirect to="/login" />;
}

function PublicRoute({ children }) {
  return getToken() ? <Redirect to="/profile" /> : children;
}

function Router() {
  return (
    <Switch>
      <Route path="/login">
        <PublicRoute><Login /></PublicRoute>
      </Route>
      <Route path="/register">
        <PublicRoute><Register /></PublicRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>
      <Route path="/attendance">
        <ProtectedRoute><Attendance /></ProtectedRoute>
      </Route>
      <Route path="/leave-request">
        <ProtectedRoute><LeaveRequest /></ProtectedRoute>
      </Route>
      <Route path="/leave-status">
        <ProtectedRoute><LeaveStatus /></ProtectedRoute>
      </Route>
      <Route path="/">
        <Redirect to={getToken() ? '/profile' : '/login'} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter>
      <Router />
    </WouterRouter>
  );
}

export default App;
