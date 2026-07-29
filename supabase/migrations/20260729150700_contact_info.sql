CREATE TABLE IF NOT EXISTS public.contact_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role;

ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read contact_info" ON public.contact_info FOR SELECT USING (true);
CREATE POLICY "Public insert contact_info" ON public.contact_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update contact_info" ON public.contact_info FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public delete contact_info" ON public.contact_info FOR DELETE USING (true);

-- Insert initial default contact details if table is empty
INSERT INTO public.contact_info (email, address, phone)
SELECT 'contact@megatrix.com', '100 Cybernetic Way, Suite 400, San Francisco, CA 94107', '+1 (800) 555-0199'
WHERE NOT EXISTS (SELECT 1 FROM public.contact_info);
