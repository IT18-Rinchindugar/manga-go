import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from './api';
import type { User } from '@shared/schema';

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await api.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.login({ username, password });
    setUser(response.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await api.register({ username, email, password });
    setUser(response.user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, refetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
