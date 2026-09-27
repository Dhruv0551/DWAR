"""Supabase JWT verification middleware for D.W.A.R.

Supports both:
1. Modern asymmetric signing keys (ES256 / RS256) via Supabase's JWKS endpoint (.well-known/jwks.json)
2. Legacy symmetric HS256 secret via SUPABASE_JWT_SECRET
"""
import logging
import jwt
from jwt import PyJWKClient, PyJWKClientError
from django.conf import settings

logger = logging.getLogger(__name__)

# Global JWKS client cache
_jwks_client = None

def get_jwks_client():
    global _jwks_client
    supabase_url = getattr(settings, 'SUPABASE_URL', '').rstrip('/')
    if not supabase_url:
        return None
    if _jwks_client is None:
        jwks_url = f"{supabase_url}/auth/v1/.well-known/jwks.json"
        _jwks_client = PyJWKClient(jwks_url, cache_jwk_set=True, lifespan=3600)
    return _jwks_client


class SupabaseJWTMiddleware:
    """Verify Supabase JWTs on API requests."""

    OPEN_PATHS = [
        '/api/health/',
        '/api/demo/',
        '/api/demo/journey/',
        '/admin/',
        '/api/auth/callback/',
    ]
    OPEN_PREFIXES = ['/static/', '/media/']

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        path = request.path
        request.supabase_user = None

        if self._is_open(path):
            return self.get_response(request)

        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ', 1)[1].strip()
            if token:
                request.supabase_user = self._verify_token(token)

        return self.get_response(request)

    def _verify_token(self, token: str):
        """Decode and verify JWT using JWKS (ECC/RS256) or HS256 secret."""
        try:
            unverified_header = jwt.get_unverified_header(token)
            alg = unverified_header.get('alg', 'HS256')
        except Exception as e:
            logger.warning("[SupabaseJWTMiddleware] Could not parse JWT header: %s", e)
            return None

        # 1. Asymmetric verification via JWKS (Supabase modern signing keys)
        if alg in ('ES256', 'RS256', 'EdDSA'):
            client = get_jwks_client()
            if client:
                try:
                    signing_key = client.get_signing_key_from_jwt(token)
                    payload = jwt.decode(
                        token,
                        signing_key.key,
                        algorithms=[alg],
                        options={'verify_aud': False},
                    )
                    return payload
                except PyJWKClientError as e:
                    logger.warning("[SupabaseJWTMiddleware] JWKS key resolution error (%s): %s", alg, e)
                except jwt.ExpiredSignatureError:
                    logger.warning("[SupabaseJWTMiddleware] Token expired")
                    return None
                except jwt.InvalidTokenError as e:
                    logger.warning("[SupabaseJWTMiddleware] Invalid token (%s): %s", alg, e)
                    return None
            else:
                logger.warning("[SupabaseJWTMiddleware] Token algorithm is %s but SUPABASE_URL is not set", alg)

        # 2. Symmetric verification via SUPABASE_JWT_SECRET (Legacy HS256)
        jwt_secret = getattr(settings, 'SUPABASE_JWT_SECRET', '')
        if jwt_secret:
            try:
                payload = jwt.decode(
                    token,
                    jwt_secret,
                    algorithms=['HS256'],
                    options={'verify_aud': False},
                )
                return payload
            except jwt.ExpiredSignatureError:
                logger.warning("[SupabaseJWTMiddleware] HS256 token expired")
                return None
            except jwt.InvalidTokenError as e:
                logger.warning("[SupabaseJWTMiddleware] HS256 invalid token: %s", e)

        # 3. Fallback: If JWKS client is available, attempt JWKS even if alg was not caught
        client = get_jwks_client()
        if client:
            try:
                signing_key = client.get_signing_key_from_jwt(token)
                payload = jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=['ES256', 'RS256', 'HS256'],
                    options={'verify_aud': False},
                )
                return payload
            except Exception as e:
                logger.warning("[SupabaseJWTMiddleware] Fallback verification failed: %s", e)

        return None

    def _is_open(self, path: str) -> bool:
        if any(path.startswith(p) for p in self.OPEN_PREFIXES):
            return True
        if any(path == p or path.startswith(p) for p in self.OPEN_PATHS):
            return True
        return False
