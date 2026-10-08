"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const problems = [
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Medical Jargon",
    desc: "Reports are filled with complex terms and numbers that are impossible for non-doctors to understand.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "Language Barriers",
    desc: "Most reports are in English, leaving millions of patients in India unable to read their own health data.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Anxiety While Waiting",
    desc: "Waiting days for a doctor's appointment to understand your lab results causes unnecessary stress.",
  },
];

const steps = [
  {
    num: "01",
    title: "Upload",
    desc: "Take a photo or upload your medical report, prescription, or lab results securely.",
  },
  {
    num: "02",
    title: "AI Decodes",
    desc: "Our AI scans the document and breaks down the medical jargon into simple terms.",
  },
  {
    num: "03",
    title: "Read & Listen",
    desc: "Get a clear explanation in your preferred regional language. You can even listen to it.",
  },
];

const features = [
  {
    title: "Multilingual Explanations",
    desc: "Support for 8+ Indian languages including Hindi, Kannada, Tamil, and more.",
  },
  {
    title: "Lab-Value Highlighting",
    desc: "Instantly see if your results are normal, high, or low with simple text and icons.",
  },
  {
    title: "Prescription Breakdown",
    desc: "Clear timelines for your medicines: morning, afternoon, and night.",
  },
  {
    title: "Plain-Language Summary",
    desc: "A quick, easy-to-read overview of what your document actually means.",
  },
  {
    title: "Privacy-First Processing",
    desc: "We process your reports in real-time and never store them on any database.",
  },
  {
    title: "Read-Aloud Feature",
    desc: "Listen to the explanation using built-in text-to-speech for better accessibility.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1 bg-[var(--color-background)]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--color-background)]/90 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="text-base font-semibold text-[var(--color-foreground)] tracking-tight">Report Decoder</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-muted)]">
            <a href="#problem" className="hover:text-[var(--color-foreground)] transition-colors">Problem</a>
            <a href="#how-it-works" className="hover:text-[var(--color-foreground)] transition-colors">How it works</a>
            <a href="#features" className="hover:text-[var(--color-foreground)] transition-colors">Features</a>
            <a href="#privacy" className="hover:text-[var(--color-foreground)] transition-colors">Privacy</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 max-w-[1200px] mx-auto flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-muted)] text-xs font-medium mb-8">
              AI-powered • 8+ Indian languages
            </div>
            <h1 className="font-semibold tracking-tight text-[var(--color-foreground)] mb-6 leading-[1.1]" style={{ fontSize: "clamp(2.5rem, 5vw, 4.25rem)" }}>
              Patient-friendly medical reports that speak your language.
            </h1>
            <p className="text-lg text-[var(--color-muted)] mb-10 max-w-xl leading-[1.6]">
              Upload your medical report, prescription, or lab results. Get a simple, patient-friendly explanation in over 8 regional languages instantly.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link href="/analyze" className="btn-primary">
                Try it now
              </Link>
              <a href="#how-it-works" className="btn-secondary">
                Learn more
              </a>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--color-muted)]">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                No data stored
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Private
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                Free to try
              </span>
            </div>
          </motion.div>

          {/* Right Column: Mockup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-6 relative"
          >
            <div className="card p-6 border-[var(--color-border)] shadow-sm bg-[var(--color-surface)]">
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {["English", "हिन्दी", "ಕನ್ನಡ", "தமிழ்", "తెలుగు", "മലയാളം", "বাংলা", "मराठी"].map((lang, i) => (
                  <span key={i} className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap border ${i === 2 ? "bg-[var(--color-foreground)] text-[var(--color-background)] border-[var(--color-foreground)] font-medium" : "bg-[var(--color-surface-alt)] text-[var(--color-muted)] border-[var(--color-border)]"}`}>
                    {lang}
                  </span>
                ))}
              </div>
              <div className="card-fill p-5 border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-4 border-b border-[var(--color-border)] pb-3">
                  <span className="text-sm font-medium text-[var(--color-foreground)]">Hemoglobin (Hb)</span>
                  <span className="text-xs border border-[var(--color-border)] text-[var(--color-foreground)] bg-[var(--color-surface)] px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                    ಕಡಿಮೆ (Low)
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">ನಿಮ್ಮ ಫಲಿತಾಂಶ:</span>
                    <span className="text-[var(--color-foreground)] font-mono font-medium">10.2 g/dL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-muted)]">ಸಾಮಾನ್ಯ ಶ್ರೇಣಿ:</span>
                    <span className="text-[var(--color-muted)] font-mono">12.0 - 15.5 g/dL</span>
                  </div>
                  <p className="text-sm text-[var(--color-foreground)] mt-4 pt-4 border-t border-[var(--color-border)] leading-relaxed">
                    ನಿಮ್ಮ ಹಿಮೋಗ್ಲೋಬಿನ್ ಮಟ್ಟವು ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಕಡಿಮೆಯಾಗಿದೆ. ಇದು ರಕ್ತಹೀನತೆಯನ್ನು (ಅನೀಮಿಯಾ) ಸೂಚಿಸಬಹುದು. ದಯವಿಟ್ಟು ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="py-24 px-6 bg-[var(--color-surface-alt)] border-t border-[var(--color-border)] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1200px] mx-auto"
        >
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-semibold text-[var(--color-foreground)] tracking-tight mb-4">Why we built this</h2>
            <p className="text-[var(--color-muted)] text-lg leading-[1.6]">
              Patients receive medical reports full of jargon they can&apos;t understand, and language barriers make it worse, especially in India.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card p-8"
              >
                <div className="mb-6">{p.icon}</div>
                <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-3">{p.title}</h3>
                <p className="text-[var(--color-muted)] leading-[1.6] text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 max-w-[1200px] mx-auto overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold text-[var(--color-foreground)] tracking-tight mb-16"
        >
          How it works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="flex flex-col items-start"
            >
              <div className="text-[var(--color-border)] font-mono text-5xl font-bold mb-6">
                {s.num}
              </div>
              <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-3">{s.title}</h3>
              <p className="text-[var(--color-muted)] leading-[1.6] text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 max-w-[1200px] mx-auto border-t border-[var(--color-border)] overflow-hidden">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-semibold text-[var(--color-foreground)] tracking-tight mb-16"
        >
          Features built for patients
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card p-6"
            >
              <h3 className="text-base font-medium text-[var(--color-foreground)] mb-2">
                {f.title}
              </h3>
              <p className="text-[var(--color-muted)] text-sm leading-[1.6]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About & Privacy */}
      <section id="privacy" className="py-24 px-6 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 border-t border-[var(--color-border)] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)] tracking-tight mb-4">About the project</h2>
          <p className="text-[var(--color-muted)] leading-[1.6] mb-8 text-sm">
            Report Decoder uses AI to turn complex medical documents into simple, patient-friendly explanations in regional languages. We believe everyone has the right to understand their own health data without anxiety or confusion.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-[var(--color-foreground)] tracking-tight mb-4">Privacy & Safety</h2>
          <p className="text-[var(--color-muted)] leading-[1.6] mb-8 text-sm">
            Your privacy is our priority. Documents are processed in real-time in memory and are never stored, saved, or used to train models. 
          </p>
          <div className="p-5 rounded-lg bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-sm text-[var(--color-foreground)] leading-[1.6]">
            <span className="font-semibold block mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Medical Disclaimer
            </span>
            <span className="text-[var(--color-muted)]">This tool is an educational aid and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor with any questions regarding a medical condition.</span>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="bg-[var(--color-foreground)] py-24 px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-[1200px] mx-auto text-center"
        >
          <h2 className="text-3xl font-semibold text-[var(--color-background)] tracking-tight mb-8">Ready to understand your reports?</h2>
          <Link href="/analyze" className="btn-secondary">
            Decode Your First Report
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-sm text-[var(--color-muted)] border-t border-[var(--color-border)] bg-[var(--color-background)]">
        <p>&copy; 2026 Report Decoder. All rights reserved.</p>
      </footer>
    </main>
  );
}
