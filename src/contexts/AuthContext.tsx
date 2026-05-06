'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/lib/firestore-schema';
import { DEMO_USER } from '@/lib/demo-data';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, isDemo: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  updateProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  useEffect(() => {
    if (isDemo) {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('nutrisense_user') : null;
      if (saved) {
        setUser(JSON.parse(saved));
      }
      setLoading(false);
      return;
    }
    // Firebase auth listener would go here when configured
    setLoading(false);
  }, [isDemo]);

  const signInWithGoogle = async () => {
    if (isDemo) {
      setUser(DEMO_USER);
      localStorage.setItem('nutrisense_user', JSON.stringify(DEMO_USER));
      return;
    }
    try {
      const { auth, googleProvider } = await import('@/lib/firebase');
      const { signInWithPopup } = await import('firebase/auth');
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      const profile: UserProfile = {
        uid: u.uid, email: u.email || '', displayName: u.displayName || 'User',
        photoURL: u.photoURL, healthGoal: 'general_wellness', dietaryRestrictions: [],
        allergies: [], preferredLanguage: 'en', targetCalories: 2000,
        targetProtein: 150, targetCarbs: 200, targetFat: 67,
        height: 170, weight: 70, age: 25, gender: 'other',
        activityLevel: 'moderately_active',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      setUser(profile);
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  const handleSignOut = async () => {
    if (isDemo) {
      setUser(null);
      localStorage.removeItem('nutrisense_user');
      return;
    }
    try {
      const { auth } = await import('@/lib/firebase');
      const { signOut: fbSignOut } = await import('firebase/auth');
      await fbSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates, updatedAt: new Date().toISOString() };
    setUser(updated);
    if (isDemo) localStorage.setItem('nutrisense_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, isDemo, signInWithGoogle, signOut: handleSignOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
