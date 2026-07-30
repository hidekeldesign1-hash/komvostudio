/**
 * KOMVOS · Agenda + Quiz
 * Pega TODO este archivo en Extensiones → Apps Script de la hoja "Agenda".
 * Conserva la pestaña Agenda y crea automáticamente una pestaña "Quiz Leads".
 */
var QUIZ_SHEET = "Quiz Leads";
var QUIZ_KEYS = [
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
];
var QUIZ_HEADERS = [
  "ID del lead","Fecha y hora de registro","Última actualización","Estado",
  "Avance (%)","Último paso","Proyecto o empresa","Nombre completo","WhatsApp",
  "Correo electrónico","Ciudad o estado","URL de origen","UTM source","UTM medium",
  "UTM campaign","Categoría","Qué hace el negocio","Público objetivo",
  "Etapa del proyecto","Oferta principal","Canales de adquisición","Activos existentes",
  "Valores","Sensación deseada","Qué no debe perder","Objetivo principal",
  "Objetivos seleccionados","Servicios seleccionados","Número de páginas",
  "Volumen de productos","Número de rutas","Materiales disponibles",
  "Integraciones requeridas","Personas que aprueban","Capacidad de seguimiento",
  "Estilo de colaboración","Inicio deseado","Respuesta sobre inversión",
  "Madurez de marca","Madurez comercial","Madurez tecnológica","Complejidad",
  "Nivel de proyecto","Rango de precio","Tiempo estimado","Operación mensual",
  "Respuestas completas (JSON)","Resultado para el cliente","Perfil interno",
  "Puntuación del lead","Siguiente paso","Aceptación de privacidad"
];

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function ensureQuizSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(QUIZ_SHEET);
  if (!sheet) sheet = book.insertSheet(QUIZ_SHEET);
  sheet.getRange(1, 1, 1, QUIZ_HEADERS.length).setValues([QUIZ_HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange("B:C").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange("AZ:AZ").setNumberFormat("dd/MM/yyyy HH:mm:ss");
  return sheet;
}

function valueForCell(key, value) {
  if (value === undefined || value === null) return "";
  if (key === "created_at" || key === "updated_at" || key === "terms_accepted_at") {
    var parsed = new Date(value);
    return isNaN(parsed.getTime()) ? value : parsed;
  }
  if (Array.isArray(value)) return value.join(" | ");
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function findLeadRow(sheet, leadId) {
  if (!leadId || sheet.getLastRow() < 2) return 0;
  var match = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(String(leadId))
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function createQuizLead(body) {
  var sheet = ensureQuizSheet();
  var row = body.row || {};
  var now = new Date();
  row.created_at = row.created_at || now;
  row.updated_at = row.updated_at || now;
  sheet.appendRow(QUIZ_KEYS.map(function (key) {
    return valueForCell(key, row[key]);
  }));
  return { ok: true, integration: "komvos-quiz-v2" };
}

function updateQuizLead(body) {
  var sheet = ensureQuizSheet();
  var rowNumber = findLeadRow(sheet, body.lead_id);
  if (!rowNumber) {
    return { ok: true, found: false, integration: "komvos-quiz-v2" };
  }
  var patch = body.patch || {};
  patch.updated_at = patch.updated_at || new Date();
  Object.keys(patch).forEach(function (key) {
    var column = QUIZ_KEYS.indexOf(key);
    if (column < 0) return;
    sheet.getRange(rowNumber, column + 1).setValue(valueForCell(key, patch[key]));
  });
  return { ok: true, found: true, integration: "komvos-quiz-v2" };
}

function getQuizLead(body) {
  var sheet = ensureQuizSheet();
  var rowNumber = findLeadRow(sheet, body.lead_id);
  if (!rowNumber) {
    return { ok: true, found: false, integration: "komvos-quiz-v2" };
  }
  var values = sheet.getRange(rowNumber, 1, 1, QUIZ_KEYS.length).getValues()[0];
  var row = {};
  QUIZ_KEYS.forEach(function (key, index) { row[key] = values[index]; });
  return { ok: true, found: true, row: row, integration: "komvos-quiz-v2" };
}

function appendAgenda(body) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName("Agenda") || book.getActiveSheet();
  sheet.appendRow([
    new Date(),
    body.nombre || "",
    body.whatsapp || "",
    body.tipo_negocio || "",
    body.mejorar || "",
    body.presupuesto || "",
    body.fecha_hora || ""
  ]);
  return { ok: true };
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var body = e.postData ? JSON.parse(e.postData.contents) : {};
    var result;
    if (body.action === "quiz_create") result = createQuizLead(body);
    else if (body.action === "quiz_update") result = updateQuizLead(body);
    else if (body.action === "quiz_get") result = getQuizLead(body);
    else result = appendAgenda(body);
    return jsonOutput(result);
  } catch (err) {
    return jsonOutput({ error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
