"use client";

const INTEGRATIONS = [
  {
    name: "WhatsApp Business",
    hint: "Atención instantánea",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.97.57 3.8 1.56 5.36L2 22l4.97-1.63a9.86 9.86 0 0 0 5.07 1.38h.01c5.46 0 9.89-4.4 9.89-9.84S17.5 2 12.04 2Zm5.76 14.01c-.24.68-1.4 1.24-1.93 1.32-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.78-4.16-4.93-4.35-.14-.2-1.18-1.57-1.18-3 0-1.42.74-2.12 1-2.41.26-.29.57-.36.76-.36h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.2-.15.32-.3.49-.14.17-.31.38-.44.51-.14.14-.29.29-.12.56.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.2.7-.81.89-1.09.19-.28.38-.23.64-.14.26.1 1.66.78 1.95.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
      </svg>
    ),
  },
  {
    name: "Google Calendar",
    hint: "Citas automáticas",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M3.5 10h17" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Google Search / Maps",
    hint: "Presencia local",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "CRM & Correo",
    hint: "Captura de prospectos",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M4 7.5h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-10Z" />
        <path d="M4 7.5 12 12l8-4.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Pasarelas de Pago",
    hint: "Cobros directos",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 14h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Infraestructura Cloud",
    hint: "Velocidad 99.9%",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path
          d="M7.5 17.5h9.2a3.8 3.8 0 0 0 .5-7.58 5 5 0 0 0-9.55-1.2A3.6 3.6 0 0 0 7.5 17.5Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function IntegrationPill({
  name,
  hint,
  icon,
}: (typeof INTEGRATIONS)[number]) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xl">
      <span className="text-slate-500">{icon}</span>
      <span className="whitespace-nowrap">
        {name}
        <span className="font-medium text-slate-400"> · {hint}</span>
      </span>
    </div>
  );
}

export function TrustBanner() {
  return (
    <section className="relative z-10 border-y border-slate-200/80 bg-white/60 py-10 backdrop-blur-md md:py-12">
      <div className="section-shell mb-6">
        <h2 className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
          Conectamos tu negocio con las herramientas que ya utilizas
        </h2>
      </div>

      <div className="trust-marquee overflow-hidden" aria-label="Integraciones">
        <div className="trust-marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex items-center gap-4 pr-4 md:gap-6 md:pr-6"
              aria-hidden={copy === 1}
            >
              {INTEGRATIONS.map((item) => (
                <li key={`${copy}-${item.name}`}>
                  <IntegrationPill {...item} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
