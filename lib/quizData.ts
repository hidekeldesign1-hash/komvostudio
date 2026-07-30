/* ============================================================
   KOMVOS · El Pulso — Datos del quiz
   Todos los textos provienen de la especificación y no deben
   modificarse sin indicarlo.
   ============================================================ */

export type StepKind =
  | "cover" | "lead" | "transition"
  | "category" | "single" | "multi" | "prioritize"
  | "open" | "composite" | "investment" | "identity";

export interface Option { id: string; label: string; }

export const COVER = {
  title: "¿Hasta dónde puede llegar tu proyecto?",
  text: "Cuéntanos qué estás construyendo. En unos minutos trazaremos una primera ruta para convertirlo en una marca y un ecosistema comercial con dirección.",
  button: "Descubrir mi ruta",
  footer: "Toma entre 5 y 7 minutos. No necesitas tener todas las respuestas.",
  legalLink: "Alcance, estimaciones y privacidad"
};

export const LEAD_SCREEN = {
  title: "Primero, cuéntanos un poco de ti",
  text: "Queremos conocer quién está detrás del proyecto y guardar tu avance. Así podremos preparar una ruta más útil para ti, incluso si decides terminarla después.",
  consent: "He leído el aviso de privacidad y autorizo a KOMVOS a utilizar mis respuestas para elaborar mi diagnóstico y contactarme para dar seguimiento a mi proyecto.",
  button: "Comenzar a descubrir mi proyecto",
  afterSubmit: "Estamos preparando el espacio para conocer tus ideas."
};

export const CHAPTERS = [
  "Tu proyecto", "Su presente", "Sus oportunidades", "Lo que ya existe",
  "Su esencia", "Su siguiente etapa", "Su mapa"
];

export const TRANSITIONS = {
  t1: "Estamos conectando lo que haces con las personas a las que puedes ayudar.",
  t2: "Estamos reconociendo las piezas que ya existen y aquello que todavía necesita tomar forma.",
  tFinal: "Estamos convirtiendo tus respuestas en una primera ruta para tu proyecto."
};

/* PASO 1 */
export const CATEGORIES: Option[] = [
  "Comercio","Comercio electrónico","Servicios profesionales","Seguros","Finanzas",
  "Inmobiliario","Salud y bienestar","Belleza y cuidado personal","Educación",
  "Cursos y mentorías","Tecnología","Alimentos","Construcción","Industria",
  "Entretenimiento","Proyectos creativos","Organizaciones","Otro"
].map(l => ({ id: l, label: l }));

export const CATEGORY_FEEDBACK: Record<string, string> = {
  "Salud y bienestar": "En este sector, la confianza, la claridad y la experiencia importan tanto como el servicio.",
  "Finanzas": "Aquí las personas no solo buscan información. Necesitan sentir seguridad para tomar decisiones importantes.",
  "Servicios profesionales": "Tu conocimiento tiene valor. El reto es lograr que las personas lo entiendan y lo perciban desde el primer contacto.",
  "Comercio electrónico": "Cada detalle cuenta: desde la primera impresión hasta la experiencia de compra.",
  "Otro": "Nos interesan especialmente los proyectos que no caben fácilmente dentro de una categoría. Cuéntanos más."
};

export const STEP1_OPEN = {
  q2Title: "Cuéntanos qué haces",
  q2Hint: "Explícanos con tus propias palabras qué ofreces, a quién ayudas y qué problema resuelves. No necesitas escribirlo perfecto.",
  q3Title: "¿Quién suele comprar o a quién te gustaría ayudar principalmente?"
};

/* PASO 2 */
export const STAGES: Option[] = [
  "Es una idea que quiero comenzar.",
  "Estoy construyendo las primeras bases.",
  "Ya tengo clientes, pero me falta estructura.",
  "Ya funciona y quiero ordenarlo.",
  "Está creciendo y necesito automatizarlo.",
  "Ya existe un sistema, pero quiero mejorarlo.",
  "Tengo un proyecto que no está funcionando como esperaba."
].map(l => ({ id: l, label: l }));

