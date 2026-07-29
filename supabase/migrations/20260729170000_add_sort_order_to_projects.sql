-- Add sort_order column to public.projects table (default 0)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
