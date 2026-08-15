import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  image_url: string | null;
  gallery_images?: string[];
  project_link: string | null;
  github_link: string | null;
  deployed_on: string | null;
  created_at?: string;
  sort_order?: number;
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const SEED_PROJECTS: Project[] = [
  {
    id: "seed-1",
    title: "AsanShipping.com",
    description:
      "An advanced multi-tenant fulfillment & logistics SaaS platform built for Pakistani e-commerce merchants to automate courier selection, prevent Cash-on-Delivery fraud via IVR verification calls, and streamline reverse logistics scrap ledgers.\n\nKey architectural pillars include:\n• Automated multi-courier rate calculation and dynamic booking APIs\n• Automated IVR voice-call verification pipeline reducing return-to-origin (RTO) rates\n• Real-time parcel tracking webhooks and unified merchant ledger dashboard\n• High-throughput worker queues for bulk order processing",
    tools: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Python", "Redis", "AWS"],
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200",
    gallery_images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200",
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200",
      "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=1200",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200",
    ],
    project_link: "https://asanshipping.com",
    github_link: "https://github.com/HashirFarooq0023",
    deployed_on: "AWS & Vercel",
    sort_order: 0,
  },
  {
    id: "seed-2",
    title: "Talent Vector (HR-Helper)",
    description:
      "A production-grade system that automates top-of-funnel corporate recruitment using Multinomial Naive Bayes classification, TF-IDF vector corpus weighting, and custom Levenshtein distance string optimization with sub-3ms match speed.\n\nKey architectural pillars include:\n• NLP parser for unstructured PDF and DOCX candidate resumes\n• High-precision semantic cosine similarity matching against enterprise job requirements\n• Fast and reactive candidate scoring matrix with breakdown metrics\n• Asynchronous batch parsing pipeline with Dockerized FastAPI microservices",
    tools: ["Python", "FastAPI", "Scikit-Learn", "React", "TailwindCSS", "MongoDB", "Docker"],
    image_url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200",
    gallery_images: [
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200",
    ],
    project_link: "https://talentvector-xi.vercel.app/",
    github_link: "https://github.com/HashirFarooq0023/Talentvector",
    deployed_on: "Vercel & Render",
    sort_order: 1,
  },
  {
    id: "seed-3",
    title: "PSX Quantitative & AI Oracle",
    description:
      "A sophisticated data analytics engine that ingests historical Pakistan Stock Exchange equities data, computes statistical tendencies, beta indicators, and Ordinary Least Squares (OLS) linear regressions.\n\nKey architectural pillars include:\n• Automated EOD data scraping and time-series aggregation for PSX ticker symbols\n• Capital Asset Pricing Model (CAPM) and Sharpe ratio statistical calculations\n• High-frequency interactive charting and volatility indicators\n• Multi-variable regression modeling for sectoral trend forecasting",
    tools: ["Python", "FastAPI", "NumPy", "Pandas", "Statsmodels", "React", "Chart.js"],
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200",
    gallery_images: [
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200",
      "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200",
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200",
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200",
    ],
    project_link: "https://prob-project.vercel.app/",
    github_link: "https://github.com/HashirFarooq0023",
    deployed_on: "Vercel",
    sort_order: 2,
  },
  {
    id: "seed-4",
    title: "Aesthetic MERN E-Commerce (TrendsStore)",
    description:
      "A sleek, high-performance e-commerce platform featuring an aesthetic theme layout, real-time cart management, multi-address checkout logic, dynamic product filters, and a secure role-based admin inventory portal.\n\nKey architectural pillars include:\n• Server-side rendered product showcase with sub-second page transitions\n• Redux/Context state management for real-time shopping cart synchronization\n• Role-based access control (RBAC) admin dashboard for inventory and sales reports\n• Secure payment gateway integration and order invoice generator",
    tools: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "TailwindCSS", "Stripe"],
    image_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200",
    gallery_images: [
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=1200",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200",
    ],
    project_link: "https://www.trendsstorepk.com/",
    github_link: "https://github.com/HashirFarooq0023/E-com-Theme-2",
    deployed_on: "Vercel & Render",
    sort_order: 3,
  },
];

export const getLocalProjectsMap = (): Record<string, Project> => {
  if (typeof window === "undefined") return {};
  try {
    const cached = localStorage.getItem("megatrix_local_projects");
    if (cached) return JSON.parse(cached);
  } catch {}
  return {};
};

/**
 * Fetch a single project by ID, slug, or title with fallbacks across Supabase, LocalStorage, and SEED_PROJECTS.
 */
