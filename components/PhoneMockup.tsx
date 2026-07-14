"use client";
import type { Variant, VerificationMethod } from "@/lib/flows";
import WhatsAppChat, { type StartMode } from "./WhatsAppChat";
import type { Tone } from "@/lib/tone";

interface Props {
  variant: Variant;
  verificationMethod: VerificationMethod;
  startMode: StartMode;
  tone: Tone;
}

export default function PhoneMockup({ variant, verificationMethod, startMode, tone }: Props) {
  return (
    <div className="flex items-center justify-center w-full h-full py-6 px-4">
      {/* Phone shell */}
      <div
        className="relative bg-[#1C1F2A] rounded-[44px] shadow-2xl flex-shrink-0"
        style={{
          width: "min(380px, 100%)",
          height: "min(780px, calc(100vh - 140px))",
          padding: "14px 6px",
          boxShadow: "0 4px 35px rgba(0,0,0,0.35), 0 8px 10px -5px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#1C1F2A] rounded-b-2xl z-10 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#333]" />
          <div className="w-12 h-1 rounded-full bg-[#333]" />
        </div>

        {/* Screen */}
        <div
          className="w-full h-full rounded-[36px] overflow-hidden bg-white flex flex-col"
        >
          {/* Status bar */}
          <div className="flex justify-between items-center px-5 pt-2 pb-1 bg-[#1C1F2A] flex-shrink-0">
            <span className="text-white text-[11px] font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="10" viewBox="0 0 12 10" fill="white"><rect x="0" y="4" width="2" height="6" rx="0.5"/><rect x="3" y="2.5" width="2" height="7.5" rx="0.5"/><rect x="6" y="1" width="2" height="9" rx="0.5"/><rect x="9" y="0" width="2" height="10" rx="0.5"/></svg>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="white" strokeWidth="1.2"><path d="M1 5C3.5 2 5 1 7 1s3.5 1 6 4"/><path d="M3 6.5C4.5 5 5.5 4.5 7 4.5s2.5.5 4 2"/><circle cx="7" cy="8.5" r="1" fill="white"/></svg>
              <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="white" strokeOpacity="0.35"/><rect x="1.5" y="1.5" width="15" height="8" rx="1.5" fill="white"/><path d="M20 3.5v4a1.5 1.5 0 0 0 0-4z" fill="white" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            <WhatsAppChat key={`${variant}-${verificationMethod}-${startMode}-${tone}`} variant={variant} verificationMethod={verificationMethod} startMode={startMode} tone={tone} />
          </div>
        </div>
      </div>
    </div>
  );
}
