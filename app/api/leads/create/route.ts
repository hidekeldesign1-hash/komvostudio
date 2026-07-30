import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { LeadCreateSchema } from "@/lib/schemas";
import { appendLead, nowIso, sheetsConfigured } from "@/lib/sheets";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function OPTIONS() { return new NextResponse(null, { status: 204 }); }

export async function POST(req: Request) {
  try {
    if (!rateLimit(clientIp(req), 10, 60_000))
      return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en un minuto." }, { status: 429 });

    const body = await req.json();
    const parsed = LeadCreateSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: "Datos incompletos o inválidos.", details: parsed.error.flatten().fieldErrors }, { status: 400 });

    // Honeypot: si trae contenido, respondemos éxito falso sin guardar
    if (body.company_website) return NextResponse.json({ ok: true, lead_id: randomUUID() });

    const d = parsed.data;
    const lead_id = randomUUID();
    const now = nowIso();

    // Sin credenciales de Sheets: el quiz puede continuar en local.
    if (!sheetsConfigured()) {
      console.warn("leads/create: Google Sheets no configurado; lead efímero", lead_id);
      return NextResponse.json({
        ok: true,
        lead_id,
        local: true,
        warning:
          "Avanzaste en modo local. Para guardar leads en Sheets configura GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY y GOOGLE_SHEET_ID en .env.local.",
      });
    }

    try {
      await appendLead({
        lead_id, created_at: now, updated_at: now,
        status: "Quiz iniciado", completion_percentage: "0", last_step: "lead",
        project_name: d.project_name, full_name: d.full_name, whatsapp: d.whatsapp,
        email: d.email, city_state: d.city_state,
        source_url: d.source_url, utm_source: d.utm_source,
        utm_medium: d.utm_medium, utm_campaign: d.utm_campaign,
        terms_accepted_at: now
      }, { timeoutMs: 20_000 });
    } catch (sheetError) {
      // El registro en Sheets no debe impedir que la persona continúe.
      console.error("leads/create: fallo al escribir en Sheets", sheetError);
      return NextResponse.json({
        ok: true,
        lead_id,
        local: true,
        warning:
          sheetError instanceof Error
            ? sheetError.message
            : "No se pudo escribir en Google Sheets.",
      });
    }

    return NextResponse.json({ ok: true, lead_id });
  } catch (e) {
    console.error("leads/create", e);
    return NextResponse.json(
      { error: "No pudimos guardar tus datos. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
