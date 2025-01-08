"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Camera, ChefHat, HelpCircle, List, MessageCircle, Receipt, ScrollText, ShoppingCart } from 'lucide-react'

const features = [
  {
    icon: <Receipt className="w-10 h-10 text-orange-600" />,
    title: "レシートの読み取り",
    description: "レシートを撮影またはアップロードして、食材を自動で登録できます。スマートフォンのカメラを使って簡単に記録できます。",
    steps: [
      "「レシート読み取り」を選択",
      "カメラで撮影または画像をアップロード",
      "自動で食材が登録されます"
    ]
  },
  {
    icon: <List className="w-10 h-10 text-orange-600" />,
    title: "食材の管理",
    description: "登録された食材の一覧を確認・管理できます。消費期限や在庫を簡単に把握できます。",
    steps: [
      "「食材一覧」で登録済みの食材を確認",
      "編集や削除も可能",
      "カテゴリー別に整理"
    ]
  },
  {
    icon: <ChefHat className="w-10 h-10 text-orange-600" />,
    title: "料理の提案",
    description: "登録された食材から作れる料理を自動で提案します。新しいレシピとの出会いも楽しめます。",
    steps: [
      "「料理提案」ボタンをタップ",
      "おすすめのレシピが表示されます",
      "気になるレシピを選んで調理開始"
    ]
  }
]

const faqs = [
  {
    question: "レシートの読み取りに対応しているスーパーを教えてください",
    answer: "主要なスーパーマーケットチェーンのレシートに対応しています。読み取れない場合は、手動での入力も可能です。"
  },
  {
    question: "料理の提案はどのような基準で行われますか？",
    answer: "登録されている食材の種類や量、消費期限などを考慮して、最適なレシピを提案します。また、ユーザーの好みや調理履歴も参考にしています。"
  },
  {
    question: "消費期限が近い食材の通知は設定できますか？",
    answer: "はい、設定画面から通知のタイミングをカスタマイズできます。デフォルトでは消費期限の3日前にお知らせします。"
  },
  {
    question: "レシピの保存は可能ですか？",
    answer: "はい、気に入ったレシピは「お気に入り」として保存できます。保存したレシピは後からマイページで確認できます。"
  }
]

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-orange-800 mb-2">
            アプリの使い方
          </h1>
          <p className="text-orange-600">
            食材管理から料理提案まで、便利な機能の使い方をご紹介します
          </p>
        </div>

        {/* 機能説明セクション */}
        <div className="grid gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-orange-50/50 border-orange-100">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-orange-800 mb-2">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-orange-600">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="pl-[72px]">
                  <div className="space-y-4">
                    {feature.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-sm font-medium text-orange-600">
                          {stepIndex + 1}
                        </div>
                        <p className="text-orange-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 使い方のヒント */}
        <Card className="mb-16 bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-orange-600" />
              <CardTitle className="text-orange-800">使い方のヒント</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-3 p-4 bg-white/80 rounded-lg border border-orange-100">
                <ShoppingCart className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-800 mb-1">買い物リストの活用</h3>
                  <p className="text-sm text-orange-600">在庫が少なくなった食材は自動で買い物リストに追加されます</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-white/80 rounded-lg border border-orange-100">
                <Camera className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-800 mb-1">レシート撮影のコツ</h3>
                  <p className="text-sm text-orange-600">明るい場所で、レシート全体が写るように撮影してください</p>
                </div>
              </div>
              {/* <div className="flex gap-3 p-4 bg-white/80 rounded-lg border border-orange-100">
                <Utensils className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-800 mb-1">レシピのカスタマイズ</h3>
                  <p className="text-sm text-orange-600">提案されたレシピは、材料や手順を自由にアレンジできます</p>
                </div>
              </div> */}
              {/* <div className="flex gap-3 p-4 bg-white/80 rounded-lg border border-orange-100">
                <MessageCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-orange-800 mb-1">コミュニティの活用</h3>
                  <p className="text-sm text-orange-600">他のユーザーのレシピやアレンジも参考にできます</p>
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* よくある質問 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-orange-800">よくある質問</h2>
          </div>
          <Separator className="bg-orange-100" />
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-orange-100">
                <AccordionTrigger className="text-orange-800 hover:text-orange-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-orange-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

