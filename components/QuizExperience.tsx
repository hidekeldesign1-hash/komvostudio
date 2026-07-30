"use client";
/* ============================================================
   KOMVOS · El Pulso — experiencia completa
   Un motor de escenas dirigido por lib/quizData. Cada respuesta
   emite un pulso; los capítulos encienden nodos de una ruta.
   ============================================================ */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as D from "@/lib/quizData";
import type { ClientResult } from "@/lib/schemas";

type Answers = Record<string, any>;
type Phase = "cover" | "lead" | "prep" | "quiz" | "analyzing" | "result" | "error";

const LS_KEY = "komvos_pulso_v1";
const fx = { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.55, ease: [0.19, 1, 0.22, 1] } };

/** Formato MX: 55 0000 0000 (máx. 10 dígitos). */
function formatMxPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}

/* ── sonido breve, elegante y desactivable ── */
function usePulseSound() {
  const [on, setOn] = useState(false);
  const play = useCallback(() => {
    if (!on) return;
    try {
      const A = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = A.createOscillator(), g = A.createGain();
      o.type = "sine"; o.frequency.value = 660;
      g.gain.setValueAtTime(0.0001, A.currentTime);
      g.gain.exponentialRampToValueAtTime(0.05, A.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, A.currentTime + 0.28);
      o.connect(g).connect(A.destination); o.start(); o.stop(A.currentTime + 0.3);
    } catch {}
  }, [on]);
  return { soundOn: on, setSoundOn: setOn, pulse: play };
}

/* ── ruta de nodos por capítulo ── */
function Route({ chapter }: { chapter: number }) {
  return (
    <>
      <div className="k-route" aria-hidden>
        {D.CHAPTERS.map((_, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && <span className={`k-link ${i <= chapter ? "lit" : ""}`} />}
            <span className={`k-node ${i <= chapter ? "lit" : ""} ${i === chapter ? "now" : ""}`} />
          </span>
        ))}
      </div>
      <div className="k-chapter">{D.CHAPTERS[Math.min(chapter, D.CHAPTERS.length - 1)]}</div>
    </>
  );
}

/* ── visual abstracto de industria: nodos líquidos generativos ── */
function CategoryVisual({ seed }: { seed: string }) {
  const pts = useMemo(() => {
    let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return Array.from({ length: 7 }, (_, i) => {
      h = (h * 1103515245 + 12345) >>> 0;
      return { x: 40 + (h % 240), y: 26 + ((h >> 8) % 68), r: 3 + ((h >> 16) % 6) };
    });
  }, [seed]);
  return (
    <svg width="100%" viewBox="0 0 320 120" style={{ marginTop: 22, opacity: 0.9 }} aria-hidden>
      <defs>
        <linearGradient id="ksp" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7DD8FF" /><stop offset="40%" stopColor="#B79DFF" />
          <stop offset="75%" stopColor="#FFD1E8" /><stop offset="100%" stopColor="#9CFFE0" />
        </linearGradient>
      </defs>
      <ellipse cx="160" cy="62" rx="120" ry="34" fill="none" stroke="rgba(255,255,255,.09)" />
      {pts.map((p, i) => (
        <g key={i}>
          {i > 0 && <line x1={pts[i - 1].x} y1={pts[i - 1].y} x2={p.x} y2={p.y} stroke="url(#ksp)" strokeOpacity=".35" />}
          <circle cx={p.x} cy={p.y} r={p.r} fill="rgba(255,255,255,.85)" />
          <circle cx={p.x} cy={p.y} r={p.r + 5} fill="none" stroke="url(#ksp)" strokeOpacity=".4" />
        </g>
      ))}
    </svg>
  );
}

