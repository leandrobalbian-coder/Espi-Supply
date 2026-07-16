"use client";
import { useState } from "react";

const MOCK_ADDRESSES = [
  { id: "p1",  title: "Insurgentes Sur 1602",               description: "Crédito Constructor, Benito Juárez, CDMX" },
  { id: "p2",  title: "Paseo de la Reforma 250",            description: "Juárez, Cuauhtémoc, CDMX" },
  { id: "p3",  title: "Av. Santa Fe 440",                   description: "Santa Fe, Álvaro Obregón, CDMX" },
  { id: "p4",  title: "Ejército Nacional 843-B",            description: "Polanco V Sección, Miguel Hidalgo, CDMX" },
  { id: "p5",  title: "Blvd. M. Cervantes Saavedra 301",   description: "Granada, Miguel Hidalgo, CDMX" },
  { id: "p6",  title: "Viaducto Río Piedad 510",            description: "Granjas México, Iztacalco, CDMX" },
  { id: "p7",  title: "Periférico Sur 4349",                description: "Jardines en la Montaña, Tlalpan, CDMX" },
  { id: "p8",  title: "Av. Lázaro Cárdenas 2400",           description: "Del Parque, Monterrey, NL" },
  { id: "p9",  title: "Calzada del Valle 400",              description: "Del Valle, San Pedro Garza García, NL" },
  { id: "p10", title: "Av. Vallarta 3500",                  description: "Vallarta Norte, Guadalajara, JAL" },
  { id: "p11", title: "Blvd. Adolfo López Mateos 2417",     description: "Lomas de Plateros, Álvaro Obregón, CDMX" },
  { id: "p12", title: "Prolongación Paseo de la Reforma 1", description: "Lomas de Santa Fe, Cuajimalpa, CDMX" },
];

interface Props {
  onSelect: (address: string) => void;
  disabled?: boolean;
}

export default function PlacesSearch({ onSelect, disabled }: Props) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");

  const results = query.trim().length > 0
    ? MOCK_ADDRESSES.filter((a) =>
        `${a.title} ${a.description}`.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : MOCK_ADDRESSES.slice(0, 5);

  function handleSelect(addr: { title: string; description: string }) {
    const full = `${addr.title}, ${addr.description}`;
    setOpen(false);
    setQuery("");
    onSelect(full);
  }

  return (
    <>
      {/* Trigger button — simula el "Attach location" de WhatsApp */}
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
          {/* Pin icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFAA00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Buscar dirección
        </button>
      </div>

      {/* Bottom-sheet modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => { setOpen(false); setQuery(""); }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-t-3xl w-full overflow-hidden shadow-2xl animate-fadeIn"
            style={{ maxWidth: 380, maxHeight: "75vh", display: "flex", flexDirection: "column" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-[#CCCDD1]" />
            </div>

            {/* Header */}
            <div className="px-5 pb-3 border-b border-[#E5E5E5] flex-shrink-0">
              <p className="text-[15px] font-bold text-[#1C1F2A]">Dirección del espacio</p>
              <p className="text-[12px] text-[#9898A2] mt-0.5">Busca por calle, colonia o ciudad</p>
            </div>

            {/* Search input */}
            <div className="px-4 py-3 border-b border-[#E5E5E5] flex-shrink-0">
              <div className="flex items-center gap-2 bg-[#F5F5F7] rounded-xl px-3 py-2.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9898A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ej. Insurgentes, Santa Fe, Polanco…"
                  className="flex-1 bg-transparent text-[13px] text-[#1C1F2A] placeholder:text-[#9898A2] focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-[#9898A2] hover:text-[#424552]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Powered by Google label */}
            <div className="px-5 pt-2 pb-1 flex-shrink-0">
              <p className="text-[10px] text-[#9898A2]">Resultados de Google Maps (simulado)</p>
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1">
              {results.length === 0 ? (
                <div className="px-5 py-6 text-center text-[13px] text-[#9898A2]">
                  Sin resultados para &ldquo;{query}&rdquo;
                </div>
              ) : (
                results.map((addr, idx) => (
                  <button
                    key={addr.id}
                    onClick={() => handleSelect(addr)}
                    className={`
                      w-full text-left px-5 py-3.5 flex items-start gap-3
                      hover:bg-[#FFFBF0] active:bg-[#FFF3CC]
                      transition-colors duration-100 focus:outline-none
                      ${idx < results.length - 1 ? "border-b border-[#F0F0F0]" : ""}
                    `}
                  >
                    <div className="mt-0.5 flex-shrink-0 text-[#9898A2]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#1C1F2A] truncate">{addr.title}</p>
                      <p className="text-[11px] text-[#9898A2] mt-0.5 truncate">{addr.description}</p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Cancel */}
            <div className="p-4 border-t border-[#E5E5E5] flex-shrink-0">
              <button
                onClick={() => { setOpen(false); setQuery(""); }}
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
