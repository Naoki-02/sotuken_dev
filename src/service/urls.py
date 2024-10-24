from django.urls import include, path

from . import views

urlpatterns = [
    path('chat/', views.ChatGPTView.as_view(), name='chat'),
    path('post_ingredients/', views.PostIngredientsView.as_view(), name='ingredients'),
    path('get_ingredients/',views.GetIngredientsListView.as_view(), name='get_ingredients'),
    path('delete_ingredients/<int:pk>/',views.DeleteIngredients.as_view(), name='delete_ingredients'),
    path('update_ingredients/<int:pk>/',views.UpdateIngredients.as_view(), name='update_ingredients'),
    # path('get/', views.GetAPIView.as_view(), name='get'),
    # path('post/', views.PostAPIView.as_view(), name='post'),
]