/* ============================================================
   KOMVOS · Análisis real con Claude (solo servidor)
   La clave nunca llega al navegador. El modelo se configura
   por variable de entorno. Los rangos, tiempos y clasificación
   llegan ya calculados por el motor de reglas: Claude no puede
   cambiarlos, solo redactar con ellos.
   ============================================================ */
import Anthropic from "@anthropic-ai/sdk";
import { AnalysisSchema, type Analysis } from "./schemas";
import type { RulesOutput } from "./rules";

const SYSTEM = `Eres el estratega senior de KOMVOS Marketing Studio. Analizas las respuestas reales de un diagnóstico y redactas dos objetos JSON: "clientResult" (lo que verá el prospecto) e "internalProfile" (uso interno de KOMVOS).

REGLAS OBLIGATORIAS:
1. No inventes información: usa únicamente lo que aparece en las respuestas.
2. Cita dentro del texto elementos textuales de las respuestas reales (categoría, lo que dijo que hace, lo que no debería perder, etc.).
3. No afirmes que el negocio necesita todos los servicios.
4. Prioriza una primera etapa clara.
5. No prometas ventas, prospectos ni ingresos.
6. No prometas retorno de inversión.
7. No cambies el rango calculado: úsalo textual.
8. No cambies el tiempo calculado: úsalo textual.
9. No crees una cotización final; aclara que es orientación inicial.
10. Sé emocional sin exagerar.
11. No digas que todos los proyectos son increíbles.
12. Señala con respeto las áreas que todavía necesitan definición.
13. Utiliza el nombre real del proyecto.
14. Incorpora lo que la persona dijo que su empresa no debería perder nunca.
15. El contenido total de clientResult debe quedar entre 450 y 700 palabras.
16. Responde ÚNICAMENTE con JSON válido, sin markdown, sin comentarios y sin texto adicional.

Estructura exacta de salida:
{"clientResult":{"headline":"","openingNarrative":"","whatAlreadyExists":"","opportunityDetected":"","recommendedRoute":"","estimatedInvestment":"","estimatedTimeline":"","ongoingCosts":"","missingVariables":"","emotionalClosing":"","primaryCta":"","whatsappMessage":""},"internalProfile":{"businessSummary":"","category":"","businessStage":"","brandMaturity":"","commercialMaturity":"","technologicalMaturity":"","mainGoal":"","requestedServices":[],"complexity":"","priceTier":"","estimatedRange":"","estimatedTimeline":"","possibleMonthlyService":"","investmentCompatibility":"","urgency":"","strengths":[],"risks":[],"missingInformation":[],"recommendedFirstOffer":"","servicesNotToOfferYet":[],"questionsForZoom":[],"likelyObjection":"","salesArgument":"","nextStep":"","leadScore":0}}

En "whatsappMessage" usa exactamente esta plantilla sustituyendo los valores reales:
"Hola, soy [nombre]. Acabo de completar el mapa de [proyecto]. Mi ruta recomendada fue [tipo de proyecto] y me gustaría agendar una sesión para revisarla."
"primaryCta" debe ser "Quiero construir esta ruta".
"leadScore" es un número de 0 a 100.`;

function extractJson(text: string): string {
  const t = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/,"").trim();
  const a = t.indexOf("{"); const b = t.lastIndexOf("}");
  if (a < 0 || b < 0) throw new Error("La respuesta no contiene JSON.");
  return t.slice(a, b + 1);
}

export async function runAnalysis(payload: {
  answers: Record<string, unknown>;
  rules: RulesOutput;
  maturity: { brandMaturity: string; commercialMaturity: string; technologicalMaturity: string };
  coordinates: string[];
}): Promise<Analysis> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL;
  if (!apiKey || !model) throw new Error("Faltan ANTHROPIC_API_KEY o ANTHROPIC_MODEL.");

  const anthropic = new Anthropic({ apiKey, timeout: 60_000, maxRetries: 1 });

  const user = JSON.stringify({
    respuestas_completas: payload.answers,
    clasificacion_calculada: {
      tipo_de_proyecto: payload.rules.tier,
      puntaje: payload.rules.score,
      evaluacion_personalizada: payload.rules.personalizedEvaluation
    },
    rango_calculado: payload.rules.personalizedEvaluation
      ? "Requiere evaluación personalizada"
      : payload.rules.priceRange,
    tiempo_calculado: payload.rules.personalizedEvaluation
      ? "Se define en la evaluación personalizada"
      : payload.rules.timelineRange,
    mantenimiento_calculado: payload.rules.monthly,
    madurez: payload.maturity,
    coordenadas_detectadas: payload.coordinates
  });

  const attempt = async (): Promise<Analysis> => {
    const msg = await anthropic.messages.create({
      model,
      max_tokens: 4000,
      system: SYSTEM,
      messages: [{ role: "user", content: user }]
    });
    const text = msg.content
      .map(b => (b.type === "text" ? b.text : ""))
      .join("");
    const parsed = JSON.parse(extractJson(text));
    return AnalysisSchema.parse(parsed);
  };

  try {
    return await attempt();
  } catch {
    // Reintento controlado: una segunda oportunidad ante JSON inválido o corte
    return await attempt();
  }
}
