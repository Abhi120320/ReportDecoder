// Types for the Report Decoder API response

export interface Medicine {
  name: string;
  purpose: string;
  dosage: string;
  timing: string;
  with_food: string;
  notes: string;
}

export interface LabValue {
  name: string;
  value: string;
  normal_range: string;
  status: "normal" | "high" | "low";
  meaning: string;
}

export interface AnalysisResponse {
  summary: string;
  document_type: "prescription" | "lab_report" | "other";
  medicines: Medicine[];
  lab_values: LabValue[];
  red_flags: string[];
  doctor_questions: string[];
  disclaimer: string;
}

export const SUPPORTED_LANGUAGES = [
  "English",
  "Hindi",
  "Kannada",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Marathi",
  "Bengali",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
