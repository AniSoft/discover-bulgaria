CREATE TABLE public.place_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  place_id uuid NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  storage_path text NOT NULL UNIQUE,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_cover boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX place_photos_place_id_idx ON public.place_photos (place_id, sort_order, created_at);
CREATE UNIQUE INDEX place_photos_one_cover_idx ON public.place_photos (place_id) WHERE is_cover;

GRANT SELECT ON public.place_photos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.place_photos TO authenticated;
GRANT ALL ON public.place_photos TO service_role;

ALTER TABLE public.place_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read photos of published places"
  ON public.place_photos FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.places p WHERE p.id = place_id AND p.status = 'published'));

CREATE POLICY "Owners can read photos of their places"
  ON public.place_photos FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.places p WHERE p.id = place_id AND p.owner_id = auth.uid()));

CREATE POLICY "Owners can add photos to their places"
  ON public.place_photos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.places p WHERE p.id = place_id AND p.owner_id = auth.uid()));

CREATE POLICY "Owners can update photos of their places"
  ON public.place_photos FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.places p WHERE p.id = place_id AND p.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.places p WHERE p.id = place_id AND p.owner_id = auth.uid()));

CREATE POLICY "Owners can delete photos of their places"
  ON public.place_photos FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.places p WHERE p.id = place_id AND p.owner_id = auth.uid()));

CREATE POLICY "Admins can read all place photos"
  ON public.place_photos FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert any place photo"
  ON public.place_photos FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update any place photo"
  ON public.place_photos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete any place photo"
  ON public.place_photos FOR DELETE TO authenticated USING (public.is_admin());

-- Exactly one cover photo per place, maintained by the database itself.
CREATE OR REPLACE FUNCTION public.place_photos_single_cover()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_cover THEN
    UPDATE public.place_photos
       SET is_cover = false
     WHERE place_id = NEW.place_id
       AND id <> NEW.id
       AND is_cover;
  ELSIF NOT EXISTS (
    SELECT 1 FROM public.place_photos
     WHERE place_id = NEW.place_id AND id <> NEW.id AND is_cover
  ) THEN
    NEW.is_cover := true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.place_photos_promote_cover()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.is_cover THEN
    UPDATE public.place_photos
       SET is_cover = true
     WHERE id = (
       SELECT id FROM public.place_photos
        WHERE place_id = OLD.place_id
        ORDER BY sort_order, created_at
        LIMIT 1
     );
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER place_photos_single_cover
  BEFORE INSERT OR UPDATE OF is_cover ON public.place_photos
  FOR EACH ROW EXECUTE FUNCTION public.place_photos_single_cover();

CREATE TRIGGER place_photos_promote_cover
  AFTER DELETE ON public.place_photos
  FOR EACH ROW EXECUTE FUNCTION public.place_photos_promote_cover();

-- Storage object paths look like: places/<place_id>/<file>
CREATE OR REPLACE FUNCTION public.place_id_from_object_name(object_name text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  candidate text := split_part(object_name, '/', 2);
BEGIN
  RETURN candidate::uuid;
EXCEPTION WHEN others THEN
  RETURN NULL;
END;
$$;

CREATE POLICY "Place images of published places are readable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'place-images'
    AND EXISTS (
      SELECT 1 FROM public.places p
       WHERE p.id = public.place_id_from_object_name(name) AND p.status = 'published'
    )
  );

CREATE POLICY "Owners can read their place images"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'place-images'
    AND EXISTS (
      SELECT 1 FROM public.places p
       WHERE p.id = public.place_id_from_object_name(name) AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can upload their place images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'place-images'
    AND EXISTS (
      SELECT 1 FROM public.places p
       WHERE p.id = public.place_id_from_object_name(name) AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update their place images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'place-images'
    AND EXISTS (
      SELECT 1 FROM public.places p
       WHERE p.id = public.place_id_from_object_name(name) AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete their place images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'place-images'
    AND EXISTS (
      SELECT 1 FROM public.places p
       WHERE p.id = public.place_id_from_object_name(name) AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all place images"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'place-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'place-images' AND public.is_admin());