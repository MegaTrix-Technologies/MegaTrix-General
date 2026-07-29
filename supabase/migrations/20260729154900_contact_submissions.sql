CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert contact_submissions" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read contact_submissions" ON public.contact_submissions FOR SELECT USING (true);
CREATE POLICY "Public update contact_submissions" ON public.contact_submissions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete contact_submissions" ON public.contact_submissions FOR DELETE USING (true);
