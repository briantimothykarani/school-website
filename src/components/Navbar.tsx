import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

type SectionSlug =
  | "about us"
  | "admissions"
  | "events"
  | "downloads & fees structure"
  | "contact us";

interface NavbarProps {
  settings: any;
  onNavClick: (slug: SectionSlug) => void;
}

export default function Navbar({ settings, onNavClick }: NavbarProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any>({ files: [], sections: [] });
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const primary = "var(--primary)";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = () => setSearch("");
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
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

  const navLinks: { label: string; slug: SectionSlug }[] = [
    { label: "About", slug: "about" },
    { label: "Admissions", slug: "admissions" },
    { label: "Events", slug: "events" },
    { label: "Downloads", slug: "downloads" },
    { label: "Contact", slug: "contact" },
  ];

  const handleNavClick = (slug: SectionSlug) => {
    onNavClick(slug);
    setMenuOpen(false);
    setSearch("");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a1628]/95 backdrop-blur-md shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Logo + School Name */}
        <div className="flex items-center gap-3">
          <Link to="/">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-10 w-auto" />
            ) : (
              <div
                className="w-10 h-10 flex items-center justify-center font-black text-[#0a1628] text-lg"
                style={{ backgroundColor: primary }}
              >
                {settings?.school_name?.[0] || "B"}
              </div>
            )}
          </Link>
          <Link to="/">
            <div
              className="text-white font-black text-lg leading-none"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {settings?.school_name || "Brightside Academy"}
            </div>
            <div
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: primary }}
            >
              {settings?.motto || "Inspiring Limitless Possibilities"}
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, slug }) => (
            <button
              key={slug}
              onClick={() => handleNavClick(slug)}
              className="text-white/80 text-sm tracking-wider uppercase cursor-pointer font-medium transition-colors duration-200 relative group"
              onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              {label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: primary }}
              />
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div
            className="relative hidden md:block"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              className="bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-full px-4 py-1.5 text-sm w-36 focus:w-52 focus:outline-none transition-all duration-300"
              style={{ ["--tw-ring-color" as any]: primary }}
              onFocus={(e) => (e.currentTarget.style.borderColor = primary)}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")
              }
              placeholder="Search..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {search.length > 1 && (
              <div
                className="absolute top-full mt-2 right-0 bg-[#0a1628] text-white p-4 rounded-lg shadow-2xl w-72 z-50 border"
                style={{
                  borderColor: `color-mix(in srgb, var(--primary) 30%, transparent)`,
                }}
              >
                {results.files.length === 0 &&
                  results.sections.length === 0 && (
                    <p className="text-white/50 text-sm">No results found.</p>
                  )}
                {results.files.map((f: any) => (
                  <a
                    key={f.id}
                    href={f.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-2 text-sm transition-colors border-b border-white/10 last:border-0"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = primary)
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    onClick={() => setSearch("")}
                  >
                    📄 {f.title}
                  </a>
                ))}
                {results.sections.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => handleNavClick(s.slug as SectionSlug)}
                    className="flex items-center gap-2 py-2 text-sm w-full text-left border-b border-white/10 last:border-0"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = primary)
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                  >
                    📋 {s.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Apply Now */}
          <button
            onClick={() => handleNavClick("admissions")}
            className="hidden md:block px-5 py-2 text-[#0a1628] text-xs font-bold cursor-pointer tracking-widest uppercase transition-all duration-300"
            style={{ backgroundColor: primary }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Apply Now
          </button>

          {/* Admin Link */}
          <Link
            to="/admin"
            className="hidden md:block px-5 py-2 border cursor-pointer border-white/20 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = primary;
              e.currentTarget.style.color = primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.color = "white";
            }}
          >
            Admin
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
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
      <div
        className={`md:hidden bg-[#0a1628] overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          borderTop: `1px solid color-mix(in srgb, var(--primary) 20%, transparent)`,
        }}
      >
        <div className="px-6 py-4 space-y-1">
          {navLinks.map(({ label, slug }) => (
            <button
              key={slug}
              onClick={() => handleNavClick(slug)}
              className="block w-full text-left text-white/80 py-3 text-sm tracking-wider uppercase border-b border-white/10 last:border-0 transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.color = primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "")}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick("admissions")}
            className="w-full mt-3 px-5 py-2.5 text-[#0a1628] text-xs font-bold tracking-widest uppercase"
            style={{ backgroundColor: primary }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </nav>
  );
}
