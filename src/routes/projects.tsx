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
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import logoNav from "@/assets/mt-white-on-black.png.asset.json";

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
}

function Projects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setProjects(data as Project[]);
    })();
  }, []);

  if (loading) return <Preloader onComplete={() => setLoading(false)} />;

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white">
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-60" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* NAV */}
      <nav className="relative z-10 border-b border-[#1E2538] bg-[#090A0F]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoNav.url} alt="MEGATRIX" className="h-8 w-auto" />
          </Link>
          <div className="hidden gap-8 text-[11px] tracking-widest text-[#B8C4DE] md:flex">
            <Link to="/" className="hover:text-white">// HOME</Link>
            <Link to="/projects" className="text-white hover:text-white">// PROJECTS</Link>
            <a href="/architecture" className="hover:text-white">// ARCHITECTURE</a>
            <a href="/contact" className="hover:text-white">// CONTACT</a>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 border border-[#2A3552] bg-[#12151E] px-3 py-2 text-[10px] tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF]"
          >
            <ArrowLeft size={12} />
            HOME
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3 py-1.5 text-[10px] tracking-widest text-[#B8C4DE]">
            <Terminal size={12} className="text-[#0055FF]" />
            PORTFOLIO ARCHIVE
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            FEATURED
            <span className="text-[#0055FF] glow-text"> DEPLOYMENTS</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#B8C4DE] md:text-base">
            A curated catalog of full-stack applications, cloud infrastructure, and
            AI-driven systems engineered by Megatrix.
          </p>
        </div>

        {/* PROJECTS */}
        <div className="border-t border-[#1E2538] pt-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="text-[10px] tracking-widest text-[#0055FF]">
              // TOTAL SYSTEMS RECORDED: [ {String(projects.length).padStart(3, "0")} ]
            </div>
            <Link
              to="/"
              className="group inline-flex items-center gap-2 text-[10px] tracking-widest text-[#B8C4DE] hover:text-white"
            >
              <ArrowLeft size={12} />
              RETURN TO BASE
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="border border-dashed border-[#1E2538] bg-[#12151E]/50 p-16 text-center">
              <Terminal size={32} className="mx-auto mb-4 text-[#0055FF]" />
              <p className="text-xs tracking-widest text-[#B8C4DE]">
                NO PROJECTS UPLOADED TO DATABASE YET.
                <br />
                LOG IN TO THE ADMIN PANEL TO ADD DEPLOYMENTS.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col border border-[#1E2538] bg-[#12151E] transition-all hover:border-[#0055FF] hover:shadow-[0_0_30px_rgba(0,85,255,0.25)]"
                >
                  {project.image_url ? (
                    <div className="relative aspect-video overflow-hidden border-b border-[#1E2538]">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      {project.deployed_on && (
                        <span className="absolute right-3 top-3 border border-[#0055FF] bg-[#090A0F]/80 px-2 py-1 text-[9px] tracking-widest text-[#0055FF]">
                          {project.deployed_on}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center border-b border-[#1E2538] bg-[#090A0F] text-[10px] tracking-widest text-[#1E2538]">
                      // NO_IMAGE_PROVIDED
                    </div>
                  )}

                  <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-base font-bold tracking-wide text-white">
                        {project.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#B8C4DE]">
                        {project.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {project.tools?.map((tool, idx) => (
                          <span
                            key={idx}
                            className="border border-[#1E2538] bg-[#090A0F] px-2 py-0.5 text-[9px] tracking-widest text-[#B8C4DE]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 border-t border-[#1E2538] pt-2">
                      {project.project_link && (
                        <a
                          href={project.project_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-widest text-[#0055FF] hover:underline"
                        >
                          <ExternalLink size={12} />
                          LIVE DEMO
                        </a>
                      )}
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-widest text-[#B8C4DE] hover:text-white"
                        >
                          <Github size={12} />
                          SOURCE
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#1E2538] py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <MTLogo variant="white" className="h-5 w-auto" />
            <span className="text-[10px] tracking-widest text-[#B8C4DE]">
              © 2026 MEGATRIX SOFTWARE HOUSE. ALL RIGHTS RESERVED.
            </span>
          </div>
          <div className="flex gap-6 text-[10px] tracking-widest text-[#B8C4DE]">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/projects" className="text-white hover:text-white">Projects</Link>
            <a href="/architecture" className="hover:text-white">Architecture</a>
            <a href="/contact" className="hover:text-white">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
