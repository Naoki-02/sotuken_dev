from django.urls import path

from . import views

urlpatterns = [
    path('chat/', views.ChatGPTView.as_view(), name='chat'),
    path('ingredients/', views.IngredientsView.as_view(), name='ingredients'),
    # path('get/', views.GetAPIView.as_view(), name='get'),
    # path('post/', views.PostAPIView.as_view(), name='post'),
]