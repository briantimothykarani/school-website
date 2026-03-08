import React from "react";

const WhatsAppButton: React.FC = () => {
  const phoneNumber: string = "254700000000"; // replace with school number
  const message: string = "Hello, I need help with the school platform.";

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message,
  )}`;

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all"
    >
      💬 WhatsApp
    </a>
  );
};

export default WhatsAppButton;
