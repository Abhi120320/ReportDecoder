"""
Report Decoder — Backend
FastAPI service that accepts medical reports and returns
patient-friendly explanations via the Gemini API.
"""

import os
import base64
import json
import fitz  # PyMuPDF
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from groq import Groq
from pydantic import BaseModel, Field

load_dotenv()

# ---------------------------------------------------------------------------
# Pydantic response models
# ---------------------------------------------------------------------------

class Medicine(BaseModel):
    name: str = Field(default="")
    purpose: str = Field(default="")
    dosage: str = Field(default="")
    timing: str = Field(default="")
    with_food: str = Field(default="")
    notes: str = Field(default="")


class LabValue(BaseModel):
    name: str = Field(default="")
    value: str = Field(default="")
    normal_range: str = Field(default="")
    status: Literal["normal", "high", "low"] = Field(default="normal")
    meaning: str = Field(default="")


class AnalysisResponse(BaseModel):
    summary: str = Field(default="")
    document_type: Literal["prescription", "lab_report", "other"] = Field(default="other")
    medicines: list[Medicine] = Field(default_factory=list)
    lab_values: list[LabValue] = Field(default_factory=list)
    red_flags: list[str] = Field(default_factory=list)
    doctor_questions: list[str] = Field(default_factory=list)
    disclaimer: str = Field(default="")


# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Report Decoder API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Hide stack traces in production
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://reportdecoder-ten.vercel.app"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "application/pdf"}
MAX_SIZE = 4 * 1024 * 1024  # 4 MB

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.2-11b-vision-instruct")

_client = None


def get_client() -> Groq:
    global _client
    if _client is None:
        if not GROQ_API_KEY:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to backend/.env"
            )
        _client = Groq(api_key=GROQ_API_KEY)
    return _client

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------


@app.get("/health")
@limiter.limit("10/minute")
async def health(request: Request):
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalysisResponse)
@limiter.limit("5/minute")
async def analyze(
    request: Request,
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
            detail=f"File too large ({len(file_bytes)} bytes). Max allowed: {MAX_SIZE} bytes (4 MB).",
        )

    # --- build prompt ---
    prompt = f"""You are a patient-friendly medical report explainer.

Analyze the uploaded medical document (prescription, lab report, or other medical document).

CRITICAL REQUIREMENT: YOU MUST TRANSLATE ALL OF YOUR ANALYSIS AND EXPLANATIONS INTO **{language}**!
The JSON keys MUST remain in English, but every single string VALUE inside the JSON MUST be written in {language}.
If you write the values in English instead of {language}, you have failed.
DO NOT use English for the values. USE {language} ONLY!

RULES:
1. Write ALL text fields in **{language}** using simple, everyday words that any patient can understand.
2. Never diagnose or prescribe. Always advise consulting a qualified doctor.
3. If the document is unreadable or not a medical document, say so clearly in the summary field (IN {language}) and leave all lists empty.
4. For medicines, include timing (morning/afternoon/night) and whether to take before/after/any food.
5. For lab values, indicate if each value is normal, high, or low and explain what it means in simple terms.
6. Highlight any red flags that need urgent medical attention.
7. Suggest 3 to 5 questions the patient should ask their doctor.
8. Always include a disclaimer that this is an educational tool and not medical advice.

Return a valid JSON object matching this schema exactly:
{json.dumps(AnalysisResponse.model_json_schema(), indent=2)}"""

    # --- Process file into images ---
    base64_images = []
    
    if file.content_type == "application/pdf":
        try:
            # Open PDF with PyMuPDF
            doc = fitz.open("pdf", file_bytes)
            # Render up to first 3 pages to avoid exceeding token limits
            for page_num in range(min(3, len(doc))):
                page = doc.load_page(page_num)
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better OCR
                img_data = pix.tobytes("png")
                b64 = base64.b64encode(img_data).decode("utf-8")
                base64_images.append(f"data:image/png;base64,{b64}")
            doc.close()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to process PDF: {e}")
    else:
        # It's an image
        b64 = base64.b64encode(file_bytes).decode("utf-8")
        base64_images.append(f"data:{file.content_type};base64,{b64}")

    # --- call Groq ---
    content_parts = [{"type": "text", "text": prompt}]
    for b64_img in base64_images:
        content_parts.append({
            "type": "image_url",
            "image_url": {"url": b64_img}
        })

    import time
    
    max_retries = 2
    for attempt in range(max_retries):
        try:
            response = get_client().chat.completions.create(
                model=GROQ_MODEL,
                messages=[{"role": "user", "content": content_parts}],
                temperature=0.0,
                response_format={"type": "json_object"},
                timeout=30.0,
            )
            response_text = response.choices[0].message.content
            break
        except Exception as e:
            if attempt == max_retries - 1:
                raise HTTPException(status_code=502, detail=f"Groq API error after retries: {e}. Please try again later.")
            time.sleep(1)

    try:
        result = json.loads(response_text)
    except (json.JSONDecodeError, ValueError) as e:
        raise HTTPException(status_code=502, detail=f"Failed to parse Groq response: {e}")

    return AnalysisResponse(**result)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
