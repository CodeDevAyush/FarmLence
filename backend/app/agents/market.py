from app.agents.disease_db import DISEASE_DATABASE

def get_market_option(disease: str):
    return DISEASE_DATABASE.get(
        disease,
        {}
    ).get("cost_option", "Cost varies. Consult local supplier.")