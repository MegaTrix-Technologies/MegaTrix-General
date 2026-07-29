
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tools TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  project_link TEXT,
  github_link TEXT,
  deployed_on TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public write access" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.projects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete access" ON public.projects FOR DELETE USING (true);
