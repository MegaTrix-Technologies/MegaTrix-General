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
  const [showLoader, setShowLoader] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loaderTimer = setTimeout(() => {
      if (fetching) {
        setShowLoader(true);
      }
    }, 400);

    (async () => {
      setFetching(true);
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
        setProjects(data as Project[]);
      }
      setFetching(false);
      clearTimeout(loaderTimer);
    })();

    return () => clearTimeout(loaderTimer);
  }, []);

  if (showLoader && (!animationDone || fetching)) {
    return (
      <Preloader
        onComplete={() => setAnimationDone(true)}
        title="PROJECTS_LOAD.exe"
        statusText="LOADING PROJECTS..."
        duration={1500}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white">
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-60" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* REUSABLE NAVBAR */}
      <Navbar />

      {/* BACK BUTTON */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 pt-8">
        <Link
          to="/"
          className="group inline-flex items-center gap-2.5 border border-[#1E2538] bg-black px-4 py-2 font-mono text-xs font-bold tracking-widest text-[#B8C4DE] hover:text-white hover:border-[#0055FF] hover:shadow-[0_0_15px_rgba(0,85,255,0.2)] transition-all rounded-sm"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5 text-[#0055FF]" />
          RETURN TO BASE
        </Link>
      </div>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-10 md:py-16">
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
        <div className="pt-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="text-[10px] tracking-widest text-[#0055FF]">
              TOTAL SYSTEMS RECORDED: [ {String(projects.length).padStart(3, "0")} ]
            </div>
          </div>

          {fetching ? (
            null
          ) : projects.length === 0 ? (
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
                <Link
                  key={project.id}
                  to="/project-details"
                  search={{ id: project.id }}
                  className="group flex flex-col border border-[#1E2538] bg-black transition-all hover:border-[#0055FF] hover:shadow-[0_0_30px_rgba(0,85,255,0.25)] cursor-pointer"
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
                      NO IMAGE PROVIDED
                    </div>
                  )}

                  <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                    <div>
                      <h3 className="text-base font-bold tracking-wide text-white group-hover:text-[#0055FF] transition-colors">
                        {project.title}
                      </h3>

                      {/* DESCRIPTION */}
                      <p className="mt-2.5 text-xs text-[#B8C4DE] line-clamp-3 leading-relaxed whitespace-pre-wrap">
                        {project.description}
                      </p>

                      {/* TECHNOLOGIES TAGS */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tools?.map((tool, i) => (
                          <span
                            key={i}
                            className="border border-[#2A3552] bg-[#090A0F] px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-[#B8C4DE]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* VIEW PROJECT DETAILS LINK */}
                    <div className="border-t border-[#1E2538] pt-4">
                      <div
                        className="flex items-center justify-between border border-[#0055FF] bg-[#0055FF]/10 px-4 py-2.5 font-mono text-xs font-bold tracking-widest text-white group-hover:bg-[#0055FF] group-hover:shadow-[0_0_20px_rgba(0,85,255,0.4)] transition-all"
                      >
                        <span>VIEW PROJECT DETAILS</span>
                        <ArrowRight size={14} />
                      </div>
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
