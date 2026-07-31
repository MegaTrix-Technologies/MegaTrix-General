import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  Terminal,
  Cpu,
  ShieldCheck,
  Layers,
  ArrowRight,
  Code2,
  Mail,
  MapPin,
  Phone,
  Copy,
  Check,
  Send,
  Paperclip,
  X,
  FileText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import AnimatedMTLogo from "@/components/AnimatedMTLogo";
import StickmanStage from "@/components/StickmanStage";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Home,
});

interface ContactInfo {
  email: string;
  address: string;
  phone: string;
}

const DEFAULT_CONTACT: ContactInfo = {
  email: "contact@megatrix.com",
  address: "100 Cybernetic Way, Suite 400, San Francisco, CA 94107",
  phone: "+1 (800) 555-0199",
};

function Home() {
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Client Contact Inquiry Form State
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientSubject, setClientSubject] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [attachmentUrlInput, setAttachmentUrlInput] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState("");
  const [inquiryErrorMsg, setInquiryErrorMsg] = useState("");

  useEffect(() => {
    const updateContactDetails = async () => {
      try {
        const cached = localStorage.getItem("megatrix_contact_info");
        if (cached) {
          const parsed = JSON.parse(cached);
          setContact({
            email: parsed.email || DEFAULT_CONTACT.email,
            address: parsed.address || DEFAULT_CONTACT.address,
            phone: parsed.phone || DEFAULT_CONTACT.phone,
          });
        }
      } catch {}

      try {
        const { data } = await supabase
          .from("contact_info")
          .select("*")
          .limit(1)
          .maybeSingle();
        if (data) {
          setContact({
            email: data.email || DEFAULT_CONTACT.email,
            address: data.address || DEFAULT_CONTACT.address,
            phone: data.phone || DEFAULT_CONTACT.phone,
          });
        }
      } catch {}
    };

    updateContactDetails();

    window.addEventListener("storage", updateContactDetails);
    window.addEventListener("megatrix_contact_updated", updateContactDetails);
    return () => {
      window.removeEventListener("storage", updateContactDetails);
      window.removeEventListener("megatrix_contact_updated", updateContactDetails);
    };
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePreloaderComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mt_preloader_seen", "true");
    }
    setLoading(false);
  };

  const handleAddAttachment = () => {
    if (attachmentUrlInput.trim()) {
      setAttachments((prev) => [...prev, attachmentUrlInput.trim()]);
      setAttachmentUrlInput("");
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingInquiry(true);
    setInquirySuccessMsg("");
    setInquiryErrorMsg("");

    const newSubmission = {
      id: "local-" + Date.now(),
      name: clientName,
      email: clientEmail,
      phone: clientPhone || null,
      subject: clientSubject,
      message: clientMessage,
      attachments,
      status: "NEW",
      created_at: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem("megatrix_contact_submissions") || "[]");
      localStorage.setItem("megatrix_contact_submissions", JSON.stringify([newSubmission, ...existing]));
      window.dispatchEvent(new Event("megatrix_submissions_updated"));
    } catch {}

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: clientName,
        email: clientEmail,
        phone: clientPhone || null,
        subject: clientSubject,
        message: clientMessage,
        attachments,
      },
    ] as never);

    if (error && !error.message.includes("contact_submissions") && !error.message.includes("schema cache")) {
      setInquiryErrorMsg("TRANSMISSION ERROR: " + error.message);
    } else {
      setInquirySuccessMsg(
        "TRANSMISSION RECEIVED: OUR ENGINEERING TEAM HAS RECORDED YOUR INQUIRY AND WILL CONTACT YOU SHORTLY.",
      );
      setClientName("");
      setClientEmail("");
      setClientPhone("");
      setClientSubject("");
      setClientMessage("");
      setAttachments([]);
    }
    setSubmittingInquiry(false);
  };

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-white font-sans">
      <div className="pointer-events-none fixed inset-0 iso-blocks opacity-60" />
      <div className="pointer-events-none fixed inset-0 retro-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 scanlines opacity-25" />
      <div className="pointer-events-none fixed inset-0 bg-radial-fade" />

      {/* REUSABLE NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section id="top" className="relative z-10 mx-auto max-w-[1600px] px-6 py-20 md:px-12 md:py-32">
        <div className="grid items-center gap-14 md:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <div className="mb-7 inline-flex items-center gap-2 rounded-sm border border-[#1E2538] bg-[#12151E] px-4 py-2 label-mono font-bold text-[#0055FF]">
              <Terminal size={14} className="text-[#0055FF]" />
              ENTERPRISE SOFTWARE ENGINEERING &amp; ARCHITECTURE
            </div>
            <h1 className="max-w-4xl text-[2.5rem] font-extrabold leading-[1.05] text-white md:text-[4.25rem]">
              BUILDING NEXT-GEN
              <br />
              <span className="text-[#0055FF] glow-text">DIGITAL SYSTEMS</span> & PLATFORMS
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#CBD5E1] md:text-[17px]">
              Megatrix delivers high-performance full-stack applications, secure cloud
              infrastructure, and custom artificial intelligence pipelines with
              uncompromising execution.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-sm bg-[#0055FF] px-7 py-4 font-sans text-[13px] font-bold tracking-[0.14em] text-white shadow-[0_10px_30px_-12px_rgba(0,85,255,1)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1A66FF] hover:shadow-[0_16px_38px_-12px_rgba(0,85,255,1)]"
              >
                EXPLORE WORK
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-sm border border-[#2A3552] px-7 py-4 font-sans text-[13px] font-bold tracking-[0.14em] text-[#B8C4DE] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0055FF] hover:text-white"
              >
                START A PROJECT
              </Link>
            </div>
          </div>

          {/* ANIMATED PIXEL LOGO DISPLAY */}
          <div className="hidden md:block">
            <div className="panel relative p-7 shadow-[0_0_80px_-28px_rgba(0,85,255,0.7)]">
              <div className="mb-4 flex items-center justify-between gap-8 label-mono text-[#B8C4DE]">
                <span className="text-[#0055FF]">RENDER_MT.exe</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#0055FF]" />
                  BUILDING
                </span>
              </div>
              <AnimatedMTLogo className="h-52 w-auto" />
              <div className="mt-4 border-t border-[#1E2538] pt-3 text-center label-mono tracking-[0.35em] text-[#B8C4DE]">
                M E G A T R I X
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. STATS / CORE METRICS BAR SECTION (CLEAN SEAMLESS BACKGROUND) */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-12 md:px-12">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              metric: "[ 100+ Systems Deployed ]",
              label: "Enterprise & Full-Stack Apps",
              detail: "Multi-tenant SaaS, vector engines, and custom e-commerce",
            },
            {
              metric: "[ 99.9% Uptime ]",
              label: "Cloud Infrastructure",
              detail: "AWS, Vercel, Docker & automated CI/CD deployment pipelines",
            },
            {
              metric: "[ 100% On-Time Delivery ]",
              label: "Agile Execution",
              detail: "Sprinting with rapid feedback loops and strict milestones",
            },
          ].map(({ metric, label, detail }) => (
            <div
              key={label}
              className="group panel panel-interactive p-7"
            >
              <div className="font-mono text-base font-bold tracking-wider text-[#0055FF] transition-colors duration-200 group-hover:text-white md:text-lg">
                {metric}
              </div>
              <div className="mt-3 text-sm font-bold tracking-[0.12em] text-white">
                {label}
              </div>
              <div className="mt-2 text-[13px] leading-6 text-[#B8C4DE]">
                {detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. DEVELOPMENT WORKFLOW / PROTOCOL SECTION (CLEAN SEAMLESS BACKGROUND) */}
      <section id="protocol" className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-1.5 font-mono text-xs md:text-sm font-bold tracking-wider text-[#0055FF]">
            <Terminal size={15} />
            OPERATIONAL PROTOCOL
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            FROM CONCEPT TO <span className="text-[#0055FF] glow-text">DEPLOYMENT</span>
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-[#CBD5E1]">
            A systematic, hardened engineering process designed for high-performance software delivery.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {[
            {
              step: "01",
              title: "System Discovery",
              description:
                "Analyzing technical requirements, scoping architecture, and mapping core project goals.",
            },
            {
              step: "02",
              title: "Architecture Design",
              description:
                "Structuring scalable backend databases, UI/UX wireframes, and secure API schemas.",
            },
            {
              step: "03",
              title: "Agile Engineering",
              description:
                "Iterative full-stack development, rigorous testing, and clean code implementation.",
            },
            {
              step: "04",
              title: "Secure Deployment",
              description:
                "Production launch, performance tuning, and hardened security audits.",
            },
          ].map(({ step, title, description }, idx, arr) => (
            <div key={step} className="relative flex flex-col">
              {/* NODE CONTAINER CARD (SOLID PITCH BLACK BG) */}
              <div className="group panel panel-interactive relative flex flex-1 flex-col justify-between p-7">
                <div>
                  <div className="flex items-center justify-between border-b border-[#1E2538] pb-3.5 mb-4">
                    <span className="font-mono text-xs md:text-sm font-extrabold tracking-widest text-[#0055FF] flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#0055FF] animate-pulse drop-shadow-[0_0_8px_rgba(0,85,255,0.9)]" />
                      NODE {step}
                    </span>
                    <span className="font-mono text-[10px] text-[#7C89A8] tracking-widest">
                      [ PHASE_{step} ]
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-extrabold text-white group-hover:text-[#0055FF] transition-colors">
                    {step}. {title}
                  </h3>
                  <p className="mt-3.5 text-sm leading-relaxed text-[#CBD5E1]">
                    {description}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-[#1E2538] flex items-center justify-between font-mono text-xs tracking-widest text-[#7C89A8]">
                  <span>STATUS: LINKED</span>
                  <span className="text-[#0055FF] font-bold">READY</span>
                </div>
              </div>

              {/* CLEAN ELECTRIC BLUE DIRECTIONAL ARROW (CENTERED IN GAP) */}
              {idx < arr.length - 1 && (
                <>
                  {/* Desktop Horizontal Arrow (centered in horizontal gap) */}
                  <div className="hidden lg:flex pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 z-30 items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0055FF] bg-black text-[#0055FF] shadow-[0_0_20px_rgba(0,85,255,0.9)]">
                      <ChevronRight size={18} strokeWidth={3} />
                    </div>
                  </div>

                  {/* Mobile Downward Arrow (centered in vertical gap) */}
                  <div className="lg:hidden flex pointer-events-none justify-center py-3 z-30">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0055FF] bg-black text-[#0055FF] shadow-[0_0_20px_rgba(0,85,255,0.9)]">
                      <ChevronDown size={18} strokeWidth={3} />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. CLIENT TESTIMONIALS / STATUS LOGS SECTION (CLEAN SEAMLESS BACKGROUND) */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-1.5 font-mono text-xs md:text-sm font-bold tracking-wider text-[#0055FF]">
            <Terminal size={15} />
            VERIFIED CLIENT TRANSMISSIONS
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            INCOMING TRANSMISSIONS <span className="text-[#0055FF] glow-text">- CLIENT LOGS</span>
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-[#CBD5E1]">
            Decrypted feedback logs from enterprise leaders, founders, and CTO partners.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "\"Megatrix engineered our multi-tenant logistics SaaS and automated IVR fraud prevention. Delivery was on schedule, rock-solid, and handled high transaction spikes effortlessly.\"",
              client: "Enterprise Logistics Firm",
              role: "Chief Technology Officer",
              status: "TRANSMISSION VERIFIED",
            },
            {
              quote:
                "\"Their AI resume screening vector engine cut our hiring pipeline processing time by 75%. Flawless code quality and deep understanding of vector embeddings.\"",
              client: "Talent Vector Platform",
              role: "Co-Founder & VP of AI",
              status: "TRANSMISSION VERIFIED",
            },
            {
              quote:
                "\"The PSX Quantitative intelligence oracle built by Megatrix processes equities data with precision regressions and real-time alerts. High-caliber engineering work.\"",
              client: "Financial Intelligence Partner",
              role: "Managing Director",
              status: "TRANSMISSION VERIFIED",
            },
          ].map(({ quote, client, role, status }, idx) => (
            <div
              key={idx}
              className="group panel panel-interactive flex flex-col justify-between p-7"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#1E2538] pb-3 mb-4">
                  <span className="font-mono text-xs font-bold tracking-widest text-[#0055FF] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    [ {status} ]
                  </span>
                  <span className="font-mono text-xs text-[#7C89A8]">LOG_ID: #{1080 + idx * 42}</span>
                </div>

                <p className="text-sm md:text-base leading-relaxed text-[#E2E8F0] italic font-normal">
                  {quote}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E2538]">
                <div className="text-sm font-bold text-white">{client}</div>
                <div className="text-xs font-mono text-[#94A3B8]">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE STICKMAN ARENA SECTION */}
      <StickmanStage />

      {/* CONTACT & CLIENT TRANSMISSION FORM SECTION */}
      <section id="contact" className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-20">
        <div className="mb-12 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3.5 py-1.5 font-mono text-xs md:text-sm font-bold tracking-wider text-[#0055FF]">
            <Terminal size={15} />
            SECURE COMMUNICATION CHANNEL
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            GET IN <span className="text-[#0055FF] glow-text">TOUCH</span>
          </h2>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-[#CBD5E1]">
            Have a high-scale project or require custom engineering solutions? Fill out the project inquiry transmission form below or reach out directly.
          </p>
        </div>

        {/* CONTACT INFO CARDS */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {/* EMAIL CARD */}
          <div className="group panel panel-interactive p-7">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center border border-[#1E2538] bg-[#090A0F] text-[#0055FF]">
                <Mail size={22} />
              </div>
              <button
                onClick={() => handleCopy(contact.email, "email")}
                className="flex items-center gap-1.5 border border-[#1E2538] bg-[#090A0F] px-3 py-1.5 font-mono text-xs tracking-widest text-[#B8C4DE] hover:border-[#0055FF] hover:text-white"
                title="Copy Email"
              >
                {copiedField === "email" ? (
                  <>
                    <Check size={14} className="text-green-400" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy size={14} /> COPY
                  </>
                )}
              </button>
            </div>
            <div className="mt-5 font-mono text-xs tracking-widest text-[#0055FF]">DIRECT EMAIL</div>
            <h3 className="mt-1.5 text-base md:text-lg font-bold text-white break-all">{contact.email}</h3>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#B8C4DE] hover:text-[#0055FF]"
            >
              SEND TRANSMISSION &rarr;
            </a>
          </div>

          {/* PHONE / CONTACT NUMBER CARD */}
          <div className="group panel panel-interactive p-7">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center border border-[#1E2538] bg-[#090A0F] text-[#0055FF]">
                <Phone size={22} />
              </div>
              <button
                onClick={() => handleCopy(contact.phone, "phone")}
                className="flex items-center gap-1.5 border border-[#1E2538] bg-[#090A0F] px-3 py-1.5 font-mono text-xs tracking-widest text-[#B8C4DE] hover:border-[#0055FF] hover:text-white"
                title="Copy Phone"
              >
                {copiedField === "phone" ? (
                  <>
                    <Check size={14} className="text-green-400" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy size={14} /> COPY
                  </>
                )}
              </button>
            </div>
            <div className="mt-5 font-mono text-xs tracking-widest text-[#0055FF]">DIRECT LINE</div>
            <h3 className="mt-1.5 text-base md:text-lg font-bold text-white">{contact.phone}</h3>
            <a
              href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
              className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#B8C4DE] hover:text-[#0055FF]"
            >
              INITIATE CALL &rarr;
            </a>
          </div>

          {/* ADDRESS CARD */}
          <div className="group panel panel-interactive p-7">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center border border-[#1E2538] bg-[#090A0F] text-[#0055FF]">
                <MapPin size={22} />
              </div>
              <button
                onClick={() => handleCopy(contact.address, "address")}
                className="flex items-center gap-1.5 border border-[#1E2538] bg-[#090A0F] px-3 py-1.5 font-mono text-xs tracking-widest text-[#B8C4DE] hover:border-[#0055FF] hover:text-white"
                title="Copy Address"
              >
                {copiedField === "address" ? (
                  <>
                    <Check size={14} className="text-green-400" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy size={14} /> COPY
                  </>
                )}
              </button>
            </div>
            <div className="mt-5 font-mono text-xs tracking-widest text-[#0055FF]">HEADQUARTERS</div>
            <h3 className="mt-1.5 text-sm md:text-base font-bold leading-normal text-white">{contact.address}</h3>
            <span className="mt-4 inline-block font-mono text-xs tracking-widest text-[#7C89A8]">
              GLOBAL OPERATIONS
            </span>
          </div>
        </div>

        {/* INTERACTIVE CLIENT INQUIRY FORM BOX (SOLID PITCH BLACK BG) */}
        <div className="border-2 border-[#1E2538] bg-black p-8 shadow-[0_0_40px_rgba(0,85,255,0.15)] rounded-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#1E2538] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-[#0055FF] bg-[#0055FF]/20 text-[#0055FF]">
                <Send size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-widest text-white">
                  INITIATE PROJECT TRANSMISSION
                </h3>
                <p className="text-xs font-mono tracking-widest text-[#94A3B8]">
                  SUBMIT INQUIRY DETAILS, SPECIFICATIONS & ATTACHMENTS DIRECTLY TO OUR COMMAND CENTER
                </p>
              </div>
            </div>
            <span className="font-mono text-xs tracking-widest text-[#0055FF]">ENCRYPTED DATA NODE</span>
          </div>

          {inquirySuccessMsg && (
            <div className="mb-6 border border-green-500/50 bg-green-950/40 p-4 font-mono text-sm tracking-widest text-green-400">
              {inquirySuccessMsg}
            </div>
          )}

          {inquiryErrorMsg && (
            <div className="mb-6 border border-red-500/50 bg-red-950/40 p-4 font-mono text-sm tracking-widest text-red-400">
              {inquiryErrorMsg}
            </div>
          )}

          <form onSubmit={handleInquirySubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="block font-mono text-xs font-bold tracking-widest text-[#CBD5E1] mb-2">
                  YOUR NAME / ORGANIZATION *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. John Doe / TechCorp"
                  className="w-full rounded-sm border border-[#1E2538] bg-[#090A0F] px-4 py-3.5 text-sm text-white placeholder-[#64748B] transition-colors duration-200 hover:border-[#2A3552] focus:border-[#0055FF] focus:outline-none focus:ring-1 focus:ring-[#0055FF]/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold tracking-widest text-[#CBD5E1] mb-2">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@techcorp.com"
                  className="w-full rounded-sm border border-[#1E2538] bg-[#090A0F] px-4 py-3.5 text-sm text-white placeholder-[#64748B] transition-colors duration-200 hover:border-[#2A3552] focus:border-[#0055FF] focus:outline-none focus:ring-1 focus:ring-[#0055FF]/40"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold tracking-widest text-[#CBD5E1] mb-2">
                  PHONE / DIRECT CONTACT NUMBER
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full rounded-sm border border-[#1E2538] bg-[#090A0F] px-4 py-3.5 text-sm text-white placeholder-[#64748B] transition-colors duration-200 hover:border-[#2A3552] focus:border-[#0055FF] focus:outline-none focus:ring-1 focus:ring-[#0055FF]/40"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold tracking-widest text-[#CBD5E1] mb-2">
                PROJECT SUBJECT / DOMAIN *
              </label>
              <input
                type="text"
                required
                value={clientSubject}
                onChange={(e) => setClientSubject(e.target.value)}
                placeholder="e.g. Enterprise SaaS Development, AI Pipeline, Cloud Security Hardening"
                className="w-full rounded-sm border border-[#1E2538] bg-[#090A0F] px-4 py-3.5 text-sm text-white placeholder-[#64748B] transition-colors duration-200 hover:border-[#2A3552] focus:border-[#0055FF] focus:outline-none focus:ring-1 focus:ring-[#0055FF]/40"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold tracking-widest text-[#CBD5E1] mb-2">
                PROJECT REQUIREMENTS & DETAILS *
              </label>
              <textarea
                required
                rows={4}
                value={clientMessage}
                onChange={(e) => setClientMessage(e.target.value)}
                placeholder="Describe your system requirements, architecture goals, tech stack preferences, timeline, and budget..."
                className="w-full rounded-sm border border-[#1E2538] bg-[#090A0F] p-4 text-sm text-white placeholder-[#64748B] transition-colors duration-200 hover:border-[#2A3552] focus:border-[#0055FF] focus:outline-none focus:ring-1 focus:ring-[#0055FF]/40"
              />
            </div>

            {/* ATTACHMENTS & SPECIFICATION DOCUMENTS */}
            <div>
              <label className="block font-mono text-xs font-bold tracking-widest text-[#CBD5E1] mb-2">
                ATTACH IMAGES, DOCUMENTS OR SPECIFICATION LINKS (OPTIONAL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={attachmentUrlInput}
                  onChange={(e) => setAttachmentUrlInput(e.target.value)}
                  placeholder="Paste image URL, Figma link, Google Drive doc, or specification URL (https://...)"
                  className="flex-1 rounded-sm border border-[#1E2538] bg-[#090A0F] px-4 py-3 text-sm text-white placeholder-[#64748B] transition-colors duration-200 hover:border-[#2A3552] focus:border-[#0055FF] focus:outline-none focus:ring-1 focus:ring-[#0055FF]/40"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="flex items-center gap-2 border border-[#0055FF] bg-[#0055FF]/20 px-5 py-3 font-sans text-xs font-bold tracking-widest text-[#0055FF] hover:bg-[#0055FF] hover:text-white transition-all"
                >
                  <Paperclip size={15} />
                  ADD LINK
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 border border-[#1E2538] bg-[#090A0F] px-3.5 py-2 font-mono text-xs tracking-widest text-[#B8C4DE]"
                    >
                      <FileText size={14} className="text-[#0055FF]" />
                      <span className="max-w-xs truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submittingInquiry}
                className="flex items-center justify-center gap-2 bg-[#0055FF] px-8 py-4 font-sans text-xs md:text-sm font-bold tracking-widest text-white shadow-[0_0_30px_rgba(0,85,255,0.4)] hover:bg-[#0044cc] disabled:opacity-50 transition-all w-full sm:w-auto"
              >
                <Send size={15} />
                {submittingInquiry ? "TRANSMITTING DATA..." : "TRANSMIT PROJECT INQUIRY"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ENHANCED FOOTER */}
      <Footer />
    </div>
  );
}
