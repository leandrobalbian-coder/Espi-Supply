"use client";
import { useState } from "react";

interface Props {
  onComplete: () => void;
  disabled?: boolean;
}

const PHOTO_BG = ["#E8E8E8", "#DCDCDC", "#E2E2E2"];

export default function PhotoUploadStep({ onComplete, disabled }: Props) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  function handleSimulate() {
    if (disabled || status !== "idle") return;
    setStatus("uploading");
    setTimeout(() => {
      setStatus("done");
      setTimeout(onComplete, 700);
    }, 1300);
  }

  if (status === "done") {
    return (
      <div className="mx-2 mb-2 animate-fadeIn bg-white rounded-2xl rounded-bl-sm border border-[#E5E5E5] shadow-sm p-3">
        <div className="flex gap-2 mb-2">
          {PHOTO_BG.map((bg, i) => (
            <div
              key={i}
              className="flex-1 aspect-square rounded-lg relative flex items-center justify-center"
              style={{ background: bg }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#25D366] flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 7 5 10 10 3"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] font-semibold text-[#25D366] flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          3 fotos recibidas
        </p>
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
            Enviando fotos…
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFAA00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            Simular envío de fotos
          </>
        )}
      </button>
    </div>
  );
}
