'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from 'axios'
import { Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Ingredient {
    id: number
    name: string
    quantity: string
    expirationDate: string
    category: string
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

// 英語から日本語へのカテゴリーのマッピング
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

    // サーバーからデータを取得するGETリクエスト
    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const token = localStorage.getItem('token') // 認証トークンの取得
                const response = await axios.get<Ingredient[]>('http://localhost:8000/service/get_ingredients/', {
                    headers: {
                        Authorization: `Token ${token}`, // トークンをヘッダーに設定
                    },
                })
                console.log("食品データの取得に成功しました:")
                
                // idがない場合に付与
                const itemsWithId = response.data.map((item, index) => ({
                    ...item,
                    id: item.id || index + 1, // idがない場合、インデックスに1を加えた値を使用
                }));

                setFoodItems(itemsWithId)
            } catch (error) {
                console.error("食品データの取得に失敗しました:", error)
            }
        }

        fetchFoodItems()
    }, [])

    const filteredItems = foodItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'all' || item.category === selectedCategory)
    )

    const handleDelete = (id: number) => {
        setFoodItems(foodItems.filter(item => item.id !== id))
    }

    const handleEdit = (item: Ingredient) => {
        setEditingItem(item)
    }

    const handleSave = (updatedItem: Ingredient) => {
        setFoodItems(foodItems.map(item => item.id === updatedItem.id ? updatedItem : item))
        setEditingItem(null)
    }

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle>食品リスト</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4 mb-4">
                        <Input
                            type="search"
                            placeholder="食品を検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px]">
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>名前</TableHead>
                                <TableHead>数量</TableHead>
                                <TableHead>消費期限</TableHead>
                                <TableHead>カテゴリー</TableHead>
                                <TableHead>操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.expirationDate}</TableCell>
                                    <TableCell>{categoryMap[item.category] || item.category}</TableCell> {/* カテゴリーの変換 */}
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>食品を編集</DialogTitle>
                                                    </DialogHeader>
                                                    <EditForm item={editingItem} onSave={handleSave} />
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

interface EditFormProps {
    item: Ingredient | null
    onSave: (item: Ingredient) => void
}

function EditForm({ item, onSave }: EditFormProps) {
    const [editedItem, setEditedItem] = useState<Ingredient | null>(item)

    if (!editedItem) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditedItem({ ...editedItem, [name]: name === 'quantity' ? parseInt(value) : value })
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
                <Label htmlFor="name">名前</Label>
                <Input id="name" name="name" value={editedItem.name} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="quantity">数量</Label>
                <Input id="quantity" name="quantity" value={editedItem.quantity} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="expirationDate">消費期限</Label>
                <Input id="expirationDate" name="expirationDate" type="date" value={editedItem.expirationDate} onChange={handleChange} />
            </div>
            <div>
                <Label htmlFor="category">カテゴリー</Label>
                <Select value={editedItem.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">保存</Button>
        </form>
    )
    
}
