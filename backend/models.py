"""Pydantic response models for the Report Decoder API."""

from typing import Literal

from pydantic import BaseModel, Field


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

class ChatMessage(BaseModel):
    role: Literal["user", "model"]
    content: str

class ChatRequest(BaseModel):
    context: str
    messages: list[ChatMessage]

class ChatResponse(BaseModel):
    reply: str
