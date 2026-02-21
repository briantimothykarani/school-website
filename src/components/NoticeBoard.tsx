import { useState, useEffect } from "react";

export default function NoticeBoard({ settings }: { settings: any }) {
  const [isVisible, setIsVisible] = useState(true);

  // Check if the notice is expired or disabled
  const isExpired = settings?.notice_expires_at
    ? new Date() > new Date(settings.notice_expires_at)
    : false;

  // Don't render anything if disabled, expired, or closed by user
  if (!settings?.show_notice || isExpired || !isVisible) return null;

  return (
    <div className="bg-yellow-400 text-yellow-950 px-4 py-3 relative flex items-center justify-center border-b border-yellow-500 shadow-sm animate-in slide-in-from-top duration-300">
      {/* 1. Close Button on the Top Left */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-yellow-500 rounded-md transition-colors"
        aria-label="Close Notice"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* 2. Notice Content */}
      <div className="flex items-center gap-3 font-semibold text-sm md:text-base pr-4 pl-10">
        <span className="bg-yellow-900 text-yellow-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-black">
          Notice
        </span>
        <p className="leading-tight">
          {settings.notice_text || "Welcome to Brightside Academy Portal!"}
        </p>
      </div>
    </div>
  );
}
