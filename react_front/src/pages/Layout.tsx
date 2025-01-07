import { Toaster } from '@/components/ui/toaster'
import { useAuth } from '@/services/AuthContext'
import { MobileNav } from '@/services/mobile-nav'
import { SuggestionButton } from '@/services/suggestion-button'
import { SuggestionSpan } from '@/services/suggestion-span'
import { Facebook, Instagram, Menu, Twitter, X } from 'lucide-react'
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
            <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100/80 backdrop-blur mb-8">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-xl font-bold text-orange-800">
                                MyApp
                            </Link>
                        </div>
                        <nav className="hidden md:flex space-x-4">
                            <Link to="/" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">ホーム</Link>
                            <Link to="/food-list" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">食材一覧</Link>
                            <Link to="/camera" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">レシート読み取り</Link>
                            <Link to="/multi-ingredient-form" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">食材手動追加</Link>
                            <Link to="/Survey" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">アンケート</Link>
                            <Link to="/history" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">履歴</Link>
                            <SuggestionSpan />
                            {!isAuthenticated && (
                                <Link to="/auth" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">ログイン</Link>
                            )}
                            {isAuthenticated && (
                                <Link to="/logout" className="text-orange-700 hover:text-orange-900 hover:bg-orange-100/50 px-3 py-2 rounded-md transition-colors">ログアウト</Link>
                            )}
                        </nav>
                        <div className="flex items-center md:hidden">
                            <button
                                className="p-2 rounded-md text-orange-600 hover:text-orange-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
                    <div className="md:hidden bg-white/95">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50">ホーム</Link>
                            <Link to="/food-list" className="block px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50">食材一覧</Link>
                            <Link to="/camera" className="block px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50">レシート読み取り</Link>
                            <Link to="/multi-ingredient-form" className="block px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50">食材手動追加</Link>
                            <Link to="/Survey" className="block px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50">アンケート</Link>
                            <Link to="/history" className="block px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50">履歴</Link>
                            <Link to="/recipe-suggestion" className="block px-3 py-2 rounded-md text-base font-medium text-orange-700 hover:text-orange-900 hover:bg-orange-50">料理提案</Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1 mb-16 md:mb-0">
                {children}
                <Toaster />
            </main>

            <SuggestionButton />

            <MobileNav />

            <footer className="bg-orange-50 hidden md:block border-t border-orange-100">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm text-orange-700">
                                © 2024 MyApp Inc. All rights reserved.
                            </p>
                        </div>
                        <nav className="mb-4 md:mb-0">
                            <ul className="flex space-x-4">
                                <li>
                                    <Link to="/terms" className="text-sm text-orange-700 hover:text-orange-900">
                                        利用規約
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-sm text-orange-700 hover:text-orange-900">
                                        プライバシーポリシー
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                        <div className="flex space-x-4">
                            <a href="#" className="text-orange-400 hover:text-orange-500" aria-label="Facebook">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-orange-400 hover:text-orange-500" aria-label="Instagram">
                                <Instagram className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-orange-400 hover:text-orange-500" aria-label="Twitter">
                                <Twitter className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

