/**
 * Guión declarativo de cada variante.
 * El render NO vive aquí — solo datos.
 * Para cambiar el flujo, editá este archivo sin tocar componentes.
 */

export type Variant = "A" | "B" | "C";
export type VerificationMethod = "V0" | "V1" | "V2";
export type UserProfile = "propietario" | "broker";

export type StepType =
  | "text"
  | "quickReply"
  | "userInput"
  | "form"
  | "typing"
  | "cta"
  | "welcome"
  | "platformRedirect"
  | "success";

export type Actor = "bot" | "user";

export interface QuickReply {
  id: string;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: "text" | "email";
  placeholder: string;
}

export interface Step {
  id: string;
  actor: Actor;
  type: StepType;
  /** Mensaje estático o función que recibe el estado de la conversación */
  content: string | ((ctx: ConversationContext) => string);
  options?: QuickReply[];
  fields?: FormField[];
  delay?: number; // ms antes de mostrar (simula typing)
  /** Si requiere acción del usuario para avanzar */
  requiresInput?: boolean;
  /** Avanza automáticamente al siguiente paso sin input */
  auto?: boolean;
}

export interface ConversationContext {
  name: string;
  email: string;
  profile: UserProfile | null;
  variantAnswered?: boolean;
}

// ─── Pasos compartidos de apertura ───────────────────────────────────────────

export const OPENING_STEPS: Step[] = [
  {
    id: "greeting",
    actor: "bot",
    type: "text",
    content: "👋 ¡Hola! Soy Espi, tu asistente de Spot2.",
    delay: 600,
  },
  {
    id: "intro",
    actor: "bot",
    type: "quickReply",
    content:
      "Te escribo desde este número para ayudarte a crear tu cuenta y empezar a publicar tus espacios, en un par de minutos y sin trámites.",
    delay: 1200,
    options: [
      { id: "start", label: "Sí, ayúdame" },
      { id: "whatis", label: "¿Qué es Spot2?" },
    ],
    requiresInput: true,
  },
];

export const WHATIS_BRANCH_STEPS: Step[] = [
  {
    id: "whatis_answer",
    actor: "bot",
    type: "quickReply",
    content:
      "Spot2 es el marketplace #1 de bienes raíces comerciales en México. Conectamos a propietarios y brokers con empresas que buscan oficinas, bodegas, locales y más.",
    delay: 800,
    options: [
      { id: "start", label: "Crear mi cuenta" }, // era 22 chars "Quiero crear mi cuenta"
      { id: "later", label: "Quizás después" },
    ],
    requiresInput: true,
  },
];

export const LATER_STEP: Step = {
  id: "bye",
  actor: "bot",
  type: "text",
  content: "Claro, no hay prisa. Cuando quieras crear tu cuenta aquí estaré. ¡Que tengas buen día! 😊",
  delay: 600,
};

// ─── Cierre compartido (perfil + éxito) ──────────────────────────────────────

export const ASK_PROFILE_STEP: Step = {
  id: "ask_profile",
  actor: "bot",
  type: "quickReply",
  content: (ctx) => `Casi listo, ${ctx.name}. ¿Cómo describes mejor tu perfil?`,
  delay: 800,
  options: [
    { id: "propietario", label: "Soy propietario" }, // era 23 chars
    { id: "broker", label: "Soy broker" },           // era 15 chars (ya ok, uniformidad)
  ],
  requiresInput: true,
};

// Paso de re-confirmación tras corrección granular (Nielsen H1 — feedback de cambio)
export const A_RECONFIRM_STEP: Step = {
  id: "a_reconfirm",
  actor: "bot",
  type: "quickReply",
  content: (ctx) =>
    `Perfecto, actualicé tus datos:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Todo bien ahora?`,
  delay: 700,
  options: [
    { id: "confirm", label: "Sí, crear" },
    { id: "edit_email", label: "Corregir correo" },
    { id: "edit_name", label: "Corregir nombre" },
  ],
  requiresInput: true,
};

// Pasos de solicitud de corrección (usados inline en WhatsAppChat)
export const ASK_EMAIL_CORRECTION_STEP: Step = {
  id: "ask_email_correction",
  actor: "bot",
  type: "userInput",
  content: "¿Cuál es el correo correcto?",
  delay: 600,
  requiresInput: true,
};

export const ASK_NAME_CORRECTION_STEP: Step = {
  id: "ask_name_correction",
  actor: "bot",
  type: "userInput",
  content: "¿Cómo es tu nombre correcto?",
  delay: 600,
  requiresInput: true,
};

export const SUCCESS_STEP: Step = {
  id: "success",
  actor: "bot",
  type: "success",
  content: (ctx) =>
    `¡Listo, ${ctx.name}! Tu cuenta ya está creada 🎉 Entra con tu correo para publicar tu primer espacio.`,
  delay: 1000,
};

