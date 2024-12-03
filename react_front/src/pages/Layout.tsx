import { useAuth } from '@/services/AuthContext'
import { Facebook, Instagram, Menu, Twitter, User, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isAuthenticated } = useAuth()

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-white bg-opacity-95 backdrop-blur mb-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold">
                                MyApp
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-4">
                            <Link to="/" className="text-gray-600 hover:text-gray-900">ホーム</Link>
                            <Link to="/food-list" className="text-gray-600 hover:text-gray-900">食材一覧</Link>
                            <Link to="/camera" className="text-gray-600 hover:text-gray-900">レシート読み取り</Link>
                            <Link to="/multi-ingredient-form" className="text-gray-600 hover:text-gray-900">食材手動追加</Link>
                            <Link to="/Survey" className="text-gray-600 hover:text-gray-900">アンケート</Link>
                            {!isAuthenticated && (
                                <>
                                    <Link to="/auth" className="text-gray-600 hover:text-gray-900">ログイン</Link>
                                </>
                            )}
                            {isAuthenticated && (
                                <>
                                    <Link to="/logout" className="text-gray-600 hover:text-gray-900">ログアウト</Link>
                                </>
                            )}
                        </nav>
                        <div className="flex items-center">
                            <button className="p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label="ユーザーアカウント">
                                <User className="h-6 w-6" />
                            </button>
                            <button
                                className="ml-2 p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:hidden"
                                onClick={toggleMenu}
                                aria-expanded={isMenuOpen}
                                aria-label="メニューを開く"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">ホーム</Link>
                            <Link to="/food-list" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">食材一覧</Link>
                            <Link to="/camera" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">レシート読み取り</Link>
                            <Link to="/multi-ingredient-form" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">食材手動追加</Link>
                            <Link to="/Survey" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">アンケート</Link>
                            {!isAuthenticated && (
                                <>
                                    <Link to="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">ログイン</Link>
                                </>
                            )}
                            {isAuthenticated && (
                                <>
                                    <Link to="/logout" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">ログアウト</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer className="bg-gray-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm text-gray-600">
                                © 2023 MyApp Inc. All rights reserved.
                            </p>
                        </div>
                        <nav className="mb-4 md:mb-0">
                            <ul className="flex space-x-4">
                                <li>
                                    <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                                        利用規約
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                                        プライバシーポリシー
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-gray-500" aria-label="Facebook">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500" aria-label="Instagram">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500" aria-label="Twitter">
                                <Twitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}