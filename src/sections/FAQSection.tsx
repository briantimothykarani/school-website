import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const p = "var(--primary)";

  useEffect(() => {
    supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setFaqs(data || []);
        setLoading(false);
      });
  }, []);

  if (!loading && faqs.length === 0) return null;

  const categories = [
    "All",
    ...Array.from(new Set(faqs.map((f) => f.category))),
  ];
  const filtered =
    activeCategory === "All"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  return (
    <section className="bg-[#f8f5ef] py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10" style={{ backgroundColor: p }} />
          <span
            className="text-xs tracking-[0.3em] uppercase font-bold"
            style={{ color: p }}
          >
            FAQ
          </span>
        </div>

        <h2
          className="text-4xl md:text-5xl font-black text-[#0a1628] mb-10"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Frequently Asked <span style={{ color: p }}>Questions</span>
        </h2>

        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
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
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-[#0a1628]/10 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="border-t border-[#0a1628]/10">
            {filtered.map((faq) => (
              <div
                key={faq.id}
                className={`border-b border-[#0a1628]/10 transition-all duration-300 ${openId === faq.id ? "bg-white" : ""}`}
              >
                <button
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full text-left py-5 px-4 flex justify-between items-center gap-4 group"
                >
                  <span
                    className="font-bold text-base transition-colors duration-200"
                    style={{ color: openId === faq.id ? p : "#0a1628" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = p)}
                    onMouseLeave={(e) => {
                      if (openId !== faq.id)
                        e.currentTarget.style.color = "#0a1628";
                    }}
                  >
                    {faq.question}
                  </span>
                  <svg
                    className={`shrink-0 w-5 h-5 transition-all duration-300 ${openId === faq.id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      color: openId === faq.id ? p : "rgba(10,22,40,0.4)",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openId === faq.id && (
                  <div className="px-4 pb-5">
                    <p className="text-[#0a1628]/65 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
