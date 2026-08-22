import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import './TopNav.css';

const TABS = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/employees', label: 'Employees' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/time-off', label: 'Time off' },
  { to: '/payroll', label: 'Payroll' },
];

export default function TopNav({ currentUser, isCheckedIn, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the profile dropdown on outside click or Escape — a dropdown
  // that only closes on re-click of its own trigger traps keyboard users.
  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const initials = currentUser?.name
    ?.split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);

  return (
    <header className="top-nav">
      <div className="top-nav__inner">
        <div className="top-nav__brand">
          <span className="top-nav__logo" aria-hidden="true">
            D
          </span>
          <span className="top-nav__wordmark">Dayflow</span>
        </div>

        <nav className="top-nav__tabs" aria-label="Primary">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `top-nav__tab${isActive ? ' is-active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
          {currentUser?.role === 'ADMIN' && <NavLink to="/admin/leaves" className={({ isActive }) => `top-nav__tab${isActive ? ' is-active' : ''}`}>Approvals</NavLink>}
        </nav>

        <div className="top-nav__actions">
          <button
            type="button"
            className="top-nav__theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? '☾' : '☀'}
          </button>

          <div className="top-nav__profile" ref={menuRef}>
            <button
              type="button"
              className="top-nav__avatar-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="top-nav__avatar">{initials || '?'}</span>
              <span
                className={`top-nav__status-dot ${isCheckedIn ? 'is-in' : 'is-out'}`}
                title={isCheckedIn ? 'Checked in' : 'Not checked in'}
                aria-hidden="true"
              />
            </button>

            {menuOpen && (
              <div className="top-nav__menu" role="menu">
                <NavLink to="/attendance" role="menuitem" className="top-nav__menu-item" onClick={() => setMenuOpen(false)}>
                  View attendance
                </NavLink>
                <button type="button" role="menuitem" className="top-nav__menu-item" onClick={() => setMenuOpen(false)}>
                  Close menu
                </button>
                <button type="button" role="menuitem" className="top-nav__menu-item top-nav__menu-item--danger" onClick={onLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
