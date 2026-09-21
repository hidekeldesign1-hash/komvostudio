"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { AnimatePresence, motion } from "framer-motion";

type BookingModalContextValue = {
  isBookingOpen: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal debe usarse dentro de BookingModalProvider");
  }
  return ctx;
}

const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"] as const;
const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

const RATE_LIMIT_KEY = "komvos_agenda_submits";
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MESSAGE =
  "⚠️ Alcanzaste el límite de 3 solicitudes por seguridad. Por favor intenta de nuevo en 15 minutos o escríbenos directamente por WhatsApp.";

type DayOption = {
  key: string;
  weekday: string;
  dayNumber: string;
  fullLabel: string;
  date: Date;
};

function formatMxPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}

function nameHasLink(value: string) {
  return /https?:\/\/|www\./i.test(value);
}

function readSubmitTimestamps(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { timestamps?: number[] };
    const now = Date.now();
    return (Array.isArray(parsed.timestamps) ? parsed.timestamps : []).filter(
      (ts) => typeof ts === "number" && now - ts < RATE_LIMIT_WINDOW_MS,
    );
  } catch {
    return [];
  }
}

function isRateLimited(): boolean {
  return readSubmitTimestamps().length >= RATE_LIMIT_MAX;
}

function recordSubmitAttempt() {
  if (typeof window === "undefined") return;
  const timestamps = [...readSubmitTimestamps(), Date.now()];
  window.localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ timestamps }));
}

function nextBusinessDays(count = 7): DayOption[] {
  const days: DayOption[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);

  while (days.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const weekday = cursor.getDay();
    if (weekday === 0 || weekday === 6) continue;

    const dayNumber = String(cursor.getDate()).padStart(2, "0");
    const weekdayLabel = DAY_LABELS[weekday];
    const month = cursor.toLocaleDateString("es-MX", { month: "long" });
    days.push({
      key: cursor.toISOString().slice(0, 10),
      weekday: weekdayLabel,
      dayNumber,
      fullLabel: `${weekdayLabel} ${dayNumber} de ${month}`,
      date: new Date(cursor),
    });
  }

  return days;
}

