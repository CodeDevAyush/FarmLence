def get_treatment(disease: str):
    data = {
        "Late_blight": "Use Mancozeb spray every 7 days",
        "Early_blight": "Apply Chlorothalonil fungicide",
    }
    return data.get(disease, "Consult local expert")
