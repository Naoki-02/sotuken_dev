# serializers.py
from rest_framework import serializers

from .models import Ingredients


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredients
        fields = ['name', 'quantity', 'category', 'created_at', 'updated_at']
