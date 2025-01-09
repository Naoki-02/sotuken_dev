"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Recipe } from "@/types/recipe-types"
import { ChefHat, Clock, RefreshCcw, Utensils } from 'lucide-react'
import { useNavigate } from "react-router-dom"
interface RecipeSuggestionProps {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
}

export default function RecipeSuggestion({ recipes, onViewRecipe }: RecipeSuggestionProps) {
  const navigate = useNavigate()
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-orange-800">おすすめのレシピ</h1>
        </div>
        <p className="text-orange-600">今日の食材でつくれるレシピをご提案します</p>
        <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('recipes');
                navigate('/')
              }}
              className="border-orange-200 hover:bg-orange-100 text-orange-700 hover:text-orange-800"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              レシピを再提案
            </Button>
          </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card 
            key={recipe.id} 
            className="w-full h-[400px] flex flex-col bg-orange-50/50 border-orange-100 hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="space-y-2 border-b border-orange-100 pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-orange-800">{recipe.name}</CardTitle>
                <div className="flex items-center gap-1 text-orange-600 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookingTime || "30分"}</span>
                </div>
              </div>
              <ScrollArea className="h-24 pr-4">
                <p className="text-base text-orange-600">{recipe.description}</p>
              </ScrollArea>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow pt-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="h-4 w-4 text-orange-600" />
                  <h3 className="font-semibold text-base text-orange-800">材料：</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="bg-white border border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                className="w-full text-base bg-orange-600 hover:bg-orange-700"
                onClick={() => onViewRecipe(recipe)}
              >
                レシピを見る
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

