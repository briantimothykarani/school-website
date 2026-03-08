import { useEffect, useState } from "react";
import { fetchFaqs } from "@/services/faqService";
import { FAQ } from "@/types/faq";
import FAQItem from "@/components/FAQItem";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    const loadFaqs = async () => {
      const data = await fetchFaqs();
      setFaqs(data);
    };

    loadFaqs();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

      {faqs.map((faq) => (
        <FAQItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
}
