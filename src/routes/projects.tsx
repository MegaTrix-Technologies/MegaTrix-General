import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Terminal,
  ExternalLink,
  Github,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "PROJECTS // MEGATRIX" },
      { name: "description", content: "Explore Megatrix's featured deployments and full-stack digital systems." },
      { property: "og:title", content: "PROJECTS // MEGATRIX" },
      { property: "og:description", content: "Explore Megatrix's featured deployments and full-stack digital systems." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Projects,
});

interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  image_url: string | null;
  project_link: string | null;
  github_link: string | null;
  deployed_on: string | null;
  sort_order?: number;
}

const SEED_PROJECTS = [
  {
    title: "AsanShipping.com",
    description:
      "An advanced multi-tenant fulfillment & logistics SaaS platform built for Pakistani e-commerce merchants to automate courier selection, prevent Cash-on-Delivery fraud via IVR verification calls, and streamline reverse logistics scrap ledgers.",
    tools: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Python"],
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200",
    project_link: "https://asanshipping.com",
    github_link: "https://github.com/HashirFarooq0023",
    deployed_on: "AWS & Vercel",
  },
  {
    title: "Talent Vector (HR-Helper)",
    description:
      "A production-grade system that automates top-of-funnel corporate recruitment using Multinomial Naive Bayes classification, TF-IDF vector corpus weighting, and custom Levenshtein distance string optimization with sub-3ms match speed.",
    tools: ["Python", "FastAPI", "Scikit-Learn", "React", "TailwindCSS", "MongoDB"],
    image_url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1200",
    project_link: "https://talentvector-xi.vercel.app/",
    github_link: "https://github.com/HashirFarooq0023/Talentvector",
    deployed_on: "Vercel & Render",
  },
  {
    title: "PSX Quantitative & AI Oracle",
    description:
      "A sophisticated data analytics engine that ingests historical Pakistan Stock Exchange equities data, computes statistical tendencies, beta indicators, and Ordinary Least Squares (OLS) linear regressions.",
    tools: ["Python", "FastAPI", "NumPy", "Pandas", "Statsmodels", "React"],
    image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200",
    project_link: "https://prob-project.vercel.app/",
    github_link: "https://github.com/HashirFarooq0023",
    deployed_on: "Vercel",
  },
  {
    title: "Aesthetic MERN E-Commerce (TrendsStore)",
    description:
      "A sleek, high-performance e-commerce platform featuring an aesthetic theme layout, real-time cart management, multi-address checkout logic, dynamic product filters, and a secure role-based admin inventory portal.",
    tools: ["Next.js", "React", "Node.js", "Express.js", "MongoDB", "TailwindCSS"],
    image_url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200",
    project_link: "https://www.trendsstorepk.com/",
    github_link: "https://github.com/HashirFarooq0023/E-com-Theme-2",
    deployed_on: "Vercel & Render",
  },
];

