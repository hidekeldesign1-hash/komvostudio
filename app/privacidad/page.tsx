import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    absolute: "Aviso de Privacidad | Komvos Marketing Studio",
  },
  description:
    "Aviso de privacidad y protección de datos personales de Komvos Marketing Studio.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
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
          Aviso de Privacidad
        </h1>
        <p className="mb-8 text-xs text-slate-400">Última actualización: Septiembre de 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-600">
          <p>
            En <strong>Komvos Marketing Studio</strong> (en adelante &quot;Komvos&quot;), con domicilio
            operativo en México y sitio web oficial{" "}
            <a
              href="https://www.komvos.com.mx"
              className="font-medium text-slate-800 underline decoration-slate-300 underline-offset-2 hover:text-blue-600"
            >
              www.komvos.com.mx
            </a>
            , nos comprometemos a proteger la privacidad y el uso adecuado de los datos personales de
            nuestros usuarios y clientes.
          </p>

          <h2 className="pt-2 text-base font-bold text-slate-900">1. Datos Personales que Recopilamos</h2>
          <p>
            Para la atención comercial, agendamiento de llamadas y servicios de desarrollo web y
            automatización, recabamos:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nombre completo o de la empresa.</li>
            <li>Número de teléfono / WhatsApp.</li>
            <li>Correo electrónico.</li>
            <li>
              Información relevante sobre el proyecto o negocio compartida en nuestros cuestionarios.
            </li>
          </ul>

          <h2 className="pt-2 text-base font-bold text-slate-900">2. Finalidad del Uso de Datos</h2>
          <p>Los datos recabados serán utilizados exclusivamente para:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Contactarte en la fecha y hora seleccionada para tu llamada estratégica.</li>
            <li>Enviar propuestas comerciales, diagnósticos digitales o cotizaciones solicitadas.</li>
            <li>
              Coordinar el desarrollo de proyectos web e integración de sistemas contratados.
            </li>
            <li>
              No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines
              publicitarios ajenos a Komvos.
            </li>
          </ul>

          <h2 className="pt-2 text-base font-bold text-slate-900">3. Derechos ARCO</h2>
          <p>
            Tienes derecho a conocer, rectificar, cancelar u oponerte (Derechos ARCO) al tratamiento
            de tus datos personales en cualquier momento. Para ejercer estos derechos, basta con
            enviar un mensaje de WhatsApp o correo a través de las líneas oficiales publicadas en
            nuestro sitio web.
          </p>

          <h2 className="pt-2 text-base font-bold text-slate-900">4. Cookies y Tecnologías de Rastreo</h2>
          <p>
            Nuestro sitio utiliza cookies técnicas indispensables para el funcionamiento dinámico del
            agendador, análisis de rendimiento y medición anónima de campañas publicitarias.
          </p>
        </div>
      </div>
    </main>
  );
}
