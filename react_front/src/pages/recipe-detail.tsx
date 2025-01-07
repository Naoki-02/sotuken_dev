"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PopupDialog } from "@/services/PopupDialog"
import axios from 'axios'
import { ArrowLeft, CheckCircle, ChefHat, Clock, ListOrdered, Utensils } from 'lucide-react'
import { useState } from "react"

interface Recipe {
  id: number
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  cookingTime: string
  difficulty: string
}

interface RecipeDetailProps {
  recipe: Recipe
  onBack: () => void
}

export default function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const [isCooking, setIsCooking] = useState(false)

  const handleCook = async() => {
    try {
      const names = recipe.ingredients
      const token = localStorage.getItem('token')
      const storedRecipes = localStorage.getItem('recipes')
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : []
      
      const updatedRecipes = recipes.filter((recipe: Recipe) => {
        const hasIngredientToRemove = recipe.ingredients.some((ingredient) =>
          names.includes(ingredient)
        )
        return !hasIngredientToRemove
      })
      
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes))

      await axios.delete("http://localhost:80/service/cook/", {
        data: { recipe_id: recipe.id, names: names },
        headers: {
          'Authorization': token ? `Token ${token}` : '',
        }
      })

      const localingredients = localStorage.getItem('ingredients')
      const ingredients = localingredients ? JSON.parse(localingredients) : []
      const updatedIngredients = ingredients.filter(
        (ingredient: { name: string }) => !names.includes(ingredient.name)
      )
      
      localStorage.setItem('ingredients', JSON.stringify(updatedIngredients))
      setIsCooking(true)
    } catch (error) {
      console.error('調理開始エラー:', error)
    }
  }

  if (!recipe) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto bg-orange-50/50 border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-800">レシピが見つかりません</CardTitle>
            <CardDescription className="text-orange-600">
              申し訳ありませんが、指定されたレシピは存在しないか、読み込めませんでした。
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={onBack}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              戻る
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-20 py-4">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="mb-4 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
      </Button>
      
      <Card className="w-full bg-orange-50/50 border-orange-100">
        <CardHeader className="border-b border-orange-100">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl text-orange-800 mb-2">
                  {recipe.name}
                </CardTitle>
                <CardDescription className="text-orange-600 text-base">
                  {recipe.description}
                </CardDescription>
              </div>
              {isCooking && (
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  調理中
                </Badge>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="bg-white border-orange-200 text-orange-700">
                <Clock className="mr-2 h-4 w-4" />
                {recipe.cookingTime}
              </Badge>
              <Badge variant="secondary" className="bg-white border-orange-200 text-orange-700">
                <ChefHat className="mr-2 h-4 w-4" />
                {recipe.difficulty}
              </Badge>
              {/* <Badge variant="secondary" className="bg-white border-orange-200 text-orange-700">
                <Flame className="mr-2 h-4 w-4" />
                {recipe.calories || "300kcal"}
              </Badge> */}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-orange-600" />
              <h3 className="text-xl font-semibold text-orange-800">材料</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-white border-orange-200 text-orange-700 justify-center py-2"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="bg-orange-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-orange-600" />
              <h3 className="text-xl font-semibold text-orange-800">手順</h3>
            </div>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li 
                  key={index}
                  className="flex gap-4 p-4 bg-white rounded-lg border border-orange-100"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 rounded-full text-orange-600 font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-orange-800">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center p-6 pt-0">
          {isCooking ? (
            <div className="flex items-center bg-green-100 text-green-700 px-6 py-3 rounded-lg">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span className="text-lg font-semibold">調理開始済み</span>
            </div>
          ) : (
            <PopupDialog
              trigger={
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Utensils className="mr-2 h-5 w-5" />
                  この料理をつくる
                </Button>
              }
              title="料理を始めますか？"
              description="必要な材料と手順を確認しましたか？"
              onConfirm={handleCook}
              confirmText="料理を始める"
            >
              <div className="space-y-4 text-orange-800">
                <p>この料理を始めると、以下の操作が行われます：</p>
                <ul className="list-disc list-inside space-y-2 text-orange-600">
                  <li>使用する材料が在庫から差し引かれます</li>
                  <li>調理履歴に記録されます</li>
                </ul>
              </div>
            </PopupDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

