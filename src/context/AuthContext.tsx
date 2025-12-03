import React, { createContext, useContext, useEffect, useState } from 'react';
import type { DemoUser, UserMode, UserRole } from '../authConfig';
import { DEMO_USERS } from '../authConfig';

interface AuthState {
  user: DemoUser | null;
  mode: UserMode | null;
  role: UserRole | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('edulytics_auth');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (!found) return false;

    setUser(found);
    localStorage.setItem('edulytics_auth', JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edulytics_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        mode: user?.mode ?? null,
        role: user?.role ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
};
