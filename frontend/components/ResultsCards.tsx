"use client";

import { motion } from "framer-motion";
import type { AnalysisResponse, Medicine } from "@/lib/types";
import { useState, useCallback } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ------------ Sub-components ------------

function SectionHeader({
  icon,
  title,
  color = "var(--color-primary-light)",
}: {
  icon: React.ReactNode;
  title: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
        style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold" style={{ color }}>
        {title}
      </h3>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[var(--color-card-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/40 transition-all"
      id="copy-summary-btn"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function ReadAloudButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = useCallback(() => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [speaking, text]);

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
        speaking
          ? "border-[var(--color-accent)] text-[var(--color-accent)]"
          : "border-[var(--color-card-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-accent)]/40"
      }`}
      id="read-aloud-btn"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
      {speaking ? "Stop" : "Read Aloud"}
    </button>
  );
}

function StatusBadge({ status }: { status: "normal" | "high" | "low" }) {
  const colors = {
    normal: { bg: "rgba(0,184,148,0.15)", text: "var(--color-success)", label: "Normal" },
    high: { bg: "rgba(255,107,107,0.15)", text: "var(--color-danger)", label: "High" },
    low: { bg: "rgba(254,202,87,0.15)", text: "var(--color-warning)", label: "Low" },
  };
  const c = colors[status];
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide"
      style={{ background: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}

// ------------ Medicine Schedule Timeline ------------

function MedicineTimeline({ medicines }: { medicines: Medicine[] }) {
  const periods = ["morning", "afternoon", "night"] as const;
  const icons = { morning: "🌅", afternoon: "☀️", night: "🌙" };

  const grouped: Record<string, Medicine[]> = {
    morning: [],
    afternoon: [],
    night: [],
  };

  medicines.forEach((m) => {
    const t = m.timing.toLowerCase();
    if (t.includes("morning")) grouped.morning.push(m);
    if (t.includes("afternoon")) grouped.afternoon.push(m);
    if (t.includes("night")) grouped.night.push(m);
    // if no match, add to morning as default
    if (!t.includes("morning") && !t.includes("afternoon") && !t.includes("night")) {
      grouped.morning.push(m);
    }
  });

  return (
    <motion.div variants={item} className="glass-card p-6">
      <SectionHeader icon="📅" title="Daily Medicine Schedule" color="var(--color-accent)" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {periods.map((period) => (
          <div
            key={period}
            className="rounded-xl p-4 border border-[var(--color-card-border)] bg-[rgba(10,10,20,0.4)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{icons[period]}</span>
              <span className="font-semibold capitalize text-sm">{period}</span>
            </div>
            {grouped[period].length === 0 ? (
              <p className="text-xs text-[var(--color-muted)]">No medicines</p>
            ) : (
              <div className="space-y-2">
                {grouped[period].map((m, i) => (
                  <div
                    key={i}
                    className="text-xs p-2 rounded-lg bg-[rgba(108,92,231,0.08)] border border-[rgba(108,92,231,0.1)]"
                  >
                    <p className="font-semibold text-[var(--color-primary-light)]">{m.name}</p>
                    <p className="text-[var(--color-muted)]">
                      {m.dosage} • {m.with_food} food
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ------------ Main ResultsCard Component ------------

export default function ResultsCards({ data }: { data: AnalysisResponse }) {
  // Build full text for read-aloud
  const fullText = [
    data.summary,
    ...data.medicines.map(
      (m) => `${m.name}: ${m.purpose}. Take ${m.dosage}, ${m.timing}, ${m.with_food} food.`
    ),
    ...data.lab_values.map(
      (l) => `${l.name}: ${l.value}, ${l.status}. ${l.meaning}`
    ),
    ...data.red_flags.map((r) => `Red flag: ${r}`),
    ...data.doctor_questions.map((q, i) => `Question ${i + 1}: ${q}`),
    data.disclaimer,
  ].join(". ");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      {/* Summary */}
      <motion.div variants={item} className="glass-card glow-primary p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <SectionHeader icon="📋" title="Summary" />
          <div className="flex gap-2 mt-1 shrink-0">
            <CopyButton text={data.summary} />
            <ReadAloudButton text={fullText} />
          </div>
        </div>
        <p className="text-[var(--color-foreground)]/90 leading-relaxed">
          {data.summary}
        </p>
        <div className="mt-3">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary-light)] capitalize">
            {data.document_type.replace("_", " ")}
          </span>
        </div>
      </motion.div>

      {/* Medicines */}
      {data.medicines.length > 0 && (
        <motion.div variants={item} className="glass-card p-6">
          <SectionHeader icon="💊" title={`Medicines (${data.medicines.length})`} />
          <div className="grid gap-3 md:grid-cols-2">
            {data.medicines.map((m, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[var(--color-card-border)] bg-[rgba(10,10,20,0.4)] hover:border-[var(--color-primary)]/30 transition-all"
              >
                <p className="font-bold text-[var(--color-primary-light)]">{m.name}</p>
                <p className="text-sm text-[var(--color-foreground)]/80 mt-1">{m.purpose}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(108,92,231,0.12)] text-[var(--color-primary-light)]">
                    {m.dosage}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(0,206,201,0.12)] text-[var(--color-accent)]">
                    {m.timing}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(254,202,87,0.12)] text-[var(--color-warning)]">
                    {m.with_food} food
                  </span>
                </div>
                {m.notes && (
                  <p className="text-xs text-[var(--color-muted)] mt-2 italic">
                    💡 {m.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Medicine Timeline */}
      {data.medicines.length > 0 && (
        <MedicineTimeline medicines={data.medicines} />
      )}

      {/* Lab Values */}
      {data.lab_values.length > 0 && (
        <motion.div variants={item} className="glass-card p-6">
          <SectionHeader icon="🔬" title={`Lab Values (${data.lab_values.length})`} color="var(--color-accent)" />
          <div className="space-y-3">
            {data.lab_values.map((l, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-[var(--color-card-border)] bg-[rgba(10,10,20,0.4)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{l.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      Normal range: {l.normal_range}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{l.value}</span>
                    <StatusBadge status={l.status} />
                  </div>
                </div>
                <p className="text-sm text-[var(--color-foreground)]/75 mt-2">
                  {l.meaning}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Red Flags */}
      {data.red_flags.length > 0 && (
        <motion.div variants={item} className="glass-card glow-danger p-6 border-[var(--color-danger)]/20">
          <SectionHeader icon="🚨" title="Red Flags — Please Consult Your Doctor" color="var(--color-danger)" />
          <div className="space-y-2">
            {data.red_flags.map((flag, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(255,107,107,0.06)] border border-[rgba(255,107,107,0.12)]"
              >
                <span className="text-[var(--color-danger)] mt-0.5 shrink-0">⚠️</span>
                <p className="text-sm">{flag}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Doctor Questions */}
      {data.doctor_questions.length > 0 && (
        <motion.div variants={item} className="glass-card p-6">
          <SectionHeader icon="❓" title="Questions to Ask Your Doctor" color="var(--color-accent-light)" />
          <div className="space-y-2">
            {data.doctor_questions.map((q, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(0,206,201,0.06)] border border-[rgba(0,206,201,0.1)]"
              >
                <span className="text-[var(--color-accent)] font-bold text-sm shrink-0">
                  {i + 1}.
                </span>
                <p className="text-sm">{q}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        variants={item}
        className="glass-card p-5 border-[var(--color-warning)]/15"
      >
        <div className="flex items-start gap-3">
          <span className="text-lg shrink-0">⚕️</span>
          <p className="text-sm text-[var(--color-muted)] italic leading-relaxed">
            {data.disclaimer}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
