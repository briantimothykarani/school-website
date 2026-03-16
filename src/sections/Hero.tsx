import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero({ settings, onNavClick }: any) {
  const [showPopup, setShowPopup] = useState(false);

  const bgUrl =
    settings?.hero_bg_url ||
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80";

  // Use CSS variable for dynamic primary color
  const primary = "var(--primary)";

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
      {/* Dynamic color left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{
          background: `linear-gradient(to bottom, transparent, ${primary}, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 md:px-24 max-w-4xl pt-24">
        {settings?.logo_url && (
          <motion.img
            src={settings.logo_url}
            alt="Logo"
            className="h-16 mb-6 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}

        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.5, ease: "easeOut" }}
        >
          <div className="h-px w-10" style={{ backgroundColor: primary }} />
          <span
            className="text-xs tracking-[0.3em] uppercase font-bold"
            style={{ color: primary }}
          >
            {settings?.motto || "Inspiring Limitless Possibilities"}
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
        >
          {settings?.school_name || "Brightside Academy"}
        </motion.h1>

        <motion.p
          className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.4, ease: "easeOut" }}
        >
          {settings?.about
            ? settings.about.slice(0, 120) + "..."
            : "Nurturing global minds and inspiring the next generation of leaders, innovators, and change-makers."}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.8, ease: "easeOut" }}
        >
          <motion.button
            onClick={() => onNavClick?.("admissions")}
            className="px-8 py-4 font-bold text-sm cursor-pointer tracking-widest uppercase"
            style={{ backgroundColor: primary, color: "#0a1628" }}
            whileHover={{ scale: 1.08, opacity: 0.9 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            Apply Now
          </motion.button>

          <motion.button
            onClick={() => setShowPopup(true)}
            className="px-8 py-4 border font-semibold text-sm tracking-widest uppercase text-white"
            style={{ borderColor: "rgba(255,255,255,0.3)" }}
            whileHover={{ scale: 1.08, borderColor: primary, color: primary }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            Discover More
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 2.4 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setShowPopup(false)}
            />

            <motion.div
              className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg bg-white shadow-2xl"
              style={{ x: "-50%", y: "-50%" }}
              initial={{ opacity: 0, scale: 0.7, y: "-35%" }}
              animate={{ opacity: 1, scale: 1, y: "-50%" }}
              exit={{ opacity: 0, scale: 0.7, y: "-35%" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Dynamic color top bar */}
              <div className="h-1" style={{ backgroundColor: primary }} />

              <div className="p-8">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[#0a1628]/40 hover:text-[#0a1628] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-px w-8"
                    style={{ backgroundColor: primary }}
                  />
                  <span
                    className="text-xs tracking-[0.3em] uppercase font-bold"
                    style={{ color: primary }}
                  >
                    About Us
                  </span>
                </div>

                <h2
                  className="text-2xl font-black text-[#0a1628] mb-1"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {settings?.school_name || "Brightside Academy"}
                </h2>
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-5 italic"
                  style={{ color: primary }}
                >
                  "{settings?.motto}"
                </p>
                <p className="text-[#0a1628]/65 leading-relaxed text-sm mb-6">
                  {settings?.about ||
                    "We are committed to nurturing excellence in every student through quality education, strong values, and a supportive community."}
                </p>

                <motion.button
                  onClick={() => {
                    setShowPopup(false);
                    onNavClick?.("about");
                  }}
                  className="w-full py-3 text-xs font-bold tracking-widest uppercase"
                  style={{ backgroundColor: "#0a1628", color: primary }}
                  whileHover={{ backgroundColor: primary, color: "#0a1628" }}
                  transition={{ duration: 0.3 }}
                >
                  Read Full Story →
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.0); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </section>
  );
}
