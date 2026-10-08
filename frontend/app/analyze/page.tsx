"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import LoadingScanner from "@/components/LoadingScanner";
import ResultsCards from "@/components/ResultsCards";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import type { AnalysisResponse, SupportedLanguage } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const LS_KEY = "report-decoder-last-result";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  // Load last result from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) setResult(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save result to localStorage
  useEffect(() => {
    if (result) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(result));
      } catch {
        // ignore
      }
    }
  }, [result]);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const detail = body?.detail || `Server returned ${res.status}`;
        throw new Error(detail);
      }

      const data: AnalysisResponse = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [file, language]);

  const clearAll = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    localStorage.removeItem(LS_KEY);
  }, []);

  return (
    <main className="flex-1 min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--color-card-border)] bg-[rgba(5,5,16,0.8)] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 group" id="home-link">
            <span className="text-xl">🩺</span>
            <span className="font-bold gradient-text text-lg">
              Report Decoder
            </span>
          </Link>
          {result && (
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-card-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-primary)]/40 transition-all"
              id="new-report-btn"
            >
              + New Report
            </button>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* Upload section — show when no result and not loading */}
          {!result && !loading && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">
                  Analyze Your Report
                </h1>
                <p className="text-[var(--color-muted)] mt-2">
                  Upload a medical report or prescription to get started
                </p>
              </div>

              <FileUpload
                file={file}
                onFileSelect={setFile}
                onClear={() => setFile(null)}
              />

              {/* Language selector */}
              <div className="glass-card p-5">
                <label
                  htmlFor="language-select"
                  className="text-sm font-medium text-[var(--color-muted)] mb-2 block"
                >
                  Explain in
                </label>
                <select
                  id="language-select"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as SupportedLanguage)
                  }
                  className="w-full bg-[rgba(10,10,20,0.6)] border border-[var(--color-card-border)] rounded-xl px-4 py-3 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] transition-colors appearance-none cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Analyze button */}
              <motion.button
                onClick={handleAnalyze}
                disabled={!file}
                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
                  file
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white hover:scale-[1.02] shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer"
                    : "bg-[rgba(108,92,231,0.15)] text-[var(--color-muted)] cursor-not-allowed"
                }`}
                whileTap={file ? { scale: 0.98 } : undefined}
                id="analyze-btn"
              >
                {file ? "🔍 Analyze Report" : "Upload a file to continue"}
              </motion.button>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-[rgba(255,107,107,0.08)] border border-[rgba(255,107,107,0.2)] text-[var(--color-danger)] text-sm"
                  id="error-message"
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingScanner />
            </motion.div>
          )}

          {/* Results */}
          {result && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ResultsCards data={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
