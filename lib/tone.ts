/**
 * Capa de tono de Espi — texto puro, sin lógica.
 * La máquina de estados y la estructura de pasos NO cambian por tono.
 * Solo cambian las cadenas que Espi emite.
 *
 * Reglas base (de persona.ts, siempre vigentes):
 *   - "Directo" es escueto pero educado; no frío ni cortante.
 *   - "Neutro" es sobrio pero humano; no robótico.
 *   - "Cálido" es el tono actual de Espi: emojis con moderación, cercanía, registro mexicano.
 *   - Los labels de botones NO cambian — deben quedar cortos y consistentes (límite Meta < 20 chars).
 */

import type { ConversationContext } from "./flows";

export type Tone = "calido" | "neutro" | "directo";

type CopyValue = string | ((ctx: ConversationContext) => string);

export const TONED_COPY: Record<string, Record<Tone, CopyValue>> = {

  // ─── Apertura ────────────────────────────────────────────────────────────────

  greeting: {
    calido:  "👋 ¡Hola! Soy Espi, tu asistente de Spot2.",
    neutro:  "Hola. Soy Espi, asistente de Spot2.",
    directo: "Soy Espi, de Spot2.",
  },

  intro_opening: {
    calido:  "Te escribo desde este número para ayudarte a crear tu cuenta y empezar a publicar tus espacios, en un par de minutos y sin trámites.",
    neutro:  "Te contacto para ayudarte a crear tu cuenta en Spot2 y comenzar a publicar espacios. El proceso toma solo unos minutos.",
    directo: "Puedo crear tu cuenta en Spot2 ahora. ¿Empezamos?",
  },

  whatis_answer: {
    calido:  "Spot2 es el marketplace #1 de bienes raíces comerciales en México. Conectamos a propietarios y brokers con empresas que buscan oficinas, bodegas, locales y más.",
    neutro:  "Spot2 es el marketplace líder de bienes raíces comerciales en México. Conectamos a propietarios y brokers con empresas que buscan espacios.",
    directo: "Spot2: marketplace #1 de bienes raíces comerciales en México. Conecta propietarios y brokers con empresas.",
  },

  later_bye: {
    calido:  "Claro, no hay prisa. Cuando quieras crear tu cuenta aquí estaré. ¡Que tengas buen día! 😊",
    neutro:  "Entendido. Cuando quieras crear tu cuenta, aquí estaré. Que tenga buen día.",
    directo: "Sin problema. Aquí estaré cuando lo necesites.",
  },

  // ─── Variante A — conversacional ─────────────────────────────────────────────

  a_ask_name: {
    calido:  "Perfecto. Para empezar, ¿cómo te llamas?",
    neutro:  "Para comenzar, ¿cuál es tu nombre?",
    directo: "¿Tu nombre?",
  },

  a_ask_email: {
    calido:  (ctx) => `Genial, ${ctx.name} 👌 ¿A qué correo asociamos tu cuenta?`,
    neutro:  (ctx) => `Gracias, ${ctx.name}. ¿Cuál es tu correo electrónico?`,
    directo: (ctx) => `${ctx.name}, ¿tu correo?`,
  },

  a_confirm: {
    calido:  (ctx) => `Listo. Voy a crear tu cuenta con estos datos:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Todo correcto?`,
    neutro:  (ctx) => `Estos son los datos para tu cuenta:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Confirmas?`,
    directo: (ctx) => `Nombre: ${ctx.name}\nCorreo: ${ctx.email}\n\n¿Correcto?`,
  },

  a_creating: {
    calido:  "Creando tu cuenta…",
    neutro:  "Creando tu cuenta…",
    directo: "Creando cuenta…",
  },

  // ─── Variante B — formulario nativo ──────────────────────────────────────────

  b_form_intro: {
    calido:  "Para agilizarlo, te comparto un formulario rápido. Solo llena tus datos y en un momento tienes tu cuenta.",
    neutro:  "Para continuar, completa el siguiente formulario con tus datos.",
    directo: "Completa este formulario para crear tu cuenta.",
  },

  b_form_label: {
    calido:  "Completa tus datos:",
    neutro:  "Completa tus datos:",
    directo: "Tus datos:",
  },

  b_received: {
    calido:  "Recibido. Creando tu cuenta…",
    neutro:  "Datos recibidos. Creando tu cuenta…",
    directo: "Recibido. Creando…",
  },

  // ─── Variante C — pre-rellenado ───────────────────────────────────────────────

  c_ask_name: {
    calido:  "Perfecto. ¿Cómo te llamas?",
    neutro:  "¿Cuál es tu nombre?",
    directo: "¿Tu nombre?",
  },

  c_ask_email: {
    calido:  (ctx) => `Gracias, ${ctx.name}. ¿Cuál es tu correo?`,
    neutro:  (ctx) => `${ctx.name}, ¿cuál es tu correo electrónico?`,
    directo: (ctx) => `${ctx.name}, ¿tu correo?`,
  },

  c_redirect: {
    calido:  (ctx) => `Perfecto, ${ctx.name}. Te mando a la plataforma con tus datos ya listos — solo confirma y tu cuenta queda creada al instante.`,
    neutro:  (ctx) => `Listo, ${ctx.name}. Te redireccionamos a Spot2 con tus datos pre-cargados para completar el registro.`,
    directo: (ctx) => `Todo listo, ${ctx.name}. Abre Spot2 para confirmar tu cuenta.`,
  },

  // ─── Corrección granular ──────────────────────────────────────────────────────

  a_reconfirm: {
    calido:  (ctx) => `Perfecto, actualicé tus datos:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Todo bien ahora?`,
    neutro:  (ctx) => `Actualicé la información:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Confirmas?`,
    directo: (ctx) => `Actualizado:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Correcto?`,
  },

  ask_email_correction: {
    calido:  "¿Cuál es el correo correcto?",
    neutro:  "Indica el correo correcto.",
    directo: "¿Correo correcto?",
  },

  ask_name_correction: {
    calido:  "¿Cómo es tu nombre correcto?",
    neutro:  "Indica tu nombre correcto.",
    directo: "¿Tu nombre correcto?",
  },

  // ─── Perfil y éxito (onboarding) ─────────────────────────────────────────────

  ask_profile: {
    calido:  (ctx) => `Casi listo, ${ctx.name}. ¿Cómo describes mejor tu perfil?`,
    neutro:  (ctx) => `${ctx.name}, ¿cuál es tu perfil?`,
    directo: (ctx) => `${ctx.name}, ¿tu perfil?`,
  },

  success: {
    calido:  (ctx) => `¡Listo, ${ctx.name}! Tu cuenta ya está creada 🎉 Entra con tu correo para publicar tu primer espacio.`,
    neutro:  (ctx) => `Cuenta creada, ${ctx.name}. Ingresa con tu correo para publicar tu primer espacio.`,
    directo: (ctx) => `Cuenta creada. Entra con ${ctx.email}.`,
  },

  success_v2: {
    calido:  (ctx) => `¡Listo, ${ctx.name}! Tu cuenta ya está creada 🎉 Te envié un enlace a ${ctx.email} para confirmar tu cuenta cuando entres 🔗 Mientras tanto, ya puedes empezar.`,
    neutro:  (ctx) => `Cuenta creada, ${ctx.name}. Enviamos un enlace de confirmación a ${ctx.email}. Puedes empezar de inmediato.`,
    directo: (ctx) => `Cuenta creada. Enlace de confirmación enviado a ${ctx.email}.`,
  },

  // ─── Verificación V1 ─────────────────────────────────────────────────────────

  v1_ask_code: {
    calido:  (ctx) => `Para confirmar que es tuyo, te envié un código de 6 dígitos a ${ctx.email} 📩 ¿Me lo compartes?`,
    neutro:  (ctx) => `Para verificar tu correo, enviamos un código de 6 dígitos a ${ctx.email}. Compártelo aquí.`,
    directo: (ctx) => `Código enviado a ${ctx.email}. ¿Cuál es?`,
  },

  v1_confirmed: {
    calido:  "¡Perfecto! Correo confirmado ✓",
    neutro:  "Correo verificado.",
    directo: "Verificado.",
  },

  v1_wrong: {
    calido:  "Ese código no coincide. ¿Lo reintentas?",
    neutro:  "El código no es correcto. ¿Deseas reintentarlo?",
    directo: "Código incorrecto. ¿Reintento?",
  },

  v1_resent: {
    calido:  "Listo, te lo mandé de nuevo 📩 ¿Me lo compartes?",
    neutro:  "Código reenviado. Compártelo cuando lo tengas.",
    directo: "Reenviado. ¿Cuál es?",
  },

  // ─── Publicar espacio — Variante A ───────────────────────────────────────────

  publish_intro_a: {
    calido:  "¡Genial! Publicar un espacio toma menos de 5 minutos. Solo necesito unos datos básicos — el resto lo completás en la plataforma con todo pre-cargado.",
    neutro:  "Publicar un espacio toma menos de 5 minutos. Solo necesito algunos datos básicos; el resto lo completas en la plataforma.",
    directo: "Necesito unos datos básicos. El resto lo completas en Spot2.",
  },

  publish_type_q: {
    calido:  "¿Qué tipo de espacio es?",
    neutro:  "¿Qué tipo de espacio es?",
    directo: "¿Tipo de espacio?",
  },

  publish_size_q: {
    calido:  "¿Cuántos metros cuadrados tiene? Solo el número.",
    neutro:  "¿Cuántos metros cuadrados tiene? Solo el número.",
    directo: "¿M²? Solo el número.",
  },

  publish_price_q: {
    calido:  "¿Y el precio mensual en pesos? Solo el número, sin comas ni símbolo.",
    neutro:  "¿Cuál es el precio mensual en pesos? Solo el número, sin formato.",
    directo: "¿Precio mensual en pesos? Sin formato.",
  },

  publish_address_q: {
    calido:  "¿Dónde está ubicado el espacio?",
    neutro:  "¿Cuál es la dirección del espacio?",
    directo: "¿Dirección?",
  },

  publish_photos_a: {
    calido:  "Ya casi 📸 Mandame fotos del espacio — mínimo 3 para que tu anuncio destaque. Entre más, mejor.",
    neutro:  "Casi terminamos. Envía fotos del espacio — mínimo 3. Entre más fotos, mejor el anuncio.",
    directo: "Fotos del espacio (mínimo 3).",
  },

  publish_confirm_summary: {
    calido:  (ctx) => `Perfecto, acá el resumen:\n\n• Tipo: ${ctx.spaceType ?? "—"}\n• Tamaño: ${ctx.spaceSize ?? "—"} m²\n• Precio: $${ctx.spacePrice ?? "—"}/mes\n• Dirección: ${ctx.spaceStreet ?? "—"} ${ctx.spaceNumber ?? ""}, CP ${ctx.spaceZip ?? "—"}\n• Fotos: ✓\n\n¿Lo publicamos?`,
    neutro:  (ctx) => `Resumen del espacio:\n\n• Tipo: ${ctx.spaceType ?? "—"}\n• Tamaño: ${ctx.spaceSize ?? "—"} m²\n• Precio: $${ctx.spacePrice ?? "—"}/mes\n• Dirección: ${ctx.spaceStreet ?? "—"} ${ctx.spaceNumber ?? ""}, CP ${ctx.spaceZip ?? "—"}\n• Fotos: ✓\n\n¿Publicamos?`,
    directo: (ctx) => `Tipo: ${ctx.spaceType ?? "—"}\nTamaño: ${ctx.spaceSize ?? "—"} m²\nPrecio: $${ctx.spacePrice ?? "—"}/mes\nDirección: ${ctx.spaceStreet ?? "—"} ${ctx.spaceNumber ?? ""}, CP ${ctx.spaceZip ?? "—"}\nFotos: ✓\n\n¿Publicar?`,
  },

  publish_creating: {
    calido:  "Publicando tu espacio…",
    neutro:  "Publicando el espacio…",
    directo: "Publicando…",
  },

  publish_success: {
    calido:  (ctx) => `¡Listo${ctx.name ? `, ${ctx.name}` : ""}! Tu espacio ya está en borrador 🎉 Entra a la plataforma para agregar descripción, más fotos y publicarlo.`,
    neutro:  (ctx) => `Espacio guardado como borrador${ctx.name ? `, ${ctx.name}` : ""}. Ingresa a la plataforma para completar la descripción y publicarlo.`,
    directo: (ctx) => `Borrador creado. Entra a Spot2 para publicarlo.`,
  },

  // ─── Publicar espacio — Variante B ───────────────────────────────────────────

  publish_intro_b: {
    calido:  "¡Genial! Para agilizarlo, te comparto un formulario con todos los datos del espacio. Lo llenás en un paso y listo.",
    neutro:  "Para continuar, completa el formulario con los datos del espacio. Todo en un solo paso.",
    directo: "Completa este formulario con los datos del espacio.",
  },

  publish_form_b_label: {
    calido:  "Datos del espacio:",
    neutro:  "Datos del espacio:",
    directo: "Datos:",
  },

  publish_photos_b: {
    calido:  "¡Casi listo! 📸 Solo falta que me mandes fotos del espacio — mínimo 3 para que tu anuncio destaque.",
    neutro:  "Casi terminamos. Envía fotos del espacio — mínimo 3 para que el anuncio destaque.",
    directo: "Fotos del espacio (mínimo 3).",
  },

  // ─── Publicar espacio — Variante C ───────────────────────────────────────────

  publish_intro_c: {
    calido:  "¡Genial! Solo necesito dos datos rápidos — el resto lo completás en Spot2 con el borrador ya pre-cargado.",
    neutro:  "Solo necesito dos datos. El resto lo completas en Spot2 con el borrador pre-cargado.",
    directo: "Dos datos y listo. El resto en Spot2.",
  },

  publish_size_c_q: {
    calido:  "¿Y cuántos metros cuadrados tiene? Solo el número.",
    neutro:  "¿Cuántos metros cuadrados tiene? Solo el número.",
    directo: "¿M²?",
  },

  publish_redirect_c: {
    calido:  "Perfecto. Te mando a Spot2 con el borrador de tu espacio pre-cargado — solo completás precio, dirección y fotos allá.",
    neutro:  "Listo. Te redireccionamos a Spot2 con el borrador de tu espacio. Completa precio, dirección y fotos allá.",
    directo: "Borrador listo. Completa precio, dirección y fotos en Spot2.",
  },

  publish_success_c: {
    calido:  (ctx) => `¡Listo${ctx.name ? `, ${ctx.name}` : ""}! Tu borrador está en Spot2. Completá precio, dirección y fotos para publicarlo. 🚀`,
    neutro:  (ctx) => `Borrador creado${ctx.name ? `, ${ctx.name}` : ""}. Ingresa a Spot2 para completar precio, dirección y fotos.`,
    directo: (ctx) => `Borrador en Spot2. Completa precio, dirección y fotos.`,
  },

  // ─── Mensajes inline (generados en WhatsAppChat, no en flows.ts) ─────────────

  publish_edit_restart_a: {
    calido:  "Claro, empecemos de nuevo. ¿Qué tipo de espacio es?",
    neutro:  "Sin problema. ¿Qué tipo de espacio es?",
    directo: "¿Tipo de espacio?",
  },

  publish_edit_restart_b: {
    calido:  "Claro, modifiquemos los datos.",
    neutro:  "Sin problema. Modifica los datos en el formulario.",
    directo: "Modifica los datos.",
  },

  onboarding_c_confirmed: {
    calido:  "Confirmado. Creando tu cuenta…",
    neutro:  "Confirmado. Creando tu cuenta…",
    directo: "Confirmado. Creando…",
  },

  email_error: {
    calido:  "Mmm, ese correo no se ve completo. ¿Lo revisas? Debe verse como nombre@dominio.com",
    neutro:  "El correo no tiene el formato correcto. Debe ser nombre@dominio.com",
    directo: "Correo inválido. Formato: nombre@dominio.com",
  },

  done_welcome_q: {
    calido:  "¿Qué hacemos ahora?",
    neutro:  "¿Cómo podemos continuar?",
    directo: "¿Qué sigue?",
  },
};

export function getCopy(key: string, tone: Tone, ctx: ConversationContext): string {
  const entry = TONED_COPY[key];
  if (!entry) return `[copy:${key}]`;
  const val = entry[tone];
  return typeof val === "function" ? val(ctx) : val;
}
