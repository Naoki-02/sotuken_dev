'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface FoodItem {
    id: number
    name: string
    quantity: number
    expirationDate: string
    category: string
}

const initialFoodItems: FoodItem[] = [
    { id: 1, name: "りんご", quantity: 3, expirationDate: "2023-06-15", category: "果物" },
    { id: 2, name: "牛乳", quantity: 1, expirationDate: "2023-06-10", category: "乳製品" },
    { id: 3, name: "パン", quantity: 2, expirationDate: "2023-06-08", category: "穀物" },
    { id: 4, name: "卵", quantity: 6, expirationDate: "2023-06-20", category: "タンパク質" },
    { id: 5, name: "トマト", quantity: 4, expirationDate: "2023-06-12", category: "野菜" },
]

const categories = ["果物", "野菜", "乳製品", "穀物", "タンパク質", "調味料", "その他"]

export default function FoodListScreen() {
    const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems)
    const [searchTerm, setSearchTerm] = useState('')
    const [editingItem, setEditingItem] = useState<FoodItem | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const filteredItems = foodItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === 'all' || item.category === selectedCategory)
    )

    const handleDelete = (id: number) => {
        setFoodItems(foodItems.filter(item => item.id !== id))
    }

    const handleEdit = (item: FoodItem) => {
        setEditingItem(item)
    }

    const handleSave = (updatedItem: FoodItem) => {
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
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
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
                                    <TableCell>{item.category}</TableCell>
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
    item: FoodItem | null
    onSave: (item: FoodItem) => void
}

function EditForm({ item, onSave }: EditFormProps) {
    const [editedItem, setEditedItem] = useState<FoodItem | null>(item)

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
                <Input id="quantity" name="quantity" type="number" value={editedItem.quantity} onChange={handleChange} />
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
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button type="submit">保存</Button>
        </form>
    )
}