export const STAGE_FEEDBACK: Record<string, string> = {
  "Es una idea que quiero comenzar.": "Estás en un momento valioso. Podemos construir las bases correctamente antes de acumular procesos difíciles de corregir.",
  "Ya tengo clientes, pero me falta estructura.": "Ya existe una señal importante: el mercado ha respondido. Ahora podemos convertir ese esfuerzo en un sistema más claro y repetible.",
  "Está creciendo y necesito automatizarlo.": "Crecer también revela los límites de los procesos actuales. Este puede ser el momento correcto para conectar, medir y automatizar.",
  "Tengo un proyecto que no está funcionando como esperaba.": "No todo necesita reconstruirse. Primero identificaremos qué vale la pena conservar, qué debe ordenarse y qué necesita cambiar."
};

/* PASO 3 */
export const OFFERS: Option[] = [
  "Productos físicos.","Servicios.","Consultoría o asesoría.","Citas o sesiones.",
  "Cursos.","Mentorías.","Membresías.","Productos digitales.","Suscripciones.",
  "Distribución.","Una combinación.","Todavía lo estoy definiendo."
].map(l => ({ id: l, label: l }));

export const OFFER_PRIORITIZE = "¿Cuál es hoy tu oferta principal?";

/* PASO 4 */
export const CHANNELS: Option[] = [
  "Recomendaciones.","Redes sociales.","Publicidad digital.","Página web.",
  "WhatsApp.","Llamadas.","Prospección directa.","Equipo de ventas.","Local físico.",
  "Eventos.","Alianzas.","Marketplaces.","Contenido.","Todavía no tengo un canal estable."
].map(l => ({ id: l, label: l }));

export function channelFeedback(sel: string[]): string {
  const has = (s: string) => sel.some(x => x.startsWith(s));
  if (has("Recomendaciones") && (has("Redes") || has("Contenido")))
    return "Ya cuentas con dos fuerzas importantes: la confianza de quienes te recomiendan y la posibilidad de llegar a nuevas personas mediante contenido. Ahora necesitamos convertir ambas en un flujo más constante y medible.";
  if (sel.length === 1 && has("Recomendaciones"))
    return "Las recomendaciones suelen demostrar que tu trabajo genera confianza. El siguiente paso es evitar que el crecimiento dependa únicamente del boca a boca.";
  if (has("Publicidad"))
    return "Ya estás generando atención. Ahora debemos descubrir cuánto de ese interés se convierte realmente en conversaciones y oportunidades.";
  if (has("Todavía no tengo"))
    return "Este es uno de los primeros problemas que un ecosistema comercial puede resolver: crear una ruta clara para que nuevas personas te conozcan, te entiendan y contacten.";
  return "Cada canal que ya existe es una señal. El siguiente paso es conectarlos en un flujo que puedas medir y repetir.";
}

/* PASO 5 */
export const ASSETS: Option[] = [
  "Nombre definitivo.","Logo.","Colores.","Tipografías.","Identidad visual completa.",
  "Propuesta de valor o mensaje principal.","Página web.","Tienda en línea.","Landing pages.",
  "Redes sociales.","Contenido.","Fotografías o videos.","Base de datos.","CRM.",
  "Automatizaciones.","Publicidad.","Proceso comercial.","Equipo de ventas.",
  "Todavía no tengo estas piezas."
].map(l => ({ id: l, label: l }));

export const ORBITS: Record<string, string[]> = {
  "Marca": ["Nombre definitivo.","Logo.","Colores.","Tipografías.","Identidad visual completa."],
  "Oferta": ["Propuesta de valor o mensaje principal."],
  "Presencia": ["Página web.","Tienda en línea.","Landing pages.","Redes sociales."],
  "Contenido": ["Contenido.","Fotografías o videos."],
  "Ventas": ["Proceso comercial.","Equipo de ventas.","Base de datos."],
  "Automatización": ["CRM.","Automatizaciones.","Publicidad."]
};

export function assetsFeedback(sel: string[]): string {
  const hasIdentity = sel.includes("Identidad visual completa.");
  const visual = sel.includes("Logo.") || sel.includes("Colores.");
  if (visual && !hasIdentity)
    return "Ya existen señales visuales, pero una marca necesita algo más: personalidad, lenguaje, cultura y una experiencia reconocible.";
  if (sel.filter(s => s !== "Todavía no tengo estas piezas.").length <= 3)
    return "Ya existe un punto de partida. Ahora podemos construir las piezas restantes con una misma dirección.";
  return "Has desarrollado elementos importantes. El siguiente paso será comprobar si trabajan como un sistema o todavía funcionan como esfuerzos separados.";
}

