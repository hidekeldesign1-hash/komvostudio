/**
 * KOMVOS · Agenda + Quiz
 * Pega TODO este archivo en Extensiones → Apps Script de la hoja "Agenda".
 * Conserva la pestaña Agenda y crea automáticamente una pestaña "Quiz Leads".
 *
 * Columnas Agenda (A–E):
 * Fecha de solicitud | Día seleccionado | Nombre | WhatsApp | Horario
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

var AGENDA_SHEET = "Agenda";
var AGENDA_HEADERS = [
  "Fecha de solicitud",
  "Día seleccionado",
  "Nombre",
  "WhatsApp",
  "Horario"
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

function getAgendaSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(AGENDA_SHEET);
  if (!sheet) {
    sheet = book.getSheets()[0];
    sheet.setName(AGENDA_SHEET);
  }
  return sheet;
}

function ensureAgendaSheet() {
  return resetAgendaSheet(getAgendaSheet(), false);
}

/** Reescribe encabezados a las 5 columnas correctas y opcionalmente limpia filas de datos. */
function resetAgendaSheet(sheet, clearData) {
  var lastCol = Math.max(sheet.getLastColumn(), AGENDA_HEADERS.length);
  var lastRow = sheet.getLastRow();

  if (clearData && lastRow > 1) {
    sheet.getRange(2, 1, lastRow, lastCol).clearContent();
  }

  sheet.getRange(1, 1, 1, AGENDA_HEADERS.length).setValues([AGENDA_HEADERS]);
  sheet.getRange(1, 1, 1, AGENDA_HEADERS.length).setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm:ss");

  lastCol = sheet.getLastColumn();
  if (lastCol > AGENDA_HEADERS.length) {
    sheet.deleteColumns(AGENDA_HEADERS.length + 1, lastCol - AGENDA_HEADERS.length);
  }

  return sheet;
}

function setupAgenda(body) {
  var clearData = !(body && body.clear_data === false);
  var sheet = resetAgendaSheet(getAgendaSheet(), clearData);
  return {
    ok: true,
    action: "setup_agenda",
    headers: AGENDA_HEADERS,
    cleared: clearData,
    sheet: sheet.getName()
  };
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
  var sheet = ensureAgendaSheet();
  var dia = String(body.dia || "").trim();
  var horario = String(body.horario || "").trim();
  var occupied = getOccupiedSlots({ dia: dia }).occupied || [];
  if (horario && occupied.indexOf(horario) !== -1) {
    return { ok: false, error: "Ese horario ya está reservado. Elige otro." };
  }
  sheet.appendRow([
    new Date(),
    dia,
    body.nombre || "",
    body.whatsapp || "",
    horario
  ]);
  return { ok: true };
}

function getOccupiedSlots(body) {
  var sheet = ensureAgendaSheet();
  var dia = String(body.dia || "").trim();
  var occupied = [];
  var lastRow = sheet.getLastRow();
  if (!dia || lastRow < 2) {
    return { ok: true, occupied: occupied };
  }
  var rows = sheet.getRange(2, 1, lastRow, 5).getValues();
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][1]).trim() === dia) {
      var slot = String(rows[i][4]).trim();
      if (slot) occupied.push(slot);
    }
  }
  return { ok: true, occupied: occupied };
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.action === "setup_agenda") {
    return jsonOutput(setupAgenda({ clear_data: params.clear_data !== "false" }));
  }
  if (params.action === "agenda_slots") {
    return jsonOutput(getOccupiedSlots({ dia: params.dia || "" }));
  }
  if (params.action === "ping") {
    return jsonOutput({ ok: true, service: "komvos-agenda", version: "v3" });
  }
  return jsonOutput({ ok: true, service: "komvos-agenda", hint: "Usa POST con JSON o ?action=ping" });
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
    else if (body.action === "agenda_slots") result = getOccupiedSlots(body);
    else if (body.action === "setup_agenda") result = setupAgenda(body);
    else result = appendAgenda(body);
    return jsonOutput(result);
  } catch (err) {
    return jsonOutput({ error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