function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const days = useMemo(() => nextBusinessDays(7), []);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formData, setFormData] = useState({ honeypot: "" });
  const [error, setError] = useState("");
  const [rateLimited, setRateLimited] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const selectedDayOption = useMemo(
    () => days.find((item) => item.key === selectedDay) || null,
    [days, selectedDay],
  );

  const businessWhatsAppUrl = useMemo(() => {
    const businessNumber =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "525532584558";
    return `https://wa.me/${businessNumber}`;
  }, []);

  useEffect(() => {
    if (!open) return;
    setSelectedDay(days[0]?.key || "");
    setSelectedTime("");
    setName("");
    setPhone("");
    setFormData({ honeypot: "" });
    setError("");
    setStatus("idle");
    setOccupiedSlots([]);
    setRateLimited(isRateLimited());
  }, [open, days]);

  useEffect(() => {
    if (!open || !selectedDayOption) return;

    let cancelled = false;
    setLoadingSlots(true);
    setSelectedTime("");

    const dia = encodeURIComponent(selectedDayOption.fullLabel);
    const diaKey = encodeURIComponent(selectedDayOption.key);
    fetch(`/api/agenda?dia=${dia}&diaKey=${diaKey}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json().catch(() => ({}))) as {
          occupied?: string[];
          error?: string;
        };
        if (cancelled) return;
        if (!response.ok) {
          setOccupiedSlots([]);
          return;
        }
        setOccupiedSlots(Array.isArray(data.occupied) ? data.occupied : []);
      })
      .catch(() => {
        if (!cancelled) setOccupiedSlots([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, selectedDayOption]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleSubmit = async () => {
    if (isRateLimited()) {
      setRateLimited(true);
      setError(RATE_LIMIT_MESSAGE);
      return;
    }

    const digits = phone.replace(/\D/g, "");
    const day = selectedDayOption;
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Escribe tu nombre completo.");
      return;
    }
    if (nameHasLink(trimmedName)) {
      setError("El nombre no puede contener enlaces.");
      return;
    }
    if (digits.length < 10) {
      setError("Tu WhatsApp debe tener al menos 10 dígitos.");
      return;
    }
    if (!day || !selectedTime) {
      setError("Selecciona día y horario para continuar.");
      return;
    }
    if (occupiedSlots.includes(selectedTime)) {
      setError("Ese horario ya está reservado. Elige otro.");
      return;
    }

    setError("");

    // Honeypot lleno → éxito falso, no guardar en Sheets
    if (formData.honeypot.trim()) {
      recordSubmitAttempt();
      setRateLimited(isRateLimited());
      setStatus("sent");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: trimmedName,
          whatsapp: formatMxPhone(phone),
          dia: day.fullLabel,
          diaKey: day.key,
          horario: selectedTime,
          website_url: formData.honeypot,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        setError(data.error || "No pudimos guardar tu solicitud. Intenta de nuevo.");
        setStatus("idle");
        if (response.status === 409) {
          setOccupiedSlots((prev) =>
            prev.includes(selectedTime) ? prev : [...prev, selectedTime],
          );
          setSelectedTime("");
        }
        return;
      }
      recordSubmitAttempt();
      setRateLimited(isRateLimited());
      setOccupiedSlots((prev) =>
        prev.includes(selectedTime) ? prev : [...prev, selectedTime],
      );
      setStatus("sent");
    } catch {
      setError("No pudimos guardar tu solicitud. Intenta de nuevo.");
      setStatus("idle");
    }
  };

  const isSubmitted = status === "sent";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Cerrar agendar llamada"
            className="absolute inset-0 bg-black/80"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Agendar llamada KOMVOS"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.32, ease: [0.19, 1, 0.22, 1] }}
            className="relative z-10 max-h-[min(92dvh,820px)] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25)] backdrop-blur-2xl md:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-indigo-300 hover:text-slate-900"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="pr-10">
              {isSubmitted ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-600">
                    Confirmación de reserva
                  </p>
                  <h2 className="mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                    ¡Todo listo para tu llamada!
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Guardamos tu espacio en nuestra agenda.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
                    Agendar llamada
                  </p>
                  <h2 className="mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                    Elige día y horario
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Deja tu número y te contactamos en el horario que elijas.
                  </p>
                </>
              )}
            </div>

            {isSubmitted ? (
              <div className="mt-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_8px_24px_rgba(37,99,235,0.35)]">
                  <svg
                    className="h-7 w-7 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>

                <p className="mt-5 text-base leading-relaxed text-slate-700">
                  Hola <span className="font-semibold text-slate-900">{name.trim()}</span>, recibimos tu
                  solicitud correctamente.
                </p>

                <div className="my-4 rounded-2xl border border-slate-200 bg-slate-100/80 p-4 text-left text-sm font-medium text-slate-800 space-y-2">
                  <p>
                    <span aria-hidden>📅</span>{" "}
                    <span className="text-slate-500">Fecha:</span>{" "}
                    {selectedDayOption?.fullLabel || "—"}
                  </p>
                  <p>
                    <span aria-hidden>⏰</span>{" "}
                    <span className="text-slate-500">Horario:</span> {selectedTime || "—"}
                  </p>
                </div>

                <p className="text-xs text-slate-500">
                  Un especialista de Komvos te contactará puntualmente en el horario elegido.
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:opacity-95"
                >
                  Cerrar ventana
                </button>
              </div>
            ) : (
            <div>
            <div className="mt-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Próximos días hábiles
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {days.map((day) => {
                  const active = selectedDay === day.key;
                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => setSelectedDay(day.key)}
                      className={`min-w-[72px] shrink-0 rounded-2xl border px-3 py-3 text-center transition-all duration-200 ${
                        active
                          ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.28)]"
                          : "border-slate-200 bg-slate-100/80 text-slate-800 hover:bg-slate-200/60"
                      }`}
                    >
                      <span className="block text-[10px] font-semibold tracking-[0.14em]">
                        {day.weekday}
                      </span>
                      <span className="mt-1 block text-lg font-bold leading-none">
                        {day.dayNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Horarios disponibles
                {loadingSlots ? " · cargando…" : ""}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const occupied = occupiedSlots.includes(slot);
                  const active = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={occupied || loadingSlots}
                      onClick={() => {
                        if (!occupied) setSelectedTime(slot);
                      }}
                      className={`rounded-xl border px-3 py-2 text-center text-sm transition-all ${
                        occupied
                          ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 line-through"
                          : active
                            ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.28)]"
                            : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                      aria-disabled={occupied}
                      title={occupied ? "Horario ocupado" : undefined}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {occupiedSlots.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">
                  Los horarios tachados ya están reservados.
                </p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <div>
                <label
                  htmlFor="booking-name"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  Nombre completo
                </label>
                <input
                  id="booking-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label
                  htmlFor="booking-phone"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  WhatsApp / Teléfono
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={12}
                  value={phone}
                  onChange={(event) => setPhone(formatMxPhone(event.target.value))}
                  className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="55 0000 0000"
                />
              </div>
              <div className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                <label htmlFor="booking-website-url">Sitio web</label>
                <input
                  id="booking-website-url"
                  type="text"
                  name="website_url"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                />
              </div>
            </div>

            {rateLimited && (
              <div
                className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900"
                role="alert"
              >
                <p>{RATE_LIMIT_MESSAGE}</p>
                <a
                  href={businessWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex font-semibold text-emerald-700 underline-offset-2 hover:underline"
                >
                  Escribir por WhatsApp
                </a>
              </div>
            )}

            {error && !rateLimited && (
              <p className="mt-3 text-sm text-rose-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "sending" || rateLimited}
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? "Enviando..." : "Enviar solicitud"}
            </button>
            </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BookingModalProvider({ children }: PropsWithChildren) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const openBooking = useCallback(() => setIsBookingOpen(true), []);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);
  const value = useMemo(
    () => ({ isBookingOpen, openBooking, closeBooking }),
    [isBookingOpen, openBooking, closeBooking],
  );

  return (
    <BookingModalContext.Provider value={value}>
      {children}
      <BookingModal open={isBookingOpen} onClose={closeBooking} />
    </BookingModalContext.Provider>
  );
}
