"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as D from "@/lib/quizData";
import {
  QuizResults,
  type SimplifiedQuizAnswers,
} from "@/components/QuizResults";
import { GlassCard } from "@/components/ui/GlassCard";

type Phase = "cover" | "lead" | "quiz" | "result";
type Lead = {
  project_name: string;
  full_name: string;
  cc: string;
  phone: string;
  email: string;
  terms: boolean;
  hp: string;
};

const LS_KEY = "komvos_quiz_simple_v2";
const TOTAL_QUESTIONS = D.QUESTIONS.length;
const sceneMotion = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.36, ease: [0.19, 1, 0.22, 1] },
};

const EMPTY_LEAD: Lead = {
  project_name: "",
  full_name: "",
  cc: "+52",
  phone: "",
  email: "",
  terms: false,
  hp: "",
};

function formatMxPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}

export default function QuizExperience() {
  const [phase, setPhase] = useState<Phase>("cover");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<SimplifiedQuizAnswers>({});
  const [lead, setLead] = useState<Lead>(EMPTY_LEAD);
  const [leadId, setLeadId] = useState("");
  const [leadError, setLeadError] = useState("");
  const [sending, setSending] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(
    (patch: Partial<{
      phase: Phase;
      index: number;
      answers: SimplifiedQuizAnswers;
      lead: Lead;
      leadId: string;
    }>) => {
      try {
        const current = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
        localStorage.setItem(LS_KEY, JSON.stringify({ ...current, ...patch }));
      } catch {}
    },
    [],
  );

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      if (!saved.leadId) return;
      setLeadId(saved.leadId);
      setLead(saved.lead || EMPTY_LEAD);
      setAnswers(saved.answers || {});
      setIndex(Math.min(Number(saved.index) || 0, TOTAL_QUESTIONS - 1));
      // El resultado se vuelve a construir localmente; no depende de una API.
      setPhase(saved.phase === "result" ? "result" : "quiz");
    } catch {}
  }, []);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const progress =
    phase === "result"
      ? 100
      : phase === "quiz"
        ? Math.round(((index + 1) / TOTAL_QUESTIONS) * 100)
        : 0;

  const question = D.QUESTIONS[index];

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      if (stageRef.current) stageRef.current.scrollTop = 0;
    });
  };

  const saveProgress = useCallback(
    (
      nextAnswers: SimplifiedQuizAnswers,
      extra: { status?: string; percentage?: number; step?: string } = {},
    ) => {
      if (!leadId) return;
      fetch("/api/leads/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          status: extra.status || "En progreso",
          completion_percentage: extra.percentage ?? progress,
          last_step: extra.step || question?.id,
          answers: nextAnswers,
        }),
      }).catch(() => {});
    },
    [leadId, progress, question?.id],
  );

  const completeQuiz = (finalAnswers: SimplifiedQuizAnswers) => {
    setAnswers(finalAnswers);
    setPhase("result");
    persist({ answers: finalAnswers, phase: "result", index });
    saveProgress(finalAnswers, {
      status: "Quiz completado",
      percentage: 100,
      step: "result",
    });
    scrollToTop();
  };

  const chooseSingle = (
    key: "category" | "business_stage" | "desired_start",
    value: string,
  ) => {
    if (advancing) return;

    // "Otro" en categoría: pedir detalle breve y no avanzar solos.
    if (key === "category" && value === "Otro") {
      const nextAnswers = {
        ...answers,
        category: value,
        category_other: answers.category_other || "",
      };
      setAnswers(nextAnswers);
      persist({ answers: nextAnswers });
      saveProgress(nextAnswers);
      return;
    }

    const nextAnswers = {
      ...answers,
      [key]: value,
      ...(key === "category" ? { category_other: "" } : {}),
    };
    setAnswers(nextAnswers);
    persist({ answers: nextAnswers });
    saveProgress(nextAnswers);
    setAdvancing(true);

    advanceTimer.current = setTimeout(() => {
      if (index === TOTAL_QUESTIONS - 1) {
        completeQuiz(nextAnswers);
      } else {
        const nextIndex = index + 1;
        setIndex(nextIndex);
        persist({ index: nextIndex, phase: "quiz" });
        setAdvancing(false);
        scrollToTop();
      }
    }, 250);
  };

  const continueCategoryOther = () => {
    const detail = (answers.category_other || "").trim();
    if (answers.category !== "Otro" || detail.length < 2) return;
    const nextAnswers = { ...answers, category_other: detail };
    setAnswers(nextAnswers);
    persist({ answers: nextAnswers });
    saveProgress(nextAnswers);
    const nextIndex = index + 1;
    setIndex(nextIndex);
    persist({ index: nextIndex, phase: "quiz" });
    scrollToTop();
  };

  const toggleMulti = (
    key: "existing_assets" | "selected_goals",
    value: string,
  ) => {
    const current = answers[key] || [];
    let next: string[];

    if (key === "existing_assets" && value === "Sin activos aún") {
      next = current.includes(value) ? [] : [value];
    } else if (key === "existing_assets") {
      const withoutEmpty = current.filter((item) => item !== "Sin activos aún");
      next = withoutEmpty.includes(value)
        ? withoutEmpty.filter((item) => item !== value)
        : [...withoutEmpty, value];
    } else {
      next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
    }

    const nextAnswers: SimplifiedQuizAnswers = {
      ...answers,
      [key]: next,
    };

    if (key === "selected_goals") {
      const ranked = D.recommendPriorities(next);
      nextAnswers.selected_goals = ranked.length ? ranked : next;
      nextAnswers.main_goal = ranked[0] || next[0] || "";
    }

    setAnswers(nextAnswers);
    persist({ answers: nextAnswers });
    saveProgress(nextAnswers);
  };

  const continueMulti = () => {
    if (!question || question.type !== "multi") return;

    if (question.id === "existing_assets") {
      if (!answers.existing_assets?.length) return;
    }

    if (question.id === "main_goal") {
      const selected = answers.selected_goals || [];
      if (!selected.length) return;
      const ranked = D.recommendPriorities(selected);
      const nextAnswers = {
        ...answers,
        selected_goals: ranked.length ? ranked : selected,
        main_goal: ranked[0] || selected[0],
      };
      setAnswers(nextAnswers);
      persist({ answers: nextAnswers, index: index + 1, phase: "quiz" });
      saveProgress(nextAnswers);
      setIndex(index + 1);
      scrollToTop();
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    persist({ index: nextIndex, answers, phase: "quiz" });
    saveProgress(answers);
    scrollToTop();
  };

  const goBack = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setAdvancing(false);

    if (phase === "result") {
      const lastIndex = TOTAL_QUESTIONS - 1;
      setIndex(lastIndex);
      setPhase("quiz");
      persist({ phase: "quiz", index: lastIndex });
      scrollToTop();
      return;
    }

    if (phase === "lead") {
      setPhase("cover");
      persist({ phase: "cover" });
      return;
    }

    if (index === 0) {
      setPhase("lead");
      persist({ phase: "lead" });
      scrollToTop();
      return;
    }
    const previous = index - 1;
    setIndex(previous);
    persist({ index: previous, phase: "quiz" });
    scrollToTop();
  };

  const submitLead = async () => {
    const digits = lead.phone.replace(/\D/g, "");
    if (
      lead.project_name.trim().length < 2 ||
      lead.full_name.trim().length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())
    ) {
      setLeadError("Completa correctamente tu empresa, nombre y correo.");
      return;
    }
    if (digits.length !== 10) {
      setLeadError("Tu WhatsApp debe tener exactamente 10 dígitos.");
      return;
    }
    if (!lead.terms) {
      setLeadError("Necesitamos tu autorización para generar el diagnóstico.");
      return;
    }

    setSending(true);
    setLeadError("");
    try {
      const url = new URL(window.location.href);
      const response = await fetch("/api/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: lead.project_name.trim(),
          full_name: lead.full_name.trim(),
          whatsapp: `${lead.cc} ${formatMxPhone(lead.phone)}`,
          email: lead.email.trim(),
          terms_accepted: true,
          source_url: url.href,
          utm_source: url.searchParams.get("utm_source") || "",
          utm_medium: url.searchParams.get("utm_medium") || "",
          utm_campaign: url.searchParams.get("utm_campaign") || "",
          company_website: lead.hp,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "No pudimos iniciar tu diagnóstico.");
      }

      setLeadId(data.lead_id);
      setIndex(0);
      setAnswers({});
      setPhase("quiz");
      persist({
        leadId: data.lead_id,
        lead,
        answers: {},
        index: 0,
        phase: "quiz",
      });
      scrollToTop();
    } catch (error) {
      setLeadError(
        error instanceof Error
          ? error.message
          : "No pudimos iniciar tu diagnóstico.",
      );
    } finally {
      setSending(false);
    }
  };

  const optionValue = useMemo(() => {
    if (!question) return undefined;
    if (question.id === "main_goal") {
      return answers.selected_goals?.length
        ? answers.selected_goals
        : answers.main_goal
          ? [answers.main_goal]
          : [];
    }
    return answers[question.id as keyof SimplifiedQuizAnswers];
  }, [answers, question]);

  const multiSelectedCount =
    question?.id === "main_goal"
      ? (answers.selected_goals?.length ||
          (answers.main_goal ? 1 : 0))
      : question?.id === "existing_assets"
        ? answers.existing_assets?.length || 0
        : 0;

  return (
    <>
      {phase !== "cover" && (
        <div className="k-progress-shell" aria-label={`Progreso: ${progress}%`}>
          <motion.div
            className="k-progress-line"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          />
        </div>
      )}

      <main ref={stageRef} className="k-stage">
        <AnimatePresence mode="wait">
          {phase === "cover" && (
            <motion.section
              key="cover"
              className="k-scene k-cover"
              {...sceneMotion}
            >
              <p className="k-eyebrow">{D.COVER.eyebrow}</p>
              <h1 className="k-display">{D.COVER.title}</h1>
              <p className="k-sub">{D.COVER.text}</p>
              <button
                className="k-cta"
                onClick={() => {
                  setPhase("lead");
                  persist({ phase: "lead" });
                }}
              >
                <span>{D.COVER.button}</span>
              </button>
              <p className="k-cover-footer">{D.COVER.footer}</p>
            </motion.section>
          )}

          {phase === "lead" && (
            <motion.section key="lead" className="k-scene" {...sceneMotion}>
              <button type="button" className="k-back" onClick={goBack}>
                <span aria-hidden>←</span> Regresar
              </button>
              <div className="k-step-meta">Paso 0 · Registro</div>
              <h1 className="k-display">{D.LEAD_SCREEN.title}</h1>
              <p className="k-sub">{D.LEAD_SCREEN.text}</p>
              <div className="k-lead-grid">
                <Field
                  id="company"
                  label="Nombre de empresa"
                  value={lead.project_name}
                  onChange={(value) => setLead({ ...lead, project_name: value })}
                />
                <Field
                  id="name"
                  label="Nombre completo"
                  value={lead.full_name}
                  autoComplete="name"
                  onChange={(value) => setLead({ ...lead, full_name: value })}
                />
                <div className="k-field">
                  <label htmlFor="quiz-phone">WhatsApp</label>
                  <div className="k-phone">
                    <input value={lead.cc} readOnly aria-label="Código de país" />
                    <input
                      id="quiz-phone"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="55 0000 0000"
                      maxLength={12}
                      value={lead.phone}
                      onChange={(event) =>
                        setLead({
                          ...lead,
                          phone: formatMxPhone(event.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={lead.email}
                  autoComplete="email"
                  onChange={(value) => setLead({ ...lead, email: value })}
                />
                <input
                  className="hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={lead.hp}
                  onChange={(event) => setLead({ ...lead, hp: event.target.value })}
                />
              </div>
              <label className="k-consent">
                <input
                  type="checkbox"
                  checked={lead.terms}
                  onChange={(event) =>
                    setLead({ ...lead, terms: event.target.checked })
                  }
                />
                <span>
                  {D.LEAD_SCREEN.consent}{" "}
                  <a
                    href={process.env.NEXT_PUBLIC_PRIVACY_URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver aviso
                  </a>
                </span>
              </label>
              {leadError && <p className="k-errmsg">{leadError}</p>}
              <button
                className="k-cta"
                disabled={sending}
                onClick={submitLead}
              >
                <span>{sending ? "Guardando…" : D.LEAD_SCREEN.button}</span>
              </button>
            </motion.section>
          )}

          {phase === "quiz" && question && (
            <motion.section
              key={question.id}
              className="k-scene k-question-scene"
              {...sceneMotion}
            >
              <button type="button" className="k-back" onClick={goBack}>
                <span aria-hidden>←</span> Regresar
              </button>
              <div className="k-step-meta">
                Paso {index + 1} de {TOTAL_QUESTIONS}
              </div>
              <h1 className="k-display">{question.title}</h1>
              <p className="k-sub">{question.hint}</p>

              <div className="k-pill-grid">
                {question.options.map((option) => {
                  const selected = Array.isArray(optionValue)
                    ? optionValue.includes(option.id)
                    : optionValue === option.id;
                  return (
                    <QuizPill
                      key={option.id}
                      selected={selected}
                      disabled={advancing}
                      onSelect={() => {
                        if (question.type === "multi") {
                          toggleMulti(
                            question.id === "main_goal"
                              ? "selected_goals"
                              : "existing_assets",
                            option.id,
                          );
                        } else {
                          chooseSingle(
                            question.id as
                              | "category"
                              | "business_stage"
                              | "desired_start",
                            option.id,
                          );
                        }
                      }}
                    >
                      {option.label}
                    </QuizPill>
                  );
                })}
              </div>

              {question.id === "category" && answers.category === "Otro" && (
                <div className="k-other-field">
                  <label htmlFor="quiz-category-other">
                    Cuéntanos brevemente de qué se trata
                  </label>
                  <input
                    id="quiz-category-other"
                    type="text"
                    maxLength={80}
                    placeholder="Ej. estudio creativo, clínica dental, logística…"
                    value={answers.category_other || ""}
                    onChange={(event) => {
                      const nextAnswers = {
                        ...answers,
                        category_other: event.target.value,
                      };
                      setAnswers(nextAnswers);
                      persist({ answers: nextAnswers });
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="k-cta k-continue"
                    disabled={(answers.category_other || "").trim().length < 2}
                    onClick={continueCategoryOther}
                  >
                    <span>Continuar</span>
                  </button>
                </div>
              )}

              {question.type === "multi" && (
                <button
                  type="button"
                  className="k-cta k-continue"
                  disabled={multiSelectedCount === 0}
                  onClick={continueMulti}
                >
                  <span>Continuar</span>
                </button>
              )}
            </motion.section>
          )}

          {phase === "result" && (
            <QuizResults
              key="result"
              projectName={lead.project_name || "tu proyecto"}
              fullName={lead.full_name || "Cliente KOMVOS"}
              answers={answers}
              onBack={goBack}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="k-field">
      <label htmlFor={`quiz-${id}`}>{label}</label>
      <input
        id={`quiz-${id}`}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function QuizPill({
  selected,
  disabled,
  onSelect,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  children: string;
}) {
  const [wave, setWave] = useState<{ id: number; x: number; y: number } | null>(
    null,
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setWave({
      id: performance.now(),
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    onSelect();
  };

  return (
    <GlassCard
      resonance={false}
      className={`k-pill-card ${selected ? "is-selected" : ""}`}
      contentClassName="k-pill-content"
    >
      <button
        type="button"
        className="k-pill"
        aria-pressed={selected}
        disabled={disabled}
        onClick={handleClick}
      >
        {wave && (
          <span
            key={wave.id}
            className="k-pill-wave"
            style={{ left: wave.x, top: wave.y }}
            aria-hidden
          />
        )}
        <span>{children}</span>
        <AnimatePresence>
          {selected && (
            <motion.span
              className="k-check"
              initial={{ scale: 0, rotate: -35, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 520, damping: 28 }}
              aria-hidden
            >
              ✓
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </GlassCard>
  );
}
