from django.shortcuts import get_object_or_404, render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .serializers import UserSerializer, LeaveSerializer, GetUsernameSerializer, GetLeaveDetails, GetAllLeaveDetails
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .models import LeaveDetails
from django.contrib.auth import get_user_model

User = get_user_model()

# For creating leave
class LeaveCreateView(generics.CreateAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(username=self.request.user)
        else:
            print(serializer.errors)

# For deleting leave
class LeaveDeleteView(generics.DestroyAPIView):
    queryset = LeaveDetails.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     user = self.request.user
    #     return LeaveDetails.objects.filter(username=user)

# For Updating leave
class LeaveUpdateView(generics.UpdateAPIView):
    queryset = LeaveDetails.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     user = self.request.user
    #     return LeaveDetails.objects.filter(username=user)
    
# For creating user    
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# For getting user info
class RetrieveUserView(generics.RetrieveAPIView):
    serializer_class = GetUsernameSerializer
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     user = self.request.user
    #     return User.objects.filter(username=user)
    
    def get_object(self):
        user = self.request.user
        obj = get_object_or_404(User, username=user)
        self.check_object_permissions(self.request, obj)
        return obj
    
# For getting user Leave infos
class RetrieveUserLeaveView(generics.ListAPIView):
    serializer_class = GetLeaveDetails
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return LeaveDetails.objects.filter(username=user)
    
# For getting user Leave info without filtering
class RetrieveAllUserLeavesView(generics.ListAPIView):
    serializer_class = GetAllLeaveDetails
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LeaveDetails.objects.all()