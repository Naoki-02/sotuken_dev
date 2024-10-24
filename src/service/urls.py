from django.urls import include, path

from . import views

urlpatterns = [
    path('chat/', views.ChatGPTView.as_view(), name='chat'),
    path('ingredients/', views.IngredientsView.as_view(), name='ingredients'),
    path('get_ingredients/',views.IngredientsListView.as_view(), name='get_ingredients'),
    # path('get/', views.GetAPIView.as_view(), name='get'),
    # path('post/', views.PostAPIView.as_view(), name='post'),
]