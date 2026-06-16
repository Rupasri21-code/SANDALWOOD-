'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { setupAxiosInterceptors, setupFetchInterceptor } from './api';

type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'investor';
  phone?: string;
  avatar_url?: string;
};

// Mocking Supabase User/Session types to prevent breaking frontend components
type User = { id: string; email: string };
type Session = { access_token: string; user: User };

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null, role?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        const userData = data.data;
        const fakeUser = { id: userData.id, email: userData.email };
        setUser(fakeUser);
        setSession({ access_token: token, user: fakeUser });
        setProfile({
          id: userData.id,
          email: userData.email,
          full_name: userData.profile?.full_name || 'Admin',
          role: userData.role.toLowerCase() as 'admin' | 'investor',
          phone: userData.profile?.phone,
        });
      } else {
        throw new Error('Invalid token');
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
      signOut();
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem('token');
    if (token) await fetchProfile(token);
  };

  useEffect(() => {
    setupAxiosInterceptors(signOut);
    setupFetchInterceptor(signOut);

    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      
      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      const fakeUser = { id: data.data.user.id, email: data.data.user.email };
      setUser(fakeUser);
      setSession({ access_token: accessToken, user: fakeUser });
      setProfile({
        id: data.data.user.id,
        email: data.data.user.email,
        full_name: data.data.user.fullName,
        role: data.data.user.role.toLowerCase() as 'admin' | 'investor',
      });
      
      return { error: null, role: data.data.user.role.toLowerCase() };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error('Logout request failed:', err);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
