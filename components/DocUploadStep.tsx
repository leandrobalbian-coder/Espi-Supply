"use client";
import { useState } from "react";

interface Props {
  label: string;
  docType: string;
  onComplete: () => void;
  disabled?: boolean;
}

export default function DocUploadStep({ label, docType, onComplete, disabled }: Props) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  function handleSimulate() {
    if (disabled || status !== "idle") return;
    setStatus("uploading");
    setTimeout(() => {
      setStatus("done");
      setTimeout(onComplete, 600);
    }, 1500);
  }

  if (status === "done") {
    return (
      <div className="mx-2 mb-2 animate-fadeIn bg-white rounded-2xl rounded-bl-sm border border-[#E5E5E5] shadow-sm p-3.5">
        <div className="flex items-center gap-3">
          {/* Doc icon with check */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <polyline points="9 15 11 17 15 13"/>
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#1C1F2A] truncate">{docType}</p>
            <p className="text-[11px] text-[#25D366] font-semibold mt-0.5 flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Documento recibido
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-2 mb-2 animate-fadeIn">
      <button
        onClick={handleSimulate}
        disabled={disabled || status === "uploading"}
        className="
          w-full flex items-center justify-center gap-2
          bg-white border border-[#E5E5E5] rounded-2xl rounded-bl-sm
          px-4 py-3 text-[14px] font-semibold text-[#1C1F2A]
          hover:bg-[#FFFBF0] hover:border-[#FFAA00]/50
          transition-all duration-150 shadow-sm
          disabled:opacity-40 disabled:pointer-events-none
          focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/30
        "
      >
        {status === "uploading" ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-[#FFAA00] border-t-transparent animate-spin" />
            Enviando documento…
          </>
        ) : (
          <>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFAA00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            {label}
          </>
        )}
      </button>
    </div>
  );
}
