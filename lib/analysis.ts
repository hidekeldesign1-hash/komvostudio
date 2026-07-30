/* ============================================================
   KOMVOS · Diagnóstico construido con las respuestas reales
   Sin modelos externos: todo se redacta en el servidor a partir
   de lo que la persona contestó y del motor de reglas. Los
   rangos, tiempos y clasificación llegan ya calculados.
   ============================================================ */
import { AnalysisSchema, type Analysis } from "./schemas";
import type { RulesOutput } from "./rules";

export type AnalysisPayload = {
  answers: Record<string, unknown>;
  rules: RulesOutput;
  maturity: { brandMaturity: string; commercialMaturity: string; technologicalMaturity: string };
  coordinates: string[];
};

/* Las opciones del quiz vienen con punto final ("Logo."); al insertarlas dentro
   de una frase ese punto sobra, así que se recorta siempre y se agrega aparte. */
function list(value: unknown): string[] {
  const raw = Array.isArray(value)
    ? value.map(v => String(v))
    : typeof value === "string"
      ? [value]
      : [];
  return raw.map(v => v.trim().replace(/\s*\.\s*$/, "")).filter(Boolean);
}

function text(value: unknown): string {
  return list(value).join(", ");
}

/* Red de seguridad: ninguna respuesta debe producir ".." ni ".," visibles. */
function polish(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .replace(/\.\s*([,;:)])/g, "$1")
    .replace(/\s+([.,;:)])/g, "$1")
    .trim();
}

