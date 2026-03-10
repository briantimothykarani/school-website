import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Download {
  id: string;
  title: string;
  file_url: string;
  created_at: string;
}

export default function Downloads() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("downloads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setDownloads(data || []);
        setLoading(false);
      });
  }, []);

  const getFileExt = (url: string) =>
    url.split(".").pop()?.toUpperCase().slice(0, 4) || "FILE";

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) return <ModalSkeleton />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px w-10 bg-[#c9a84c]" />
        <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
          Resources
        </span>
      </div>

      <h1
        className="text-4xl font-black text-[#0a1628] mb-3 leading-tight"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        Downloads
      </h1>
      <p className="text-[#0a1628]/50 text-sm mb-10">
        Access school documents, newsletters, handbooks and policy files.
      </p>

      {downloads.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#0a1628]/15">
          <div className="w-12 h-12 bg-[#0a1628]/5 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📁</span>
          </div>
          <p className="text-[#0a1628]/30 text-sm tracking-wide">
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
              className="flex items-center justify-between p-4 border border-[#0a1628]/10 hover:border-[#c9a84c]/50 hover:bg-[#f8f5ef] transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0a1628] group-hover:bg-[#c9a84c] flex items-center justify-center transition-colors duration-200 shrink-0">
                  <span className="text-[#c9a84c] group-hover:text-[#0a1628] text-[9px] font-black tracking-wider transition-colors">
                    {getFileExt(doc.file_url)}
                  </span>
                </div>
                <div>
                  <p className="text-[#0a1628] font-semibold text-sm group-hover:text-[#c9a84c] transition-colors">
                    {doc.title}
                  </p>
                  <p className="text-[#0a1628]/30 text-xs mt-0.5">
                    {formatDate(doc.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#0a1628]/30 group-hover:text-[#c9a84c] transition-colors">
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">
                  Download
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function ModalSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 animate-pulse space-y-4">
      <div className="h-4 w-32 bg-[#0a1628]/10" />
      <div className="h-10 w-1/2 bg-[#0a1628]/10" />
      <div className="h-4 w-2/3 bg-[#0a1628]/10" />
      <div className="mt-6 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 w-full bg-[#0a1628]/10" />
        ))}
      </div>
    </div>
  );
}
