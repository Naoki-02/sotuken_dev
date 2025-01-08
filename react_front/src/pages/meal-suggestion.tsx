'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dish, MealData } from "@/types/recipe1day-types"
import { ChefHat, Clock, Utensils } from 'lucide-react'

interface MealSuggestionProps {
  mealData: MealData;
  onViewDish: (dish: Dish) => void;
}

export default function MealSuggestion({ mealData, onViewDish }: MealSuggestionProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ChefHat className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-orange-800">今日のおすすめメニュー</h1>
        </div>
        <p className="text-orange-600">1日分のおすすめ料理をご提案します</p>
      </div>
      
      {["breakfast", "lunch", "dinner"].map((mealType) => (
        <div key={mealType} className="mb-12">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">
            {mealType === "breakfast" && "朝食"}
            {mealType === "lunch" && "昼食"}
            {mealType === "dinner" && "夕食"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealData[mealType as keyof MealData].map((dish) => (
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
