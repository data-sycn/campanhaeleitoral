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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [profileLoading, setProfileLoading] = useState(false);
  const { toast } = useToast();

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

      if (data?.candidate_id) {
        const { data: candidateData, error: candidateError } = await supabase
          .from('candidates')
          .select('id, name, party, position')
          .eq('id', data.candidate_id)
          .single();

        if (!candidateError && candidateData) {
          setSelectedCandidate(candidateData);
        } else {
          setSelectedCandidate(null);
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

  useEffect(() => {
    // Setup auth state listener FIRST (sync callback to avoid deadlock)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Defer Supabase calls with setTimeout to avoid deadlock
          setTimeout(() => {
            Promise.all([
              fetchProfile(currentUser.id),
              fetchUserRoles(currentUser.id)
            ]).finally(() => setLoading(false));
          }, 0);
        } else {
          setProfile(null);
          setUserRoles([]);
          setSelectedCandidate(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        Promise.all([
          fetchProfile(currentUser.id),
          fetchUserRoles(currentUser.id)
        ]).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) {
      toast({ title: "Erro no cadastro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Conta criada!", description: "Verifique seu email para confirmar sua conta." });
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erro no login", description: "E-mail ou senha incorretos.", variant: "destructive" });
    }
    return { error };
  };

  const signOut = async () => {
    if (user) {
      // Limpa o candidato no banco ao sair para forçar nova seleção no próximo login
      await supabase
        .from('profiles')
        .update({ candidate_id: null })
        .eq('id', user.id);
    }
    await supabase.auth.signOut();
    setSelectedCandidate(null);
    setProfile(null);
    setUserRoles([]);
  };

  const selectCandidate = async (candidateId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ candidate_id: candidateId })
      .eq('id', user.id);

    if (error) throw error;
    await fetchProfile(user.id);
  };

  const clearCandidateSelection = async () => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ candidate_id: null })
      .eq('id', user.id);

    if (error) throw error;
    setSelectedCandidate(null);
    setProfile(prev => prev ? { ...prev, candidate_id: null } : null);
  };

  // Master é o super usuário que passa direto
  const isMaster = userRoles.includes('master');
  // Admin inclui tanto 'admin' quanto 'master' para permissões administrativas
  const isAdmin = userRoles.includes('admin') || isMaster;
  
  // Apenas MASTER passa direto; outros precisam selecionar candidato se não tiverem candidate_id
  const needsCandidateSelection = 
    !!user && 
    !loading && 
    !profileLoading && 
    !isMaster && 
    !profile?.candidate_id;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      userRoles,
      loading: loading || profileLoading,
      isAdmin,
      selectedCandidate,
      needsCandidateSelection,
      signUp,
      signIn,
      signOut,
      refetchRoles: () => user ? fetchUserRoles(user.id) : Promise.resolve(),
      selectCandidate,
      clearCandidateSelection,
      refetchProfile: () => user ? fetchProfile(user.id) : Promise.resolve(),
    }}>
      {children}
    </AuthContext.Provider>
  );
};