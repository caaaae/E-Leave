from django.urls import path
from . import views

urlpatterns = [
    # path("leaves/", views.LeaveCreateView.as_view(), name='leave-list'),
    path("leaves/delete/<int:pk>/", views.LeaveDeleteView.as_view(), name='delete-leave'),
    path("leaves/update/<int:pk>/", views.LeaveUpdateView.as_view(), name='update-leave'),
    path("users/", views.RetrieveUserView.as_view(), name='user-list'),
    path("leaves/", views.RetrieveUserLeaveView.as_view(), name='leave-list'),
    path("createleaves/", views.LeaveCreateView.as_view(), name='leave-create'),
    path("allgetleaves/", views.RetrieveAllUserLeavesView.as_view(), name='leave-all'),
]