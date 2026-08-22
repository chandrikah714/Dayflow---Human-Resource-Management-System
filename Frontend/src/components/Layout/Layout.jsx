import { Outlet } from 'react-router-dom';
import TopNav from '../TopNav/TopNav';
import { useAttendance } from '../../attendance/AttendanceContext';
import { useAuth } from '../../auth/AuthContext';

export default function Layout() {
  const { today } = useAttendance();
  const { user, logout } = useAuth();
  return (
    <div className="app-shell">
      <TopNav currentUser={{ name: user.fullName, role: user.role }} isCheckedIn={Boolean(today?.checkIn && !today?.checkOut)} onLogout={logout} />
      <Outlet />
    </div>
  );
}
