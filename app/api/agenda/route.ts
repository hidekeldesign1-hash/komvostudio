import { NextResponse } from "next/server";

type AgendaBody = {
  nombre: string;
  whatsapp: string;
  dia: string;
  horario: string;
  /** Honeypot — si viene lleno, es bot */
  website_url?: string;
  honeypot?: string;
};

function whatsappDigits(value: string) {
  return value.replace(/\D/g, "");
}

function nameHasLink(value: string) {
  return /https?:\/\/|www\./i.test(value);
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
  const dia = new URL(request.url).searchParams.get("dia")?.trim() || "";
  if (!dia) {
    return NextResponse.json({ error: "Falta el parámetro dia." }, { status: 400 });
  }

  const result = await callSheetsWebApp({ action: "agenda_slots", dia });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    occupied: Array.isArray(result.data.occupied) ? result.data.occupied : [],
  });
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

  const result = await callSheetsWebApp({ nombre, whatsapp, dia, horario });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true });
}
