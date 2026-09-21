"use client";

import { useBookingModal } from "@/components/ui/BookingModal";

function BrowserMock() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-white/15 bg-white/95 shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-white px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="ml-2 flex-1 truncate rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-400">
          www.tunegocio.com
        </span>
      </div>
      <div className="space-y-2 bg-slate-50 p-3">
        <div className="h-2.5 w-2/3 rounded-full bg-slate-200" />
        <div className="h-2 w-full rounded-full bg-slate-100" />
        <div className="h-2 w-5/6 rounded-full bg-slate-100" />
        <div className="mt-3 flex gap-2">
          <div className="h-7 flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600" />
          <div className="h-7 w-16 rounded-lg border border-slate-200 bg-white" />
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="aspect-[4/3] rounded-lg bg-slate-200/80" />
          <div className="aspect-[4/3] rounded-lg bg-slate-200/60" />
          <div className="aspect-[4/3] rounded-lg bg-slate-200/70" />
        </div>
      </div>
    </div>
  );
}

function WhatsAppMock() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B141A] shadow-lg">
      <div className="flex shrink-0 items-center gap-2 bg-[#075E54] px-3 py-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold text-white">
          K
        </span>
        <div>
          <p className="text-xs font-semibold text-white">Equipo Komvos</p>
          <p className="text-[10px] text-emerald-300">en línea</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-hidden bg-[#ECE5DD] p-3">
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] leading-relaxed text-[#1D1D1F] shadow-sm">
          ¡Hola! 👋 ¿En qué podemos ayudarte hoy?
        </div>
        <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-[#DCF8C6] px-3 py-2 text-[11px] leading-relaxed text-[#1D1D1F] shadow-sm">
          Quiero agendar una cita. ¿Qué horarios tienen?
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] leading-relaxed text-[#1D1D1F] shadow-sm">
          Claro. ¿Qué te parece el jueves a las 2:00 PM?
        </div>
      </div>
    </div>
  );
}

function NodesMock() {
  return (
    <div className="flex h-full items-center justify-center gap-3 overflow-hidden rounded-2xl border border-white/15 bg-white/90 px-4 shadow-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="3.5" y="4.5" width="17" height="12.5" rx="2" />
            <path d="M8 20h8M12 17v3" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Web</span>
      </div>

      <div className="relative flex flex-1 items-center" aria-hidden>
        <div className="h-px w-full bg-gradient-to-r from-cyan-500 to-violet-500" />
        <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-bold text-cyan-600 shadow-sm">
          →
        </span>
        <span className="absolute left-[18%] h-2 w-2 rounded-full bg-cyan-500" />
        <span className="absolute right-[18%] h-2 w-2 rounded-full bg-violet-500" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M4 7.5h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-10Z" />
            <path d="M4 7.5 12 12l8-4.5" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">CRM</span>
      </div>
    </div>
  );
}

const SERVICES = [
  {
    id: "web",
    index: "01",
    meta: "Web",
    title: "Diseño Web",
    subtitle: "Sitios que convierten",
    description: "Páginas modernas, ultra rápidas y optimizadas para celulares.",
    points: ["Diseño responsive", "Carga rápida", "CTAs a WhatsApp", "SEO local"],
    featured: false,
    headerTone: "from-slate-700 via-slate-600 to-cyan-800",
    mock: <BrowserMock />,
  },
  {
    id: "whatsapp",
    index: "02",
    meta: "WhatsApp",
    title: "WhatsApp Auto",
    subtitle: "Atención sin fricción",
    description:
      "Respuestas automáticas, captura de prospectos y agendamiento directo a Google Calendar.",
    points: ["Respuestas 24/7", "Captura de leads", "Citas automáticas", "Google Calendar"],
    featured: true,
    headerTone: "from-[#0B141A] via-[#075E54] to-[#128C7E]",
    mock: <WhatsAppMock />,
  },
  {
    id: "systems",
    index: "03",
    meta: "Sistemas",
    title: "Sistemas",
    subtitle: "Todo conectado",
    description: "Integración de herramientas para conectar toda la atención de tu negocio.",
    points: ["Flujos a medida", "Integraciones", "Atención unificada", "Escalamiento"],
    featured: false,
    headerTone: "from-indigo-900 via-slate-700 to-violet-800",
    mock: <NodesMock />,
  },
];

export function BentoServices() {
  const { openBooking } = useBookingModal();

  return (
    <section id="servicios" className="relative z-10 scroll-mt-24 py-16 md:py-24">
      <div className="section-shell">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-[32px] font-semibold tracking-[-0.035em] text-[#1D1D1F] sm:text-[40px]">
              Cómo ayudamos a tu negocio a vender y atender mejor.
            </h2>
          </div>
          <button type="button" onClick={openBooking} className="btn-secondary self-start">
            Solicitar propuesta
          </button>
        </div>

        <ul className="grid gap-6 lg:grid-cols-3 lg:gap-7">
          {SERVICES.map((service) => {
            const dark = service.featured;

            return (
              <li key={service.id}>
                <article
                  className={`service-card group ${dark ? "service-card-dark bg-[#1D1D1F]" : "bg-white"}`}
                >
                  <div
                    className={`relative h-52 shrink-0 overflow-hidden bg-gradient-to-br p-4 sm:h-56 sm:p-5 ${service.headerTone}`}
                  >
                    {service.mock}
                  </div>

                  <div className="flex flex-1 flex-col px-6 pb-7 pt-6 sm:px-7 sm:pb-8 sm:pt-7">
                    <h3
                      className={`font-display text-[1.45rem] font-bold leading-tight tracking-tight sm:text-[1.6rem] ${
                        dark ? "text-white" : "text-[#0A0A0A]"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p className={`mt-1.5 text-sm font-medium ${dark ? "text-cyan-300" : "text-cyan-700"}`}>
                      {service.subtitle}
                    </p>

                    <p className={`mt-4 text-[15px] leading-relaxed ${dark ? "text-slate-400" : "text-[#5C5C5C]"}`}>
                      {service.description}
                    </p>

                    <ul
                      className={`mt-7 space-y-3.5 border-t pt-6 ${
                        dark ? "border-white/10" : "border-slate-100"
                      }`}
                    >
                      {service.points.map((point) => (
                        <li
                          key={point}
                          className={`flex gap-3 text-sm ${dark ? "text-slate-300" : "text-[#3A3A3A]"}`}
                        >
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                            aria-hidden
                          />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={openBooking}
                      className={`mt-8 text-left text-sm font-semibold transition-colors ${
                        dark
                          ? "text-cyan-300 hover:text-cyan-200"
                          : "text-[#0A0A0A] hover:text-cyan-600"
                      }`}
                    >
                      Cuéntame de tu negocio →
                    </button>

                    <div className="mt-auto flex items-end pt-10">
                      <p className="flex items-baseline gap-2">
                        <span
                          className={`font-display text-3xl font-bold tracking-tight ${
                            dark ? "text-white" : "text-[#0A0A0A]"
                          }`}
                        >
                          {service.index}
                        </span>
                        <span className={`text-sm ${dark ? "text-slate-500" : "text-[#757575]"}`}>
                          {service.meta}
                        </span>
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
