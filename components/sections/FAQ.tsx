"use client";

import { useState } from "react";

const FAQS = [
  {
    question: "¿Cuánto tiempo tarda en estar lista mi página web?",
    answer:
      "Somos ultra rápidos. Una Landing Page enfocada en ventas puede estar lista y publicada en solo 24 a 48 horas. Para proyectos más completos o sistemas con automatizaciones de WhatsApp y Google Calendar, el proceso toma entre 1 y 2 semanas, incluyendo 1 mes completo de seguimiento y acompañamiento para asegurarnos de que todo funcione perfecto.",
  },
  {
    question: "¿Cómo funciona el esquema de inversión y qué incluye?",
    answer:
      "Ofrecemos tarifas claras según el nivel de tu negocio. Todos los proyectos incluyen el diseño web profesional, optimización para celulares, conexión a WhatsApp y 1 mes completo de soporte, ajustes y seguimiento para garantizar que recibas prospectos reales.",
  },
  {
    question: "¿Necesito tener listas las fotos, logos y textos antes de contratar?",
    answer:
      "No te preocupes si no tienes nada. Nosotros nos encargamos de redactar los mensajes comerciales de venta, estructurar tu oferta y seleccionar imágenes y recursos gráficos de alta calidad para que no tengas que perder tiempo preparando documentos.",
  },
  {
    question: "¿Cómo funcionan las automatizaciones de WhatsApp y agenda?",
    answer:
      "Conectamos tu sitio para que cuando un cliente pida información en la web, reciba atención inmediata por WhatsApp, resuelva sus dudas frecuentes y pueda agendar una cita directamente en tu Google Calendar sin que tengas que responder manualmente cada mensaje.",
  },
  {
    question: "¿Puedo editar o modificar el contenido de mi página después?",
    answer:
      "¡Totalmente! Te entregamos una plataforma ágil y fácil de gestionar para que puedas actualizar textos, precios o servicios cuando lo necesites. Además, cuentas con nuestro respaldo técnico siempre que lo requieras.",
  },
  {
    question: "¿Funciona para mi tipo de negocio?",
    answer:
      "Sí. Diseñamos soluciones para clínicas, consultorios, despachos, restaurantes, inmobiliarias, gimnasios, escuelas, profesionales independientes y empresas de servicios. Si tu negocio necesita recibir clientes y agendar citas, Komvos es para ti.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative z-10 scroll-mt-24 py-12 md:py-16">
      <div className="section-shell">
        <div className="grid gap-10 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:grid-cols-12 lg:gap-14 lg:p-10">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-[#090D16] sm:text-4xl">
              Resolvemos tus dudas antes de avanzar.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Entregas express, planes claros y 1 mes de acompañamiento: lo esencial para decidir con confianza.
            </p>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-slate-200/80 border-y border-slate-200/80">
              {FAQS.map((item, index) => {
                const open = openIndex === index;
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenIndex(open ? -1 : index)}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span className="font-display text-base font-semibold tracking-tight text-[#090D16] sm:text-lg">
                        {item.question}
                      </span>
                      <span
                        className={`mt-1 text-slate-400 transition-transform ${open ? "rotate-45" : ""}`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    {open && (
                      <p className="pb-5 pr-10 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
