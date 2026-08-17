import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Terminal,
  ExternalLink,
  Github,
  ArrowRight,
  ArrowLeft,
  ImageIcon,
  Loader2,
  Cpu,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchAllProjects,
  preloadProjectsAssets,
  SEED_PROJECTS,
  getProjectAllImages,
  getLocalProjectsMap,
  type Project,
} from "@/lib/projectsData";
import OptimizedImage from "@/components/OptimizedImage";
import Navbar from "@/components/Navbar";
import MTLogo from "@/components/MTLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects | MegaTrix" },
      { name: "description", content: "Explore Megatrix's featured deployments and enterprise digital systems." },
      { property: "og:title", content: "Projects | MegaTrix" },
      { property: "og:description", content: "Explore Megatrix's featured deployments and enterprise digital systems." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Projects,
});

function Projects() {
  // SWR: Initialize synchronously from local cache so existing projects render in 0ms!
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const map = getLocalProjectsMap();
      const cachedList = Object.values(map);
      return cachedList.length > 0 ? cachedList : [];
    } catch {
      return [];
    }
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // Prewarm browser image cache
    preloadProjectsAssets(projects.length > 0 ? projects : []);

    (async () => {
      try {
        const data = await fetchAllProjects();
        if (isMounted) {
          setProjects(data);
          preloadProjectsAssets(data);
        }
      } catch (err) {
        console.warn("Failed to fetch fresh projects:", err);
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
          {/* HEADER STATUS / SYNC TELEMETRY */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--mt-border)" }}>
            <div className="flex items-center gap-2.5 label-mono" style={{ color: "var(--mt-blue)" }}>
              {fetching && projects.length === 0 ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-cyan-400">INITIALIZING SYSTEMS DATABASE...</span>
                </>
              ) : (
                <span>TOTAL SYSTEMS RECORDED: [ {String(projects.length).padStart(3, "0")} ]</span>
              )}
            </div>

            {fetching && projects.length > 0 && (
              <span className="label-mono text-[10px] text-green-400 flex items-center gap-1.5 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                // LIVE SYNC ACTIVE
              </span>
            )}
          </div>

          {/* SKELETON LOADER (DISPLAYED ONLY WHILE INITIAL FETCHING WITH EMPTY CACHE) */}
          {fetching && projects.length === 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="panel flex flex-col overflow-hidden border animate-pulse"
                  style={{ borderColor: "var(--mt-border)", backgroundColor: "var(--mt-bg-card)" }}
                >
                  {/* SKELETON IMAGE FRAME */}
                  <div
                    className="relative h-64 w-full border-b flex flex-col items-center justify-center p-4 bg-[var(--mt-bg)]"
                    style={{ borderColor: "var(--mt-border)" }}
                  >
                    <div className="h-12 w-12 rounded-full border border-[var(--mt-blue)]/30 bg-[var(--mt-blue)]/10 flex items-center justify-center mb-3">
                      <Cpu size={20} className="text-[var(--mt-blue)]/50 animate-spin" />
                    </div>
                    <span className="label-mono text-[10px] text-[var(--mt-text-muted)] tracking-widest">
                      // RETRIEVING ASSETS #{idx + 1}...
                    </span>
                  </div>

                  {/* SKELETON CARD BODY */}
                  <div className="flex flex-1 flex-col gap-5 p-6">
                    <div className="space-y-3">
                      <div className="h-5 w-3/4 rounded-xs bg-[var(--mt-bg-panel)]" />
                      <div className="h-3.5 w-full rounded-xs bg-[var(--mt-bg-panel)]/60" />
                      <div className="h-3.5 w-5/6 rounded-xs bg-[var(--mt-bg-panel)]/40" />
                      <div className="flex gap-2 pt-2">
                        <div className="h-6 w-16 rounded-xs bg-[var(--mt-bg-panel)]" />
                        <div className="h-6 w-20 rounded-xs bg-[var(--mt-bg-panel)]" />
                        <div className="h-6 w-14 rounded-xs bg-[var(--mt-bg-panel)]" />
                      </div>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center" style={{ borderColor: "var(--mt-border)" }}>
                      <div className="h-3 w-32 rounded-xs bg-[var(--mt-bg-panel)]" />
                      <div className="h-3 w-4 rounded-xs bg-[var(--mt-blue)]/40" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !fetching && projects.length === 0 ? (
            /* EMPTY STATE (ONLY WHEN FETCH FINISHED AND RETURNED 0 RECORDS) */
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
            /* POPULATED PROJECTS GRID */
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => {
                const projectImgs = getProjectAllImages(project);
                return (
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
                        <OptimizedImage
                          src={project.image_url}
                          alt={`${project.title} interface preview`}
                          thumbnailSize="md"
                          fetchPriority={index < 3 ? "high" : "auto"}
                          className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          containerClassName="h-full w-full flex items-center justify-center"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* PHOTO COUNT BADGE */}
                        {projectImgs.length > 1 && (
                          <span
                            className="absolute left-3 top-3 rounded-sm border px-2 py-1 label-mono text-[10px] backdrop-blur-sm z-10 flex items-center gap-1"
                            style={{ borderColor: "var(--mt-border)", backgroundColor: "rgba(0,0,0,0.8)", color: "#fff" }}
                          >
                            <ImageIcon size={11} style={{ color: "var(--mt-blue)" }} />
                            {projectImgs.length} PHOTOS
                          </span>
                        )}

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
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <Footer />
    </div>
  );
}
