/**
 * Identidad de Espi — Supply Agent de Spot2.
 * Cambiá AGENT_NAME aquí y se propaga a toda la app.
 * NO hardcodees el nombre del agente en componentes.
 */
export const AGENT_NAME = "Espi";
export const AGENT_FULL_TITLE = `${AGENT_NAME} · Spot2`;

export const AGENT_PHONE_NUMBER = "+52 55 XXXX XXXX"; // placeholder

/** Usado en el header del chat y en <EspiAvatar /> */
export const AGENT_AVATAR = {
  initial: AGENT_NAME.charAt(0).toUpperCase(),
  /** Reemplazá avatarUrl con una URL de imagen real cuando exista */
  avatarUrl: null as string | null,
};

/**
 * Reglas de tono — documentadas aquí para que sean consultables
 * por cualquiera que edite los copies.
 */
export const TONE_RULES = {
  dos: [
    "Presentarse por nombre y como parte de Spot2 en el primer mensaje",
    "Explicar por qué escribe desde este número",
    "Ofrecer salida al desconfiado (¿Qué es Spot2?)",
    "Usar emojis con moderación (máx 1 por mensaje, nunca decorativos)",
    "Confirmar cada dato con naturalidad",
    "Celebrar el logro al final",
    "Dar el siguiente paso claro (botón/link)",
    "Tratar al usuario de tú (registro mexicano neutro)",
  ],
  donts: [
    "Sonar robótico (no: 'Bienvenido usuario. Ingrese sus datos.')",
    "Ser meloso o infantil (no: '¡Holiii! 🥰')",
    "Usar jerga interna de Spot2 (CAM, supply, ingestor, etc.)",
    "Pedir más datos de los mínimos necesarios",
    "Presionar ni generar falsa urgencia",
  ],
};

/**
 * Diferenciación con el demand agent (bot que atiende a quien busca espacio).
 * Espi es el SUPPLY agent — atiende a quien ofrece espacio.
 * Números de teléfono separados, agentes internos separados.
 * En el futuro podrían unificarse; hoy NO.
 */
export const AGENT_ROLE = "supply";
export const DEMAND_AGENT_NOTE =
  "El demand agent (busca espacio) tiene número propio separado. " +
  "Espi es solo supply (ofrece espacio). Misma familia de marca Spot2, identidades distintas.";
