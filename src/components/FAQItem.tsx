import React, { useState } from "react";
import { FAQ } from "@/types/faq";

interface Props {
  faq: FAQ;
}

const FAQItem: React.FC<Props> = ({ faq }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={`border-b border-[#0a1628]/10 transition-all duration-300 ${open ? "bg-[#f8f5ef]" : ""}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 px-2 flex justify-between items-center gap-4 group"
      >
        <span
          className={`font-bold text-base md:text-lg transition-colors duration-200 ${open ? "text-[#c9a84c]" : "text-[#0a1628] group-hover:text-[#c9a84c]"}`}
        >
          {faq.question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 flex items-center justify-center border transition-all duration-300 text-lg font-bold
          ${
            open
              ? "bg-[#c9a84c] border-[#c9a84c] text-[#0a1628] rotate-45"
              : "border-[#0a1628]/20 text-[#0a1628] group-hover:border-[#c9a84c] group-hover:text-[#c9a84c]"
          }`}
        >
          +
        </span>
      </button>

      {open && (
        <div className="px-2 pb-5">
          <p className="text-[#0a1628]/65 leading-relaxed">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default FAQItem;
