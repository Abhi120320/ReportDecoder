import { motion } from "framer-motion";
import FileUpload from "./FileUpload";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import type { SupportedLanguage } from "@/lib/types";

interface UploadSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  handleAnalyze: () => void;
  error: string | null;
}

export default function UploadSection({
  file,
  setFile,
  language,
  setLanguage,
  handleAnalyze,
  error,
}: UploadSectionProps) {
  return (
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
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-4 py-3 text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-foreground)] transition-colors appearance-none cursor-pointer font-medium"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <motion.button
        onClick={() => handleAnalyze()}
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
  );
}
