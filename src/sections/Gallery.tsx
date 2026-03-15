import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  category: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const p = "var(--primary)";

  useEffect(() => {
    supabase
      .from("gallery")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setItems(data || []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];
  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((i) => i.category === activeCategory);

  if (!loading && items.length === 0) return null;

  return (
    <section className="bg-[#f8f5ef] py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10" style={{ backgroundColor: p }} />
          <span
            className="text-xs tracking-[0.3em] uppercase font-bold"
            style={{ color: p }}
          >
            Our Campus
          </span>
        </div>

        <h2
          className="text-4xl md:text-5xl font-black text-[#0a1628] mb-10"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          School <span style={{ color: p }}>Gallery</span>
        </h2>

        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200"
                style={
                  activeCategory === cat
                    ? { backgroundColor: "#0a1628", color: p }
                    : {
                        backgroundColor: "white",
                        border: "1px solid rgba(10,22,40,0.2)",
                        color: "rgba(10,22,40,0.6)",
                      }
                }
                onMouseEnter={(e) => {
                  if (activeCategory !== cat)
                    e.currentTarget.style.borderColor = p;
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat)
                    e.currentTarget.style.borderColor = "rgba(10,22,40,0.2)";
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#0a1628]/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square overflow-hidden group cursor-pointer"
                onClick={() => setLightbox(item)}
              >
                <img
                  src={item.image_url}
                  alt={item.title || "Gallery"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0a1628]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  {item.title && (
                    <p className="text-white font-bold text-sm">{item.title}</p>
                  )}
                </div>
                <div
                  className="absolute top-2 right-2 text-[#0a1628] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: p }}
                >
                  {item.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-[#0a1628]/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.image_url}
              alt={lightbox.title || "Gallery"}
              className="w-full max-h-[80vh] object-contain"
            />
            {lightbox.title && (
              <p className="text-white/70 text-center mt-4 text-sm">
                {lightbox.title}
              </p>
            )}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-4 -right-4 w-10 h-10 text-[#0a1628] flex items-center justify-center font-black text-lg hover:bg-white transition-colors"
              style={{ backgroundColor: p }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
