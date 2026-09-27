"""Optional server-only Groq extraction. The deterministic engine remains authoritative."""
import os
import json
import logging
from typing import Optional
from groq import Groq

logger = logging.getLogger(__name__)

def normalize_groq_model(name: str) -> str:
    if not name:
        return 'openai/gpt-oss-20b'
    name = name.strip()
    if name in ('gpt-oss-20b', 'gpt-oss-120b', 'gpt-oss-safeguard-20b'):
        return f'openai/{name}'
    return name

def extract_with_groq(message: str) -> Optional[dict]:
    """Return validated extraction fields, or None when live AI is unavailable."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    model_name = normalize_groq_model(os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"))

    system_prompt = (
        "Extract only stated industrial-project facts as a JSON object with optional keys: "
        "sector (str), project_type (str), location (str), investment_amount (int, Indian rupees if stated), "
        "employee_count (int), is_midc (bool). Do not infer requirements or laws. Only return valid JSON."
    )

    try:
        client = Groq(api_key=api_key)
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            response_format={"type": "json_object"},
            temperature=0,
        )
        content = response.choices[0].message.content
        data = json.loads(content)
        return {k: v for k, v in data.items() if v is not None}
    except Exception as e:
        logger.warning("[Groq Orchestrator] Extraction error (%s): %s", model_name, e)
        return None
