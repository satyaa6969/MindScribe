from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('entries/', views.JournalEntryListCreateView.as_view(), name='entry-list-create'),
    path('dashboard-stats/', views.DashboardStatsView.as_view(), name='dashboard-stats')
]