/* PASO 6 */
export const VALUES: Option[] = [
  "Confianza.","Transformación.","Comunidad.","Innovación.","Cuidado.","Libertad.",
  "Seguridad.","Progreso.","Conocimiento.","Cercanía.","Excelencia.","Transparencia.",
  "Simplicidad.","Bienestar.","Responsabilidad."
].map(l => ({ id: l, label: l }));

export const VALUE_FEEDBACK: Record<string, string> = {
  "Confianza.": "La confianza no se declara. Se construye en cada mensaje, interacción y promesa que la empresa cumple.",
  "Comunidad.": "Una comunidad aparece cuando las personas encuentran algo que comparten, no solamente algo que pueden comprar.",
  "Innovación.": "Innovar no es verse futurista. Es encontrar una forma más útil, clara o diferente de resolver un problema.",
  "Excelencia.": "La excelencia debe sentirse antes de la compra y comprobarse después de ella."
};

export const FEELINGS: Option[] = [
  "Estoy en buenas manos.","Por fin alguien me entiende.","Esto es diferente.",
  "Quiero formar parte.","Aquí está la solución que buscaba.","Esta empresa sabe lo que hace.",
  "Esto se siente creado para mí.","Quiero descubrir más.","Otra."
].map(l => ({ id: l, label: l }));

export const NEVER_LOSE = {
  q: "Aunque tu empresa creciera diez veces, ¿qué no debería perder nunca?",
  note: "Esta respuesta puede convertirse en una de las bases más importantes de la cultura de tu empresa."
};

/* PASO 7 */
export const GOALS: Option[] = [
  "Conseguir más prospectos.","Vender en línea.","Agendar citas.","Perfilar clientes.",
  "Automatizar seguimiento.","Organizar ventas.","Construir mi marca.","Renovar mi identidad.",
  "Crear una página.","Crear una tienda.","Crear landing pages.","Implementar un CRM.",
  "Lanzar publicidad.","Medir resultados.","Conectar herramientas.","Definir mejor mi proyecto.",
  "Crear un ecosistema completo."
].map(l => ({ id: l, label: l }));

export const GOAL_PRIORITY = {
  q: "Si comenzáramos por una sola prioridad, ¿cuál tendría mayor impacto?",
  note: "Sabemos que todo está conectado. Elegir una prioridad nos permite construir una primera etapa que ayude a avanzar a las demás."
};

/* PASO 8 */
export const SERVICES: Option[] = [
  "Identidad de marca.","Landing page.","Página web.","Tienda en línea.",
  "Quiz o diagnóstico interactivo.","Sistema para captar prospectos.","CRM.","Automatizaciones.",
  "Seguimiento por WhatsApp o correo.","Publicidad digital.","Producción audiovisual.",
  "Contenido para redes.","Analítica y medición.","Integración de herramientas.",
  "Ecosistema comercial completo.","Todavía necesito orientación."
].map(l => ({ id: l, label: l }));

export const COND_PAGES = { q: "¿Cuántas páginas o experiencias imaginas?",
  o: ["Una landing.","Entre dos y cinco páginas.","Entre seis y diez.","Más de diez.","Necesito que KOMVOS lo determine."] };
export const COND_PRODUCTS = { q: "¿Cuántos productos o variantes necesitas mostrar?",
  o: ["Entre 1 y 10.","Entre 11 y 50.","Entre 51 y 200.","Más de 200.","Todavía no lo sé."] };
export const COND_ROUTES = { q: "¿Cuántas rutas o perfiles diferentes imaginas?",
  o: ["Una ruta principal.","Dos o tres.","Cuatro o más.","Todavía no lo sé."] };
export const COND_AV = { q: "¿Qué producción audiovisual imaginas?",
  o: ["Fotografías.","Videos.","Reels.","Testimonios.","Animaciones.","Todavía no está definido."] };

/* PASO 9 */
export const MATERIALS: Option[] = [
  "Logo y archivos de marca.","Textos.","Fotografías.","Videos.",
  "Información de productos o servicios.","Precios.","Testimonios.","Avisos o documentos.",
  "Base de datos.","Accesos a plataformas.","Necesito producir estos materiales.","No estoy seguro."
].map(l => ({ id: l, label: l }));

export const INTEGRATIONS: Option[] = [
  "WhatsApp.","Correo.","Calendario.","CRM.","Shopify.","Pasarela de pago.",
  "Publicidad.","Base de datos.","Herramientas internas.","Todavía no lo sé."
].map(l => ({ id: l, label: l }));

