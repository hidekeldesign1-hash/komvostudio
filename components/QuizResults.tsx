"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { PulseButton } from "@/components/ui/PulseButton";
import { useBookingModal } from "@/components/ui/BookingModal";

export type SimplifiedQuizAnswers = {
  category?: string;
  category_other?: string;
  business_stage?: string;
  existing_assets?: string[];
  /** Prioridades elegidas por la persona (múltiples). */
  selected_goals?: string[];
  /** Prioridad principal recomendada por KOMVOS a partir de selected_goals. */
  main_goal?: string;
  desired_start?: string;
};

type RouteStep = {
  label: string;
  title: string;
  description: string;
};

const ROUTES: Record<string, RouteStep[]> = {
  "Captar más prospectos": [
    { label: "Paso 1", title: "Diagnóstico y diseño", description: "Definimos audiencia, oferta y la ruta de conversión." },
    { label: "Paso 2", title: "Desarrollo del funnel", description: "Construimos los puntos de captura y seguimiento." },
    { label: "Paso 3", title: "Activación", description: "Conectamos canales, medición y primeras oportunidades." },
  ],
  "Web/Landing de Alta Conversión": [
    { label: "Paso 1", title: "Arquitectura y diseño", description: "Ordenamos mensaje, contenido y recorrido del usuario." },
    { label: "Paso 2", title: "Desarrollo web", description: "Construimos una experiencia rápida y orientada a conversión." },
    { label: "Paso 3", title: "Activación", description: "Publicamos, medimos y optimizamos los puntos clave." },
  ],
  "Automatización y CRM": [
    { label: "Paso 1", title: "Mapa operativo", description: "Detectamos entradas, responsables y tareas repetitivas." },
    { label: "Paso 2", title: "Implementación", description: "Configuramos CRM, automatizaciones e integraciones." },
    { label: "Paso 3", title: "Activación", description: "Probamos el flujo y preparamos al equipo para operarlo." },
  ],
  "Renovar Marca/Identidad": [
    { label: "Paso 1", title: "Diagnóstico de marca", description: "Aterrizamos posición, personalidad y dirección visual." },
    { label: "Paso 2", title: "Diseño del sistema", description: "Creamos una identidad coherente y lista para crecer." },
    { label: "Paso 3", title: "Activación", description: "Aplicamos la nueva marca en sus puntos de contacto clave." },
  ],
  "Ecosistema Completo": [
    { label: "Paso 1", title: "Diagnóstico y estrategia", description: "Priorizamos marca, captación, operación y medición." },
    { label: "Paso 2", title: "Desarrollo del ecosistema", description: "Construimos y conectamos las piezas en una sola ruta." },
    { label: "Paso 3", title: "Activación", description: "Lanzamos por etapas y dejamos una base medible." },
  ],
};

const DEFAULT_ROUTE = ROUTES["Ecosistema Completo"];

export function QuizResults({
  projectName,
  fullName,
  answers,
  onBack,
}: {
  projectName: string;
  fullName: string;
  answers: SimplifiedQuizAnswers;
  onBack?: () => void;
}) {
  const { openBooking } = useBookingModal();
  const selectedGoals = answers.selected_goals?.length
    ? answers.selected_goals
    : answers.main_goal
      ? [answers.main_goal]
      : [];
  const recommendedGoal = answers.main_goal || selectedGoals[0] || "";
  const route = ROUTES[recommendedGoal] || DEFAULT_ROUTE;
  const categoryLabel =
    answers.category === "Otro" && answers.category_other?.trim()
      ? answers.category_other.trim()
      : answers.category || "Por definir";
  const assets = answers.existing_assets?.join(", ") || "Sin activos registrados";
  const goalsLabel = selectedGoals.join(", ") || "Por definir";
  const summary = [
    `Diagnóstico KOMVOS para ${projectName}`,
    `Categoría: ${categoryLabel}`,
    `Estado: ${answers.business_stage || "Por definir"}`,
    `Ecosistema actual: ${assets}`,
    `Prioridades: ${goalsLabel}`,
    `Prioridad recomendada: ${recommendedGoal || "Por definir"}`,
    `Inicio: ${answers.desired_start || "Por definir"}`,
  ].join("\n");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "525532584558";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hola, soy ${fullName}. Completé mi diagnóstico para ${projectName}.\n\n${summary}\n\nQuiero revisar esta ruta con KOMVOS.`,
  )}`;

  const openWhatsApp = () => {
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.section
      className="k-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
    >
      {onBack && (
        <button type="button" className="k-back" onClick={onBack}>
          <span aria-hidden>←</span> Regresar
        </button>
      )}
      <header className="k-results-header">
        <span>Diagnóstico completado</span>
        <h1>Diagnóstico del Sistema Digital para {projectName}</h1>
      </header>

      <GlassCard className="k-result-card" contentClassName="k-result-card-content">
        <p className="k-result-label">Lo que entendimos de tu proyecto</p>
        <dl className="k-summary-grid">
          <div><dt>Categoría</dt><dd>{categoryLabel}</dd></div>
          <div><dt>Estado</dt><dd>{answers.business_stage}</dd></div>
          <div>
            <dt>Prioridades</dt>
            <dd>{goalsLabel}</dd>
          </div>
        </dl>
        {recommendedGoal && (
          <p className="k-priority-rec">
            <span>Prioridad recomendada</span>
            {recommendedGoal}
          </p>
        )}
      </GlassCard>

      <div className="k-route-section">
        <div className="k-route-heading">
          <span>Ruta recomendada</span>
          <h2>Tu Ruta de Implementación KOMVOS</h2>
          {recommendedGoal && (
            <p className="k-route-focus">Enfocada en: {recommendedGoal}</p>
          )}
        </div>
        <div className="k-route-cards">
          {route.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 + index * 0.08 }}
            >
              <GlassCard className="k-route-card" contentClassName="k-route-card-content">
                <span>{step.label}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="k-result-actions">
        <PulseButton
          variant="primary"
          className="k-booking-button"
          onClick={openBooking}
        >
          Agendar Sesión Estratégica
        </PulseButton>
        <PulseButton
          variant="glass"
          className="k-whatsapp-button"
          onClick={openWhatsApp}
        >
          Enviar Diagnóstico por WhatsApp
        </PulseButton>
      </div>
    </motion.section>
  );
}
