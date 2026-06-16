'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  phone: string;
  name: string | null;
  email: string | null;
  is_admin: boolean;
}

interface SimpleUser {
  phone: string;
  uid: string;
}

interface AuthContextType {
  user: SimpleUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  token: string | null;
  sendOtp: (phone: string) => Promise<{ token: string; smsFailed: boolean; error?: string }>;
  verifyOtp: (otpToken: string, otp: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const TOKEN_KEY = 'lohagarh_auth_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchProfile = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json() as { user: UserProfile };
        setUserProfile(data.user);
        setUser({ phone: data.user.phone, uid: data.user.firebase_uid });
      } else {
        // Token invalid/expired — clear session
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
        setUserProfile(null);
      }
    } catch {
      // Network error — keep existing state
    }
  };

  const refreshProfile = async () => {
    if (token) await fetchProfile(token);
  };

  useEffect(() => {
    if (typeof window === 'undefined') { setLoading(false); return; }
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      fetchProfile(stored).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendOtp = async (phone: string): Promise<{ token: string; smsFailed: boolean; error?: string }> => {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json() as {
      otp_token?: string;
      error?: string;
      dev_otp?: string;
      sms_failed?: boolean;
    };

    if (!data.otp_token) throw new Error(data.error || 'Failed to generate OTP');

    if (data.dev_otp) console.log(`[Dev OTP] ${data.dev_otp}`);

    return {
      token: data.otp_token,
      smsFailed: !!data.sms_failed,
      error: data.error,
    };
  };

  const verifyOtp = async (otpToken: string, otp: string, phone: string): Promise<void> => {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp, otp_token: otpToken }),
    });
    const data = await res.json() as { token?: string; user?: UserProfile; error?: string };
    if (!res.ok) throw new Error(data.error || 'Invalid OTP');

    localStorage.setItem(TOKEN_KEY, data.token!);
    setToken(data.token!);
    setUserProfile(data.user!);
    setUser({ phone: data.user!.phone, uid: data.user!.firebase_uid });
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user, userProfile, loading, token,
      sendOtp, verifyOtp, logout, refreshProfile,
      isAdmin: userProfile?.is_admin ?? false,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
