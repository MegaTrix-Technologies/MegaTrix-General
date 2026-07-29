import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layers, ShieldCheck, Cpu, Terminal, ArrowRight, ArrowLeft, Code2, Database, Network, Server } from "lucide-react";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/architecture")({
  component: ArchitecturePage,
});

function ArchitecturePage() {
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("mt_preloader_seen");
    }
    return false;
  });

  const handlePreloaderComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mt_preloader_seen", "true");
    }
    setLoading(false);
  };

  if (loading) return <Preloader onComplete={handlePreloaderComplete} />;

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

      {/* HERO / HEADER */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-10 md:py-16">
        <div className="mb-6 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-1.5 font-mono text-xs md:text-sm font-bold tracking-widest text-[#0055FF]">
          <Terminal size={14} />
          SYSTEM ARCHITECTURE & CORE COMPETENCIES
        </div>
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight md:text-6xl text-white">
          ENGINEERED FOR <span className="text-[#0055FF] glow-text">UNCOMPROMISING SCALE</span>
        </h1>
        <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-[#CBD5E1]">
          Our engineering principles blend retro-futuristic precision with modern, production-grade cloud microservices, vector intelligence, and resilient event-driven architectures.
        </p>
      </section>

      {/* COMPETENCIES GRID */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 pb-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              Icon: Layers,
              title: "Full-Stack Ecosystems",
              tag: "DISTRIBUTED SYSTEMS",
              body: "High-performance web applications built using Next.js, React, Node.js, and scalable multi-tenant databases.",
              details: ["React / Next.js SSR & CSR", "TypeScript Type Safety", "Express & FastAPI APIs", "REST & GraphQL Services"],
            },
            {
              Icon: ShieldCheck,
              title: "Secure Infrastructure",
              tag: "HARDENED BACKEND",
              body: "Hardened authentication mechanisms, role-based access control, IVR fraud verification, and encrypted data pipelines.",
              details: ["JWT & RLS Security", "BullMQ Event Queues", "Redis Distributed Caching", "Rate-limiting Gateways"],
            },
            {
              Icon: Cpu,
              title: "AI & Vector Pipelines",
              tag: "MACHINE LEARNING",
              body: "Custom machine learning models, retrieval-augmented generation (RAG) systems, Naive Bayes classifiers, and NLP processing.",
              details: ["TF-IDF & Naive Bayes NLP", "Scikit-Learn & PyTorch", "Levenshtein String Matching", "FastAPI AI Inference"],
            },
            {
              Icon: Database,
              title: "Data Persistence & Caching",
              tag: "HIGH-THROUGHPUT STORAGE",
              body: "Multi-layered database systems featuring PostgreSQL, Supabase RLS, MongoDB multi-tenant schemas, and in-memory LRU caches.",
              details: ["PostgreSQL & Supabase", "MongoDB Indexing", "Redis Cache Invalidation", "Prisma & Mongoose ORM"],
            },
            {
              Icon: Network,
              title: "Webhooks & Automation",
              tag: "REAL-TIME EVENTS",
              body: "Asynchronous webhook consumers for Shopify, WooCommerce, and payment processors with retry guarantees.",
              details: ["Real-time Webhook Listeners", "Shopify & WooCommerce Sync", "IVR Voice Telephony Integration", "Automated Email Alerts"],
            },
            {
              Icon: Server,
              title: "Cloud & DevOps",
              tag: "INFRASTRUCTURE DEPLOYMENT",
              body: "Containerized application deployment using Docker, Vercel edge networks, AWS cloud infrastructure, and Render background workers.",
              details: ["Vercel Edge Functions", "Docker Containers", "AWS Cloud Services", "CI/CD Pipeline Automation"],
            },
          ].map(({ Icon, title, tag, body, details }) => (
            <div
              key={title}
              className="group border-2 border-[#1E2538] bg-black p-8 transition-all hover:border-[#0055FF] hover:shadow-[0_0_35px_rgba(0,85,255,0.3)] rounded-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#1E2538] pb-3 mb-4">
                  <Icon size={32} className="text-[#0055FF]" />
                  <span className="font-mono text-xs font-bold tracking-widest text-[#0055FF]">{tag}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-extrabold text-white group-hover:text-[#0055FF] transition-colors">{title}</h3>
                <p className="mt-3.5 text-sm md:text-base leading-relaxed text-[#CBD5E1]">{body}</p>
              </div>

              <div className="mt-8 border-t border-[#1E2538] pt-4">
                <div className="mb-3 font-mono text-xs font-bold tracking-widest text-[#0055FF]">SPECIFICATIONS</div>
                <ul className="space-y-2 text-xs md:text-sm font-medium text-[#E2E8F0]">
                  {details.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0055FF]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CALL TO ACTION */}
        <div className="mt-16 border-2 border-[#1E2538] bg-black p-10 text-center rounded-sm">
          <h3 className="text-2xl font-extrabold text-white">READY TO BUILD YOUR NEXT SYSTEM?</h3>
          <p className="mt-2.5 text-sm md:text-base text-[#CBD5E1]">
            Initiate a project transmission or explore our catalog of completed architecture solutions.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#0055FF] px-7 py-3.5 font-sans text-xs md:text-sm font-bold tracking-widest text-white shadow-[0_0_20px_rgba(0,85,255,0.4)] hover:bg-[#0044cc] transition-all"
            >
              <Code2 size={16} />
              CONTACT US
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-7 py-3.5 font-sans text-xs md:text-sm font-bold tracking-widest text-white hover:border-[#0055FF] hover:text-[#0055FF] transition-all"
            >
              EXPLORE PROJECTS
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <Footer />
    </div>
  );
}
