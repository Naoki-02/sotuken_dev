'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
    const timer = setTimeout(() => setProgress(100), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">レシート送信完了</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-center text-lg font-medium">
            レシートの処理が完了しました
          </p>
          <Progress value={progress} className="w-full" />
          <p className="text-center text-sm text-muted-foreground">
            食品リストに商品が追加されました
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={onViewFoodList}>
            <List className="mr-2 h-4 w-4" />
            食品リストを確認
          </Button>
          <Button variant="outline" className="w-full" onClick={onCaptureAnother}>
            <RotateCcw className="mr-2 h-4 w-4" />
            別のレシートを撮影
          </Button>
          <Button variant="link" className="w-full" onClick={onAddManually}>
            <PlusCircle className="mr-2 h-4 w-4" />
            手動で食品を追加
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}