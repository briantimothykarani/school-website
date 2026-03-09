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
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-10 bg-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-bold">
            FAQ
          </span>
        </div>

        <h2
          className="text-4xl md:text-5xl font-black text-[#0a1628] mb-10"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Frequently Asked <span className="text-[#c9a84c]">Questions</span>
        </h2>

        {/* Category filters */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#0a1628] text-[#c9a84c]"
                    : "bg-white border border-[#0a1628]/20 text-[#0a1628]/60 hover:border-[#c9a84c]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-[#0a1628]/10 animate-pulse" />
            ))}
          </div>
        )}

        {/* FAQ list */}
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
                    className={`font-bold text-base transition-colors duration-200 ${
                      openId === faq.id
                        ? "text-[#c9a84c]"
                        : "text-[#0a1628] group-hover:text-[#c9a84c]"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 flex items-center justify-center border font-black text-lg transition-all duration-300 ${
                      openId === faq.id
                        ? "bg-[#c9a84c] border-[#c9a84c] text-[#0a1628] rotate-45"
                        : "border-[#0a1628]/20 text-[#0a1628] group-hover:border-[#c9a84c]"
                    }`}
                  >
                    +
                  </span>
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
