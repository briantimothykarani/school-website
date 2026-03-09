import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Navbar({ settings }: any) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any>({ files: [], sections: [] });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = async (val: string) => {
    setSearch(val);
    if (val.length < 2) {
      setResults({ files: [], sections: [] });
      return;
    }
    const [filesRes, secRes] = await Promise.all([
      supabase.from("downloads").select("*").ilike("title", `%${val}%`),
      supabase.from("site_sections").select("*").ilike("title", `%${val}%`),
    ]);
    setResults({ files: filesRes.data || [], sections: secRes.data || [] });
  };

  const navLinks = ["About", "Admissions", "Events", "Downloads", "Contact"];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a1628]/95 backdrop-blur-md shadow-2xl"
            : "bg-transparent"
        }`}
      >
        {/* Gold motto bar — hides on scroll */}
        <div
          className={`bg-[#c9a84c] text-[#0a1628] text-xs tracking-[0.25em] text-center font-bold uppercase overflow-hidden transition-all duration-500 ${
            scrolled ? "max-h-0 py-0" : "max-h-10 py-1.5"
          }`}
        >
          {settings?.motto || "Inspiring Limitless Possibilities"}
        </div>

        <div className="px-6 md:px-12 py-4 flex items-center justify-between">
          {/* Logo + School Name */}
          <div className="flex items-center gap-3">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-10 w-auto" />
            ) : (
              <div className="w-10 h-10 bg-[#c9a84c] flex items-center justify-center font-black text-[#0a1628] text-lg">
                {settings?.school_name?.[0] || "B"}
              </div>
            )}
            <div>
              <div
                className="text-white font-black text-lg leading-none"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {settings?.school_name || "Brightside Academy"}
              </div>
              <div className="text-[#c9a84c] text-[10px] tracking-[0.2em] uppercase">
                Excellence in Education
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <button
                key={item}
                onClick={() => setActiveModal(item.toLowerCase())}
                className="text-white/80 hover:text-[#c9a84c] text-sm tracking-wider uppercase font-medium transition-colors duration-200 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Search + Apply + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                className="bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-full px-4 py-1.5 text-sm w-36 focus:w-52 focus:outline-none focus:border-[#c9a84c] transition-all duration-300"
                placeholder="Search..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {search.length > 1 && (
                <div className="absolute top-full mt-2 right-0 bg-[#0a1628] border border-[#c9a84c]/30 text-white p-4 rounded-lg shadow-2xl w-72">
                  {results.files.length === 0 &&
                  results.sections.length === 0 ? (
                    <p className="text-white/50 text-sm">No results found.</p>
                  ) : null}
                  {results.files.map((f: any) => (
                    <a
                      key={f.id}
                      href={f.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-2 text-sm hover:text-[#c9a84c] transition-colors border-b border-white/10 last:border-0"
                    >
                      📄 {f.title}
                    </a>
                  ))}
                  {results.sections.map((s: any) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveModal(s.slug);
                        setSearch("");
                      }}
                      className="flex items-center gap-2 py-2 text-sm hover:text-[#c9a84c] w-full text-left border-b border-white/10 last:border-0"
                    >
                      📋 {s.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apply Now button */}
            <button
              onClick={() => setActiveModal("admissions")}
              className="hidden md:block px-5 py-2 bg-[#c9a84c] text-[#0a1628] text-xs font-bold tracking-widest uppercase hover:bg-[#e4c06a] transition-all duration-300"
            >
              Apply Now
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#0a1628] border-t border-[#c9a84c]/20 px-6 py-4 space-y-1">
            {navLinks.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setActiveModal(item.toLowerCase());
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-white/80 hover:text-[#c9a84c] py-3 text-sm tracking-wider uppercase border-b border-white/10 last:border-0"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Modal — only renders if you have a Modal component */}
      {activeModal &&
        (() => {
          try {
            const Modal = require("./Modal").default;
            return (
              <Modal
                slug={activeModal}
                close={() => setActiveModal(null)}
                settings={settings}
              />
            );
          } catch {
            return (
              <div
                className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center"
                onClick={() => setActiveModal(null)}
              >
                <div className="bg-white p-8 max-w-md w-full mx-4 rounded-lg shadow-2xl">
                  <h2 className="text-2xl font-black text-[#0a1628] mb-2 capitalize">
                    {activeModal}
                  </h2>
                  <p className="text-[#0a1628]/60">Content coming soon.</p>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="mt-4 px-6 py-2 bg-[#0a1628] text-white text-sm font-bold uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          }
        })()}
    </>
  );
}
