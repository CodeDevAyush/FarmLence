from app.agents.disease_db import DISEASE_DATABASE

def check_safety(disease: str):
    return DISEASE_DATABASE.get(
        disease,
        {}
    ).get("safety", "Follow general pesticide safety guidelines.")