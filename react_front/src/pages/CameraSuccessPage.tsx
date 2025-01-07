'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, List, PlusCircle, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ReceiptSubmissionCompletePageProps {
  onViewFoodList: () => void
  onCaptureAnother: () => void
  onAddManually: () => void
}

export default function ReceiptSubmissionCompletePage({
  onViewFoodList,
  onCaptureAnother,
  onAddManually
}: ReceiptSubmissionCompletePageProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let currentProgress = 0
      const interval = setInterval(() => {
        if (currentProgress < 100) {
          currentProgress += 2
          if (currentProgress > 100) currentProgress = 100
          setProgress(currentProgress)
        } else {
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="bg-orange-50/50 border-orange-100">
        <CardHeader className="border-b border-orange-100">
          <CardTitle className="text-center text-orange-800">レシート送信完了</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-100 rounded-full blur-xl opacity-50 animate-pulse" />
              <CheckCircle className="w-20 h-20 text-orange-600 relative z-10" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-lg font-medium text-orange-900">
              レシートの処理が完了しました
            </p>
            <p className="text-base text-orange-800">
              追加された材料から
              <br />
              新たな料理を考えています
            </p>
          </div>
          <div className="space-y-2">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-orange-100">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-orange-600">
              食品リストに商品が追加されました
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-6 pt-0">
          <Button 
            className="w-full bg-orange-600 hover:bg-orange-700" 
            onClick={onViewFoodList}
          >
            <List className="mr-2 h-4 w-4" />
            食品リストを確認
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-orange-200 hover:bg-orange-100 text-orange-700 hover:text-orange-800" 
            onClick={onCaptureAnother}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            別のレシートを撮影
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-orange-600 hover:text-orange-700 hover:bg-orange-100" 
            onClick={onAddManually}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            手動で食品を追加
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

