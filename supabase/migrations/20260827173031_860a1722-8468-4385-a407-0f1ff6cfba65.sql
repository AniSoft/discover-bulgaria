CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, place_id)
);

CREATE INDEX favorites_user_created_idx ON public.favorites (user_id, created_at DESC);

GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own favorites"
  ON public.favorites FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites for published places"
  ON public.favorites FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.places p
      WHERE p.id = place_id AND p.status = 'published'
    )
  );

CREATE POLICY "Users can remove their own favorites"
  ON public.favorites FOR DELETE TO authenticated
  USING (user_id = auth.uid());
