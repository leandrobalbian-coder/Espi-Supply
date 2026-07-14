/**
 * Todos los copies del flujo y bienvenidas segmentadas.
 * Los placeholders de Growth están marcados con [PLACEHOLDER ...].
 * Centralizados aquí para que Growth pueda reemplazarlos sin tocar componentes.
 */

import { AGENT_NAME } from "./persona";

export type UserProfile = "propietario" | "broker";

// ─── Apertura ────────────────────────────────────────────────────────────────

export const OPENING_MESSAGES = {
  greeting: `👋 ¡Hola! Soy ${AGENT_NAME}, tu asistente de Spot2.`,
  intro:
    `Te escribo desde este número para ayudarte a crear tu cuenta ` +
    `y empezar a publicar tus espacios, en un par de minutos y sin trámites.`,
};

export const OPENING_QUICK_REPLIES = [
  { id: "start", label: "Sí, ayúdame" },
  { id: "whatis", label: "¿Qué es Spot2?" },
];

export const WHATIS_SPOT2 =
  `Spot2 es el marketplace #1 de bienes raíces comerciales en México. ` +
  `Conectamos a propietarios y brokers con empresas que buscan oficinas, bodegas, locales y más. ` +
  `¿Quieres que te ayude a crear tu cuenta para publicar tus espacios?`;

export const WHATIS_QUICK_REPLIES = [
  { id: "start", label: "Sí, cuéntame más" },
  { id: "later", label: "Quizás después" },
];

export const LATER_MESSAGE =
  `Claro, no hay prisa. Cuando quieras crear tu cuenta aquí estaré. ` +
  `Que tengas buen día 😊`;

// ─── Flujo de captura ─────────────────────────────────────────────────────────

export const FLOW_MESSAGES = {
  askName: `Perfecto. Para empezar, ¿cómo te llamas?`,
  askEmail: (name: string) =>
    `Genial, ${name} 👌 ¿A qué correo asociamos tu cuenta?`,
  askProfile: (name: string) =>
    `Casi listo, ${name}. ¿Cómo describes mejor tu perfil?`,
  confirming: (name: string, email: string) =>
    `Listo. Estoy creando tu cuenta con estos datos:\n• Nombre: ${name}\n• Correo: ${email}`,
  creatingAccount: `Creando tu cuenta…`,
  invalidEmail: `Mmm, ese correo no se ve completo. ¿Lo revisas? Debe verse como nombre@dominio.com`,
  askEmailCorrection: `¿Cuál es el correo correcto?`,
  askNameCorrection: `¿Cómo es tu nombre correcto?`,
  reconfirm: (name: string, email: string) =>
    `Perfecto, actualicé tus datos:\n• Nombre: ${name}\n• Correo: ${email}\n\n¿Todo bien ahora?`,
};

// Labels <20 chars (límite real Meta: 25, trunca en móvil >20)
export const PROFILE_QUICK_REPLIES = [
  { id: "propietario", label: "Soy propietario" },
  { id: "broker", label: "Soy broker" },
];

// Copy de UI — centralizado para no tener strings en componentes
export const UI_HINTS = {
  awaitingOptions: "Toca una opción para continuar",
  conversationDone: "Conversación finalizada",
};

// ─── Variante B — Formulario nativo ──────────────────────────────────────────

export const FORM_INTRO =
  `Para agilizarlo, te comparto un formulario rápido. ` +
  `Solo llena tu nombre y correo y en un momento tienes tu cuenta.`;

export const FORM_FIELDS = {
  name: { label: "Nombre completo", placeholder: "Ej. María García" },
  email: { label: "Correo electrónico", placeholder: "Ej. maria@empresa.com" },
};

// ─── Variante C — Pre-rellenado en plataforma ─────────────────────────────────

export const PLATFORM_REDIRECT_MESSAGE = (name: string) =>
  `Perfecto, ${name}. Te mando a la plataforma con tus datos ya listos — ` +
  `solo confirma y tu cuenta queda creada al instante.`;

// ─── Cierre exitoso ───────────────────────────────────────────────────────────

export const SUCCESS_MESSAGES = {
  base: (name: string) =>
    `¡Listo, ${name}! Tu cuenta ya está creada 🎉 ` +
    `Entra con tu correo para publicar tu primer espacio.`,
  cta: "Entrar a Spot2",
  ctaUrl: "https://spot2.mx/login", // placeholder — reemplazar con URL real
};

// ─── Bienvenidas segmentadas ──────────────────────────────────────────────────
// [PLACEHOLDER voz-Espi — validar con Growth antes de producción]

export const WELCOME_MESSAGES: Record<UserProfile, string> = {
  propietario:
    `[PLACEHOLDER voz-Espi — bienvenida Propietario, validar con Growth]\n` +
    `¡Bienvenido a Spot2! Ahora puedes publicar tus espacios directamente, ` +
    `sin intermediarios y sin depender de un gestor. ` +
    `¿Empezamos con tu primer espacio?`,
  broker:
    `[PLACEHOLDER voz-Espi — bienvenida Broker, validar con Growth]\n` +
    `¡Bienvenido a Spot2! Desde aquí puedes gestionar todos tus espacios ` +
    `y conectarlos con empresas que los están buscando. ` +
    `¿Listo para publicar tu primer listado?`,
};

export const WELCOME_CTAS: Record<UserProfile, { label: string; url: string }[]> = {
  propietario: [
    { label: "Publicar mi espacio", url: "https://spot2.mx/publicar" }, // era 25 chars
    { label: "Ver el dashboard", url: "https://spot2.mx/dashboard" },
  ],
  broker: [
    { label: "Ver mis espacios", url: "https://spot2.mx/espacios" }, // era 22 chars
    { label: "Ver el dashboard", url: "https://spot2.mx/dashboard" },
  ],
};
