export default function Hero({ settings }: any) {
  const bgUrl =
    settings?.hero_bg_url ||
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80";

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${bgUrl}')`,
          animation: "slowZoom 20s ease-in-out infinite alternate",
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/60 to-transparent" />
      {/* Gold left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#c9a84c] to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-24 max-w-4xl pt-24">
        {settings.logo_url && (
          <img
            src={settings.logo_url}
            alt="Logo"
            className="h-16 mb-6 drop-shadow-lg"
          />
        )}

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            {settings?.motto || "Inspiring Limitless Possibilities"}
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          {settings?.school_name || "Brightside Academy"}
        </h1>

        <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
          {settings?.about
            ? settings.about.slice(0, 120) + "..."
            : "Nurturing global minds and inspiring the next generation of leaders, innovators, and change-makers."}
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#admissions"
            className="px-8 py-4 bg-[#c9a84c] text-[#0a1628] font-bold text-sm tracking-widest uppercase hover:bg-[#e4c06a] transition-all duration-300 hover:scale-105"
          >
            Apply Now
          </a>
          <a
            href="#about"
            className="px-8 py-4 border border-white/30 text-white font-semibold text-sm tracking-widest uppercase hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-300"
          >
            Discover More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.0); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
