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
            <DialogContent className="sm:max-w-[425px] rounded-xl shadow-lg border-0 bg-white dark:bg-gray-800">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <div className="py-4">
                    {children}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            {cancelText}
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" variant="default" onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

