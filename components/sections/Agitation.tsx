"use client";

const FRICTIONS = [
  {
    title: "Dejar ir clientes por no responder rápido en WhatsApp.",
    description: "Cuando nadie contesta a tiempo, el cliente se va con quien sí responde.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 8v5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
        <path
          d="M10.3 4.8 3.2 17.2A2 2 0 0 0 4.9 20h14.2a2 2 0 0 0 1.7-2.8L13.7 4.8a2 2 0 0 0-3.4 0Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Tener una página web vieja que no genera confianza ni ventas.",
    description: "Si tu sitio se ve desactualizado o no carga bien en celular, pierdes prospectos.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="4.5" width="17" height="13" rx="2" />
        <path d="M8 20h8M12 17.5V20" strokeLinecap="round" />
        <path d="M8 10h.01M12 10h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Perder horas agendando citas y enviando recordatorios a mano.",
    description: "Organizar citas y mensajes uno por uno satura al equipo y genera errores.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M4 9.5h16" strokeLinecap="round" />
        <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function Agitation() {
  return (
    <section id="problemas" className="relative z-10 scroll-mt-24 py-16 md:py-24">
      <div className="section-shell">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-display text-[32px] font-semibold tracking-[-0.035em] text-[#1D1D1F] sm:text-[40px]">
            ¿Qué problemas resolvemos en tu empresa?
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {FRICTIONS.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-[#D2D2D7]/80 bg-white/90 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-150 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <span className="mb-5 inline-flex text-[#FF3B30]" aria-hidden>
                {item.icon}
              </span>
              <h3 className="font-display text-[17px] font-semibold tracking-tight text-[#1D1D1F]">
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6E6E73]">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
