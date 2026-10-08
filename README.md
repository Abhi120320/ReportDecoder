# 🩺 Report Decoder

**"Your medical report, decoded in your language."**

Upload a medical report or prescription (JPG, PNG, WEBP, or PDF) and get a simple, patient-friendly explanation in your chosen language — powered by Google's Gemini AI.

---

## 🧩 Problem

Medical reports and prescriptions are filled with abbreviations, technical terms, and jargon that most patients can't understand. Non-English speakers face an even bigger barrier. Patients leave the doctor's office without truly knowing what their report says.

## 💡 Solution

Report Decoder uses Google's Gemini multimodal AI to read and explain medical documents in **8 Indian languages**, using everyday words anyone can understand. No model training needed — just upload and decode.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌐 **8 Languages** | English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali |
| 💊 **Medicine Breakdown** | Name, purpose, dosage, timing, and food instructions |
| 📅 **Daily Schedule** | Morning / Afternoon / Night medicine timeline |
| 🔬 **Lab Values Decoded** | Color-coded normal/high/low with simple explanations |
| 🚨 **Red Flag Alerts** | Urgent findings highlighted for doctor discussion |
| ❓ **Doctor Questions** | 3–5 suggested questions to ask your physician |
| 🔊 **Read Aloud** | Browser-based text-to-speech for accessibility |
| 📋 **Copy Summary** | One-click copy for sharing with family |
| 💾 **Auto-Save** | Last result saved in localStorage |
| 🎨 **3D Hero** | Floating document with glowing particles (Three.js) |
| 📱 **Responsive** | Mobile-first, dark, modern design |
| ♿ **Accessible** | Respects `prefers-reduced-motion` |

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Three.js (React Three Fiber + Drei) |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI** | Google Gemini API (multimodal, `google-genai` SDK) |
| **Validation** | Pydantic response schemas, structured JSON output |

---

## 🏛 Architecture

```
┌────────────────┐         ┌──────────────┐         ┌──────────────┐
│                │  POST   │              │  Gemini  │              │
│   Next.js App  │────────▶│  FastAPI     │────────▶│  Google      │
│   (Frontend)   │◀────────│  (Backend)   │◀────────│  Gemini API  │
│   :3000        │  JSON   │  :8000       │  JSON    │              │
└────────────────┘         └──────────────┘         └──────────────┘
     Upload                  Validate                 Multimodal
     Display                 Proxy                    Analysis
```

---

## 🚀 Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | *(required)* | Your Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.0-flash` | Gemini model to use |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

---

## 🔮 Future Scope

- **Weekly BP/Sugar Tracker** — Upload readings over time and get trend explanations (e.g., "your blood sugar is trending higher this week")
- **Voice-Based Health Monitoring** — Describe symptoms by voice with clinical validation and preliminary guidance
- **Drug Interaction Checks** — Cross-reference prescribed medicines for potential interactions and alerts

---

## ⚕️ Disclaimer

> **Report Decoder is an educational aid and does not provide medical diagnosis or advice. Always consult a qualified doctor.**

---

## 📄 License

MIT
