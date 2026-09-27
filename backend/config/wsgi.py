import os
import sys
import logging
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

logger = logging.getLogger(__name__)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

application = get_wsgi_application()

# Automatically run database migrations on server startup (Render / production)
try:
    print("[DWAR Startup] Checking and running database migrations...", file=sys.stderr)
    call_command("migrate", interactive=False)
    print("[DWAR Startup] Database migrations up to date.", file=sys.stderr)
except Exception as e:
    print(f"[DWAR Startup Warning] Auto-migration on startup failed: {e}", file=sys.stderr)
