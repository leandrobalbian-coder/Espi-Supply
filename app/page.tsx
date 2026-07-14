"use client";
import { useState } from "react";
import PhoneMockup from "@/components/PhoneMockup";
import type { Variant, VerificationMethod } from "@/lib/flows";
import type { StartMode } from "@/components/WhatsAppChat";
import { AGENT_NAME } from "@/lib/persona";
import type { Tone } from "@/lib/tone";

const VARIANTS: { id: Variant; label: string; tagline: string }[] = [
  { id: "A", label: "Variante A", tagline: "Solo botón de confirmación" },
  { id: "B", label: "Variante B", tagline: "Formulario nativo" },
  { id: "C", label: "Variante C", tagline: "Pre-rellenado en plataforma" },
];

const VERIFICATION_METHODS: { id: VerificationMethod; label: string; tagline: string }[] = [
  { id: "V0", label: "V0 — Sin verificación", tagline: "Directo al onboarding" },
  { id: "V1", label: "V1 — Código OTP", tagline: "6 dígitos en el chat" },
  { id: "V2", label: "V2 — Magic link", tagline: "Enlace diferido por correo" },
];

const DEMO_CODE = "123456";

const TONES: { id: Tone; label: string; tagline: string }[] = [
  { id: "calido",   label: "Cálido",             tagline: "Cercano, con emojis — Espi actual" },
  { id: "neutro",   label: "Neutro-profesional",  tagline: "Sobrio, sin emojis" },
  { id: "directo",  label: "Directo",             tagline: "Mínimo, eficiente" },
];

const DEMO_MODES: { id: StartMode; label: string; tagline: string }[] = [
  { id: "onboarding",    label: "Crear cuenta",      tagline: "Onboarding completo" },
  { id: "publish_space", label: "Publicar espacio",   tagline: "Flujo de publicación" },
];

