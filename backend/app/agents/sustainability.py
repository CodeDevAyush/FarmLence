from app.agents.disease_db import DISEASE_DATABASE

def get_sustainability(disease: str):
    return DISEASE_DATABASE.get(
        disease,
        {}
    ).get("sustainability", "Follow eco-friendly agricultural practices.")