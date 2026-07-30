/* ============================================================
   KOMVOS · Google Sheets como almacenamiento inicial
   Una fila por lead, identificada por lead_id (columna A).
   ============================================================ */
import { google } from "googleapis";

export const COLUMNS = [
  "lead_id","created_at","updated_at","status","completion_percentage","last_step",
  "project_name","full_name","whatsapp","email","city_state","source_url",
  "utm_source","utm_medium","utm_campaign","category","business_description",
  "target_audience","business_stage","main_offer","acquisition_channels",
  "existing_assets","values","desired_feeling","must_never_lose","main_goal",
  "selected_goals","selected_services","number_of_pages","product_volume",
  "number_of_routes","available_materials","required_integrations",
  "number_of_approvers","follow_up_capacity","collaboration_style","desired_start",
  "investment_response","brand_maturity","commercial_maturity",
  "technological_maturity","complexity_score","project_tier","price_range",
  "timeline_range","monthly_range","answers_json","client_result",
  "internal_profile","lead_score","next_step","terms_accepted_at"
] as const;

export type Row = Partial<Record<(typeof COLUMNS)[number], string>>;

const SHEET = "Leads";

function serviceAccountConfigured(): boolean {
  const email =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key =
    process.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const id =
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SHEET_ID;
  return Boolean(email?.trim() && key?.trim() && id?.trim());
}

function webAppConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SHEETS_WEBAPP_URL?.trim());
}

export function sheetsConfigured(): boolean {
  return serviceAccountConfigured() || webAppConfigured();
}

async function callWebApp(
  action: "quiz_create" | "quiz_update" | "quiz_get",
  payload: Record<string, unknown>,
  timeoutMs = 8000,
) {
  const url = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!url) throw new Error("Falta GOOGLE_SHEETS_WEBAPP_URL.");

  // Apps Script puede tardar o no responder: nunca debe bloquear el funnel.
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  let data: {
    ok?: boolean;
    error?: string;
    integration?: string;
    found?: boolean;
    row?: Row;
  } = {};
  try {
    data = JSON.parse(text);
  } catch {}

  if (!response.ok || data.error) {
    throw new Error(
      data.error || `Google Sheets respondió con error ${response.status}.`,
    );
  }
  if (data.integration !== "komvos-quiz-v2") {
    throw new Error(
      "El Apps Script de Google Sheets todavía no está actualizado para recibir el quiz.",
    );
  }
  return data;
}

function client() {
  const email =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = (
    process.env.GOOGLE_PRIVATE_KEY ||
    process.env.GOOGLE_SHEETS_PRIVATE_KEY ||
    ""
  ).replace(/\\n/g, "\n");
  const id =
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !id) {
    throw new Error(
      "Faltan variables de Google Sheets: GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY y GOOGLE_SHEET_ID.",
    );
  }
  const auth = new google.auth.JWT({
    email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  return { api: google.sheets({ version: "v4", auth }), id };
}

function colLetter(n: number): string {
  let s = ""; let x = n;
  while (x >= 0) { s = String.fromCharCode(65 + (x % 26)) + s; x = Math.floor(x / 26) - 1; }
  return s;
}
const LAST = colLetter(COLUMNS.length - 1);

/* Crea el encabezado si la hoja está vacía. */
async function ensureHeader() {
  const { api, id } = client();
  const r = await api.spreadsheets.values.get({ spreadsheetId: id, range: `${SHEET}!A1:A1` });
  if (!r.data.values || !r.data.values.length) {
    await api.spreadsheets.values.update({
      spreadsheetId: id, range: `${SHEET}!A1`, valueInputOption: "RAW",
      requestBody: { values: [COLUMNS as unknown as string[]] }
    });
  }
}

export async function appendLead(
  row: Row,
  options: { timeoutMs?: number } = {},
): Promise<void> {
  if (!serviceAccountConfigured() && webAppConfigured()) {
    await callWebApp("quiz_create", { row }, options.timeoutMs);
    return;
  }
  await ensureHeader();
  const { api, id } = client();
  const values = COLUMNS.map(c => row[c] ?? "");
  await api.spreadsheets.values.append({
    spreadsheetId: id, range: `${SHEET}!A:${LAST}`,
    valueInputOption: "RAW", insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] }
  });
}

async function findRowIndex(leadId: string): Promise<number | null> {
  const { api, id } = client();
  const r = await api.spreadsheets.values.get({ spreadsheetId: id, range: `${SHEET}!A:A` });
  const col = r.data.values || [];
  for (let i = 1; i < col.length; i++) {
    if ((col[i][0] || "").trim() === leadId) return i + 1; // 1-indexado
  }
  return null;
}

/* Actualiza solo las columnas presentes en patch, sin tocar las demás. */
export async function updateLead(
  leadId: string,
  patch: Row,
  options: { timeoutMs?: number } = {},
): Promise<boolean> {
  if (!serviceAccountConfigured() && webAppConfigured()) {
    const data = await callWebApp(
      "quiz_update",
      { lead_id: leadId, patch },
      options.timeoutMs,
    );
    return data.found !== false;
  }
  const rowIndex = await findRowIndex(leadId);
  if (!rowIndex) return false;
  const { api, id } = client();
  const data = Object.entries(patch)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      const c = COLUMNS.indexOf(k as (typeof COLUMNS)[number]);
      return { range: `${SHEET}!${colLetter(c)}${rowIndex}`, values: [[String(v)]] };
    })
    .filter(d => !d.range.startsWith(`${SHEET}!@`));
  if (!data.length) return true;
  await api.spreadsheets.values.batchUpdate({
    spreadsheetId: id,
    requestBody: { valueInputOption: "RAW", data }
  });
  return true;
}

export async function getLead(leadId: string): Promise<Row | null> {
  if (!serviceAccountConfigured() && webAppConfigured()) {
    const data = await callWebApp("quiz_get", { lead_id: leadId });
    return data.found === false ? null : data.row || null;
  }
  const rowIndex = await findRowIndex(leadId);
  if (!rowIndex) return null;
  const { api, id } = client();
  const r = await api.spreadsheets.values.get({
    spreadsheetId: id, range: `${SHEET}!A${rowIndex}:${LAST}${rowIndex}`
  });
  const vals = (r.data.values && r.data.values[0]) || [];
  const row: Row = {};
  COLUMNS.forEach((c, i) => { row[c] = vals[i] ?? ""; });
  return row;
}

export const nowIso = () => new Date().toISOString();
