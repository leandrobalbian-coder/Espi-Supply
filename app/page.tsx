"use client";
import { useState } from "react";
import PhoneMockup from "@/components/PhoneMockup";
import type { Variant } from "@/lib/flows";
import { AGENT_NAME } from "@/lib/persona";

const VARIANTS: { id: Variant; label: string; tagline: string }[] = [
  { id: "A", label: "Variante A", tagline: "Solo botón de confirmación" },
  { id: "B", label: "Variante B", tagline: "Formulario nativo" },
  { id: "C", label: "Variante C", tagline: "Pre-rellenado en plataforma" },
];

export default function Home() {
  const [variant, setVariant] = useState<Variant>("A");
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 bg-[#1C1F2A] shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[#FFAA00] font-bold text-[20px] tracking-tight">Spot2</span>
          <div className="w-px h-5 bg-white/20" />
          <span className="text-white/80 text-[13px] font-medium">
            {AGENT_NAME} — Supply Agent · Demo de creación de cuenta
          </span>
        </div>
        <span className="text-[11px] text-white/40 font-medium hidden md:block">
          Frontend demo · Sin backend
        </span>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Control panel */}
        <aside className="w-72 flex-shrink-0 bg-white border-r border-[#E5E5E5] flex flex-col overflow-y-auto">
          <div className="p-5 flex flex-col gap-6">
            {/* Variant selector */}
            <section>
              <h2 className="text-[11px] font-bold text-[#9898A2] uppercase tracking-widest mb-3">
                Variante de UX
              </h2>
              <div className="flex flex-col gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
                      ${variant === v.id
                        ? "border-[#FFAA00] bg-[#FFFBF0]"
                        : "border-[#E5E5E5] bg-white hover:border-[#FFAA00]/40"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-[13px] font-bold ${
                          variant === v.id ? "text-[#1C1F2A]" : "text-[#424552]"
                        }`}
                      >
                        {v.label}
                      </span>
                      {variant === v.id && (
                        <span className="text-[10px] font-bold text-[#FFAA00] bg-[#FFAA00]/10 px-2 py-0.5 rounded-full">
                          Activa
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#737373]">{v.tagline}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Metrics card */}
            <section>
              <h2 className="text-[11px] font-bold text-[#9898A2] uppercase tracking-widest mb-3">
                Métricas de fricción
              </h2>
              <VariantMetricsCard variant={variant} />
            </section>

            {/* Info note */}
            <section className="text-[11px] text-[#9898A2] bg-[#F5F5F5] rounded-xl p-3 leading-relaxed">
              Selecciona una variante para reiniciar la conversación y ver el flujo de punta a punta.
            </section>
          </div>
        </aside>

        {/* Phone mockup */}
        <main className="flex-1 overflow-hidden bg-[#F5F5F5]">
          <PhoneMockup variant={variant} />
        </main>
      </div>
    </div>
  );
}

// ─── Intro screen ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center px-8"
      style={{ background: "#1C1F2A", fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="max-w-lg w-full text-center">
        <p className="text-[#FFAA00] font-bold text-[28px] tracking-tight mb-2">Spot2</p>
        <div className="w-12 h-0.5 bg-[#FFAA00]/30 mx-auto mb-8" />

        <h1 className="text-white font-light text-[32px] leading-snug mb-4 tracking-wide">
          Conoce a <span className="font-bold text-[#FFAA00]">{AGENT_NAME}</span>
        </h1>
        <p className="text-white/60 text-[15px] leading-relaxed mb-10">
          {AGENT_NAME} ayuda a propietarios y brokers a crear su cuenta en Spot2 desde WhatsApp,
          sin depender de un gestor de cuenta. Esta demo muestra 3 variantes de UX para reducir la fricción.
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {["3 variantes de flujo", "Selector de perfil", "Roadmap futuro", "Voz de Espi"].map((f) => (
            <span
              key={f}
              className="text-[12px] font-semibold text-[#1C1F2A] bg-[#FFAA00] px-3 py-1 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>

        <button
          onClick={onStart}
          className="
            px-10 py-4 rounded-full bg-[#FFAA00] text-[#1C1F2A]
            text-[15px] font-bold hover:bg-[#FFC857]
            transition-all duration-150 shadow-lg
            focus:outline-none focus:ring-4 focus:ring-[#FFAA00]/30
            min-h-[52px]
          "
        >
          Iniciar demo
        </button>

        <p className="text-white/30 text-[11px] mt-8">
          Demo de frontend · Sin backend · Sin datos reales
        </p>
      </div>
    </div>
  );
}

// ─── Metrics card ─────────────────────────────────────────────────────────────
// [PLACEHOLDER — validar números reales con Growth/Producto]

const METRICS: Record<
  Variant,
  { steps: number; taps: number; friction: "Baja" | "Media" | "Alta"; pros: string[]; cons: string[] }
> = {
  A: {
    steps: 5,
    taps: 4,
    friction: "Baja",
    pros: ["Flujo conversacional natural", "No requiere abrir formulario", "Fácil de reintentar"],
    cons: ["Más mensajes = más tiempo", "Validación de correo limitada"],
  },
  B: {
    steps: 3,
    taps: 2,
    friction: "Baja",
    pros: ["Todo en un formulario", "Validación nativa", "Menos mensajes"],
    cons: ["Rompe el ritmo conversacional", "Depende de WhatsApp Flows"],
  },
  C: {
    steps: 4,
    taps: 3,
    friction: "Media",
    pros: ["Validación robusta en web", "Control total del formulario"],
    cons: ["Cambio de contexto (app → web)", "Riesgo de abandono al redirigir"],
  },
};

function VariantMetricsCard({ variant }: { variant: Variant }) {
  const m = METRICS[variant];
  const frictionColor =
    m.friction === "Baja" ? "#25D366" : m.friction === "Media" ? "#FFAA00" : "#DC2626";

  return (
    <div className="border border-[#E5E5E5] rounded-xl overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-[#E5E5E5] bg-[#F5F5F5]">
        <Stat label="Pasos" value={m.steps} />
        <Stat label="Toques" value={m.taps} />
        <div className="flex flex-col items-center justify-center py-3 px-2">
          <span className="text-[18px] font-bold" style={{ color: frictionColor }}>
            {m.friction}
          </span>
          <span className="text-[10px] text-[#9898A2] font-medium mt-0.5">Fricción</span>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <div>
          <p className="text-[10px] font-bold text-[#25D366] uppercase tracking-wider mb-1">Ventajas</p>
          {m.pros.map((p) => (
            <p key={p} className="text-[11px] text-[#424552] leading-snug">
              · {p}
            </p>
          ))}
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider mb-1">Limitaciones</p>
          {m.cons.map((c) => (
            <p key={c} className="text-[11px] text-[#424552] leading-snug">
              · {c}
            </p>
          ))}
        </div>
        <p className="text-[10px] text-[#9898A2] mt-1">[PLACEHOLDER — validar con Growth/Producto]</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-3 px-2">
      <span className="text-[20px] font-bold text-[#1C1F2A]">{value}</span>
      <span className="text-[10px] text-[#9898A2] font-medium mt-0.5">{label}</span>
    </div>
  );
}
