# serializers.py
from rest_framework import serializers

from .models import (CookHistory, Dish, Ingredient, Ingredients, Instruction,
                     Meal, Recipe)


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredients
        fields = ['id', 'name', 'quantity',
                  'category', 'created_at', 'updated_at']


class RecipeSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()
    instructions = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = [
            'id',
            'name',
            'description',
            'cooking_time',
            'difficulty',
            'ingredients',
            'instructions'
        ]

    def get_ingredients(self, obj):
        return [ingredient.name for ingredient in obj.ingredients.all()]

    def get_instructions(self, obj):
        return [instruction.description for instruction in obj.instructions.all()]


class CookRecipeSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['name', 'ingredients']

    def get_ingredients(self, obj):
        return [ingredient.name for ingredient in obj.ingredients.all()]


class CookHistorySerializer(serializers.ModelSerializer):
    recipe = CookRecipeSerializer()
    cooked_at=serializers.SerializerMethodField()
    
    def get_cooked_at(self, obj):
        return obj.cooked_at.astimezone().isoformat(timespec='seconds')
    
    class Meta:
        model = CookHistory
        fields = ['id', 'recipe', 'cooked_at']
        
class DishSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()
    instructions = serializers.SerializerMethodField()
    
    class Meta:
        model = Dish
        fields = ['id', 'name', 'description','ingredients','instructions','cooking_time','meal_type']
        
    def get_ingredients(self, obj):
        return [ingredient.name for ingredient in obj.ingredients.all()]

    def get_instructions(self, obj):
        return [instruction.description for instruction in obj.instructions.all()]
    
class MealSerializer(serializers.ModelSerializer):
    dishes=DishSerializer(many=True)
    
    class Meta:
        model=Meal
        fields=['meal_time','dishes']
