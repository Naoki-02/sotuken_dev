'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { Camera, ImageIcon, RotateCcw, Upload } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReceiptSubmissionCompletePage from './CameraSuccessPage'

export default function ReceiptCaptureScreen() {
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [isCameraReady, setIsCameraReady] = useState(false)
    const [isCameraMode, setIsCameraMode] = useState(false)
    const [isSubmissionComplete, setIsSubmissionComplete] = useState(false)
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
        }
        else {
            stopCamera()
        }

        // cleanup
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
            }
        }
    }, [])

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
                const token = localStorage.getItem('token')
                // Base64データURLをBlobに変換
                const base64Data = capturedImage.split(',')[1]
                const binaryData = atob(base64Data)
                const arrayBuffer = new Uint8Array(binaryData.length)
                for (let i = 0; i < binaryData.length; i++) {
                    arrayBuffer[i] = binaryData.charCodeAt(i)
                }
                const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })

                // FormDataに画像を追加
                const formData = new FormData()
                formData.append('image', blob, 'receipt.jpg')

                // POSTリクエストでアップロード
                const response = await axios.post('http://localhost:8000/service/ocr/', formData, {
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                })

                console.log('Upload successful:', response.data)

                // 送信完了画面に遷移
                setIsSubmissionComplete(true)

            } catch (err) {
                console.error('Error uploading image:', err)
            }
        } else {
            console.error('No image captured to upload')
        }
    }, [capturedImage])

    const handleViewFoodList = () => {
        // 食材一覧ページに遷移
        navigate('/food-list')
    }

    const handleCaptureAnother = () => {
        // 別のレシートを撮影する
        setIsSubmissionComplete(false)
        setCapturedImage(null)
        setIsCameraMode(false)
    }

    const handleAddManually = () => {
        // 手動追加ページに遷移
        navigate('/multi-ingredient-form')
    }

    //レシート送信完了ページ関数呼び出し
    if (isSubmissionComplete) {
        return (
            <ReceiptSubmissionCompletePage
                onViewFoodList={handleViewFoodList}
                onCaptureAnother={handleCaptureAnother}
                onAddManually={handleAddManually}
            />
        )
    }


    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4 text-center">レシート撮影/アップロード</h2>
                    {!capturedImage && (
                        <div className="flex justify-center space-x-4 mb-4">
                            <Button onClick={() => setIsCameraMode(true)} variant={isCameraMode ? "default" : "outline"}>
                                <Camera className="mr-2 h-5 w-5" />
                                カメラで撮影
                            </Button>
                            <Button onClick={() => setIsCameraMode(false)} variant={!isCameraMode ? "default" : "outline"}>
                                <ImageIcon className="mr-2 h-5 w-5" />
                                画像をアップロード
                            </Button>
                        </div>
                    )}
                    <div className="aspect-video bg-muted relative overflow-hidden rounded-lg mb-4">
                        {capturedImage ? (
                            <img src={capturedImage} alt="Captured receipt" className="w-full h-full object-contain" />
                        ) : isCameraMode ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                                onLoadedMetadata={() => videoRef.current?.play()}
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full">
                                <ImageIcon className="w-16 h-16 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                    {!isCameraMode && !capturedImage && (
                        <div className="mb-4">
                            <Label htmlFor="receipt-upload" className="block mb-2">レシート画像をアップロード</Label>
                            <Input
                                id="receipt-upload"
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                            />
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground text-center mb-4">
                        {capturedImage
                            ? "レシートの画像を確認してください"
                            : isCameraMode
                                ? "レシートを枠内に収めて撮影してください"
                                : "レシートの画像をアップロードしてください"}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4 pb-6">
                    {capturedImage ? (
                        <>
                            <Button variant="outline" size="lg" onClick={retakePhoto}>
                                <RotateCcw className="mr-2 h-5 w-5" />
                                撮り直す
                            </Button>
                            <Button size="lg" onClick={uploadImage}>
                                <Upload className="mr-2 h-5 w-5" />
                                送信
                            </Button>
                        </>
                    ) : isCameraMode ? (
                        <Button
                            size="lg"
                            onClick={captureImage}
                            disabled={!isCameraReady}
                        >
                            <Camera className="mr-2 h-5 w-5" />
                            撮影
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            onClick={() => fileInputRef.current?.click()}
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