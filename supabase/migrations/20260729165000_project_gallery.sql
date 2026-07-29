-- Add gallery_images array column to public.projects table (max 10 images)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';
