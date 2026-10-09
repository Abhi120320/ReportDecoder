"""
Comprehensive tests for the Report Decoder backend API.

All Groq API calls are mocked — no external network access is required.
"""

import json
from unittest.mock import MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from main import app, limiter
from models import AnalysisResponse, LabValue, Medicine

# Disable rate limiting for all tests
limiter.enabled = False

client = TestClient(app, raise_server_exceptions=False)


# ---------------------------------------------------------------------------
# Fixtures & helpers
# ---------------------------------------------------------------------------

VALID_ANALYSIS_JSON = json.dumps({
    "summary": "Normal blood work results",
    "document_type": "lab_report",
    "medicines": [],
    "lab_values": [
        {
            "name": "Hemoglobin",
            "value": "14.5",
            "normal_range": "12-16 g/dL",
            "status": "normal",
            "meaning": "Within normal limits",
        }
    ],
    "red_flags": [],
    "doctor_questions": ["Ask about follow-up schedule"],
    "disclaimer": "This is not medical advice.",
})

PRESCRIPTION_JSON = json.dumps({
    "summary": "Prescription for antibiotics",
    "document_type": "prescription",
    "medicines": [
        {
            "name": "Amoxicillin",
            "purpose": "Bacterial infection",
            "dosage": "500mg",
            "timing": "morning, afternoon, night",
            "with_food": "after",
            "notes": "Complete the full course",
        }
    ],
    "lab_values": [],
    "red_flags": ["Allergic reaction risk"],
    "doctor_questions": ["Ask about duration"],
    "disclaimer": "Consult your doctor.",
})

MALFORMED_JSON = "{ this is not valid json !!!"


def _make_mock_groq_response(content: str) -> MagicMock:
    """Build a mock that mimics ``groq.chat.completions.create()`` return."""
    mock_message = MagicMock()
    mock_message.content = content
    mock_choice = MagicMock()
    mock_choice.message = mock_message
    mock_response = MagicMock()
    mock_response.choices = [mock_choice]
    return mock_response


def _tiny_png() -> bytes:
    """Return the smallest valid 1×1 white PNG (67 bytes)."""
    import base64

    return base64.b64decode(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4"
        "nGP4z8BQDwAEgAF/pooBPQAAAABJRU5ErkJggg=="
    )


def _tiny_pdf() -> bytes:
    """Return a minimal valid PDF."""
    return (
        b"%PDF-1.0\n1 0 obj<</Pages 2 0 R>>endobj\n"
        b"2 0 obj<</Kids[3 0 R]/Count 1>>endobj\n"
        b"3 0 obj<</MediaBox[0 0 612 792]>>endobj\n"
        b"trailer<</Root 1 0 R>>"
    )


# ---------------------------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------------------------

class TestHealthEndpoint:
    """Tests for GET /health."""

    def test_health_returns_ok(self) -> None:
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# File-validation tests (no Groq calls needed)
# ---------------------------------------------------------------------------

class TestFileValidation:
    """Tests for upload validation in POST /analyze."""

    def test_reject_unsupported_file_type(self) -> None:
        resp = client.post(
            "/analyze",
            files={"file": ("test.txt", b"hello", "text/plain")},
            data={"language": "English"},
        )
        assert resp.status_code == 400
        assert "Unsupported file type" in resp.json()["detail"]

    def test_reject_oversize_file(self) -> None:
        big = b"x" * (4 * 1024 * 1024 + 1)
        resp = client.post(
            "/analyze",
            files={"file": ("big.png", big, "image/png")},
            data={"language": "English"},
        )
        assert resp.status_code == 413
        assert "File too large" in resp.json()["detail"]

    def test_reject_missing_file(self) -> None:
        resp = client.post("/analyze", data={"language": "English"})
        assert resp.status_code == 422  # FastAPI validation


# ---------------------------------------------------------------------------
# Successful analysis flow
# ---------------------------------------------------------------------------

