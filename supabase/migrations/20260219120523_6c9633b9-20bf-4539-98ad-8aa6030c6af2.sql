
-- 1. Add photo_url column to street_checkins
ALTER TABLE public.street_checkins ADD COLUMN photo_url TEXT;

-- 2. Create checkin-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('checkin-photos', 'checkin-photos', true);

-- Storage RLS: authenticated users can upload
CREATE POLICY "Authenticated users can upload checkin photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'checkin-photos');

-- Storage RLS: anyone can read
CREATE POLICY "Anyone can view checkin photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'checkin-photos');

-- Storage RLS: users can delete own uploads
CREATE POLICY "Users can delete own checkin photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'checkin-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Create invite_links table
CREATE TABLE public.invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID NOT NULL REFERENCES public.campanhas(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  expires_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  used_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;

-- Coordinators/admins can create invite links for their campaign
CREATE POLICY "Coordinators can create invite links"
ON public.invite_links FOR INSERT TO authenticated
WITH CHECK (
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'coordinator'::app_role) OR is_master(auth.uid()))
  AND (campanha_id IN (SELECT profiles.campanha_id FROM profiles WHERE profiles.id = auth.uid()) OR is_master(auth.uid()))
  AND created_by = auth.uid()
);

-- Users can view invite links for their campaign
CREATE POLICY "Users can view campaign invite links"
ON public.invite_links FOR SELECT TO authenticated
USING (
  campanha_id IN (SELECT profiles.campanha_id FROM profiles WHERE profiles.id = auth.uid())
  OR is_master(auth.uid())
);

-- Allow anon to read invite links by token (for public registration page)
CREATE POLICY "Anon can read invite by token"
ON public.invite_links FOR SELECT TO anon
USING (used_at IS NULL AND (expires_at IS NULL OR expires_at > now()));

-- Allow RLS policies for votes_agg insert/update (needed for CSV import recalculation)
CREATE POLICY "Admins can insert votes_agg"
ON public.votes_agg FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR (candidate_id = get_user_candidate_id(auth.uid())));

CREATE POLICY "Admins can update votes_agg"
ON public.votes_agg FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR (candidate_id = get_user_candidate_id(auth.uid())));
