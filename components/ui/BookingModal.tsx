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
const TIME_SLOTS = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

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
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelectedDay(days[0]?.key || "");
    setSelectedTime("");
    setName("");
    setPhone("");
    setError("");
  }, [open, days]);

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

  const handleSendWhatsApp = () => {
    const digits = phone.replace(/\D/g, "");
    const day = days.find((item) => item.key === selectedDay);

    if (name.trim().length < 2) {
      setError("Escribe tu nombre completo.");
      return;
    }
    if (digits.length !== 10) {
      setError("Tu WhatsApp debe tener exactamente 10 dígitos.");
      return;
    }
    if (!day || !selectedTime) {
      setError("Selecciona día y horario para continuar.");
      return;
    }

    setError("");
    const komvosPhone =
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "525532584558";
    const message = [
      "¡Hola Komvos! 👋 Me gustaría agendar una llamada estratégica.",
      "",
      `👤 Nombre: ${name.trim()}`,
      `📱 WhatsApp: ${formatMxPhone(phone)}`,
      `📅 Día seleccionado: ${day.fullLabel}`,
      `⏰ Horario: ${selectedTime}`,
      "",
      "Quedo atento a su confirmación.",
    ].join("\n");

    window.open(
      `https://wa.me/${komvosPhone}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    onClose();
  };

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
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600">
                Agendar llamada
              </p>
              <h2 className="mt-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                Elige día y horario
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Selecciona un espacio y te confirmamos por WhatsApp.
              </p>
            </div>

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
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-xl border px-3 py-2 text-center text-sm transition-all ${
                        active
                          ? "border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.28)]"
                          : "border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
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
            </div>

            {error && (
              <p className="mt-3 text-sm text-rose-600" role="alert">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)] transition hover:opacity-95"
            >
              Confirmar por WhatsApp
            </button>
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
