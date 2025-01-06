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
import { useState } from "react"
import { Link } from "react-router-dom"

export function SuggestionSpan() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <span
                    className="cursor-pointer text-gray-600 hover:text-gray-900"
                    onClick={() => setIsOpen(true)}
                >
                    料理提案
                </span>
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

