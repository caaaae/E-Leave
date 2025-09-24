from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    employee_id = models.CharField(max_length=100)
    phoneNumber = models.CharField(max_length=20, default='0000-000-0000') 