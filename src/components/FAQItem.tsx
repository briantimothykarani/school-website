import { useState } from "react";
import { FAQ } from "@/types/faq";

interface Props {
  faq: FAQ;
}

const FAQItem: React.FC<Props> = ({ faq }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left font-semibold text-lg flex justify-between"
      >
        {faq.question}
        <span>{open ? "-" : "+"}</span>
      </button>

      {open && <p className="mt-2 text-gray-600">{faq.answer}</p>}
    </div>
  );
};
