import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Terminal,
  ExternalLink,
  Github,
  ArrowRight,
  ArrowLeft,
  ImageIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchAllProjects, preloadProjectsAssets, SEED_PROJECTS, getProjectAllImages, type Project } from "@/lib/projectsData";
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
  const [fetching, setFetching] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let isMounted = true;
    // Prewarm browser image cache immediately
    preloadProjectsAssets([]);

    (async () => {
      const data = await fetchAllProjects();
      if (isMounted) {
        setProjects(data);
        preloadProjectsAssets(data);
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
          <div className="mb-6 flex flex-wrap items-center gap-4 border-b pb-4" style={{ borderColor: "var(--mt-border)" }}>
            <div className="label-mono" style={{ color: "var(--mt-blue)" }}>
              TOTAL SYSTEMS RECORDED: [ {String(projects.length).padStart(3, "0")} ]
            </div>
          </div>

          {projects.length === 0 ? (
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
