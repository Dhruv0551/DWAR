from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.core.models import UserProfile, UserDocument, Project
from apps.core.serializers import UserDocumentSerializer

@api_view(['GET'])
def document_list(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)
        
    supabase_id = supabase_user.get('sub')
    try:
        profile = UserProfile.objects.get(supabase_id=supabase_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=404)
        
    docs = UserDocument.objects.filter(user_profile=profile)
    
    project_id = request.query_params.get('project_id')
    if project_id:
        docs = docs.filter(project_id=project_id)
        
    serializer = UserDocumentSerializer(docs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def document_upload(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)
        
    supabase_id = supabase_user.get('sub')
    try:
        profile = UserProfile.objects.get(supabase_id=supabase_id)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=404)
        
    if 'file' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=400)
        
    uploaded_file = request.FILES['file']
    
    # Validate file type and size
    if uploaded_file.size > 10 * 1024 * 1024:
        return Response({'error': 'File too large (max 10MB)'}, status=400)
        
    mime_type = uploaded_file.content_type
    if mime_type not in ['application/pdf', 'image/jpeg', 'image/png']:
        return Response({'error': 'Invalid file type. Only PDF, JPG, PNG allowed.'}, status=400)
        
    name = request.data.get('name', uploaded_file.name)
    document_type = request.data.get('document_type', 'Other')
    project_id = request.data.get('project_id')
    
    project = None
    if project_id:
        try:
            project = Project.objects.get(id=project_id, user_profile=profile)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=404)
            
    doc = UserDocument.objects.create(
        user_profile=profile,
        project=project,
        name=name,
        document_type=document_type,
        file=uploaded_file,
        file_size=uploaded_file.size,
        mime_type=mime_type
    )
    
    serializer = UserDocumentSerializer(doc)
    return Response(serializer.data, status=201)

@api_view(['GET', 'DELETE'])
def document_detail(request, pk):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)
        
    supabase_id = supabase_user.get('sub')
    try:
        profile = UserProfile.objects.get(supabase_id=supabase_id)
        doc = UserDocument.objects.get(id=pk, user_profile=profile)
    except (UserProfile.DoesNotExist, UserDocument.DoesNotExist):
        return Response({'error': 'Document not found'}, status=404)
        
    if request.method == 'GET':
        serializer = UserDocumentSerializer(doc)
        return Response(serializer.data)
        
    elif request.method == 'DELETE':
        if doc.file:
            doc.file.delete()
        doc.delete()
        return Response(status=204)
