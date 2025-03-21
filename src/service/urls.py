from django.urls import include, path

from . import views

urlpatterns = [
    path('post_ingredients/', views.PostIngredientsView.as_view(), name='ingredients'),
    path('get_ingredients/',views.GetIngredientsListView.as_view(), name='get_ingredients'),
    path('delete_ingredients/<int:pk>/',views.DeleteIngredients.as_view(), name='delete_ingredients'),
    path('update_ingredients/<int:pk>/',views.UpdateIngredients.as_view(), name='update_ingredients'),
    path('ocr/',views.OCRView.as_view(), name='ocr'),
    path('get_recipes/',views.RecipeSuggestionView.as_view(), name='get_recipes'),
    path('cook/',views.DeleteUseIngredients.as_view(), name='cook'),
    path('get_cook_history/',views.CookHistoryView.as_view(), name='get_cook_history'),
    path('get_meal1day/',views.Recipe_1DaySuggestionView.as_view(), name='get_meal1day'),
    path('remake_recipe/',views.RemakeRecipeView.as_view(), name='remake_recipe'),
]