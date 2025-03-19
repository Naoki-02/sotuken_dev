'use client'

import DishDetail from '@/pages/dish-detail';
import MealSuggestion from '@/pages/meal-suggestion';
import { fetchMealData } from '@/services/fetchMealData';
import { saveToLocalStorage } from '@/services/SaveLocalStorage';
import { Dish, MealData } from '@/types/recipe1day-types'; // Meal, Dish インターフェースをインポート
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Recipe1Day() {
  const [mealData, setMealData] = useState<MealData | null>(null) // 1日分の食事データ
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null) // 選択された料理
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMeal = async () => {
      const localMeal = localStorage.getItem('meal1day')
      console.log("localMeal:",localMeal)

      //localMealがnullの場合,parsedDataもnullになる
      const parsedData = localMeal ? JSON.parse(localMeal) : null
      console.log("parsedData:",parsedData)
      setLoading(true)
      setError(null)

      if (parsedData) {
        setMealData(parsedData)
        console.log('ローカルストレージから取得しました。')
        setLoading(false)
      } else {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            setError('ログインしていません。')
            setLoading(false)
            return
          }

          const response = await axios.get('http://localhost:80/service/get_meal1day/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          }) 
          console.log("response.data:",response.data)
          const mealData = fetchMealData(response.data.meal)
          console.log("mealData:",mealData)
          saveToLocalStorage('meal1day', mealData)
          console.log("サーバから取得しました")
          setMealData(mealData)
        } catch (err) {
          setError('食事データの取得に失敗しました。')
        } finally {
          setLoading(false)
        }
      }
    }
    fetchMeal()
  }, [])

  const handleViewDish = (dish: Dish) => {
    setSelectedDish(dish)
  }

  const handleBack = () => {
    setSelectedDish(null)
  }

  return (
    <main>
      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : selectedDish ? (
        <DishDetail dish={selectedDish} onBack={handleBack} />
      ) : mealData ? (
        <MealSuggestion mealData={mealData} onViewDish={handleViewDish} />
      ) : (
        <p>データがありません。</p>
      )}
    </main>
  )
}