'use client'

import RecipeDetail from '@/pages/recipe-detail'
import RecipeSuggestion from '@/pages/recipe-suggestion'
import { Recipe } from '@/types/recipe-types'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/service/get_recipes/', {
          headers: {
            Authorization: `Token ${token}`,
          },
      })
        console.log(response.data.recipes)
        setRecipes(response.data.recipes)
      } catch (err) {
        setError('レシピデータの取得に失敗しました。')
      } finally {
        setLoading(false)
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
