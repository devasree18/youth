import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../api/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
  tenantId?: string;
  institutionId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  signupWithEmail: (name: string, email: string, pass: string, role?: string) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    apiClient.post('/auth/logout').catch(() => {});
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await apiClient.get<User>('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const signupWithEmail = async (name: string, email: string, pass: string, role?: string) => {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/register', {
      name,
      email,
      password: pass,
      role
    });

    if (res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/login', {
      email,
      password: pass
    });

    if (res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, signupWithEmail, loginWithEmail, token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
