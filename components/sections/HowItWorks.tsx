"use client";

const STEPS = [
  {
    number: "01",
    title: "Diagnóstico",
    description: "Entendemos tu operación, tus cuellos de botella y la oportunidad más clara de digitalizar.",
  },
  {
    number: "02",
    title: "Implementación",
    description: "Construimos tu web, mensajes y puntos de contacto para que captar clientes sea más simple.",
  },
  {
    number: "03",
    title: "Automatización & Escalamiento",
    description: "Activamos WhatsApp, agenda y seguimiento para atender 24/7 y crecer con orden.",
  },
];

export function HowItWorks() {
  return (
    <section id="proceso" className="relative z-10 scroll-mt-24 py-12 md:py-16">
      <div className="section-shell">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#090D16] sm:text-4xl">
            Cómo trabajamos contigo.
          </h2>
        </div>

        <ol className="grid gap-4 lg:grid-cols-3">
          {STEPS.map((step, index) => (
            <li
              key={step.number}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-md"
            >
              <span
                className="pointer-events-none absolute -left-2 -top-4 font-mono text-5xl font-extrabold text-cyan-500/20"
                aria-hidden
              >
                {step.number}
              </span>
              <div className="relative pt-8">
                <h3 className="font-display text-xl font-semibold tracking-tight text-[#090D16]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
              </div>
              {index < STEPS.length - 1 && (
                <span
                  className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-cyan-500 lg:block"
                  aria-hidden
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
