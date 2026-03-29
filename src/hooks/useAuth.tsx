import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type ProfileType = Database['public']['Enums']['profile_type'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileLoading: boolean;
  profileType: ProfileType | null;
  profileError: string | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ user: User | null }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getRedirectPath: () => string;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchProfileType = useCallback(async (userId: string) => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('profile_type')
        .eq('user_id', userId)
        .maybeSingle();
      if (error) throw error;
      setProfileType(data?.profile_type ?? null);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setProfileError(err.message || 'Erro ao carregar perfil');
      setProfileType(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfileType(user.id);
  }, [user, fetchProfileType]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => fetchProfileType(session.user.id), 0);
      } else {
        setProfileType(null);
        setProfileLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchProfileType(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfileType]);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return { user: data.user };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfileType(null);
    setProfileError(null);
  };

  const getRedirectPath = (): string => {
    switch (profileType) {
      case 'freelancer': return '/projects';
      case 'empregador': return '/dashboard';
      case 'voluntario': return '/projects';
      case 'ong': return '/dashboard';
      default: return '/dashboard';
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, profileLoading, profileType, profileError, signUp, signIn, signOut, getRedirectPath, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
