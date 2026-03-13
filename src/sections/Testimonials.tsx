import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  avatar_url: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState<"idle" | "fadeOut" | "slideIn">(
    "idle",
  );

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTestimonials(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setAnimState("fadeOut");
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
        setAnimState("slideIn");
        setTimeout(() => setAnimState("idle"), 500);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const goTo = (index: number) => {
    if (index === current) return;
    setAnimState("fadeOut");
    setTimeout(() => {
      setCurrent(index);
      setAnimState("slideIn");
      setTimeout(() => setAnimState("idle"), 500);
    }, 400);
  };

  if (!loading && testimonials.length === 0) return null;

  const t = testimonials[current];

  const animClass =
    animState === "fadeOut"
      ? "opacity-0 translate-x-6"
      : animState === "slideIn"
        ? "opacity-0 -translate-x-6"
        : "opacity-100 translate-x-0";

  return (
    <section className="bg-[#0a1628] py-16 px-6 md:px-16 relative overflow-hidden">
      {/* Decorative quote */}
      <div
        className="absolute top-4 right-10 text-[#c9a84c]/10 text-[160px] font-black leading-none select-none pointer-events-none"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        "
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Label */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-8 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            Testimonials
          </span>
        </div>

        <h2
          className="text-3xl font-black text-white mb-8"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          What Our <span className="text-[#c9a84c]">Community</span> Says
        </h2>

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-pulse">
            <div className="flex gap-1 justify-center">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-3 h-3 bg-white/10 rounded" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/10 rounded w-full" />
              <div className="h-3 bg-white/10 rounded w-full" />
              <div className="h-3 bg-white/10 rounded w-2/3 mx-auto" />
            </div>
            <div className="flex items-center gap-3 justify-center pt-2">
              <div className="w-9 h-9 bg-white/10 rounded-full" />
              <div className="space-y-1">
                <div className="h-3 bg-white/10 rounded w-20" />
                <div className="h-2 bg-white/10 rounded w-14" />
              </div>
            </div>
          </div>
        )}

        {/* Single testimonial */}
        {!loading && t && (
          <div
            className={`bg-white/5 border border-white/10 hover:border-[#c9a84c]/40 rounded-2xl p-6 transition-all duration-500 ease-in-out text-center ${animClass}`}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4 justify-center">
              {[...Array(5)].map((_, j) => (
                <span
                  key={j}
                  className={`text-sm ${j < t.rating ? "text-[#c9a84c]" : "text-white/20"}`}
                >
                  ★
                </span>
              ))}
            </div>

            {/* Message */}
            <p className="text-white/75 text-sm leading-relaxed mb-5 italic">
              "{t.message}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 justify-center">
              {t.avatar_url ? (
                <img
                  src={t.avatar_url}
                  alt={t.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#c9a84c]/30"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#c9a84c] flex items-center justify-center font-black text-[#0a1628] text-sm shrink-0">
                  {t.name[0]}
                </div>
              )}
              <div className="text-left">
                <div className="text-white font-bold text-sm">{t.name}</div>
                <div className="text-white/40 text-xs tracking-wider uppercase mt-0.5">
                  {t.role}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dot indicators */}
        {!loading && testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-6 h-2 bg-[#c9a84c]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
