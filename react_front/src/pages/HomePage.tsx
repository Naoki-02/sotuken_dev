"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Camera, ChefHat, HelpCircle, List, MessageCircle, Receipt, Recycle, ScrollText, ShoppingCart, Soup } from 'lucide-react'

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
    description: "登録された食材から作れる料理を自動で提案します。4つの提案方法から選べます。",
    subFeatures: [
      {
        icon: <Calendar className="w-6 h-6 text-orange-600" />,
        title: "一日献立提案",
        description: "朝食・昼食・夕食の一日分の献立を提案します。栄養バランスを考慮した組み合わせをご紹介します。"
      },
      {
        icon: <Recycle className="w-6 h-6 text-orange-600" />,
        title: "リメイク料理提案",
        description: "残った料理や食材をアレンジした新しいレシピを提案します。食材を無駄なく使い切れます。"
      },
      {
        icon: <Soup className="w-6 h-6 text-orange-600" />,
        title: "今ある食材から提案",
        description: "現在の食材から作れる料理を提案します。足りない食材があれば代替案も提示します。"
      }
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
    answer: "登録されている食材の種類や量、消費期限などを考慮して、最適なレシピを提案します。"
  },
  {
    question: "レシピの保存は可能ですか？",
    answer: "調理済みの料理は履歴として保存されます"
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
                  {feature.steps ? (
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
                  ) : feature.subFeatures ? (
                    <div className="grid gap-4">
                      {feature.subFeatures.map((subFeature, subIndex) => (
                        <div key={subIndex} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-orange-100">
                          <div className="mt-1">
                            {subFeature.icon}
                          </div>
                          <div>
                            <h3 className="font-medium text-orange-800 mb-1">{subFeature.title}</h3>
                            <p className="text-sm text-orange-600">{subFeature.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
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
            </div>
          </CardContent>
        </Card>

        {/* よくある質問 */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-semibold text-orange-800">Q&A</h2>
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

