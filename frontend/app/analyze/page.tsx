"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import UploadSection from "@/components/UploadSection";
import { SUPPORTED_LANGUAGES } from "@/lib/types";

const LoadingScanner = dynamic(() => import("@/components/LoadingScanner"), { ssr: false });
const ResultsCards = dynamic(() => import("@/components/ResultsCards"), { ssr: false });
import type { AnalysisResponse, SupportedLanguage } from "@/lib/types";

const API_URL = "/api";
const LS_KEY = "report-decoder-last-result";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage>("English");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [resultCache, setResultCache] = useState<Record<string, AnalysisResponse>>({});

  // Load last result from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          setResult(parsed.result);
          setResultCache(parsed.cache || { [parsed.language]: parsed.result });
          setLanguage(parsed.language);
        }, 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save result to localStorage
  useEffect(() => {
    if (result) {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ result, cache: resultCache, language }));
      } catch {
        // ignore
      }
    }
  }, [result, resultCache, language]);



  const clearAll = () => {
    setFile(null);
    setResult(null);
    setResultCache({});
    setError(null);
    localStorage.removeItem(LS_KEY);
  };

  const switchLanguage = async (newLang: SupportedLanguage) => {
    if (newLang === language) return;
    setLanguage(newLang);
    if (resultCache[newLang]) {
      setResult(resultCache[newLang]);
      return;
    }
    // Else, analyze again with the new language
    await handleAnalyze(newLang);
  };

  const handleAnalyze = async (targetLanguage?: SupportedLanguage) => {
    const lang = targetLanguage || language;
    if (!file) return;

    setLoading(true);
    setError(null);
    
    // Don't clear result immediately to allow a skeleton/loading overlay, or just clear it if switching
    if (!resultCache[lang]) {
        setResult(null);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", lang);

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
      setResultCache((prev) => ({ ...prev, [lang]: data }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
            <UploadSection
              file={file}
              setFile={setFile}
              language={language}
              setLanguage={setLanguage}
              handleAnalyze={() => handleAnalyze()}
              error={error}
            />
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[var(--color-foreground)]">Your Analysis</h2>
                <div className="flex items-center gap-2">
                   <label htmlFor="res-lang" className="text-sm text-[var(--color-muted)]">Translate to:</label>
                   <select
                     id="res-lang"
                     value={language}
                     onChange={(e) => switchLanguage(e.target.value as SupportedLanguage)}
                     className="bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-md px-3 py-1.5 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)]"
                   >
                     {SUPPORTED_LANGUAGES.map((lang) => (
                       <option key={lang} value={lang}>{lang}</option>
                     ))}
                   </select>
                </div>
              </div>
              <ResultsCards data={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
