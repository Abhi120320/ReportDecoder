"""Gemini API client helper for the Report Decoder."""

import os
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

_client_configured = False

def configure_client():
    """Configure the Gemini client.

    Raises:
        RuntimeError: If GEMINI_API_KEY is not set.
    """
    global _client_configured
    if not _client_configured:
        if not GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. Add it to backend/.env"
            )
        genai.configure(api_key=GEMINI_API_KEY)
        _client_configured = True

def get_model():
    configure_client()
    return genai.GenerativeModel(GEMINI_MODEL)
