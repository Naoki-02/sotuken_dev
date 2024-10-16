"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"; // useNavigateをインポート
import { useAuth } from "../services/AuthContext"; // useAuthをインポート

export default function AuthForm() {
    const [activeTab, setActiveTab] = useState("login")
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password1: '',
        password2: '',
    });

    const { login } = useAuth();  // useAuthフックを使用

    const navigate = useNavigate();

    // フォームの入力値を管理
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // フォームの送信処理
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (activeTab === "login") {
                // ログイン用のAPIリクエスト
                const response = await axios.post('http://localhost:8000/api/auth/login/', {
                    username: formData.name,
                    password: formData.password1
                });
                // console.log(formData.name, formData.password1);
                // console.log(response.data);  // レスポンスの確認
                console.log('login post request success');
                // ログイン成功後の処理を追加（例：トークンの保存など）
                // トークンをlocalStorageに保存する
                login(response.data.key);
                navigate('/');  // リダイレクト
            } else {
                // サインアップ用のAPIリクエスト
                const response = await axios.post('http://localhost:8000/api/auth/registration/', {
                    username: formData.name,
                    email: formData.email,
                    password1: formData.password1,
                    password2: formData.password2,
                });
                console.log(response.data);  // レスポンスの確認
                console.log('signup post request success');
                // サインアップ成功後の処理を追加（例：ログインページにリダイレクトなど）
                navigate('/auth');  // リダイレクト
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.response?.data || error.message);  // エラーの確認
            } else {
                console.error('An unknown error occurred');  // その他のエラー処理
            }
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>アカウント</CardTitle>
                    <CardDescription>ログインまたは新規アカウントを作成してください。</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">ログイン</TabsTrigger>
                            <TabsTrigger value="signup">サインアップ</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">名前</Label>
                                    <Input id="name" type="text" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">パスワード</Label>
                                    <Input id="password1" type="password" value={formData.password1} onChange={handleChange} required />
                                </div>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="signup-name">名前</Label>
                                    <Input id="name" type="text" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email">メールアドレス</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">パスワード</Label>
                                    <Input id="password1" type="password" value={formData.password1} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password">もう一度入力</Label>
                                    <Input id="password2" type="password" value={formData.password2} onChange={handleChange} required />
                                </div>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">{activeTab === "login" ? "ログイン" : "アカウント作成"}</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
