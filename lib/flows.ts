/**
 * Guión declarativo de cada variante.
 * El render NO vive aquí — solo datos.
 * Para cambiar el flujo, editá este archivo sin tocar componentes.
 */

export type Variant = "A" | "B" | "C";
export type VerificationMethod = "V0" | "WA" | "EMAIL" | "SMS";
export type UserProfile = "propietario" | "broker" | "desarrollador";

export type StepType =
  | "text"
  | "quickReply"
  | "userInput"
  | "form"
  | "typing"
  | "cta"
  | "welcome"
  | "platformRedirect"
  | "success"
  | "list"
  | "photoUpload";

export type Actor = "bot" | "user";

export interface QuickReply {
  id: string;
  label: string;
}

export interface ListItem {
  id: string;
  title: string;       // límite Meta: ≤ 24 chars
  description?: string; // límite Meta: ≤ 72 chars
}

export interface FormField {
  id: string;
  label: string;
  // Meta WhatsApp Flows soporta: text, email, phone, number, date, y single-select (dropdown).
  // "select" aquí simula el single-select nativo de Flows. En producción requiere JSON schema registrado en Meta Business.
  // "password" → TextInput con type=password (enmascarado). "checkbox" → OptIn nativo de Flows.
  type: "text" | "email" | "select" | "password" | "checkbox";
  placeholder: string;
  options?: string[];    // solo para type: "select"
  optional?: boolean;    // campo no requerido en validación
  disables?: string;     // id del campo que deshabilita cuando está marcado (solo para checkbox)
}

export interface Step {
  id: string;
  actor: Actor;
  type: StepType;
  /** Mensaje estático o función que recibe el estado de la conversación */
  content: string | ((ctx: ConversationContext) => string);
  /** Clave en TONED_COPY para resolver el texto según el tono activo.
   *  Cuando está presente, el componente usa getCopy(contentKey, tone, ctx)
   *  en lugar de content. */
  contentKey?: string;
  options?: QuickReply[];
  fields?: FormField[];
  listItems?: ListItem[];       // para type: "list"
  listButtonLabel?: string;     // para type: "list" — límite Meta: ≤ 20 chars
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
  password?: string;
  usesTempPassword?: boolean;
  variantAnswered?: boolean;
  spaceType?: string;
  spaceSize?: string;
  spacePrice?: string;
  spaceStreet?: string;
  spaceNumber?: string;
  spaceZip?: string;
  browseType?: string;
  browseZone?: string;
}

// ─── Pasos compartidos de apertura ───────────────────────────────────────────