export const APPROVERS = ["Una.","Dos.","Tres o más.","Todavía no está definido."];
export const FOLLOWUP = ["Yo.","Una persona responsable.","Un equipo comercial.",
  "Necesitamos construir también ese proceso.","Todavía no lo sé."];
export const COLLABORATION = [
  "Construyan todo desde cero.","Tengo una idea y necesito convertirla en un sistema.",
  "Ya tengo materiales y necesito implementación.","Tengo equipo, pero necesitamos dirección.",
  "Necesito corregir un proyecto que no está funcionando.","Todavía no estoy seguro; necesito orientación."
];

/* PASO 10 */
export const TIMING: Option[] = [
  "Inmediatamente.","En los próximos días.","Durante este mes.","En uno o dos meses.",
  "Primero quiero conocer el proceso y los costos.","Todavía estoy explorando."
].map(l => ({ id: l, label: l }));

export const INVESTMENT_RESPONSES: Option[] = [
  "Sí, está dentro de mi rango.","Podría considerarlo dependiendo de la propuesta.",
  "Necesitaría construirlo por etapas.","Primero necesito entender mejor qué incluye.",
  "En este momento busco una inversión menor.","Todavía no he definido un presupuesto."
].map(l => ({ id: l, label: l }));

/* RUTA OPCIONAL DE IDENTIDAD */
export const IDENTITY = {
  transition: "Tu proyecto todavía está escribiendo su identidad. Antes de construir páginas, anuncios o automatizaciones, queremos descubrir tres señales de su esencia.",
  q1: "¿Qué debería sentir una persona al conocer tu marca?",
  q2: "Si tu marca fuera una personalidad, ¿cómo sería?",
  q2o: ["Serena y segura.","Elegante y reservada.","Cercana y cálida.","Enérgica y atrevida.",
        "Inteligente y tecnológica.","Creativa e inesperada.","Institucional y confiable.","Natural y sencilla."],
  q3: "¿Qué universos visuales se acercan más a lo que imaginas?",
  q3o: ["Minimalista.","Corporativo.","Tecnológico.","Editorial.","Elegante.","Cálido.","Creativo.","Natural."],
  closing: "Ya identificamos una primera dirección. Esto todavía no es una identidad terminada; es el punto de partida que trabajaremos contigo en una sesión estratégica."
};

/* RETROALIMENTACIÓN ROTATIVA */
export const FEEDBACK_ROTATION = [
  "Tiene sentido que quieras comenzar por aquí.",
  "Esto indica que ya existe una base comercial, aunque todavía falta convertirla en un sistema.",
  "Estamos cada vez más cerca de entender qué necesita realmente tu siguiente etapa."
];

/* PANTALLA DE RESULTADO */
export const RESULT_SCREEN = {
  top: "Tu proyecto ya tiene una primera dirección.",
  closing: "Las metas marcan la dirección. Los sistemas hacen posible el progreso.",
  ctaPrimary: "Quiero construir esta ruta",
  ctaWhatsApp: "Hablar por WhatsApp"
};

/* AVISO LEGAL */
export const LEGAL = {
  title: "Alcance, estimaciones y privacidad",
  sections: [
    { h: "Estimaciones", t: "Los precios y tiempos mostrados son orientativos y no constituyen una cotización final. El alcance definitivo se establece después de revisar el proyecto, sus materiales, volumen, integraciones y responsables de aprobación." },
    { h: "Resultados", t: "KOMVOS no garantiza una cantidad específica de ventas, prospectos, ingresos o retorno de inversión. Construimos estructuras funcionales para captar, registrar, perfilar, medir y dar seguimiento a oportunidades. Su rendimiento depende también de la oferta, el mercado, la inversión publicitaria, la operación comercial y la optimización continua." },
    { h: "Costos posteriores", t: "Los rangos corresponden principalmente a la implementación inicial. Las plataformas, licencias, pauta publicitaria, mantenimiento, soporte, administración, producción continua y optimización mensual se cotizan por separado." },
    { h: "Privacidad", t: "Las respuestas se utilizarán para elaborar el diagnóstico, preparar una recomendación y contactar al interesado. Los datos no se mostrarán públicamente." }
  ],
  closing: "Las metas marcan la dirección. Los sistemas hacen posible el progreso."
};
