import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
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
  Globe,
  Layers,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchProjectById, type Project } from "@/lib/projectsData";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project Specification | MegaTrix" },
      { name: "description", content: "Detailed technical and architecture specification of systems developed by MegaTrix." },
      { property: "og:title", content: "Project Specification | MegaTrix" },
    ],
  }),
  component: ProjectDetailPage,
});

/* ─── IMAGE FALLBACK COMPONENT ─── */
function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#090A0F] border border-[#1E2538] text-[#455270] gap-2 ${className ?? ""}`}
      >
        <ImageIcon size={28} className="text-[#0055FF]/30" />
        <span className="font-mono text-[9px] tracking-widest">
          // NO_PREVIEW_AVAILABLE
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}

/* ─── LIGHTBOX MODAL ─── */
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
      onClick={onClose}
    >
      {/* Terminal-frame close button */}
      <button
        onClick={onClose}
        className="absolute right-5 top-5 z-10 flex items-center justify-center border border-[#1E2538] bg-[#12151E] p-2.5 text-[#7C89A8] hover:border-red-500/70 hover:text-red-400 transition-colors"
        title="Close [ESC]"
      >
        <X size={20} />
      </button>

      {/* Image counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-[#7C89A8] border border-[#1E2538] bg-[#090A0F] px-3 py-1.5">
        ATTACHMENT {index + 1} / {images.length}
      </div>

      {/* Main image frame */}
      <div
        className="relative border border-[#1E2538] bg-[#090A0F] p-2 shadow-[0_0_80px_rgba(0,85,255,0.25)] max-w-6xl w-full mx-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-[#1E2538] px-3 py-2 mb-2">
          <Terminal size={11} className="text-[#0055FF]" />
          <span className="font-mono text-[9px] tracking-widest text-[#7C89A8]">
            // FULL_RESOLUTION_PREVIEW
          </span>
        </div>
        <GalleryImage
          src={images[index]}
          alt={`Expanded view ${index + 1}`}
          className="max-h-[75vh] w-full object-contain"
        />
      </div>

      {/* Arrow buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-[#1E2538] bg-[#090A0F]/90 text-white hover:border-[#0055FF] hover:text-[#0055FF] transition-all"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center border border-[#1E2538] bg-[#090A0F]/90 text-white hover:border-[#0055FF] hover:text-[#0055FF] transition-all"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
function ProjectDetailPage() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const [animationDone, setAnimationDone] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loaderTimer = setTimeout(() => {
      if (fetching && isMounted) setShowLoader(true);
    }, 400);

    (async () => {
      setFetching(true);
      const targetId = projectId || "seed-1";
      const resolved = await fetchProjectById(targetId);
      if (isMounted) {
        setProject(resolved);
        setFetching(false);
        clearTimeout(loaderTimer);
      }
    })();

    return () => {
      isMounted = false;
      clearTimeout(loaderTimer);
    };
  }, [projectId]);

  /* Build the full images array (cover + gallery, deduplicated) */
  const allImages: string[] = [];
  if (project?.image_url) allImages.push(project.image_url);
  if (project?.gallery_images && Array.isArray(project.gallery_images)) {
    for (const img of project.gallery_images) {
      if (img && !allImages.includes(img)) allImages.push(img);
    }
  }

  /* Gallery-only images (excluding the primary cover) */
  const galleryOnly = project?.gallery_images?.filter(
    (img): img is string => !!img && img !== project.image_url,
  ) ?? [];

  const openLightbox = useCallback((idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prevLightbox = useCallback(
    () => setLightboxIndex((i) => (i === 0 ? allImages.length - 1 : i - 1)),
    [allImages.length],
  );
  const nextLightbox = useCallback(
    () => setLightboxIndex((i) => (i === allImages.length - 1 ? 0 : i + 1)),
    [allImages.length],
  );

  /* ── Loading state ── */
  if (showLoader && (!animationDone || fetching)) {
    return (
      <Preloader
        onComplete={() => setAnimationDone(true)}
        title="PROJECTS_LOAD.exe"
        statusText="LOADING PROJECT DETAILS..."
        duration={1000}
      />
    );
  }

  /* ── Not found ── */
  if (!fetching && !project) {
    return (
      <div className="relative min-h-screen bg-[#090A0F] text-white">
        <div className="pointer-events-none fixed inset-0 scanlines opacity-20" />
        <div className="pointer-events-none fixed inset-0 retro-grid opacity-15" />
        <Navbar />
        <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-32 text-center">
          <span className="font-mono text-xs text-[#0055FF] tracking-widest">
            // ERROR_404
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-white">
            PROJECT RECORD NOT FOUND
          </h2>
          <p className="mt-3 text-sm text-[#7C89A8] font-mono">
            The requested project identifier could not be retrieved from the
            system.
          </p>
          <Link
            to="/projects"
            className="mt-8 inline-flex items-center gap-2 border border-[#0055FF] bg-[#0055FF] px-6 py-3 font-mono text-xs font-bold tracking-widest text-white hover:bg-[#0044cc] transition-all"
          >
            <ArrowLeft size={14} />[ // BACK TO PROJECTS ARCHIVE ]
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white font-sans overflow-x-hidden">
      {/* ── Background layers ── */}
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-50" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-15" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-20" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      <Navbar />

      {project && (
        <>
          {/* ════════════════════════════════════════
              HEADER ZONE
          ════════════════════════════════════════ */}
          <div className="relative z-10 border-b border-[#1E2538] bg-[#090A0F]/80 backdrop-blur-sm">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Back button */}
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2.5 border border-[#1E2538] bg-[#0A0C14] px-4 py-2.5 font-mono text-[11px] font-bold tracking-widest text-[#B8C4DE] hover:text-white hover:border-[#0055FF] hover:shadow-[0_0_18px_rgba(0,85,255,0.25)] transition-all flex-shrink-0 self-start"
              >
                <ArrowLeft
                  size={13}
                  className="text-[#0055FF] transition-transform group-hover:-translate-x-0.5"
                />
                [ // BACK TO PROJECTS ARCHIVE ]
              </Link>

              {/* Breadcrumb tag */}
              <div className="flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-2 font-mono text-[10px] font-bold tracking-widest text-[#0055FF] self-start sm:self-auto">
                <Terminal size={12} />
                // ENTERPRISE SYSTEM SPECIFICATION
              </div>
            </div>
          </div>

          <main className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 py-12 space-y-14">

            {/* ════════════════════════════════════════
                PROJECT TITLE & DEPLOYMENT BADGE
            ════════════════════════════════════════ */}
            <div className="max-w-3xl space-y-5">
              {/* Title — break-words prevents overflow */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] break-words hyphens-auto">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                {/* Deployment badge */}
                {project.deployed_on && (
                  <div className="inline-flex items-center gap-2.5 border border-[#0055FF] bg-[#090A0F] px-4 py-2 shadow-[0_0_16px_rgba(0,85,255,0.25)]">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                    <span className="font-mono text-[10px] tracking-widest text-[#7C89A8]">
                      DEPLOYED ON:{" "}
                    </span>
                    <span className="font-mono text-[10px] font-bold tracking-widest text-white">
                      {project.deployed_on.toUpperCase()}
                    </span>
                  </div>
                )}

                {/* Image count pill */}
                {allImages.length > 0 && (
                  <div className="inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-2 font-mono text-[10px] tracking-widest text-[#7C89A8]">
                    <ImageIcon size={11} className="text-[#0055FF]" />
                    {allImages.length} ATTACHMENT{allImages.length > 1 ? "S" : ""}
                  </div>
                )}
              </div>
            </div>

            {/* ════════════════════════════════════════
                TWO-COLUMN LAYOUT: HERO + DETAILS
            ════════════════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-10 items-start">

              {/* ── LEFT: Hero Image ── */}
              <div className="space-y-5">
                {/* Primary hero frame */}
                <div className="relative border border-[#1E2538] bg-[#12151E] shadow-[0_0_40px_rgba(0,85,255,0.15)] overflow-hidden">
                  {/* Terminal title bar */}
                  <div className="flex items-center justify-between border-b border-[#1E2538] bg-[#0A0C14] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    </div>
                    <span className="font-mono text-[9px] tracking-widest text-[#455270]">
                      // PRIMARY_PREVIEW
                    </span>
                    <div className="w-16" />
                  </div>

                  {/* Main image */}
                  {allImages.length > 0 ? (
                    <div className="relative aspect-video w-full bg-[#090A0F] overflow-hidden group">
                      <GalleryImage
                        src={allImages[activeImageIndex]}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />

                      {/* Expand View button */}
                      <button
                        onClick={() => openLightbox(activeImageIndex)}
                        className="absolute right-4 top-4 z-20 flex items-center gap-2 border border-[#1E2538] bg-[#090A0F]/90 px-3.5 py-2 font-mono text-[10px] font-bold tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF] hover:shadow-[0_0_12px_rgba(0,85,255,0.3)] transition-all backdrop-blur-sm"
                      >
                        <Maximize2 size={12} /> EXPAND VIEW
                      </button>

                      {/* Carousel arrows (only when multiple images) */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setActiveImageIndex((p) =>
                                p === 0 ? allImages.length - 1 : p - 1,
                              )
                            }
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center border border-[#1E2538] bg-[#090A0F]/80 text-white backdrop-blur hover:border-[#0055FF] hover:bg-[#0055FF] hover:scale-105 transition-all"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            onClick={() =>
                              setActiveImageIndex((p) =>
                                p === allImages.length - 1 ? 0 : p + 1,
                              )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center border border-[#1E2538] bg-[#090A0F]/80 text-white backdrop-blur hover:border-[#0055FF] hover:bg-[#0055FF] hover:scale-105 transition-all"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      {/* Image counter dot indicator */}
                      {allImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {allImages.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIndex(i)}
                              className={`h-1.5 transition-all duration-200 ${
                                i === activeImageIndex
                                  ? "w-5 bg-[#0055FF]"
                                  : "w-1.5 bg-white/30 hover:bg-white/60"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex aspect-video w-full flex-col items-center justify-center bg-[#090A0F] text-[#455270] gap-3">
                      <ImageIcon size={48} className="text-[#0055FF]/30" />
                      <span className="font-mono text-xs tracking-widest">
                        // NO_PREVIEW_AVAILABLE
                      </span>
                    </div>
                  )}

                  {/* Thumbnail strip */}
                  {allImages.length > 1 && (
                    <div className="border-t border-[#1E2538] bg-[#0A0C14] p-3">
                      <div className="flex items-center justify-between mb-2.5 px-0.5">
                        <span className="font-mono text-[9px] tracking-widest text-[#455270]">
                          SYSTEM GALLERY
                        </span>
                        <span className="font-mono text-[9px] tracking-widest text-[#455270]">
                          {activeImageIndex + 1} / {allImages.length}
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                        {allImages.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative flex-shrink-0 h-16 w-24 overflow-hidden border transition-all duration-200 ${
                              activeImageIndex === idx
                                ? "border-[#0055FF] shadow-[0_0_12px_rgba(0,85,255,0.5)] scale-105"
                                : "border-[#1E2538] opacity-50 hover:opacity-80 hover:border-[#2A3552]"
                            }`}
                          >
                            <GalleryImage
                              src={imgUrl}
                              alt={`Thumb ${idx + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── GALLERY GRID (all gallery screenshots) ── */}
                {galleryOnly.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-widest">
                      <span className="flex items-center gap-2 text-[#0055FF]">
                        <Layers size={13} />
                        PROJECT GALLERY &amp; SCREENSHOTS ({galleryOnly.length})
                      </span>
                      <span className="text-[#455270]">CLICK TO EXPAND</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {galleryOnly.map((imgUrl, idx) => {
                        const globalIdx = allImages.indexOf(imgUrl);
                        return (
                          <button
                            key={idx}
                            onClick={() =>
                              openLightbox(
                                globalIdx >= 0 ? globalIdx : idx,
                              )
                            }
                            className={`group relative aspect-video overflow-hidden border bg-[#12151E] transition-all duration-200 ${
                              activeImageIndex === globalIdx
                                ? "border-[#0055FF] shadow-[0_0_20px_rgba(0,85,255,0.35)]"
                                : "border-[#1E2538] hover:border-[#0055FF]/50 hover:shadow-[0_0_14px_rgba(0,85,255,0.2)]"
                            }`}
                          >
                            <GalleryImage
                              src={imgUrl}
                              alt={`Screenshot ${idx + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="font-mono text-[9px] font-bold tracking-widest text-white flex items-center gap-1.5">
                                <Maximize2 size={10} className="text-[#0055FF]" />
                                VIEW #{idx + 1}
                              </span>
                            </div>
                            {/* Index badge */}
                            <div className="absolute top-2 left-2 border border-[#1E2538] bg-[#090A0F]/80 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-[#455270]">
                              {String(idx + 1).padStart(2, "0")}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Details Sidebar ── */}
              <div className="space-y-6">

                {/* Description block */}
                <div className="border border-[#1E2538] bg-[#12151E]">
                  <div className="flex items-center gap-2 border-b border-[#1E2538] bg-[#0A0C14] px-4 py-3">
                    <Terminal size={12} className="text-[#0055FF] flex-shrink-0" />
                    <span className="font-mono text-[9px] font-bold tracking-widest text-[#0055FF]">
                      ARCHITECTURE &amp; SYSTEM DESCRIPTION
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-sm leading-7 text-[#C8D4E8] font-sans whitespace-pre-wrap break-words overflow-wrap-anywhere">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tech stack block */}
                {project.tools && project.tools.length > 0 && (
                  <div className="border border-[#1E2538] bg-[#12151E]">
                    <div className="flex items-center gap-2 border-b border-[#1E2538] bg-[#0A0C14] px-4 py-3">
                      <Cpu size={12} className="text-[#0055FF] flex-shrink-0" />
                      <span className="font-mono text-[9px] font-bold tracking-widest text-[#0055FF]">
                        TECH STACK ({project.tools.length})
                      </span>
                    </div>
                    <div className="p-4 flex flex-wrap gap-2.5">
                      {project.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="border border-[#1E2538] bg-[#090A0F] px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-gray-300 hover:border-[#0055FF]/50 hover:text-white transition-colors"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                {(project.project_link || project.github_link) && (
                  <div className="space-y-3">
                    <div className="font-mono text-[9px] font-bold tracking-widest text-[#455270]">
                      // DEPLOYMENT &amp; SOURCE
                    </div>

                    {project.project_link && (
                      <a
                        href={project.project_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-[#0055FF] px-6 py-4 font-mono text-xs font-bold tracking-widest text-white shadow-[0_0_30px_rgba(0,85,255,0.35)] hover:bg-[#0044cc] hover:shadow-[0_0_45px_rgba(0,85,255,0.6)] transition-all"
                      >
                        <Globe size={16} />
                        LIVE DEPLOYMENT
                        <ExternalLink size={13} className="ml-auto opacity-60" />
                      </a>
                    )}

                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full border border-[#1E2538] bg-[#0A0C14] px-6 py-4 font-mono text-xs font-bold tracking-widest text-[#B8C4DE] hover:border-[#0055FF] hover:text-white hover:shadow-[0_0_18px_rgba(0,85,255,0.2)] transition-all"
                      >
                        <Github size={16} />
                        SOURCE REPO
                        <ExternalLink size={13} className="ml-auto opacity-40" />
                      </a>
                    )}
                  </div>
                )}

                {/* System metadata card */}
                <div className="border border-[#1E2538] bg-[#12151E] p-4 space-y-3">
                  <div className="font-mono text-[9px] font-bold tracking-widest text-[#455270] pb-2 border-b border-[#1E2538]">
                    // SYSTEM_METADATA
                  </div>
                  <div className="space-y-2.5">
                    <MetaRow label="PROJECT_ID" value={project.id.slice(0, 8).toUpperCase()} />
                    {project.deployed_on && (
                      <MetaRow label="PLATFORM" value={project.deployed_on.toUpperCase()} />
                    )}
                    <MetaRow label="STACK_COUNT" value={`${project.tools?.length ?? 0} MODULES`} />
                    <MetaRow label="ATTACHMENTS" value={`${allImages.length} FILES`} />
                    {project.created_at && (
                      <MetaRow
                        label="INDEXED"
                        value={new Date(project.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }).toUpperCase()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </>
      )}

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && allImages.length > 0 && (
        <Lightbox
          images={allImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </div>
  );
}

/* ── Small helper for the metadata sidebar ── */
function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="font-mono text-[9px] tracking-widest text-[#455270] flex-shrink-0">
        {label}
      </span>
      <span className="font-mono text-[9px] font-bold tracking-widest text-[#B8C4DE] text-right break-all">
        {value}
      </span>
    </div>
  );
}