export const OPENING_STEPS: Step[] = [
  {
    id: "greeting",
    actor: "bot",
    type: "text",
    content: "👋 ¡Hola! Soy Espi, tu asistente de Spot2.",
    contentKey: "greeting",
    delay: 600,
  },
  {
    id: "intro",
    actor: "bot",
    type: "quickReply",
    content:
      "Te escribo desde este número para ayudarte a crear tu cuenta y empezar a publicar tus espacios, en un par de minutos y sin trámites.",
    contentKey: "intro_opening",
    delay: 1200,
    options: [
      { id: "start",   label: "Sí, ayúdame" },
      { id: "whatis",  label: "¿Qué es Spot2?" },
      { id: "explore", label: "Solo explorar" },
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
    contentKey: "whatis_answer",
    delay: 800,
    options: [
      { id: "start", label: "Crear mi cuenta" },
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
  contentKey: "later_bye",
  delay: 600,
};

// ─── Cierre compartido (perfil + éxito) ──────────────────────────────────────

export const ASK_PROFILE_STEP: Step = {
  id: "ask_profile",
  actor: "bot",
  type: "quickReply",
  content: (ctx) => `Casi listo, ${ctx.name}. ¿Cómo describes mejor tu perfil?`,
  contentKey: "ask_profile",
  delay: 800,
  options: [
    { id: "propietario",   label: "Soy propietario" },  // 15 chars ✓
    { id: "broker",        label: "Soy broker" },        // 9 chars ✓
    { id: "desarrollador", label: "Soy desarrollador" }, // 17 chars ✓ — máx 3 quick replies Meta
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
  contentKey: "a_reconfirm",
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
  contentKey: "ask_email_correction",
  delay: 600,
  requiresInput: true,
};

export const ASK_NAME_CORRECTION_STEP: Step = {
  id: "ask_name_correction",
  actor: "bot",
  type: "userInput",
  content: "¿Cómo es tu nombre correcto?",
  contentKey: "ask_name_correction",
  delay: 600,
  requiresInput: true,
};

export const SUCCESS_STEP: Step = {
  id: "success",
  actor: "bot",
  type: "success",
  content: (ctx) =>
    `¡Listo, ${ctx.name}! Tu cuenta ya está creada 🎉 Entra con tu correo para publicar tu primer espacio.`,
  contentKey: "success",
  delay: 1000,
};

// OTP — pasos compartidos por los 3 canales de verificación

export const OTP_ASK_CODE_STEP = (channel: "WA" | "EMAIL" | "SMS", ctx: { email: string }): Step => ({
  id: "otp_ask_code",
  actor: "bot",
  type: "userInput",
  content: channel === "WA"
    ? "Te acabo de mandar un código de 6 dígitos por WhatsApp a este mismo chat 🔒 ¿Me lo escribís?"
    : channel === "EMAIL"
    ? `Para confirmar que es tuyo, te envié un código de 6 dígitos a ${ctx.email} 📩 ¿Me lo compartes?`
    : "Te enviamos un código de 6 dígitos por SMS al número registrado 📱 ¿Me lo compartís?",
  contentKey: channel === "WA" ? "otp_ask_wa" : channel === "EMAIL" ? "otp_ask_email" : "otp_ask_sms",
  delay: 900,
  requiresInput: true,
});

export const OTP_CODE_SUCCESS_STEP: Step = {
  id: "otp_confirmed",
  actor: "bot",
  type: "text",
  content: "¡Perfecto! Verificado ✓",
  contentKey: "otp_confirmed",
  delay: 600,
};

export const OTP_CODE_WRONG_STEP: Step = {
  id: "otp_wrong",
  actor: "bot",
  type: "quickReply",
  content: "Ese código no coincide. ¿Lo reintentas?",
  contentKey: "otp_wrong",
  delay: 600,
  options: [{ id: "resend_code", label: "Reenviar código" }],
  requiresInput: true,
};

export const OTP_RESENT_STEP = (channel: "WA" | "EMAIL" | "SMS"): Step => ({
  id: "otp_resent",
  actor: "bot",
  type: "userInput",
  content: channel === "WA"
    ? "Listo, te lo acabo de reenviar por WhatsApp 🔄 ¿Me lo compartes?"
    : channel === "EMAIL"
    ? "Listo, te lo mandé de nuevo al correo 📩 ¿Me lo compartes?"
    : "Listo, te lo mandé de nuevo por SMS 📱 ¿Me lo compartes?",
  contentKey: "otp_resent",
  delay: 600,
  requiresInput: true,
});

// ─── Variante A — Solo botón de confirmación ─────────────────────────────────

export const VARIANT_A_STEPS: Step[] = [
  {
    id: "a_ask_name",
    actor: "bot",
    type: "userInput",
    content: "Perfecto. Para empezar, ¿cómo te llamas?",
    contentKey: "a_ask_name",
    delay: 800,
    requiresInput: true,
  },
  {
    id: "a_ask_email",
    actor: "bot",
    type: "userInput",
    content: (ctx) => `Genial, ${ctx.name} 👌 ¿A qué correo asociamos tu cuenta?`,
    contentKey: "a_ask_email",
    delay: 800,
    requiresInput: true,
  },
  {
    id: "a_confirm",
    actor: "bot",
    type: "quickReply",
    content: (ctx) =>
      `Listo. Voy a crear tu cuenta con estos datos:\n• Nombre: ${ctx.name}\n• Correo: ${ctx.email}\n\n¿Todo correcto?`,
    contentKey: "a_confirm",
    delay: 800,
    options: [
      { id: "confirm", label: "Sí, crear" },
      { id: "edit_email", label: "Corregir correo" },
      { id: "edit_name", label: "Corregir nombre" },
    ],
    requiresInput: true,
  },
  {
    id: "a_creating",
    actor: "bot",
    type: "typing",
    content: "Creando tu cuenta…",
    contentKey: "a_creating",
    delay: 400,
    auto: true,
  },
];

// ─── Variante B — Formulario nativo ⭐ VARIANTE RECOMENDADA ──────────────────
//
// Por qué B es la de menor fricción:
//   1. Un solo WhatsApp Flow (una pantalla) captura nombre + correo + perfil juntos.
//      Sin mensajes de ida y vuelta — el usuario no sale del contexto de WhatsApp.
//   2. Validación nativa en el form antes de enviar (vs. corrección post-envío en A).
//   3. Elimina el paso extra de "¿Cuál es tu perfil?" — queda dentro del mismo form.
//   4. Meta WhatsApp Flows permite hasta 10 campos por pantalla y hasta 3 pantallas
//      por flow. Aquí usamos 1 pantalla con 3 campos: el mínimo absoluto para una
//      cuenta válida + segmentación de bienvenida.
//
// Variante A: conversacional clásico — más natural pero más pasos.
// Variante C: pre-rellenado en plataforma — fricción media por cambio de contexto.

export const VARIANT_B_STEPS: Step[] = [
  {
    id: "b_form_intro",
    actor: "bot",
    type: "text",
    content:
      "Para agilizarlo, te comparto un formulario rápido. Solo llena tus datos y en un momento tienes tu cuenta.",
    contentKey: "b_form_intro",
    delay: 800,
  },
  {
    id: "b_form",
    actor: "bot",
    type: "form",
    content: "Completa tus datos:",
    contentKey: "b_form_label",
    delay: 600,
    fields: [
      { id: "name",  label: "Nombre completo",    type: "text",  placeholder: "Ej. María García" },
      { id: "email", label: "Correo electrónico", type: "email", placeholder: "Ej. maria@empresa.com" },
      // single-select: simula WhatsApp Flows SingleChoiceItem. Máx ~24 chars por opción en Flows real.
      {
        id: "profile",
        label: "Tipo de cuenta",
        type: "select",
        placeholder: "Selecciona tu perfil",
        options: ["Soy propietario", "Soy broker", "Soy desarrollador"],
      },
      // Contraseña: TextInput enmascarado. En Flows real: type="password".
      // El OptIn "Prefiero clave temporal" deshabilita este campo cuando está marcado.
      { id: "password", label: "Contraseña (mín. 8 caracteres)", type: "password", placeholder: "••••••••", disables: undefined },
      // OptIn nativo de WhatsApp Flows — deshabilita el campo password cuando está marcado.
      { id: "prefer_temp_password", label: "Prefiero recibir una clave temporal por correo", type: "checkbox", placeholder: "", optional: true, disables: "password" },
    ],
    requiresInput: true,
  },
  {
    id: "b_received",
    actor: "bot",
    type: "typing",
    content: "Recibido. Creando tu cuenta…",
    contentKey: "b_received",
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
    contentKey: "c_ask_name",
    delay: 800,
    requiresInput: true,
  },
  {
    id: "c_ask_email",
    actor: "bot",
    type: "userInput",
    content: (ctx) => `Gracias, ${ctx.name}. ¿Cuál es tu correo?`,
    contentKey: "c_ask_email",
    delay: 800,
    requiresInput: true,
  },
  {
    id: "c_redirect",
    actor: "bot",
    type: "platformRedirect",
    content: (ctx) =>
      `Perfecto, ${ctx.name}. Te mando a la plataforma con tus datos ya listos — solo confirma y tu cuenta queda creada al instante.`,
    contentKey: "c_redirect",
    delay: 800,
    requiresInput: true,
  },
];

// ─── Contraseña / clave temporal ─────────────────────────────────────────────

export const ASK_PASSWORD_CHOICE_STEP: Step = {
  id: "ask_password_choice",
  actor: "bot",
  type: "quickReply",
  content: "Casi listo. ¿Cómo querés proteger tu cuenta?",
  contentKey: "ask_password_choice",
  delay: 800,
  options: [
    { id: "create_password", label: "Crear contraseña" },   // 16 chars ✓
    { id: "temp_password",   label: "Enviarme clave temp" }, // 18 chars ✓
  ],
  requiresInput: true,
};

export const ASK_PASSWORD_INPUT_STEP: Step = {
  id: "ask_password_input",
  actor: "bot",
  type: "userInput",
  content: "Escribe tu contraseña (mínimo 8 caracteres). La guardamos de forma segura.",
  contentKey: "ask_password_input",
  delay: 700,
  requiresInput: true,
};

export const TEMP_PASSWORD_SENT_STEP: Step = {
  id: "temp_password_sent",
  actor: "bot",
  type: "text",
  content: "Listo. Te enviamos una clave temporal a tu correo — la cambias al primer ingreso.",
  contentKey: "temp_password_sent",
  delay: 700,
};

// ─── Correos ya registrados (simulación) ─────────────────────────────────────
// En producción esto sería una llamada a la API. Aquí hardcodeamos para demo.
export const REGISTERED_EMAILS = new Set([
  "test@spot2.mx",
  "demo@spot2.mx",
  "juan@empresa.com",
  "maria@gmail.com",
  "already@registered.com",
]);

export const HUMAN_HANDOFF_STEP: Step = {
  id: "human_handoff",
  actor: "bot",
  type: "text",
  content: "Te conecto con un asesor.",
  contentKey: "human_handoff",
  delay: 700,
};

export const EXISTING_USER_STEPS: Step[] = [
  {
    id: "existing_found",
    actor: "bot",
    type: "quickReply",
    content: (ctx) => `El correo ${ctx.email} ya está registrado en Spot2.`,
    contentKey: "existing_user_found",
    delay: 800,
    options: [
      { id: "existing_login",       label: "Entrar a mi cuenta" },
      { id: "existing_retry_email", label: "Usar otro correo"   },
    ],
    requiresInput: true,
  },
  {
    id: "existing_login_redirect",
    actor: "bot",
    type: "platformRedirect",
    content: "Te llevamos al inicio de sesión.",
    contentKey: "existing_login_redirect",
    delay: 700,
  },
  {
    id: "existing_ask_another",
    actor: "bot",
    type: "userInput",
    content: "¿Cuál es el otro correo que querés usar?",
    contentKey: "existing_ask_another_email",
    delay: 600,
    requiresInput: true,
  },
];

// ─── Flujo de publicación de espacio ─────────────────────────────────────────

// 8 tipos reales de Spot2 — dentro del límite de 10 ítems de Meta List Message
export const SPACE_TYPES: ListItem[] = [
  { id: "oficina",     title: "Oficina",           description: "Espacios para trabajo corporativo" },
  { id: "local",       title: "Local Comercial",   description: "Planta baja, frente a calle" },
  { id: "bodega",      title: "Bodega",             description: "Almacenaje y logística" },
  { id: "nave",        title: "Nave Industrial",   description: "Producción o manufactura" },
  { id: "terreno",     title: "Terreno",            description: "Para construir o estacionar" },
  { id: "corporativo", title: "Corporativo",        description: "Torre o campus empresarial" },
  { id: "parque",      title: "Parque Industrial",  description: "Dentro de parque industrial" },
  { id: "flex",        title: "Flex / Coworking",  description: "Espacio compartido o flexible" },
];

// ─── Explorar sin cuenta ─────────────────────────────────────────────────────

export const BROWSE_INTRO_STEP: Step = {
  id: "browse_intro",
  actor: "bot",
  type: "text",
  content: "¡Perfecto! Puedo mostrarte espacios disponibles sin necesidad de crear una cuenta.",
  contentKey: "browse_intro",
  delay: 700,
};

export const BROWSE_TYPE_STEP: Step = {
  id: "browse_type",
  actor: "bot",
  type: "list",
  content: "¿Qué tipo de espacio estás buscando?",
  contentKey: "browse_type_q",
  delay: 900,
  listItems: SPACE_TYPES,
  listButtonLabel: "Ver tipos",
  requiresInput: true,
};

export const BROWSE_ZONE_STEP: Step = {
  id: "browse_zone",
  actor: "bot",
  type: "userInput",
  content: "¿En qué ciudad o colonia buscas?",
  contentKey: "browse_zone_q",
  delay: 800,
  requiresInput: true,
};

export const BROWSE_SEARCHING_STEP: Step = {
  id: "browse_searching",
  actor: "bot",
  type: "typing",
  content: "Buscando espacios…",
  contentKey: "browse_searching",
  delay: 400,
  auto: true,
};

export const BROWSE_RESULTS_STEP = (spaceType: string, zone: string): Step => ({
  id: "browse_results",
  actor: "bot",
  type: "list",
  content: `Encontré opciones de ${spaceType} cerca de ${zone}:`,
  contentKey: "browse_results_intro",
  delay: 1000,
  listItems: [
    { id: "r1", title: `${spaceType} · ${zone}`,     description: "850 m² · $45,000/mes" },
    { id: "r2", title: `${spaceType} · Centro`,       description: "320 m² · $18,500/mes" },
    { id: "r3", title: `${spaceType} · Corporativo`,  description: "1,200 m² · $95,000/mes" },
  ],
  listButtonLabel: "Ver espacios",
  requiresInput: true,
});

export const BROWSE_CTA_STEP: Step = {
  id: "browse_cta",
  actor: "bot",
  type: "quickReply",
  content: "Para ver detalles completos y contactar a los propietarios, crea tu cuenta gratis. Solo toma 2 minutos.",
  contentKey: "browse_cta",
  delay: 900,
  options: [
    { id: "start",   label: "Crear mi cuenta" },
    { id: "later",   label: "Quizás después" },
  ],
  requiresInput: true,
};

// Pasos de éxito compartidos entre variantes A y B
const PUBLISH_CONFIRM_STEP: Step = {
  id: "publish_confirm",
  actor: "bot",
  type: "quickReply",
  content: (ctx) =>
    `Perfecto, acá el resumen:\n\n• Tipo: ${ctx.spaceType ?? "—"}\n• Tamaño: ${ctx.spaceSize ?? "—"} m²\n• Precio: $${ctx.spacePrice ?? "—"}/mes\n• Dirección: ${ctx.spaceStreet ?? "—"} ${ctx.spaceNumber ?? ""}, CP ${ctx.spaceZip ?? "—"}\n• Fotos: ✓\n\n¿Lo publicamos?`,
  contentKey: "publish_confirm_summary",
  delay: 900,
  options: [
    { id: "space_publish", label: "Publicar" },
    { id: "space_edit",    label: "Editar datos" },
  ],
  requiresInput: true,
};

const PUBLISH_CREATING_STEP: Step = {
  id: "publish_creating",
  actor: "bot",
  type: "typing",
  content: "Publicando tu espacio…",
  contentKey: "publish_creating",
  delay: 400,
  auto: true,
};

const PUBLISH_SUCCESS_STEP: Step = {
  id: "publish_success",
  actor: "bot",
  type: "success",
  content: (ctx) =>
    `¡Listo${ctx.name ? `, ${ctx.name}` : ""}! Tu espacio ya está en borrador 🎉 Entra a la plataforma para agregar descripción, más fotos y publicarlo.`,
  contentKey: "publish_success",
  delay: 1000,
};

// ─── Variante A — Conversacional (dato a dato) ───────────────────────────────
// Pregunta tipo (list), luego m², precio, dirección y fotos por separado.
export const PUBLISH_VARIANT_A_STEPS: Step[] = [
  {
    id: "publish_intro",
    actor: "bot",
    type: "text",
    content:
      "¡Genial! Publicar un espacio toma menos de 5 minutos. Solo necesito unos datos básicos — el resto lo completás en la plataforma con todo pre-cargado.",
    contentKey: "publish_intro_a",
    delay: 800,
  },
  {
    id: "publish_type",
    actor: "bot",
    type: "list",
    content: "¿Qué tipo de espacio es?",
    contentKey: "publish_type_q",
    delay: 700,
    listItems: SPACE_TYPES,
    listButtonLabel: "Ver tipos",
    requiresInput: true,
  },
  {
    id: "publish_size",
    actor: "bot",
    type: "userInput",
    content: "¿Cuántos metros cuadrados tiene? Solo el número.",
    contentKey: "publish_size_q",
    delay: 700,
    requiresInput: true,
  },
  {
    id: "publish_price",
    actor: "bot",
    type: "userInput",
    content: "¿Y el precio mensual en pesos? Solo el número, sin comas ni símbolo.",
    contentKey: "publish_price_q",
    delay: 700,
    requiresInput: true,
  },
  {
    id: "publish_address",
    actor: "bot",
    type: "form",
    content: "¿Dónde está ubicado el espacio?",
    contentKey: "publish_address_q",
    delay: 700,
    fields: [
      { id: "calle",  label: "Calle",           type: "text", placeholder: "Ej. Insurgentes Sur" },
      { id: "numero", label: "Número exterior", type: "text", placeholder: "Ej. 1234" },
      { id: "cp",     label: "Código postal",   type: "text", placeholder: "Ej. 03810" },
    ],
    requiresInput: true,
  },
  {
    id: "publish_photos",
    actor: "bot",
    type: "photoUpload",
    content:
      "Ya casi 📸 Mandame fotos del espacio — mínimo 3 para que tu anuncio destaque. Entre más, mejor.",
    contentKey: "publish_photos_a",
    delay: 800,
    requiresInput: true,
  },
  PUBLISH_CONFIRM_STEP,
  PUBLISH_CREATING_STEP,
  PUBLISH_SUCCESS_STEP,
];

// ─── Variante B — Formulario nativo (WhatsApp Flow) ──────────────────────────
// Agrupa todos los datos de texto en un solo formulario (6 campos, dentro del
// límite de 10 de WhatsApp Flows). Las fotos quedan fuera: Meta no soporta
// adjuntos dentro de un Flow nativo; siempre van como paso aparte.
export const PUBLISH_VARIANT_B_STEPS: Step[] = [
  {
    id: "publish_intro",
    actor: "bot",
    type: "text",
    content:
      "¡Genial! Para agilizarlo, te comparto un formulario con todos los datos del espacio. Lo llenás en un paso y listo.",
    contentKey: "publish_intro_b",
    delay: 800,
  },
  {
    id: "publish_form_b",
    actor: "bot",
    type: "form",
    content: "Datos del espacio:",
    contentKey: "publish_form_b_label",
    delay: 600,
    fields: [
      {
        id: "espacio_tipo",
        label: "Tipo de espacio",
        type: "select",
        placeholder: "Selecciona el tipo",
        options: SPACE_TYPES.map((t) => t.title),
      },
      { id: "tamaño",  label: "Tamaño (m²)",           type: "text", placeholder: "Ej. 250" },
      { id: "precio",  label: "Precio mensual (MXN)",  type: "text", placeholder: "Ej. 25000" },
      { id: "calle",   label: "Calle",                 type: "text", placeholder: "Ej. Insurgentes Sur" },
      { id: "numero",  label: "Número exterior",       type: "text", placeholder: "Ej. 1234" },
      { id: "cp",      label: "Código postal",         type: "text", placeholder: "Ej. 03810" },
    ],
    requiresInput: true,
  },
  {
    // Fotos fuera del Flow nativo — restricción Meta: los adjuntos no caben en WhatsApp Flows.
    id: "publish_photos",
    actor: "bot",
    type: "photoUpload",
    content:
      "¡Casi listo! 📸 Solo falta que me mandes fotos del espacio — mínimo 3 para que tu anuncio destaque.",
    contentKey: "publish_photos_b",
    delay: 800,
    requiresInput: true,
  },
  PUBLISH_CONFIRM_STEP,
  PUBLISH_CREATING_STEP,
  PUBLISH_SUCCESS_STEP,
];

// ─── Variante C — Pre-rellenado en plataforma ────────────────────────────────
// Captura lo mínimo (tipo + m²) en el chat y redirige a la plataforma con el
// borrador pre-cargado para que el usuario complete precio, dirección y fotos allá.
export const PUBLISH_VARIANT_C_STEPS: Step[] = [
  {
    id: "publish_intro",
    actor: "bot",
    type: "text",
    content:
      "¡Genial! Solo necesito dos datos rápidos — el resto lo completás en Spot2 con el borrador ya pre-cargado.",
    contentKey: "publish_intro_c",
    delay: 800,
  },
  {
    id: "publish_type",
    actor: "bot",
    type: "list",
    content: "¿Qué tipo de espacio es?",
    contentKey: "publish_type_q",
    delay: 700,
    listItems: SPACE_TYPES,
    listButtonLabel: "Ver tipos",
    requiresInput: true,
  },
  {
    id: "publish_size",
    actor: "bot",
    type: "userInput",
    content: "¿Y cuántos metros cuadrados tiene? Solo el número.",
    contentKey: "publish_size_c_q",
    delay: 700,
    requiresInput: true,
  },
  {
    id: "publish_redirect_c",
    actor: "bot",
    type: "platformRedirect",
    content: "Perfecto. Te mando a Spot2 con el borrador de tu espacio pre-cargado — solo completás precio, dirección y fotos allá.",
    contentKey: "publish_redirect_c",
    delay: 800,
    requiresInput: true,
  },
  {
    id: "publish_success_c",
    actor: "bot",
    type: "success",
    content: (ctx) =>
      `¡Listo${ctx.name ? `, ${ctx.name}` : ""}! Tu borrador está en Spot2. Completá precio, dirección y fotos para publicarlo. 🚀`,
    contentKey: "publish_success_c",
    delay: 1000,
  },
];
