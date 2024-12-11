'use client'

import RecipeDetail from '@/pages/recipe-detail'
import RecipeSuggestion from '@/pages/recipe-suggestion'
import { Recipe } from '@/types/recipe-types'
import { useState } from 'react'

// サンプルデータ（実際の実装では、このデータはサーバーから取得します）
const sampleRecipes: Recipe[] = [
  {
    id: 1,
    name: "野菜たっぷりミネストローネ",
    ingredients: ["トマト", "キャベツ", "ニンジン", "タマネギ", "ズッキーニ"],
    description: "栄養満点の野菜スープです。冷蔵庫の余り野菜を活用できます。簡単に作れて、体も温まる一品です。",
    instructions: [
      "野菜を一口大に切ります。",
      "鍋にオリーブオイルを熱し、玉ねぎとにんにくを炒めます。",
      "他の野菜を加えて軽く炒めます。",
      "トマト缶と水を加えて煮込みます。",
      "塩コショウで味を整えて完成です。"
    ],
    cookingTime: "約30分",
    difficulty: "簡単"
  },
  {
    id: 2,
    name: "簡単チキンカレー",
    ingredients: ["鶏肉", "ジャガイモ", "ニンジン", "タマネギ", "カレールー"],
    description: "誰でも作れる簡単カレー。野菜もたっぷり入って栄養バランス◎ スパイシーな味わいで、食欲も増進します。",
    instructions: [
      "野菜と鶏肉を一口大に切ります。",
      "鍋に油を熱し、鶏肉を炒めます。",
      "野菜を加えて炒めます。",
      "水を加えて野菜が柔らかくなるまで煮込みます。",
      "カレールーを溶かし入れ、とろみがつくまで煮込んで完成です。"
    ],
    cookingTime: "約40分",
    difficulty: "普通"
  },
  {
    id: 3,
    name: "アボカドサラダ",
    ingredients: ["アボカド", "トマト", "レタス", "ツナ缶", "マヨネーズ"],
    description: "健康的で簡単に作れるサラダ。アボカドの濃厚さがクセになります。ビタミンEも豊富で美容にも良いです。",
    instructions: [
      "アボカドとトマトを一口大に切ります。",
      "レタスを食べやすい大きさにちぎります。",
      "ボウルに切った野菜とツナ缶を入れます。",
      "マヨネーズを加えて全体を優しく混ぜます。",
      "塩コショウで味を整えて完成です。"
    ],
    cookingTime: "約15分",
    difficulty: "とても簡単"
  }
]

export default function RecipePage() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleBack = () => {
    setSelectedRecipe(null)
  }

  return (
    <main>
      {selectedRecipe ? (
        <RecipeDetail recipe={selectedRecipe} onBack={handleBack} />
      ) : (
        <RecipeSuggestion recipes={sampleRecipes} onViewRecipe={handleViewRecipe} />
      )}
    </main>
  )
}

