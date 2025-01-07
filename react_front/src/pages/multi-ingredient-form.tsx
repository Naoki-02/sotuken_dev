"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Trash2, Utensils } from 'lucide-react'
import { useState } from "react"
import { postRequest } from "../services/postRequest"

interface Ingredient {
    id: number;
    name: string;
    quantity: string;
    category: string;
}

const categories = [
    { value: "vegetable", label: "野菜" },
    { value: "fruit", label: "果物" },
    { value: "meat", label: "肉" },
    { value: "fish", label: "魚" },
    { value: "dairy", label: "乳製品" },
    { value: "grain", label: "穀物" },
    { value: "spice", label: "調味料" },
    { value: "other", label: "その他" },
];

export default function MultiIngredientForm() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { id: 1, name: "", quantity: "", category: "" }
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            const data = {
                ingredients: ingredients.map(({ id, ...rest }) => ({ ...rest }))
            }
            const token = localStorage.getItem('token');
            await postRequest('http://localhost:80/service/post_ingredients/', data, token);
            setIngredients([{ id: 1, name: "", quantity: "", category: "" }])
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto bg-orange-50/50 border-orange-100">
                <CardHeader className="border-b border-orange-100">
                    <div className="flex items-center gap-2">
                        <Utensils className="h-6 w-6 text-orange-600" />
                        <div>
                            <CardTitle className="text-orange-800">食材追加</CardTitle>
                            <CardDescription className="text-orange-600">
                                食材情報を入力してください
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 p-6">
                        {ingredients.map((ingredient, index) => (
                            <div 
                                key={ingredient.id} 
                                className="flex flex-wrap gap-4 items-end p-4 rounded-lg bg-white border border-orange-100 shadow-sm"
                            >
                                <div className="flex-1 min-w-[200px] space-y-2">
                                    <Label 
                                        htmlFor={`name-${ingredient.id}`}
                                        className="text-orange-800"
                                    >
                                        食材名
                                    </Label>
                                    <Input
                                        id={`name-${ingredient.id}`}
                                        value={ingredient.name}
                                        onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                                        placeholder="例：トマト"
                                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px] space-y-2">
                                    <Label 
                                        htmlFor={`quantity-${ingredient.id}`}
                                        className="text-orange-800"
                                    >
                                        数量
                                    </Label>
                                    <Input
                                        id={`quantity-${ingredient.id}`}
                                        value={ingredient.quantity}
                                        onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
                                        placeholder="例：3個"
                                        className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    />
                                </div>
                                <div className="flex-1 min-w-[150px] space-y-2">
                                    <Label 
                                        htmlFor={`category-${ingredient.id}`}
                                        className="text-orange-800"
                                    >
                                        カテゴリー
                                    </Label>
                                    <Select
                                        value={ingredient.category}
                                        onValueChange={(value) => updateIngredient(ingredient.id, "category", value)}
                                        required
                                    >
                                        <SelectTrigger 
                                            id={`category-${ingredient.id}`}
                                            className="border-orange-200 focus:ring-orange-500"
                                        >
                                            <SelectValue placeholder="選択してください" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem 
                                                    key={category.value} 
                                                    value={category.value}
                                                >
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {ingredients.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeIngredient(ingredient.id)}
                                        className="border-orange-200 hover:bg-orange-100 hover:text-orange-900"
                                        aria-label="食材を削除"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={addIngredient} 
                            className="w-full border-orange-200 hover:bg-orange-100 text-orange-700 hover:text-orange-900"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> 
                            食材を追加
                        </Button>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                        <Button 
                            type="submit" 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '保存中...' : '食材を保存'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

