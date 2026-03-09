import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface ModalProps {
  slug: string;
  close: () => void;
  settings: any;
}

// Static fallback content for common slugs
const fallbackContent: Record<string, { title: string; content: string }> = {
  admissions: {
    title: "Admissions",
    content: `We welcome applications from students of all backgrounds. Our admissions process is designed to identify students who will thrive in our environment.\n\nTo apply:\n1. Complete the online application form\n2. Submit academic records\n3. Attend an assessment day\n4. Receive your offer letter\n\nContact our admissions team for more information.`,
  },
  events: {
    title: "Events",
    content: `Stay up to date with school events, term dates, and activities. Check back regularly for updates on upcoming events.`,
  },
  contact: {
    title: "Contact Us",
    content: `We'd love to hear from you. Reach out to us via phone or email and our team will get back to you within 24 hours.`,
  },
  downloads: {
    title: "Downloads",
    content: `Access our latest documents, handbooks, newsletters and policy documents in the Downloads section of our website.`,
  },
  about: {
    title: "About Us",
    content: `We are committed to providing world-class education in a nurturing environment. Our dedicated staff work tirelessly to ensure every student reaches their full potential.`,
  },
};

export default function Modal({ slug, close, settings }: ModalProps) {
  const [section, setSection] = useState<{
    title: string;
    content: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent background scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    async function fetchSection() {
      setLoading(true);
      const { data } = await supabase
        .from("site_sections")
        .select("title, content")
        .eq("slug", slug)
        .single();

      if (data) {
        setSection(data);
      } else {
        // Use fallback if not in DB
        setSection(
          fallbackContent[slug] || {
            title: slug.charAt(0).toUpperCase() + slug.slice(1),
            content: "Content coming soon.",
          },
        );
      }
      setLoading(false);
    }
    fetchSection();
  }, [slug]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a1628]/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top bar */}
        <div className="h-1 bg-[#c9a84c] w-full" />

        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
                {settings?.school_name || "Brightside Academy"}
              </span>
            </div>
            <h2
              className="text-3xl font-black text-[#0a1628]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {loading ? "Loading..." : section?.title}
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={close}
            className="w-10 h-10 flex items-center justify-center border border-[#0a1628]/20 hover:border-[#c9a84c] hover:text-[#c9a84c] text-[#0a1628] transition-all duration-200 shrink-0 ml-4 mt-1"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="mx-8 h-px bg-[#0a1628]/10" />

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-4 bg-[#0a1628]/10 rounded animate-pulse ${i === 3 ? "w-2/3" : "w-full"}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-[#0a1628]/70 leading-relaxed whitespace-pre-line text-base">
              {section?.content}
            </div>
          )}
        </div>

        {/* Footer CTA for admissions */}
        {slug === "admissions" && !loading && (
          <div className="px-8 pb-8">
            <div className="h-px bg-[#0a1628]/10 mb-6" />
            <div className="flex flex-wrap gap-4">
              <a
                href={`mailto:${settings?.email || "info@brightside.com"}`}
                className="px-6 py-3 bg-[#0a1628] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#0a1628] transition-all duration-300"
              >
                Email Admissions
              </a>
              <a
                href={`tel:${settings?.phone || ""}`}
                className="px-6 py-3 border border-[#0a1628]/20 text-[#0a1628] text-xs font-bold tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-300"
              >
                Call Us
              </a>
            </div>
          </div>
        )}

        {/* Footer CTA for contact */}
        {slug === "contact" && !loading && (
          <div className="px-8 pb-8">
            <div className="h-px bg-[#0a1628]/10 mb-6" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#f8f5ef] p-4">
                <div className="text-[#c9a84c] text-xs tracking-widest uppercase font-bold mb-1">
                  Phone
                </div>
                <div className="text-[#0a1628] font-bold">
                  {settings?.phone || "+254 000 000 000"}
                </div>
              </div>
              <div className="bg-[#f8f5ef] p-4">
                <div className="text-[#c9a84c] text-xs tracking-widest uppercase font-bold mb-1">
                  Email
                </div>
                <div className="text-[#0a1628] font-bold truncate">
                  {settings?.email || "info@brightside.com"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
