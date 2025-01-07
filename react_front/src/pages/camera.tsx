'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { saveToLocalStorage } from '@/services/SaveLocalStorage'
import axios from 'axios'
import { Camera, ImageIcon, Receipt, RotateCcw, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReceiptSubmissionCompletePage from './CameraSuccessPage'

interface Ingredient {
    id: number
    name: string
    quantity: string
    expirationDate: string
    category: string
}

export default function ReceiptCaptureScreen() {
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [isCameraReady, setIsCameraReady] = useState(false)
    const [isCameraMode, setIsCameraMode] = useState(false)
    const [isSubmissionComplete, setIsSubmissionComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const navigate = useNavigate()

    const startCamera = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
            })
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                streamRef.current = stream
                setIsCameraReady(true)
            }
        } catch (err) {
            console.error("Error accessing the camera", err)
            setIsCameraReady(false)
        }
    }, [])

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        setIsCameraReady(false)
    }, [])

    useEffect(() => {
        if (isCameraMode) {
            startCamera()
        } else {
            stopCamera()
        }

        return () => {
            stopCamera()
        }
    }, [isCameraMode, startCamera, stopCamera])

    const captureImage = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d')
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth
                canvasRef.current.height = videoRef.current.videoHeight
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
                const imageDataUrl = canvasRef.current.toDataURL('image/jpeg')
                setCapturedImage(imageDataUrl)
                stopCamera()
            }
        }
    }, [stopCamera])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setCapturedImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const retakePhoto = useCallback(() => {
        setCapturedImage(null)
        if (isCameraMode) {
            startCamera()
        }
    }, [isCameraMode, startCamera])

    const uploadImage = useCallback(async () => {
        if (capturedImage) {
            try {
                setIsLoading(true)
                const token = localStorage.getItem('token')
                const base64Data = capturedImage.split(',')[1]
                const binaryData = atob(base64Data)
                const arrayBuffer = new Uint8Array(binaryData.length)
                for (let i = 0; i < binaryData.length; i++) {
                    arrayBuffer[i] = binaryData.charCodeAt(i)
                }
                const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })

                const formData = new FormData()
                formData.append('image', blob, 'receipt.jpg')

                await axios.post('http://localhost:80/service/ocr/', formData, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })

                const ingredientsResponse = await axios.get<Ingredient[]>('http://localhost:80/service/get_ingredients/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
                
                saveToLocalStorage("ingredients", ingredientsResponse.data)

                const recipesResponse = await axios.get('http://localhost:80/service/get_recipes/', {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                })
                
                saveToLocalStorage("recipes", recipesResponse.data.recipes)
                setIsSubmissionComplete(true)
            } catch (err) {
                console.error('Error uploading image:', err)
            } finally {
                setIsLoading(false)
            }
        }
    }, [capturedImage])

    if (isSubmissionComplete) {
        return (
            <ReceiptSubmissionCompletePage
                onViewFoodList={() => navigate('/food-list')}
                onCaptureAnother={() => {
                    setIsSubmissionComplete(false)
                    setCapturedImage(null)
                    setIsCameraMode(false)
                }}
                onAddManually={() => navigate('/multi-ingredient-form')}
            />
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card className="bg-orange-50/50 border-orange-100">
                <CardHeader className="border-b border-orange-100">
                    <div className="flex items-center gap-2">
                        <Receipt className="h-6 w-6 text-orange-600" />
                        <CardTitle className="text-orange-800">レシート撮影/アップロード</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {!capturedImage && (
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                            <Button 
                                onClick={() => setIsCameraMode(true)} 
                                variant={isCameraMode ? "default" : "outline"}
                                className={cn(
                                    "w-full sm:w-auto border-orange-200",
                                    isCameraMode && "bg-orange-600 hover:bg-orange-700"
                                )}
                            >
                                <Camera className="mr-2 h-5 w-5" />
                                カメラで撮影
                            </Button>
                            <Button 
                                onClick={() => setIsCameraMode(false)} 
                                variant={!isCameraMode ? "default" : "outline"}
                                className={cn(
                                    "w-full sm:w-auto border-orange-200",
                                    !isCameraMode && "bg-orange-600 hover:bg-orange-700"
                                )}
                            >
                                <ImageIcon className="mr-2 h-5 w-5" />
                                画像をアップロード
                            </Button>
                        </div>
                    )}
                    <div className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden mb-6 shadow-inner">
                        {capturedImage ? (
                            <img 
                                src={capturedImage} 
                                alt="撮影したレシート" 
                                className="w-full h-full object-contain"
                            />
                        ) : isCameraMode ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                                onLoadedMetadata={() => videoRef.current?.play()}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full gap-4 text-orange-400">
                                <ImageIcon className="w-16 h-16" />
                                <p className="text-sm text-orange-600">
                                    レシートの画像をアップロードしてください
                                </p>
                            </div>
                        )}
                        {isCameraMode && !capturedImage && (
                            <div className="absolute inset-0 border-2 border-dashed border-orange-300 pointer-events-none" />
                        )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    {!isCameraMode && !capturedImage && (
                        <div className="space-y-2">
                            <Label 
                                htmlFor="receipt-upload" 
                                className="text-orange-800"
                            >
                                レシート画像をアップロード
                            </Label>
                            <Input
                                id="receipt-upload"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center gap-4 pb-6">
                    {capturedImage ? (
                        <>
                            <Button 
                                variant="outline" 
                                size="lg" 
                                onClick={retakePhoto}
                                className="border-orange-200 hover:bg-orange-100"
                                disabled={isLoading}
                            >
                                <RotateCcw className="mr-2 h-5 w-5" />
                                撮り直す
                            </Button>
                            <Button 
                                size="lg" 
                                onClick={uploadImage}
                                className="bg-orange-600 hover:bg-orange-700"
                                disabled={isLoading}
                            >
                                <Upload className="mr-2 h-5 w-5" />
                                {isLoading ? '送信中...' : '送信'}
                            </Button>
                        </>
                    ) : isCameraMode ? (
                        <Button
                            size="lg"
                            onClick={captureImage}
                            disabled={!isCameraReady}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            <Camera className="mr-2 h-5 w-5" />
                            撮影
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            <ImageIcon className="mr-2 h-5 w-5" />
                            画像を選択
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

