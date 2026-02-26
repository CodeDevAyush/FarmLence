from app.agents.treatment import get_treatment
from app.agents.safety import check_safety
from app.agents.market import get_market_option
from app.agents.sustainability import get_sustainability

def run_all_tools(disease: str):
    return {
        "treatment": get_treatment(disease),
        "safety": check_safety(disease),
        "cost_option": get_market_option(disease),
        "sustainability": get_sustainability(disease)
    }