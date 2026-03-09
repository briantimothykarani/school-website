import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Downloads() {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("downloads")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setFiles(data || []));
  }, []);

  return (
    <section className="bg-[#f8f5ef] py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            Resources
          </span>
        </div>

        <h2
          className="text-4xl md:text-5xl font-black text-[#0a1628] mb-12"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Downloads & <span className="text-[#c9a84c]">Documents</span>
        </h2>

        {files.length === 0 ? (
          <div className="text-center py-16 text-[#0a1628]/40">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-sm tracking-widest uppercase">
              No documents available yet
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white border border-[#0a1628]/10 hover:border-[#c9a84c] hover:shadow-lg p-5 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#0a1628] flex items-center justify-center shrink-0 group-hover:bg-[#c9a84c] transition-colors duration-300">
                  <svg
                    className="w-6 h-6 text-[#c9a84c] group-hover:text-[#0a1628] transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-[#0a1628] text-sm group-hover:text-[#c9a84c] transition-colors truncate">
                    {file.title}
                  </p>
                  <p className="text-[#0a1628]/40 text-xs tracking-widest uppercase mt-1">
                    Download PDF
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
