import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

interface Profile {
  id: string;
  name: string;
  candidate_id: string | null;
  created_at: string;
  updated_at: string;
}

interface SelectedCandidate {
  id: string;
  name: string;
  party: string | null;
  position: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRoles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  selectedCandidate: SelectedCandidate | null;
  needsCandidateSelection: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refetchRoles: () => Promise<void>;
  selectCandidate: (candidateId: string) => Promise<void>;
  clearCandidateSelection: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

// Master admin que não precisa selecionar candidato
const MASTER_ADMIN_EMAIL = "nailton.alsampaio@gmail.com";

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  userRoles: [],
  loading: true,
  isAdmin: false,
  selectedCandidate: null,
  needsCandidateSelection: false,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refetchRoles: async () => {},
  selectCandidate: async () => {},
  clearCandidateSelection: async () => {},
  refetchProfile: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<SelectedCandidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async (userId: string) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);

      // Se tem candidate_id, buscar dados do candidato
      if (data?.candidate_id) {
        const { data: candidateData } = await supabase
          .from('candidates')
          .select('id, name, party, position')
          .eq('id', data.candidate_id)
          .single();

        if (candidateData) {
          setSelectedCandidate(candidateData);
        }
      } else {
        setSelectedCandidate(null);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setProfile(null);
      setSelectedCandidate(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      setUserRoles(data?.map(r => r.role) || []);
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      setUserRoles([]);
    }
  };

  const refetchRoles = async () => {
    if (user) {
      await fetchUserRoles(user.id);
    }
  };

  const refetchProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const selectCandidate = useCallback(async (candidateId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ candidate_id: candidateId })
      .eq('id', user.id);

    if (error) throw error;

    // Buscar dados do candidato
    const { data: candidateData } = await supabase
      .from('candidates')
      .select('id, name, party, position')
      .eq('id', candidateId)
      .single();

    if (candidateData) {
      setSelectedCandidate(candidateData);
      setProfile(prev => prev ? { ...prev, candidate_id: candidateId } : null);
    }
  }, [user]);

  const clearCandidateSelection = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ candidate_id: null })
      .eq('id', user.id);

    if (error) throw error;

    setSelectedCandidate(null);
    setProfile(prev => prev ? { ...prev, candidate_id: null } : null);
  }, [user]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchUserRoles(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
          setSelectedCandidate(null);
          setProfileLoading(false);
        }

        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id);
        fetchUserRoles(session.user.id);
      } else {
        setProfile(null);
        setUserRoles([]);
        setSelectedCandidate(null);
        setProfileLoading(false);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Conta criada!",
        description: "Verifique seu email para confirmar sua conta."
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        title: "Erro no login",
        description: "E-mail ou senha incorretos.",
        variant: "destructive"
      });
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const isAdmin = userRoles.includes('admin');
  
  // Determinar se precisa selecionar candidato
  // Só avalia depois que o profile terminar de carregar
  const needsCandidateSelection = 
    user !== null && 
    !loading &&
    !profileLoading &&
    user.email !== MASTER_ADMIN_EMAIL && 
    !profile?.candidate_id;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      userRoles,
      loading: loading || profileLoading, // loading inclui profile
      isAdmin,
      selectedCandidate,
      needsCandidateSelection,
      signUp,
      signIn,
      signOut,
      refetchRoles,
      selectCandidate,
      clearCandidateSelection,
      refetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};