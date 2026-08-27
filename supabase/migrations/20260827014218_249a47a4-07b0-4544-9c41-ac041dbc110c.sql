CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(
    (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  )
$$;

CREATE TABLE public.places (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text NOT NULL,
  description text NOT NULL,
  why_visit text,
  region text NOT NULL,
  city text,
  location_text text,
  category text NOT NULL,
  suitable_for text[] NOT NULL DEFAULT '{}'::text[],
  best_time text,
  duration text,
  approximate_cost text,
  difficulty text,
  local_secret text,
  owner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'for_review',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT places_status_check CHECK (status IN ('for_review','published','rejected')),
  CONSTRAINT places_category_check CHECK (category IN ('Hidden Gems','Nature','Mountains','Sea','History & Culture','Best Views','Photo Spots','Food & Wine')),
  CONSTRAINT places_cost_check CHECK (approximate_cost IS NULL OR approximate_cost IN ('Free','€','€€','€€€')),
  CONSTRAINT places_difficulty_check CHECK (difficulty IS NULL OR difficulty IN ('Easy','Moderate','Challenging'))
);

CREATE INDEX places_status_idx ON public.places (status);
CREATE INDEX places_owner_id_idx ON public.places (owner_id);
CREATE INDEX places_category_idx ON public.places (category);

GRANT SELECT ON public.places TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.places TO authenticated;
GRANT ALL ON public.places TO service_role;

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published places"
ON public.places FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Users can read their own places"
ON public.places FOR SELECT TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Admins can read all places"
ON public.places FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "Users can insert their own places for review"
ON public.places FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid() AND status = 'for_review');

CREATE POLICY "Admins can insert any place"
ON public.places FOR INSERT TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Users can update their own non-published places"
ON public.places FOR UPDATE TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid() AND status <> 'published');

CREATE POLICY "Admins can update any place"
ON public.places FOR UPDATE TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Users can delete their own places"
ON public.places FOR DELETE TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Admins can delete any place"
ON public.places FOR DELETE TO authenticated
USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_places_updated_at
BEFORE UPDATE ON public.places
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();