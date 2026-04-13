import { createContext, useContext, useMemo, useState } from 'react';
import { adminCredentials } from '../constants/products';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState({
    isAuthenticated: false,
    isAdmin: false,
    userName: '',
    email: '',
    password: '',
  });

  const login = ({ email, password }) => {
    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedPassword = String(password);
    const isAdmin =
      normalizedEmail === adminCredentials.email && normalizedPassword === adminCredentials.password;

    const isTryingAdminEmail = normalizedEmail === adminCredentials.email;

    const hasValidCustomerLogin = normalizedEmail.length > 0 && normalizedPassword.length > 0;

    if (isTryingAdminEmail && !isAdmin) {
      return { ok: false, error: 'Senha de admin incorreta.' };
    }

    if (!isAdmin && !hasValidCustomerLogin) {
      return { ok: false, error: 'Preencha email e senha para continuar.' };
    }

    const userName = normalizedEmail.includes('@')
      ? normalizedEmail.split('@')[0]
      : normalizedEmail || 'cliente';

    setSession({
      isAuthenticated: true,
      isAdmin,
      userName: userName.charAt(0).toUpperCase() + userName.slice(1),
      email: normalizedEmail,
      password: normalizedPassword,
    });

    return { ok: true, isAdmin };
  };

  const logout = () => {
    setSession({
      isAuthenticated: false,
      isAdmin: false,
      userName: '',
      email: '',
      password: '',
    });
  };

  const updateProfile = ({ userName, email, password }) => {
    const nextName = String(userName).trim();
    const nextEmail = String(email).trim().toLowerCase();
    const nextPassword = String(password ?? session.password).trim();

    if (!nextName) {
      return { ok: false, error: 'Informe seu nome para atualizar o perfil.' };
    }

    if (!nextEmail || !nextEmail.includes('@')) {
      return { ok: false, error: 'Informe um email valido para continuar.' };
    }

    if (!nextPassword || nextPassword.length < 4) {
      return { ok: false, error: 'A senha precisa ter pelo menos 4 caracteres.' };
    }

    if (session.isAdmin && nextEmail !== adminCredentials.email) {
      return { ok: false, error: 'O email do admin nao pode ser alterado por aqui.' };
    }

    setSession((current) => ({
      ...current,
      userName: nextName,
      email: nextEmail,
      password: nextPassword,
    }));

    return { ok: true };
  };

  const value = useMemo(
    () => ({
      ...session,
      login,
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
