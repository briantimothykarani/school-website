import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Download {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}
interface SiteSection {
  title: string;
  content: string;
}

export default function Admissions() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [section, setSection] = useState<SiteSection | null>(null);
  const [loading, setLoading] = useState(true);
  const p = "var(--primary)";

  useEffect(() => {
    Promise.all([
      supabase
        .from("downloads")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("site_sections")
        .select("title, content")
        .eq("slug", "admissions")
        .single(),
    ]).then(([d, s]) => {
      setDownloads(d.data || []);
      setSection(s.data || null);
      setLoading(false);
    });
  }, []);

  const getFileExt = (url: string) =>
    url.split(".").pop()?.toUpperCase().slice(0, 4) || "FILE";

  if (loading) return <ModalSkeleton />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-10" style={{ backgroundColor: p }} />
        <span
          className="text-xs tracking-[0.3em] uppercase font-bold"
          style={{ color: p }}
        >
          Join Our School
        </span>
      </div>
      <h1
        className="text-4xl font-black text-[#0a1628] mb-8 leading-tight"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        {section?.title || "Admissions"}
      </h1>
      {section?.content && (
        <div className="mb-10 space-y-3">
          {section.content
            .split("\n")
            .filter(Boolean)
            .map((line, i) => {
              const isBullet = line.trim().startsWith("•");
              return isBullet ? (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: p }}
                  />
                  <p className="text-[#0a1628]/70 text-[15px] leading-relaxed">
                    {line.replace(/^•\s*/, "")}
                  </p>
                </div>
              ) : (
                <p
                  key={i}
                  className="text-[#0a1628]/70 text-[15px] leading-relaxed"
                >
                  {line}
                </p>
              );
            })}
        </div>
      )}
      <div className="border-t border-[#0a1628]/10 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px w-6" style={{ backgroundColor: p }} />
          <span className="text-[#0a1628] text-xs tracking-[0.25em] uppercase font-bold">
            Admission Documents
          </span>
        </div>
        {downloads.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#0a1628]/15">
            <p className="text-[#0a1628]/30 text-sm">
              No documents available yet
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {downloads.map((doc) => (
              <a
                key={doc.id}
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border border-[#0a1628]/10 hover:bg-[#f8f5ef] transition-all duration-200 group"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = `color-mix(in srgb, var(--primary) 50%, transparent)`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(10,22,40,0.1)")
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 bg-[#0a1628] flex items-center justify-center transition-colors duration-200 shrink-0 group-hover:opacity-80"
                    style={{}}
                  >
                    <span
                      className="text-[9px] font-black tracking-wider"
                      style={{ color: p }}
                    >
                      {getFileExt(doc.file_url)}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#0a1628] font-semibold text-sm transition-colors group-hover:opacity-70">
                      {doc.title}
                    </p>
                    <p className="text-[#0a1628]/30 text-xs mt-0.5">
                      {new Date(doc.created_at).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[#0a1628]/30 text-xs font-bold uppercase tracking-widest transition-colors"
                  style={{}}
                >
                  Download ↓
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ModalSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse space-y-4">
      <div className="h-4 w-32 bg-[#0a1628]/10" />
      <div className="h-10 w-1/2 bg-[#0a1628]/10" />
      <div className="h-4 w-full bg-[#0a1628]/10" />
      <div className="h-4 w-5/6 bg-[#0a1628]/10" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 w-full bg-[#0a1628]/10" />
      ))}
    </div>
  );
}
