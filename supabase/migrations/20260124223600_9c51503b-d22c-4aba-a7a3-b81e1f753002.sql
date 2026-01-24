-- Criar tabela de associação many-to-many entre usuários e candidatos
CREATE TABLE public.user_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, candidate_id)
);

-- Habilitar RLS
ALTER TABLE public.user_candidates ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver suas próprias associações
CREATE POLICY "Users can view their own candidate associations"
ON public.user_candidates
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política: Admins podem ver todas as associações
CREATE POLICY "Admins can view all candidate associations"
ON public.user_candidates
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Política: Admins podem inserir associações
CREATE POLICY "Admins can insert candidate associations"
ON public.user_candidates
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Política: Admins podem atualizar associações
CREATE POLICY "Admins can update candidate associations"
ON public.user_candidates
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Política: Admins podem deletar associações
CREATE POLICY "Admins can delete candidate associations"
ON public.user_candidates
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Função para obter candidatos disponíveis para um usuário
CREATE OR REPLACE FUNCTION public.get_user_available_candidates(_user_id UUID)
RETURNS TABLE (
  candidate_id UUID,
  candidate_name TEXT,
  candidate_party TEXT,
  candidate_position TEXT,
  is_default BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id as candidate_id,
    c.name as candidate_name,
    c.party as candidate_party,
    c.position as candidate_position,
    COALESCE(uc.is_default, false) as is_default
  FROM public.user_candidates uc
  INNER JOIN public.candidates c ON c.id = uc.candidate_id
  WHERE uc.user_id = _user_id
  ORDER BY uc.is_default DESC, c.name ASC
$$;

-- Índice para performance
CREATE INDEX idx_user_candidates_user_id ON public.user_candidates(user_id);
CREATE INDEX idx_user_candidates_candidate_id ON public.user_candidates(candidate_id);