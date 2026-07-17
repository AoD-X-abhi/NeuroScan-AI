import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../utils/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await apiFetch<User>('/api/auth/me');
      setUser(data);
    } catch (e: any) {
      console.error('Session validation failed:', e);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiFetch<{ access_token: string }>('/api/auth/login', {
        json: { email, password },
        method: 'POST'
      });
      localStorage.setItem('token', res.access_token);
      await fetchCurrentUser();
    } catch (e: any) {
      setError(e.message || 'Login failed');
      setIsLoading(false);
      throw e;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiFetch<User>('/api/auth/register', {
        json: { email, password, full_name: fullName },
        method: 'POST'
      });
      await login(email, password);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      setIsLoading(false);
      throw e;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
