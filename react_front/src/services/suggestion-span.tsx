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
                    className="cursor-pointer text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors"
                    onClick={() => setIsOpen(true)}
                >
                    料理提案
                </span>
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

