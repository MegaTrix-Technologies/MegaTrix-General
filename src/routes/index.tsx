import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Terminal,
  ExternalLink,
  Github,
  Cpu,
  ShieldCheck,
  Layers,
  ArrowRight,
  Code2,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Preloader from "@/components/Preloader";

export const Route = createFileRoute("/")({
  component: Home,
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

function Home() {
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
    <div className="relative min-h-screen bg-[#090A0F] text-white font-mono">
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-30" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-40" />

      {/* NAV */}
      <nav className="relative z-10 border-b border-[#1E2538] bg-[#090A0F]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <PixelLogo />
            <span className="text-sm font-bold tracking-[0.35em]">MEGATRIX</span>
          </a>
          <div className="hidden gap-8 text-[11px] tracking-widest text-[#7C89A8] md:flex">
            <a href="#projects" className="hover:text-white">// PROJECTS</a>
            <a href="#architecture" className="hover:text-white">// ARCHITECTURE</a>
            <a href="#contact" className="hover:text-white">// CONTACT</a>
          </div>
          <Link
            to="/admin"
            className="flex items-center gap-2 border border-[#1E2538] px-3 py-2 text-[10px] tracking-widest hover:border-[#0055FF] hover:text-[#0055FF]"
          >
            <Lock size={12} />
            ADMIN_LOGIN
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="mb-6 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3 py-1.5 text-[10px] tracking-widest text-[#7C89A8]">
          <Terminal size={12} className="text-[#0055FF]" />
          ENTERPRISE SOFTWARE ENGINEERING & ARCHITECTURE
        </div>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          BUILDING NEXT-GEN
          <br />
          <span className="text-[#0055FF] glow-text">DIGITAL SYSTEMS</span> & PLATFORMS
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#7C89A8] md:text-base">
          Megatrix delivers high-performance full-stack applications, secure cloud
          infrastructure, and custom artificial intelligence pipelines with
          uncompromising execution.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 bg-[#0055FF] px-6 py-3 text-xs font-bold tracking-widest text-white shadow-[0_0_25px_rgba(0,85,255,0.4)] transition-all hover:bg-[#0044cc]"
          >
            EXPLORE WORK
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border border-[#1E2538] px-6 py-3 text-xs font-bold tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF]"
          >
            <Code2 size={14} />
            INITIATE PROJECT
          </a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative z-10 border-t border-[#1E2538] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[10px] tracking-widest text-[#0055FF]">
                // PORTFOLIO ARCHIVE
              </div>
              <h2 className="text-3xl font-bold md:text-4xl">FEATURED DEPLOYMENTS</h2>
            </div>
            <div className="text-[10px] tracking-widest text-[#7C89A8]">
              TOTAL SYSTEMS RECORDED: [ {String(projects.length).padStart(3, "0")} ]
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="border border-dashed border-[#1E2538] bg-[#12151E]/50 p-16 text-center">
              <Terminal size={32} className="mx-auto mb-4 text-[#0055FF]" />
              <p className="text-xs tracking-widest text-[#7C89A8]">
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
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#7C89A8]">
                        {project.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1">
                        {project.tools?.map((tool, idx) => (
                          <span
                            key={idx}
                            className="border border-[#1E2538] bg-[#090A0F] px-2 py-0.5 text-[9px] tracking-widest text-[#7C89A8]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-[#1E2538]">
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
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-widest text-[#7C89A8] hover:text-white"
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

      {/* ARCHITECTURE */}
      <section id="architecture" className="relative z-10 border-t border-[#1E2538] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 max-w-2xl">
            <div className="mb-2 text-[10px] tracking-widest text-[#0055FF]">
              // CORE COMPETENCIES
            </div>
            <h2 className="text-3xl font-bold md:text-4xl">ENGINEERED FOR SCALE</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#7C89A8]">
              We build robust digital architecture combining retro-futuristic design
              principles with cutting-edge backend engineering.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                Icon: Layers,
                title: "Full-Stack Ecosystems",
                body: "High-performance web applications built using Next.js, React, Node.js, and scalable cloud databases.",
              },
              {
                Icon: ShieldCheck,
                title: "Secure Infrastructure",
                body: "Hardened authentication mechanisms, role-based access control, and encrypted data pipelines.",
              },
              {
                Icon: Cpu,
                title: "AI & RAG Pipelines",
                body: "Custom machine learning models, retrieval-augmented generation systems, and automated intelligence.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="group border border-[#1E2538] bg-[#12151E] p-6 transition-all hover:border-[#0055FF] hover:shadow-[0_0_25px_rgba(0,85,255,0.2)]"
              >
                <Icon size={28} className="text-[#0055FF]" />
                <h3 className="mt-5 text-base font-bold">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#7C89A8]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="relative z-10 border-t border-[#1E2538] py-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <PixelLogo />
            <span className="text-[10px] tracking-widest text-[#7C89A8]">
              © 2026 MEGATRIX SOFTWARE HOUSE. ALL RIGHTS RESERVED.
            </span>
          </div>
          <div className="flex gap-6 text-[10px] tracking-widest text-[#7C89A8]">
            <a href="#projects" className="hover:text-white">Projects</a>
            <a href="#architecture" className="hover:text-white">Architecture</a>
            <Link to="/admin" className="hover:text-white">Admin Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PixelLogo() {
  const pattern = [
    1, 0, 1, 0, 1, 1, 1,
    1, 1, 1, 0, 0, 1, 0,
    1, 0, 1, 0, 0, 1, 0,
    1, 0, 1, 0, 0, 1, 0,
  ];
  return (
    <div className="grid grid-cols-7 gap-[2px]">
      {pattern.map((c, i) => (
        <div
          key={i}
          className={c ? "h-1.5 w-1.5 bg-[#0055FF]" : "h-1.5 w-1.5 bg-[#1E2538]"}
        />
      ))}
    </div>
  );
}
