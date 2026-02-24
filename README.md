# FarmLence: AI-Powered Plant Disease Detection

FarmLence is a comprehensive AI-powered web application designed to provide real-time crop diagnosis and treatment guidance. By leveraging **YOLO** (You Only Look Once) for computer vision and a **FastAPI** backend integrated with specialized agents, the system identifies plant diseases from uploaded images and provides actionable insights regarding treatment, safety, market options, and sustainability.

## 🚀 Key Features

* **Real-time Diagnosis:** Uses a YOLO model (`best.pt`) to identify crops and specific diseases from leaf images.
* **Multi-Agent Insights:** Automatically generates comprehensive reports including:
* **Treatment Guidance:** Actionable steps to manage the identified disease.
* **Safety Checks:** Health and safety precautions for handling infected plants.
* **Market Options:** Cost-effective solutions and market-available treatments.
* **Sustainability:** Eco-friendly and long-term prevention strategies.


* **Modern Web Interface:** A responsive React-based frontend for seamless user interaction.

---

## 🏗️ Project Structure

```text
FarmLence/
├── backend/
│   ├── app/
│   │   ├── agents/          # Specialized logic for treatment, safety, etc.
│   │   ├── inference.py     # YOLO model prediction logic
│   │   └── main.py          # FastAPI application routes
│   ├── model/
│   │   └── best.pt          # Trained YOLO weights
│   └── requirements.txt     # Python dependencies
└── frontend/
    ├── src/                 # React components and logic
    └── package.json         # Node.js dependencies and scripts

```

---

## 🛠️ Tech Stack

* **Frontend:** React (TypeScript)
* **Backend:** FastAPI (Python)
* **AI/ML:** YOLO (Ultralytics)
* **Middleware:** CORS support for production environments

---

## 🖥️ API Usage

### Scan Leaf

**Endpoint:** `POST /scan`
**Payload:** `multipart/form-data` with a `file` field containing the leaf image.

**Example Response:**

```json
{
  "crop": "Corn",
  "disease": "Common_Rust",
  "confidence": 0.985,
  "treatment": "...",
  "safety": "...",
  "cost_option": "...",
  "sustainability": "..."
}

```

---

## 🌐 Deployment

The project is configured for live deployment with CORS support for the following production origin:

* `https://farm-lence.vercel.app`

---

## 📄 License

*Refer to the project repository for licensing information.*
