import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AgendaBody = {
  nombre: string;
  whatsapp: string;
  dia: string;
  /** Clave estable YYYY-MM-DD para matching de ocupados */
  diaKey?: string;
  horario: string;
  /** Honeypot — si viene lleno, es bot */
  website_url?: string;
  honeypot?: string;
};

const CANONICAL_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

function whatsappDigits(value: string) {
  return value.replace(/\D/g, "");
}

function nameHasLink(value: string) {
  return /https?:\/\/|www\./i.test(value);
}

/** Normaliza horarios tipo "10:00 a. m." → "10:00 AM" */
export function normalizeSlot(value: string): string {
  const raw = String(value || "")
    .toUpperCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .replace(/A\s*M/g, "AM")
    .replace(/P\s*M/g, "PM")
    .trim();

  const match = CANONICAL_SLOTS.find((slot) => {
    const a = slot.replace(/\s+/g, "");
    const b = raw.replace(/\s+/g, "");
    return a === b || slot === raw;
  });
  return match || raw;
}

function canonicalizeOccupied(slots: string[]): string[] {
  const out: string[] = [];
  for (const slot of slots) {
    const normalized = normalizeSlot(slot);
    if (normalized && !out.includes(normalized)) out.push(normalized);
  }
  return out;
}

async function callSheetsWebApp(payload: Record<string, unknown>) {
  const url = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!url) {
    return {
      ok: false as const,
      status: 500,
      error: "No está configurada la URL de Google Sheets (GOOGLE_SHEETS_WEBAPP_URL).",
    };
  }

  try {
    // Apps Script responde 302 a un echo URL; hay que POST y luego GET el Location.
    const first = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "manual",
      cache: "no-store",
    });

    let text = "";
    if (first.status >= 300 && first.status < 400) {
      const location = first.headers.get("location");
      if (!location) {
        return {
          ok: false as const,
          status: 502,
          error: "Google Sheets no devolvió la URL de respuesta.",
        };
      }
      const second = await fetch(location, { method: "GET", cache: "no-store" });
      text = await second.text();
      if (!second.ok) {
        return {
          ok: false as const,
          status: 502,
          error: `Google Sheets respondió con error: ${second.status}. Revisa que la app web tenga acceso "Cualquier persona".`,
        };
      }
    } else {
      text = await first.text();
      if (!first.ok) {
        return {
          ok: false as const,
          status: 502,
          error:
            `Google Sheets respondió con error: ${first.status}. ` +
            "Confirma la URL /exec y el acceso público de la implementación.",
        };
      }
    }

    let data: { ok?: boolean; error?: string; occupied?: string[] } = {};
    try {
      data = JSON.parse(text);
    } catch {
      return {
        ok: false as const,
        status: 502,
        error:
          "Google Sheets no devolvió JSON. Abre la URL /exec en el navegador, autoriza y verifica acceso: Cualquier persona.",
      };
    }

    if (data.error || data.ok === false) {
      return {
        ok: false as const,
        status: 409,
        error: data.error || "No se pudo completar la operación en Google Sheets.",
      };
    }

    return { ok: true as const, data };
  } catch (err) {
    console.error("Error enviando a Google Sheets:", err);
    return {
      ok: false as const,
      status: 502,
      error: "No se pudo conectar con el servidor. Revisa la URL de Google Sheets.",
    };
  }
}

/** Horarios ya reservados para un día (desde la hoja Agenda). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const dia = url.searchParams.get("dia")?.trim() || "";
  const diaKey = url.searchParams.get("diaKey")?.trim() || "";
  if (!dia && !diaKey) {
    return NextResponse.json({ error: "Falta el parámetro dia." }, { status: 400 });
  }

  const result = await callSheetsWebApp({
    action: "agenda_slots",
    dia,
    diaKey,
  });
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      {
        status: result.status,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const occupied = canonicalizeOccupied(
    Array.isArray(result.data.occupied) ? result.data.occupied : [],
  );

  return NextResponse.json(
    { ok: true, occupied },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}

export async function POST(request: Request) {
  let body: AgendaBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  // Honeypot: bot detectado → éxito falso, sin guardar en Sheets
  const honeypot = String(body.website_url || body.honeypot || "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const nombre = String(body.nombre || "").trim();
  const whatsapp = String(body.whatsapp || "").trim();
  const dia = String(body.dia || "").trim();
  const horario = String(body.horario || "").trim();

  if (!nombre || !whatsapp || !dia || !horario) {
    return NextResponse.json(
      { error: "Faltan campos: nombre, WhatsApp, día u horario." },
      { status: 400 },
    );
  }

  if (nameHasLink(nombre)) {
    return NextResponse.json(
      { error: "El nombre no puede contener enlaces." },
      { status: 400 },
    );
  }

  if (whatsappDigits(whatsapp).length < 10) {
    return NextResponse.json(
      { error: "Tu WhatsApp debe tener al menos 10 dígitos." },
      { status: 400 },
    );
  }

  const result = await callSheetsWebApp({
    nombre,
    whatsapp,
    dia,
    diaKey: String(body.diaKey || "").trim(),
    horario: normalizeSlot(horario),
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
