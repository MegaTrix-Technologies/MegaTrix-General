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
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
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

  // MOUSE WHEEL ZOOM & PAN STATE FOR EXTENDED VIEW
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomOffset, setZoomOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom when active image index changes or modal closes
  useEffect(() => {
    setZoomScale(1);
    setZoomOffset({ x: 0, y: 0 });
  }, [activeImageIndex, lightboxOpen]);

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setZoomScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 1), 4);
      if (next === 1) setZoomOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomScale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - zoomOffset.x, y: e.clientY - zoomOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomScale > 1) {
      setZoomOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    (async () => {
      setFetching(true);
      if (!projectId) {
        setFetching(false);
        return;
      }

      let localMap: Record<string, Project> = {};
      try {
        const cached = localStorage.getItem("megatrix_local_projects");
        if (cached) localMap = JSON.parse(cached);
      } catch {}

      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();

      let target: Project | null = data ? (data as Project) : null;

      if (!target) {
        const { data: allData } = await supabase.from("projects").select("*");
        if (allData) {
          const match = allData.find(
            (p) =>
              p.id === projectId ||
              p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === projectId,
          );
          if (match) target = match as Project;
        }
      }

      const local = localMap[projectId] || Object.values(localMap).find(
        (p) => p.id === projectId || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === projectId
      );

      if (target || local) {
        const merged: Project = {
          ...(target || local!),
          ...(local || {}),
          gallery_images: (local?.gallery_images && local.gallery_images.length > 0)
            ? local.gallery_images
            : (target?.gallery_images || []),
        };
        setProject(merged);
      }

      setFetching(false);
    })();
  }, [projectId]);

  const allImages: string[] = [];
  if (project?.image_url) allImages.push(project.image_url);
  if (project?.gallery_images && Array.isArray(project.gallery_images)) {
    project.gallery_images.forEach((img) => {
      if (img && !allImages.includes(img)) allImages.push(img);
    });
  }

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && lightboxOpen) {
        setLightboxOpen(false);
        return;
      }

      if (allImages.length <= 1) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allImages.length, lightboxOpen]);

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

          {/* CENTERED PRIMARY IMAGE DISPLAY WITH BORDER-ATTACHED ARROWS */}
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="relative flex items-center justify-center">
              {/* LEFT ARROW (ATTACHED TO LEFT BORDER OF IMAGE FRAME) */}
              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="hidden sm:flex absolute -left-12 md:-left-14 top-1/2 -translate-y-1/2 z-30 h-16 w-11 items-center justify-center border border-[#0055FF] bg-[#12151E] text-white transition-all hover:bg-[#0055FF] shadow-[0_0_20px_rgba(0,85,255,0.4)] cursor-pointer rounded-l-sm"
                  title="Previous Image (Left Arrow Key)"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* CLEAN PRIMARY IMAGE RECTANGLE (ACCOMMODATES MOBILE APP & DESKTOP SCREENSHOTS PERFECTLY) */}
              <div className="flex-1 group relative border border-[#1E2538] bg-[#12151E] p-3 shadow-[0_0_60px_rgba(0,85,255,0.2)] overflow-hidden flex items-center justify-center min-h-[400px] max-h-[620px]">
                {allImages.length > 0 ? (
                  <div className="relative h-full w-full flex items-center justify-center bg-[#090A0F] overflow-hidden p-2">
                    <img
                      src={allImages[activeImageIndex] || allImages[0]}
                      alt={project.title}
                      className="max-h-[580px] w-auto max-w-full object-contain transition-all duration-300 group-hover:scale-[1.02]"
                    />

                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="absolute right-4 top-4 z-20 flex items-center gap-2 border border-[#1E2538] bg-[#090A0F]/90 px-4 py-2 font-sans text-xs font-bold tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF] transition-all shadow-lg"
                    >
                      <Maximize2 size={14} /> EXPAND VIEW
                    </button>
                  </div>
                ) : (
                  <div className="flex min-h-[350px] w-full flex-col items-center justify-center bg-[#090A0F] text-[#455270]">
                    <ImageIcon size={56} className="mb-2 text-[#0055FF]/40" />
                    <span className="font-mono text-xs tracking-widest">NO IMAGE PREVIEW AVAILABLE</span>
                  </div>
                )}
              </div>

              {/* RIGHT ARROW (ATTACHED TO RIGHT BORDER OF IMAGE FRAME) */}
              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  className="hidden sm:flex absolute -right-12 md:-right-14 top-1/2 -translate-y-1/2 z-30 h-16 w-11 items-center justify-center border border-[#0055FF] bg-[#12151E] text-white transition-all hover:bg-[#0055FF] shadow-[0_0_20px_rgba(0,85,255,0.4)] cursor-pointer rounded-r-sm"
                  title="Next Image (Right Arrow Key)"
                  aria-label="Next Image"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>

            {/* MOBILE OUTSIDE ARROWS */}
            {allImages.length > 1 && (
              <div className="flex sm:hidden items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#0055FF] bg-[#12151E] py-2.5 text-xs font-bold text-white hover:bg-[#0055FF]"
                >
                  <ChevronLeft size={18} /> PREV IMAGE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                  className="flex-1 flex items-center justify-center gap-2 border border-[#0055FF] bg-[#12151E] py-2.5 text-xs font-bold text-white hover:bg-[#0055FF]"
                >
                  NEXT IMAGE <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* THUMBNAILS GALLERY STRIP (CENTERED) */}
            {allImages.length > 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between max-w-5xl mx-auto font-mono text-xs font-semibold tracking-wider text-[#7C89A8]">
                  <span>SYSTEM GALLERY ({allImages.length} ATTACHMENTS)</span>
                  <span>IMAGE {activeImageIndex + 1} OF {allImages.length}</span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-3 max-h-52 overflow-y-auto p-1.5">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-28 max-w-[150px] shrink-0 overflow-hidden border p-1 bg-[#050608] flex items-center justify-center transition-all cursor-pointer rounded-xs ${
                        activeImageIndex === idx
                          ? "border-[#0055FF] bg-[#0055FF]/10 shadow-[0_0_20px_rgba(0,85,255,0.6)] scale-105"
                          : "border-[#1E2538] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full h-auto w-auto object-contain" />
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

      {/* EXTENDED LIGHTBOX MODAL WITH CHROME / PDF-STYLE LEFT THUMBNAIL SIDEBAR & BORDER-ATTACHED ARROWS */}
      {lightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#08090D]/95 backdrop-blur-xl p-4 md:p-6 text-white font-sans overflow-hidden">
          {/* MODAL TOP BAR */}
          <div className="flex items-center justify-between border-b border-[#1E2538] pb-3 mb-3 shrink-0">
            <div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                {project.title}
              </h3>
              <p className="text-[11px] font-mono text-[#0055FF] pt-0.5">
                PAGE {activeImageIndex + 1} OF {allImages.length}
              </p>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-1.5 text-xs font-bold tracking-widest text-[#B8C4DE] hover:border-red-500 hover:text-red-400 transition-colors rounded-sm cursor-pointer"
            >
              <X size={16} />
              CLOSE (ESC)
            </button>
          </div>

          {/* MAIN MODAL BODY: LEFT SIDEBAR + RIGHT IMAGE STAGE */}
          <div className="flex-1 flex overflow-hidden gap-4 relative">
            {/* CHROME / PDF-STYLE LEFT SIDEBAR THUMBNAILS LIST */}
            {allImages.length > 1 && (
              <div className="w-44 sm:w-52 md:w-60 shrink-0 border border-[#1E2538] bg-[#0D0F17] p-3 flex flex-col overflow-y-auto space-y-3 rounded-sm shadow-xl custom-scrollbar">
                <div className="text-[10px] font-mono font-bold tracking-widest text-[#0055FF] border-b border-[#1E2538] pb-2 flex items-center justify-between">
                  <span>PAGES / PHOTOS</span>
                  <span>[{allImages.length}]</span>
                </div>
                <div className="space-y-3">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`group relative w-full flex flex-col items-center p-2 border transition-all rounded-xs cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-[#0055FF] bg-[#0055FF]/15 shadow-[0_0_15px_rgba(0,85,255,0.4)]"
                          : "border-[#1E2538] bg-[#090A0F] hover:border-[#0055FF]/60 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <div className="min-h-[110px] max-h-[140px] w-full overflow-hidden bg-[#050608] border border-[#1E2538] flex items-center justify-center p-1.5 rounded-xs">
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="max-h-full max-w-full h-auto w-auto object-contain" />
                      </div>
                      <span
                        className={`mt-1.5 font-mono text-[10px] font-bold ${
                          activeImageIndex === idx ? "text-[#00FFFF]" : "text-[#7C89A8]"
                        }`}
                      >
                        PAGE {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MAIN IMAGE DISPLAY AREA WITH INVISIBLE MOUSE SCROLLER ZOOM & PAN */}
            <div className="flex-1 relative flex items-center justify-center bg-[#050608] border border-[#1E2538] p-4 sm:p-8 overflow-hidden rounded-sm">
              {/* IMAGE FRAME CONTAINER WITH MOUSE SCROLLER ZOOM AND PAN */}
              <div
                onWheel={handleWheelZoom}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="relative max-h-[82vh] max-w-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
              >
                <div
                  className="relative border-2 border-[#1E2538] bg-[#090A0F] shadow-2xl p-1.5 transition-transform duration-75 ease-out"
                  style={{
                    transform: `translate(${zoomOffset.x}px, ${zoomOffset.y}px) scale(${zoomScale})`,
                    transformOrigin: "center center",
                  }}
                >
                  <img
                    src={allImages[activeImageIndex]}
                    alt="Expanded Preview"
                    className="max-h-[76vh] w-auto max-w-full object-contain pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED FOOTER */}
      <Footer />
    </div>
  );
}
