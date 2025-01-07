'use client'

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from 'axios'
import { Pencil, Search, Trash2, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Ingredient {
    id: number
    name: string
    quantity: string
    expirationDate: string
    category: string
}
interface EditFormProps {
    item: Ingredient | null
    onSave: (item: Ingredient) => void
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

const categoryMap: Record<string, string> = {
    vegetable: "野菜",
    fruit: "果物",
    meat: "肉",
    fish: "魚",
    dairy: "乳製品",
    grain: "穀物",
    spice: "調味料",
    other: "その他",
};

export default function FoodListScreen() {
    const [foodItems, setFoodItems] = useState<Ingredient[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [editingItem, setEditingItem] = useState<Ingredient | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    useEffect(() => {
        const fetchFoodItems = async () => {
            const localData = localStorage.getItem("ingredients");
            const parsedData = JSON.parse(localData || '[]');
            if (parsedData && parsedData.length > 0) {
                setFoodItems(parsedData);
            } else {
                try {
                    const token = localStorage.getItem('token')
                    const response = await axios.get<Ingredient[]>('http://localhost:80/service/get_ingredients/', {
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                    })
                    localStorage.setItem("ingredients", JSON.stringify(response.data));
                    setFoodItems(response.data);
                } catch (error) {
                    console.error("食品データの取得に失敗しました:", error)
                }
            }
        }

        fetchFoodItems()
    }, [])

    const filteredItems = foodItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'all' || item.category === selectedCategory)
    )

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:80/service/delete_ingredients/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            const ingredients = JSON.parse(localStorage.getItem("ingredients") || '[]');
            const updatedIngredients = ingredients.filter((item: Ingredient) => item.id !== id);
            localStorage.setItem("ingredients", JSON.stringify(updatedIngredients));
            setFoodItems(foodItems.filter(item => item.id !== id));
        } catch (error) {
            console.error("削除に失敗しました:", error);
        }
    }

    const handleEdit = (item: Ingredient) => {
        setEditingItem(item)
        setIsEditDialogOpen(true)
    }

    const handleSave = async (updatedItem: Ingredient) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:80/service/update_ingredients/${updatedItem.id}/`, updatedItem, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            setFoodItems(foodItems.map(item => item.id === updatedItem.id ? updatedItem : item))
            setEditingItem(null)
            setIsEditDialogOpen(false)
        } catch (error) {
            console.error("更新に失敗しました:", error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="bg-orange-50/50">
                <CardHeader className="border-b border-orange-100">
                    <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                        <CardTitle className="text-orange-800">食品リスト</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                            <Input
                                type="search"
                                placeholder="食品を検索..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full md:w-[180px] border-orange-200">
                                <SelectValue placeholder="カテゴリー" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">全てのカテゴリー</SelectItem>
                                {categories.map((category) => (
                                    <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="rounded-lg border border-orange-100 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-orange-100/50 hover:bg-orange-100/50">
                                    <TableHead className="text-orange-900">名前</TableHead>
                                    <TableHead className="text-orange-900">数量</TableHead>
                                    <TableHead className="text-orange-900">消費期限</TableHead>
                                    <TableHead className="text-orange-900">カテゴリー</TableHead>
                                    <TableHead className="text-orange-900">操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.map((item) => (
                                    <TableRow key={item.id} className="hover:bg-orange-50">
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.expirationDate}</TableCell>
                                        <TableCell>{categoryMap[item.category] || item.category}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon" 
                                                            onClick={() => handleEdit(item)}
                                                            className="border-orange-200 hover:bg-orange-100 hover:text-orange-900"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-orange-50">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-orange-800">食品を編集</DialogTitle>
                                                            <DialogDescription className="text-orange-600">
                                                                食品の詳細情報を編集できます。変更後、保存ボタンを押してください。
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <EditForm item={editingItem} onSave={handleSave} />
                                                    </DialogContent>
                                                </Dialog>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button 
                                                            variant="outline" 
                                                            size="icon"
                                                            className="border-orange-200 hover:bg-orange-100 hover:text-orange-900"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-orange-50">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-orange-800">本当に削除しますか？</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-orange-700">
                                                                この操作は取り消せません。{item.name}を食品リストから削除します。
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="border-orange-200 hover:bg-orange-100">キャンセル</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={() => handleDelete(item.id)}
                                                                className="bg-orange-600 hover:bg-orange-700"
                                                            >
                                                                削除
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function EditForm({ item, onSave }: EditFormProps) {
    const [editedItem, setEditedItem] = useState<Ingredient | null>(item)

    if (!editedItem) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditedItem({ ...editedItem, [name]: value })
    }

    const handleCategoryChange = (value: string) => {
        setEditedItem({ ...editedItem, category: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editedItem) {
            onSave(editedItem)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="name" className="text-orange-800">名前</Label>
                <Input 
                    id="name" 
                    name="name" 
                    value={editedItem.name} 
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
            </div>
            <div>
                <Label htmlFor="quantity" className="text-orange-800">数量</Label>
                <Input 
                    id="quantity" 
                    name="quantity" 
                    value={editedItem.quantity} 
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
            </div>
            <div>
                <Label htmlFor="expirationDate" className="text-orange-800">消費期限</Label>
                <Input 
                    id="expirationDate" 
                    name="expirationDate" 
                    type="date" 
                    value={editedItem.expirationDate} 
                    onChange={handleChange}
                    className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
            </div>
            <div>
                <Label htmlFor="category" className="text-orange-800">カテゴリー</Label>
                <Select value={editedItem.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="border-orange-200">
                        <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button 
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
            >
                保存
            </Button>
        </form>
    )
}

