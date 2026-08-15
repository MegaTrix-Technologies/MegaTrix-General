import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  Terminal,
  Mail,
  MapPin,
  Phone,
  Copy,
  Check,
  Send,
  Paperclip,
  X,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import MTLogo from "@/components/MTLogo";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | MegaTrix" },
      { name: "description", content: "Initiate project transmission with the MegaTrix enterprise software engineering team." },
      { property: "og:title", content: "Contact | MegaTrix" },
    ],
  }),
  component: ContactPage,
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

function ContactPage() {
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Client Contact Form State
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
    <div className="relative min-h-screen bg-[var(--mt-bg)] text-[var(--mt-text-heading)]">
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
          className="group inline-flex items-center gap-2.5 border border-[var(--mt-border)] bg-[var(--mt-bg-card)] px-4 py-2 font-mono text-xs font-bold tracking-widest text-[var(--mt-text-secondary)] hover:text-[var(--mt-text-heading)] hover:border-[var(--mt-blue)] hover:shadow-[0_0_15px_rgba(0,85,255,0.2)] transition-all rounded-sm"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5 text-[var(--mt-blue)]" />
          RETURN TO BASE
        </Link>
      </div>

      {/* CONTACT SECTION */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-8 md:px-12 py-10 md:py-16">
        <div className="mb-14 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-sm border border-[var(--mt-border)] bg-[var(--mt-bg-card)] px-3.5 py-1.5 font-mono text-xs md:text-sm font-bold tracking-wider text-[var(--mt-blue)]">
            <Terminal size={15} />
            SECURE COMMUNICATION CHANNEL
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            GET IN <span className="text-[var(--mt-blue)] glow-text">TOUCH</span>
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[var(--mt-text-secondary)]">
            Have a high-scale project or require custom engineering solutions? Fill out the project inquiry transmission form below or reach out directly via our verified communication nodes.
          </p>
        </div>

        {/* CONTACT INFO CARDS */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {/* EMAIL CARD */}
          <div className="group border border-[var(--mt-border)] bg-[var(--mt-bg-card)] p-6 transition-all hover:border-[var(--mt-blue)] hover:shadow-[0_0_30px_rgba(0,85,255,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center border border-[var(--mt-border)] bg-[var(--mt-bg)] text-[var(--mt-blue)]">
                <Mail size={20} />
              </div>
              <button
                onClick={() => handleCopy(contact.email, "email")}
                className="flex items-center gap-1.5 border border-[var(--mt-border)] bg-[var(--mt-bg)] px-2.5 py-1 text-[9px] tracking-widest text-[var(--mt-text-secondary)] hover:border-[var(--mt-blue)] hover:text-[var(--mt-text-heading)]"
                title="Copy Email"
              >
                {copiedField === "email" ? (
                  <>
                    <Check size={12} className="text-green-400" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy size={12} /> COPY
                  </>
                )}
              </button>
            </div>
            <div className="mt-5 text-[10px] tracking-widest text-[var(--mt-blue)]">DIRECT EMAIL</div>
            <h3 className="mt-1 text-sm font-bold text-[var(--mt-text-heading)] break-all">{contact.email}</h3>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-widest text-[var(--mt-text-secondary)] hover:text-[var(--mt-blue)]"
            >
              SEND TRANSMISSION &rarr;
            </a>
          </div>

          {/* PHONE CARD */}
          <div className="group border border-[var(--mt-border)] bg-[var(--mt-bg-card)] p-6 transition-all hover:border-[var(--mt-blue)] hover:shadow-[0_0_30px_rgba(0,85,255,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center border border-[var(--mt-border)] bg-[var(--mt-bg)] text-[var(--mt-blue)]">
                <Phone size={20} />
              </div>
              <button
                onClick={() => handleCopy(contact.phone, "phone")}
                className="flex items-center gap-1.5 border border-[var(--mt-border)] bg-[var(--mt-bg)] px-2.5 py-1 text-[9px] tracking-widest text-[var(--mt-text-secondary)] hover:border-[var(--mt-blue)] hover:text-[var(--mt-text-heading)]"
                title="Copy Phone"
              >
                {copiedField === "phone" ? (
                  <>
                    <Check size={12} className="text-green-400" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy size={12} /> COPY
                  </>
                )}
              </button>
            </div>
            <div className="mt-5 text-[10px] tracking-widest text-[var(--mt-blue)]">DIRECT LINE</div>
            <h3 className="mt-1 text-sm font-bold text-[var(--mt-text-heading)]">{contact.phone}</h3>
            <a
              href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
              className="mt-4 inline-flex items-center gap-1.5 text-[10px] tracking-widest text-[var(--mt-text-secondary)] hover:text-[var(--mt-blue)]"
            >
              INITIATE CALL &rarr;
            </a>
          </div>

          {/* ADDRESS CARD */}
          <div className="group border border-[var(--mt-border)] bg-[var(--mt-bg-card)] p-6 transition-all hover:border-[var(--mt-blue)] hover:shadow-[0_0_30px_rgba(0,85,255,0.2)]">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center border border-[var(--mt-border)] bg-[var(--mt-bg)] text-[var(--mt-blue)]">
                <MapPin size={20} />
              </div>
              <button
                onClick={() => handleCopy(contact.address, "address")}
                className="flex items-center gap-1.5 border border-[var(--mt-border)] bg-[var(--mt-bg)] px-2.5 py-1 text-[9px] tracking-widest text-[var(--mt-text-secondary)] hover:border-[var(--mt-blue)] hover:text-[var(--mt-text-heading)]"
                title="Copy Address"
              >
                {copiedField === "address" ? (
                  <>
                    <Check size={12} className="text-green-400" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy size={12} /> COPY
                  </>
                )}
              </button>
            </div>
            <div className="mt-5 text-[10px] tracking-widest text-[var(--mt-blue)]">HEADQUARTERS</div>
            <h3 className="mt-1 text-xs font-bold leading-normal text-[var(--mt-text-heading)]">{contact.address}</h3>
            <span className="mt-4 inline-block text-[10px] tracking-widest text-[var(--mt-text-muted)]">
              GLOBAL OPERATIONS
            </span>
          </div>
        </div>

        {/* INTERACTIVE CLIENT INQUIRY FORM BOX */}
        <div
          className="border-2 p-8 shadow-md rounded-sm transition-colors duration-200"
          style={{ backgroundColor: "var(--mt-form-box-bg)", borderColor: "var(--mt-form-box-border)" }}
        >
          <div
            className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b pb-4"
            style={{ borderBottomColor: "var(--mt-form-box-border)" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-[var(--mt-blue)] bg-[var(--mt-blue)]/20 text-[var(--mt-blue)]">
                <Send size={16} />
              </div>
              <div>
                <h3
                  className="text-sm font-bold tracking-widest"
                  style={{ color: "var(--mt-form-box-header)" }}
                >
                  INITIATE PROJECT TRANSMISSION
                </h3>
                <p
                  className="text-[10px] tracking-widest"
                  style={{ color: "var(--mt-form-box-subtext)" }}
                >
                  SUBMIT INQUIRY DETAILS, SPECIFICATIONS & ATTACHMENTS DIRECTLY TO OUR COMMAND CENTER
                </p>
              </div>
            </div>
            <span className="text-[10px] tracking-widest text-[var(--mt-blue)]">ENCRYPTED DATA NODE</span>
          </div>

          {inquirySuccessMsg && (
            <div className="mb-6 border border-green-500/50 bg-green-950/40 p-4 text-xs tracking-widest text-green-400">
              {inquirySuccessMsg}
            </div>
          )}

          {inquiryErrorMsg && (
            <div className="mb-6 border border-red-500/50 bg-red-950/40 p-4 text-xs tracking-widest text-red-400">
              {inquiryErrorMsg}
            </div>
          )}

          <form onSubmit={handleInquirySubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label
                  className="block text-[10px] font-bold tracking-widest mb-2"
                  style={{ color: "var(--mt-form-label)" }}
                >
                  YOUR NAME / ORGANIZATION *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. John Doe / TechCorp"
                  className="w-full rounded-sm border px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--mt-blue)]"
                  style={{
                    backgroundColor: "var(--mt-form-input-bg)",
                    borderColor: "var(--mt-form-input-border)",
                    color: "var(--mt-form-input-text)",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-[10px] font-bold tracking-widest mb-2"
                  style={{ color: "var(--mt-form-label)" }}
                >
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@techcorp.com"
                  className="w-full rounded-sm border px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--mt-blue)]"
                  style={{
                    backgroundColor: "var(--mt-form-input-bg)",
                    borderColor: "var(--mt-form-input-border)",
                    color: "var(--mt-form-input-text)",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-[10px] font-bold tracking-widest mb-2"
                  style={{ color: "var(--mt-form-label)" }}
                >
                  PHONE / DIRECT CONTACT NUMBER
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 (555) 019-2831"
                  className="w-full rounded-sm border px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--mt-blue)]"
                  style={{
                    backgroundColor: "var(--mt-form-input-bg)",
                    borderColor: "var(--mt-form-input-border)",
                    color: "var(--mt-form-input-text)",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[10px] font-bold tracking-widest mb-2"
                style={{ color: "var(--mt-form-label)" }}
              >
                PROJECT SUBJECT / DOMAIN *
              </label>
              <input
                type="text"
                required
                value={clientSubject}
                onChange={(e) => setClientSubject(e.target.value)}
                placeholder="e.g. Enterprise SaaS Development, AI Pipeline, Cloud Security Hardening"
                className="w-full rounded-sm border px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--mt-blue)]"
                style={{
                  backgroundColor: "var(--mt-form-input-bg)",
                  borderColor: "var(--mt-form-input-border)",
                  color: "var(--mt-form-input-text)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-[10px] font-bold tracking-widest mb-2"
                style={{ color: "var(--mt-form-label)" }}
              >
                PROJECT REQUIREMENTS & DETAILS *
              </label>
              <textarea
                required
                rows={4}
                value={clientMessage}
                onChange={(e) => setClientMessage(e.target.value)}
                placeholder="Describe your system requirements, architecture goals, tech stack preferences, timeline, and budget..."
                className="w-full rounded-sm border p-4 text-xs font-semibold focus:outline-none focus:border-[var(--mt-blue)]"
                style={{
                  backgroundColor: "var(--mt-form-input-bg)",
                  borderColor: "var(--mt-form-input-border)",
                  color: "var(--mt-form-input-text)",
                }}
              />
            </div>

            {/* ATTACHMENTS & SPECIFICATION DOCUMENTS */}
            <div>
              <label
                className="block text-[10px] font-bold tracking-widest mb-2"
                style={{ color: "var(--mt-form-label)" }}
              >
                ATTACH IMAGES, DOCUMENTS OR SPECIFICATION LINKS (OPTIONAL)
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="url"
                  value={attachmentUrlInput}
                  onChange={(e) => setAttachmentUrlInput(e.target.value)}
                  placeholder="Paste image URL, Figma link, Google Drive doc, or specification URL (https://...)"
                  className="flex-1 rounded-sm border px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[var(--mt-blue)]"
                  style={{
                    backgroundColor: "var(--mt-form-input-bg)",
                    borderColor: "var(--mt-form-input-border)",
                    color: "var(--mt-form-input-text)",
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="flex items-center justify-center gap-2 rounded-sm border border-[var(--mt-blue)] bg-[var(--mt-blue)]/20 px-5 py-3 font-sans text-xs font-bold tracking-widest text-[var(--mt-blue)] hover:bg-[var(--mt-blue)] hover:text-white transition-all w-full sm:w-auto shrink-0"
                >
                  <Paperclip size={14} />
                  ADD LINK
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((url, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 border border-[#1E2538] bg-[#12151E] px-3 py-1.5 text-[10px] tracking-widest text-[#B8C4DE]"
                    >
                      <FileText size={12} className="text-[#0055FF]" />
                      <span className="max-w-xs truncate">{url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={12} />
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
                className="flex items-center justify-center gap-2 bg-[#0055FF] px-8 py-4 text-xs font-bold tracking-widest text-white shadow-[0_0_30px_rgba(0,85,255,0.4)] hover:bg-[#1A66FF] disabled:opacity-50 transition-all w-full sm:w-auto"
              >
                <Send size={14} />
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