class TestAnalyzeSuccess:
    """Tests for a successful POST /analyze round-trip (Groq mocked)."""

    @patch("main.get_client")
    def test_image_upload_returns_valid_response(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = (
            _make_mock_groq_response(VALID_ANALYSIS_JSON)
        )
        mock_gc.return_value = mock_client

        resp = client.post(
            "/analyze",
            files={"file": ("report.png", _tiny_png(), "image/png")},
            data={"language": "English"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["document_type"] == "lab_report"
        assert len(body["lab_values"]) == 1
        assert body["lab_values"][0]["status"] == "normal"

    @patch("main.get_client")
    def test_pdf_upload_returns_valid_response(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = (
            _make_mock_groq_response(VALID_ANALYSIS_JSON)
        )
        mock_gc.return_value = mock_client

        resp = client.post(
            "/analyze",
            files={"file": ("report.pdf", _tiny_pdf(), "application/pdf")},
            data={"language": "English"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["summary"] == "Normal blood work results"

    @patch("main.get_client")
    def test_prescription_analysis(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = (
            _make_mock_groq_response(PRESCRIPTION_JSON)
        )
        mock_gc.return_value = mock_client

        resp = client.post(
            "/analyze",
            files={"file": ("rx.png", _tiny_png(), "image/png")},
            data={"language": "Hindi"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["document_type"] == "prescription"
        assert len(body["medicines"]) == 1
        assert body["medicines"][0]["name"] == "Amoxicillin"


# ---------------------------------------------------------------------------
# Language selection
# ---------------------------------------------------------------------------

class TestLanguageSelection:
    """Verify that the chosen language is forwarded to the prompt."""

    @patch("main.get_client")
    def test_language_forwarded_to_prompt(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = (
            _make_mock_groq_response(VALID_ANALYSIS_JSON)
        )
        mock_gc.return_value = mock_client

        client.post(
            "/analyze",
            files={"file": ("r.png", _tiny_png(), "image/png")},
            data={"language": "Tamil"},
        )
        call_args = mock_client.chat.completions.create.call_args
        prompt_text = call_args.kwargs["messages"][0]["content"][0]["text"]
        assert "Tamil" in prompt_text

    @patch("main.get_client")
    def test_default_language_is_english(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = (
            _make_mock_groq_response(VALID_ANALYSIS_JSON)
        )
        mock_gc.return_value = mock_client

        client.post(
            "/analyze",
            files={"file": ("r.png", _tiny_png(), "image/png")},
        )
        call_args = mock_client.chat.completions.create.call_args
        prompt_text = call_args.kwargs["messages"][0]["content"][0]["text"]
        assert "English" in prompt_text


# ---------------------------------------------------------------------------
# Error handling
# ---------------------------------------------------------------------------

class TestErrorHandling:
    """Tests for Groq failures and malformed responses."""

    @patch("main.get_client")
    def test_groq_timeout_returns_502(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = TimeoutError("timed out")
        mock_gc.return_value = mock_client

        resp = client.post(
            "/analyze",
            files={"file": ("r.png", _tiny_png(), "image/png")},
            data={"language": "English"},
        )
        assert resp.status_code == 502
        assert "Groq API error" in resp.json()["detail"]

    @patch("main.get_client")
    def test_groq_generic_error_returns_502(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = RuntimeError("API down")
        mock_gc.return_value = mock_client

        resp = client.post(
            "/analyze",
            files={"file": ("r.png", _tiny_png(), "image/png")},
            data={"language": "English"},
        )
        assert resp.status_code == 502

    @patch("main.get_client")
    def test_malformed_ai_response_returns_502(self, mock_gc: MagicMock) -> None:
        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = (
            _make_mock_groq_response(MALFORMED_JSON)
        )
        mock_gc.return_value = mock_client

        resp = client.post(
            "/analyze",
            files={"file": ("r.png", _tiny_png(), "image/png")},
            data={"language": "English"},
        )
        assert resp.status_code == 502
        assert "Failed to parse" in resp.json()["detail"]


# ---------------------------------------------------------------------------
# Pydantic model unit tests
# ---------------------------------------------------------------------------

class TestPydanticModels:
    """Validate Pydantic models and edge cases."""

    def test_lab_value_default_status_is_normal(self) -> None:
        lv = LabValue(name="X", value="1", normal_range="0-2", meaning="ok")
        assert lv.status == "normal"

    def test_lab_value_high_status(self) -> None:
        lv = LabValue(
            name="Glucose", value="200", normal_range="70-100",
            status="high", meaning="Elevated"
        )
        assert lv.status == "high"

    def test_lab_value_low_status(self) -> None:
        lv = LabValue(
            name="Iron", value="10", normal_range="60-170",
            status="low", meaning="Deficient"
        )
        assert lv.status == "low"

    def test_medicine_defaults_to_empty_strings(self) -> None:
        m = Medicine()
        assert m.name == ""
        assert m.dosage == ""

    def test_analysis_response_defaults(self) -> None:
        ar = AnalysisResponse()
        assert ar.summary == ""
        assert ar.document_type == "other"
        assert ar.medicines == []
        assert ar.lab_values == []

    def test_analysis_response_from_json(self) -> None:
        data = json.loads(VALID_ANALYSIS_JSON)
        ar = AnalysisResponse(**data)
        assert ar.document_type == "lab_report"
        assert len(ar.lab_values) == 1

    def test_invalid_status_rejected(self) -> None:
        with pytest.raises(Exception):
            LabValue(
                name="X", value="1", normal_range="0-2",
                status="unknown",  # type: ignore[arg-type]
                meaning="??"
            )
