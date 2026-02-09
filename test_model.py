from ultralytics import YOLO
import matplotlib.pyplot as plt

# Load trained model
model = YOLO("model/best.pt")

# Path to a test image (put one leaf image in project root)
image_path = "test.jpg"

# Run prediction
results = model(image_path)

# Print raw prediction info
for r in results:
    print("Detected classes:", r.boxes.cls if r.boxes else "None")
    print("Confidence:", r.boxes.conf if r.boxes else "None")

# Show image with prediction boxes
results[0].show()
