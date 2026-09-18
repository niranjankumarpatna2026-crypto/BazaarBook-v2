import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';

const AuthCtx = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bb_token'));
  const [user, setUser] = useState<any>(() => {
    try { const r = localStorage.getItem('bb_user'); return r ? JSON.parse(r) : null; }
    catch { return null; }
  });
  const [loading, setLoading] = useState(!!token);

  // 1. logout pehle
  const logout = useCallback(() => {
    localStorage.removeItem('bb_token');
    localStorage.removeItem('bb_user');
    setToken(null);
    setUser(null);
  }, []);

  // 2. login (ye missing tha!)
  const login = useCallback((t: string, u: any) => {
    localStorage.setItem('bb_token', t);
    localStorage.setItem('bb_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  // 3. updateUser
  const updateUser = useCallback((p: any) => {
    setUser((prev: any) => {
      if (!prev) return prev;
      const n = { ...prev, ...p };
      localStorage.setItem('bb_user', JSON.stringify(n));
      return n;
    });
  }, []);

  // 4. useEffect
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const d = await api.get<{ user: any }>('/api/auth/me');
        setUser(d.user);
        localStorage.setItem('bb_user', JSON.stringify(d.user));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, [token, logout]);

  return (
    <AuthCtx.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}