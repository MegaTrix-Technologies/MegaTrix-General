-- Seed projects extracted from C:\Users\hashi\My-Portfolio into public.projects table

INSERT INTO public.projects (id, title, description, tools, image_url, project_link, github_link, deployed_on, created_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'AsanShipping.com',
    'An advanced fulfillment platform built for Pakistani e-commerce merchants to automate courier selection, prevent Cash-on-Delivery fraud via IVR verification calls, and streamline reverse logistics scrap ledgers.',
    ARRAY['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Python'],
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200',
    'https://asanshipping.com',
    'https://github.com/HashirFarooq0023',
    'AWS & Vercel',
    NOW() - INTERVAL '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Talent Vector (HR-Helper)',
    'A production-grade system that automates top-of-funnel corporate recruitment using Multinomial Naive Bayes classification, TF-IDF vector corpus weighting, and custom Levenshtein distance string optimization with sub-3ms match speed.',
    ARRAY['Python', 'FastAPI', 'Scikit-Learn', 'React', 'TailwindCSS', 'MongoDB'],
    'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200',
    'https://talentvector-xi.vercel.app/',
    'https://github.com/HashirFarooq0023/Talentvector',
    'Vercel & Render',
    NOW() - INTERVAL '2 days'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'PSX Quantitative & AI Oracle',
    'A sophisticated data analytics engine that ingests historical Pakistan Stock Exchange equities data, computes statistical tendencies, beta indicators, and Ordinary Least Squares (OLS) linear regressions.',
    ARRAY['Python', 'FastAPI', 'NumPy', 'Pandas', 'Statsmodels', 'React'],
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200',
    'https://prob-project.vercel.app/',
    'https://github.com/HashirFarooq0023',
    'Vercel',
    NOW() - INTERVAL '1 day'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Aesthetic MERN E-Commerce (TrendsStore)',
    'A sleek, high-performance e-commerce platform featuring an aesthetic theme layout, real-time cart management, multi-address checkout logic, dynamic product filters, and a secure role-based admin inventory portal.',
    ARRAY['Next.js', 'React', 'Node.js', 'Express.js', 'MongoDB', 'TailwindCSS'],
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200',
    'https://www.trendsstorepk.com/',
    'https://github.com/HashirFarooq0023/E-com-Theme-2',
    'Vercel & Render',
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  tools = EXCLUDED.tools,
  image_url = EXCLUDED.image_url,
  project_link = EXCLUDED.project_link,
  github_link = EXCLUDED.github_link,
  deployed_on = EXCLUDED.deployed_on;
