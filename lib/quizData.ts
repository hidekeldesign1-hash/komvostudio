export interface Option {
  id: string;
  label: string;
}

const options = (labels: string[]): Option[] =>
  labels.map((label) => ({ id: label, label }));

export const COVER = {
  eyebrow: "KOMVOS · Diagnóstico digital",
  title: "Descubre la siguiente etapa de tu proyecto",
  text: "Cinco preguntas rápidas para trazar una ruta digital clara.",
  button: "Comenzar diagnóstico",
  footer: "Toma menos de 2 minutos.",
};

export const LEAD_SCREEN = {
  title: "Primero, cuéntanos quién está detrás",
  text: "Guardaremos tu diagnóstico para que puedas retomarlo y conversar con nosotros.",
  consent:
    "He leído el aviso de privacidad y autorizo a KOMVOS a utilizar mis respuestas para elaborar mi diagnóstico y contactarme.",
  button: "Comenzar",
};

export const CATEGORIES = options([
  "Servicios",
  "E-Commerce",
  "Inmobiliario",
  "Salud/Bienestar",
  "Tecnología",
  "Educación",
  "Otro",
]);

export const BUSINESS_STAGES = options([
  "Idea/Lanzamiento",
  "Validado sin Estructura",
  "En Crecimiento/Escalamiento",
  "Requiere Reestructuración",
]);

export const CURRENT_ECOSYSTEM = options([
  "Página Web",
  "Redes Sociales",
  "Publicidad Pagada",
  "WhatsApp/CRM",
  "Sin activos aún",
]);

export const PRIORITIES = options([
  "Captar más prospectos",
  "Web/Landing de Alta Conversión",
  "Automatización y CRM",
  "Renovar Marca/Identidad",
  "Ecosistema Completo",
]);

export const START_TIMES = options([
  "Inmediatamente",
  "Este mes",
  "Explorando costos",
]);

export const QUESTIONS = [
  {
    id: "category",
    title: "¿En qué categoría se encuentra tu negocio?",
    hint: "Selecciona una opción.",
    type: "single",
    options: CATEGORIES,
  },
  {
    id: "business_stage",
    title: "¿En qué etapa se encuentra hoy?",
    hint: "Elige la opción que mejor describa tu momento actual.",
    type: "single",
    options: BUSINESS_STAGES,
  },
  {
    id: "existing_assets",
    title: "¿Qué piezas forman parte de tu ecosistema actual?",
    hint: "Puedes seleccionar varias.",
    type: "multi",
    options: CURRENT_ECOSYSTEM,
  },
  {
    id: "main_goal",
    title: "¿Cuáles son tus prioridades?",
    hint: "Puedes seleccionar varias. Nosotros te sugeriremos el orden.",
    type: "multi",
    options: PRIORITIES,
  },
  {
    id: "desired_start",
    title: "¿Cuándo te gustaría comenzar?",
    hint: "Selecciona una opción para ver tu ruta.",
    type: "single",
    options: START_TIMES,
  },
] as const;

export type QuestionId = (typeof QUESTIONS)[number]["id"];

/** Orden de recomendación cuando la persona marca varias prioridades. */
export const PRIORITY_RANK = [
  "Ecosistema Completo",
  "Captar más prospectos",
  "Web/Landing de Alta Conversión",
  "Automatización y CRM",
  "Renovar Marca/Identidad",
] as const;

export function recommendPriorities(selected: string[]): string[] {
  const unique = Array.from(new Set(selected.filter(Boolean)));
  return PRIORITY_RANK.filter((priority) => unique.includes(priority));
}
