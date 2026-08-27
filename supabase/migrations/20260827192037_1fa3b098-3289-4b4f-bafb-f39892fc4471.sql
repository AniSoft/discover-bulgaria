ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS title_bg text,
  ADD COLUMN IF NOT EXISTS short_description_bg text,
  ADD COLUMN IF NOT EXISTS description_bg text,
  ADD COLUMN IF NOT EXISTS why_visit_bg text,
  ADD COLUMN IF NOT EXISTS city_bg text,
  ADD COLUMN IF NOT EXISTS best_time_bg text,
  ADD COLUMN IF NOT EXISTS duration_bg text,
  ADD COLUMN IF NOT EXISTS location_text_bg text,
  ADD COLUMN IF NOT EXISTS local_secret_bg text;