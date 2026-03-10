import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface ModalProps {
  slug: string;
  close: () => void;
  settings: any;
}

// ─── Types ───────────────────────────────────────────────
interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
}
interface Download {
  id: string;
  title: string;
  file_url: string;
}
interface SectionContent {
  title: string;
  content: string;
}

const categoryColors: Record<string, string> = {
  Sports: "bg-green-100 text-green-700",
  Academic: "bg-blue-100 text-blue-700",
  Cultural: "bg-purple-100 text-purple-700",
  General: "bg-[#c9a84c]/20 text-[#c9a84c]",
  Meeting: "bg-orange-100 text-orange-700",
};

export default function Modal({ slug, close, settings }: ModalProps) {
  const [loading, setLoading] = useState(true);
  const [sectionContent, setSectionContent] = useState<SectionContent | null>(
    null,
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [downloads, setDownloads] = useState<Download[]>([]);

  // Lock background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Fetch correct data based on slug
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      if (slug === "events") {
        const { data } = await supabase
          .from("events")
          .select("*")
          .eq("is_published", true)
          .gte("event_date", new Date().toISOString().split("T")[0])
          .order("event_date", { ascending: true });
        setEvents(data || []);
      } else if (slug === "downloads") {
        const { data } = await supabase
          .from("downloads")
          .select("*")
          .order("created_at", { ascending: false });
        setDownloads(data || []);
      } else {
        // about, admissions, contact — fetch from site_sections
        const { data } = await supabase
          .from("site_sections")
          .select("title, content")
          .eq("slug", slug)
          .maybeSingle();
        setSectionContent(
          data || {
            title: slug.charAt(0).toUpperCase() + slug.slice(1),
            content:
              "Content coming soon. Edit this in the Admin panel under Pages.",
          },
        );
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      day: d.getDate().toString().padStart(2, "0"),
      month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
    };
  };

  const modalTitle =
    slug === "events"
      ? "Upcoming Events"
      : slug === "downloads"
        ? "Downloads & Documents"
        : sectionContent?.title || slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center"
      onClick={close}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a1628]/85 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white w-full md:max-w-2xl md:mx-4 max-h-[92vh] md:max-h-[85vh] flex flex-col shadow-2xl"
        style={{ animation: "slideUp 0.3s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold bar */}
        <div className="h-1 bg-[#c9a84c] shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#0a1628]/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-6 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase font-bold">
                {settings?.school_name || "School Portal"}
              </span>
            </div>
            <h2
              className="text-2xl md:text-3xl font-black text-[#0a1628]"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {loading ? (
                <div className="h-8 w-48 bg-[#0a1628]/10 animate-pulse rounded" />
              ) : (
                modalTitle
              )}
            </h2>
          </div>
          {/* X button */}
          <button
            onClick={close}
            className="w-10 h-10 flex items-center justify-center bg-[#0a1628] hover:bg-[#c9a84c] text-white hover:text-[#0a1628] transition-all duration-200 shrink-0 ml-6"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-8 py-6">
          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-[#0a1628]/10 animate-pulse rounded"
                />
              ))}
            </div>
          )}

          {/* ── EVENTS ── */}
          {!loading &&
            slug === "events" &&
            (events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-[#0a1628]/40 text-sm uppercase tracking-widest">
                  No upcoming events
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((ev) => {
                  const date = formatDate(ev.event_date);
                  const colorClass =
                    categoryColors[ev.category] || categoryColors.General;
                  return (
                    <div
                      key={ev.id}
                      className="flex items-start gap-4 p-4 border border-[#0a1628]/10 hover:border-[#c9a84c]/50 transition-colors"
                    >
                      {/* Date block */}
                      <div className="shrink-0 bg-[#0a1628] text-center px-3 py-2 min-w-[52px]">
                        <div className="text-[#c9a84c] font-black text-xl leading-none">
                          {date.day}
                        </div>
                        <div className="text-white/60 text-[10px] tracking-widest uppercase mt-0.5">
                          {date.month}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-[#0a1628] text-sm">
                            {ev.title}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${colorClass}`}
                          >
                            {ev.category}
                          </span>
                        </div>
                        {ev.description && (
                          <p className="text-[#0a1628]/50 text-xs mb-1">
                            {ev.description}
                          </p>
                        )}
                        <div className="flex gap-3 text-[#0a1628]/40 text-xs">
                          {ev.event_time && <span>🕐 {ev.event_time}</span>}
                          {ev.location && <span>📍 {ev.location}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

          {/* ── DOWNLOADS ── */}
          {!loading &&
            slug === "downloads" &&
            (downloads.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-[#0a1628]/40 text-sm uppercase tracking-widest">
                  No documents yet
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {downloads.map((d) => {
                  const ext =
                    d.file_url.split(".").pop()?.toUpperCase() || "FILE";
                  return (
                    <a
                      key={d.id}
                      href={d.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 border border-[#0a1628]/10 hover:border-[#c9a84c] hover:bg-[#f8f5ef] transition-all group"
                    >
                      <div className="w-10 h-10 bg-[#0a1628] group-hover:bg-[#c9a84c] flex items-center justify-center shrink-0 transition-colors">
                        <span className="text-[#c9a84c] group-hover:text-[#0a1628] text-[10px] font-black">
                          {ext}
                        </span>
                      </div>
                      <span className="flex-1 text-[#0a1628] font-semibold text-sm group-hover:text-[#c9a84c] transition-colors">
                        {d.title}
                      </span>
                      <span className="text-[#0a1628]/30 text-xs group-hover:text-[#c9a84c] transition-colors">
                        ↓ Download
                      </span>
                    </a>
                  );
                })}
              </div>
            ))}

          {/* ── TEXT PAGES (about, admissions, contact) ── */}
          {!loading && slug !== "events" && slug !== "downloads" && (
            <>
              <div className="text-[#0a1628]/70 leading-relaxed text-base whitespace-pre-line">
                {sectionContent?.content}
              </div>

              {/* Contact / Admissions cards */}
              {(slug === "contact" || slug === "admissions") && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {settings?.phone && (
                    <a
                      href={`tel:${settings.phone}`}
                      className="flex items-center gap-4 p-4 bg-[#f8f5ef] border border-[#0a1628]/10 hover:border-[#c9a84c] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#0a1628] group-hover:bg-[#c9a84c] flex items-center justify-center shrink-0 transition-colors">
                        <span className="text-lg">📞</span>
                      </div>
                      <div>
                        <div className="text-[#c9a84c] text-[10px] tracking-widest uppercase font-bold">
                          Phone
                        </div>
                        <div className="text-[#0a1628] font-bold text-sm">
                          {settings.phone}
                        </div>
                      </div>
                    </a>
                  )}
                  {settings?.email && (
                    <a
                      href={`mailto:${settings.email}`}
                      className="flex items-center gap-4 p-4 bg-[#f8f5ef] border border-[#0a1628]/10 hover:border-[#c9a84c] transition-colors group"
                    >
                      <div className="w-10 h-10 bg-[#0a1628] group-hover:bg-[#c9a84c] flex items-center justify-center shrink-0 transition-colors">
                        <span className="text-lg">✉️</span>
                      </div>
                      <div>
                        <div className="text-[#c9a84c] text-[10px] tracking-widest uppercase font-bold">
                          Email
                        </div>
                        <div className="text-[#0a1628] font-bold text-sm truncate">
                          {settings.email}
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[#0a1628]/10 shrink-0 flex justify-end">
          <button
            onClick={close}
            className="px-6 py-2.5 bg-[#0a1628] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#c9a84c] hover:text-[#0a1628] transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
