from django.urls import path

from . import views

urlpatterns = [
    # path('', views.index, name='index'),
    path('get/', views.GetAPIView.as_view(), name='get'),
    path('post/', views.PostAPIView.as_view(), name='post'),
]