export const fetchProjectById = async (idOrSlug: string): Promise<Project | null> => {
  if (!idOrSlug) return null;

  const cleanIdentifier = decodeURIComponent(idOrSlug).trim();
  const slugTarget = slugify(cleanIdentifier);
  const localMap = getLocalProjectsMap();

  let target: Project | null = null;

  // 1. Check Supabase by exact ID
  try {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", cleanIdentifier)
      .maybeSingle();

    if (data) {
      target = data as Project;
    }
  } catch {}

  // 2. If not found by exact ID, search all Supabase projects by ID, slug, or title
  if (!target) {
    try {
      const { data: allData } = await supabase.from("projects").select("*");
      if (allData && allData.length > 0) {
        const match = (allData as Project[]).find(
          (p) =>
            p.id === cleanIdentifier ||
            slugify(p.title) === slugTarget ||
            p.title.toLowerCase() === cleanIdentifier.toLowerCase()
        );
        if (match) target = match;
      }
    } catch {}
  }

  // 3. Check LocalStorage projects
  const local =
    localMap[cleanIdentifier] ||
    Object.values(localMap).find(
      (p) =>
        p.id === cleanIdentifier ||
        slugify(p.title) === slugTarget ||
        p.title?.toLowerCase() === cleanIdentifier.toLowerCase()
    );

  // 4. Check SEED_PROJECTS
  let seedMatch: Project | null = null;
  seedMatch =
    SEED_PROJECTS.find(
      (p) =>
        p.id.toLowerCase() === cleanIdentifier.toLowerCase() ||
        slugify(p.title) === slugTarget ||
        p.title.toLowerCase() === cleanIdentifier.toLowerCase()
    ) || null;

  if (!seedMatch) {
    // Numeric index check: e.g. "1" -> seed-1
    const numericIndex = parseInt(cleanIdentifier, 10);
    if (!isNaN(numericIndex) && numericIndex >= 1 && numericIndex <= SEED_PROJECTS.length) {
      seedMatch = SEED_PROJECTS[numericIndex - 1];
    } else if (cleanIdentifier.startsWith("seed-")) {
      const idx = parseInt(cleanIdentifier.replace("seed-", ""), 10);
      if (!isNaN(idx) && idx >= 1 && idx <= SEED_PROJECTS.length) {
        seedMatch = SEED_PROJECTS[idx - 1];
      }
    }
  }

  if (!target && !local && !seedMatch) {
    return null;
  }

  // Merge the best available data: Seed base < Remote Supabase < Local storage overrides
  const base = seedMatch || {};
  const remote = target || {};
  const localOverride = local || {};

  const mergedGallery =
    (localOverride.gallery_images && localOverride.gallery_images.length > 0)
      ? localOverride.gallery_images
      : (remote.gallery_images && remote.gallery_images.length > 0)
      ? remote.gallery_images
      : (base.gallery_images || []);

  const merged: Project = {
    id: cleanIdentifier || remote.id || localOverride.id || base.id || "seed-1",
    title: localOverride.title || remote.title || base.title || "Project Record",
    description: localOverride.description || remote.description || base.description || "",
    tools: localOverride.tools || remote.tools || base.tools || [],
    image_url: localOverride.image_url || remote.image_url || base.image_url || null,
    gallery_images: mergedGallery,
    project_link: localOverride.project_link ?? remote.project_link ?? base.project_link ?? null,
    github_link: localOverride.github_link ?? remote.github_link ?? base.github_link ?? null,
    deployed_on: localOverride.deployed_on ?? remote.deployed_on ?? base.deployed_on ?? null,
    sort_order: localOverride.sort_order ?? remote.sort_order ?? base.sort_order ?? 0,
  };

  return merged;
};

/**
 * Fetch complete projects list merging Supabase, LocalStorage, and SEED_PROJECTS.
 */
export const fetchAllProjects = async (): Promise<Project[]> => {
  const localMap = getLocalProjectsMap();

  let dbProjects: Project[] = [];
  try {
    let res = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (res.error && (res.error.message.includes("sort_order") || res.error.code === "42703")) {
      res = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
    }

    if (res.data) {
      dbProjects = res.data as Project[];
    }
  } catch {}

  // Deduplicate DB projects
  const uniqueDb: Project[] = [];
  dbProjects.forEach((p) => {
    if (
      !uniqueDb.some(
        (existing) =>
          existing.id === p.id ||
          (existing.title && p.title && existing.title.trim().toLowerCase() === p.title.trim().toLowerCase())
      )
    ) {
      uniqueDb.push(p);
    }
  });

  // Merge DB with local overrides
  const mapped = uniqueDb.map((p, idx) => {
    const local =
      localMap[p.id] ||
      Object.values(localMap).find((l) => l.title?.trim().toLowerCase() === p.title?.trim().toLowerCase());
    return {
      ...p,
      sort_order: p.sort_order ?? idx,
      gallery_images:
        local?.gallery_images && local.gallery_images.length > 0
          ? local.gallery_images
          : p.gallery_images || [],
      image_url: local?.image_url || p.image_url,
    };
  });

  // Include local-only projects that don't match any DB project
  Object.keys(localMap).forEach((id) => {
    const localItem = localMap[id];
    if (
      !mapped.some(
        (m) =>
          m.id === id ||
          (m.title && localItem.title && m.title.trim().toLowerCase() === localItem.title.trim().toLowerCase())
      )
    ) {
      mapped.push(localItem);
    }
  });

  // If no DB or local projects exist, fallback to SEED_PROJECTS (with local overrides if any)
  if (mapped.length === 0) {
    return SEED_PROJECTS.map((sp, idx) => {
      const local =
        localMap[sp.id] ||
        Object.values(localMap).find((l) => l.title?.trim().toLowerCase() === sp.title?.trim().toLowerCase());
      return {
        ...sp,
        sort_order: idx,
        gallery_images:
          local?.gallery_images && local.gallery_images.length > 0
            ? local.gallery_images
            : sp.gallery_images,
        image_url: local?.image_url || sp.image_url,
      };
    });
  }

  return mapped;
};

/**
 * Preload primary thumbnail assets into browser cache to eliminate rendering delays
 */
export const preloadProjectsAssets = (projectsList?: Project[]): void => {
  if (typeof window === "undefined") return;

  const targetProjects = projectsList || SEED_PROJECTS;
  targetProjects.forEach((proj) => {
    if (proj.image_url) {
      const img = new Image();
      // Preload thumbnail size
      img.src = proj.image_url.includes("unsplash.com")
        ? proj.image_url.replace(/w=\d+/, "w=520").replace(/q=\d+/, "q=78")
        : proj.image_url;
    }
  });
};
