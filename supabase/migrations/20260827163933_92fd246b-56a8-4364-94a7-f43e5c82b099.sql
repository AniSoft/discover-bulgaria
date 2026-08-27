CREATE OR REPLACE FUNCTION public.enforce_place_review_on_edit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Owners can never change ownership.
  NEW.owner_id := OLD.owner_id;
  -- Any edit by a normal user sends the place back for administrator review.
  NEW.status := 'for_review';
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_place_review_on_edit ON public.places;
CREATE TRIGGER enforce_place_review_on_edit
BEFORE UPDATE ON public.places
FOR EACH ROW EXECUTE FUNCTION public.enforce_place_review_on_edit();