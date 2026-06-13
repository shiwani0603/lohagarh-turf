'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User,
  signOut,
} from 'firebase/auth';
import { getSupabaseClient } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  phone: string;
  name: string | null;
  email: string | null;
  is_admin: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  token: string | null;
  sendOtp: (phone: string) => Promise<ConfirmationResult>;
  verifyOtp: (result: ConfirmationResult, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      setToken(idToken);
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.user);
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setUserProfile(null);
        setToken(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const sendOtp = async (phone: string): Promise<ConfirmationResult> => {
    if (!auth) throw new Error('Firebase is not configured. Please set up Firebase credentials.');
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
    return signInWithPhoneNumber(auth, phone, verifier);
  };

  const verifyOtp = async (result: ConfirmationResult, otp: string) => {
    const cred = await result.confirm(otp);
    if (cred.user) await fetchProfile(cred.user);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
    setToken(null);
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
