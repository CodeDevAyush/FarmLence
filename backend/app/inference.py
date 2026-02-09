from ultralytics import YOLO

model = YOLO("model/best.pt")


def predict_disease(image_path: str):
    results = model(image_path, imgsz=224)[0]

    # 🔹 If classification probabilities missing
    if results.probs is None:
        return {
            "crop": None,
            "disease": "Prediction failed",
            "confidence": 0.0
        }

    class_id = int(results.probs.top1)
    confidence = float(results.probs.top1conf)
    label = results.names[class_id]

    crop, disease = label.split("___") if "___" in label else ("Unknown", label)

    return {
        "crop": crop,
        "disease": disease,
        "confidence": round(confidence, 3)
    }
