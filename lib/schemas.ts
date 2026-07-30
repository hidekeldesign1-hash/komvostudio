import { z } from "zod";

/* ── Entrada: creación de lead ── */
export const LeadCreateSchema = z.object({
  project_name: z.string().trim().min(2).max(160),
  full_name: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().regex(/^\+?[0-9\s\-()]{8,20}$/, "WhatsApp inválido"),
  email: z.string().trim().email(),
  city_state: z.string().trim().min(2).max(120),
  terms_accepted: z.literal(true),
  source_url: z.string().max(500).optional().default(""),
  utm_source: z.string().max(120).optional().default(""),
  utm_medium: z.string().max(120).optional().default(""),
  utm_campaign: z.string().max(120).optional().default(""),
  // honeypot invisible: los humanos lo dejan vacío
  company_website: z.string().max(0).optional().or(z.literal(""))
});
export type LeadCreate = z.infer<typeof LeadCreateSchema>;

/* ── Entrada: actualización progresiva ── */
export const LeadUpdateSchema = z.object({
  lead_id: z.string().min(8).max(64),
  status: z.enum(["Quiz iniciado", "En progreso", "Quiz completado"]).optional(),
  completion_percentage: z.number().min(0).max(100).optional(),
  last_step: z.string().max(80).optional(),
  answers: z.record(z.any()).optional()
});
export type LeadUpdate = z.infer<typeof LeadUpdateSchema>;

/* ── Entrada: análisis ── */
export const AnalyzeSchema = z.object({
  lead_id: z.string().min(8).max(64),
  answers: z.record(z.any())
});

/* ── Salida de Claude: resultado para el cliente ── */
export const ClientResultSchema = z.object({
  headline: z.string(),
  openingNarrative: z.string(),
  whatAlreadyExists: z.string(),
  opportunityDetected: z.string(),
  recommendedRoute: z.string(),
  estimatedInvestment: z.string(),
  estimatedTimeline: z.string(),
  ongoingCosts: z.string(),
  missingVariables: z.string(),
  emotionalClosing: z.string(),
  primaryCta: z.string(),
  whatsappMessage: z.string()
});
export type ClientResult = z.infer<typeof ClientResultSchema>;

/* ── Salida de Claude: perfil interno para KOMVOS ── */
export const InternalProfileSchema = z.object({
  businessSummary: z.string(),
  category: z.string(),
  businessStage: z.string(),
  brandMaturity: z.string(),
  commercialMaturity: z.string(),
  technologicalMaturity: z.string(),
  mainGoal: z.string(),
  requestedServices: z.array(z.string()),
  complexity: z.string(),
  priceTier: z.string(),
  estimatedRange: z.string(),
  estimatedTimeline: z.string(),
  possibleMonthlyService: z.string(),
  investmentCompatibility: z.string(),
  urgency: z.string(),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  missingInformation: z.array(z.string()),
  recommendedFirstOffer: z.string(),
  servicesNotToOfferYet: z.array(z.string()),
  questionsForZoom: z.array(z.string()),
  likelyObjection: z.string(),
  salesArgument: z.string(),
  nextStep: z.string(),
  leadScore: z.number().min(0).max(100)
});
export type InternalProfile = z.infer<typeof InternalProfileSchema>;

export const AnalysisSchema = z.object({
  clientResult: ClientResultSchema,
  internalProfile: InternalProfileSchema
});
export type Analysis = z.infer<typeof AnalysisSchema>;
