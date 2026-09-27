from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Document, Application
from .serializers import ProjectSerializer, DocumentSerializer, ApplicationSerializer
from .services import copilot_reply, journey, incentives, SOURCE

def demo_profile():
    return {"name":"Pune food processing unit", "sector":"Food Processing", "project_type":"New Manufacturing Unit", "location":"Pune", "district":"Pune", "state":"Maharashtra", "investment_amount":200000000, "employee_count":150, "is_midc":True, "land_status":"MIDC area", "environmental_category":"To be confirmed"}

@api_view(["GET"])
def health(request): return Response({"status":"ok", "mode":"demo-ready"})

@api_view(["GET", "POST"])
def projects(request):
    if request.method == "GET": return Response(ProjectSerializer(Project.objects.all().order_by("-updated_at"), many=True).data)
    s = ProjectSerializer(data=request.data); s.is_valid(raise_exception=True); s.save(); return Response(s.data, status=status.HTTP_201_CREATED)

@api_view(["GET", "PATCH"])
def project_detail(request, pk):
    p = Project.objects.filter(pk=pk).first()
    if not p: return Response({"detail":"Project not found"}, status=404)
    if request.method == "PATCH":
        s = ProjectSerializer(p, data=request.data, partial=True); s.is_valid(raise_exception=True); s.save(); return Response(s.data)
    return Response(ProjectSerializer(p).data)

@api_view(["POST"])
def analyze(request):
    result = copilot_reply(request.data.get("message", ""), request.data.get("profile"))
    return Response(result)

@api_view(["GET"])
def project_journey(request, pk):
    p = Project.objects.filter(pk=pk).first()
    return Response(journey(ProjectSerializer(p).data if p else demo_profile()))

@api_view(["GET"])
def demo_journey(request): return Response(journey(demo_profile()))

@api_view(["GET", "POST"])
@parser_classes([MultiPartParser, FormParser])
def documents(request, pk):
    p = Project.objects.filter(pk=pk).first()
    if not p: return Response({"detail":"Project not found"}, status=404)
    if request.method == "GET": return Response(DocumentSerializer(p.documents.all(), many=True).data)
    upload = request.FILES.get("file")
    if not upload or upload.size > 10*1024*1024 or upload.content_type not in {"application/pdf", "image/jpeg", "image/png"}: return Response({"detail":"Upload a PDF, JPG, or PNG under 10MB."}, status=400)
    d = Document.objects.create(project=p, name=request.data.get("name", upload.name), status="Uploaded", file=upload)
    return Response(DocumentSerializer(d).data, status=201)

@api_view(["GET", "POST"])
def applications(request):
    if request.method == "GET": return Response(ApplicationSerializer(Application.objects.all(), many=True).data)
    s = ApplicationSerializer(data=request.data); s.is_valid(raise_exception=True); s.save(); return Response(s.data, status=201)

@api_view(["POST"])
def validate_application(request, pk):
    app = Application.objects.filter(pk=pk).first()
    if not app: return Response({"detail":"Application not found"}, status=404)
    docs = set(app.project.documents.filter(status__in=["Uploaded", "Verified"]).values_list("name", flat=True))
    checks = [{"label":"Applicant details complete", "state":"pass"}, {"label":"Project information complete", "state":"pass"}, {"label":"Building plan available", "state":"pass" if "Building plan" in docs else "warning"}, {"label":"Environmental report available", "state":"pass" if "Environmental report" in docs else "warning"}]
    app.readiness = round(sum(x["state"] == "pass" for x in checks)/len(checks)*100); app.status = "ready_to_submit" if app.readiness == 100 else "validation_pending"; app.save()
    return Response({"readiness":app.readiness, "status":app.status, "checks":checks})

@api_view(["GET"])
def incentive_list(request): return Response(incentives(request.query_params))
@api_view(["GET"])
def sources(request): return Response([SOURCE])
@api_view(["GET"])
def officer_dashboard(request):
    supabase_user = getattr(request, 'supabase_user', None)
    if not supabase_user:
        return Response({'error': 'Unauthorized'}, status=401)
    
    from apps.core.models import UserProfile
    try:
        profile = UserProfile.objects.get(supabase_id=supabase_user.get('sub'))
        if profile.role != 'officer':
            return Response({'error': 'Forbidden'}, status=403)
    except UserProfile.DoesNotExist:
        return Response({'error': 'Forbidden'}, status=403)
        
    return Response({"metrics":[{"label":"Applications Received","value":86},{"label":"Pending","value":42},{"label":"SLA Risk","value":17},{"label":"Inspections Pending","value":13}], "bottlenecks":[{"approval":"Fire NOC","pending":42,"delay":"8 days","risk":"High"},{"approval":"Factory Licence","pending":21,"delay":"3 days","risk":"Medium"},{"approval":"Pollution Consent","pending":17,"delay":"6 days","risk":"High"}], "label":"Representative seeded prototype data"})
