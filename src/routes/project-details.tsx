import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Terminal,
  Cpu,
  ImageIcon,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/project-details")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || "",
  }),
  component: ProjectDetailPage,
});

interface Project {
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
}

function ProjectDetailPage() {
  const { id: projectId } = Route.useSearch();
  const [animationDone, setAnimationDone] = useState(false);

  const [project, setProject] = useState<Project | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setFetching(true);
      if (!projectId) {
        setFetching(false);
        return;
      }

      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();

      if (data) {
        setProject(data as Project);
      } else {
        const { data: allData } = await supabase.from("projects").select("*");
        if (allData) {
          const match = allData.find(
            (p) =>
              p.id === projectId ||
              p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === projectId,
          );
          if (match) setProject(match as Project);
        }
      }
      setFetching(false);
    })();
  }, [projectId]);

  if (fetching || !animationDone) {
    return (
      <Preloader
        onComplete={() => setAnimationDone(true)}
        title="PROJECTS_LOAD.exe"
        statusText="LOADING PROJECT DETAILS..."
        duration={1000}
      />
    );
  }

  const allImages: string[] = [];
  if (project?.image_url) allImages.push(project.image_url);
  if (project?.gallery_images && Array.isArray(project.gallery_images)) {
    project.gallery_images.forEach((img) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white font-sans">
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-60" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* REUSABLE TOP NAVBAR */}
      <Navbar />

      {fetching ? (
        null
      ) : !project ? (
        <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-32 text-center">
          <h2 className="text-2xl font-bold text-red-400">PROJECT RECORD NOT FOUND</h2>
          <p className="mt-2 text-sm text-[#B8C4DE]">The requested project identifier could not be retrieved.</p>
          <Link
            to="/projects"
            className="mt-6 inline-flex items-center gap-2 border border-[#0055FF] bg-[#0055FF] px-6 py-3 font-sans text-xs font-bold tracking-widest text-white hover:bg-[#0044cc]"
          >
            <ArrowLeft size={14} /> RETURN TO PROJECTS CATALOG
          </Link>
        </div>
      ) : (
        <>
          {/* BACK BUTTON */}
          <div className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 pt-8">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2.5 border border-[#1E2538] bg-black px-4 py-2 font-mono text-xs font-bold tracking-widest text-[#B8C4DE] hover:text-white hover:border-[#0055FF] hover:shadow-[0_0_15px_rgba(0,85,255,0.2)] transition-all rounded-sm"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5 text-[#0055FF]" />
              BACK TO PROJECTS
            </Link>
          </div>

          <main className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 py-10 md:py-16 space-y-12">

          {/* CENTERED PROJECT TITLE & HEADER */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-4 py-1.5 font-mono text-xs font-bold tracking-wider text-[#0055FF]">
              <Terminal size={14} />
              ENTERPRISE SYSTEM SPECIFICATION
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {project.title}
            </h1>

            {project.deployed_on && (
              <div className="flex items-center justify-center gap-2 font-mono text-xs text-[#7C89A8] pt-1">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                DEPLOYED ON: <span className="text-white font-bold">{project.deployed_on}</span>
              </div>
            )}
          </div>

          {/* CENTERED PRIMARY IMAGE DISPLAY */}
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="group relative border border-[#1E2538] bg-[#12151E] p-3 shadow-[0_0_60px_rgba(0,85,255,0.2)] overflow-hidden">
              {allImages.length > 0 ? (
                <div className="relative aspect-video w-full overflow-hidden bg-[#090A0F]">
                  <img
                    src={allImages[activeImageIndex] || allImages[0]}
                    alt={project.title}
                    className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                  />

                  {/* SIDE NAVIGATION ARROWS ON BIG IMAGE */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center border border-[#1E2538] bg-[#090A0F]/80 text-white backdrop-blur-md transition-all hover:border-[#0055FF] hover:bg-[#0055FF] hover:scale-110 shadow-2xl"
                        title="Previous Image"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center border border-[#1E2538] bg-[#090A0F]/80 text-white backdrop-blur-md transition-all hover:border-[#0055FF] hover:bg-[#0055FF] hover:scale-110 shadow-2xl"
                        title="Next Image"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute right-4 top-4 z-20 flex items-center gap-2 border border-[#1E2538] bg-[#090A0F]/90 px-4 py-2 font-sans text-xs font-bold tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF] transition-all shadow-lg"
                  >
                    <Maximize2 size={14} /> EXPAND VIEW
                  </button>
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center bg-[#090A0F] text-[#455270]">
                  <ImageIcon size={56} className="mb-2 text-[#0055FF]/40" />
                  <span className="font-mono text-xs tracking-widest">NO IMAGE PREVIEW AVAILABLE</span>
                </div>
              )}
            </div>

            {/* THUMBNAILS GALLERY STRIP (CENTERED) */}
            {allImages.length > 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between max-w-5xl mx-auto font-mono text-xs font-semibold tracking-wider text-[#7C89A8]">
                  <span>SYSTEM GALLERY ({allImages.length} ATTACHMENTS)</span>
                  <span>IMAGE {activeImageIndex + 1} OF {allImages.length}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-3 max-h-48 overflow-y-auto p-1">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-20 w-32 flex-shrink-0 overflow-hidden border p-0.5 transition-all ${
                        activeImageIndex === idx
                          ? "border-[#0055FF] shadow-[0_0_20px_rgba(0,85,255,0.6)] scale-105"
                          : "border-[#1E2538] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* OPEN, UNBOXED DETAILS BELOW IMAGE */}
          <div className="max-w-4xl mx-auto space-y-12 pt-4">
            {/* DESCRIPTION (NO CONTAINER BOX BORDER) */}
            <div className="space-y-4">
              <div className="font-mono text-xs font-bold tracking-widest text-[#0055FF]">
                ARCHITECTURE & SYSTEM DESCRIPTION
              </div>
              <p className="text-base md:text-lg leading-relaxed text-[#E2E8F0] font-normal whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* INTEGRATED TECHNOLOGIES STACK */}
            <div className="space-y-4 pt-4 border-t border-[#1E2538]">
              <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-[#0055FF]">
                <Cpu size={16} />
                INTEGRATED TECHNOLOGY STACK ({project.tools?.length || 0})
              </div>
              <div className="flex flex-wrap gap-3">
                {project.tools?.map((tool, i) => (
                  <span
                    key={i}
                    className="border border-[#2A3552] bg-[#12151E] px-4 py-2 font-mono text-xs md:text-sm font-bold tracking-wider text-cyan-400 shadow-md"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* DEDICATED GALLERY IMAGES GRID */}
            {allImages.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#1E2538]">
                <div className="flex items-center justify-between font-mono text-xs font-bold tracking-widest text-[#0055FF]">
                  <span className="flex items-center gap-2">
                    <ImageIcon size={16} />
                    PROJECT GALLERY & ATTACHED SCREENSHOTS ({allImages.length})
                  </span>
                  <span className="text-[#7C89A8]">CLICK TO PREVIEW</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className={`group relative aspect-video overflow-hidden border bg-[#12151E] p-1 text-left transition-all ${
                        activeImageIndex === idx
                          ? "border-[#0055FF] shadow-[0_0_25px_rgba(0,85,255,0.4)]"
                          : "border-[#1E2538] hover:border-[#0055FF]/60 opacity-85 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} Gallery Image ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="font-mono text-[10px] font-bold tracking-wider text-white flex items-center gap-1.5">
                          <Maximize2 size={12} className="text-[#0055FF]" /> VIEW ATTACHMENT #{idx + 1}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CENTERED ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[#1E2538]">
              {project.project_link && (
                <a
                  href={project.project_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#0055FF] px-8 py-4 font-sans text-sm font-bold tracking-widest text-white shadow-[0_0_30px_rgba(0,85,255,0.4)] hover:bg-[#0044cc] hover:shadow-[0_0_40px_rgba(0,85,255,0.7)] transition-all min-w-[220px]"
                >
                  <ExternalLink size={18} /> LIVE DEPLOYMENT
                </a>
              )}

              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 border border-[#1E2538] bg-[#12151E] px-8 py-4 font-sans text-sm font-bold tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF] transition-all min-w-[220px]"
                >
                  <Github size={18} /> SOURCE REPO
                </a>
              )}
            </div>
          </div>
        </main>
      </>
    )}

      {/* LIGHTBOX MODAL FOR EXPANDED IMAGE VIEW */}
      {lightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute right-6 top-6 border border-[#1E2538] bg-[#12151E] p-3 text-white hover:border-red-500 hover:text-red-400 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="relative max-h-[85vh] max-w-5xl overflow-hidden border border-[#1E2538] bg-[#090A0F] p-3 shadow-2xl">
            <img
              src={allImages[activeImageIndex]}
              alt="Expanded Preview"
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 border border-[#1E2538] bg-[#090A0F]/90 p-3 text-white hover:border-[#0055FF]"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 border border-[#1E2538] bg-[#090A0F]/90 p-3 text-white hover:border-[#0055FF]"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ENHANCED FOOTER */}
      <Footer />
    </div>
  );
}