/* ── órbitas del paso 5 ── */
function OrbitMap({ selected }: { selected: string[] }) {
  const orbits = Object.entries(D.ORBITS);
  return (
    <svg className="k-orbit" width="300" height="230" viewBox="0 0 300 230" aria-hidden>
      <circle className="core" cx="150" cy="115" r="26" />
      {orbits.map(([name, items], i) => {
        const ang = (Math.PI * 2 * i) / orbits.length - Math.PI / 2;
        const R = 86;
        const cx = 150 + Math.cos(ang) * R, cy = 115 + Math.sin(ang) * R * 0.82;
        const lit = items.some(it => selected.includes(it));
        return (
          <g key={name}>
            <line x1="150" y1="115" x2={cx} y2={cy} stroke="rgba(255,255,255,.07)" />
            <circle className={`onode ${lit ? "lit" : ""}`} cx={cx} cy={cy} r="7" />
            <text x={cx} y={cy + (cy > 115 ? 22 : -14)} textAnchor="middle">{name}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── brújula espacial del resultado ── */
function Compass() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ display: "block", margin: "0 auto" }} aria-hidden>
      <defs>
        <linearGradient id="kroute" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#7DD8FF" /><stop offset="55%" stopColor="#B79DFF" />
          <stop offset="100%" stopColor="#FFD1E8" />
        </linearGradient>
      </defs>
      {[96, 76, 56].map(r => <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,.1)" />)}
      <path d="M20 170 Q70 150 105 158 T200 150" fill="none" stroke="rgba(255,255,255,.12)" />
      <path d="M14 186 L70 158 L110 168 L150 132 L182 96 L196 62"
        fill="none" stroke="url(#kroute)" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="300"
        strokeDashoffset="300" style={{ animation: "kRoute 2.4s .4s ease forwards" }} />
      {[[14,186],[70,158],[110,168],[150,132],[182,96]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="rgba(255,255,255,.75)" />
      ))}
      <circle cx="196" cy="62" r="5" fill="#fff" style={{ filter: "drop-shadow(0 0 10px rgba(183,157,255,.95))" }} />
      <circle cx="196" cy="62" r="12" fill="none" stroke="rgba(183,157,255,.5)">
        <animate attributeName="r" values="8;16;8" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values=".6;.05;.6" dur="3s" repeatCount="indefinite" />
      </circle>
      <style>{`@keyframes kRoute{to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
}

/* ── definición del flujo ── */
type StepDef = { id: string; chapter: number };
const BASE_STEPS: StepDef[] = [
  { id: "s1", chapter: 0 }, { id: "s2", chapter: 1 }, { id: "s3", chapter: 1 },
  { id: "t1", chapter: 2 }, { id: "s4", chapter: 2 }, { id: "coord", chapter: 2 },
  { id: "t2", chapter: 3 }, { id: "s5", chapter: 3 },
  { id: "s6", chapter: 4 }, { id: "s7", chapter: 5 }, { id: "s8", chapter: 5 },
  { id: "s9", chapter: 5 }, { id: "identity", chapter: 4 }, { id: "s10", chapter: 6 }
];

export default function QuizExperience() {
  const [phase, setPhase] = useState<Phase>("cover");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [leadId, setLeadId] = useState<string>("");
  const [legal, setLegal] = useState(false);
  const [result, setResult] = useState<{ clientResult: ClientResult; tier: string; priceRange: string; timelineRange: string; monthly: { label: string; range: string }[] } | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const { soundOn, setSoundOn, pulse } = usePulseSound();
  const feedbackRot = useRef(0);
  const stageRef = useRef<HTMLElement>(null);

  /* recuperación si recarga la página */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.leadId) {
          setLeadId(s.leadId);
          setAnswers(s.answers || {});
          setIdx(s.idx || 0);
          // "analyzing" y "error" no se pueden retomar solas: sin petición viva
          // la pantalla se quedaría girando para siempre.
          const saved: Phase = s.phase || "cover";
          setPhase(saved === "result" ? "cover" : saved === "analyzing" || saved === "error" ? "quiz" : saved);
        }
      }
    } catch {}
  }, []);
  const persist = (patch: Partial<{ leadId: string; answers: Answers; idx: number; phase: Phase }>) => {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      localStorage.setItem(LS_KEY, JSON.stringify({ ...raw, ...patch }));
    } catch {}
  };

  /* pasos activos: la ruta de identidad solo si el paso 5 lo detecta */
  const steps = useMemo(() => {
    const a = answers.existing_assets as string[] | undefined;
    const needsIdentity = !a ? false :
      !(a.includes("Identidad visual completa.") ||
        (a.includes("Logo.") && a.includes("Colores.") && a.includes("Propuesta de valor o mensaje principal.")));
    return BASE_STEPS.filter(s => s.id !== "identity" || needsIdentity);
  }, [answers.existing_assets]);

  const step = steps[Math.min(idx, steps.length - 1)];
  const progress = phase === "quiz" ? Math.round(((idx + 1) / (steps.length + 1)) * 100) : phase === "result" ? 100 : 0;

  /* guardado progresivo (nunca bloquea la experiencia) */
  const save = useCallback((extra: Partial<{ status: string; completion_percentage: number; last_step: string }> = {}, ans?: Answers) => {
    if (!leadId) return;
    fetch("/api/leads/update", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_id: leadId, status: extra.status || "En progreso",
        completion_percentage: extra.completion_percentage ?? progress,
        last_step: extra.last_step || step?.id, answers: ans || answers
      })
    }).catch(() => {});
  }, [leadId, progress, step, answers]);

  const setA = (k: string, v: any) => setAnswers(p => { const n = { ...p, [k]: v }; persist({ answers: n }); return n; });
  const toggle = (k: string, v: string, max?: number) => {
    setAnswers(p => {
      const cur: string[] = p[k] || [];
      let n = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v];
      if (max && n.length > max) n = n.slice(n.length - max);
      const nn: Answers = { ...p, [k]: n };
      if (k === "collaboration_selected" && p.collaboration_style && !n.includes(p.collaboration_style)) {
        nn.collaboration_style = "";
      }
      if (k === "offers_selected" && p.main_offer && !n.includes(p.main_offer)) {
        nn.main_offer = "";
      }
      if (k === "selected_goals" && p.main_goal && !n.includes(p.main_goal)) {
        nn.main_goal = "";
      }
      persist({ answers: nn });
      return nn;
    });
  };

  const resetStageScroll = () => {
    const stage = stageRef.current;
    if (stage) stage.scrollTop = 0;
  };

  const next = () => {
    save();
    if (idx + 1 >= steps.length) { finish(); return; }
    setIdx(i => { const n = i + 1; persist({ idx: n }); return n; });
    requestAnimationFrame(resetStageScroll);
  };

  const back = () => {
    if (idx <= 0) return;
    setIdx(i => {
      const n = Math.max(0, i - 1);
      persist({ idx: n });
      return n;
    });
    requestAnimationFrame(resetStageScroll);
  };

  const finish = async () => {
    setPhase("analyzing"); persist({ phase: "quiz" });
    save({ completion_percentage: 96, last_step: "analyzing" });
    try {
      const r = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_id: leadId, answers }),
        signal: AbortSignal.timeout(30_000)
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Error de análisis");
      setResult(j); setPhase("result"); persist({ phase: "result" });
    } catch (e: any) {
      const timedOut = e?.name === "TimeoutError" || e?.name === "AbortError";
      setErrMsg(
        timedOut
          ? "El diagnóstico tardó demasiado en responder. Intenta de nuevo."
          : e?.message || "No pudimos generar el diagnóstico."
      );
      setPhase("error");
    }
  };

  const rotFeedback = () => D.FEEDBACK_ROTATION[(feedbackRot.current++) % D.FEEDBACK_ROTATION.length];

  /* ── envío de datos de contacto ── */
  const [lead, setLead] = useState({ project_name: "", full_name: "", cc: "+52", phone: "", email: "", city_state: "", terms: false, hp: "" });
  const [leadErr, setLeadErr] = useState("");
  const [sending, setSending] = useState(false);
  const submitLead = async () => {
    const emailOk = /.+@.+\..+/.test(lead.email.trim());
    const phoneDigits = lead.phone.replace(/\D/g, "");
    const phoneOk = phoneDigits.length === 10;
    if (!lead.project_name.trim() || !lead.full_name.trim() || !emailOk || !phoneOk || !lead.city_state.trim() || !lead.terms) {
      setLeadErr(
        phoneDigits.length > 0 && phoneDigits.length !== 10
          ? "El WhatsApp debe tener 10 dígitos (formato 55 0000 0000)."
          : "Completa todos los campos y acepta el aviso de privacidad para continuar.",
      );
      return;
    }
    setLeadErr(""); setSending(true);
    try {
      const u = new URL(location.href);
      const r = await fetch("/api/leads/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: lead.project_name.trim(), full_name: lead.full_name.trim(),
          whatsapp: `${lead.cc} ${formatMxPhone(lead.phone)}`, email: lead.email.trim(),
          city_state: lead.city_state.trim(), terms_accepted: true,
          source_url: location.href.slice(0, 480),
          utm_source: u.searchParams.get("utm_source") || "",
          utm_medium: u.searchParams.get("utm_medium") || "",
          utm_campaign: u.searchParams.get("utm_campaign") || "",
          company_website: lead.hp
        })
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Error");
      setLeadId(j.lead_id); persist({ leadId: j.lead_id, phase: "quiz", idx: 0 });
      setPhase("prep"); setIdx(0);
      if (j.warning) console.warn(j.warning);
    } catch (e: any) {
      setLeadErr(e?.message || "No pudimos guardar tus datos. Intenta de nuevo.");
    } finally { setSending(false); }
  };

  const wa = (msg: string) => {
    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  /* ── escenas ── */
  const scene = () => {
    if (!step) return null;
    const a = answers;
    switch (step.id) {
      case "s1": {
        const q = (a.cat_query || "") as string;
        const list = q ? D.CATEGORIES.filter(c => c.label.toLowerCase().includes(q.toLowerCase())) : D.CATEGORIES;
        const fb = a.category ? D.CATEGORY_FEEDBACK[a.category] : "";
        const ok = !!a.category && (a.business_description || "").trim().length >= 10 && (a.target_audience || "").trim().length >= 3;
        return (
          <>
            <Heading title="¿A qué se dedica tu proyecto?" />
            <div className="k-fields" style={{ marginTop: 24 }}>
              <input placeholder="Escribe o selecciona una categoría" value={q}
                onChange={e => setA("cat_query", e.target.value)} aria-label="Buscar categoría" />
            </div>
            <div className="k-opts duo k-single" style={{ marginTop: 16 }} data-k-incomplete={!a.category || undefined}>
              {list.map(o => (
                <OptBtn pulse={pulse} key={o.id} sel={a.category === o.id} on={() => setA("category", o.id)}>{o.label}</OptBtn>
              ))}
              {q && !list.length && (
                <OptBtn pulse={pulse} sel={a.category === q} on={() => setA("category", q)}>Usar “{q}”</OptBtn>
              )}
            </div>
            {a.category && <CategoryVisual seed={a.category} />}
            {fb && <div className="k-feedback">{fb}</div>}
            <div className="k-fields" style={{ marginTop: 30 }} data-k-incomplete={((a.business_description || "").trim().length < 10 || (a.target_audience || "").trim().length < 3) || undefined}>
              <div>
                <label>{D.STEP1_OPEN.q2Title}</label>
                <textarea rows={4} placeholder={D.STEP1_OPEN.q2Hint}
                  value={a.business_description || ""} onChange={e => setA("business_description", e.target.value)} />
              </div>
              <div>
                <label>{D.STEP1_OPEN.q3Title}</label>
                <input value={a.target_audience || ""} onChange={e => setA("target_audience", e.target.value)}
                  placeholder="Por ejemplo: dueñas de clínicas estéticas, familias jóvenes, empresas medianas…" />
              </div>
            </div>
            <ContinueBtn onNext={next} ok={ok} />
          </>
        );
      }
      case "s2": {
        const fb = a.business_stage ? D.STAGE_FEEDBACK[a.business_stage] : "";
        return (
          <>
            <Heading title="¿En qué etapa se encuentra tu proyecto?" />
            <SingleGrid value={a.business_stage} opts={D.STAGES} pulse={pulse} onPick={v=>setA("business_stage",v)} />
            {fb && <div className="k-feedback">{fb}</div>}
            <ContinueBtn onNext={next} ok={!!a.business_stage} />
          </>
        );
      }
      case "s3": {
        const sel: string[] = a.offers_selected || [];
        return (
          <>
            <Heading title="¿Qué ofrece actualmente tu negocio?" />
            <MultiGrid selected={a.offers_selected||[]} opts={D.OFFERS} pulse={pulse} onToggle={v=>toggle("offers_selected",v)} />
            {sel.length > 0 && (
              <>
                <p className="k-sub" style={{ marginTop: 28 }}>{D.OFFER_PRIORITIZE}</p>
                <div
                  className="k-priority"
                  data-k-incomplete={!a.main_offer || undefined}
                >
                  <p className="k-priority-label">Elige tu oferta principal</p>
                  <div className="k-opts">
                    {sel.map(s => (
                      <OptBtn pulse={pulse} key={s} variant="priority" sel={a.main_offer === s} on={() => setA("main_offer", s)}>{s}</OptBtn>
                    ))}
                  </div>
                </div>
              </>
            )}
            <ContinueBtn onNext={next} ok={sel.length > 0 && !!a.main_offer} />
          </>
        );
      }
      case "t1": return (
        <div className="k-transition">
          <div className="k-spinner" aria-hidden />
          <p>{D.TRANSITIONS.t1}</p>
          <ContinueBtn onNext={next} />
        </div>
      );
      case "s4": {
        const sel: string[] = a.acquisition_channels || [];
        return (
          <>
            <Heading title="¿Cómo llegan actualmente las personas a tu negocio?" />
            <MultiGrid selected={a.acquisition_channels||[]} opts={D.CHANNELS} pulse={pulse} onToggle={v=>toggle("acquisition_channels",v)} />
            {sel.length > 0 && <div className="k-feedback">{D.channelFeedback(sel)}</div>}
            <ContinueBtn onNext={next} ok={sel.length > 0} />
          </>
        );
      }
      case "coord": {
        const coords = [
          "Tu negocio ya genera confianza, pero depende principalmente de canales difíciles de medir.",
          "Existen piezas visuales, aunque todavía no forman una identidad completa.",
          "Tu prioridad no es solamente atraer personas: también necesitas conocerlas y darles seguimiento."
        ];
        const ch: string[] = a.acquisition_channels || [];
        const hard = ch.length > 0 && ch.every(c => ["Recomendaciones.","Llamadas.","Local físico.","Eventos.","WhatsApp.","Prospección directa."].includes(c));
        const text = hard ? coords[0] : rotFeedback();
        return (
          <div className="k-coord k-glass" style={{ padding: "44px 30px" }}>
            <div className="tag">Coordenada descubierta</div>
            <p>{hard ? text : "Cada respuesta enciende una parte del mapa. " + text}</p>
            <ContinueBtn onNext={next} />
          </div>
        );
      }
      case "t2": return (
        <div className="k-transition">
          <div className="k-spinner" aria-hidden />
          <p>{D.TRANSITIONS.t2}</p>
          <ContinueBtn onNext={next} />
        </div>
      );
      case "s5": {
        const sel: string[] = a.existing_assets || [];
        return (
          <>
            <Heading title="¿Qué has construido hasta hoy?" />
            <OrbitMap selected={sel} />
            <MultiGrid selected={a.existing_assets||[]} opts={D.ASSETS} pulse={pulse} onToggle={v=>toggle("existing_assets",v)} />
            {sel.length > 0 && <div className="k-feedback">{D.assetsFeedback(sel)}</div>}
            <ContinueBtn onNext={next} ok={sel.length > 0} />
          </>
        );
      }
      case "s6": {
        const vals: string[] = a.values || [];
        const fb = vals.map(v => D.VALUE_FEEDBACK[v]).filter(Boolean).slice(-1)[0];
        return (
          <>
            <Heading title="Más allá de lo que vendes, ¿qué quieres que represente tu empresa?" sub="Selecciona máximo cuatro." />
            <MultiGrid selected={a.values||[]} opts={D.VALUES} pulse={pulse} onToggle={v=>toggle("values",v,4)} />
            {fb && <div className="k-feedback">{fb}</div>}
            <p className="k-sub" style={{ marginTop: 30 }}>¿Qué debería sentir una persona al entrar en contacto con tu marca?</p>
            <SingleGrid value={a.desired_feeling} opts={D.FEELINGS} pulse={pulse} onPick={v=>setA("desired_feeling",v)} />
            {a.desired_feeling === "Otra." && (
              <div className="k-fields"><input placeholder="Cuéntanos con tus palabras"
                value={a.desired_feeling_other || ""} onChange={e => setA("desired_feeling_other", e.target.value)} /></div>
            )}
            <div className="k-fields" style={{ marginTop: 26 }}>
              <div>
                <label>{D.NEVER_LOSE.q}</label>
                <textarea rows={3} value={a.must_never_lose || ""} onChange={e => setA("must_never_lose", e.target.value)} />
              </div>
            </div>
            <p className="k-feedback" style={{ marginTop: 16 }}>{D.NEVER_LOSE.note}</p>
            <ContinueBtn onNext={next} ok={vals.length > 0 && !!a.desired_feeling && (a.must_never_lose || "").trim().length >= 3} />
          </>
        );
      }
      case "s7": {
        const sel: string[] = a.selected_goals || [];
        return (
          <>
            <Heading title="¿Qué te gustaría transformar primero?" sub="Selecciona hasta tres." />
            <MultiGrid selected={a.selected_goals||[]} opts={D.GOALS} pulse={pulse} onToggle={v=>toggle("selected_goals",v,3)} />
            {sel.length > 0 && (
              <>
                <p className="k-sub" style={{ marginTop: 28 }}>{D.GOAL_PRIORITY.q}</p>
                <div
                  className="k-priority"
                  data-k-incomplete={!a.main_goal || undefined}
                >
                  <p className="k-priority-label">Elige tu prioridad principal</p>
                  <div className="k-opts">
                    {sel.map(s => (
                      <OptBtn pulse={pulse} key={s} variant="priority" sel={a.main_goal === s} on={() => setA("main_goal", s)}>{s}</OptBtn>
                    ))}
                  </div>
                  {a.main_goal && <div className="k-feedback">{D.GOAL_PRIORITY.note}</div>}
                </div>
              </>
            )}
            <ContinueBtn onNext={next} ok={sel.length > 0 && !!a.main_goal} />
          </>
        );
      }
      case "s8": {
        const sel: string[] = a.selected_services || [];
        const needsPages = sel.includes("Landing page.") || sel.includes("Página web.");
        const needsProducts = sel.includes("Tienda en línea.");
        const needsRoutes = sel.includes("Quiz o diagnóstico interactivo.") || sel.includes("Sistema para captar prospectos.") || sel.includes("Automatizaciones.");
        const needsAV = sel.includes("Producción audiovisual.");
        const mk = (o: string[]) => o.map(l => ({ id: l, label: l }));
        const condOk = (!needsPages || a.number_of_pages) && (!needsProducts || a.product_volume) &&
                       (!needsRoutes || a.number_of_routes) && (!needsAV || (a.av_needs || []).length);
        return (
          <>
            <Heading title="¿Qué te gustaría construir con KOMVOS?" />
            <MultiGrid selected={a.selected_services||[]} opts={D.SERVICES} pulse={pulse} onToggle={v=>toggle("selected_services",v)} />
            {needsPages && (<><p className="k-sub" style={{ marginTop: 26 }}>{D.COND_PAGES.q}</p><SingleGrid value={a.number_of_pages} opts={mk(D.COND_PAGES.o)} pulse={pulse} onPick={v=>setA("number_of_pages",v)} /></>)}
            {needsProducts && (<><p className="k-sub" style={{ marginTop: 26 }}>{D.COND_PRODUCTS.q}</p><SingleGrid value={a.product_volume} opts={mk(D.COND_PRODUCTS.o)} pulse={pulse} onPick={v=>setA("product_volume",v)} /></>)}
            {needsRoutes && (<><p className="k-sub" style={{ marginTop: 26 }}>{D.COND_ROUTES.q}</p><SingleGrid value={a.number_of_routes} opts={mk(D.COND_ROUTES.o)} pulse={pulse} onPick={v=>setA("number_of_routes",v)} /></>)}
            {needsAV && (<><p className="k-sub" style={{ marginTop: 26 }}>{D.COND_AV.q}</p><MultiGrid selected={a.av_needs||[]} opts={mk(D.COND_AV.o)} pulse={pulse} onToggle={v=>toggle("av_needs",v)} /></>)}
            <ContinueBtn onNext={next} ok={sel.length > 0 && !!condOk} />
          </>
        );
      }
      case "s9": {
        const collab: string[] = a.collaboration_selected || [];
        const mk = (o: string[]) => o.map(l => ({ id: l, label: l }));
        return (
          <>
            <Heading title="Preparación y operación" sub="Una mirada rápida a lo que ya tienes y a cómo trabajaremos." />
            <p className="k-sub" style={{ marginTop: 26 }}>¿Qué materiales ya tienes listos?</p>
            <MultiGrid selected={a.available_materials||[]} opts={D.MATERIALS} pulse={pulse} onToggle={v=>toggle("available_materials",v)} />
            <p className="k-sub" style={{ marginTop: 26 }}>¿Qué herramientas debemos conectar?</p>
            <MultiGrid selected={a.required_integrations||[]} opts={D.INTEGRATIONS} pulse={pulse} onToggle={v=>toggle("required_integrations",v)} />
            <p className="k-sub" style={{ marginTop: 26 }}>¿Cuántas personas participarán en la aprobación?</p>
            <SingleGrid value={a.number_of_approvers} opts={mk(D.APPROVERS)} pulse={pulse} onPick={v=>setA("number_of_approvers",v)} />
            <p className="k-sub" style={{ marginTop: 26 }}>Si mañana comenzaran a llegar nuevas oportunidades, ¿quién les daría seguimiento?</p>
            <SingleGrid value={a.follow_up_capacity} opts={mk(D.FOLLOWUP)} pulse={pulse} onPick={v=>setA("follow_up_capacity",v)} />
            <p className="k-sub" style={{ marginTop: 26 }}>¿Cómo te gustaría que trabajáramos contigo? <span style={{ color: "var(--faint)" }}>(elige hasta dos y prioriza una)</span></p>
            <MultiGrid selected={a.collaboration_selected||[]} opts={mk(D.COLLABORATION)} pulse={pulse} onToggle={v=>toggle("collaboration_selected",v,2)} />
            {collab.length > 0 && (
              <div
                className="k-priority"
                data-k-incomplete={!a.collaboration_style || undefined}
              >
                <p className="k-priority-label">Ahora elige cuál es tu prioridad</p>
                <p className="k-priority-hint">Selecciona una de las opciones que marcaste arriba para continuar.</p>
                <div className="k-opts">
                  {collab.map(c => (
                    <OptBtn
                      pulse={pulse}
                      key={c}
                      variant="priority"
                      sel={a.collaboration_style === c}
                      on={() => setA("collaboration_style", c)}
                    >
                      {c}
                    </OptBtn>
                  ))}
                </div>
              </div>
            )}
            <ContinueBtn onNext={next} ok={(a.available_materials || []).length > 0 && (a.required_integrations || []).length > 0 &&
              !!a.number_of_approvers && !!a.follow_up_capacity && !!a.collaboration_style} />
          </>
        );
      }
      case "identity": {
        const mk = (o: string[]) => o.map(l => ({ id: l, label: l }));
        return (
          <>
            <p className="k-feedback" style={{ marginTop: 0 }}>{D.IDENTITY.transition}</p>
            <p className="k-sub" style={{ marginTop: 26 }}>{D.IDENTITY.q1}</p>
            <div className="k-fields"><input value={a.identity_feeling || ""}
              onChange={e => setA("identity_feeling", e.target.value)} placeholder="Escríbelo con tus palabras" /></div>
            <p className="k-sub" style={{ marginTop: 26 }}>{D.IDENTITY.q2}</p>
            <SingleGrid value={a.identity_personality} opts={mk(D.IDENTITY.q2o)} pulse={pulse} onPick={v=>setA("identity_personality",v)} />
            <p className="k-sub" style={{ marginTop: 26 }}>{D.IDENTITY.q3} <span style={{ color: "var(--faint)" }}>(elige dos)</span></p>
            <MultiGrid selected={a.identity_universes||[]} opts={mk(D.IDENTITY.q3o)} pulse={pulse} onToggle={v=>toggle("identity_universes",v,2)} />
            {(a.identity_universes || []).length === 2 && <div className="k-feedback">{D.IDENTITY.closing}</div>}
            <ContinueBtn onNext={next} ok={(a.identity_feeling || "").trim().length >= 3 && !!a.identity_personality && (a.identity_universes || []).length === 2} />
          </>
        );
      }
      case "s10": return (
        <>
          <Heading title="¿Cuándo te gustaría comenzar a darle forma?" />
          <SingleGrid value={a.desired_start} opts={D.TIMING} pulse={pulse} onPick={v=>setA("desired_start",v)} />
          <ContinueBtn onNext={next} ok={!!a.desired_start} label="Ver mi ruta" />
        </>
      );
    }
    return null;
  };

  /* transición breve tras guardar el lead (sin espera artificial larga) */
  useEffect(() => {
    if (phase !== "prep") return;
    const t = setTimeout(() => { setPhase("quiz"); persist({ phase: "quiz" }); }, 1600);
    return () => clearTimeout(t);
  }, [phase]);

  /* ── armazón ── */
  const chapter = step?.chapter ?? 0;
  return (
    <>
      {phase === "quiz" && <Route chapter={chapter} />}

      <main ref={stageRef} className="k-stage">
        <AnimatePresence mode="wait">
          {phase === "cover" && (
            <motion.section key="cover" className="k-scene" {...fx} style={{ textAlign: "center" }}>
              <div className="k-eyebrow">KOMVOS · El Pulso</div>
              <h1 className="k-display" style={{ fontSize: "clamp(34px,6vw,56px)" }}>{D.COVER.title}</h1>
              <p className="k-sub" style={{ margin: "20px auto 0" }}>{D.COVER.text}</p>
              <div>
                <button className="k-cta" onClick={() => { setPhase("lead"); persist({ phase: "lead" }); }}>
                  <span>{D.COVER.button}</span>
                </button>
              </div>
              <p style={{ marginTop: 22, fontSize: 13.5, color: "var(--faint)" }}>{D.COVER.footer}</p>
              <button className="k-linklike" onClick={() => setLegal(true)}>{D.COVER.legalLink}</button>
            </motion.section>
          )}

          {phase === "lead" && (
            <motion.section key="lead" className="k-scene" {...fx}>
              <Heading title={D.LEAD_SCREEN.title} sub={D.LEAD_SCREEN.text} />
              <div className="k-fields">
                <div><label htmlFor="kf-p">Nombre del proyecto o empresa</label>
                  <input id="kf-p" value={lead.project_name} onChange={e => setLead({ ...lead, project_name: e.target.value })} /></div>
                <div><label htmlFor="kf-n">Nombre completo</label>
                  <input id="kf-n" value={lead.full_name} onChange={e => setLead({ ...lead, full_name: e.target.value })} /></div>
                <div><label htmlFor="kf-w">WhatsApp</label>
                  <div className="k-phone">
                    <input aria-label="Código de país" value={lead.cc} readOnly />
                    <input
                      id="kf-w"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="55 0000 0000"
                      maxLength={12}
                      value={lead.phone}
                      onChange={e => setLead({ ...lead, phone: formatMxPhone(e.target.value) })}
                    />
                  </div></div>
                <div><label htmlFor="kf-e">Correo electrónico</label>
                  <input id="kf-e" type="email" value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} /></div>
                <div><label htmlFor="kf-c">Ciudad o estado</label>
                  <input id="kf-c" value={lead.city_state} onChange={e => setLead({ ...lead, city_state: e.target.value })} /></div>
                <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
                  placeholder="No llenar" value={lead.hp} onChange={e => setLead({ ...lead, hp: e.target.value })} />
                <label className="k-consent">
                  <input type="checkbox" checked={lead.terms} onChange={e => setLead({ ...lead, terms: e.target.checked })} />
                  <span>{D.LEAD_SCREEN.consent}{" "}
                    <a href={process.env.NEXT_PUBLIC_PRIVACY_URL || "#"} target="_blank" rel="noopener"
                      style={{ color: "var(--dim)", textDecoration: "underline" }}>Ver aviso de privacidad</a></span>
                </label>
              </div>
              <p className={`k-errmsg ${leadErr ? "on" : ""}`}>{leadErr}</p>
              <div style={{ textAlign: "center" }}>
                <button className="k-cta" disabled={sending} onClick={submitLead}>
                  <span>{sending ? "Guardando…" : D.LEAD_SCREEN.button}</span>
                </button>
              </div>
            </motion.section>
          )}

          {phase === "prep" && (
            <motion.section key="prep" className="k-scene k-transition" {...fx}>
              <div className="k-spinner" aria-hidden />
              <p>{D.LEAD_SCREEN.afterSubmit}</p>
            </motion.section>
          )}

          {phase === "quiz" && step && (
            <motion.section key={step.id} className="k-scene" {...fx}>
              {idx > 0 && (
                <button type="button" className="k-back" onClick={back}>
                  <span aria-hidden>←</span>
                  Pregunta anterior
                </button>
              )}
              {scene()}
            </motion.section>
          )}

          {phase === "analyzing" && (
            <motion.section key="analyzing" className="k-scene k-analyzing" {...fx}>
              <div className="k-spinner" aria-hidden />
              <p className="k-display" style={{ fontSize: "clamp(22px,3.4vw,30px)", maxWidth: "22ch", margin: "0 auto" }}>
                {D.TRANSITIONS.tFinal}
              </p>
              <p className="k-sub" style={{ margin: "18px auto 0", textAlign: "center" }}>
                Estamos leyendo tus respuestas reales. Esto toma unos segundos.
              </p>
            </motion.section>
          )}

          {phase === "result" && result && (
            <motion.section key="result" className="k-result" {...fx}>
              <div className="top">{D.RESULT_SCREEN.top}</div>
              <Compass />
              <h1 className="k-display" style={{ textAlign: "center" }}>{result.clientResult.headline}</h1>
              <div className="k-glass k-block"><div className="lbl">Tu proyecto</div><p>{result.clientResult.openingNarrative}</p></div>
              <div className="k-glass k-block"><div className="lbl">Lo que ya existe</div><p>{result.clientResult.whatAlreadyExists}</p></div>
              <div className="k-glass k-block"><div className="lbl">La oportunidad que vemos</div><p>{result.clientResult.opportunityDetected}</p></div>
              <div className="k-glass k-block"><div className="lbl">La ruta recomendada</div><p>{result.clientResult.recommendedRoute}</p></div>
              <div className="k-glass k-metric" style={{ marginTop: 26 }}>
                <div className="lbl">Tiempo estimado</div>
                <div className="v">{result.timelineRange}</div>
                <p style={{ marginTop: 8, fontSize: 13 }}>{result.clientResult.estimatedTimeline}</p>
              </div>
              <div className="k-glass k-block"><div className="lbl">Variables pendientes</div><p>{result.clientResult.missingVariables}</p></div>
              <div className="k-glass k-block"><div className="lbl">Antes de despedirnos</div><p>{result.clientResult.emotionalClosing}</p></div>
              <div className="k-ctas">
                <a className="k-cta" style={{ marginTop: 0 }} href={process.env.NEXT_PUBLIC_BOOKING_URL || "#"} target="_blank" rel="noopener">
                  <span>{result.clientResult.primaryCta || D.RESULT_SCREEN.ctaPrimary}</span></a>
                <a className="k-ghost" style={{ marginTop: 0 }} href={wa(result.clientResult.whatsappMessage)} target="_blank" rel="noopener">
                  {D.RESULT_SCREEN.ctaWhatsApp}</a>
              </div>
              <p className="k-closing">{D.RESULT_SCREEN.closing}</p>
            </motion.section>
          )}

          {phase === "error" && (
            <motion.section key="err" className="k-scene k-analyzing" {...fx}>
              <p className="k-display" style={{ fontSize: 26 }}>Algo interrumpió la señal.</p>
              <p className="k-sub" style={{ margin: "16px auto 0", textAlign: "center" }}>{errMsg}</p>
              <button className="k-cta" onClick={finish}><span>Intentar de nuevo</span></button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <div className="k-tools">
        <button className="k-tool" aria-label={soundOn ? "Desactivar sonido" : "Activar sonido"}
          title={soundOn ? "Sonido: activado" : "Sonido: desactivado"}
          onClick={() => setSoundOn(!soundOn)}>{soundOn ? "♪" : "∅"}</button>
        <button className="k-tool" aria-label="Alcance, estimaciones y privacidad" title="Alcance, estimaciones y privacidad"
          onClick={() => setLegal(true)}>ⓘ</button>
      </div>

      {legal && (
        <div className="k-drawer" role="dialog" aria-modal="true" aria-label={D.LEGAL.title} onClick={() => setLegal(false)}>
          <div className="k-glass panel" onClick={e => e.stopPropagation()}>
            <h2>{D.LEGAL.title}</h2>
            {D.LEGAL.sections.map(s => (<div key={s.h}><h3>{s.h}</h3><p>{s.t}</p></div>))}
            <p style={{ marginTop: 18 }}>
              <a href={process.env.NEXT_PUBLIC_PRIVACY_URL || "#"} target="_blank" rel="noopener"
                style={{ color: "var(--dim)", textDecoration: "underline" }}>Aviso de privacidad completo</a>
            </p>
            <p style={{ marginTop: 20, fontFamily: "var(--font-display)", color: "var(--text)" }}>{D.LEGAL.closing}</p>
            <div style={{ textAlign: "center" }}>
              <button className="k-ghost" onClick={() => setLegal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── componentes de módulo (identidad estable entre renders) ── */
function OptBtn({
  sel,
  on,
  pulse,
  children,
  variant = "default",
}: {
  sel: boolean;
  on: () => void;
  pulse: () => void;
  children: React.ReactNode;
  variant?: "default" | "priority";
}) {
  const [p, setP] = useState(0);
  return (
    <button
      className={`k-opt ${variant === "priority" ? "k-opt-priority" : ""} ${sel ? "sel" : ""}`}
      onClick={() => { setP(x => x + 1); pulse(); on(); }}
      aria-pressed={sel}
    >
      {p > 0 && <span key={p} className="ring" aria-hidden />}
      <span className="dot" aria-hidden /> {children}
    </button>
  );
}
function SingleGrid({ value, opts, pulse, onPick }: { value?: string; opts: D.Option[]; pulse: () => void; onPick: (v: string) => void }) {
  return (
    <div className="k-opts duo k-single" data-k-incomplete={!value || undefined}>
      {opts.map(o => <OptBtn key={o.id} pulse={pulse} sel={value === o.id} on={() => onPick(o.id)}>{o.label}</OptBtn>)}
    </div>
  );
}
function MultiGrid({ selected, opts, pulse, onToggle }: { selected: string[]; opts: D.Option[]; pulse: () => void; onToggle: (v: string) => void }) {
  return (
    <div className="k-opts duo k-multi" data-k-incomplete={selected.length === 0 || undefined}>
      {opts.map(o => <OptBtn key={o.id} pulse={pulse} sel={selected.includes(o.id)} on={() => onToggle(o.id)}>{o.label}</OptBtn>)}
    </div>
  );
}
function focusFirstIncomplete() {
  const stage = document.querySelector(".k-stage");
  if (!stage) return;
  const target = stage.querySelector<HTMLElement>('[data-k-incomplete="true"]');
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.classList.add("k-attention");
  window.setTimeout(() => target.classList.remove("k-attention"), 1600);
}
function ContinueBtn({ ok = true, label = "Continuar", onNext }: { ok?: boolean; label?: string; onNext: () => void }) {
  return (
    <div className="k-nav-actions">
      <button
        type="button"
        className={`k-cta ${ok ? "" : "is-waiting"}`}
        onClick={() => {
          if (!ok) {
            focusFirstIncomplete();
            return;
          }
          onNext();
        }}
      >
        <span>{ok ? label : "Completa lo pendiente"}</span>
      </button>
    </div>
  );
}
function Heading({ title, sub }: { title: string; sub?: string }) {
  return (<><h1 className="k-display">{title}</h1>{sub && <p className="k-sub">{sub}</p>}</>);
}
