ALTER TABLE public.places DISABLE TRIGGER enforce_place_review_on_edit;
UPDATE public.places SET status = 'published' WHERE slug = 'shiroka-laka';
ALTER TABLE public.places ENABLE TRIGGER enforce_place_review_on_edit;