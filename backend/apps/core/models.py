from django.db import models

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('entrepreneur', 'Entrepreneur'),
        ('officer', 'Officer'),
        ('admin', 'Admin'),
    ]

    supabase_id = models.CharField(max_length=255, unique=True, db_index=True)
    email = models.EmailField()
    full_name = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='entrepreneur')
    is_onboarded = models.BooleanField(default=False)
    company_name = models.CharField(max_length=200, blank=True)
    gstin = models.CharField(max_length=15, blank=True)
    contact_phone = models.CharField(max_length=15, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Project(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='projects', null=True, blank=True)
    name = models.CharField(max_length=160)
    sector = models.CharField(max_length=100)
    project_type = models.CharField(max_length=100, default="New manufacturing unit")
    location = models.CharField(max_length=120)
    district = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=80, default="Maharashtra")
    investment_amount = models.BigIntegerField(default=0)
    employee_count = models.PositiveIntegerField(default=0)
    is_midc = models.BooleanField(default=False)
    land_status = models.CharField(max_length=80, default="To be confirmed")
    power_requirement = models.CharField(max_length=80, blank=True)
    environmental_category = models.CharField(max_length=80, default="To be confirmed")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Document(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="documents")
    name = models.CharField(max_length=160)
    status = models.CharField(max_length=40, default="Missing")
    file = models.FileField(upload_to="documents/", blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Application(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="applications")
    approval_name = models.CharField(max_length=160)
    status = models.CharField(max_length=40, default="draft")
    readiness = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

class UserDocument(models.Model):
    STATUS_CHOICES = [
        ('uploaded', 'Uploaded'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]

    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='user_documents')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='user_documents', null=True, blank=True)
    name = models.CharField(max_length=200)
    document_type = models.CharField(max_length=80)
    file = models.FileField(upload_to='user_documents/')
    file_size = models.PositiveIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploaded')
    metadata = models.JSONField(default=dict, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
