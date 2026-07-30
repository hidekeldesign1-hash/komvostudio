"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LiquidConnect } from "@/components/ui/LiquidConnect";
import { PulseButton } from "@/components/ui/PulseButton";

const TIPO_NEGOCIO = [
  "Servicios profesionales",
  "Negocio local",
  "Marca personal",
  "Otro",
] as const;

const MEJORAR = [
  "Verme más profesional en internet",
  "Conseguir más clientes",
  "Mejorar mi página web",
  "Ordenar mi marketing",
] as const;

const PRESUPUESTO = [
  "Sí, ya tengo un presupuesto definido",
  "Sí, pero necesito orientación",
  "Aún no, solo estoy explorando",
] as const;

export type AgendaFormData = {
  nombre: string;
  whatsapp: string;
  tipo_negocio: string;
  mejorar: string;
  presupuesto: string;
  fecha_hora: string;
};

const initialForm: AgendaFormData = {
  nombre: "",
  whatsapp: "",
  tipo_negocio: "",
  mejorar: "",
  presupuesto: "",
  fecha_hora: "",
};

type AgendaModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AgendaModal({ open, onClose }: AgendaModalProps) {
  const [form, setForm] = useState<AgendaFormData>(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof AgendaFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "No se pudo enviar. Intenta de nuevo.");
        return;
      }
      setSent(true);
      setForm(initialForm);
    } catch (err) {
      setError("No se pudo enviar. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setSent(false);
      setError(null);
      setForm(initialForm);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg"
              role="dialog"
              aria-modal="true"
              aria-labelledby="agenda-modal-title"
            >
            <GlassCard className="max-h-[90vh] shadow-2xl">
            <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <h2 id="agenda-modal-title" className="text-xl font-bold text-foreground sm:text-2xl">
                Agendar llamada
              </h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={sending}
                className="rounded-full p-2 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
                aria-label="Cerrar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {sent ? (
              <div className="py-8 text-center">
                <p className="text-lg font-medium text-foreground">
                  Listo, recibimos tus datos.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Te contactaremos pronto para confirmar la llamada.
                </p>
                <PulseButton
                  type="button"
                  onClick={handleClose}
                  variant="primary"
                  className="mt-6 px-6 py-2.5 text-sm font-medium"
                >
                  Cerrar
                </PulseButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* 1. Nombre */}
                <div>
                  <label htmlFor="agenda-nombre" className="block text-sm font-medium text-foreground">
                    ¿Cuál es tu nombre?
                  </label>
                  <input
                    id="agenda-nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Tu nombre"
                  />
                </div>

                {/* 2. WhatsApp */}
                <div>
                  <label htmlFor="agenda-whatsapp" className="block text-sm font-medium text-foreground">
                    ¿A qué número podemos contactarte?
                  </label>
                  <input
                    id="agenda-whatsapp"
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                    placeholder="Ej: 52 55 1234 5678"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Solo para confirmar la llamada.</p>
                </div>

                {/* 3. Tipo de negocio */}
                <LiquidConnect
                  active={Boolean(form.tipo_negocio)}
                  connectionId="agenda-tipo"
                >
                  <label htmlFor="agenda-tipo" className="block text-sm font-medium text-foreground">
                    ¿Qué tipo de negocio tienes?
                  </label>
                  <select
                    id="agenda-tipo"
                    required
                    value={form.tipo_negocio}
                    onChange={(e) => handleChange("tipo_negocio", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Elige una opción</option>
                    {TIPO_NEGOCIO.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </LiquidConnect>

                {/* 4. Qué busca mejorar */}
                <LiquidConnect
                  active={Boolean(form.mejorar)}
                  connectionId="agenda-mejorar"
                >
                  <label htmlFor="agenda-mejorar" className="block text-sm font-medium text-foreground">
                    ¿Qué te gustaría mejorar principalmente?
                  </label>
                  <select
                    id="agenda-mejorar"
                    required
                    value={form.mejorar}
                    onChange={(e) => handleChange("mejorar", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Elige una opción</option>
                    {MEJORAR.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </LiquidConnect>

                {/* 5. Presupuesto */}
                <LiquidConnect
                  active={Boolean(form.presupuesto)}
                  connectionId="agenda-presupuesto"
                >
                  <label htmlFor="agenda-presupuesto" className="block text-sm font-medium text-foreground">
                    Para trabajar en tu presencia digital, ¿cuentas con presupuesto?
                  </label>
                  <select
                    id="agenda-presupuesto"
                    required
                    value={form.presupuesto}
                    onChange={(e) => handleChange("presupuesto", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="">Elige una opción</option>
                    {PRESUPUESTO.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </LiquidConnect>

                {/* 6. Día y horario */}
                <div>
                  <label htmlFor="agenda-fecha" className="block text-sm font-medium text-foreground">
                    ¿Qué día y horario te funciona mejor para una llamada?
                  </label>
                  <input
                    id="agenda-fecha"
                    type="datetime-local"
                    required
                    value={form.fecha_hora}
                    onChange={(e) => handleChange("fecha_hora", e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={sending}
                    className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-medium text-foreground hover:bg-surface-elevated disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <PulseButton
                    type="submit"
                    disabled={sending}
                    variant="primary"
                    className="px-6 py-2.5 text-sm font-medium"
                  >
                    {sending ? "Enviando…" : "Enviar"}
                  </PulseButton>
                </div>
              </form>
            )}
            </div>
            </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
