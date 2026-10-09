"""Groq API client helper for the Report Decoder."""

import os

from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
_raw_model = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
DECOMMISSIONED_MODELS = ["llama-3.2-11b-vision-preview", "llama-3.2-90b-vision-preview"]
GROQ_MODEL = "qwen/qwen3.8-27b" if _raw_model in DECOMMISSIONED_MODELS else _raw_model

_client = None

def get_client() -> Groq:
    """Return a singleton instance of the Groq client.

    Raises:
        RuntimeError: If GROQ_API_KEY is not set.
    """
    global _client
    if _client is None:
        if not GROQ_API_KEY:
            raise RuntimeError(
                "GROQ_API_KEY is not set. Add it to backend/.env"
            )
        _client = Groq(api_key=GROQ_API_KEY)
    return _client
