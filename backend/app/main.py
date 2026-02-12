from fastapi import FastAPI, UploadFile, File
import shutil
import os

from app.inference import predict_disease
from app.agents.treatment import get_treatment
from app.agents.safety import check_safety
from app.agents.market import get_market_option
from app.agents.sustainability import get_sustainability

app = FastAPI(title="ONLYTECH API")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ONLYTECH API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://farm-lence.vercel.app"
    ],
    allow_credentials=False,   # 👈 change this
    allow_methods=["*"],
    allow_headers=["*"],
)




UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "ONLYTECH API running"}


@app.post("/scan")
async def scan_leaf(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 1️⃣ YOLO prediction
    result = predict_disease(file_path)

    # 2️⃣ Agent outputs
    treatment = get_treatment(result["disease"])
    safety = check_safety(result["disease"])
    market = get_market_option(result["disease"])
    sustainability = get_sustainability(result["disease"])

    return {
        **result,
        "treatment": treatment,
        "safety": safety,
        "cost_option": market,
        "sustainability": sustainability
    }
