/* eslint-disable react-hooks/exhaustive-deps, react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const AttendanceContext = createContext(null);
const API_URL = '/api/attendance';

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, options);
  if (!response.ok) throw new Error((await response.text()) || 'Attendance request failed.');
  return response.json();
}

export function AttendanceProvider({ children }) {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      setLoading(true);
      setError('');
      setToday(await request(`/today?employeeId=${user.id}`));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(timer);
  }, [user.id]);

  async function updateAttendance(action) {
    try {
      setLoading(true);
      setError('');
      setToday(await request(`/${action}?employeeId=${user.id}`, { method: 'POST' }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(() => ({
    today,
    loading,
    error,
    refresh,
    checkIn: () => updateAttendance('check-in'),
    checkOut: () => updateAttendance('check-out'),
  }), [today, loading, error]);

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}

export function useAttendance() {
  const value = useContext(AttendanceContext);
  if (!value) throw new Error('useAttendance must be used within an AttendanceProvider');
  return value;
}
