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
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Evaluación de proyecto KOMVOS"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
            >
              <button
                type="button"
                onClick={closeQuiz}
                aria-label="Cerrar"
                className="absolute right-4 top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 transition-colors hover:border-cyan-400/40 hover:text-white"
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
