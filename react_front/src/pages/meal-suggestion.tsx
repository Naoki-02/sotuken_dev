'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PopupDialog } from "@/services/PopupDialog"
import { Dish, MealData } from "@/types/recipe1day-types"
import axios from "axios"
import { ChefHat, Clock, Trash2, Utensils } from 'lucide-react'
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface MealSuggestionProps {
  mealData: MealData;
  onViewDish: (dish: Dish) => void;
}

export default function MealSuggestion({ mealData, onViewDish }: MealSuggestionProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  // すべての料理の材料を集める関数
  const getAllIngredients = (): string[] => {
    const allIngredients = new Set<string>()
    Object.values(mealData).forEach((meals: Dish[]) => {
      meals.forEach((dish: Dish) => {
        dish.ingredients.forEach((ingredient: string) => {
          allIngredients.add(ingredient)
        })
      })
    })
    return Array.from(allIngredients)
  }

  const handleDeleteAllIngredients = async () => {
    try {
      setIsDeleting(true)
      const token = localStorage.getItem('token')
      const allIngredients = getAllIngredients()
      
      // 食材の削除リクエスト
      await axios.delete("http://localhost:80/service/cook/", {
        data: { names: allIngredients },
        headers: {
          'Authorization': token ? `Token ${token}` : '',
        }
      })

      // ローカルストレージの食材データを更新
      const localIngredients = localStorage.getItem('ingredients')
      const ingredients: { name: string }[] = localIngredients ? JSON.parse(localIngredients) : []
      const updatedIngredients = ingredients.filter(
        (ingredient: { name: string }) => !allIngredients.includes(ingredient.name)
      )
      localStorage.setItem('ingredients', JSON.stringify(updatedIngredients))

      localStorage.removeItem('meal1day')

      navigate('/')      

    } catch (error) {
      console.error('食材の削除に失敗しました:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-orange-800">今日のおすすめメニュー</h1>
        </div>
        <p className="text-orange-600">1日分のおすすめ料理をご提案します</p>
      </div>

      <div className="mb-8 flex justify-center">
        <PopupDialog
          trigger={
            <Button 
              variant="outline"
              size="lg"
              className="border-orange-200 hover:bg-orange-100 text-orange-700 hover:text-orange-800"
              disabled={isDeleting}
            >
              <Trash2 className="h-5 w-5 mr-2" />
              全ての必要食材を削除
            </Button>
          }
          title="全ての必要食材を削除しますか？"
          description="この1日分の献立に必要な全ての食材を在庫から削除します"
          onConfirm={handleDeleteAllIngredients}
          confirmText="削除する"
        >
          <div className="space-y-4 text-orange-800">
            <p>以下の食材が在庫から削除されます：</p>
            <div className="max-h-[200px] overflow-y-auto pr-2">
              <ul className="list-disc list-inside space-y-1 text-orange-600">
                {getAllIngredients().map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
        </PopupDialog>
      </div>
      
      {(Object.keys(mealData) as Array<keyof MealData>).map((mealType) => (
        <div key={mealType} className="mb-12">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">
            {mealType === "breakfast" && "朝食"}
            {mealType === "lunch" && "昼食"}
            {mealType === "dinner" && "夕食"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealData[mealType].map((dish: Dish) => (
              <Card 
                key={dish.id} 
                className="w-full h-[400px] flex flex-col bg-orange-50/50 border-orange-100 hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader className="space-y-2 border-b border-orange-100 pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl text-orange-800">{dish.name}</CardTitle>
                    <div className="flex items-center gap-1 text-orange-600 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{dish.cooking_time}</span>
                    </div>
                  </div>
                  <ScrollArea className="h-24 pr-4">
                    <p className="text-base text-orange-600">{dish.description}</p>
                  </ScrollArea>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow pt-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="h-4 w-4 text-orange-600" />
                      <h3 className="font-semibold text-base text-orange-800">材料：</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {dish.ingredients.map((ingredient, index) => (
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
                    onClick={() => onViewDish(dish)}
                  >
                    詳細を見る
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

