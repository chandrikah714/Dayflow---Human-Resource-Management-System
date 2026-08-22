/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const AuthContext = createContext(null);
async function api(path, options) { const response = await fetch(`/api/auth${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options }); if (!response.ok) throw new Error((await response.text()) || 'Request failed.'); return response.status === 204 ? null : response.json(); }
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { void api('/me').then(setUser).catch(() => setUser(null)).finally(() => setLoading(false)); }, []);
  const value = useMemo(() => ({ user, loading, login: async (email, password) => { const next = await api('/login', { method: 'POST', body: JSON.stringify({ email, password }) }); setUser(next); }, register: async (fullName, email, password) => { const next = await api('/register', { method: 'POST', body: JSON.stringify({ fullName, email, password }) }); setUser(next); }, logout: async () => { await api('/logout', { method: 'POST' }); setUser(null); } }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used within AuthProvider'); return value; };
