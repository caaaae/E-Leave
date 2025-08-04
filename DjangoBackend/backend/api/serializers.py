from django.contrib.auth.models import User
from rest_framework import serializers
from .models import LeaveDetails

#For creation of JSON format request
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create (self, validate_data):
        user = User.objects.create_user(**validate_data)
        return user
    
class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveDetails
        fields = ["id",
                  "employee_name",
                  "employee_id",
                  "email",
                  "department", 
                  "leave_type", 
                  "start_date", 
                  "end_date", 
                  "reason_leave", 
                  "supporting_doc",
                  "leave_status",
                  "created_at",
                  "updated_at"
                  ]

class GetUsernameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        extra_kwargs = {"email": {"read_only": True}, 
                        "username": {"read_only": True},
                        "first_name": {"read_only": True}, 
                        "last_name": {"read_only": True},}
        
class GetLeaveDetails(serializers.ModelSerializer):
    class Meta:
        model = LeaveDetails
        fields = ["id", 
                  "leave_type", 
                  "start_date", 
                  "end_date", 
                  "leave_status",
                  ]
        extra_kwargs = {"username": {"read_only": True}}

class GetAllLeaveDetails(serializers.ModelSerializer):
    class Meta:
        model = LeaveDetails
        fields = ["id",
                  "employee_name",
                  "employee_id",
                  "email",
                  "department",
                  "leave_type", 
                  "start_date", 
                  "end_date", 
                  "reason_leave",
                  "leave_status",
                  "supporting_doc",
                  ]
        extra_kwargs = {"username": {"read_only": True}}