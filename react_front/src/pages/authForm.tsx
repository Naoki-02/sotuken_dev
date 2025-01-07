"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import axios from "axios"
import { KeyRound, Loader2, Mail, User, UserPlus, UserRound } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../services/AuthContext"

interface FormData {
    name: string
    email: string
    password1: string
    password2: string
}

export default function AuthForm() {
    const [activeTab, setActiveTab] = useState("login")
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password1: '',
        password2: '',
    })

    const { login } = useAuth()
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (activeTab === "login") {
                const response = await axios.post('http://localhost:80/api/auth/login/', {
                    username: formData.name,
                    password: formData.password1
                })
                login(response.data.key)
                toast({
                    title: "ログイン成功",
                    description: "ようこそ！",
                })
                navigate('/')
            } else {
                if (formData.password1 !== formData.password2) {
                    toast({
                        variant: "destructive",
                        title: "エラー",
                        description: "パスワードが一致しません。",
                    })
                    return
                }
                
                await axios.post('http://localhost:80/api/auth/registration/', {
                    username: formData.name,
                    email: formData.email,
                    password1: formData.password1,
                    password2: formData.password2,
                })
                toast({
                    title: "アカウント作成成功",
                    description: "ログインしてサービスをご利用ください。",
                })
                navigate('/auth')
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({
                    variant: "destructive",
                    title: "エラー",
                    description: error.response?.data?.detail || "認証に失敗しました。",
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 min-h-screen flex flex-col items-center justify-start pt-16 bg-gradient-to-b from-orange-50/50">
            <Card className="w-full max-w-md border-orange-100 mt-8">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center gap-2">
                            <UserRound className="h-6 w-6 text-orange-600" />
                            <CardTitle className="text-2xl text-orange-800">アカウント</CardTitle>
                        </div>
                        <CardDescription className="text-orange-600">
                            ログインまたは新規アカウントを作成してください
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-4">
                                <TabsTrigger 
                                    value="login"
                                    className={cn(
                                        "data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                                    )}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    ログイン
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="signup"
                                    className={cn(
                                        "data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                                    )}
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    サインアップ
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-orange-800">ユーザー名</Label>
                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password1" className="text-orange-800">パスワード</Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                                        <Input
                                            id="password1"
                                            type="password"
                                            value={formData.password1}
                                            onChange={handleChange}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="signup" className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-orange-800">ユーザー名</Label>
                                    <div className="relative">
                                        <UserRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-orange-800">メールアドレス</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password1" className="text-orange-800">パスワード</Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                                        <Input
                                            id="password1"
                                            type="password"
                                            value={formData.password1}
                                            onChange={handleChange}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password2" className="text-orange-800">パスワード（確認）</Label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
                                        <Input
                                            id="password2"
                                            type="password"
                                            value={formData.password2}
                                            onChange={handleChange}
                                            className="pl-10 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            type="submit" 
                            className="w-full bg-orange-600 hover:bg-orange-700"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {activeTab === "login" ? "ログイン" : "アカウント作成"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

