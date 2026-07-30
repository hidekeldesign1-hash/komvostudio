/* ============================================================
   KOMVOS · Motor determinista de precio y tiempo
   Claude no decide precios ni tiempos: este motor sí.
   Los puntajes, rangos y reglas provienen de la especificación
   y no deben modificarse sin indicarlo.
   ============================================================ */

export interface RulesInput {
  selectedServices: string[];        // Paso 8
  numberOfPages?: string;            // condicional páginas
  productVolume?: string;            // condicional tienda
  numberOfRoutes?: string;           // condicional quiz/funnels/automatización
  existingAssets: string[];          // Paso 5
  availableMaterials: string[];      // Paso 9
  mainOfferDefined: boolean;         // Paso 3: false si "Todavía lo estoy definiendo."
  numberOfApprovers?: string;        // Paso 9
  desiredStart?: string;             // Paso 10
  followUpCapacity?: string;         // Paso 9
  requiredIntegrations: string[];    // Paso 9
}

export interface RulesOutput {
  score: number;
  tier: string;
  priceRange: string;
  timelineRange: string;
  monthly: { label: string; range: string }[];
  personalizedEvaluation: boolean;
  breakdown: Record<string, number>;
}

const MODULE_POINTS: Record<string, number> = {
  "Landing page.": 10,
  "Página web.": 18,
  "Tienda en línea.": 25,
  "Quiz o diagnóstico interactivo.": 10,
  "Sistema para captar prospectos.": 15,
  "Identidad de marca.": 12,
  "CRM.": 12,
  "Automatizaciones.": 15,
  "Publicidad digital.": 8,
  "Producción audiovisual.": 12,
  "Analítica y medición.": 6
};

const TIERS = [
  { min: 0,  max: 12,  tier: "Presencia esencial",              price: "$8,500 a $12,000 MXN",           time: "3 a 5 semanas" },
  { min: 13, max: 22,  tier: "Landing estratégica",             price: "$12,000 a $20,000 MXN",          time: "4 a 6 semanas" },
  { min: 23, max: 35,  tier: "Sitio empresarial estratégico",   price: "$18,000 a $32,000 MXN",          time: "5 a 7 semanas" },
  { min: 36, max: 52,  tier: "Sistema de captación",            price: "$28,000 a $48,000 MXN",          time: "6 a 9 semanas" },
  { min: 53, max: 80,  tier: "Ecosistema comercial",            price: "$50,000 a $90,000 MXN",          time: "8 a 12 semanas" },
  { min: 81, max: 1e9, tier: "Ecosistema avanzado",             price: "$90,000 a $140,000 MXN o más",   time: "12 a 16 semanas o más" }
];

const TIER_INDEX = (name: string) => TIERS.findIndex(t => t.tier === name);

