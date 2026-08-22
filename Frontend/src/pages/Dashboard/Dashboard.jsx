import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChromaGrid from '../../components/ChromaGrid/ChromaGrid';
import CheckInPanel from '../../components/CheckInPanel/CheckInPanel';
import { mockEmployees } from '../../data/mockEmployees';
import './Dashboard.css';
import { useAttendance } from '../../attendance/AttendanceContext';
import { useAuth } from '../../auth/AuthContext';

function formatTime(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard() {
  const navigate = useNavigate();

  const { today, loading, error, checkIn, checkOut } = useAttendance();
  const { user } = useAuth();
  const isAdmin = user.role === 'ADMIN';
  const [team, setTeam] = useState([]); const [teamAttendance, setTeamAttendance] = useState([]); const [pendingLeaves, setPendingLeaves] = useState([]);
  useEffect(() => { if (!isAdmin) return; void Promise.all([fetch('/api/employees', { credentials: 'include' }).then((r) => r.json()), fetch('/api/attendance/all', { credentials: 'include' }).then((r) => r.json()), fetch('/api/admin/leaves', { credentials: 'include' }).then((r) => r.json())]).then(([people, records, leaves]) => { setTeam(people); setTeamAttendance(records); setPendingLeaves(leaves.filter((leave) => leave.status === 'PENDING')); }); }, [isAdmin]);

  const counts = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10); const today = teamAttendance.filter((record) => record.date === todayKey);
    if (isAdmin && team.length) return { present: today.filter((record) => record.status === 'PRESENT').length, leave: pendingLeaves.length, absent: Math.max(team.length - today.length, 0), team: team.length };
    return mockEmployees.reduce(
      (acc, e) => {
        acc[e.status] = (acc[e.status] ?? 0) + 1;
        return acc;
      },
      { present: 0, leave: 0, absent: 0, team: mockEmployees.length },
    );
  }, [isAdmin, team, teamAttendance, pendingLeaves]);

  const chromaItems = useMemo(
    () =>
      mockEmployees.map((e) => ({
        id: e.id,
        title: e.name,
        subtitle: e.role,
        handle: e.department,
        status: e.status,
        borderColor: e.borderColor,
        gradient: `linear-gradient(150deg, color-mix(in srgb, ${e.borderColor} 35%, var(--surface-raised)), var(--surface))`,
        image: e.avatar,
        // View-only profile per the wireframe note: cards open the
        // employee record in a non-editable view.
        onSelect: () => navigate(`/employees/${e.id}`),
      })),
    [navigate],
  );

  return (
    <main className="dashboard">
      <div className="dashboard__intro">
        <h1>Good to see you, {user.fullName.split(' ')[0]}</h1>
        <p>{isAdmin ? 'Your HR operations overview is ready.' : 'Here is your workday at a glance.'}</p>
      </div>

      <section className="dashboard__metrics" aria-label="Today's attendance summary">
        {isAdmin ? <><div className="metric-card metric-card--green"><span className="metric-card__label">Present</span><span className="metric-card__value metric-card__value--success">{counts.present}</span></div><div className="metric-card metric-card--amber"><span className="metric-card__label">Pending leave</span><span className="metric-card__value metric-card__value--warning">{counts.leave}</span></div><div className="metric-card metric-card--coral"><span className="metric-card__label">Absent</span><span className="metric-card__value metric-card__value--danger">{counts.absent}</span></div><div className="metric-card metric-card--violet"><span className="metric-card__label">Team size</span><span className="metric-card__value">{counts.team}</span></div></> : <><div className="metric-card"><span className="metric-card__label">Today</span><span className="metric-card__value">{today?.status || 'Not checked in'}</span></div><div className="metric-card"><span className="metric-card__label">Check in</span><span className="metric-card__value metric-card__value--success">{formatTime(today?.checkIn) || '--:--'}</span></div><div className="metric-card"><span className="metric-card__label">Check out</span><span className="metric-card__value">{formatTime(today?.checkOut) || '--:--'}</span></div></>}
      </section>

      <CheckInPanel
        checkInTime={formatTime(today?.checkIn)}
        checkOutTime={formatTime(today?.checkOut)}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
        loading={loading}
      />
      {error && <p role="alert">{error}</p>}

      {isAdmin && <section className="dashboard__charts"><div className="chart-card"><h2>Today&apos;s attendance</h2><div className="bar-chart"><span className="bar-chart__present" style={{ height: `${Math.max(18, counts.present / Math.max(counts.team, 1) * 100)}%` }}><b>Present</b></span><span className="bar-chart__pending" style={{ height: `${Math.max(18, counts.leave / Math.max(counts.team, 1) * 100)}%` }}><b>Pending</b></span><span className="bar-chart__absent" style={{ height: `${Math.max(18, counts.absent / Math.max(counts.team, 1) * 100)}%` }}><b>Absent</b></span></div></div><div className="chart-card"><h2>Pending approvals</h2>{pendingLeaves.length ? pendingLeaves.slice(0, 3).map((leave) => <button className="approval-item" key={leave.id} onClick={() => navigate('/admin/leaves')}>{team.find((person) => person.id === leave.employeeId)?.fullName || `Employee #${leave.employeeId}`}<span>{leave.leaveType} leave · {leave.startDate}</span></button>) : <p>All caught up - no approvals pending.</p>}<button className="glow-btn glow-btn--filled" onClick={() => navigate('/admin/leaves')}>Review approvals</button></div></section>}
      <section className="dashboard__team">
        <h2>Your team</h2>
        <ChromaGrid items={chromaItems} radius={280} damping={0.45} fadeOut={0.6} ease="power3.out" />
      </section>
    </main>
  );
}
