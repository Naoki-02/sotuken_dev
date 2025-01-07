'use client'

import RecipeDetail from '@/pages/recipe-detail'
import RecipeSuggestion from '@/pages/recipe-suggestion'
import { Recipe } from '@/types/recipe-types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { saveToLocalStorage } from './SaveLocalStorage'

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      const localrecipes = localStorage.getItem('recipes')
      const parsedData = JSON.parse(localrecipes || '[]')
      setLoading(true)
      setError(null)
      if (parsedData && parsedData.length > 0) {
        setRecipes(parsedData)
        console.log('ローカルストレージから取得しました。')
        // console.log(localrecipes)
        setLoading(false)
      } else {
        try {
          const token = localStorage.getItem('token')
          await axios.get('http://localhost:80/service/get_recipes/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          }).then((response) => {
            saveToLocalStorage("recipes", response.data.recipes)
            setRecipes(response.data.recipes)
          })

        } catch (err) {
          setError('レシピデータの取得に失敗しました。')
        } finally {
          setLoading(false)
        }
      }
    }
    fetchRecipes()
  }, [])

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleBack = () => {
    setSelectedRecipe(null)
  }

  return (
    <main>
      {loading ? (
        <p>読み込み中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : selectedRecipe ? (
        <RecipeDetail recipe={selectedRecipe} onBack={handleBack} />
      ) : (
        <RecipeSuggestion recipes={recipes} onViewRecipe={handleViewRecipe} />
      )}
    </main>
  )
}
