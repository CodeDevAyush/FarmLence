from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from google import genai

client = genai.Client(api_key="AIzaSyCMs9ePKqxiQr24IDrjOeRgLzjB14OJCRQ")


from app.inference import predict_disease
from app.agents.router import run_all_tools

app = FastAPI(title="ONLYTECH API")

# ✅ Proper CORS (fixed commas)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:8000",
        "http://localhost:3000",
        "https://farm-lence.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# -----------------------------------
# Root Endpoint
# -----------------------------------
@app.get("/")
def home():
    return {"message": "ONLYTECH API running"}


# -----------------------------------
# Scan Endpoint
# -----------------------------------
@app.post("/scan")
async def scan_leaf(file: UploadFile = File(...)):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1️⃣ YOLO prediction
        result = predict_disease(file_path)

        # 2️⃣ Agent orchestration
        tools_output = run_all_tools(result["disease"])

        return {
            **result,
            **tools_output
        }

    except Exception as e:
        return {"error": str(e)}


# -----------------------------------
# Chat Endpoint (Context-aware Gemini)
# -----------------------------------
@app.post("/chat")
async def chat_with_ai(data: dict):
    try:
        question = data.get("question", "")
        context = data.get("context", {})

        crop = context.get("crop", "")
        disease = context.get("disease", "")
        confidence = context.get("confidence", "")
        treatment = context.get("treatment", "")
        safety = context.get("safety", "")
        cost = context.get("cost_option", "")
        sustainability = context.get("sustainability", "")

        prompt = f"""
You are an advanced agricultural AI advisor.

Context:
Crop: {crop}
Disease: {disease}
Confidence: {confidence}
Treatment: {treatment}
Safety: {safety}
Cost: {cost}
Sustainability: {sustainability}

Answer the user's question clearly and professionally.
If unrelated to agriculture, respond:
"I can only assist with farming and plant health related queries."

User question: {question}
"""

        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )

        return {"response": response.text}

    except Exception as e:
        return {"error": str(e)}


# -----------------------------------
# Gemini Test Endpoint
# -----------------------------------
@app.get("/test-gemini")
async def test_gemini():
    try:
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents="Say hello",
        )
        return {"response": response.text}

    except Exception as e:
        return {"error": str(e)}