import os
import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from groq import Groq

logger = logging.getLogger(__name__)

def normalize_groq_model(name: str) -> str:
    """Ensure Groq model names match the official provider IDs."""
    if not name:
        return 'openai/gpt-oss-20b'
    name = name.strip()
    if name in ('gpt-oss-20b', 'gpt-oss-120b', 'gpt-oss-safeguard-20b'):
        return f'openai/{name}'
    return name

@api_view(['POST'])
def chat(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)

    message = request.data.get('message', '').strip()
    if not message:
        return Response({'error': 'Message is required'}, status=400)

    project_context = request.data.get('project_context', {})

    groq_api_key = os.getenv('GROQ_API_KEY')
    raw_model = os.getenv('GROQ_MODEL', 'openai/gpt-oss-20b')
    model_name = normalize_groq_model(raw_model)

    if not groq_api_key:
        return Response({
            'reply': "I am currently running in demo mode. For industrial project approvals in Maharashtra, I recommend checking the MAITRI portal.",
            'mode': 'demo_fallback'
        })

    system_prompt = (
        "You are D.W.A.R's AI assistant for industrial project approvals and registrations in Maharashtra, India. "
        "You assist entrepreneurs with: approval requirements (MSEDCL, MPCB, DISH, MIDC, Fire NOC), document checklists, "
        "compliance timelines, and state schemes/incentives under the Maharashtra Industrial Policy. "
        "Strictly adhere to Maharashtra state regulations and single-window procedures. "
        "Keep your answers concise, practical, and highly structured with bullet points. "
        "Refuse any questions unrelated to industrial setups or Maharashtra regulatory compliance."
    )

    context_str = ""
    if project_context:
        context_str = f"\n\nActive Project Details:\n{project_context}"

    try:
        client = Groq(api_key=groq_api_key)
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt + context_str},
                {"role": "user", "content": message},
            ],
            temperature=0.2,
            max_tokens=800,
        )

        reply = response.choices[0].message.content

        return Response({
            'reply': reply,
            'mode': 'live_ai',
            'model': model_name
        })
    except Exception as e:
        logger.exception("[Groq Error] Chat completion failed with model %s: %s", model_name, e)
        return Response({
            'reply': f"AI service temporarily unavailable ({type(e).__name__}). Please check the MAITRI portal or verify your Groq configuration.",
            'mode': 'demo_fallback',
            'error': str(e)
        }, status=200)
