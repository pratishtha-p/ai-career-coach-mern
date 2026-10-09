import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('cc_token'));

  useEffect(() => {
    if (!loading) return;
    api.me().then(setUser).catch(() => localStorage.removeItem('cc_token')).finally(() => setLoading(false));
  }, []);

  const finish = ({ token, user }) => { localStorage.setItem('cc_token', token); setUser(user); };
  const login = async (b) => finish(await api.login(b));
  const register = async (b) => finish(await api.register(b));
  const logout = () => { localStorage.removeItem('cc_token'); setUser(null); };

  return <Ctx.Provider value={{ user, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
