import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type ProfileType = Database['public']['Enums']['profile_type'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  profileType: ProfileType | null;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ user: User | null }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<ProfileType | null>(null);

  const fetchProfileType = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('profile_type').eq('user_id', userId).single();
    setProfileType(data?.profile_type ?? null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        setTimeout(() => fetchProfileType(session.user.id), 0);
      } else {
        setProfileType(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) fetchProfileType(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    <AuthContext.Provider value={{ user, session, loading, profileType, signUp, signIn, signOut, getRedirectPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
