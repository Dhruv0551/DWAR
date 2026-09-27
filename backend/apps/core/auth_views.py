from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.core.models import UserProfile, Project
from apps.core.serializers import UserProfileSerializer

@api_view(['GET', 'POST'])
def profile(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)

    supabase_id = supabase_user.get('sub')
    email = supabase_user.get('email', '')

    if request.method == 'GET':
        user_profile, created = UserProfile.objects.get_or_create(
            supabase_id=supabase_id,
            defaults={'email': email}
        )
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)

    elif request.method == 'POST':
        user_profile, created = UserProfile.objects.get_or_create(
            supabase_id=supabase_id,
            defaults={'email': email}
        )

        # Update fields
        data = request.data
        if 'full_name' in data: user_profile.full_name = data['full_name']
        if 'role' in data: user_profile.role = data['role']
        if 'company_name' in data: user_profile.company_name = data['company_name']
        if 'gstin' in data: user_profile.gstin = data['gstin']
        if 'contact_phone' in data: user_profile.contact_phone = data['contact_phone']

        user_profile.save()
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)


@api_view(['POST'])
def complete_onboarding(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)

    supabase_id = supabase_user.get('sub')
    email = supabase_user.get('email', '')

    user_profile, _ = UserProfile.objects.get_or_create(
        supabase_id=supabase_id,
        defaults={'email': email}
    )

    data = request.data or {}

    # Update profile fields from onboarding
    if data.get('companyName'):
        user_profile.company_name = data['companyName']
    if data.get('gstin'):
        user_profile.gstin = data['gstin']
    if data.get('contactPhone'):
        user_profile.contact_phone = data['contactPhone']
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

    # Create or update project record
    project = Project.objects.create(
        user_profile=user_profile,
        name=data.get('projectName') or data.get('name') or f"{user_profile.company_name or 'My'} Project",
        sector=data.get('sector', ''),
        project_type=data.get('projectType', 'New Manufacturing Unit'),
        location=data.get('district') or data.get('location', ''),
        district=data.get('district', ''),
        state='Maharashtra',
        is_midc=bool(data.get('isMidc', False)),
        investment_amount=investment_inr,
        employee_count=employees,
        land_status=data.get('landStatus', 'To be confirmed'),
        environmental_category=data.get('envCategory', 'To be confirmed'),
        power_requirement=data.get('powerReq', ''),
    )

    return Response({'success': True, 'project_id': project.id})
