import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Recipe } from "@/types/recipe-types"

interface RecipeSuggestionProps {
  recipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
}

export default function RecipeSuggestion({ recipes, onViewRecipe }: RecipeSuggestionProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">おすすめのレシピ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="w-full h-[340px] flex flex-col">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2x1">{recipe.name}</CardTitle>
              <ScrollArea className="h-24">
                <p className="text-base text-muted-foreground">{recipe.description}</p>
              </ScrollArea>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <div className="flex-grow text-left">
                <h3 className="font-semibold text-base mb-1 text-left">材料：</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full text-base" onClick={() => onViewRecipe(recipe)}>レシピを見る</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

