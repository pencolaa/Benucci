import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

const emptySession = {
  id: null,
  isAuthenticated: false,
  isAdmin: false,
  userName: '',
  email: '',
  password: '',
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(emptySession);

  const login = async ({ email, password }) => {
    try {
      const data = await api.login({ email, password });
      setSession({
        id: data.user.id,
        isAuthenticated: true,
        isAdmin: data.user.isAdmin,
        userName: data.user.userName,
        email: data.user.email,
        password: data.user.password,
      });
      return { ok: true, isAdmin: data.user.isAdmin };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const register = async ({ userName, email, password }) => {
    try {
      const data = await api.register({ userName, email, password });
      setSession({
        id: data.user.id,
        isAuthenticated: true,
        isAdmin: data.user.isAdmin,
        userName: data.user.userName,
        email: data.user.email,
        password: data.user.password,
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const logout = () => {
    setSession(emptySession);
  };

  const updateProfile = async ({ userName, email, password }) => {
    if (!session.id) {
      return { ok: false, error: 'Faca login para atualizar o perfil.' };
    }

    try {
      const data = await api.updateProfile(session.id, { userName, email, password });
      setSession((current) => ({
        ...current,
        userName: data.user.userName,
        email: data.user.email,
        password: data.user.password,
      }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  };

  const value = useMemo(
    () => ({
      ...session,
      login,
      register,
      logout,
      updateProfile,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return value;
}
