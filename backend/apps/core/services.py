"""Deterministic approval engine. Demo records are intentionally labelled representative."""
from dataclasses import asdict, dataclass
from typing import Any
import re

SOURCE = {"title": "D.W.A.R representative prototype knowledge dataset", "url": "https://industry.maharashtra.gov.in/", "department": "Demo dataset — verify with authority", "verification_status": "Prototype / representative", "last_verified": "2026-09-22"}

@dataclass
class Approval:
    id: str
    name: str
    department: str
    status: str
    days: int
    dependencies: list[str]
    documents: list[str]
    rationale: str

def approval_catalog(sector: str) -> list[Approval]:
    base = [
        Approval("land", "Land / Site Readiness", "Project owner / MIDC", "Ready to Start", 14, [], ["Land document", "Site layout"], "Site information informs downstream planning."),
        Approval("building", "Building Plan Approval", "Local planning authority", "Not Started", 21, ["land"], ["Building plan", "Land document", "Project details"], "Building plan is a dependency for later safety steps."),
        Approval("fire", "Fire NOC", "Fire department", "Waiting for Dependency", 20, ["building"], ["Building plan", "Fire safety plan"], "Safety review may follow the building plan."),
        Approval("factory", "Factory Licence", "Directorate of Industrial Safety & Health", "Waiting for Dependency", 30, ["fire"], ["PAN", "Building plan", "Worker details"], "Operational licence depends on site and safety readiness."),
    ]
    lower = sector.lower()
    if "food" in lower:
        base.insert(2, Approval("pollution", "Consent to Establish", "Maharashtra Pollution Control Board", "Not Started", 30, ["land"], ["Project report", "Environmental report", "Site layout"], "Likely relevant for a food processing manufacturing unit; verify category and applicability."))
    elif "ev" in lower or "component" in lower:
        base.insert(2, Approval("pollution", "Consent to Establish", "Maharashtra Pollution Control Board", "Not Started", 30, ["land"], ["Project report", "Process note", "Site layout"], "Likely relevant to component manufacturing; verify category and applicability."))
    elif "textile" in lower:
        base.insert(2, Approval("pollution", "Consent to Establish", "Maharashtra Pollution Control Board", "Not Started", 30, ["land"], ["Project report", "Environmental report", "Water plan"], "Likely relevant to textile expansion; verify category and applicability."))
    return base

def journey(profile: dict[str, Any]) -> dict[str, Any]:
    approvals = [asdict(a) | {"source": SOURCE, "confidence": "Representative demo guidance"} for a in approval_catalog(profile.get("sector", "Manufacturing"))]
    known_docs = {"PAN": "Available", "Land document": "Verified"} if profile.get("is_midc") else {"PAN": "Available"}
    docs = []
    for a in approvals:
        for d in a["documents"]:
            if not any(x["name"] == d for x in docs): docs.append({"name": d, "status": known_docs.get(d, "Missing"), "reusable": d in {"PAN", "Land document"}})
    path = ["Land / Site Readiness", "Building Plan Approval", "Fire NOC", "Factory Licence"]
    next_action = next((a for a in approvals if a["status"] == "Not Started"), approvals[0])
    return {"project": profile, "approvals": approvals, "documents": docs, "critical_path": {"steps": path, "days": 72, "label": "Prototype estimate — verify with the relevant authority."}, "next_best_action": {"title": f"Prepare {next_action['name']}", "why": "This unlocks downstream work in the representative journey.", "documents": next_action["documents"]}, "source": SOURCE}

def extract_profile(message: str) -> dict[str, Any]:
    text = message.lower()
    sector = "Food Processing" if "food" in text else "EV Component Manufacturing" if ("ev" in text or "component" in text) else "Textile Manufacturing" if "textile" in text else "Manufacturing"
    location = "Pune" if "pune" in text else "Chhatrapati Sambhajinagar" if ("sambhajinagar" in text or "aurangabad" in text) else "Nagpur" if "nagpur" in text else "To be confirmed"
    crore = re.search(r"(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*crore", text)
    people = re.search(r"(\d+)\s*(?:people|employees|workers)", text)
    return {"name": f"{sector} project", "sector": sector, "project_type": "Expansion" if "expand" in text or "expansion" in text else "New Manufacturing Unit", "location": location, "district": location, "state": "Maharashtra", "investment_amount": int(float(crore.group(1))*10000000) if crore else 0, "employee_count": int(people.group(1)) if people else 0, "is_midc": "midc" in text, "land_status": "MIDC area" if "midc" in text else "To be confirmed", "environmental_category": "To be confirmed"}

def copilot_reply(message: str, current: dict[str, Any] | None = None) -> dict[str, Any]:
    unrelated = ["weather", "cricket", "football", "recipe", "python code", "capital of", "movie"]
    if any(x in message.lower() for x in unrelated):
        return {"reply": "I'm D.W.A.R, an industrial approval and registration assistant. I can help with approvals, registrations, compliance, documents, applications, government schemes, and project-specific guidance.", "profile": current, "questions": []}
    profile = extract_profile(message)
    # Live Groq/LangChain extraction is optional and server-side. Its facts are
    # constrained by the deterministic profile shape; approval selection remains below.
    try:
        from .ai_orchestrator import extract_with_groq
        live_facts = extract_with_groq(message)
        if live_facts:
            profile |= live_facts
    except Exception:
        live_facts = None
    if current:
        profile = current | {k:v for k,v in profile.items() if v not in (0, "To be confirmed", "Manufacturing", "Manufacturing project")}
    missing = []
    if not profile.get("location") or profile["location"] == "To be confirmed": missing.append("Which Maharashtra district is the proposed site in?")
    if not profile.get("investment_amount"): missing.append("What is the approximate project investment?")
    if not profile.get("employee_count"): missing.append("Approximately how many people will be employed?")
    profile_bits = f"Sector: {profile['sector']} · Project: {profile['project_type']} · Location: {profile['location']}"
    reply = f"I understand: {profile_bits}. " + (f"I need {min(len(missing), 3)} more detail(s) to refine the representative approval journey. " + " ".join(missing[:3]) if missing else "Your project profile is ready. I can now build a representative approval journey.")
    return {"reply": reply, "profile": profile, "questions": missing[:3], "journey": journey(profile) if not missing else None, "mode": "live_ai" if live_facts else "demo_fallback"}

def incentives(profile: dict[str, Any]) -> list[dict]:
    sector = profile.get("sector", "Manufacturing")
    return [{"name": "Maharashtra industrial support discovery", "summary": f"Potentially relevant support pathways for {sector} projects should be checked against current official eligibility.", "source": SOURCE, "eligibility": "Potentially relevant — not a benefit guarantee."}, {"name": "MIDC facilitation guidance", "summary": "Site and infrastructure facilitation may be relevant where the project is located in an MIDC area.", "source": SOURCE, "eligibility": "Prototype discovery result — verify with the relevant authority."}]
