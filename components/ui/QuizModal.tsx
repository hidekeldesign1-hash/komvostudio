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
import QuizExperience from "@/components/QuizExperience";
import { HeroCanvas } from "@/components/HeroCanvas";
import "@/app/quiz.css";

type QuizModalContextValue = {
  isOpen: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
};

const QuizModalContext = createContext<QuizModalContextValue | null>(null);

export function useQuizModal() {
  const ctx = useContext(QuizModalContext);
  if (!ctx) {
    throw new Error("useQuizModal debe usarse dentro de QuizModalProvider");
  }
  return ctx;
}

export function QuizModalProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);

  const openQuiz = useCallback(() => setIsOpen(true), []);
  const closeQuiz = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeQuiz();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeQuiz]);

  const value = useMemo(
    () => ({ isOpen, openQuiz, closeQuiz }),
    [isOpen, openQuiz, closeQuiz],
  );

  return (
    <QuizModalContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <button
              type="button"
              aria-label="Cerrar evaluación"
              className="absolute inset-0 bg-black"
              onClick={closeQuiz}
            />
            <HeroCanvas />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(6,182,212,0.12),transparent_32%),radial-gradient(circle_at_62%_55%,rgba(37,99,235,0.1),transparent_38%)]"
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Evaluación de proyecto KOMVOS"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-400/60 bg-[#cbd1da] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.28)]"
            >
              <button
                type="button"
                onClick={closeQuiz}
                aria-label="Cerrar"
                className="absolute right-4 top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition-colors hover:border-indigo-300 hover:bg-white hover:text-slate-900"
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
              <div className="quiz-shell">
                <QuizExperience />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </QuizModalContext.Provider>
  );
}
