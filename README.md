# Report Decoder

Report Decoder is an AI-powered application designed to solve a critical healthcare problem in India: **patients receive medical reports, prescriptions, and lab results full of jargon they can't understand.** Additionally, language barriers exacerbate this issue since most reports are generated in English.

Built by **Team_Altron**, Report Decoder leverages vision-language models to translate complex medical documents into simple, patient-friendly explanations in 8+ regional Indian languages.

## 🚀 Features
- **Multilingual Support**: Translates into Hindi, Kannada, Tamil, Telugu, Malayalam, Bengali, Marathi, and English.
- **Lab-Value Highlighting**: Automatically extracts and classifies lab values (normal, high, low).
- **Prescription Breakdown**: Simple, structured extraction of medications, dosages, and timings.
- **Privacy-First**: No reports or data are stored. All processing is done in-memory on the backend and discarded.
- **Efficiency**: Includes client-side image compression to save bandwidth and improve upload speeds.
- **Accessibility**: Includes a read-aloud Text-to-Speech function and a fully keyboard-navigable UI.

## 🛠 Tech Stack
- **Frontend**: Next.js (React), Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), SlowAPI for rate limiting.
- **AI Model**: Groq API (`qwen/qwen3.8-27b`).

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v20+)
- Python (v3.9+)
- Docker (optional but recommended)

### 1. Environment Variables
In the `backend` directory, create a `.env` file based on `.env.example`:
```
GROQ_API_KEY=your_groq_api_key_here
```

### 2. Running with Docker (Recommended)
```bash
docker compose up --build
```
The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8000`.

### 3. Running Locally (Without Docker)
**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Testing
The backend features unit and integration tests (validating file handling, parsing structures, and rate limits).

To run the tests:
```bash
cd frontend
npm run test
```
*(This triggers pytest for the backend API logic with AI calls mocked).*

## 🔒 Security
- **Data Protection**: Temp files are not saved to disk. Uploads are strictly processed in-memory (`BytesIO`/`File.read()`).
- **Rate Limiting**: Configured using SlowAPI to prevent abuse (max 5 analysis calls per minute).
- **CORS**: Restricted to the frontend origin only.

## ⚠️ Medical Disclaimer
This tool is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified physician for your medical needs.
