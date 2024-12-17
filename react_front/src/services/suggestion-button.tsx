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
          className="fixed bottom-20 right-4 rounded-full shadow-lg w-16 h-16 md:hidden"
          size="icon"
          aria-label="料理提案"
        >
          <ChefHat className="h-8 w-8" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg sm:rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>料理提案</AlertDialogTitle>
          <AlertDialogDescription>
            料理の提案を表示しますか？
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-md">キャンセル</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link
              to="/recipe"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              表示する
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

