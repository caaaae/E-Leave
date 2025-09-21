from django.db import models
from django.conf import settings

# Create your models here.
class LeaveDetails(models.Model):
    employee_name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=100)
    username = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="leaves")
    email = models.CharField(max_length=100)
    department = models.CharField(max_length=100)
    leave_type = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    reason_leave = models.CharField(max_length=255)
    supporting_doc = models.FileField(upload_to='docs/', null=True, blank=True)
    leave_status = models.CharField(max_length=100)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)