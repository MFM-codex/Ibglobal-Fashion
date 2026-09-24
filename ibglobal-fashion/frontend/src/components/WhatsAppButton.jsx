import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function WhatsAppButton() {
  const [number, setNumber] = useState("");

  useEffect(() => {
    api
      .getShopInfo()
      .then((info) => setNumber(info.whatsappNumber))
      .catch(() => {});
  }, []);

  if (!number) return null;

  const message = encodeURIComponent("Hi IBGLOBAL FASHION, I'd like to ask about an item.");

  return (
    <a
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:brightness-95 transition"
      aria-label="Chat with us on WhatsApp"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm5.8 14.04c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.41-.13-.95-.31-1.63-.6-2.87-1.24-4.74-4.14-4.88-4.33-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.61-.07.16-.19.7-.82.89-1.1.19-.28.38-.24.63-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.67-.17 1.34Z" />
      </svg>
      <span className="hidden sm:inline text-sm font-medium">Chat with us</span>
    </a>
  );
}
