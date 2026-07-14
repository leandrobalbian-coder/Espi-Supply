"use client";
import { useState } from "react";
import type { ListItem } from "@/lib/flows";

interface Props {
  items: ListItem[];
  buttonLabel: string;
  onSelect: (id: string, title: string) => void;
  disabled?: boolean;
}

export default function ListMessage({ items, buttonLabel, onSelect, disabled }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger — simula el botón de WhatsApp List Message */}
      <div className="mx-2 mb-2 animate-fadeIn">
        <button
          onClick={() => !disabled && setOpen(true)}
          disabled={disabled}
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFAA00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {buttonLabel}
        </button>
      </div>

      {/* Bottom-sheet modal — usa fixed para cubrir el viewport centrado sobre el teléfono */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-t-3xl w-full overflow-hidden shadow-2xl animate-fadeIn"
            style={{ maxWidth: 380, maxHeight: "70vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#CCCDD1]" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 border-b border-[#E5E5E5] flex-shrink-0">
              <p className="text-[15px] font-bold text-[#1C1F2A]">Tipo de espacio</p>
              <p className="text-[12px] text-[#9898A2] mt-0.5">Selecciona una opción</p>
            </div>

            {/* Items */}
            <div className="overflow-y-auto flex-1">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => { setOpen(false); onSelect(item.id, item.title); }}
                  className={`
                    w-full text-left px-5 py-4 flex items-start gap-3
                    hover:bg-[#FFFBF0] active:bg-[#FFF3CC]
                    transition-colors duration-100
                    focus:outline-none
                    ${idx < items.length - 1 ? "border-b border-[#F0F0F0]" : ""}
                  `}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-[#CCCDD1] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#1C1F2A]">{item.title}</p>
                    {item.description && (
                      <p className="text-[12px] text-[#9898A2] mt-0.5">{item.description}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Cancel */}
            <div className="p-4 border-t border-[#E5E5E5] flex-shrink-0">
              <button
                onClick={() => setOpen(false)}
                className="
                  w-full py-2.5 rounded-full border-2 border-[#E5E5E5]
                  text-[14px] font-semibold text-[#424552]
                  hover:border-[#FFAA00] hover:text-[#1C1F2A]
                  transition-all duration-150 focus:outline-none
                "
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
