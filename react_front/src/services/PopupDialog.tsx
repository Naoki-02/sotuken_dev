import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ChefHat } from 'lucide-react'
import React from 'react'

interface PopupDialogProps {
    trigger: React.ReactNode
    title: string
    description?: string
    children: React.ReactNode
    onConfirm: () => void
    confirmText?: string
    cancelText?: string
}

export function PopupDialog({
    trigger,
    title,
    description,
    children,
    onConfirm,
    confirmText = '確認',
    cancelText = 'キャンセル'
}: PopupDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl border border-orange-100 bg-orange-50/80 backdrop-blur-sm">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-100 rounded-full">
                            <ChefHat className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl text-orange-800">
                                {title}
                            </DialogTitle>
                            {description && (
                                <DialogDescription className="text-orange-600 mt-1">
                                    {description}
                                </DialogDescription>
                            )}
                        </div>
                    </div>
                </DialogHeader>
                <div className="py-4">
                    {children}
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button 
                            type="button" 
                            variant="outline"
                            className="border-orange-200 hover:bg-orange-100 text-orange-700 hover:text-orange-800"
                        >
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button 
                            type="button" 
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={onConfirm}
                        >
                            {confirmText}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

