import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PopupDialog } from "@/services/PopupDialog"
import axios from 'axios'
import { ArrowLeft, CheckCircle, ChefHat, Clock, Utensils } from 'lucide-react'
import { useState } from "react"

interface Recipe{
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
  const [isCooking, setIsCooking] = useState(false);
  const handleCook = async() => {
    try{
      const names = recipe.ingredients
      const token=localStorage.getItem('token')
      const storedRecipes = localStorage.getItem('recipes');
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      // 削除したい ingredients に含まれる名前を持つ recipe を除外
      const updatedRecipes = recipes.filter((recipe:Recipe) => {
        // recipe の ingredients に削除対象の名前が含まれているか確認
        const hasIngredientToRemove = recipe.ingredients.some((ingredient) =>
          names.includes(ingredient)
        );
        // 削除対象の名前が含まれている場合は false を返す
        return !hasIngredientToRemove;
      });
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
      console.log("ローカルストレージを更新しました。");

      const response = await axios.delete("http://localhost:80/service/cook/",{
        data:{recipe_id:recipe.id,names:names},
        headers:{
          'Authorization': token ? `Token ${token}` : '',
        }
      })
      const localingredients = localStorage.getItem('ingredients');
      const ingredients = localingredients ? JSON.parse(localingredients) : [];

      //削除する材料に一致するものを除外
      const updatedIngredients=ingredients.filter(
        (ingredients: { name: string; }) => !names.includes(ingredients.name)
      )
      localStorage.setItem('ingredients', JSON.stringify(updatedIngredients));
      console.log('材料を削除しました:', names);
      console.log('調理開始:', response.data);
      setIsCooking(true);
    } catch (error) {
      console.error('調理開始エラー:', error);
    }
  };

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle>レシピが見つかりません</CardTitle>
            <CardDescription>申し訳ありませんが、指定されたレシピは存在しないか、読み込めませんでした。</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={onBack}>戻る</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  

  return (
    <div className="container mx-auto px-20 py-4 text-left">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
      </Button>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl">{recipe.name}</CardTitle>
          <CardDescription>{recipe.description}</CardDescription>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{recipe.cookingTime}</span>
            </div>
            <div className="flex items-center">
              <ChefHat className="mr-2 h-4 w-4" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">材料</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-xl font-semibold mb-2">手順</h3>
              <ol className="list-decimal list-inside space-y-2">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
        {isCooking ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span className="text-lg font-semibold">調理開始済み</span>
            </div>
          ) : (
          <PopupDialog
            trigger={
              <Button size="lg" className="w-full sm:w-auto">
                <Utensils className="mr-2 h-5 w-5" />
                この料理をつくる
              </Button>
            }
            title="料理を始めますか？"
            description="必要な材料と手順を確認しましたか？"
            onConfirm={() => handleCook()}
            confirmText="料理を始める"
          >
            <p>この料理を始めると、以下の操作が行われます：</p>
            <ul className="list-disc list-inside mt-2">
              <li>使用する材料が在庫から差し引かれます</li>
              <li>調理履歴に記録されます</li>
            </ul>
          </PopupDialog>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

