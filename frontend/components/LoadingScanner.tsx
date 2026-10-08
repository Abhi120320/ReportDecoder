"use client";

import { motion } from "framer-motion";

export default function LoadingScanner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-8 py-16"
    >
      {/* Scanner animation */}
      <div className="relative w-40 h-52 rounded-2xl overflow-hidden glass-card glow-primary">
        {/* Document lines */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((top, i) => (
          <div
            key={i}
            className="absolute left-4 right-4 h-1.5 rounded bg-[var(--color-primary)]/20"
            style={{ top: `${top * 100}%`, width: `${60 + Math.random() * 25}%` }}
          />
        ))}
        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Corner marks */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--color-accent)] rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--color-accent)] rounded-tr" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--color-accent)] rounded-bl" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--color-accent)] rounded-br" />
      </div>

      {/* Text */}
      <div className="text-center">
        <motion.p
          className="text-lg font-semibold gradient-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Analyzing your report...
        </motion.p>
        <p className="text-sm text-[var(--color-muted)] mt-2">
          Our AI is reading and decoding your medical document
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
