from django.urls import path
from . import views
from . import auth_views
from . import document_views
from . import ai_views

urlpatterns = [
    # Existing routes
    path("health/", views.health), 
    path("projects/", views.projects), 
    path("projects/<int:pk>/", views.project_detail), 
    path("projects/<int:pk>/journey/", views.project_journey), 
    path("projects/<int:pk>/documents/", views.documents),
    path("ai/analyze-project/", views.analyze), 
    path("demo/journey/", views.demo_journey), 
    path("applications/", views.applications), 
    path("applications/<int:pk>/validate/", views.validate_application), 
    path("incentives/", views.incentive_list), 
    path("sources/", views.sources), 
    path("officer/dashboard/", views.officer_dashboard),

    # New Auth Routes
    path('auth/profile/', auth_views.profile),
    path('auth/complete-onboarding/', auth_views.complete_onboarding),

    # New Document Routes
    path('documents/', document_views.document_list),
    path('documents/upload/', document_views.document_upload),
    path('documents/<int:pk>/', document_views.document_detail),

    # New AI Routes
    path('ai/chat/', ai_views.chat),
]
