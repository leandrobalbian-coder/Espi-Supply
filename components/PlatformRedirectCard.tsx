"use client";
interface Props {
  name: string;
  email: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export default function PlatformRedirectCard({ name, email, onConfirm, disabled }: Props) {
  return (
    <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm mx-2 overflow-hidden border border-[#E5E5E5] animate-fadeIn">
      {/* Browser chrome mockup */}
      <div className="bg-[#F5F5F5] px-3 py-2 flex items-center gap-2 border-b border-[#E5E5E5]">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5E5]" />
        </div>
        <div className="flex-1 bg-white rounded px-2 py-0.5 text-[10px] text-[#9898A2] truncate">
          spot2.mx/crear-cuenta
        </div>
      </div>
      {/* Form content */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#FFAA00] flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-[#1C1F2A]">E</span>
          </div>
          <span className="text-[12px] font-semibold text-[#424552]">Spot2 — Crear cuenta</span>
        </div>
        <p className="text-[11px] text-[#737373] mb-3">Datos pre-llenados por Espi. Solo confirma.</p>
        <div className="flex flex-col gap-2 mb-4">
          <div>
            <label className="text-[11px] font-semibold text-[#424552] block mb-0.5">Nombre completo</label>
            <div className="border border-[#FFAA00] rounded-lg px-3 py-2 bg-[#FFFBF0]">
              <span className="text-[13px] text-[#1C1F2A]">{name}</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#424552] block mb-0.5">Correo electrónico</label>
            <div className="border border-[#FFAA00] rounded-lg px-3 py-2 bg-[#FFFBF0]">
              <span className="text-[13px] text-[#1C1F2A]">{email}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onConfirm}
          disabled={disabled}
          className="
            w-full py-2.5 rounded-full bg-[#FFAA00] text-[#1C1F2A]
            text-[13px] font-bold hover:bg-[#E69900]
            transition-all duration-150
            disabled:opacity-50 disabled:pointer-events-none
            focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
            min-h-[44px]
          "
        >
          Confirmar y crear cuenta
        </button>
      </div>
    </div>
  );
}
