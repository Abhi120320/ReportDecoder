"""
Report Decoder — Backend
FastAPI service that accepts medical reports and returns
patient-friendly explanations via the Gemini API.
"""

import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel

load_dotenv()

# ---------------------------------------------------------------------------
# Pydantic response models
# ---------------------------------------------------------------------------

class Medicine(BaseModel):
    name: str
    purpose: str
    dosage: str
    timing: str  # morning / afternoon / night
    with_food: str  # before / after / any
    notes: str


class LabValue(BaseModel):
    name: str
    value: str
    normal_range: str
    status: Literal["normal", "high", "low"]
    meaning: str


class AnalysisResponse(BaseModel):
    summary: str
    document_type: Literal["prescription", "lab_report", "other"]
    medicines: list[Medicine]
    lab_values: list[LabValue]
    red_flags: list[str]
    doctor_questions: list[str]
    disclaimer: str


# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(title="Report Decoder API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

_client = None


def get_client() -> genai.Client:
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Add it to backend/.env"
            )
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(
    file: UploadFile = File(...),
    language: str = Form("English"),
):
    # --- validate mime type ---
    if file.content_type not in ALLOWED_MIME:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. "
                   f"Allowed: {', '.join(sorted(ALLOWED_MIME))}",
        )

    # --- validate size ---
    file_bytes = await file.read()
    if len(file_bytes) > MAX_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({len(file_bytes)} bytes). Max allowed: {MAX_SIZE} bytes (10 MB).",
        )

    # --- build prompt ---
    prompt = f"""You are a patient-friendly medical report explainer.

Analyze the uploaded medical document (prescription, lab report, or other medical document).

RULES:
1. Write ALL text fields in **{language}** using simple, everyday words that any patient can understand.
2. Never diagnose or prescribe. Always advise consulting a qualified doctor.
3. If the document is unreadable or not a medical document, say so clearly in the summary field and leave all lists empty.
4. For medicines, include timing (morning/afternoon/night) and whether to take before/after/any food.
5. For lab values, indicate if each value is normal, high, or low and explain what it means in simple terms.
6. Highlight any red flags that need urgent medical attention.
7. Suggest 3 to 5 questions the patient should ask their doctor.
8. Always include a disclaimer that this is an educational tool and not medical advice.

Return a valid JSON object matching the schema exactly."""

    # --- call Gemini ---
    file_part = types.Part.from_bytes(
        data=file_bytes,
        mime_type=file.content_type,
    )

    try:
        response = get_client().models.generate_content(
            model=GEMINI_MODEL,
            contents=[file_part, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResponse,
            ),
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e}")

    import json
    try:
        result = json.loads(response.text)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Failed to parse Gemini response: {e}")

    return AnalysisResponse(**result)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
