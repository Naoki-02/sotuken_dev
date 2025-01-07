"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ChefHat } from 'lucide-react'
import { useState } from "react"
import { Link } from "react-router-dom"

export function SuggestionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="fixed bottom-20 right-4 rounded-full w-16 h-16 md:hidden bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg border-none outline-none focus:ring-0 focus:ring-offset-0"
          size="icon"
          aria-label="料理提案"
        >
          <ChefHat className="h-8 w-8 text-white" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg sm:rounded-xl bg-orange-50 border-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-orange-800">料理提案</AlertDialogTitle>
          <AlertDialogDescription className="text-orange-600">
            料理の提案を表示しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-md border-orange-200 text-orange-700 hover:bg-orange-100">キャンセル</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link
              to="/recipe"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-orange-600 text-white hover:bg-orange-700 h-10 px-4 py-2"
            >
              表示する
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

