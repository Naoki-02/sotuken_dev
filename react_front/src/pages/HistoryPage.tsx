"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import axios from 'axios'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Calendar, ChefHat, Clock, Filter, Search, Utensils } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CookingHistoryItem {
  id: string
  recipeName: string
  cookingDate: Date
  ingredients: string[]
}

export default function CookingHistoryPage() {
  const [history, setHistory] = useState<CookingHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMonth, setFilterMonth] = useState<string>('all')
  
  useEffect(() => {
    // 実際のアプリケーションでは、ここでAPIからデータを取得します
    const fetchHistory = async () => {
      setIsLoading(true)
      try{
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:80/service/get_cook_history/',{
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        console.log(response.data)
        const fetchHistory = response.data.history.map((item: any) => ({
          id: item.id,
          recipeName: item.recipe.name,
          cookingDate: new Date(item.cooked_at),
          ingredients: item.recipe.ingredients,
        }))
        console.log(fetchHistory)
        setHistory(fetchHistory)
      } catch (error) {
        console.error('エラー:', error)
      }finally{
        setIsLoading(false)
      }
    }
    fetchHistory()

      // // モックデータを使用
      // const mockHistory: CookingHistoryItem[] = [
      //   {
      //     id: '1',
      //     recipeName: '鶏肉のトマト煮込み',
      //     cookingDate: new Date(2024, 0, 15),
      //     ingredients: ['鶏もも肉', 'トマト', 'たまねぎ', 'にんにく']
      //   },
      //   {
      //     id: '2',
      //     recipeName: '野菜たっぷりミネストローネ',
      //     cookingDate: new Date(2024, 0, 10),
      //     ingredients: ['キャベツ', 'にんじん', 'セロリ', 'トマト缶']
      //   },
      //   {
      //     id: '3',
      //     recipeName: 'サーモンのムニエル',
      //     cookingDate: new Date(2023, 11, 28),
      //     ingredients: ['サーモン', 'レモン', 'バター', 'パセリ']
      //   },
      //   // 他の履歴アイテムを追加...
      // ]
  }, [])

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesMonth = filterMonth === 'all' || 
                         format(item.cookingDate, 'yyyy-MM') === filterMonth
    return matchesSearch && matchesMonth
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-orange-50/50 border-orange-100">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-2xl text-orange-800">調理済み履歴</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
              <Input
                type="search"
                placeholder="レシピや材料を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            <div className="flex-shrink-0">
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-full md:w-[180px] border-orange-200">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-orange-500" />
                    <SelectValue placeholder="月で絞り込み" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての月</SelectItem>
                  <SelectItem value="2024-01">2024年1月</SelectItem>
                  <SelectItem value="2023-12">2023年12月</SelectItem>
                  {/* 他の月のオプションを追加 */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="bg-white border-orange-100">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-grow">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card key={item.id} className="bg-white border-orange-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 rounded-full p-3">
                        <ChefHat className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-orange-800 mb-1">{item.recipeName}</h3>
                        <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(item.cookingDate, 'yyyy年MM月dd日', { locale: ja })}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{format(item.cookingDate, 'HH:mm')}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.ingredients.map((ingredient, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <p className="text-orange-800 font-medium">調理履歴がありません</p>
              <p className="text-orange-600 mt-2">新しいレシピを試してみましょう！</p>
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                レシピを探す
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

