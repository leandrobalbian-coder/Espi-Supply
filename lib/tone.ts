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
    calido:  (ctx) => `Perfecto, ${ctx.name}. Te mando a la plataforma con tus datos ya listos — solo confirma, define tu contraseña y tu cuenta queda creada al instante.`,
    neutro:  (ctx) => `Listo, ${ctx.name}. Te redireccionamos a Spot2 con tus datos pre-cargados. Allí podrás definir tu contraseña y completar el registro.`,
    directo: (ctx) => `Todo listo, ${ctx.name}. Abre Spot2 para confirmar tu cuenta y definir tu contraseña.`,
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

  // ─── Verificación OTP (WA / EMAIL / SMS) ─────────────────────────────────────

  otp_ask_wa: {
    calido:  "Te acabo de mandar un código de 6 dígitos por WhatsApp a este mismo chat 🔒 ¿Me lo escribís?",
    neutro:  "Enviamos un código de 6 dígitos a este chat de WhatsApp. Escríbelo aquí.",
    directo: "Código de 6 dígitos enviado a este chat. ¿Cuál es?",
  },

  otp_ask_email: {
    calido:  (ctx) => `Para confirmar que es tuyo, te envié un código de 6 dígitos a ${ctx.email} 📩 ¿Me lo compartes?`,
    neutro:  (ctx) => `Para verificar tu correo, enviamos un código de 6 dígitos a ${ctx.email}. Compártelo aquí.`,
    directo: (ctx) => `Código enviado a ${ctx.email}. ¿Cuál es?`,
  },

  otp_ask_sms: {
    calido:  "Te enviamos un código de 6 dígitos por SMS al número registrado 📱 ¿Me lo compartís?",
    neutro:  "Enviamos un código de 6 dígitos por SMS al número registrado. Escríbelo aquí.",
    directo: "Código por SMS enviado. ¿Cuál es?",
  },

  otp_confirmed: {
    calido:  "¡Perfecto! Verificado ✓",
    neutro:  "Verificado correctamente.",
    directo: "Verificado.",
  },

  otp_wrong: {
    calido:  "Ese código no coincide. ¿Lo reintentas?",
    neutro:  "El código no es correcto. ¿Deseas reintentarlo?",
    directo: "Código incorrecto. ¿Reintento?",
  },

  otp_resent: {
    calido:  "Listo, te lo acabo de reenviar 🔄 ¿Me lo compartís?",
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

  // ─── Fricción: dato desconocido ───────────────────────────────────────────────
  // Cálido: normaliza la situación, le quita la presión al usuario.
  // Neutro: informa la opción sin validar emocionalmente.
  // Directo: da la solución en dos palabras, sin contexto.

  dont_know_size: {
    calido:  "¡No te preocupes si no lo sabes de memoria! Ponés un aproximado — o si preferís, escribí 0 y lo editás directo en la plataforma cuando entres.",
    neutro:  "Si no tienes el dato exacto, puedes ingresar un aproximado. También puedes escribir 0 y completarlo en la plataforma.",
    directo: "Aproximado está bien. O escribí 0 y lo editás en Spot2.",
  },

  dont_know_price: {
    calido:  "No necesitás tenerlo definido al 100% ahora. Ponés un precio tentativo y lo ajustás antes de publicar. ¿Cuánto pensás cobrar aproximadamente?",
    neutro:  "Puedes ingresar un precio tentativo. Se puede modificar antes de publicar en la plataforma.",
    directo: "Precio tentativo está bien. ¿Cuánto aproximado?",
  },

  // ─── Fricción: dato numérico inválido — escalada en 3 intentos ───────────────
  // Intento 1: amable, ejemplo claro.
  // Intento 2: más explícito, refuerza el formato, aún paciente.
  // Intento 3: ofrece salida sin culpar al usuario — puede escribir 0 o ir a Spot2.
  //
  // Diferencia de tonos:
  //   Cálido — usa "no pasa nada", normaliza el error, acompaña emocionalmente.
  //   Neutro — directo a la instrucción, sin emociones, pero sin frialdad.
  //   Directo — una línea, sin explicación, solo la corrección o la salida.

  size_invalid_1: {
    calido:  "Mmm, necesito solo el número de metros. Por ejemplo: 250 (sin m² ni letras) 😊",
    neutro:  "Ingresa solo el número en metros cuadrados. Ej: 250",
    directo: "Solo el número. Ej: 250",
  },

  size_invalid_2: {
    calido:  "El número puro, sin texto — como 350 o 120. ¿Lo intentamos de nuevo?",
    neutro:  "Solo dígitos, sin letras ni símbolos. Ej: 350",
    directo: "Sin letras. Ej: 350",
  },

  size_invalid_3: {
    calido:  "No pasa nada 😊 Si es más fácil, escribí 0 y completás los metros cuadrados directo en Spot2 cuando entres.",
    neutro:  "Puedes escribir 0 por ahora y completar el dato en la plataforma.",
    directo: "Escribí 0, lo editás en Spot2.",
  },

  price_invalid_1: {
    calido:  "El precio lo necesito en número puro. Por ejemplo: 25000 (sin $ ni comas ni letras)",
    neutro:  "Ingresa solo el número del precio mensual. Ej: 25000",
    directo: "Solo números. Ej: 25000",
  },

  price_invalid_2: {
    calido:  "Solo el número, como 15000 o 80000. Sin símbolos ni texto. ¿Lo intentás de nuevo?",
    neutro:  "Solo dígitos, sin formato. Ej: 15000",
    directo: "Sin formato. Ej: 15000",
  },

  price_invalid_3: {
    calido:  "No problem 😊 Escribí 0 por ahora y ajustás el precio en la plataforma antes de publicar.",
    neutro:  "Puedes escribir 0 y completar el precio en Spot2.",
    directo: "Escribí 0, lo editás allá.",
  },

  // ─── Fricción: usuario frustrado o cortante ───────────────────────────────────
  // Cálido: valida la emoción primero, luego acorta el camino.
  //         "Entiendo" + empathy antes de la solución.
  // Neutro: reconoce sin dramatizar, ofrece la vía más corta sin opinar sobre el estado.
  // Directo: ignora la emoción, va directo a la salida más rápida.

  frustration_onboarding: {
    calido:  "Entiendo, a veces puede parecer largo 😔 Podemos hacer esto mucho más corto: dame solo tu correo y te mando directo a Spot2 para terminar en 30 segundos.",
    neutro:  "Para agilizarlo: comparte solo tu correo y te enviamos a Spot2 para completar el registro rápidamente.",
    directo: "Dame tu correo y terminás en Spot2.",
  },

  frustration_publish: {
    calido:  "Entiendo, no quiero que se sienta como un trámite 😔 Podemos ir más rápido: seguís directo en Spot2 y cargás los datos allá desde cero en 2 minutos.",
    neutro:  "Para agilizarlo: puedes completar la publicación directamente en Spot2. Te llevará menos tiempo.",
    directo: "Continuamos en Spot2. ¿Vamos?",
  },

  // ─── Fricción: usuario desconfía ─────────────────────────────────────────────
  // Cálido: calidez + transparencia + invita a conocer más.
  //         "Me alegra que lo preguntes" — convierte la pregunta en algo positivo.
  // Neutro: respuesta factual, sober, datos concretos sin persuasión.
  // Directo: responde solo lo preguntado, una oración.

  trust_question: {
    calido:  "Buenísima pregunta, y me alegra que lo preguntes 🔒 Este número es oficial de Spot2 — el marketplace #1 de bienes raíces comerciales en México. Tus datos solo se usan para crear tu cuenta y nunca se comparten con terceros. ¿Te cuento más sobre Spot2?",
    neutro:  "Este número pertenece a Spot2, el marketplace líder de bienes raíces comerciales en México. Tus datos se usan únicamente para crear tu cuenta y están protegidos. ¿Deseas saber más sobre Spot2?",
    directo: "Número oficial Spot2.mx. Tus datos solo crean tu cuenta. ¿Qué es Spot2?",
  },

  // ─── Fricción: usuario retoma a mitad ────────────────────────────────────────
  // Se activa cuando el usuario saluda o manda algo inesperado teniendo ya
  // nombre en contexto — señal de que dejó la conversación y volvió.
  //
  // Cálido: bienvenida cálida + retoma el contexto con nombre + da el siguiente paso.
  // Neutro: retoma el punto exacto sin ceremony, informativo.
  // Directo: brevísimo, solo el siguiente dato que falta.

  resume_with_name_no_email: {
    calido:  (ctx) => `¡Hola de nuevo, ${ctx.name}! 👋 Seguimos donde lo dejamos — solo falta tu correo para crear tu cuenta. ¿Cuál es?`,
    neutro:  (ctx) => `Bienvenido de nuevo, ${ctx.name}. Continuamos: falta tu correo electrónico para crear tu cuenta.`,
    directo: (ctx) => `Seguimos, ${ctx.name}. ¿Tu correo?`,
  },

  resume_with_email: {
    calido:  (ctx) => `¡Hola de nuevo, ${ctx.name}! 👋 Ya tenía tu correo (${ctx.email}). Seguimos desde donde lo dejamos.`,
    neutro:  (ctx) => `Bienvenido de nuevo, ${ctx.name}. Continuamos — ya tenemos tu correo (${ctx.email}).`,
    directo: (ctx) => `Seguimos, ${ctx.name}. Correo ya guardado.`,
  },

  // ─── Contraseña / clave temporal ─────────────────────────────────────────────

  ask_password_choice: {
    calido:  "Ya casi 🔐 ¿Cómo querés proteger tu cuenta?",
    neutro:  "Un paso más. ¿Cómo deseas proteger tu cuenta?",
    directo: "¿Contraseña propia o clave temporal?",
  },

  ask_password_input: {
    calido:  "Perfecto. Escribe tu contraseña — mínimo 8 caracteres. La guardamos de forma segura 🔒",
    neutro:  "Ingresa tu contraseña (mínimo 8 caracteres). La almacenamos de forma segura.",
    directo: "¿Tu contraseña? (mín. 8 caracteres)",
  },

  password_too_short: {
    calido:  "La contraseña necesita al menos 8 caracteres para ser segura 😊 ¿Lo intentamos de nuevo?",
    neutro:  "La contraseña debe tener al menos 8 caracteres. Por favor intenta de nuevo.",
    directo: "Mínimo 8 caracteres. ¿De nuevo?",
  },

  temp_password_sent: {
    calido:  (ctx) => `Listo 📩 Te enviamos una clave temporal a ${ctx.email}. La cambias al primer ingreso desde tu perfil.`,
    neutro:  (ctx) => `Clave temporal enviada a ${ctx.email}. Podrás cambiarla al ingresar por primera vez.`,
    directo: (ctx) => `Clave temporal enviada a ${ctx.email}. Cámbiala al entrar.`,
  },

  // ─── Fallback a humano ───────────────────────────────────────────────────────

  human_handoff: {
    calido:  "Claro, con gusto te conecto con alguien del equipo de Spot2 😊 En breve un asesor te escribe para ayudarte a terminar. ¡Que te vaya muy bien!",
    neutro:  "De acuerdo. Te conecto con un asesor de Spot2. Recibirás respuesta en breve. Gracias por tu paciencia.",
    directo: "Conectando con un asesor de Spot2. Te escribe pronto.",
  },

  // ─── Usuario existente ────────────────────────────────────────────────────────

  existing_user_found: {
    calido:  (ctx) => `¡Ese correo ya tiene una cuenta en Spot2! 👋 ¿Querés entrar con ${ctx.email} o preferís usar otro correo?`,
    neutro:  (ctx) => `El correo ${ctx.email} ya está registrado en Spot2. ¿Deseas iniciar sesión con él o usar un correo diferente?`,
    directo: (ctx) => `${ctx.email} ya tiene cuenta. ¿Entrás o usás otro correo?`,
  },

  existing_login_redirect: {
    calido:  "¡Perfecto! Te llevo al acceso — ingresá con tu correo y contraseña (o recupérala si la olvidaste) 🔑",
    neutro:  "Te redireccionamos al inicio de sesión. Ingresa con tu correo y contraseña.",
    directo: "Abriendo acceso a tu cuenta.",
  },

  existing_ask_another_email: {
    calido:  "Sin problema 😊 ¿Cuál es el otro correo que querés usar?",
    neutro:  "De acuerdo. ¿Cuál es el correo que deseas usar?",
    directo: "¿Cuál es el otro correo?",
  },

  // ─── Explorar sin cuenta ─────────────────────────────────────────────────────

  browse_intro: {
    calido:  "¡Perfecto! Puedo mostrarte espacios disponibles sin necesidad de crear una cuenta 🏢",
    neutro:  "Sin problema. Puedo mostrarte espacios disponibles sin registro.",
    directo: "Te muestro espacios disponibles ahora.",
  },

  browse_type_q: {
    calido:  "¿Qué tipo de espacio estás buscando?",
    neutro:  "¿Qué tipo de espacio necesitas?",
    directo: "¿Tipo de espacio?",
  },

  browse_zone_q: {
    calido:  "¿En qué ciudad o colonia buscas?",
    neutro:  "¿En qué zona o ciudad deseas buscar?",
    directo: "¿Zona o ciudad?",
  },

  browse_searching: {
    calido:  "Buscando espacios… 🔍",
    neutro:  "Buscando espacios disponibles…",
    directo: "Buscando…",
  },

  browse_results_intro: {
    calido:  (ctx) => `Encontré estas opciones cerca de ${ctx.browseZone ?? "tu zona"} 👇`,
    neutro:  (ctx) => `Espacios disponibles en ${ctx.browseZone ?? "tu zona"}:`,
    directo: (ctx) => `Resultados en ${ctx.browseZone ?? "tu zona"}:`,
  },

  browse_cta: {
    calido:  "Para ver detalles completos y contactar a los propietarios, crea tu cuenta gratis — solo toma 2 minutos 🚀",
    neutro:  "Para ver detalles y contactar propietarios, crea tu cuenta gratuita en Spot2.",
    directo: "Crea tu cuenta para ver detalles y contactar.",
  },
};

export function getCopy(key: string, tone: Tone, ctx: ConversationContext): string {
  const entry = TONED_COPY[key];
  if (!entry) return `[copy:${key}]`;
  const val = entry[tone];
  return typeof val === "function" ? val(ctx) : val;
}