// V2 — el magic link se menciona en el mensaje de éxito (verificación diferida)
export const SUCCESS_STEP_V2: Step = {
  id: "success_v2",
  actor: "bot",
  type: "success",
  content: (ctx) =>
    `¡Listo, ${ctx.name}! Tu cuenta ya está creada 🎉 Te envié un enlace a ${ctx.email} para confirmar tu cuenta cuando entres 🔗 Mientras tanto, ya puedes empezar.`,
  delay: 1000,
};

// V1 — pasos de verificación por código OTP (simulado)
export const V1_ASK_CODE_STEP = (email: string): Step => ({
  id: "v1_ask_code",
  actor: "bot",
  type: "userInput",
  content: `Para confirmar que es tuyo, te envié un código de 6 dígitos a ${email} 📩 ¿Me lo compartes?`,
  delay: 900,
  requiresInput: true,
});

export const V1_CODE_SUCCESS_STEP: Step = {
  id: "v1_confirmed",
  actor: "bot",
  type: "text",
  content: "¡Perfecto! Correo confirmado ✓",
  delay: 600,
};

export const V1_CODE_WRONG_STEP: Step = {
  id: "v1_wrong",
  actor: "bot",
  type: "quickReply",
  content: "Ese código no coincide. ¿Lo reintentas?",
  delay: 600,
  options: [{ id: "resend_code", label: "Reenviar código" }],
  requiresInput: true,
};

export const V1_RESENT_STEP: Step = {
  id: "v1_resent",
  actor: "bot",
  type: "userInput",
  content: "Listo, te lo mandé de nuevo 📩 ¿Me lo compartes?",
  delay: 600,
  requiresInput: true,
};

// ─── Variante A — Solo botón de confirmación ─────────────────────────────────

export const VARIANT_A_STEPS: Step[] = [
  {
    id: "a_ask_name",
    actor: "bot",
    type: "userInput",
    content: "Perfecto. Para empezar, ¿cómo te llamas?",
    delay: 800,
    requiresInput: true,
  },
  {
    id: "a_ask_email",
    actor: "bot",
    type: "userInput",
    content: (ctx) => `Genial, ${ctx.name} 👌 ¿A qué correo asociamos tu cuenta?`,
    delay: 800,
    requiresInput: true,
  },
  {
    id: "a_confirm",
    actor: "bot",
    type: "quickReply",
    content: (ctx) =>
      `Listo. Voy a crear tu cuenta con estos datos:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Todo correcto?`,
    delay: 800,
    options: [
      { id: "confirm", label: "Sí, crear" },        // 9 chars
      { id: "edit_email", label: "Corregir correo" }, // 15 chars
      { id: "edit_name", label: "Corregir nombre" },  // 15 chars
    ],
    requiresInput: true,
  },
  {
    id: "a_creating",
    actor: "bot",
    type: "typing",
    content: "Creando tu cuenta…",
    delay: 400,
    auto: true,
  },
];

// ─── Variante B — Formulario nativo ──────────────────────────────────────────

export const VARIANT_B_STEPS: Step[] = [
  {
    id: "b_form_intro",
    actor: "bot",
    type: "text",
    content:
      "Para agilizarlo, te comparto un formulario rápido. Solo llena tu nombre y correo y en un momento tienes tu cuenta.",
    delay: 800,
  },
  {
    id: "b_form",
    actor: "bot",
    type: "form",
    content: "Completa tus datos:",
    delay: 600,
    fields: [
      { id: "name", label: "Nombre completo", type: "text", placeholder: "Ej. María García" },
      { id: "email", label: "Correo electrónico", type: "email", placeholder: "Ej. maria@empresa.com" },
    ],
    requiresInput: true,
  },
  {
    id: "b_received",
    actor: "bot",
    type: "typing",
    content: "Recibido. Creando tu cuenta…",
    delay: 400,
    auto: true,
  },
];

// ─── Variante C — Pre-rellenado en plataforma ─────────────────────────────────

export const VARIANT_C_STEPS: Step[] = [
  {
    id: "c_ask_name",
    actor: "bot",
    type: "userInput",
    content: "Perfecto. ¿Cómo te llamas?",
    delay: 800,
    requiresInput: true,
  },
  {
    id: "c_ask_email",
    actor: "bot",
    type: "userInput",
    content: (ctx) => `Gracias, ${ctx.name}. ¿Cuál es tu correo?`,
    delay: 800,
    requiresInput: true,
  },
  {
    id: "c_redirect",
    actor: "bot",
    type: "platformRedirect",
    content: (ctx) =>
      `Perfecto, ${ctx.name}. Te mando a la plataforma con tus datos ya listos — solo confirma y tu cuenta queda creada al instante.`,
    delay: 800,
    requiresInput: true,
  },
];
