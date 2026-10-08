"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import LoadingScanner from "@/components/LoadingScanner";
import ResultsCards from "@/components/ResultsCards";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import type { AnalysisResponse, SupportedLanguage } from "@/lib/types";

const API_URL = "/api";
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
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => setResult(parsed), 0);
      }
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
      <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group" id="home-link">
            <svg className="w-5 h-5 text-[var(--color-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="font-semibold text-[var(--color-foreground)] text-base">
              Report Decoder
            </span>
          </Link>
          {result && (
            <button
              onClick={clearAll}
              className="text-xs px-3 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:border-[var(--color-foreground)] transition-all"
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
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-foreground)]">
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
              <div className="card p-6">
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
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)] transition-colors appearance-none cursor-pointer font-medium"
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
                  className={`w-full py-4 rounded-lg font-medium transition-all ${
                  file
                    ? "btn-primary w-full cursor-pointer"
                    : "btn-primary w-full opacity-50 cursor-not-allowed"
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
                  className="p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-foreground)] text-sm"
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
