import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Términos y Condiciones | Komvos Marketing Studio",
  },
  description: "Términos y condiciones de uso de los servicios de Komvos Marketing Studio.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20 font-sans text-slate-800">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm md:p-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          ← Volver a Komvos
        </Link>

        <h1 className="mb-2 font-display text-3xl font-extrabold tracking-tight text-slate-900">
          Términos y Condiciones
        </h1>
        <p className="mb-8 text-xs text-slate-400">Última actualización: Septiembre de 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            Al acceder al sitio web{" "}
            <a
              href="https://www.komvos.com.mx"
              className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 hover:text-blue-600"
            >
              www.komvos.com.mx
            </a>{" "}
            o hacer uso de nuestras herramientas de agendamiento, aceptas estar sujeto a los
            siguientes Términos y Condiciones.
          </p>

          <h2 className="pt-2 text-base font-bold text-slate-900">1. Servicios Ofrecidos</h2>
          <p>
            Komvos es un estudio especializado en diseño web, desarrollo de plataformas digitales y
            automatización de atención al cliente (WhatsApp, CRM y sistemas de agendamiento). Las
            especificaciones de cada proyecto se establecen mediante propuestas particulares
            aceptadas por el cliente.
          </p>

          <h2 className="pt-2 text-base font-bold text-slate-900">2. Uso de la Herramienta de Agendamiento</h2>
          <p>
            El sistema de reserva de llamadas tiene el objetivo de coordinar sesiones informativas o
            de diagnóstico. Komvos se reserva el derecho de cancelar o reinterpretar agendas en caso
            de detectar datos falsos, inconsistentes o solicitudes de SPAM.
          </p>

          <h2 className="pt-2 text-base font-bold text-slate-900">3. Propiedad Intelectual</h2>
          <p>
            Todos los componentes visuales, logotipos, marcas, código fuente e interfaces de este
            sitio web pertenecen a Komvos Marketing Studio. Los entregables de branding y plataformas
            desarrolladas para clientes pasarán a ser propiedad del cliente según lo estipulado en su
            contrato individual.
          </p>

          <h2 className="pt-2 text-base font-bold text-slate-900">4. Limitación de Responsabilidad</h2>
          <p>
            Komvos realiza sus mejores esfuerzos para garantizar la alta disponibilidad y velocidad
            de los sitios creados; no obstante, no se responsabiliza de interrupciones ocasionadas
            por fallas de terceros (servidores de hosting externos, APIs de WhatsApp o Meta).
          </p>

          <h2 className="pt-2 text-base font-bold text-slate-900">5. Modificaciones</h2>
          <p>
            Komvos se reserva el derecho de actualizar o modificar estos términos en cualquier
            momento para adaptarlos a mejoras legislativas o de servicio.
          </p>
        </div>
      </div>
    </main>
  );
}