function Projects() {
  const [animationDone, setAnimationDone] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      setFetching(true);
      let localMap: Record<string, Project> = {};
      try {
        const cached = localStorage.getItem("megatrix_local_projects");
        if (cached) localMap = JSON.parse(cached);
      } catch {}

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

      const data = res.data;

      if (data) {
        const uniqueData: Project[] = [];
        (data as Project[]).forEach((p) => {
          if (!uniqueData.some((existing) => existing.id === p.id || (existing.title && p.title && existing.title.trim().toLowerCase() === p.title.trim().toLowerCase()))) {
            uniqueData.push(p);
          }
        });

        const mapped = uniqueData.map((p, idx) => {
          const local = localMap[p.id] || Object.values(localMap).find((l) => l.title?.trim().toLowerCase() === p.title?.trim().toLowerCase());
          return {
            ...p,
            sort_order: p.sort_order ?? idx,
            gallery_images: (local?.gallery_images && local.gallery_images.length > 0)
              ? local.gallery_images
              : (p.gallery_images || []),
            image_url: local?.image_url || p.image_url,
          };
        });

        // Add any local-only projects that don't match any DB project by ID or Title
        Object.keys(localMap).forEach((id) => {
          const localItem = localMap[id];
          if (!mapped.some((m) => m.id === id || (m.title && localItem.title && m.title.trim().toLowerCase() === localItem.title.trim().toLowerCase()))) {
            mapped.push(localItem);
          }
        });

        // If no DB or local projects exist, fallback to SEED_PROJECTS
        if (mapped.length === 0) {
          const seedsWithIds: Project[] = SEED_PROJECTS.map((sp, idx) => ({
            id: `seed-${idx + 1}`,
            title: sp.title,
            description: sp.description,
            tools: sp.tools,
            image_url: sp.image_url,
            project_link: sp.project_link,
            github_link: sp.github_link,
            deployed_on: sp.deployed_on,
            sort_order: idx,
          }));
          setProjects(seedsWithIds);
        } else {
          setProjects(mapped);
        }
      } else if (Object.keys(localMap).length > 0) {
        const uniqueLocals: Project[] = [];
        Object.values(localMap).forEach((item) => {
          if (!uniqueLocals.some((l) => l.id === item.id || (l.title && item.title && l.title.trim().toLowerCase() === item.title.trim().toLowerCase()))) {
            uniqueLocals.push(item);
          }
        });
        setProjects(uniqueLocals);
      } else {
        const seedsWithIds: Project[] = SEED_PROJECTS.map((sp, idx) => ({
          id: `seed-${idx + 1}`,
          title: sp.title,
          description: sp.description,
          tools: sp.tools,
          image_url: sp.image_url,
          project_link: sp.project_link,
          github_link: sp.github_link,
          deployed_on: sp.deployed_on,
          sort_order: idx,
        }));
        setProjects(seedsWithIds);
      }
      setFetching(false);
    })();
  }, []);

  if (fetching || !animationDone) {
    return (
      <Preloader
        onComplete={() => setAnimationDone(true)}
        title="PROJECTS_LOAD.exe"
        statusText="LOADING PROJECTS..."
        duration={1000}
      />
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "var(--mt-bg)", color: "var(--mt-text)" }}>
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-60" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* REUSABLE NAVBAR */}
      <Navbar />

      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-8 md:px-12">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 rounded-sm border px-4 py-2 label-mono font-bold transition-all duration-200 hover:-translate-x-0.5"
          style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg-card)", color: "var(--mt-text-secondary)" }}
        >
          <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" style={{ color: "var(--mt-blue)" }} />
          RETURN TO BASE
        </Link>
      </div>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-12 md:px-12 md:py-20">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-sm border border-[var(--mt-border)] bg-[var(--mt-bg-card)] px-3.5 py-1.5 font-mono text-xs md:text-sm font-bold tracking-wider text-[var(--mt-blue)]">
            <Terminal size={15} className="text-[var(--mt-blue)]" />
            PORTFOLIO ARCHIVE
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] md:text-6xl" style={{ color: "var(--mt-text-heading)" }}>
            FEATURED
            <span className="glow-text" style={{ color: "var(--mt-blue)" }}> DEPLOYMENTS</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 md:text-base" style={{ color: "var(--mt-text-secondary)" }}>
            A curated catalog of full-stack applications, cloud infrastructure, and
            AI-driven systems engineered by Megatrix.
          </p>
        </div>

        {/* PROJECTS */}
        <div className="pt-14 md:pt-20">
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b pb-4" style={{ borderColor: "var(--mt-border)" }}>
            <div className="label-mono" style={{ color: "var(--mt-blue)" }}>
              TOTAL SYSTEMS RECORDED: [ {String(projects.length).padStart(3, "0")} ]
            </div>
          </div>

          {fetching ? (
            null
          ) : projects.length === 0 ? (
            <div
              className="rounded-sm border border-dashed p-16 text-center"
              style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg-card)" }}
            >
              <Terminal size={32} className="mx-auto mb-4" style={{ color: "var(--mt-blue)" }} />
              <p className="label-mono leading-6" style={{ color: "var(--mt-text-secondary)" }}>
                NO PROJECTS UPLOADED TO DATABASE YET.
                <br />
                LOG IN TO THE ADMIN PANEL TO ADD DEPLOYMENTS.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to="/project-details"
                  search={{ id: project.id }}
                  className="group panel panel-interactive flex cursor-pointer flex-col overflow-hidden"
                >
                  {project.image_url ? (
                    <div
                      className="relative h-64 w-full overflow-hidden border-b flex items-center justify-center p-2"
                      style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg)" }}
                    >
                      <img
                        src={project.image_url}
                        alt={`${project.title} interface preview`}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                      {project.deployed_on && (
                        <span
                          className="absolute right-3 top-3 rounded-sm border px-2 py-1 label-mono text-[10px] backdrop-blur-sm z-10"
                          style={{ borderColor: "var(--mt-blue)", backgroundColor: "var(--mt-bg)", color: "var(--mt-blue)" }}
                        >
                          {project.deployed_on}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className="flex aspect-video items-center justify-center border-b label-mono"
                      style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg-panel)", color: "var(--mt-border-accent)" }}
                    >
                      NO IMAGE PROVIDED
                    </div>
                  )}

                  <div className="flex flex-1 flex-col gap-5 p-6">
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold leading-snug transition-colors duration-200"
                        style={{ color: "var(--mt-text-heading)" }}
                      >
                        {project.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-3 line-clamp-3 text-[13px] leading-6" style={{ color: "var(--mt-text-secondary)" }}>
                        {project.description}
                      </p>

                      {/* TECHNOLOGIES */}
                      {project.tools?.length ? (
                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {project.tools.slice(0, 5).map((tool) => (
                            <span key={tool} className="chip">
                              {tool}
                            </span>
                          ))}
                          {project.tools.length > 5 && (
                            <span className="chip" style={{ borderColor: "var(--mt-blue)", color: "var(--mt-blue)" }}>
                              +{project.tools.length - 5}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>

                    {/* CALL TO ACTION */}
                    <div
                      className="flex items-center justify-between border-t pt-4 label-mono font-bold transition-colors duration-200"
                      style={{ borderColor: "var(--mt-border)", color: "var(--mt-text-secondary)" }}
                    >
                      <span>VIEW PROJECT DETAILS</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: "var(--mt-blue)" }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <Footer />
    </div>
  );
}
