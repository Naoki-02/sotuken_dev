"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2 } from "lucide-react"
import { useState } from "react"

interface Ingredient {
    id: number;
    name: string;
    quantity: string;
    category: string;
}

export default function MultiIngredientForm() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: 1, name: "", quantity: "", category: "" }
    ])

    const addIngredient = () => {
        const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1
        setIngredients([...ingredients, { id: newId, name: "", quantity: "", category: "" }])
    }

    const removeIngredient = (id: number) => {
        setIngredients(ingredients.filter(ingredient => ingredient.id !== id))
    }

    const updateIngredient = (id: number, field: keyof Ingredient, value: string) => {
        setIngredients(ingredients.map(ingredient =>
            ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
        ))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // ここで食材追加のロジックを実装します
        console.log(ingredients)
        // フォームをリセット
        setIngredients([{ id: 1, name: "", quantity: "", category: "" }])
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>複数食材追加</CardTitle>
                <CardDescription>複数の食材情報を入力してください。</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {ingredients.map((ingredient, index) => (
                        <div key={ingredient.id} className="flex flex-wrap gap-4 items-end border-b pb-4">
                            <div className="flex-1 min-w-[200px] space-y-2">
                                <Label htmlFor={`name-${ingredient.id}`}>食材名</Label>
                                <Input
                                    id={`name-${ingredient.id}`}
                                    value={ingredient.name}
                                    onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                                    placeholder="例：トマト"
                                    required
                                />
                            </div>
                            <div className="flex-1 min-w-[150px] space-y-2">
                                <Label htmlFor={`quantity-${ingredient.id}`}>数量</Label>
                                <Input
                                    id={`quantity-${ingredient.id}`}
                                    value={ingredient.quantity}
                                    onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
                                    placeholder="例：3個"
                                    required
                                />
                            </div>
                            <div className="flex-1 min-w-[150px] space-y-2">
                                <Label htmlFor={`category-${ingredient.id}`}>カテゴリー</Label>
                                <Select
                                    value={ingredient.category}
                                    onValueChange={(value) => updateIngredient(ingredient.id, "category", value)}
                                    required
                                >
                                    <SelectTrigger id={`category-${ingredient.id}`}>
                                        <SelectValue placeholder="選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vegetable">野菜</SelectItem>
                                        <SelectItem value="fruit">果物</SelectItem>
                                        <SelectItem value="meat">肉</SelectItem>
                                        <SelectItem value="fish">魚</SelectItem>
                                        <SelectItem value="dairy">乳製品</SelectItem>
                                        <SelectItem value="grain">穀物</SelectItem>
                                        <SelectItem value="spice">調味料</SelectItem>
                                        <SelectItem value="other">その他</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {ingredients.length > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeIngredient(ingredient.id)}
                                    aria-label="食材を削除"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addIngredient} className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> 食材を追加
                    </Button>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">食材を保存</Button>
                </CardFooter>
            </form>
        </Card>
    )
}