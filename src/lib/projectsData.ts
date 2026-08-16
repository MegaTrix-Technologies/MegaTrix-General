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

export const SEED_PROJECTS: Project[] = [];


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
  const base: Partial<Project> = seedMatch || {};
  const remote: Partial<Project> = target || {};
  const localOverride: Partial<Project> = local || {};

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
  const mapped: Project[] = uniqueDb.map((p, idx) => {
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
