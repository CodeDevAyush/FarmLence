from app.agents.disease_db import DISEASE_DATABASE

def get_treatment(disease: str):
    return DISEASE_DATABASE.get(
        disease,
        {}
    ).get("treatment", "Consult local agricultural expert.")