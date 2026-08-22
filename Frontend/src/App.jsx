import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Attendance from './attendance/Attendance';
import { AttendanceProvider } from './attendance/AttendanceContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './pages/Login/Login';
import Employees from './pages/Employees/Employees';
import TimeOff from './pages/TimeOff/TimeOff';
import Payroll from './pages/Payroll/Payroll';
import AdminLeaves from './pages/AdminLeaves/AdminLeaves';

function Application() {
  const { user, loading } = useAuth();
  if (loading) return <main className="dashboard">Loading…</main>;
  if (!user) return <Login />;
  return <AttendanceProvider><BrowserRouter><Routes><Route element={<Layout />}><Route path="/" element={<Dashboard />} /><Route path="/attendance" element={<Attendance />} /><Route path="/employees" element={<Employees />} /><Route path="/time-off" element={<TimeOff />} /><Route path="/payroll" element={<Payroll />} /><Route path="/admin/leaves" element={<AdminLeaves />} /></Route></Routes></BrowserRouter></AttendanceProvider>;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider><Application /></AuthProvider>
    </ThemeProvider>
  );
}

export default App;
