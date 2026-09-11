import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiClient, ApiError } from '../api/apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  permissions?: string[];
  tenantId?: string;
  institutionId?: string;
  accountStatus?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  signupWithEmail: (name: string, email: string, pass: string, role?: string) => Promise<User>;
  loginWithEmail: (email: string, pass: string) => Promise<User>;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
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
        } catch (err: any) {
          // Invalidate session ONLY if server explicitly rejected the token (401 / 403)
          if (err instanceof ApiError && (err.status === 401 || err.status === 403 || err.code === 'TOKEN_EXPIRED')) {
            logout();
          } else {
            // Keep existing cached session for offline / temporary network blips
            console.warn('Auth session verification skipped due to network/server state:', err.message);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [logout]);

  const signupWithEmail = async (name: string, email: string, pass: string, role?: string): Promise<User> => {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/register', {
      name: name.trim(),
      email: email.trim(),
      password: pass,
      role
    });

    if (!res.data?.user || !res.data?.token) {
      throw new Error('Invalid response from server during registration.');
    }

    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const loginWithEmail = async (email: string, pass: string): Promise<User> => {
    const res = await apiClient.post<{ token: string; user: User }>('/auth/login', {
      email: email.trim(),
      password: pass
    });

    if (!res.data?.user || !res.data?.token) {
      throw new Error('Invalid response from server during login.');
    }

    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, signupWithEmail, loginWithEmail, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