export function computeRules(input: RulesInput): RulesOutput {
  const b: Record<string, number> = {};
  const sel = input.selectedServices || [];
  let score = 0;

  // Puntajes base por módulo
  for (const s of sel) {
    if (MODULE_POINTS[s] != null) { b[s] = MODULE_POINTS[s]; score += MODULE_POINTS[s]; }
  }
  // Cada integración: 4, máximo 20 (las respuestas "Todavía no lo sé." no puntúan)
  const integ = (input.requiredIntegrations || []).filter(i => i !== "Todavía no lo sé.");
  const integPts = Math.min(integ.length * 4, 20);
  if (integPts) { b["Integraciones"] = integPts; score += integPts; }

  // Volumen: páginas
  const pagePts: Record<string, number> = {
    "Una landing.": 0, "Entre dos y cinco páginas.": 5, "Entre seis y diez.": 12,
    "Más de diez.": 20, "Necesito que KOMVOS lo determine.": 0
  };
  if (input.numberOfPages && pagePts[input.numberOfPages]) {
    b["Volumen de páginas"] = pagePts[input.numberOfPages]; score += pagePts[input.numberOfPages];
  }
  // Volumen: productos
  const prodPts: Record<string, number> = {
    "Entre 1 y 10.": 0, "Entre 11 y 50.": 8, "Entre 51 y 200.": 20, "Más de 200.": 35, "Todavía no lo sé.": 0
  };
  if (input.productVolume && prodPts[input.productVolume]) {
    b["Volumen de productos"] = prodPts[input.productVolume]; score += prodPts[input.productVolume];
  }
  // Volumen: rutas
  const routePts: Record<string, number> = {
    "Una ruta principal.": 0, "Dos o tres.": 8, "Cuatro o más.": 15, "Todavía no lo sé.": 0
  };
  if (input.numberOfRoutes && routePts[input.numberOfRoutes]) {
    b["Rutas"] = routePts[input.numberOfRoutes]; score += routePts[input.numberOfRoutes];
  }

  // Preparación
  const assets = input.existingAssets || [];
  const mats = input.availableMaterials || [];
  const noIdentity = !assets.includes("Identidad visual completa.");
  if (noIdentity) { b["Sin identidad"] = 8; score += 8; }
  if (!mats.includes("Textos.")) { b["Sin textos"] = 5; score += 5; }
  if (!mats.includes("Fotografías.") && !mats.includes("Videos.")) { b["Sin fotografías o videos"] = 5; score += 5; }
  if (!input.mainOfferDefined) { b["Oferta poco definida"] = 10; score += 10; }
  if (input.numberOfApprovers === "Tres o más.") { b["Tres o más aprobadores"] = 5; score += 5; }
  if (input.desiredStart === "Inmediatamente.") { b["Inicio inmediato (riesgo operativo)"] = 5; score += 5; }
  if (input.followUpCapacity === "Necesitamos construir también ese proceso." ||
      input.followUpCapacity === "Todavía no lo sé.") { b["Sin persona para seguimiento"] = 4; score += 4; }
  if (integ.length > 3) { b["Más de tres integraciones"] = 5; score += 5; }

  // Tier por puntaje
  let idx = TIERS.findIndex(t => score >= t.min && score <= t.max);
  if (idx < 0) idx = TIERS.length - 1;

  // Reglas mínimas
  const MIN_CAPTACION = TIER_INDEX("Sistema de captación");
  const MIN_ECOSISTEMA = TIER_INDEX("Ecosistema comercial");
  if (sel.includes("Tienda en línea.") && idx < MIN_CAPTACION) idx = MIN_CAPTACION;
  if (sel.includes("CRM.") && sel.includes("Automatizaciones.") && idx < MIN_CAPTACION) idx = MIN_CAPTACION;
  const mainModules = sel.filter(s => MODULE_POINTS[s] != null).length;
  if (mainModules >= 3 && idx < MIN_ECOSISTEMA) idx = MIN_ECOSISTEMA;

  // Evaluación personalizada
  const personalizedEvaluation =
    input.productVolume === "Más de 200." ||
    (input.numberOfPages === "Más de diez." && sel.includes("CRM.")) ||
    input.numberOfRoutes === "Cuatro o más.";

  // Mantenimiento mensual: solo lo relacionado con lo seleccionado
  const monthly: { label: string; range: string }[] = [];
  const add = (label: string, range: string) =>
    !monthly.some(m => m.label === label) && monthly.push({ label, range });
  const web = sel.some(s => ["Landing page.","Página web.","Tienda en línea.","Quiz o diagnóstico interactivo."].includes(s));
  if (sel.includes("CRM.") || sel.includes("Automatizaciones.") || sel.includes("Seguimiento por WhatsApp o correo."))
    add("CRM y automatizaciones", "$5,500 a $10,000 MXN");
  if (sel.includes("Publicidad digital."))
    add("Gestión publicitaria", "$7,000 a $12,000 MXN, más inversión publicitaria");
  if (sel.includes("Ecosistema comercial completo."))
    add("Operación integral", "$12,000 a $25,000 MXN");
  if (web && monthly.length === 0) add("Optimización web", "$3,500 a $6,500 MXN");
  if (monthly.length === 0) add("Soporte esencial", "$1,500 a $3,000 MXN");

  const t = TIERS[idx];
  return {
    score, tier: t.tier, priceRange: t.price, timelineRange: t.time,
    monthly, personalizedEvaluation, breakdown: b
  };
}

/* Madurez interna (para el perfil de KOMVOS y Sheets) */
export function maturity(assets: string[]) {
  const brand = ["Nombre definitivo.","Logo.","Colores.","Tipografías.","Identidad visual completa.","Propuesta de valor o mensaje principal."]
    .filter(a => assets.includes(a)).length;
  const commercial = ["Proceso comercial.","Equipo de ventas.","Base de datos.","Publicidad."]
    .filter(a => assets.includes(a)).length;
  const tech = ["Página web.","Tienda en línea.","Landing pages.","CRM.","Automatizaciones."]
    .filter(a => assets.includes(a)).length;
  const level = (n: number, max: number) => n === 0 ? "Inicial" : n <= max / 2 ? "En construcción" : "Avanzada";
  return {
    brandMaturity: level(brand, 6),
    commercialMaturity: level(commercial, 4),
    technologicalMaturity: level(tech, 5)
  };
}

/* Coordenadas descubiertas: derivadas de respuestas reales */
export function coordinates(a: {
  channels?: string[]; assets?: string[]; goals?: string[];
}): string[] {
  const out: string[] = [];
  const ch = a.channels || [], as = a.assets || [], go = a.goals || [];
  const hardToMeasure = ch.length > 0 && ch.every(c =>
    ["Recomendaciones.","Llamadas.","Local físico.","Eventos.","WhatsApp.","Prospección directa."].includes(c));
  if (hardToMeasure)
    out.push("Tu negocio ya genera confianza, pero depende principalmente de canales difíciles de medir.");
  const visual = as.includes("Logo.") || as.includes("Colores.");
  if (visual && !as.includes("Identidad visual completa."))
    out.push("Existen piezas visuales, aunque todavía no forman una identidad completa.");
  if (go.some(g => ["Perfilar clientes.","Automatizar seguimiento.","Implementar un CRM."].includes(g)) &&
      go.some(g => ["Conseguir más prospectos.","Lanzar publicidad."].includes(g)))
    out.push("Tu prioridad no es solamente atraer personas: también necesitas conocerlas y darles seguimiento.");
  return out;
}
