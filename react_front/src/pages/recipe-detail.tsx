import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ChefHat, Clock } from 'lucide-react'

interface RecipeDetailProps {
  recipe: {
    id: number
    name: string
    description: string
    ingredients: string[]
    instructions: string[]
    cookingTime: string
    difficulty: string
  }
  onBack: () => void
}

export default function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
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
      </Card>
    </div>
  )
}

