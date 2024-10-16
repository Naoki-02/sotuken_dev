"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function AuthForm() {
    const [activeTab, setActiveTab] = useState("login")

    return (
        <Card className="w-full max-w-md mx-auto">
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
                                <Label htmlFor="login-email">メールアドレス</Label>
                                <Input id="login-email" type="email" placeholder="your@email.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">パスワード</Label>
                                <Input id="login-password" type="password" required />
                            </div>
                        </form>
                    </TabsContent>
                    <TabsContent value="signup">
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-name">名前</Label>
                                <Input id="signup-name" type="text" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">メールアドレス</Label>
                                <Input id="signup-email" type="email" placeholder="your@email.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">パスワード</Label>
                                <Input id="signup-password" type="password" required />
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter>
                <Button className="w-full">{activeTab === "login" ? "ログイン" : "アカウント作成"}</Button>
            </CardFooter>
        </Card>
    )
}