export default function Home() {
  const [variant, setVariant] = useState<Variant>("A");
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>("V0");
  const [startMode, setStartMode] = useState<StartMode>("onboarding");
  const [tone, setTone] = useState<Tone>("calido");
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
            {AGENT_NAME} — Supply Agent · {startMode === "publish_space" ? "Flujo de publicación" : "Demo de creación de cuenta"}
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
            {/* Mode selector */}
            <section>
              <h2 className="text-[11px] font-bold text-[#9898A2] uppercase tracking-widest mb-3">
                Modo demo
              </h2>
              <div className="flex flex-col gap-2">
                {DEMO_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setStartMode(m.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
                      ${startMode === m.id
                        ? "border-[#FFAA00] bg-[#FFFBF0]"
                        : "border-[#E5E5E5] bg-white hover:border-[#FFAA00]/40"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[13px] font-bold ${startMode === m.id ? "text-[#1C1F2A]" : "text-[#424552]"}`}>
                        {m.label}
                      </span>
                      {startMode === m.id && (
                        <span className="text-[10px] font-bold text-[#FFAA00] bg-[#FFAA00]/10 px-2 py-0.5 rounded-full">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#737373]">{m.tagline}</p>
                  </button>
                ))}
              </div>
            </section>

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
                      <span className={`text-[13px] font-bold ${variant === v.id ? "text-[#1C1F2A]" : "text-[#424552]"}`}>
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

            {/* Verification method selector — solo aplica al onboarding */}
            {startMode === "onboarding" ? (
              <section>
                <h2 className="text-[11px] font-bold text-[#9898A2] uppercase tracking-widest mb-3">
                  Método de verificación
                </h2>
                <div className="flex flex-col gap-2">
                  {VERIFICATION_METHODS.map((vm) => (
                    <button
                      key={vm.id}
                      onClick={() => setVerificationMethod(vm.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150
                        focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
                        ${verificationMethod === vm.id
                          ? "border-[#FFAA00] bg-[#FFFBF0]"
                          : "border-[#E5E5E5] bg-white hover:border-[#FFAA00]/40"
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[13px] font-bold ${verificationMethod === vm.id ? "text-[#1C1F2A]" : "text-[#424552]"}`}>
                          {vm.label}
                        </span>
                        {verificationMethod === vm.id && (
                          <span className="text-[10px] font-bold text-[#FFAA00] bg-[#FFAA00]/10 px-2 py-0.5 rounded-full">
                            Activa
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#737373]">{vm.tagline}</p>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
              <section>
                <h2 className="text-[11px] font-bold text-[#9898A2] uppercase tracking-widest mb-3">
                  Método de verificación
                </h2>
                <div className="rounded-xl border border-dashed border-[#E5E5E5] bg-[#F9F9F9] px-4 py-3">
                  <p className="text-[12px] text-[#9898A2] leading-relaxed">
                    La verificación aplica al crear cuenta. En publicar espacio la cuenta ya existe — este selector no tiene efecto.
                  </p>
                </div>
              </section>
            )}

            {/* Tone selector */}
            <section>
              <h2 className="text-[11px] font-bold text-[#9898A2] uppercase tracking-widest mb-3">
                Tono de Espi
              </h2>
              <div className="flex flex-col gap-2">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-[#FFAA00]/40
                      ${tone === t.id
                        ? "border-[#FFAA00] bg-[#FFFBF0]"
                        : "border-[#E5E5E5] bg-white hover:border-[#FFAA00]/40"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[13px] font-bold ${tone === t.id ? "text-[#1C1F2A]" : "text-[#424552]"}`}>
                        {t.label}
                      </span>
                      {tone === t.id && (
                        <span className="text-[10px] font-bold text-[#FFAA00] bg-[#FFAA00]/10 px-2 py-0.5 rounded-full">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#737373]">{t.tagline}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* V1 OTP hint card */}
            {verificationMethod === "V1" && (
              <section>
                <div
                  className="rounded-xl p-3 flex flex-col gap-1.5"
                  style={{
                    border: "1.5px dashed #FFAA00",
                    background: "#FFFBF0",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[16px]">💡</span>
                    <span className="text-[11px] font-bold text-[#424552] uppercase tracking-wider">
                      Andamiaje de demo
                    </span>
                  </div>
                  <p className="text-[12px] text-[#424552] leading-relaxed">
                    Código OTP fijo para esta demo:
                  </p>
                  <p className="text-[22px] font-bold text-[#1C1F2A] tracking-[0.3em] text-center py-1">
                    {DEMO_CODE}
                  </p>
                  <p className="text-[11px] text-[#9898A2] leading-relaxed">
                    En producción se enviaría un código real al correo del usuario.
                  </p>
                </div>
              </section>
            )}

            {/* Metrics card — two sections */}
            <section>
              <h2 className="text-[11px] font-bold text-[#9898A2] uppercase tracking-widest mb-3">
                Métricas de fricción
              </h2>
              <CombinedMetricsCard variant={variant} verificationMethod={verificationMethod} startMode={startMode} />
            </section>

            {/* Info note */}
            <section className="text-[11px] text-[#9898A2] bg-[#F5F5F5] rounded-xl p-3 leading-relaxed">
              Selecciona una variante o método de verificación para reiniciar la conversación.
            </section>
          </div>
        </aside>

        {/* Phone mockup */}
        <main className="flex-1 overflow-hidden bg-[#F5F5F5]">
          <PhoneMockup variant={variant} verificationMethod={verificationMethod} startMode={startMode} tone={tone} />
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
          sin depender de un gestor de cuenta. Esta demo muestra 3 variantes de UX y 3 métodos de verificación.
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {["3 variantes de flujo", "3 métodos de verificación", "Selector de perfil", "Voz de Espi"].map((f) => (
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

// ─── Combined metrics (variant + verification) ────────────────────────────────
// [PLACEHOLDER — validar números reales con Growth/Producto]

const VARIANT_METRICS: Record<
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

const VERIFICATION_METRICS: Record<
  VerificationMethod,
  { friction: "Baja" | "Media" | "Alta"; pros: string[]; cons: string[] }
> = {
  V0: {
    friction: "Baja",
    pros: ["Cero fricción extra", "Onboarding más rápido"],
    cons: ["Sin validación de correo", "Mayor riesgo de datos incorrectos"],
  },
  V1: {
    friction: "Media",
    pros: ["Correo verificado al instante", "Reduce bounces"],
    cons: ["Un paso extra en el chat", "Requiere acceso al correo en ese momento"],
  },
  V2: {
    friction: "Baja",
    pros: ["No interrumpe el flujo", "Verificación cuando el usuario quiera"],
    cons: ["Correo puede quedar sin verificar", "Envío de emails como deuda técnica"],
  },
};

// [PLACEHOLDER — validar números reales con Growth/Producto]
const PUBLISH_VARIANT_METRICS: Record<
  Variant,
  { steps: number; taps: number; friction: "Baja" | "Media" | "Alta"; pros: string[]; cons: string[] }
> = {
  A: {
    steps: 7,
    taps: 6,
    friction: "Baja",
    pros: ["Datos capturados uno a uno", "Corrección fácil por paso", "Sin salir del chat"],
    cons: ["Más mensajes = más tiempo", "Más toques que la variante B"],
  },
  B: {
    steps: 4,
    taps: 3,
    friction: "Baja",
    pros: ["Todos los datos en un solo formulario", "Validación nativa", "Mínimos mensajes"],
    cons: ["Rompe el ritmo conversacional", "Depende de WhatsApp Flows"],
  },
  C: {
    steps: 3,
    taps: 2,
    friction: "Media",
    pros: ["Menor fricción en el chat", "Formulario completo en plataforma web"],
    cons: ["Cambio de contexto (WhatsApp → web)", "Riesgo de abandono al redirigir"],
  },
};

function CombinedMetricsCard({ variant, verificationMethod, startMode }: { variant: Variant; verificationMethod: VerificationMethod; startMode: StartMode }) {
  const isPublish = startMode === "publish_space";
  const vm  = isPublish ? PUBLISH_VARIANT_METRICS[variant] : VARIANT_METRICS[variant];
  const vvm = VERIFICATION_METRICS[verificationMethod];
  const frictionColor = (f: string) =>
    f === "Baja" ? "#25D366" : f === "Media" ? "#FFAA00" : "#DC2626";

  return (
    <div className="border border-[#E5E5E5] rounded-xl overflow-hidden flex flex-col gap-0">
      {/* Variante activa */}
      <div className="px-3 pt-3 pb-1">
        <p className="text-[10px] font-bold text-[#9898A2] uppercase tracking-wider mb-2">
          Variante activa{isPublish ? " — Publicar espacio" : " — Crear cuenta"}
        </p>
        <div className="grid grid-cols-3 divide-x divide-[#E5E5E5] bg-[#F5F5F5] rounded-lg mb-2">
          <Stat label="Pasos" value={vm.steps} />
          <Stat label="Toques" value={vm.taps} />
          <div className="flex flex-col items-center justify-center py-2 px-1">
            <span className="text-[16px] font-bold" style={{ color: frictionColor(vm.friction) }}>
              {vm.friction}
            </span>
            <span className="text-[9px] text-[#9898A2] font-medium mt-0.5">Fricción</span>
          </div>
        </div>
        <ProsConsBlock pros={vm.pros} cons={vm.cons} />
        <p className="text-[10px] text-[#9898A2] mt-1">[PLACEHOLDER — validar con Growth/Producto]</p>
      </div>

      <div className="h-px bg-[#E5E5E5] mx-3" />

      {/* Verificación activa — solo relevante en onboarding */}
      <div className="px-3 pt-2 pb-3">
        <p className="text-[10px] font-bold text-[#9898A2] uppercase tracking-wider mb-2">
          Verificación activa
        </p>
        {isPublish ? (
          <p className="text-[11px] text-[#9898A2] leading-relaxed">
            No aplica en este modo — la cuenta ya existe al publicar.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[14px] font-bold" style={{ color: frictionColor(vvm.friction) }}>
                {vvm.friction}
              </span>
              <span className="text-[10px] text-[#9898A2]">fricción adicional</span>
            </div>
            <ProsConsBlock pros={vvm.pros} cons={vvm.cons} />
          </>
        )}
        <p className="text-[10px] text-[#9898A2] mt-2">[PLACEHOLDER — validar con Growth/Producto]</p>
      </div>
    </div>
  );
}

function ProsConsBlock({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <p className="text-[9px] font-bold text-[#25D366] uppercase tracking-wider mb-0.5">Ventajas</p>
        {pros.map((p) => (
          <p key={p} className="text-[11px] text-[#424552] leading-snug">· {p}</p>
        ))}
      </div>
      <div>
        <p className="text-[9px] font-bold text-[#DC2626] uppercase tracking-wider mb-0.5">Limitaciones</p>
        {cons.map((c) => (
          <p key={c} className="text-[11px] text-[#424552] leading-snug">· {c}</p>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-2 px-1">
      <span className="text-[18px] font-bold text-[#1C1F2A]">{value}</span>
      <span className="text-[9px] text-[#9898A2] font-medium mt-0.5">{label}</span>
    </div>
  );
}
