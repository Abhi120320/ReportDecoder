"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-2 border-[var(--color-primary)] border-t-transparent animate-spin" />
    </div>
  ),
});

const features = [
  {
    icon: "🌐",
    title: "8 Languages",
    desc: "Get explanations in English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, or Bengali.",
  },
  {
    icon: "🔬",
    title: "Lab Values Decoded",
    desc: "Understand what high or low values mean in simple, everyday words.",
  },
  {
    icon: "💊",
    title: "Medicine Schedule",
    desc: "See your daily medicine timeline — morning, afternoon, and night — at a glance.",
  },
  {
    icon: "🚨",
    title: "Red Flag Alerts",
    desc: "Important warnings are highlighted so you know what to discuss with your doctor.",
  },
  {
    icon: "🔊",
    title: "Read Aloud",
    desc: "Listen to the explanation using your browser's text-to-speech — no extra app needed.",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Your reports are processed in real-time and never stored on any server.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[var(--color-primary)] rounded-full blur-[120px] opacity-15 pointer-events-none" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[var(--color-accent)] rounded-full blur-[120px] opacity-10 pointer-events-none" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="gradient-text">Report Decoder</span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--color-muted)] mt-4 font-light">
              Your medical report, decoded in your language.
            </p>
          </motion.div>

          <HeroScene />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-[var(--color-primary)]/25"
              id="get-started-btn"
            >
              Decode Your Report
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16 gradient-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How It Helps You
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="glass-card p-6 hover:border-[var(--color-primary)]/30 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="text-lg font-bold mt-3 mb-2">{f.title}</h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-card-border)] py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs text-[var(--color-muted)] max-w-xl mx-auto">
            ⚕️ Report Decoder is an educational aid and does not provide medical
            diagnosis or advice. Always consult a qualified doctor.
          </p>
        </div>
      </footer>
    </main>
  );
}
