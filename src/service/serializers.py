# serializers.py
from rest_framework import serializers

from .models import Ingredient, Ingredients, Instruction, Recipe


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredients
        fields = ['id','name', 'quantity', 'category', 'created_at', 'updated_at']
        
class RecipeSerializer(serializers.ModelSerializer):
    ingredients=serializers.SerializerMethodField()
    instructions=serializers.SerializerMethodField()
    
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