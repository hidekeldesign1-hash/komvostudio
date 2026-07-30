import { NextResponse } from "next/server";
import { LeadUpdateSchema } from "@/lib/schemas";
import { updateLead, nowIso, sheetsConfigured } from "@/lib/sheets";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function OPTIONS() { return new NextResponse(null, { status: 204 }); }

/* Aplana las respuestas hacia las columnas individuales de la hoja. */
function columnsFromAnswers(a: Record<string, any>) {
  const j = (v: any) => Array.isArray(v) ? v.join(" | ") : (v ?? "");
  return {
    category: j(a.category), business_description: j(a.business_description),
    target_audience: j(a.target_audience), business_stage: j(a.business_stage),
    main_offer: j(a.main_offer), acquisition_channels: j(a.acquisition_channels),
    existing_assets: j(a.existing_assets), values: j(a.values),
    desired_feeling: j(a.desired_feeling), must_never_lose: j(a.must_never_lose),
    main_goal: j(a.main_goal), selected_goals: j(a.selected_goals),
    selected_services: j(a.selected_services), number_of_pages: j(a.number_of_pages),
    product_volume: j(a.product_volume), number_of_routes: j(a.number_of_routes),
    available_materials: j(a.available_materials),
    required_integrations: j(a.required_integrations),
    number_of_approvers: j(a.number_of_approvers),
    follow_up_capacity: j(a.follow_up_capacity),
    collaboration_style: j(a.collaboration_style), desired_start: j(a.desired_start),
    investment_response: j(a.investment_response)
  };
}

export async function POST(req: Request) {
  try {
    if (!rateLimit(clientIp(req), 60, 60_000))
      return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });

    const parsed = LeadUpdateSchema.safeParse(await req.json());
    if (!parsed.success)
      return NextResponse.json({ error: "Actualización inválida." }, { status: 400 });

    if (!sheetsConfigured()) {
      return NextResponse.json({ ok: true, local: true });
    }

    const { lead_id, status, completion_percentage, last_step, answers } = parsed.data;
    const patch: Record<string, string> = { updated_at: nowIso() };
    if (status) patch.status = status;
    if (completion_percentage !== undefined) patch.completion_percentage = String(completion_percentage);
    if (last_step) patch.last_step = last_step;
    if (answers) {
      Object.assign(patch, columnsFromAnswers(answers));
      patch.answers_json = JSON.stringify(answers).slice(0, 45000);
    }
    const ok = await updateLead(lead_id, patch);
    if (!ok) return NextResponse.json({ error: "Lead no encontrado." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("leads/update", e);
    return NextResponse.json({ error: "No pudimos guardar el avance." }, { status: 500 });
  }
}
