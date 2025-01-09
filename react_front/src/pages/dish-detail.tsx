'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dish } from "@/types/recipe1day-types"
import axios from 'axios'
import { ArrowLeft, CheckCircle, ChefHat, Clock, ListOrdered, Utensils } from 'lucide-react'
import { useState } from "react"

interface DishDetailProps {
  dish: Dish
  onBack: () => void
}

export default function DishDetail({ dish, onBack }: DishDetailProps) {
  const [isCooking, setIsCooking] = useState(false)

  const handleCook = async () => {
    try {
      const names = dish.ingredients
      const token = localStorage.getItem('token')
      const storedDishes = localStorage.getItem('dishes')
      const dishes = storedDishes ? JSON.parse(storedDishes) : []

      const updatedDishes = dishes.filter((d: Dish) => {
        const hasIngredientToRemove = d.ingredients.some((ingredient) =>
          names.includes(ingredient)
        )
        return !hasIngredientToRemove
      })

      localStorage.setItem('dishes', JSON.stringify(updatedDishes))

      await axios.delete("http://localhost:80/service/", {
        data: { dish_id: dish.id, names: names },
        headers: {
          'Authorization': token ? `Token ${token}` : '',
        }
      })

      const localIngredients = localStorage.getItem('ingredients')
      const ingredients = localIngredients ? JSON.parse(localIngredients) : []
      const updatedIngredients = ingredients.filter(
        (ingredient: { name: string }) => !names.includes(ingredient.name)
      )

      localStorage.setItem('ingredients', JSON.stringify(updatedIngredients))
      setIsCooking(true)
    } catch (error) {
      console.error('調理開始エラー:', error)
    }
  }

  if (!dish) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-md mx-auto bg-orange-50/50 border-orange-100">
          <CardHeader>
            <CardTitle className="text-orange-800">料理が見つかりません</CardTitle>
            <CardDescription className="text-orange-600">
              申し訳ありませんが、指定された料理は存在しないか、読み込めませんでした。
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
                  {dish.name}
                </CardTitle>
                <CardDescription className="text-orange-600 text-base">
                  {dish.description}
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
                {dish.cooking_time}
              </Badge>
              <Badge variant="secondary" className="bg-white border-orange-200 text-orange-700">
                <ChefHat className="mr-2 h-4 w-4" />
                {dish.meal_type}
              </Badge>
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
              {dish.ingredients.map((ingredient, index) => (
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
              {dish.instructions.map((instruction, index) => (
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
      </Card>
    </div>
  )
}