/* "a, b y c" en lugar de "a, b, c": el texto se lee como redactado a mano. */
function enumerate(values: string[]): string {
  const clean = values.map(v => v.replace(/\s*\.\s*$/, "")).filter(Boolean);
  if (!clean.length) return "";
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(", ")} y ${clean[clean.length - 1]}`;
}

function lower(value: string): string {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

export function runAnalysis(payload: AnalysisPayload): Analysis {
  const a = payload.answers;

  const project = text(a.project_name) || "tu proyecto";
  const name = text(a.full_name) || "hola";
  const category = text(a.category) || "tu categoría";
  const description = text(a.business_description) || "lo que ya estás construyendo";
  const stage = text(a.business_stage) || "su etapa actual";
  const audience = text(a.target_audience);
  const neverLose = text(a.must_never_lose) || "lo esencial de su identidad";
  const feeling = text(a.desired_feeling) || text(a.desired_feeling_other);
  const values = list(a.values);
  const mainOffer = text(a.main_offer);
  const services = list(a.selected_services);
  const goals = list(a.selected_goals);
  const mainGoal = text(a.main_goal) || goals[0] || "ordenar su siguiente etapa";
  const channels = list(a.acquisition_channels);
  const assets = list(a.existing_assets);
  const materials = list(a.available_materials);
  const integrations = list(a.required_integrations);
  const start = text(a.desired_start);
  const followUp = text(a.follow_up_capacity);
  const approvers = text(a.number_of_approvers);
  const collaboration = text(a.collaboration_style);

  const tier = payload.rules.personalizedEvaluation
    ? "una evaluación personalizada"
    : payload.rules.tier;
  const timeline = payload.rules.personalizedEvaluation
    ? "Se define en la sesión estratégica."
    : payload.rules.timelineRange;

  const firstStage = services.length
    ? enumerate(services.slice(0, 2))
    : "una primera estructura digital clara";

  const headline = `${project} ya tiene una primera dirección clara`;

  const openingNarrative = [
    `A partir de lo que compartiste, ${project} se entiende como un proyecto de ${lower(category)}.`,
    `Hoy se encuentra en esta etapa: ${stage}.`,
    `Lo que describes —${description}— muestra una base real sobre la cual construir una ruta más ordenada.`,
    audience ? `Le hablas a ${lower(audience)}, y eso define el tono de todo lo que sigue.` : "",
    feeling ? `Quieres que quien te encuentre sienta ${lower(feeling)}.` : ""
  ].filter(Boolean).join(" ");

  const whatAlreadyExists = [
    `En términos de madurez, hoy vemos marca ${lower(payload.maturity.brandMaturity)}, parte comercial ${lower(payload.maturity.commercialMaturity)} y tecnología ${lower(payload.maturity.technologicalMaturity)}.`,
    assets.length ? `Ya cuentas con ${enumerate(assets)}, y eso acorta el camino: no se empieza de cero.` : "Todavía no hay activos digitales consolidados, así que la primera etapa también construye la base.",
    materials.length ? `Para producir tenemos ${enumerate(materials)}.` : "Falta definir qué materiales existen para producir (fotos, textos, catálogo).",
    channels.length ? `Tus clientes hoy llegan por ${enumerate(channels)}.` : "",
    `Pediste conservar ${lower(neverLose)}, y eso debe guiar cualquier decisión de diseño y mensaje.`,
    values.length ? `Los valores que mencionas —${enumerate(values)}— son el filtro con el que revisaremos cada pieza.` : ""
  ].filter(Boolean).join(" ");

  const opportunityDetected = [
    `Tu prioridad principal es ${lower(mainGoal)}.`,
    goals.length > 1 ? `También señalaste ${enumerate(goals.filter(g => g !== mainGoal))}, pero conviene resolverlos en orden y no todos a la vez.` : "",
    mainOffer && !/^todavía lo estoy definiendo/i.test(mainOffer)
      ? `Como ${lower(mainOffer)} es lo que más peso tiene hoy, ahí es donde una mejor estructura se nota más rápido.`
      : "Antes de escalar conviene definir con precisión cuál es la oferta principal: sin eso, cualquier canal trabaja al doble.",
    `La oportunidad más clara es convertir el esfuerzo que ya haces en un sistema que se entienda, se mida y se pueda continuar sin depender de la improvisación.`
  ].filter(Boolean).join(" ");

  const recommendedRoute = [
    payload.rules.personalizedEvaluation
      ? `Por el alcance que describes, ${project} necesita una evaluación personalizada antes de definir la ruta completa.`
      : `La ruta inicial que vemos para ${project} se acerca a ${lower(tier)}.`,
    `La primera etapa debería concentrarse en ${firstStage}, con el mensaje y la experiencia alineados a lo que no debe perderse.`,
    integrations.length ? `Contemplamos las conexiones que pediste: ${enumerate(integrations)}.` : "",
    followUp ? `Para el seguimiento partimos de tu capacidad actual: ${lower(followUp)}.` : "",
    collaboration ? `Y trabajamos con el estilo que elegiste: ${lower(collaboration)}.` : "",
    "Esto es una orientación inicial, no una cotización final."
  ].filter(Boolean).join(" ");

  const pending = payload.coordinates.map(c => c.trim().replace(/\s*\.\s*$/, "")).filter(Boolean);
  const missingVariables = pending.length
    ? `Antes de cerrar el alcance conviene aclarar: ${pending.join(" · ")}.`
    : "Quedan algunas variables de alcance, materiales y operación que conviene revisar en la sesión.";

  const emotionalClosing = [
    `${project} no necesita empezar desde cero: necesita una dirección más clara.`,
    start ? `Como quieres arrancar ${lower(start)}, el siguiente paso es concretar la primera etapa y ponerle fechas.` : "El siguiente paso es convertir estas respuestas en un plan con fechas y responsables.",
    approvers ? `Ya sabemos quién decide: ${lower(approvers)}, así que podemos avanzar sin fricción.` : ""
  ].filter(Boolean).join(" ");

  const clientResult = {
    headline: polish(headline),
    openingNarrative: polish(openingNarrative),
    whatAlreadyExists: polish(whatAlreadyExists),
    opportunityDetected: polish(opportunityDetected),
    recommendedRoute: polish(recommendedRoute),
    estimatedInvestment: "La inversión se define contigo en la sesión estratégica, según el alcance acordado.",
    estimatedTimeline: polish(
      payload.rules.personalizedEvaluation
        ? "El tiempo se define junto con el alcance en la sesión estratégica."
        : `Estimado según el alcance que describiste: ${timeline}. Se ajusta cuando confirmemos materiales y aprobaciones.`
    ),
    ongoingCosts: "Los costos de operación, plataformas o pauta se revisan aparte, según lo que decidas mantener.",
    missingVariables: polish(missingVariables),
    emotionalClosing: polish(emotionalClosing),
    primaryCta: "Quiero construir esta ruta",
    whatsappMessage: polish(
      `Hola, soy ${name}. Acabo de completar el mapa de ${project}. Mi ruta recomendada fue ${tier} y me gustaría agendar una sesión para revisarla.`
    )
  };

  const strengths = [
    assets.length ? `Activos listos: ${enumerate(assets)}` : "",
    materials.length ? `Materiales disponibles: ${enumerate(materials)}` : "",
    channels.length ? `Canales activos: ${enumerate(channels)}` : "",
    neverLose ? `No debe perder: ${neverLose}` : ""
  ].filter(Boolean).slice(0, 4);

  const internalProfile = {
    businessSummary: `${project} · ${category}. ${description}`,
    category,
    businessStage: stage,
    brandMaturity: payload.maturity.brandMaturity,
    commercialMaturity: payload.maturity.commercialMaturity,
    technologicalMaturity: payload.maturity.technologicalMaturity,
    mainGoal,
    requestedServices: services,
    complexity: String(payload.rules.score),
    priceTier: tier,
    estimatedRange: payload.rules.personalizedEvaluation
      ? "Evaluación personalizada"
      : payload.rules.priceRange,
    estimatedTimeline: payload.rules.personalizedEvaluation
      ? "Evaluación personalizada"
      : payload.rules.timelineRange,
    possibleMonthlyService: payload.rules.monthly.map(m => `${m.label}: ${m.range}`).join(" | "),
    investmentCompatibility: "No se pregunta en el funnel",
    urgency: start || "Sin definir",
    strengths,
    risks: payload.coordinates.slice(0, 4),
    missingInformation: payload.coordinates,
    recommendedFirstOffer: firstStage,
    servicesNotToOfferYet: [],
    questionsForZoom: [
      `¿Qué debe resolverse primero para ${lower(mainGoal)}?`,
      materials.length ? "¿Los materiales disponibles están listos para producción?" : "¿Qué materiales hay que producir desde cero?",
      followUp ? `Seguimiento declarado: ${followUp} ¿Quién lo opera día a día?` : "¿Quién da seguimiento comercial hoy?"
    ],
    likelyObjection: "Necesito ver el alcance y los tiempos antes de decidir.",
    salesArgument: `Partimos de ${lower(mainGoal)} y de lo que ${project} no debe perder: ${lower(neverLose)}`,
    nextStep: "Agendar sesión estratégica para definir la primera etapa.",
    leadScore: leadScore(payload, { services, assets, materials, start, mainOffer })
  };

  return AnalysisSchema.parse({ clientResult, internalProfile });
}

/* Señales de intención: qué tanto se acerca este lead a una sesión real. */
function leadScore(
  payload: AnalysisPayload,
  signals: { services: string[]; assets: string[]; materials: string[]; start: string; mainOffer: string }
): number {
  let score = 40;
  score += Math.min(20, Math.round(payload.rules.score / 3));
  score += Math.min(12, signals.services.length * 4);
  score += Math.min(8, signals.assets.length * 2);
  score += Math.min(6, signals.materials.length * 2);
  if (/inmediat|ya|este mes|lo antes/i.test(signals.start)) score += 10;
  if (signals.mainOffer && signals.mainOffer !== "Todavía lo estoy definiendo.") score += 6;
  score -= Math.min(12, payload.coordinates.length * 3);
  return Math.max(20, Math.min(95, score));
}
