import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import OperationalError, ProgrammingError
from django.core.management import call_command
from apps.core.models import UserProfile, Project
from apps.core.serializers import UserProfileSerializer

logger = logging.getLogger(__name__)

def _get_or_create_profile(supabase_id: str, email: str):
    """Safely get or create profile, running migrations automatically if tables are missing."""
    try:
        return UserProfile.objects.get_or_create(
            supabase_id=supabase_id,
            defaults={'email': email or ''}
        )
    except (OperationalError, ProgrammingError) as e:
        logger.warning("Database tables missing; running auto-migration: %s", e)
        try:
            call_command('migrate', interactive=False)
            return UserProfile.objects.get_or_create(
                supabase_id=supabase_id,
                defaults={'email': email or ''}
            )
        except Exception as migrate_err:
            logger.exception("Auto-migration failed: %s", migrate_err)
            raise


@api_view(['GET', 'POST'])
def profile(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)

    supabase_id = supabase_user.get('sub')
    email = supabase_user.get('email', '') or ''

    try:
        user_profile, created = _get_or_create_profile(supabase_id, email)
    except Exception as e:
        return Response({'error': f"Database error: {str(e)}"}, status=500)

    if request.method == 'GET':
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data or {}
        if 'full_name' in data: user_profile.full_name = str(data['full_name'])[:200]
        if 'role' in data: user_profile.role = str(data['role'])[:20]
        if 'company_name' in data: user_profile.company_name = str(data['company_name'])[:200]
        if 'gstin' in data: user_profile.gstin = str(data['gstin'])[:15]
        if 'contact_phone' in data: user_profile.contact_phone = str(data['contact_phone'])[:15]

        try:
            user_profile.save()
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data)
        except Exception as e:
            logger.exception("Failed to update profile: %s", e)
            return Response({'error': f"Failed to save profile: {str(e)}"}, status=500)


@api_view(['POST'])
def complete_onboarding(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized: session expired or missing token. Please sign in again.'}, status=401)

    supabase_id = supabase_user.get('sub')
    email = supabase_user.get('email', '') or ''

    try:
        user_profile, _ = _get_or_create_profile(supabase_id, email)
    except Exception as e:
        logger.exception("Database error while retrieving profile: %s", e)
        return Response({'error': f"Database table error: {str(e)}. Please run migrations."}, status=500)

    data = request.data or {}

    try:
        # Update profile fields from onboarding
        if data.get('companyName'):
            user_profile.company_name = str(data['companyName'])[:200]
        if data.get('gstin'):
            user_profile.gstin = str(data['gstin'])[:15]
        if data.get('contactPhone'):
            user_profile.contact_phone = str(data['contactPhone'])[:15]
        user_profile.is_onboarded = True
        user_profile.save()

        # Parse scale numbers
        try:
            investment_lakhs = float(data.get('investment') or 0)
            investment_inr = int(investment_lakhs * 100000)
        except (ValueError, TypeError):
            investment_inr = 0

        try:
            employees = int(data.get('employees') or 0)
        except (ValueError, TypeError):
            employees = 0

        # Safe field values with length truncation matching model fields
        proj_name = (data.get('projectName') or data.get('name') or f"{user_profile.company_name or 'My'} Project")[:160]
        sector = str(data.get('sector', ''))[:100]
        project_type = str(data.get('projectType', 'New Manufacturing Unit'))[:100]
        district = str(data.get('district', ''))[:120]
        location = str(district or data.get('location', ''))[:120]
        land_status = str(data.get('landStatus', 'To be confirmed'))[:80]
        env_category = str(data.get('envCategory', 'To be confirmed'))[:80]
        power_req = str(data.get('powerReq', ''))[:80]

        # Create or update project record
        project = Project.objects.create(
            user_profile=user_profile,
            name=proj_name,
            sector=sector,
            project_type=project_type,
            location=location,
            district=district,
            state='Maharashtra',
            is_midc=bool(data.get('isMidc', False)),
            investment_amount=investment_inr,
            employee_count=employees,
            land_status=land_status,
            environmental_category=env_category,
            power_requirement=power_req,
        )

        return Response({
            'success': True,
            'project_id': project.id,
            'message': 'Onboarding successfully completed.'
        })

    except Exception as e:
        logger.exception("[complete_onboarding error] Failed to process onboarding: %s", e)
        return Response({'error': f"Failed to complete onboarding: {str(e)}"}, status=500)
