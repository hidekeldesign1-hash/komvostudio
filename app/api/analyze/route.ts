import { NextResponse } from "next/server";
import { AnalyzeSchema } from "@/lib/schemas";
import { computeRules, maturity, coordinates } from "@/lib/rules";
import { runAnalysis } from "@/lib/anthropic";
import { updateLead, nowIso } from "@/lib/sheets";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function OPTIONS() { return new NextResponse(null, { status: 204 }); }

export async function POST(req: Request) {
  try {
    if (!rateLimit(clientIp(req), 6, 60_000))
      return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });

    const parsed = AnalyzeSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });

    const { lead_id, answers } = parsed.data;
    const a = answers as Record<string, any>;

    /* El servidor recalcula las reglas: el cliente nunca decide el rango. */
    const rules = computeRules({
      selectedServices: a.selected_services || [],
      numberOfPages: a.number_of_pages,
      productVolume: a.product_volume,
      numberOfRoutes: a.number_of_routes,
      existingAssets: a.existing_assets || [],
      availableMaterials: a.available_materials || [],
      mainOfferDefined: a.main_offer ? a.main_offer !== "Todavía lo estoy definiendo." : false,
      numberOfApprovers: a.number_of_approvers,
      desiredStart: a.desired_start,
      followUpCapacity: a.follow_up_capacity,
      requiredIntegrations: a.required_integrations || []
    });
    const mat = maturity(a.existing_assets || []);
    const coords = coordinates({
      channels: a.acquisition_channels, assets: a.existing_assets, goals: a.selected_goals
    });

    const analysis = await runAnalysis({ answers: a, rules, maturity: mat, coordinates: coords });

    /* Guardar todo: el perfil interno se queda en la hoja, no viaja al navegador. */
    const monthlyText = rules.monthly.map(m => `${m.label}: ${m.range}`).join(" | ");
    try {
      await updateLead(lead_id, {
        updated_at: nowIso(), status: "Quiz completado", completion_percentage: "100",
        last_step: "result",
        brand_maturity: mat.brandMaturity, commercial_maturity: mat.commercialMaturity,
        technological_maturity: mat.technologicalMaturity,
        complexity_score: String(rules.score),
        project_tier: rules.personalizedEvaluation ? "Requiere evaluación personalizada" : rules.tier,
        price_range: rules.personalizedEvaluation ? "Evaluación personalizada" : rules.priceRange,
        timeline_range: rules.personalizedEvaluation ? "Evaluación personalizada" : rules.timelineRange,
        monthly_range: monthlyText,
        client_result: JSON.stringify(analysis.clientResult).slice(0, 45000),
        internal_profile: JSON.stringify(analysis.internalProfile).slice(0, 45000),
        lead_score: String(analysis.internalProfile.leadScore),
        next_step: analysis.internalProfile.nextStep
      });
    } catch (sheetError) {
      console.warn("analyze: no se pudo persistir en Sheets", sheetError);
    }

    return NextResponse.json({
      ok: true,
      clientResult: analysis.clientResult,
      tier: rules.personalizedEvaluation ? "Requiere evaluación personalizada" : rules.tier,
      priceRange: rules.personalizedEvaluation ? "Requiere evaluación personalizada" : rules.priceRange,
      timelineRange: rules.personalizedEvaluation ? "Se define en la evaluación personalizada" : rules.timelineRange,
      monthly: rules.monthly,
      personalizedEvaluation: rules.personalizedEvaluation
    });
  } catch (e) {
    console.error("analyze", e);
    const missingKey =
      e instanceof Error && /ANTHROPIC|api.?key|authentication/i.test(e.message);
    return NextResponse.json(
      {
        error: missingKey
          ? "Falta ANTHROPIC_API_KEY en .env.local para generar el diagnóstico."
          : "No pudimos generar el diagnóstico en este momento. Intenta de nuevo en unos segundos.",
      },
      { status: 502 }
    );
  }
}
